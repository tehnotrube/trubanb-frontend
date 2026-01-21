import React, { useState } from 'react';
import {
    Box,
    Typography,
    Stepper,
    Step,
    StepLabel,

} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import BasicInfoStep from "../components/BasicInfoStep.tsx";
import AvailabilityStep from "../components/AvailabilityStep.tsx";

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

const CreateAccommodationPage: React.FC = () => {
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

    const [images, setImages] = useState<string[]>([]);

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

    const handleSubmit = () => {
        console.log('Submitting accommodation:', {
            basicInfo,
            amenities,
            images,
            generalAvailability,
            extraRules,
        });
        // TODO: API call to create accommodation
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
                Create Accommodation
            </Typography>

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
                />
            )}
        </Box>
    );
};

export default CreateAccommodationPage;