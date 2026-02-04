import React from "react";
import {Box, Card, CardContent, CardMedia, Chip, Rating, Typography} from "@mui/material";
import {
    AcUnit as AcIcon, LocalParking as ParkingIcon,
    LocationOn as LocationIcon,
    People as PeopleIcon,
    Wifi as WifiIcon
} from "@mui/icons-material";
import type {Accommodation} from "../models.tsx";
import {useNavigate} from "react-router-dom";

interface AccommodationCardProps {
    accommodation: Accommodation;
}

const AccommodationCard: React.FC<AccommodationCardProps> = ({ accommodation }) => {
    const navigate = useNavigate();

    return (
        <Card sx={{
            height: '100%',
            width: '100%',
            maxWidth: 320,
            minWidth: 320,
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
            }

        }}
        onClick={()=>navigate(`/accommodation/${accommodation.id}`)}>
            <CardMedia
                component="img"
                height="180"
                image={accommodation.image}
                alt={accommodation.name}
                sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                    {accommodation.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                    <Rating value={accommodation.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary">
                        {accommodation.rating.toFixed(1)}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, color: 'text.secondary' }}>
                    <LocationIcon sx={{ fontSize: 18, mr: 0.5 }} />
                    <Typography variant="body2">{accommodation.location}</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <PeopleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                        {accommodation.guests.min}-{accommodation.guests.max} guests
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    {accommodation.amenities.wifi && (
                        <Chip
                            icon={<WifiIcon />}
                            label="WiFi"
                            size="small"
                            variant="outlined"
                        />
                    )}
                    {accommodation.amenities.ac && (
                        <Chip
                            icon={<AcIcon />}
                            label="AC"
                            size="small"
                            variant="outlined"
                        />
                    )}
                    {accommodation.amenities.parking && (
                        <Chip
                            icon={<ParkingIcon />}
                            label="Parking"
                            size="small"
                            variant="outlined"
                        />
                    )}
                </Box>

                <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline' }}>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            ${accommodation.totalPrice}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            ${accommodation.pricePerNight} per {accommodation.priceType} / night
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};


export default AccommodationCard;