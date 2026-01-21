import React from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    FormControl, FormControlLabel, FormLabel,
    IconButton,
    InputLabel,
    MenuItem, Radio, RadioGroup,
    Select, TextField,
    Typography
} from "@mui/material";
import {Add as AddIcon, Delete as DeleteIcon} from "@mui/icons-material";
import {DatePicker} from "@mui/x-date-pickers";
import type {ExtraRule} from "../pages/CreateAccommodationPage.tsx";

interface ExtraRulesCardProps {
    extraRules: ExtraRule[];
    onAdd: () => void;
    onRemove: (id: number) => void;
    onChange: (id: number, field: string, value: any) => void;
}

const ExtraRulesCard: React.FC<ExtraRulesCardProps> = ({
                                                           extraRules,
                                                           onAdd,
                                                           onRemove,
                                                           onChange,
                                                       }) => {
    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Extra Rules
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={onAdd}
                    >
                        Add Rule
                    </Button>
                </Box>

                {extraRules.map((rule) => (
                    <Card key={rule.id} variant="outlined" sx={{ mb: 2, p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <FormControl sx={{ minWidth: 200 }}>
                                <InputLabel>Rule Type</InputLabel>
                                <Select
                                    value={rule.type}
                                    label="Rule Type"
                                    onChange={(e) => onChange(rule.id, 'type', e.target.value)}
                                >
                                    <MenuItem value="price_override">Price Override</MenuItem>
                                    <MenuItem value="unavailability">Unavailability</MenuItem>
                                </Select>
                            </FormControl>
                            <IconButton onClick={() => onRemove(rule.id)} color="error">
                                <DeleteIcon />
                            </IconButton>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
                            <DatePicker
                                label="Start Date"
                                value={rule.startDate}
                                onChange={(date) => onChange(rule.id, 'startDate', date)}
                            />
                            <DatePicker
                                label="End Date"
                                value={rule.endDate}
                                onChange={(date) => onChange(rule.id, 'endDate', date)}
                            />
                        </Box>

                        {rule.type === 'price_override' && (
                            <>
                                <TextField
                                    label="Override Price"
                                    type="number"
                                    variant="outlined"
                                    fullWidth
                                    value={rule.price || ''}
                                    onChange={(e) => onChange(rule.id, 'price', e.target.value)}
                                    inputProps={{ min: 0 }}
                                    sx={{ mb: 2 }}
                                />
                                <FormControl>
                                    <FormLabel>Price Type</FormLabel>
                                    <RadioGroup
                                        row
                                        value={rule.priceType || 'accommodation'}
                                        onChange={(e) => onChange(rule.id, 'priceType', e.target.value)}
                                    >
                                        <FormControlLabel value="accommodation" control={<Radio />} label="Per Unit Per Night" />
                                        <FormControlLabel value="person" control={<Radio />} label="Per Person Per Night" />
                                    </RadioGroup>
                                </FormControl>
                            </>
                        )}
                    </Card>
                ))}
            </CardContent>
        </Card>
    );
};


export default ExtraRulesCard;