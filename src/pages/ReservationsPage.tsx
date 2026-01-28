import {useContext, useState} from 'react';
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
    Container
} from '@mui/material';
import {
    CalendarToday,
    People,
    AttachMoney,
    Home,
    Cancel,
    CheckCircle,
    Block
} from '@mui/icons-material';
import {AuthContext} from "../utils/AuthContext.tsx";

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
}

const mockReservations: Reservation[] = [
    {
        id: '1',
        accommodationName: 'Cozy Mountain Cabin',
        startDate: '2026-02-15',
        endDate: '2026-02-20',
        totalPrice: 850,
        numberOfGuests: 4,
        status: 'pending',
        guestName: 'John Smith',
        guestCancellations: 2
    },
    {
        id: '2',
        accommodationName: 'Beachfront Villa',
        startDate: '2026-03-01',
        endDate: '2026-03-07',
        totalPrice: 1500,
        numberOfGuests: 6,
        status: 'pending',
        guestName: 'Sarah Johnson',
        guestCancellations: 0
    },
    {
        id: '3',
        accommodationName: 'Urban Loft',
        startDate: '2026-02-10',
        endDate: '2026-02-12',
        totalPrice: 320,
        numberOfGuests: 2,
        status: 'accepted',
        guestName: 'Mike Davis',
        guestCancellations: 1
    },
    {
        id: '4',
        accommodationName: 'Lake House Retreat',
        startDate: '2026-04-05',
        endDate: '2026-04-10',
        totalPrice: 975,
        numberOfGuests: 5,
        status: 'pending',
        guestName: 'Emily Brown',
        guestCancellations: 3
    }
];

export default function ReservationsPage() {
    const {role} = useContext(AuthContext)
    const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        action: 'cancel' | 'accept' | 'reject' | null;
        reservationId: string | null;
    }>({
        open: false,
        action: null,
        reservationId: null
    });

    const openConfirmDialog = (action: 'cancel' | 'accept' | 'reject', reservationId: string) => {
        setConfirmDialog({ open: true, action, reservationId });
    };

    const closeConfirmDialog = () => {
        setConfirmDialog({ open: false, action: null, reservationId: null });
    };

    const handleConfirmAction = () => {
        if (confirmDialog.reservationId && confirmDialog.action) {
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
        }
        closeConfirmDialog();
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
                return 'success';
            case 'rejected':
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const filteredReservations = reservations.filter(res =>
        role === 'guest' ? res.status !== 'rejected' : true
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" fontWeight="bold">
                    Reservation Requests
                </Typography>
            </Stack>

            <Stack spacing={3}>
                {filteredReservations.map((reservation) => (
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
                                    <Chip
                                        label={reservation.status.toUpperCase()}
                                        color={getStatusColor(reservation.status)}
                                        size="small"
                                    />
                                </Stack>

                                <Divider />

                                <Grid container spacing={3}>
                                    <Grid >
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

                                    <Grid >
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
                ))}
            </Stack>

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
        </Container>
    );
}