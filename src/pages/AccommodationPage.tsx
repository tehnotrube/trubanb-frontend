// ============================================================================
// AccommodationViewPage.tsx - Main Page Component
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Grid,
    Button,
    CircularProgress,
} from '@mui/material';
import {
    LocationOn as LocationIcon,
    People as PeopleIcon,
    Wifi as WifiIcon,
    AcUnit as AcIcon,
    LocalParking as ParkingIcon,

} from '@mui/icons-material';
import { Dayjs } from 'dayjs';
import ImageGallery from "../components/ImageGallery.tsx";
import ReservationDialog from '../components/ReservationDialog.tsx';
import RatingsSection from "../components/RatingsSection.tsx";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { environment } from '../utils/environment.tsx';

// Mock data - replace with API call
const mockAccommodation = {
    id: 1,
    name: "Luxury Mountain Retreat",
    address: "123 Alpine Way",
    city: "Aspen",
    country: "Colorado, USA",
    zip: "81611",
    amenities: {
        wifi: true,
        ac: true,
        parking: true,
    },
    minGuests: 2,
    maxGuests: 8,
    price: 280,
    priceType: 'accommodation' as 'accommodation' | 'person', // or 'person'
    images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
    ],
};

const mockHostRatings = [
    {
        id: '1',
        username: 'Sarah Johnson',
        rating: 5,
        date: '2026-01-15',
        comment: 'Excellent host! Very responsive and accommodating.',
    },
    {
        id: '2',
        username: 'Mike Chen',
        rating: 4,
        date: '2026-01-10',
        comment: 'Great communication and helpful with local recommendations.',
    },
    {
        id: '3',
        username: 'Emily Rodriguez',
        rating: 5,
        date: '2025-12-28',
        comment: 'The host went above and beyond to make our stay comfortable.',
    },
    {
        id: '4',
        username: 'David Thompson',
        rating: 4,
        date: '2025-12-20',
    },
];

const mockAccommodationRatings = [
    {
        id: '1',
        username: 'Jessica Martinez',
        rating: 5,
        date: '2026-01-18',
        comment: 'Beautiful property with stunning views. Everything was spotless!',
    },
    {
        id: '2',
        username: 'Robert Williams',
        rating: 4,
        date: '2026-01-12',
        comment: 'Great location and amenities. Would definitely stay again.',
    },
    {
        id: '3',
        username: 'Amanda Brown',
        rating: 5,
        date: '2026-01-05',
        comment: 'Perfect for a family vacation. The kitchen was well-equipped.',
    },
    {
        id: '4',
        username: 'Chris Anderson',
        rating: 3,
        date: '2025-12-22',
        comment: 'Nice place but a bit far from downtown.',
    },
    {
        id: '5',
        username: 'Lisa Taylor',
        rating: 5,
        date: '2025-12-15',
        comment: 'Absolutely loved it! The beds were so comfortable.',
    },
];

const AccommodationViewPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
    const [reservationData, setReservationData] = useState({
        startDate: null as Dayjs | null,
        endDate: null as Dayjs | null,
        guests: '2',
    });
    const [accommodation, setAccommodation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAccommodation = async () => {
            try {
                const response = await axios.get(`${environment}/api/accommodations/${id}`);
                const acc = response.data;
                
                const transformedData = {
                    id: acc.id,
                    name: acc.name,
                    address: acc.location.split(',')[0]?.trim() || acc.location,
                    city: acc.location.split(',')[1]?.trim() || '',
                    country: acc.location.split(',').slice(2).join(',').trim() || '',
                    zip: '',
                    amenities: {
                        wifi: acc.amenities.includes('WiFi'),
                        ac: acc.amenities.includes('AC') || acc.amenities.includes('Air Conditioning'),
                        parking: acc.amenities.includes('Parking'),
                    },
                    minGuests: acc.minGuests,
                    maxGuests: acc.maxGuests,
                    price: Number(acc.basePrice),
                    priceType: acc.isPerUnit ? 'accommodation' : 'person',
                    images: acc.photoUrls && acc.photoUrls.length > 0
                        ? acc.photoUrls
                        : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"],
                };
                
                setAccommodation(transformedData);
                setLoading(false);
            } catch (err: any) {
                console.error('Error fetching accommodation:', err);
                setError(err.response?.data?.message || 'Failed to load accommodation');
                setLoading(false);
            }
        };

        if (id) {
            fetchAccommodation();
        }
    }, [id]);

    const handleNextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === accommodation.images.length - 1 ? 0 : prev + 1
        );
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? accommodation.images.length - 1 : prev - 1
        );
    };

    const handleReservationSubmit = () => {
        console.log('Reservation data:', reservationData);
        // TODO: API call to create reservation
        setReservationDialogOpen(false);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error || !accommodation) {
        return (
            <Box>
                <Typography variant="h6" color="error">
                    {error || 'Accommodation not found'}
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                        {accommodation.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 1 }}>
                        <LocationIcon sx={{ mr: 0.5 }} />
                        <Typography variant="body1">
                            {accommodation.address}, {accommodation.city}, {accommodation.country}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            ${accommodation.price}
                            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                per {accommodation.priceType} / night
                            </Typography>
                        </Typography>
                    </Box>
                </Box>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => setReservationDialogOpen(true)}
                    sx={{ color: 'white' }}
                >
                    Reserve
                </Button>
            </Box>

            {/* Image Gallery */}


            {/* Details Section */}
            <Box display='flex' flexDirection='row' height='100%'>
                {/* Amenities Card */}
                <Grid mr={3} mb={2}>
                    <Card sx={{height: '130px'}}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                Amenities
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {accommodation.amenities.wifi && (
                                    <Chip
                                        icon={<WifiIcon />}
                                        label="WiFi"
                                        variant="outlined"
                                    />
                                )}
                                {accommodation.amenities.ac && (
                                    <Chip
                                        icon={<AcIcon />}
                                        label="Air Conditioning"
                                        variant="outlined"
                                    />
                                )}
                                {accommodation.amenities.parking && (
                                    <Chip
                                        icon={<ParkingIcon />}
                                        label="Free Parking"
                                        variant="outlined"
                                    />
                                )}
                                {!accommodation.amenities.wifi &&
                                    !accommodation.amenities.ac &&
                                    !accommodation.amenities.parking && (
                                        <Typography variant="body2" color="text.secondary">
                                            No additional amenities
                                        </Typography>
                                    )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Guest Capacity Card */}
                <Grid mr={3} mb={2}>
                    <Card sx={{height: '130px'}}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                Guest Capacity
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PeopleIcon sx={{ color: 'text.secondary' }} />
                                <Typography variant="body1">
                                    {accommodation.minGuests} - {accommodation.maxGuests} guests
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Location Card */}
                <Grid mb={2}>
                    <Card sx={{height: '130px'}}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                Location Details
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid>
                                    <Typography variant="caption" color="text.secondary">
                                        Address
                                    </Typography>
                                    <Typography variant="body1">
                                        {accommodation.address}
                                    </Typography>
                                </Grid>
                                <Grid>
                                    <Typography variant="caption" color="text.secondary">
                                        City
                                    </Typography>
                                    <Typography variant="body1">
                                        {accommodation.city}
                                    </Typography>
                                </Grid>
                                <Grid >
                                    <Typography variant="caption" color="text.secondary">
                                        Country
                                    </Typography>
                                    <Typography variant="body1">
                                        {accommodation.country}
                                    </Typography>
                                </Grid>
                                <Grid >
                                    <Typography variant="caption" color="text.secondary">
                                        ZIP Code
                                    </Typography>
                                    <Typography variant="body1">
                                        {accommodation.zip}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Box>

            <ImageGallery
                images={accommodation.images}
                currentIndex={currentImageIndex}
                onNext={handleNextImage}
                onPrev={handlePrevImage}
            />

            {/* Reservation Dialog */}
            <ReservationDialog
                open={reservationDialogOpen}
                onClose={() => setReservationDialogOpen(false)}
                onSubmit={handleReservationSubmit}
                reservationData={reservationData}
                setReservationData={setReservationData}
                minGuests={accommodation.minGuests}
                maxGuests={accommodation.maxGuests}
                price={accommodation.price}
                priceType={accommodation.priceType}
            />
            <RatingsSection
                hostRatings={mockHostRatings}
                accommodationRatings={mockAccommodationRatings}
            />
        </Box>
    );
};

export default AccommodationViewPage;