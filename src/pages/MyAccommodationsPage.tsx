import React, { useState, useEffect } from 'react';
import type {Accommodation} from "../models.tsx";
import AccommodationCard from "../components/AccommodationCard.tsx";
import {Box, Grid, Typography, CircularProgress, Alert } from "@mui/material";
import axios from 'axios';
import { environment } from '../utils/Environment.tsx';

const MyAccommodationsPage: React.FC = () => {
    const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMyAccommodations = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('You must be logged in to view your accommodations.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `${environment}/api/accommodations/hosts/me`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const transformedAccommodations: Accommodation[] = response.data.data.map((acc: {
                    id: string;
                    name: string;
                    location: string;
                    photoUrls: string[];
                    minGuests: number;
                    maxGuests: number;
                    amenities: string[];
                    basePrice: number;
                    isPerUnit: boolean;
                }) => ({
                    id: acc.id,
                    name: acc.name || 'Unnamed Accommodation',
                    location: acc.location || 'Location not specified',
                    image: acc.photoUrls && acc.photoUrls.length > 0
                        ? acc.photoUrls[0]
                        : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop', // Default image
                    guests: {
                        min: acc.minGuests,
                        max: acc.maxGuests
                    },
                    amenities: {
                        wifi: acc.amenities.includes('WiFi'),
                        ac: acc.amenities.includes('AC'),
                        parking: acc.amenities.includes('Parking')
                    },
                    totalPrice: acc.basePrice, // You might want to calculate this based on date range
                    pricePerNight: acc.basePrice,
                    priceType: acc.isPerUnit ? 'accommodation' : 'person',
                    rating: 0 // You'll need to add rating from another endpoint if available
                }));

                setAccommodations(transformedAccommodations);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching accommodations:', err);
                setError('Failed to load your accommodations. Please try again.');
                setLoading(false);
            }
        };

        fetchMyAccommodations();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box>
                <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
                    My Accommodations
                </Typography>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    const totalResults = accommodations.length;

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                My Accommodations
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                {totalResults} accommodation{totalResults !== 1 ? 's' : ''} found
            </Typography>

            {accommodations.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                    You haven't created any accommodations yet.
                </Typography>
            ) : (
                <Grid container spacing={3} columnSpacing={9}>
                    {accommodations.map((accommodation) => (
                        <Grid key={accommodation.id}>
                            <AccommodationCard accommodation={accommodation} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default MyAccommodationsPage;