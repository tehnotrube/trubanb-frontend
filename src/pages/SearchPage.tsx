import React from 'react';
import {
    Box,
    Typography,
    Grid

} from '@mui/material';
import AccommodationCard from "../components/AccommodationCard.tsx";
import type {Accommodation} from "../models.tsx";

// Mock data for accommodations
const mockAccommodations:Accommodation[] = [
    {
        id: 1,
        name: "Cozy Mountain Retreat",
        location: "Aspen, Colorado",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
        guests: { min: 2, max: 6 },
        amenities: { wifi: true, ac: true, parking: true },
        totalPrice: 1680,
        pricePerNight: 280,
        priceType: "accommodation",
        rating: 4.5
    },
    {
        id: 2,
        name: "Beachfront Villa Paradise",
        location: "Malibu, California",
        image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop",
        guests: { min: 4, max: 10 },
        amenities: { wifi: true, ac: true, parking: true },
        totalPrice: 3640,
        pricePerNight: 520,
        priceType: "accommodation",
        rating: 5
    },
    {
        id: 3,
        name: "Urban Loft Downtown",
        location: "New York, NY",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
        guests: { min: 1, max: 4 },
        amenities: { wifi: true, ac: false, parking: false },
        totalPrice: 570,
        pricePerNight: 95,
        priceType: "person",
        rating: 4.2
    },
    {
        id: 4,
        name: "Rustic Farmhouse Escape",
        location: "Tuscany, Italy",
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
        guests: { min: 2, max: 8 },
        amenities: { wifi: true, ac: true, parking: true },
        totalPrice: 2380,
        pricePerNight: 340,
        priceType: "accommodation",
        rating: 4.8
    },
    {
        id: 5,
        name: "Modern Lake House",
        location: "Lake Tahoe, Nevada",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
        guests: { min: 3, max: 7 },
        amenities: { wifi: true, ac: true, parking: true },
        totalPrice: 2870,
        pricePerNight: 410,
        priceType: "accommodation",
        rating: 4.6
    },
    {
        id: 6,
        name: "Charming City Apartment",
        location: "Paris, France",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
        guests: { min: 1, max: 3 },
        amenities: { wifi: true, ac: false, parking: false },
        totalPrice: 525,
        pricePerNight: 75,
        priceType: "person",
        rating: 4.3
    },
    {
        id: 7,
        name: "Desert Oasis Retreat",
        location: "Sedona, Arizona",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
        guests: { min: 2, max: 5 },
        amenities: { wifi: true, ac: true, parking: true },
        totalPrice: 2065,
        pricePerNight: 295,
        priceType: "accommodation",
        rating: 4.7
    },
    {
        id: 8,
        name: "Tropical Bungalow",
        location: "Bali, Indonesia",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
        guests: { min: 2, max: 4 },
        amenities: { wifi: true, ac: true, parking: false },
        totalPrice: 455,
        pricePerNight: 65,
        priceType: "person",
        rating: 4.9
    },
    {
        id: 9,
        name: "Alpine Ski Chalet",
        location: "Zermatt, Switzerland",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop",
        guests: { min: 4, max: 12 },
        amenities: { wifi: true, ac: false, parking: true },
        totalPrice: 4760,
        pricePerNight: 680,
        priceType: "accommodation",
        rating: 5
    },
    {
        id: 10,
        name: "Coastal Cottage Getaway",
        location: "Cornwall, UK",
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop",
        guests: { min: 2, max: 6 },
        amenities: { wifi: true, ac: false, parking: true },
        totalPrice: 1540,
        pricePerNight: 220,
        priceType: "accommodation",
        rating: 4.4
    },
    {
        id: 11,
        name: "Historic Townhouse",
        location: "Charleston, SC",
        image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop",
        guests: { min: 2, max: 5 },
        amenities: { wifi: true, ac: true, parking: true },
        totalPrice: 2170,
        pricePerNight: 310,
        priceType: "accommodation",
        rating: 4.1
    },
    {
        id: 12,
        name: "Rainforest Tree House",
        location: "Costa Rica",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
        guests: { min: 1, max: 2 },
        amenities: { wifi: false, ac: false, parking: false },
        totalPrice: 840,
        pricePerNight: 120,
        priceType: "accommodation",
        rating: 3.8
    }
];



const SearchResults: React.FC = () => {
    const totalResults = mockAccommodations.length;

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                Search Results
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                {totalResults} accommodation{totalResults !== 1 ? 's' : ''} found
            </Typography>

            <Grid container spacing={3} columnSpacing={9}>
                {mockAccommodations.map((accommodation) => (
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