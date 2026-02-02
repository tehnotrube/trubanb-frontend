import {createContext} from 'react';

export interface User {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: 'guest' | 'host';
    address?: string;
}

export interface IAuthContext {
    isAuthenticated: boolean;
    isLoading: boolean;
    role: 'guest' | 'host';
    user: User | null;
    setUser?: (user: User | null) => void;
    setAuthenticated?: (authenticated: boolean) => void;
    setRole?: (role: 'guest' | 'host') => void;
}

export const AuthContext = createContext<IAuthContext>({
    isAuthenticated: false,
    isLoading: true,
    role: 'guest',
    user: null,
    setUser: undefined,
    setAuthenticated: undefined,
    setRole: undefined
});
