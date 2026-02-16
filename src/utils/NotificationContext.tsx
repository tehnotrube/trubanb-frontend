// contexts/NotificationContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { environment } from '../utils/Environment';
import axios from 'axios';

interface Notification {
    id: string;
    message: string;
}

interface NotificationContextType {
    showNotification: (message: string) => void;
    unreadCount: number;
    fetchUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const eventSourceRef = useRef<EventSourcePolyfill | null>(null);

    const showNotification = useCallback((message: string) => {
        const id = Date.now().toString();
        setNotifications(prev => [...prev, { id, message }]);
    }, []);

    const handleClose = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const fetchUnreadCount = useCallback(async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        try {
            const response = await axios.get(`${environment}/api/notifications/unread-count`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUnreadCount(response.data.count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    }, []);

    // Fetch unread count on mount - fixed to avoid setState in effect warning
    useEffect(() => {
        const loadInitialCount = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) return;

            try {
                const response = await axios.get(`${environment}/api/notifications/unread-count`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUnreadCount(response.data.count);
            } catch (error) {
                console.error('Error fetching unread count:', error);
            }
        };

        loadInitialCount();
    }, []); // Empty dependency array - only runs once on mount

    // Setup SSE connection
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const es = new EventSourcePolyfill(`${environment}/api/notifications/stream`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            heartbeatTimeout: 120000,
        });

        es.onopen = () => {
            console.log('SSE connection established');
        };

        es.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'keepalive' || data.type === 'hearbeat' || data.type === 'connected') {
                    console.log("STIGAO HEARBEAT")
                    return;
                }

                let message = data.message || 'New notification';

                switch (data.type) {
                    case 'RESERVATION_REQUEST_CREATED':
                        message = 'New reservation request received';
                        break;
                    case 'RESERVATION_REQUEST_RESPONDED':
                        message = data.message || 'Your reservation request has been responded to';
                        break;
                    case 'RESERVATION_CANCELLED':
                        message = 'A reservation has been cancelled';
                        break;
                    case 'HOST_RATED':
                        message = 'You received a new rating';
                        break;
                    case 'ACCOMMODATION_RATED':
                        message = 'Your accommodation received a new rating';
                        break;
                    default:
                        console.log('NEW UNKOWN NOTIFICATION')
                        message = data.message || 'New notification';
                }

                showNotification(message);
                fetchUnreadCount();
            } catch (error) {
                console.error('Error parsing SSE message:', error);
            }
        };

        es.onerror = (error) => {
            console.error('SSE error:', error);
        };

        eventSourceRef.current = es;

        return () => {
            es.close();
            eventSourceRef.current = null;
        };
    }, [showNotification, fetchUnreadCount]);

    // Close connection when user logs out
    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem('accessToken');
            if (!token && eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
                setUnreadCount(0);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification, unreadCount, fetchUnreadCount }}>
            {children}

            {notifications.map((notification, index) => (
                <Snackbar
                    key={notification.id}
                    open={true}
                    autoHideDuration={6000}
                    onClose={() => handleClose(notification.id)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    sx={{ mt: index * 7 }}
                >
                    <Alert
                        onClose={() => handleClose(notification.id)}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {notification.message}
                    </Alert>
                </Snackbar>
            ))}
        </NotificationContext.Provider>
    );
};

// Export hook in a separate file to avoid fast refresh issues
// Or add this comment to suppress the warning:
/* eslint-disable react-refresh/only-export-components */
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};