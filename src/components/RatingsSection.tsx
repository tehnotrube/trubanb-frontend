import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Tabs,
    Tab,
    Rating,
    Avatar,
    Divider,
    Stack,
} from '@mui/material';
import { Person, Home } from '@mui/icons-material';

interface RatingData {
    id: string;
    username: string;
    rating: number;
    date: string;
    comment?: string;
}

interface RatingsSectionProps {
    hostRatings: RatingData[];
    accommodationRatings: RatingData[];
}

const RatingsSection: React.FC<RatingsSectionProps> = ({
                                                           hostRatings,
                                                           accommodationRatings,
                                                       }) => {
    const [currentTab, setCurrentTab] = useState(0);

    const calculateAverageRating = (ratings: RatingData[]) => {
        if (ratings.length === 0) return 0;
        const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
        return (sum / ratings.length).toFixed(1);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const hostAverage = calculateAverageRating(hostRatings);
    const accommodationAverage = calculateAverageRating(accommodationRatings);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    const currentRatings = currentTab === 0 ? hostRatings : accommodationRatings;
    const currentAverage = currentTab === 0 ? hostAverage : accommodationAverage;

    return (
        <Card sx={{ mt: 4 }}>
            <CardContent>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                    Ratings & Reviews
                </Typography>

                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
                >
                    <Tab
                        icon={<Person />}
                        iconPosition="start"
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography>Host Ratings</Typography>
                                <Rating
                                    value={parseFloat(hostAverage.toString())}
                                    precision={0.1}
                                    readOnly
                                    size="small"
                                />
                                <Typography variant="body2" color="text.secondary">
                                    ({hostAverage})
                                </Typography>
                            </Box>
                        }
                    />
                    <Tab
                        icon={<Home />}
                        iconPosition="start"
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography>Accommodation Ratings</Typography>
                                <Rating
                                    value={parseFloat(accommodationAverage.toString())}
                                    precision={0.1}
                                    readOnly
                                    size="small"
                                />
                                <Typography variant="body2" color="text.secondary">
                                    ({accommodationAverage})
                                </Typography>
                            </Box>
                        }
                    />
                </Tabs>

                {/* Average Rating Display */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 3,
                        p: 2,
                        bgcolor: 'background.default',
                        borderRadius: 1,
                    }}
                >
                    <Box>
                        <Typography variant="h3" fontWeight="bold" color="primary.main">
                            {currentAverage}
                        </Typography>
                    </Box>
                    <Box>
                        <Rating
                            value={parseFloat(currentAverage.toString())}
                            precision={0.1}
                            readOnly
                            size="large"
                        />
                        <Typography variant="body2" color="text.secondary">
                            Based on {currentRatings.length} review{currentRatings.length !== 1 ? 's' : ''}
                        </Typography>
                    </Box>
                </Box>

                {/* Ratings List */}
                <Stack spacing={2}>
                    {currentRatings.length === 0 ? (
                        <Box sx={{ py: 4, textAlign: 'center' }}>
                            <Typography variant="body1" color="text.secondary">
                                No ratings yet
                            </Typography>
                        </Box>
                    ) : (
                        currentRatings.map((rating, index) => (
                            <Box key={rating.id}>
                                <Stack direction="row" spacing={2} alignItems="flex-start">
                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                        {rating.username.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            mb={0.5}
                                        >
                                            <Typography variant="subtitle1" fontWeight="600">
                                                {rating.username}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDate(rating.date)}
                                            </Typography>
                                        </Stack>
                                        <Rating value={rating.rating} readOnly size="small" sx={{ mb: 1 }} />
                                        {rating.comment && (
                                            <Typography variant="body2" color="text.secondary">
                                                {rating.comment}
                                            </Typography>
                                        )}
                                    </Box>
                                </Stack>
                                {index < currentRatings.length - 1 && <Divider sx={{ mt: 2 }} />}
                            </Box>
                        ))
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default RatingsSection;