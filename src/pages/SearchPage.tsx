import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    CircularProgress
} from '@mui/material';
import AccommodationCard from "../components/AccommodationCard.tsx";
import type {Accommodation} from "../models.tsx";
import axios from 'axios';
import { environment } from '../utils/Environment.tsx';




const SearchResults: React.FC = () => {
    const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAccommodations = async () => {
            try {
                const response = await axios.get(`${environment}/api/accommodations`);
                
                // Transform backend data to frontend model
                const transformedData: Accommodation[] = response.data.data.map((acc: {
                    id: string;
                    name: string;
                    location: string;
                    photoUrls?: string[];
                    minGuests: number;
                    maxGuests: number;
                    amenities: string[];
                    basePrice: number;
                    isPerUnit: boolean;
                }) => ({
                    id: acc.id,
                    name: acc.name,
                    location: acc.location,
                    image: acc.photoUrls?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
                    guests: { min: acc.minGuests, max: acc.maxGuests },
                    amenities: { 
                        wifi: acc.amenities.includes('WiFi'),
                        ac: acc.amenities.includes('AC') || acc.amenities.includes('Air Conditioning'),
                        parking: acc.amenities.includes('Parking')
                    },
                    totalPrice: 0, // Will be calculated based on search dates
                    pricePerNight: Number(acc.basePrice),
                    priceType: acc.isPerUnit ? "accommodation" : "person",
                    rating: 0 // TODO: Get from rating service
                }));
                
                setAccommodations(transformedData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching accommodations:', error);
                setError((error as {response?: {data?: {message?: string}}}).response?.data?.message || 'Failed to load accommodations');
                setLoading(false);
            }
        };

        fetchAccommodations();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    const totalResults = accommodations.length;

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                Search Results
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                {totalResults} accommodation{totalResults !== 1 ? 's' : ''} found
            </Typography>

            <Grid container spacing={3} columnSpacing={9}>
                {accommodations.map((accommodation) => (
                    <Grid
                        key={accommodation.id}
                    >
                        <AccommodationCard accommodation={accommodation} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default SearchResults;