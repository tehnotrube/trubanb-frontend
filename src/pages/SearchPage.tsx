import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import AccommodationCard from "../components/AccommodationCard.tsx";
import type { Accommodation } from "../models.tsx";
import axios, { AxiosError } from 'axios';
import { environment } from '../utils/Environment.tsx';
import { useSearchParams } from 'react-router-dom';
import type { AccommodationResponseDto } from '../models/responses/accommodation.ts';

const SearchResults: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchAccommodations = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        const checkIn = searchParams.get('checkIn');
        const checkOut = searchParams.get('checkOut');
        const guests = searchParams.get('guests');
        const location = searchParams.get('location');

        if (checkIn) params.set('checkIn', checkIn);
        if (checkOut) params.set('checkOut', checkOut);
        if (guests) params.set('guests', guests);
        if (location) params.set('location', location);

        const url = `${environment}/api/accommodations?${params.toString()}`;
        const response = await axios.get(url);

        const transformed: Accommodation[] = response.data.data.map((acc: AccommodationResponseDto) => {
          const basePrice = Number(acc.basePrice) || 0;
          const nights = checkIn && checkOut
            ? Math.ceil(
                (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
              )
            : undefined;

          return {
            id: acc.id,
            name: acc.name,
            location: acc.location,
            image: acc.photoUrls?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
            guests: { min: acc.minGuests, max: acc.maxGuests },
            amenities: {
              wifi: acc.amenities?.includes('WiFi') ?? false,
              ac: (acc.amenities?.includes('AC') || acc.amenities?.includes('Air Conditioning')) ?? false,
              parking: acc.amenities?.includes('Parking') ?? false,
            },
            totalPrice: acc.totalPriceForStay ?? 0,
            pricePerNight: acc.pricePerNight ?? basePrice,
            priceType: acc.isPerUnit ? "accommodation" : "person",
            rating: 0,
            nights,
          };
        });

        setAccommodations(transformed);
      } catch (err: unknown) {
        setError(
            (err as AxiosError<{ message?: string }>)?.response?.data?.message ||
            'Failed to load accommodations'
        );     
    } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, [searchParams]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        {error}
      </Alert>
    );
  }

  const hasFilters = searchParams.keys().next().done === false;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
        {hasFilters ? 'Search Results' : 'All Accommodations'}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {accommodations.length} accommodation{accommodations.length !== 1 ? 's' : ''} found
      </Typography>

      {accommodations.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ py: 8 }}>
          No results found for the selected filters.
        </Typography>
      ) : (
        <Grid container spacing={3} columnSpacing={9}>
          {accommodations.map((acc) => (
            <Grid key={acc.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <AccommodationCard accommodation={acc} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SearchResults;