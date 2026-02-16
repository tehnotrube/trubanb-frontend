// components/NotificationsPanel.tsx
import React, { useState, useEffect } from 'react';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Button,
    Divider,
    CircularProgress,
    Chip,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';
import { environment } from '../utils/Environment.tsx';
import { useNotification } from '../utils/NotificationContext';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface NotificationItem {
    _id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    data: {
        requestId?: string;
        accommodationId?: string;
        accommodationName?: string;
        hostId?: string;
        guestId?: string;
        guestName?: string;
        startDate?: string;
        endDate?: string;
        numberOfGuests?: number;
        price?: number;
    };
    read: boolean;
    eventId: string;
    createdAt: string;
    updatedAt: string;
}

interface NotificationsResponse {
    items: NotificationItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface NotificationsPanelProps {
    open: boolean;
    onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ open, onClose }) => {
    const { fetchUnreadCount } = useNotification();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if (open) {
            fetchNotifications(1);
        }
    }, [open]);

    const fetchNotifications = async (pageNum: number) => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        setLoading(true);
        try {
            const response = await axios.get<NotificationsResponse>(`${environment}/api/notifications`, {
                params: { page: pageNum, limit: 20 },
                headers: { Authorization: `Bearer ${token}` }
            });

            const newItems = response.data.items;

            if (pageNum === 1) {
                setNotifications(newItems);
            } else {
                setNotifications(prev => [...prev, ...newItems]);
            }

            setHasMore(pageNum < response.data.totalPages);
            setPage(pageNum);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        try {
            await axios.put(
                `${environment}/api/notifications/${id}/read`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, read: true } : n)
            );
            fetchUnreadCount();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        try {
            await axios.put(
                `${environment}/api/notifications/read-all`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            fetchUnreadCount();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const deleteNotification = async (id: string) => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        try {
            await axios.delete(
                `${environment}/api/notifications/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setNotifications(prev => prev.filter(n => n._id !== id));
            fetchUnreadCount();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const getNotificationTypeLabel = (type: string) => {
        const typeMap: Record<string, string> = {
            'RESERVATION_REQUEST_CREATED': 'Reservation Request',
            'RESERVATION_REQUEST_RESPONDED': 'Request Response',
            'RESERVATION_CANCELLED': 'Cancellation',
            'HOST_RATED': 'Host Rating',
            'ACCOMMODATION_RATED': 'Accommodation Rating',
        };
        return typeMap[type] || type;
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 400, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="h6" fontWeight={600}>
                        Notifications
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Mark all as read button */}
                {notifications.some(n => !n.read) && (
                    <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                        <Button
                            variant="outlined"
                            size="small"
                            fullWidth
                            onClick={markAllAsRead}
                        >
                            Mark all as read
                        </Button>
                    </Box>
                )}

                {/* Notifications List */}
                <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                    {loading && page === 1 ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : notifications.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">
                                No notifications
                            </Typography>
                        </Box>
                    ) : (
                        <List sx={{ p: 0 }}>
                            {notifications.map((notification) => (
                                <React.Fragment key={notification._id}>
                                    <ListItem
                                        sx={{
                                            bgcolor: notification.read ? 'transparent' : 'action.hover',
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            gap: 1,
                                            '&:hover': {
                                                bgcolor: 'action.selected'
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                                            <Chip
                                                label={getNotificationTypeLabel(notification.type)}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                            {!notification.read && (
                                                <Box
                                                    sx={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        bgcolor: 'primary.main',
                                                    }}
                                                />
                                            )}
                                            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                                                {dayjs(notification.createdAt).fromNow()}
                                            </Typography>
                                        </Box>

                                        <Typography variant="subtitle2" fontWeight={600}>
                                            {notification.title}
                                        </Typography>

                                        <ListItemText
                                            primary={notification.message}
                                            sx={{ mt: 0, mb: 1 }}
                                        />

                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            {!notification.read && (
                                                <Button
                                                    size="small"
                                                    variant="text"
                                                    onClick={() => markAsRead(notification._id)}
                                                >
                                                    Mark as read
                                                </Button>
                                            )}
                                            <Button
                                                size="small"
                                                variant="text"
                                                color="error"
                                                onClick={() => deleteNotification(notification._id)}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    )}

                    {/* Load more button */}
                    {hasMore && !loading && (
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Button onClick={() => fetchNotifications(page + 1)}>
                                Load More
                            </Button>
                        </Box>
                    )}

                    {loading && page > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                            <CircularProgress size={24} />
                        </Box>
                    )}
                </Box>
            </Box>
        </Drawer>
    );
};

export default NotificationsPanel;