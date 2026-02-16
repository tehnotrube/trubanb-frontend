import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Stepper,
    Step,
    StepLabel,
} from '@mui/material';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import BasicInfoStep from "../components/BasicInfoStep.tsx";
import AvailabilityStep from "../components/AvailabilityStep.tsx";
import axios from 'axios';
import { environment } from '../utils/Environment.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import utc from 'dayjs/plugin/utc';

export interface PriceDefinition {
    id: string;
    startDate: Dayjs | null;
    endDate: Dayjs | null;
    price: string;
    priceType: 'accommodation' | 'person';
}

export interface ExtraRule {
    id: string;
    type: string;
    startDate: Dayjs | null;
    endDate: Dayjs | null;
    price: string | null;
    priceType?: 'accommodation' | 'person';
}

export interface BlockedPeriodDTO {
    id: string;
    startDate: string;
    endDate: string;
    price: string;
    reason: string;
    reservationId: string;
}

interface ExtraRuleDTO{
    id: string;
    startDate: string;
    endDate: string;
    overridePrice: string;
}

export interface UploadedImage {
    file: File;
    preview: string;
}

dayjs.extend(utc);
const CreateEditAccommodationPage: React.FC = () => {
    const navigate = useNavigate();
    const { id: accommodationId } = useParams<{ id?: string }>();
    const isEditMode = Boolean(accommodationId);

    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(isEditMode);

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
    const [existingPhotoUrls, setExistingPhotoUrls] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Step 2 - Availability & Pricing
    const [generalAvailability, setGeneralAvailability] = useState<PriceDefinition[]>([
        {
            id: '1',
            startDate: null,
            endDate: null,
            price: '',
            priceType: 'accommodation',
        }
    ]);

    const [extraRules, setExtraRules] = useState<ExtraRule[]>([]);

    const steps = ['Basic Information', 'Availability & Pricing'];

    // Fetch accommodation data if in edit mode
    // FIXED: Moved the fetch logic directly into useEffect to avoid setState in effect warning
    useEffect(() => {
        if (!isEditMode || !accommodationId) return;

        const fetchData = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setSubmitError('You must be logged in.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `${environment}/api/accommodations/${accommodationId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const data = response.data;

                // Parse location
                const locationParts = data.location.split(', ');
                const [address = '', city = '', zip = '', country = ''] = locationParts;

                setBasicInfo({
                    name: data.name,
                    address,
                    city,
                    country,
                    zip,
                    minGuests: String(data.minGuests),
                    maxGuests: String(data.maxGuests),
                });

                // Parse amenities
                setAmenities({
                    wifi: data.amenities.includes('WiFi'),
                    ac: data.amenities.includes('AC'),
                    parking: data.amenities.includes('Parking'),
                });

                // Set existing photos
                setExistingPhotoUrls(data.photoUrls || []);

                // Set general availability (base price)
                setGeneralAvailability([{
                    id: '1',
                    startDate: null,
                    endDate: null,
                    price: String(data.basePrice),
                    priceType: data.isPerUnit ? 'accommodation' : 'person',
                }]);

                // Convert blocked periods and accommodation rules to extraRules
                const combinedRules: ExtraRule[] = [
                    ...(data.accommodationRules || []).map((rule: ExtraRuleDTO) => ({
                        id: rule.id,
                        type: 'price_override',
                        startDate: dayjs(`${rule.startDate}T00:00:00.000Z`),
                        endDate: dayjs(`${rule.endDate}T00:00:00.000Z`),
                        price: rule.overridePrice,
                    })),
                    ...(data.blockedPeriods || [])
                        .filter((period: BlockedPeriodDTO) => period.reason === 'MANUAL')
                        .map((period: BlockedPeriodDTO) => ({
                            id: period.reservationId,
                            type: 'unavailability',
                            startDate: dayjs(`${period.startDate}T00:00:00.000Z`).utc(),
                            endDate: dayjs(`${period.endDate}T00:00:00.000Z`).utc(),
                            price: null,
                        }))
                ];

                setExtraRules(combinedRules);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching accommodation:', error);
                setSubmitError('Failed to load accommodation data');
                setLoading(false);
            }
        };

        fetchData();
    }, [isEditMode, accommodationId]);


    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    // In CreateEditAccommodationPage.tsx

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

            let finalAccommodationId: string;

            if (isEditMode && accommodationId) {
                // Update existing accommodation
                await axios.put(
                    `${environment}/api/accommodations/${accommodationId}`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                finalAccommodationId = accommodationId;
            } else {
                // Create new accommodation
                const createResponse = await axios.post(
                    `${environment}/api/accommodations`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                finalAccommodationId = createResponse.data.id;
            }

            // Upload new images if any
            if (images.length > 0) {
                const formData = new FormData();
                images.forEach((image) => formData.append('photos', image.file));

                await axios.post(
                    `${environment}/api/accommodations/${finalAccommodationId}/photos`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
            }

            const toIso = (date: Dayjs | null): string => {
                if (!date) throw new Error('Date is required');
                return date.toDate().toISOString();
            };

            // Handle rules and blocked periods
            if (isEditMode && accommodationId) {
                await handleRulesUpdate(finalAccommodationId, token);
            } else {
                await handleRulesCreate(finalAccommodationId, token, toIso);
            }

            setIsSubmitting(false);
            navigate('/');
        } catch (error) {
            console.error('Error saving accommodation:', error);
            setSubmitError((error as {response?: {data?: {message?: string}}}).response?.data?.message || 'Failed to save accommodation');
            setIsSubmitting(false);
        }
    };

// Helper function to handle rules creation (for new accommodations)
    const handleRulesCreate = async (accommodationId: string, token: string, toIso: (date: Dayjs | null) => string) => {
        const rulePromises: Promise<unknown>[] = [];

        extraRules
            .filter((rule) => rule.startDate && rule.endDate)
            .forEach((rule) => {
                const dto: {
                    startDate: string;
                    endDate: string;
                    periodType: string;
                    overridePrice?: number;
                    multiplier?: number;
                } = {
                    startDate: toIso(rule.startDate),
                    endDate: toIso(rule.endDate),
                    periodType: 'CUSTOM',
                };

                if (rule.type === 'price_override' && rule.price) {
                    dto.overridePrice = Number(rule.price);
                    rulePromises.push(
                        axios.post(
                            `${environment}/api/accommodations/${accommodationId}/rules`,
                            dto,
                            { headers: { Authorization: `Bearer ${token}` } }
                        )
                    );
                }

                if (rule.type === 'unavailability') {
                    rulePromises.push(
                        axios.post(
                            `${environment}/api/reservations/blocks`,
                            {
                                accommodationId: accommodationId,
                                startDate: dto.startDate,
                                endDate: dto.endDate,
                            },
                            { headers: { Authorization: `Bearer ${token}` } }
                        )
                    );
                }
            });

        if (rulePromises.length > 0) {
            await Promise.all(rulePromises);
        }
    };

// Helper function to handle rules update (for existing accommodations)
    // Helper function to handle rules update (for existing accommodations)
    const handleRulesUpdate = async (accommodationId: string, token: string) => {
        // Fetch current rules from backend to compare
        const response = await axios.get(
            `${environment}/api/accommodations/${accommodationId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const currentData = response.data;
        const currentRules = currentData.accommodationRules || [];
        const currentBlocks = currentData.blockedPeriods.filter((block:BlockedPeriodDTO)=> block.reason=='MANUAL') || [];

        // Separate current and new rules by type
        const currentPriceOverrides = new Set(currentRules.map((r: ExtraRuleDTO) => r.id));
        const currentUnavailability = new Set(currentBlocks.map((b: BlockedPeriodDTO) => b.reservationId));

        const clientPriceOverrides = extraRules.filter(r => r.type === 'price_override');
        const clientUnavailability = extraRules.filter(r => r.type === 'unavailability');

        const toIso = (date: Dayjs | null): string => {
            if (!date) throw new Error('Date is required');
            return date.toDate().toISOString();
        };

        const promises: Promise<unknown>[] = [];

        // Handle price override rules
        clientPriceOverrides.forEach(rule => {
            if (!rule.startDate || !rule.endDate) return;

            const dto = {
                startDate: toIso(rule.startDate),
                endDate: toIso(rule.endDate),
                periodType: 'CUSTOM',
                overridePrice: Number(rule.price),
            };

            if (rule.id && currentPriceOverrides.has(rule.id)) {
                // Update existing rule (if PATCH is supported for rules)
                promises.push(
                    axios.patch(
                        `${environment}/api/accommodations/${accommodationId}/rules/${rule.id}`,
                        dto,
                        { headers: { Authorization: `Bearer ${token}` } }
                    )
                );
                currentPriceOverrides.delete(rule.id);
            } else {
                // Create new rule
                promises.push(
                    axios.post(
                        `${environment}/api/accommodations/${accommodationId}/rules`,
                        dto,
                        { headers: { Authorization: `Bearer ${token}` } }
                    )
                );
            }
        });

        // Delete removed price override rules
        currentPriceOverrides.forEach(ruleId => {
            promises.push(
                axios.delete(
                    `${environment}/api/accommodations/${accommodationId}/rules/${ruleId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
            );
        });

        // Handle unavailability blocks - DELETE ALL existing blocks first
        // Delete all current blocks
        const deleteBlockPromises = Array.from(currentUnavailability).map(blockId =>
            axios.delete(
                `${environment}/api/reservations/blocks/${blockId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
        );

        // Wait for all deletions to complete
        if (deleteBlockPromises.length > 0) {
            await Promise.all(deleteBlockPromises);
        }

        // Create all blocks from current state (both existing and new)
        clientUnavailability.forEach(rule => {
            if (!rule.startDate || !rule.endDate) return;

            const dto = {
                accommodationId: accommodationId,
                startDate: toIso(rule.startDate),
                endDate: toIso(rule.endDate),
            };

            // Always create (since we deleted all existing blocks)
            promises.push(
                axios.post(
                    `${environment}/api/reservations/blocks`,
                    dto,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
            );
        });

        if (promises.length > 0) {
            await Promise.all(promises);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
                {isEditMode ? 'Edit Accommodation' : 'Create Accommodation'}
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
                    existingPhotoUrls={existingPhotoUrls}
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

export default CreateEditAccommodationPage;