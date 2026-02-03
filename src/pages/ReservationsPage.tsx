import {useContext, useState, useEffect} from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    Divider,
    Avatar,
    Container,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    CalendarToday,
    People,
    AttachMoney,
    Home,
    Cancel,
    CheckCircle,
    Block,
    Star,
    StarHalf
} from '@mui/icons-material';
import {AuthContext} from "../utils/AuthContext.tsx";
import axios from 'axios';
import { environment } from '../utils/Environment.tsx';
import RatingDialog from '../components/RatingDialog.tsx';

interface RatingData {
    rating: number;
    comment?: string;
}

interface Reservation {
    id: string;
    accommodationName: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    numberOfGuests: number;
    status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
    guestName: string;
    guestCancellations?: number;
    hostRating?: RatingData;
    accommodationRating?: RatingData;
}

export default function ReservationsPage() {
    const {role} = useContext(AuthContext)
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        action: 'cancel' | 'accept' | 'reject' | null;
        reservationId: string | null;
    }>({
        open: false,
        action: null,
        reservationId: null
    });
    const [ratingDialog, setRatingDialog] = useState<{
        open: boolean;
        reservationId: string | null;
    }>({
        open: false,
        reservationId: null
    });

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('accessToken');
                let response;

                if (role === 'host') {
                    // For hosts, fetch pending reservation requests
                    try {
                        response = await axios.get(`${environment}/api/reservations/requests/pending`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                    } catch {
                        // If the endpoint doesn't exist, try to fetch accommodations and then requests
                        console.warn('Could not fetch pending requests directly, trying alternative endpoint');
                        response = { data: [] };
                    }
                } else {
                    // For guests, fetch both requests and confirmed reservations
                    try {
                        const [requestsResponse, reservationsResponse] = await Promise.all([
                            axios.get(`${environment}/api/reservations/requests`, {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }),
                            axios.get(`${environment}/api/reservations`, {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            })
                        ]);

                        const reservationsData = reservationsResponse.data || [];
                        const reservationsByRequestId = new Map(
                            reservationsData
                                .filter((res: {requestId?: string}) => res.requestId)
                                .map((res: {requestId: string}) => [res.requestId, res])
                        );

                        const requestsData = (requestsResponse.data || []).filter(
                            (req: {id: string}) => !reservationsByRequestId.has(req.id)
                        );

                        // For requests, we need to fetch accommodation details
                        const requestsWithAccommodations = await Promise.all(
                            requestsData.map(async (req: {accommodationId: string}) => {
                                try {
                                    const accResponse = await axios.get(
                                        `${environment}/api/accommodations/${req.accommodationId}`
                                    );
                                    return { ...req, accommodationName: accResponse.data.name };
                                } catch {
                                    return { ...req, accommodationName: 'Accommodation' };
                                }
                            })
                        );
                        
                        // Combine requests and confirmed reservations
                        response = { data: [...requestsWithAccommodations, ...reservationsData] };
                    } catch (error) {
                        console.error('Error fetching guest reservations:', error);
                        response = { data: [] };
                    }
                }
                
                // Transform API response to match component interface
                const transformedReservations = response.data.map((res: {id: string; requestId?: string; accommodationName?: string; accommodation?: {name: string}; startDate: string; endDate: string; totalPrice?: number; price?: number; numberOfGuests?: number; guests?: number; status?: string; guestName?: string; guestId?: string; guestCancellationCount?: number; guestCancellations?: number}) => ({
                    id: res.id,
                    accommodationName: res.accommodationName || res.accommodation?.name || 'Accommodation',
                    startDate: res.startDate,
                    endDate: res.endDate,
                    totalPrice: res.totalPrice || res.price || 0,
                    numberOfGuests: res.numberOfGuests || res.guests || 0,
                    status: res.status?.toLowerCase() || (res.requestId ? 'approved' : 'pending'),
                    guestName: res.guestName || res.guestId || 'Guest',
                    guestCancellations: res.guestCancellationCount || res.guestCancellations || 0,
                }));
                
                setReservations(transformedReservations);
                setError(null);
            } catch (error) {
                console.error('Error fetching reservations:', error);
                setError((error as {response?: {data?: {message?: string}}}).response?.data?.message || 'Failed to load reservations');
                setReservations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [role]);

    const openConfirmDialog = (action: 'cancel' | 'accept' | 'reject', reservationId: string) => {
        setConfirmDialog({ open: true, action, reservationId });
    };

    const closeConfirmDialog = () => {
        setConfirmDialog({ open: false, action: null, reservationId: null });
    };

    const openRatingDialog = (reservationId: string) => {
        setRatingDialog({ open: true, reservationId });
    };

    const closeRatingDialog = () => {
        setRatingDialog({ open: false, reservationId: null });
    };

    const handleConfirmAction = async () => {
        if (confirmDialog.reservationId && confirmDialog.action) {
            try {
                const reservationId = confirmDialog.reservationId;
                const action = confirmDialog.action;
                
                let endpoint = '';
                
                if (action === 'cancel') {
                    // Guest cancelling their reservation
                    endpoint = `${environment}/api/reservations/${reservationId}`;
                    await axios.delete(endpoint, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    });
                } else if (action === 'accept') {
                    // Host approving a request
                    endpoint = `${environment}/api/reservations/requests/${reservationId}/approve`;
                    await axios.put(endpoint, {}, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    });
                } else if (action === 'reject') {
                    // Host rejecting a request
                    endpoint = `${environment}/api/reservations/requests/${reservationId}/reject`;
                    await axios.put(endpoint, {}, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    });
                }

                // Update local state
                setReservations(prev =>
                    prev.map(res =>
                        res.id === confirmDialog.reservationId
                            ? {
                                ...res,
                                status:
                                    confirmDialog.action === 'cancel'
                                        ? 'cancelled'
                                        : confirmDialog.action === 'accept'
                                            ? 'accepted'
                                            : 'rejected'
                            }
                            : res
                    )
                );

                closeConfirmDialog();
                alert(`Request ${action === 'accept' ? 'approved' : action === 'reject' ? 'rejected' : 'cancelled'} successfully!`);
            } catch (error) {
                console.error('Error handling reservation action:', error);
                const errorMessage = (error as {response?: {data?: {message?: string}}}).response?.data?.message || 'Failed to process reservation';
                alert(errorMessage);
                closeConfirmDialog();
            }
        }
    };

    const handleHostRatingSubmit = (rating: number, comment?: string) => {
        const submit = async () => {
            if (!ratingDialog.reservationId) return;

            try {
                const token = localStorage.getItem('accessToken');
                const payload = {
                    reservationId: ratingDialog.reservationId,
                    type: 'HOST' as const,
                    score: rating,
                    comment,
                };

                await axios.post(`${environment}/api/ratings`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (error) {
                const message = (error as {response?: {data?: {message?: string}}}).response?.data?.message || '';
                if (message.includes('Rating already exists')) {
                    const token = localStorage.getItem('accessToken');
                    await axios.put(
                        `${environment}/api/ratings/reservation/${ratingDialog.reservationId}/HOST`,
                        { score: rating, comment },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                } else {
                    console.error('Error submitting host rating:', error);
                    alert('Failed to submit host rating');
                    return;
                }
            }

            setReservations(prev =>
                prev.map(res =>
                    res.id === ratingDialog.reservationId
                        ? { ...res, hostRating: { rating, comment } }
                        : res
                )
            );
        };

        void submit();
    };

    const handleAccommodationRatingSubmit = (rating: number, comment?: string) => {
        const submit = async () => {
            if (!ratingDialog.reservationId) return;

            try {
                const token = localStorage.getItem('accessToken');
                const payload = {
                    reservationId: ratingDialog.reservationId,
                    type: 'ACCOMMODATION' as const,
                    score: rating,
                    comment,
                };

                await axios.post(`${environment}/api/ratings`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (error) {
                const message = (error as {response?: {data?: {message?: string}}}).response?.data?.message || '';
                if (message.includes('Rating already exists')) {
                    const token = localStorage.getItem('accessToken');
                    await axios.put(
                        `${environment}/api/ratings/reservation/${ratingDialog.reservationId}/ACCOMMODATION`,
                        { score: rating, comment },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                } else {
                    console.error('Error submitting accommodation rating:', error);
                    alert('Failed to submit accommodation rating');
                    return;
                }
            }

            setReservations(prev =>
                prev.map(res =>
                    res.id === ratingDialog.reservationId
                        ? { ...res, accommodationRating: { rating, comment } }
                        : res
                )
            );
        };

        void submit();
    };

    const handleHostRatingDelete = () => {
        const remove = async () => {
            if (!ratingDialog.reservationId) return;

            try {
                const token = localStorage.getItem('accessToken');
                await axios.delete(
                    `${environment}/api/ratings/reservation/${ratingDialog.reservationId}/HOST`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } catch (error) {
                console.error('Error deleting host rating:', error);
                alert('Failed to delete host rating');
                return;
            }

            setReservations(prev =>
                prev.map(res =>
                    res.id === ratingDialog.reservationId
                        ? { ...res, hostRating: undefined }
                        : res
                )
            );
        };

        void remove();
    };

    const handleAccommodationRatingDelete = () => {
        const remove = async () => {
            if (!ratingDialog.reservationId) return;

            try {
                const token = localStorage.getItem('accessToken');
                await axios.delete(
                    `${environment}/api/ratings/reservation/${ratingDialog.reservationId}/ACCOMMODATION`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } catch (error) {
                console.error('Error deleting accommodation rating:', error);
                alert('Failed to delete accommodation rating');
                return;
            }

            setReservations(prev =>
                prev.map(res =>
                    res.id === ratingDialog.reservationId
                        ? { ...res, accommodationRating: undefined }
                        : res
                )
            );
        };

        void remove();
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStatusColor = (status: string): 'warning' | 'success' | 'error' | 'default' => {
        switch (status) {
            case 'pending':
                return 'warning';
            case 'accepted':
            case 'approved':
                return 'success';
            case 'rejected':
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const isPastReservation = (endDate: string) => {
        return new Date(endDate) < new Date();
    };

    const canRate = (reservation: Reservation) => {
        return (
            role === 'guest' &&
            reservation.status === 'accepted' &&
            isPastReservation(reservation.endDate)
        );
    };

    const getRatingStatus = (reservation: Reservation) => {
        const hasHostRating = !!reservation.hostRating;
        const hasAccommodationRating = !!reservation.accommodationRating;

        if (hasHostRating && hasAccommodationRating) {
            return { icon: <Star />, label: 'FULLY RATED', color: 'success' as const };
        } else if (hasHostRating || hasAccommodationRating) {
            return { icon: <StarHalf />, label: 'PARTIALLY RATED', color: 'info' as const };
        }
        return null;
    };

    const getRatingButtonText = (reservation: Reservation) => {
        const hasHostRating = !!reservation.hostRating;
        const hasAccommodationRating = !!reservation.accommodationRating;

        if (hasHostRating && hasAccommodationRating) {
            return 'View/Edit Ratings';
        } else if (hasHostRating || hasAccommodationRating) {
            return 'Complete Rating';
        }
        return 'Rate Experience';
    };

    const filteredReservations = reservations.filter(res => {
        if (role === 'host') {
            // Hosts see pending requests
            return res.status === 'pending';
        } else {
            // Guests see all their reservations
            return true;
        }
    });

    const currentReservation = reservations.find(r => r.id === ratingDialog.reservationId);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" fontWeight="bold">
                    {role === 'host' ? 'Reservation Requests' : 'My Reservations'}
                </Typography>
            </Stack>

            {filteredReservations.length === 0 ? (
                <Alert severity="info">
                    {role === 'host' ? 'No pending reservation requests' : 'You have no reservations'}
                </Alert>
            ) : (
            <Stack spacing={3}>
                {filteredReservations.map((reservation) => {
                    const ratingStatus = getRatingStatus(reservation);

                    return (
                        <Card key={reservation.id} elevation={2} sx={{ width: '100%' }}>
                            <CardContent>
                                <Stack spacing={2}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                                                <Home />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6" fontWeight="bold">
                                                    {reservation.accommodationName}
                                                </Typography>
                                                {role === 'host' && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        Guest: {reservation.guestName}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Chip
                                                label={reservation.status.toUpperCase()}
                                                color={getStatusColor(reservation.status)}
                                                size="small"
                                            />
                                            {ratingStatus && (
                                                <Chip
                                                    icon={ratingStatus.icon}
                                                    label={ratingStatus.label}
                                                    color={ratingStatus.color}
                                                    size="small"
                                                />
                                            )}
                                        </Stack>
                                    </Stack>

                                    <Divider />

                                    <Grid container spacing={3}>
                                        <Grid>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <CalendarToday fontSize="small" color="action" />
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Check-in
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {formatDate(reservation.startDate)}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Grid>

                                        <Grid>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <CalendarToday fontSize="small" color="action" />
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Check-out
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {formatDate(reservation.endDate)}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Grid>

                                        <Grid>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <People fontSize="small" color="action" />
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Guests
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {reservation.numberOfGuests}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Grid>

                                        <Grid>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <AttachMoney fontSize="small" color="action" />
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Total Price
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        ${reservation.totalPrice}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Grid>

                                        {role === 'host' && (
                                            <Grid>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Cancel fontSize="small" color="action" />
                                                    <Typography variant="body2" color="text.secondary">
                                                        Guest Cancellations: {reservation.guestCancellations}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        )}
                                    </Grid>

                                    <Divider />

                                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                                        {role === 'guest' && reservation.status === 'pending' && (
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                startIcon={<Cancel />}
                                                onClick={() => openConfirmDialog('cancel', reservation.id)}
                                            >
                                                Cancel Request
                                            </Button>
                                        )}

                                        {canRate(reservation) && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                sx={{color:'white'}}
                                                startIcon={<Star />}
                                                onClick={() => openRatingDialog(reservation.id)}
                                            >
                                                {getRatingButtonText(reservation)}
                                            </Button>
                                        )}

                                        {role === 'host' && reservation.status === 'pending' && (
                                            <>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    startIcon={<Block />}
                                                    onClick={() => openConfirmDialog('reject', reservation.id)}
                                                >
                                                    Reject
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    startIcon={<CheckCircle />}
                                                    onClick={() => openConfirmDialog('accept', reservation.id)}
                                                >
                                                    Accept
                                                </Button>
                                            </>
                                        )}
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    );
                })}
            </Stack>
            )}

            <Dialog open={confirmDialog.open} onClose={closeConfirmDialog}>
                <DialogTitle>
                    Confirm Reservation
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to {confirmDialog.action} this reservation?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirmDialog}>Cancel</Button>
                    <Button onClick={handleConfirmAction} variant="contained" color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {currentReservation && (
                <RatingDialog
                    open={ratingDialog.open}
                    onClose={closeRatingDialog}
                    onSubmitHost={handleHostRatingSubmit}
                    onSubmitAccommodation={handleAccommodationRatingSubmit}
                    onDeleteHost={handleHostRatingDelete}
                    onDeleteAccommodation={handleAccommodationRatingDelete}
                    accommodationName={currentReservation.accommodationName}
                    guestName={currentReservation.guestName}
                    existingHostRating={currentReservation.hostRating}
                    existingAccommodationRating={currentReservation.accommodationRating}
                />
            )}
        </Container>
    );
}