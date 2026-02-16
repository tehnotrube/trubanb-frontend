import React from "react";
import {Box, Button} from "@mui/material";
import type {ExtraRule, PriceDefinition} from "../pages/CreateAccommodationPage.tsx";
import GeneralAvailabilityCard from "./GeneralAvailabilityCard.tsx";
import ExtraRulesCard from "./ExtraRuleCard.tsx";
import AvailabilityCalendar from "./AvailabilityCalendar.tsx";
import type {PickerValue} from "@mui/x-date-pickers/internals";

interface AvailabilityStepProps {
    generalAvailability: PriceDefinition[];
    setGeneralAvailability: React.Dispatch<React.SetStateAction<PriceDefinition[]>>;
    extraRules: ExtraRule[];
    setExtraRules: React.Dispatch<React.SetStateAction<ExtraRule[]>>;
    onBack: () => void;
    onSubmit: () => void;
    isSubmitting?: boolean;
    isEditMode?: boolean; // ADDED: isEditMode prop
}

const AvailabilityStep: React.FC<AvailabilityStepProps> = ({
                                                               generalAvailability,
                                                               setGeneralAvailability,
                                                               extraRules,
                                                               setExtraRules,
                                                               onBack,
                                                               onSubmit,
                                                               isSubmitting = false,
                                                               isEditMode = false, // ADDED: isEditMode with default value
                                                           }) => {

    const handleRemoveGeneralAvailability = (id: string) => {
        setGeneralAvailability(generalAvailability.filter(avail => avail.id !== id));
    };

    const handleGeneralAvailabilityChange = (id: string, field: string, value: string | PickerValue | null) => {
        setGeneralAvailability(generalAvailability.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleAddExtraRule = () => {
        const newRule: ExtraRule = {
            id: Date.now().toString(),
            type: 'price_override',
            startDate: null,
            endDate: null,
            price: '',
            priceType: 'accommodation',
        };
        setExtraRules([...extraRules, newRule]);
    };

    const handleRemoveExtraRule = (id: string) => {
        setExtraRules(extraRules.filter(rule => rule.id !== id));
    };

    const handleExtraRuleChange = (id: string, field: string, value: string | PickerValue | null) => {
        setExtraRules(extraRules.map(rule =>
            rule.id === id ? { ...rule, [field]: value } : rule
        ));
    };

    return (
        <Box>
            <GeneralAvailabilityCard
                generalAvailability={generalAvailability}
                onRemove={handleRemoveGeneralAvailability}
                onChange={handleGeneralAvailabilityChange}
            />

            <ExtraRulesCard
                extraRules={extraRules}
                onAdd={handleAddExtraRule}
                onRemove={handleRemoveExtraRule}
                onChange={handleExtraRuleChange}
            />

            <AvailabilityCalendar
                generalAvailability={generalAvailability}
                extraRules={extraRules}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button onClick={onBack}>
                    Back
                </Button>
                <Button variant="contained" onClick={onSubmit} sx={{ color: 'white' }} disabled={isSubmitting}>
                    {/* UPDATED: Dynamic button text based on isEditMode and isSubmitting */}
                    {isSubmitting
                        ? (isEditMode ? 'Updating...' : 'Creating...')
                        : (isEditMode ? 'Update Accommodation' : 'Create Accommodation')
                    }
                </Button>
            </Box>
        </Box>
    );
};

export default AvailabilityStep;