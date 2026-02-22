import {type ReactNode, useEffect, useState, useCallback, useRef} from "react";
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
    const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isRefreshingRef = useRef(false);

    const refreshToken = useCallback(async () => {
        if (isRefreshingRef.current) {
            return false;
        }

        const refresh = localStorage.getItem('refreshToken');

        if (!refresh) {
            setIsAuthenticated(false);
            setUser(null);
            setRole('guest');
            return false;
        }

        try {
            isRefreshingRef.current = true;
            console.log('Attempting to refresh token...');

            const res = await axios.post(`${environment}/api/users/auth/refresh`, {
                refreshToken: refresh
            });

            if (res.status === 200 && res.data.accessToken) {
                localStorage.setItem('accessToken', res.data.accessToken);

                if (res.data.refreshToken) {
                    localStorage.setItem('refreshToken', res.data.refreshToken);
                }

                console.log('Token refreshed successfully');
                return true;
            }

            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setIsAuthenticated(false);
            setUser(null);
            setRole('guest');
            return false;
        } finally {
            isRefreshingRef.current = false;
        }
    }, []);

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                console.log('Axios interceptor caught error:', error.response?.status);
                const isAuthEndpoint = originalRequest.url?.includes('/api/users/auth/');

                if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
                    originalRequest._retry = true;

                    console.log('Attempting to refresh token due to 401...');
                    const refreshed = await refreshToken();

                    if (refreshed) {
                        const token = localStorage.getItem('accessToken');
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        console.log('Retrying original request with new token');
                        return axios(originalRequest);
                    } else {
                        console.log('Token refresh failed, redirecting to login');
                        window.location.href = '/sign-in';
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [refreshToken]);

    const scheduleTokenRefresh = useCallback(() => {
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
        }

        const refreshInterval = 10 * 60 * 1000;

        refreshTimerRef.current = setTimeout(async () => {
            console.log('Scheduled token refresh triggered');
            const refreshed = await refreshToken();

            if (refreshed) {
                scheduleTokenRefresh();
            }
        }, refreshInterval);
    }, [refreshToken]);

    const checkAuth = useCallback(async () => {
        setIsLoading(true);
        const token = localStorage.getItem('accessToken');

        if (!token) {
            setIsAuthenticated(false);
            setUser(null);
            setRole('guest');
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

                scheduleTokenRefresh();
            }
        } catch (error) {
            console.log('Initial auth check failed, attempting refresh:', error);
            const refreshed = await refreshToken();

            if (refreshed) {
                try {
                    const newToken = localStorage.getItem('accessToken');
                    const res = await axios.get(`${environment}/api/users/profile`, {
                        headers: {
                            'Authorization': `Bearer ${newToken}`
                        }
                    });

                    if (res.status === 200) {
                        setIsAuthenticated(true);
                        setUser(res.data);
                        setRole(res.data.role || 'guest');
                        scheduleTokenRefresh();
                    }
                } catch {
                    setIsAuthenticated(false);
                    setUser(null);
                    setRole('guest');
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
                setRole('guest');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            }
        } finally {
            setIsLoading(false);
        }
    }, [refreshToken, scheduleTokenRefresh]);

    useEffect(() => {
        checkAuth();

        return () => {
            if (refreshTimerRef.current) {
                clearTimeout(refreshTimerRef.current);
            }
        };
    }, [checkAuth]);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            isLoading,
            role,
            user,
            setUser,
            setAuthenticated: setIsAuthenticated,
            setRole
        }}>
            {children}
        </AuthContext.Provider>
    );
};