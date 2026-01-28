import {createContext} from 'react';

export const AuthContext = createContext({
    isAuthenticated: false,
    isLoading: true,
    role: 'guest'
});
