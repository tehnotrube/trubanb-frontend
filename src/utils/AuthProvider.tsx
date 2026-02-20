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
    const isRefreshingRef = useRef(false); // ADDED: Prevent multiple simultaneous refresh attempts

    // Function to refresh the token
    const refreshToken = useCallback(async () => {
        // Prevent multiple simultaneous refresh attempts
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

            const res = await axios.post(`${environment}/api/auth/refresh`, {
                refreshToken: refresh
            });

            if (res.status === 200 && res.data.accessToken) {
                localStorage.setItem('accessToken', res.data.accessToken);

                // If a new refresh token is provided, update it
                if (res.data.refreshToken) {
                    localStorage.setItem('refreshToken', res.data.refreshToken);
                }

                console.log('Token refreshed successfully');
                return true;
            }

            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            // Clear tokens and logout
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

    // Setup axios interceptor to handle 401 errors
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                console.log('Axios interceptor caught error:', error.response?.status);

                // If error is 401 and we haven't tried to refresh yet
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    console.log('Attempting to refresh token due to 401...');
                    const refreshed = await refreshToken();

                    if (refreshed) {
                        // Retry the original request with new token
                        const token = localStorage.getItem('accessToken');
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        console.log('Retrying original request with new token');
                        return axios(originalRequest);
                    } else {
                        console.log('Token refresh failed, redirecting to login');
                        // Redirect to login page or show auth error
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

    // Schedule automatic token refresh before it expires
    const scheduleTokenRefresh = useCallback(() => {
        // Clear any existing timer
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
        }

        // Refresh token 5 minutes before it expires
        // Adjust this based on your token expiration time
        // For example, if token expires in 15 minutes, refresh after 10 minutes
        const refreshInterval = 10 * 60 * 1000; // 10 minutes

        refreshTimerRef.current = setTimeout(async () => {
            console.log('Scheduled token refresh triggered');
            const refreshed = await refreshToken();

            if (refreshed) {
                // Schedule next refresh
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

                // Schedule token refresh
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

        // Cleanup timer on unmount
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