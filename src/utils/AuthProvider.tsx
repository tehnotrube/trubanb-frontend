import {type ReactNode, useEffect, useState} from "react";
import {AuthContext, type User} from "./AuthContext.tsx";
import axios from "axios";
import {environment} from "./Environment.tsx";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children } ) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState<'guest'|'host'>('guest');
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('accessToken');
            
            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                setIsLoading(false);
                return;
            }
            
            try {
                const res = await axios.get(`${environment}/api/users/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (res.status === 200) {
                    setIsAuthenticated(true);
                    setUser(res.data);
                    setRole(res.data.role || 'guest');
                }
            } catch  {
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            } finally {
                setIsLoading(false);
            }
        };
        
        checkAuth();
    }, []);


    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, role, user, setUser, setAuthenticated: setIsAuthenticated, setRole }}>
            {children}
        </AuthContext.Provider>
    );
};