import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    email: string;
    fullName?: string;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    login: (email: string, fullName?: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if user is logged in on mount
        const storedEmail = localStorage.getItem('userEmail');
        const storedName = localStorage.getItem('userName');
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';

        if (loggedIn && storedEmail) {
            setUser({ email: storedEmail, fullName: storedName || undefined });
            setIsLoggedIn(true);
        }
    }, []);

    const login = (email: string, fullName?: string) => {
        const newUser = { email, fullName };
        setUser(newUser);
        setIsLoggedIn(true);
        localStorage.setItem('userEmail', email);
        if (fullName) {
            localStorage.setItem('userName', fullName);
        }
        localStorage.setItem('isLoggedIn', 'true');
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('isLoggedIn');
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
