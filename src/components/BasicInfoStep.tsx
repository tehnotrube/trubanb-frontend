import React from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControlLabel,
    FormGroup, IconButton,
    TextField,
    Typography
} from "@mui/material";
import {Close as CloseIcon, CloudUpload as CloudUploadIcon} from "@mui/icons-material";

interface BasicInfo {
    name: string;
    address: string;
    city: string;
    country: string;
    zip: string;
    minGuests: string;
    maxGuests: string;
}

interface Amenities {
    wifi: boolean;
    ac: boolean;
    parking: boolean;
}

interface BasicInfoStepProps {
    basicInfo: BasicInfo;
    setBasicInfo: React.Dispatch<React.SetStateAction<BasicInfo>>;
    amenities: Amenities;
    setAmenities: React.Dispatch<React.SetStateAction<Amenities>>;
    images: { file: File; preview: string }[];
    setImages: React.Dispatch<React.SetStateAction<{ file: File; preview: string }[]>>;
    onNext: () => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
                                                         basicInfo,
                                                         setBasicInfo,
                                                         amenities,
                                                         setAmenities,
                                                         images,
                                                         setImages,
                                                         onNext,
                                                     }) => {
    const handleBasicInfoChange = (field: keyof BasicInfo, value: string) => {
        setBasicInfo({ ...basicInfo, [field]: value });
    };

    const handleAmenityToggle = (amenity: keyof Amenities) => {
        setAmenities({ ...amenities, [amenity]: !amenities[amenity] });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages = Array.from(files)
                .slice(0, 10 - images.length)
                .map((file) => ({ file, preview: URL.createObjectURL(file) }));
            setImages([...images, ...newImages]);
        }
    };

    const handleImageRemove = (index: number) => {
        const imageToRemove = images[index];
        if (imageToRemove?.preview) {
            URL.revokeObjectURL(imageToRemove.preview);
        }
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Basic Information
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    <TextField
                        label="Accommodation Name"
                        variant="outlined"
                        fullWidth
                        value={basicInfo.name}
                        onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                        sx={{ gridColumn: '1 / -1' }}
                    />

                    <TextField
                        label="Address"
                        variant="outlined"
                        fullWidth
                        value={basicInfo.address}
                        onChange={(e) => handleBasicInfoChange('address', e.target.value)}
                    />

                    <TextField
                        label="City"
                        variant="outlined"
                        value={basicInfo.city}
                        onChange={(e) => handleBasicInfoChange('city', e.target.value)}
                    />
                    <TextField
                        label="Country"
                        variant="outlined"
                        value={basicInfo.country}
                        onChange={(e) => handleBasicInfoChange('country', e.target.value)}
                    />

                    <TextField
                        label="ZIP Code"
                        variant="outlined"
                        value={basicInfo.zip}
                        onChange={(e) => handleBasicInfoChange('zip', e.target.value)}
                    />


                    <TextField
                        label="Minimum Guests"
                        type="number"
                        variant="outlined"
                        value={basicInfo.minGuests}
                        onChange={(e) => handleBasicInfoChange('minGuests', e.target.value)}
                        inputProps={{ min: 1 }}
                    />
                    <TextField
                        label="Maximum Guests"
                        type="number"
                        variant="outlined"
                        value={basicInfo.maxGuests}
                        onChange={(e) => handleBasicInfoChange('maxGuests', e.target.value)}
                        inputProps={{ min: 1 }}
                    />
                    <Box>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                            Amenities
                        </Typography>
                        <FormGroup sx={{ display: 'flex', flexDirection:'row' }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={amenities.wifi}
                                        onChange={() => handleAmenityToggle('wifi')}
                                    />
                                }
                                label="WiFi"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={amenities.ac}
                                        onChange={() => handleAmenityToggle('ac')}
                                    />
                                }
                                label="AC"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={amenities.parking}
                                        onChange={() => handleAmenityToggle('parking')}
                                    />
                                }
                                label="Free Parking"
                            />
                        </FormGroup>
                    </Box>


                    <Box sx={{ gridColumn: '1 / -1' }}>
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                            Images (up to 10)
                        </Typography>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<CloudUploadIcon />}
                            disabled={images.length >= 10}
                            sx={{ mb: 2 }}
                        >
                            Upload Images
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                            />
                        </Button>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                            {images.length}/10 images uploaded
                        </Typography>

                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 2 }}>
                            {images.map((image, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        position: 'relative',
                                        paddingTop: '100%',
                                        borderRadius: 1,
                                        overflow: 'hidden',
                                        border: '1px solid #e0e0e0',
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={image.preview}
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <IconButton
                                        onClick={() => handleImageRemove(index)}
                                        sx={{
                                            position: 'absolute',
                                            top: 4,
                                            right: 4,
                                            bgcolor: 'rgba(0, 0, 0, 0.6)',
                                            color: 'white',
                                            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
                                            padding: 0.5,
                                        }}
                                        size="small"
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                    <Button variant="contained" onClick={onNext} sx={{ color: 'white' }}>
                        Next
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};


export default BasicInfoStep;