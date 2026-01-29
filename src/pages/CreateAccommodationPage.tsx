import React, { useState } from 'react';
import {
    Box,
    Typography,
    Stepper,
    Step,
    StepLabel,

} from '@mui/material';
import { Dayjs } from 'dayjs';
import BasicInfoStep from "../components/BasicInfoStep.tsx";
import AvailabilityStep from "../components/AvailabilityStep.tsx";
import axios from 'axios';
import { environment } from '../utils/environment.tsx';
import { useNavigate } from 'react-router-dom';

export interface PriceDefinition {
    id: number;
    startDate: Dayjs | null;
    endDate: Dayjs | null;
    price: string;
    priceType: 'accommodation' | 'person';
}

export interface ExtraRule {
    id: number;
    type: 'price_override' | 'unavailability';
    startDate: Dayjs | null;
    endDate: Dayjs | null;
    price?: string;
    priceType?: 'accommodation' | 'person';
}

export interface UploadedImage {
    file: File;
    preview: string;
}

const CreateAccommodationPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);

    // Step 1 - Basic Info
    const [basicInfo, setBasicInfo] = useState({
        name: '',
        address: '',
        city: '',
        country: '',
        zip: '',
        minGuests: '1',
        maxGuests: '2',
    });

    const [amenities, setAmenities] = useState({
        wifi: false,
        ac: false,
        parking: false,
    });

    const [images, setImages] = useState<UploadedImage[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Step 2 - Availability & Pricing
    const [generalAvailability, setGeneralAvailability] = useState<PriceDefinition[]>([
        {
            id: 1,
            startDate: null,
            endDate: null,
            price: '',
            priceType: 'accommodation',
        }
    ]);

    const [extraRules, setExtraRules] = useState<ExtraRule[]>([]);

    const steps = ['Basic Information', 'Availability & Pricing'];

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = async () => {
        setSubmitError(null);

        const token = localStorage.getItem('accessToken');
        if (!token) {
            setSubmitError('You must be logged in as a host to create accommodation.');
            return;
        }

        const basePriceEntry = generalAvailability.find((entry) => entry.price?.trim());
        if (!basePriceEntry || !basePriceEntry.price) {
            setSubmitError('Please provide a base price in availability.');
            return;
        }

        const locationParts = [basicInfo.address, basicInfo.city, basicInfo.zip, basicInfo.country]
            .map((p) => p.trim())
            .filter(Boolean);

        const amenitiesList: string[] = [];
        if (amenities.wifi) amenitiesList.push('WiFi');
        if (amenities.ac) amenitiesList.push('AC');
        if (amenities.parking) amenitiesList.push('Parking');

        const payload = {
            name: basicInfo.name,
            location: locationParts.join(', '),
            amenities: amenitiesList,
            minGuests: Number(basicInfo.minGuests),
            maxGuests: Number(basicInfo.maxGuests),
            basePrice: Number(basePriceEntry.price),
            isPerUnit: basePriceEntry.priceType === 'accommodation',
        };

        try {
            setIsSubmitting(true);

            const createResponse = await axios.post(
                `${environment}/api/accommodations`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const accommodationId = createResponse.data.id;

            if (images.length > 0) {
                const formData = new FormData();
                images.forEach((image) => formData.append('photos', image.file));

                await axios.post(
                    `${environment}/api/accommodations/${accommodationId}/photos`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
            }

            const toIso = (date: Dayjs | null) => (date ? date.toDate().toISOString() : null);

            const rulePromises: Promise<any>[] = [];

            generalAvailability
                .filter((entry) => entry.startDate && entry.endDate && entry.price)
                .forEach((entry) => {
                    rulePromises.push(
                        axios.post(
                            `${environment}/api/accommodations/${accommodationId}/rules`,
                            {
                                startDate: toIso(entry.startDate),
                                endDate: toIso(entry.endDate),
                                overridePrice: Number(entry.price),
                                periodType: 'CUSTOM',
                            },
                            { headers: { Authorization: `Bearer ${token}` } }
                        )
                    );
                });

            extraRules
                .filter((rule) => rule.startDate && rule.endDate)
                .forEach((rule) => {
                    const dto: any = {
                        startDate: toIso(rule.startDate),
                        endDate: toIso(rule.endDate),
                        periodType: 'CUSTOM',
                    };

                    if (rule.type === 'price_override' && rule.price) {
                        dto.overridePrice = Number(rule.price);
                    }

                    if (rule.type === 'unavailability') {
                        dto.multiplier = 0;
                    }

                    rulePromises.push(
                        axios.post(
                            `${environment}/api/accommodations/${accommodationId}/rules`,
                            dto,
                            { headers: { Authorization: `Bearer ${token}` } }
                        )
                    );
                });

            if (rulePromises.length > 0) {
                await Promise.all(rulePromises);
            }

            setIsSubmitting(false);
            navigate('/');
        } catch (err: any) {
            console.error('Error creating accommodation:', err);
            setSubmitError(err.response?.data?.message || 'Failed to create accommodation');
            setIsSubmitting(false);
        }
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
                Create Accommodation
            </Typography>

            {submitError && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {submitError}
                </Typography>
            )}

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {activeStep === 0 && (
                <BasicInfoStep
                    basicInfo={basicInfo}
                    setBasicInfo={setBasicInfo}
                    amenities={amenities}
                    setAmenities={setAmenities}
                    images={images}
                    setImages={setImages}
                    onNext={handleNext}
                />
            )}

            {activeStep === 1 && (
                <AvailabilityStep
                    generalAvailability={generalAvailability}
                    setGeneralAvailability={setGeneralAvailability}
                    extraRules={extraRules}
                    setExtraRules={setExtraRules}
                    onBack={handleBack}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            )}
        </Box>
    );
};

export default CreateAccommodationPage;