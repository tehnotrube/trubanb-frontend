import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Typography,
  Divider,
} from "@mui/material";
import {
  AcUnit as AcIcon,
  LocalParking as ParkingIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Wifi as WifiIcon,
} from "@mui/icons-material";
import type { Accommodation } from "../models.tsx";
import { useNavigate } from "react-router-dom";

interface AccommodationCardProps {
  accommodation: Accommodation;
}

const AccommodationCard: React.FC<AccommodationCardProps> = ({ accommodation }) => {
  const navigate = useNavigate();

  const hasDates = accommodation.nights !== undefined && accommodation.nights > 0;
  const isPerAccommodation = accommodation.priceType === "accommodation";

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <Card
      sx={{
        height: "100%",
        width: "100%",
        maxWidth: 320,
        minWidth: 320,
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
        cursor: "pointer",
      }}
      onClick={() => navigate(`/accommodation/${accommodation.id}`)}
    >
      <CardMedia
        component="img"
        height="180"
        image={accommodation.image}
        alt={accommodation.name}
        sx={{ objectFit: "cover" }}
      />

      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
          {accommodation.name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
          <Rating value={accommodation.rating} precision={0.1} readOnly size="small" />
          <Typography variant="body2" color="text.secondary">
            {accommodation.rating.toFixed(1)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5, color: "text.secondary" }}>
          <LocationIcon sx={{ fontSize: 18, mr: 0.5 }} />
          <Typography variant="body2">{accommodation.location}</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <PeopleIcon sx={{ fontSize: 18, color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            {accommodation.guests.min}–{accommodation.guests.max} guests
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          {accommodation.amenities.wifi && (
            <Chip icon={<WifiIcon />} label="WiFi" size="small" variant="outlined" />
          )}
          {accommodation.amenities.ac && (
            <Chip icon={<AcIcon />} label="AC" size="small" variant="outlined" />
          )}
          {accommodation.amenities.parking && (
            <Chip icon={<ParkingIcon />} label="Parking" size="small" variant="outlined" />
          )}
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* ── Price section ──────────────────────────────────────── */}
        <Box sx={{ mt: "auto" }}>
          {hasDates && accommodation.totalPrice > 0 ? (
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "primary.main" }}>
                {formatPrice(accommodation.totalPrice)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                total for {accommodation.nights} night{accommodation.nights !== 1 ? "s" : ""}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatPrice(accommodation.pricePerNight)} / {isPerAccommodation ? "accommodation" : "person"} / night
              </Typography>
            </Box>
          ) : (
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                {formatPrice(accommodation.pricePerNight)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                per {isPerAccommodation ? "accommodation" : "person"} / night
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AccommodationCard;