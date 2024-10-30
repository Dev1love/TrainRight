'use client';

import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../services/api';

interface AuthContextData {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    clearError: () => void;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('@TrainRight:token');
            if (token) {
                try {
                    const response = await api.get('/api/auth/verify');
                    setUser(response.data.user);
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                } catch (error) {
                    localStorage.removeItem('@TrainRight:token');
                    router.push('/login');
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, [router]);

    const login = useCallback(async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.post('/api/auth/login', { email, password });
            
            if (response.data.token) {
                localStorage.setItem('@TrainRight:token', response.data.token);
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                setUser(response.data.user);

                switch (response.data.user.role) {
                    case 'trainer':
                        router.push('/dashboard/trainer');
                        break;
                    case 'client':
                        router.push('/dashboard/client');
                        break;
                    case 'admin':
                        router.push('/dashboard/admin');
                        break;
                    default:
                        router.push('/dashboard');
                }
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    }, [router]);

    const logout = useCallback(() => {
        localStorage.removeItem('@TrainRight:token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        router.push('/login');
    }, [router]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            error,
            login, 
            logout,
            clearError 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 