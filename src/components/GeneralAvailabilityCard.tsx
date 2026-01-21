import React from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    FormControl, FormControlLabel,
    FormLabel,
    IconButton, Radio,
    RadioGroup,
    TextField,
    Typography
} from "@mui/material";
import {Add as AddIcon, Delete as DeleteIcon} from "@mui/icons-material";
import {DatePicker} from "@mui/x-date-pickers";
import type {PriceDefinition} from "../pages/CreateAccommodationPage.tsx";

interface GeneralAvailabilityCardProps {
    generalAvailability: PriceDefinition[];
    onAdd: () => void;
    onRemove: (id: number) => void;
    onChange: (id: number, field: string, value: any) => void;
}

const GeneralAvailabilityCard: React.FC<GeneralAvailabilityCardProps> = ({
                                                                             generalAvailability,
                                                                             onAdd,
                                                                             onRemove,
                                                                             onChange,
                                                                         }) => {
    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        General Availability & Pricing
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={onAdd}
                    >
                        Add Availability Period
                    </Button>
                </Box>

                {generalAvailability.map((avail) => (
                    <Card key={avail.id} variant="outlined" sx={{ mb: 2, p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                            {generalAvailability.length > 1 && (
                                <IconButton onClick={() => onRemove(avail.id)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            )}
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                                <DatePicker
                                    label="Start Date"
                                    value={avail.startDate}
                                    onChange={(date) => onChange(avail.id, 'startDate', date)}
                                />
                                <DatePicker
                                    label="End Date"
                                    value={avail.endDate}
                                    onChange={(date) => onChange(avail.id, 'endDate', date)}
                                />
                            </Box>

                            <TextField
                                label="Price"
                                type="number"
                                variant="outlined"
                                value={avail.price}
                                onChange={(e) => onChange(avail.id, 'price', e.target.value)}
                                inputProps={{ min: 0 }}
                            />

                            <FormControl>
                                <FormLabel>Price Type</FormLabel>
                                <RadioGroup
                                    row
                                    value={avail.priceType}
                                    onChange={(e) => onChange(avail.id, 'priceType', e.target.value as 'accommodation' | 'person')}
                                >
                                    <FormControlLabel value="accommodation" control={<Radio />} label="Per Unit Per Night" />
                                    <FormControlLabel value="person" control={<Radio />} label="Per Person Per Night" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Card>
                ))}
            </CardContent>
        </Card>
    );
};


export default GeneralAvailabilityCard;