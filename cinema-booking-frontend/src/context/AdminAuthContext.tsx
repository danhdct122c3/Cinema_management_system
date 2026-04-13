import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { AuthenticationResult } from '../types';
import { adminAuthService, adminTokenStorage } from '../services/adminApi';

const parseJwtPayload = (token: string): Record<string, any> | null => {
    try {
        const payload = token.split('.')[1];
        if (!payload) return null;
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
        return JSON.parse(atob(padded));
    } catch {
        return null;
    }
};

const extractRolesFromToken = (token: string): string[] => {
    const payload = parseJwtPayload(token);
    if (!payload) return [];

    const candidates = [payload.roles, payload.role, payload.authorities, payload.scope];
    const normalized = candidates.flatMap((candidate) => {
        if (Array.isArray(candidate)) return candidate;
        if (typeof candidate === 'string') return candidate.split(/[\s,]+/);
        return [];
    });

    return normalized
        .map((r) => String(r || '').trim())
        .filter(Boolean);
};

const hasAdminRole = (token: string): boolean => {
    const roles = extractRolesFromToken(token);
    return roles.includes('ROLE_ADMIN') || roles.includes('ADMIN');
};

interface AdminAuthContextType {
    isAdminLoggedIn: boolean;
    adminAccessToken: string | null;
    isAdminInitialized: boolean;
    adminEmail: string | null;
    loginAdmin: (email: string, password: string) => Promise<AuthenticationResult>;
    logoutAdmin: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [adminAccessToken, setAdminAccessToken] = useState<string | null>(null);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [isAdminInitialized, setIsAdminInitialized] = useState(false);
    const [adminEmail, setAdminEmail] = useState<string | null>(null);

    useEffect(() => {
        const token = adminTokenStorage.get();
        const email = localStorage.getItem('adminEmail');
        if (token && hasAdminRole(token)) {
            setAdminAccessToken(token);
            setIsAdminLoggedIn(true);
            if (email) {
                setAdminEmail(email);
            }
        } else if (token) {
            adminTokenStorage.clear();
            localStorage.removeItem('adminEmail');
        }
        setIsAdminInitialized(true);
    }, []);

    const loginAdmin = async (email: string, password: string) => {
        const res = await adminAuthService.login({ email, password });
        const result = res.data.result;

        if (!result?.token || !hasAdminRole(result.token)) {
            adminTokenStorage.clear();
            localStorage.removeItem('adminEmail');
            setAdminAccessToken(null);
            setIsAdminLoggedIn(false);
            setAdminEmail(null);
            throw new Error('Tài khoản không có quyền truy cập trang quản trị.');
        }

        adminTokenStorage.set(result.token);
        setAdminAccessToken(result.token);
        setIsAdminLoggedIn(!!result.isAuthenticated);
        setAdminEmail(email);
        localStorage.setItem('adminEmail', email);

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
            setAdminEmail(null);
            localStorage.removeItem('adminEmail');
            setAdminAccessToken(null);
            setIsAdminLoggedIn(false);
        }
    };

    const value = useMemo(
        () => ({ isAdminLoggedIn, adminAccessToken, isAdminInitialized, adminEmail, loginAdmin, logoutAdmin }),
        [isAdminLoggedIn, adminAccessToken, isAdminInitialized, adminEmail]
    );

    return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
    const ctx = useContext(AdminAuthContext);
    if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
    return ctx;
};
