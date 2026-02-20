// ============================================================================
// AccommodationViewPage.tsx - Main Page Component
// ============================================================================

import React, {useState, useEffect, useContext} from 'react';
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
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import { environment } from '../utils/Environment.tsx';
import {AuthContext} from "../utils/AuthContext.tsx";


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
const AccommodationViewPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
    const [reservationData, setReservationData] = useState({
        startDate: null as Dayjs | null,
        endDate: null as Dayjs | null,
        guests: '2',
    });
    const {isAuthenticated, role, user} = useContext(AuthContext);
    const [accommodation, setAccommodation] = useState<{
        id: string;
        name: string;
        address: string;
        city: string;
        zip: string;
        country: string;
        hostId: string;
        amenities: {
            wifi: boolean;
            ac: boolean;
            parking: boolean;
        };
        minGuests: number;
        maxGuests: number;
        price: number;
        priceType: 'accommodation' | 'person';
        images: string[];
        blockedPeriods: BlockedPeriod[];
        accommodationRules: AccommodationRule[];
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hostRatings, setHostRatings] = useState<{id: string; username: string; rating: number; date: string; comment?: string}[]>([]);
    const [accommodationRatings, setAccommodationRatings] = useState<{id: string; username: string; rating: number; date: string; comment?: string}[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchAccommodation = async () => {
            try {
                const response = await axios.get(`${environment}/api/accommodations/${id}`);
                const acc = response.data;
                
                // Parse location: "address, city, zip, country"
                const locationParts = acc.location.split(',').map((part: string) => part.trim());
                
                const transformedData: {
                    id: string;
                    name: string;
                    address: string;
                    city: string;
                    zip: string;
                    country: string;
                    hostId: string;
                    amenities: {
                        wifi: boolean;
                        ac: boolean;
                        parking: boolean;
                    };
                    minGuests: number;
                    maxGuests: number;
                    price: number;
                    priceType: 'accommodation' | 'person';
                    images: string[];
                    blockedPeriods: BlockedPeriod[];
                    accommodationRules: AccommodationRule[];
                } = {
                    id: acc.id,
                    name: acc.name,
                    address: locationParts[0] || '',
                    city: locationParts[1] || '',
                    zip: locationParts[2] || '',
                    country: locationParts[3] || '',
                    hostId: acc.hostId,
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
                    blockedPeriods: acc.blockedPeriods,
                    accommodationRules: acc.accommodationRules,
                };
                
                setAccommodation(transformedData);
                
                // Fetch accommodation ratings
                try {
                    const ratingsRes = await axios.get(`${environment}/api/ratings/target/${acc.id}`);
                    const ratings = ratingsRes.data.ratings.map((r: {id: string; guestId: string; score: number; createdAt: string; comment?: string}) => ({
                        id: r.id,
                        username: r.guestId,
                        rating: r.score,
                        date: r.createdAt,
                        comment: r.comment,
                    }));
                    setAccommodationRatings(ratings);
                } catch (ratingsErr) {
                    console.warn('Could not fetch accommodation ratings:', ratingsErr);
                    setAccommodationRatings([]);
                }
                
                // Fetch host ratings
                if (acc.hostId) {
                    try {
                        const hostRatingsRes = await axios.get(`${environment}/api/ratings/target/${acc.hostId}`);
                        const hostRatings = hostRatingsRes.data.ratings.map((r: {id: string; guestId: string; score: number; createdAt: string; comment?: string}) => ({
                            id: r.id,
                            username: r.guestId,
                            rating: r.score,
                            date: r.createdAt,
                            comment: r.comment,
                        }));
                        setHostRatings(hostRatings);
                    } catch (hostRatingsErr) {
                        console.warn('Could not fetch host ratings:', hostRatingsErr);
                        setHostRatings([]);
                    }
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching accommodation:', error);
                setError((error as {response?: {data?: {message?: string}}}).response?.data?.message || 'Failed to load accommodation');
                setLoading(false);
            }
        };

        if (id) {
            fetchAccommodation();
        }
    }, [id]);

    const handleNextImage = () => {
        if (!accommodation) return;
        setCurrentImageIndex((prev) =>
            prev === accommodation.images.length - 1 ? 0 : prev + 1
        );
    };

    const handlePrevImage = () => {
        if (!accommodation) return;
        setCurrentImageIndex((prev) =>
            prev === 0 ? accommodation.images.length - 1 : prev - 1
        );
    };

    const handleReservationSubmit = async () => {
        try {
            if (!accommodation || !reservationData.startDate || !reservationData.endDate) {
                alert('Please fill in all reservation details');
                return;
            }

            const payload = {
                accommodationId: accommodation.id,
                startDate: reservationData.startDate.format('YYYY-MM-DD'),
                endDate: reservationData.endDate.format('YYYY-MM-DD'),
                numberOfGuests: parseInt(reservationData.guests),
            };

            const response = await axios.post(`${environment}/api/reservations/requests`, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Reservation created:', response.data);
            alert('Reservation request submitted successfully!');
            setReservationDialogOpen(false);
            // Reset form
            setReservationData({
                startDate: null,
                endDate: null,
                guests: '2',
            });
        } catch (error) {
            console.error('Error creating reservation:', error);
            const errorMessage = (error as {response?: {data?: {message?: string}}}).response?.data?.message || 'Failed to create reservation';
            alert(errorMessage);
        }
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
                {isAuthenticated && role=='guest' && <Button
                    variant="contained"
                    size="large"
                    onClick={() => setReservationDialogOpen(true)}
                    sx={{ color: 'white' }}
                >
                    Reserve
                </Button>}
                {isAuthenticated && role=='host' && accommodation.hostId==user?.id && <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate(`/${accommodation.id}/edit-accommodation`)}
                    sx={{ color: 'white' }}
                >
                    Edit
                </Button>}
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
                blockedPeriods={accommodation.blockedPeriods}
                accommodationRules={accommodation.accommodationRules}

            />
            <RatingsSection
                hostRatings={hostRatings}
                accommodationRatings={accommodationRatings}
            />
        </Box>
    );
};

export default AccommodationViewPage;