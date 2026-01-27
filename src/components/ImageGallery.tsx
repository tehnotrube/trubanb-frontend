import React from "react";
import {Box, Card, CardContent, IconButton, Typography} from "@mui/material";
import {ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon} from "@mui/icons-material";

interface ImageGalleryProps {
    images: string[];
    currentIndex: number;
    onNext: () => void;
    onPrev: () => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
                                                       images,
                                                       currentIndex,
                                                       onNext,
                                                       onPrev,
                                                   }) => {
    if (images.length === 0) {
        return (
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="body1" color="text.secondary" textAlign="center">
                        No images available
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Box sx={{ mb: 3 }}>
            <Card>
                <Box sx={{ position: 'relative' }}>
                    {/* Main Image Display */}
                    <Box
                        sx={{
                            width: '100%',
                            height: { xs: 300, sm: 400, md: 500 },
                            position: 'relative',
                            bgcolor: 'black',
                        }}
                    >
                        <Box
                            component="img"
                            src={images[currentIndex]}
                            alt={`Accommodation view ${currentIndex + 1}`}
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                            }}
                        />

                        {/* Navigation Arrows */}
                        {images.length > 1 && (
                            <>
                                <IconButton
                                    onClick={onPrev}
                                    sx={{
                                        position: 'absolute',
                                        left: 16,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'white',
                                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                                    }}
                                >
                                    <ChevronLeftIcon fontSize="large" />
                                </IconButton>

                                <IconButton
                                    onClick={onNext}
                                    sx={{
                                        position: 'absolute',
                                        right: 16,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'white',
                                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                                    }}
                                >
                                    <ChevronRightIcon fontSize="large" />
                                </IconButton>
                            </>
                        )}

                        {/* Image Counter */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 16,
                                right: 16,
                                bgcolor: 'rgba(0, 0, 0, 0.6)',
                                color: 'white',
                                px: 2,
                                py: 1,
                                borderRadius: 1,
                            }}
                        >
                            <Typography variant="body2">
                                {currentIndex + 1} / {images.length}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Thumbnail Strip */}
                    {images.length > 1 && (
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                p: 2,
                                overflowX: 'auto',
                                bgcolor: 'background.paper',
                                borderTop: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            {images.map((image, index) => (
                                <Box
                                    key={index}
                                    onClick={() => {
                                        const diff = index - currentIndex;
                                        if (diff > 0) {
                                            for (let i = 0; i < diff; i++) onNext();
                                        } else if (diff < 0) {
                                            for (let i = 0; i < Math.abs(diff); i++) onPrev();
                                        }
                                    }}
                                    sx={{
                                        minWidth: 80,
                                        height: 60,
                                        borderRadius: 1,
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        border: currentIndex === index ? '3px solid' : '3px solid transparent',
                                        borderColor: currentIndex === index ? 'primary.main' : 'transparent',
                                        opacity: currentIndex === index ? 1 : 0.6,
                                        '&:hover': { opacity: 1 },
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            </Card>
        </Box>
    );
};

export default ImageGallery;