import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    MenuItem,
} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, {Dayjs} from 'dayjs';
import AvailabilityCalendar from "./AvailabilityCalendar.tsx";

interface BlockedPeriod {
    id: string;
    startDate: string;
    endDate: string;
    reason: string;
}

interface AccommodationRule {
    id: string;
    startDate: string;
    endDate: string;
    overridePrice: string;
    multiplier: string;
    periodType: string;
}

interface ReservationDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    reservationData: {
        startDate: Dayjs | null;
        endDate: Dayjs | null;
        guests: string;
    };
    setReservationData: React.Dispatch<React.SetStateAction<{
        startDate: Dayjs | null;
        endDate: Dayjs | null;
        guests: string;
    }>>;
    minGuests: number;
    maxGuests: number;
    price: number;
    priceType: 'accommodation' | 'person';
    blockedPeriods: BlockedPeriod[];
    accommodationRules: AccommodationRule[];
}

const ReservationDialog: React.FC<ReservationDialogProps> = ({
                                                                 open,
                                                                 onClose,
                                                                 onSubmit,
                                                                 reservationData,
                                                                 setReservationData,
                                                                 minGuests,
                                                                 maxGuests,
                                                                 price,
                                                                 priceType,
                                                                 accommodationRules,
                                                                 blockedPeriods
                                                             }) => {
    const handleDateChange = (field: 'startDate' | 'endDate') => (date: Dayjs | null) => {
        setReservationData(prev => ({...prev, [field]: date}));
    };

    const handleGuestsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setReservationData(prev => ({...prev, guests: event.target.value}));
    };

    const calculateTotal = () => {
        if (!reservationData.startDate || !reservationData.endDate) return 0;

        const nights = reservationData.endDate.diff(reservationData.startDate, 'day');
        const guestCount = parseInt(reservationData.guests) || 0;

        if (priceType === 'accommodation') {
            return nights * price;
        } else {
            return nights * price * guestCount;
        }
    };

    const guestOptions = Array.from(
        {length: maxGuests - minGuests + 1},
        (_, i) => minGuests + i
    );

    const isValid = reservationData.startDate &&
        reservationData.endDate &&
        reservationData.guests &&
        reservationData.endDate.isAfter(reservationData.startDate);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
                <DialogTitle>Make a Reservation</DialogTitle>
                <DialogContent>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3, mt: 2}}>
                        <DatePicker
                            label="Check-in Date"
                            value={reservationData.startDate}
                            onChange={handleDateChange('startDate')}
                            slotProps={{
                                textField: {fullWidth: true}
                            }}
                        />

                        <DatePicker
                            label="Check-out Date"
                            value={reservationData.endDate}
                            onChange={handleDateChange('endDate')}
                            minDate={reservationData.startDate || undefined}
                            slotProps={{
                                textField: {fullWidth: true}
                            }}
                        />

                        <TextField
                            select
                            label="Number of Guests"
                            value={reservationData.guests}
                            onChange={handleGuestsChange}
                            fullWidth
                        >
                            {guestOptions.map((num) => (
                                <MenuItem key={num} value={num.toString()}>
                                    {num} {num === 1 ? 'Guest' : 'Guests'}
                                </MenuItem>
                            ))}
                        </TextField>

                        {isValid && (
                            <Box sx={{
                                p: 2,
                                bgcolor: 'primary.50',
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'primary.200'
                            }}>
                                <Typography variant="h6" sx={{mb: 1}}>
                                    Reservation Summary
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {reservationData.endDate!.diff(reservationData.startDate, 'day')} nights ×
                                    ${price} {priceType === 'person' ? `× ${reservationData.guests} guests` : ''}
                                </Typography>
                                <Typography variant="h5" sx={{mt: 1, fontWeight: 600, color: 'primary.main'}}>
                                    Total: ${calculateTotal()}
                                </Typography>
                            </Box>
                        )}
                        <AvailabilityCalendar
                            generalAvailability={[{
                                id: '1',
                                startDate: null,
                                endDate: null,
                                price: price as unknown as string,
                                priceType: priceType
                            }]}
                            extraRules={[
                                ...accommodationRules.map(rule => ({
                                    id: rule.id as string,
                                    type: 'price_override',
                                    startDate: dayjs(rule.startDate),
                                    endDate: dayjs(rule.endDate),
                                    price: rule.overridePrice
                                })),
                                ...blockedPeriods.map(period => ({
                                    id: period.id as string,
                                    type: 'unavailability',
                                    startDate: dayjs(period.startDate),
                                    endDate: dayjs(period.endDate),
                                    price: null
                                }))
                            ]}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{px: 3, pb: 2}}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        onClick={onSubmit}
                        variant="contained"
                        disabled={!isValid}
                        sx={{color: 'white'}}
                    >
                        Confirm Reservation
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

export default ReservationDialog;