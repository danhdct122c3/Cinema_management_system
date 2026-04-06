import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { AuthenticationResult } from '../types';
import { adminAuthService, adminTokenStorage } from '../services/adminApi';

interface AdminAuthContextType {
    isAdminLoggedIn: boolean;
    adminAccessToken: string | null;
    isAdminInitialized: boolean;
    loginAdmin: (email: string, password: string) => Promise<AuthenticationResult>;
    logoutAdmin: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [adminAccessToken, setAdminAccessToken] = useState<string | null>(null);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [isAdminInitialized, setIsAdminInitialized] = useState(false);

    useEffect(() => {
        const token = adminTokenStorage.get();
        if (token) {
            setAdminAccessToken(token);
            setIsAdminLoggedIn(true);
        }
        setIsAdminInitialized(true);
    }, []);

    const loginAdmin = async (email: string, password: string) => {
        const res = await adminAuthService.login({ email, password });
        const result = res.data.result;

        adminTokenStorage.set(result.token);
        setAdminAccessToken(result.token);
        setIsAdminLoggedIn(!!result.isAuthenticated);

        return result;
    };

    const logoutAdmin = async () => {
        const token = adminTokenStorage.get();
        try {
            await adminAuthService.logout(token ? { token } : undefined);
        } catch {
            // ignore
        } finally {
            adminTokenStorage.clear();
            setAdminAccessToken(null);
            setIsAdminLoggedIn(false);
        }
    };

    const value = useMemo(
        () => ({ isAdminLoggedIn, adminAccessToken, isAdminInitialized, loginAdmin, logoutAdmin }),
        [isAdminLoggedIn, adminAccessToken, isAdminInitialized]
    );

    return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
    const ctx = useContext(AdminAuthContext);
    if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
    return ctx;
};
