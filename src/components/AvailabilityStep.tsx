import React from "react";
import {Box, Button} from "@mui/material";
import type {ExtraRule, PriceDefinition} from "../pages/CreateAccommodationPage.tsx";
import GeneralAvailabilityCard from "./GeneralAvailabilityCard.tsx";
import ExtraRulesCard from "./ExtraRuleCard.tsx";
import AvailabilityCalendar from "./AvailabilityCalendar.tsx";

interface AvailabilityStepProps {
    generalAvailability: PriceDefinition[];
    setGeneralAvailability: React.Dispatch<React.SetStateAction<PriceDefinition[]>>;
    extraRules: ExtraRule[];
    setExtraRules: React.Dispatch<React.SetStateAction<ExtraRule[]>>;
    onBack: () => void;
    onSubmit: () => void;
}

const AvailabilityStep: React.FC<AvailabilityStepProps> = ({
                                                               generalAvailability,
                                                               setGeneralAvailability,
                                                               extraRules,
                                                               setExtraRules,
                                                               onBack,
                                                               onSubmit,
                                                           }) => {
    const handleAddGeneralAvailability = () => {
        const newAvailability: PriceDefinition = {
            id: Date.now(),
            startDate: null,
            endDate: null,
            price: '',
            priceType: 'accommodation',
        };
        setGeneralAvailability([...generalAvailability, newAvailability]);
    };

    const handleRemoveGeneralAvailability = (id: number) => {
        setGeneralAvailability(generalAvailability.filter(avail => avail.id !== id));
    };

    const handleGeneralAvailabilityChange = (id: number, field: string, value: any) => {
        setGeneralAvailability(generalAvailability.map(avail =>
            avail.id === id ? { ...avail, [field]: value } : avail
        ));
    };

    const handleAddExtraRule = () => {
        const newRule: ExtraRule = {
            id: Date.now(),
            type: 'price_override',
            startDate: null,
            endDate: null,
            price: '',
            priceType: 'accommodation',
        };
        setExtraRules([...extraRules, newRule]);
    };

    const handleRemoveExtraRule = (id: number) => {
        setExtraRules(extraRules.filter(rule => rule.id !== id));
    };

    const handleExtraRuleChange = (id: number, field: string, value: any) => {
        setExtraRules(extraRules.map(rule =>
            rule.id === id ? { ...rule, [field]: value } : rule
        ));
    };

    return (
        <Box>
            <GeneralAvailabilityCard
                generalAvailability={generalAvailability}
                onAdd={handleAddGeneralAvailability}
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
                <Button variant="contained" onClick={onSubmit} sx={{ color: 'white' }}>
                    Create Accommodation
                </Button>
            </Box>
        </Box>
    );
};
export default AvailabilityStep;