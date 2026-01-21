import React, {useState} from "react";
import dayjs from "dayjs";
import {Box, Card, CardContent, Chip, Grid, IconButton, Typography} from "@mui/material";
import {ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon} from "@mui/icons-material";
import type {ExtraRule, PriceDefinition} from "../pages/CreateAccommodationPage.tsx";

interface AvailabilityCalendarProps {
    generalAvailability: PriceDefinition[];
    extraRules: ExtraRule[];
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
                                                                       generalAvailability,
                                                                       extraRules,
                                                                   }) => {
    const [calendarMonth, setCalendarMonth] = useState(dayjs());

    const months = [];
    for (let i = 0; i < 2; i++) {
        const month = calendarMonth.add(i, 'month');
        months.push(month);
    }

    return (
        <Box sx={{ mt: 3, maxWidth: 1000, mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600,textAlign: 'center' }}>
                    Availability Calendar Preview
                </Typography>

            </Box>
            <Box>
                <Box display='flex' justifyContent='center' alignItems='center' flexDirection='row'>
                    <IconButton onClick={() => setCalendarMonth(calendarMonth.subtract(1, 'month'))}>
                        <ChevronLeftIcon />
                    </IconButton>

                    <Grid container spacing={3}>
                        {months.map((month, monthIndex) => (
                            <Grid item xs={12} md={6} key={monthIndex}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
                                            {month.format('MMMM YYYY')}
                                        </Typography>
                                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
                                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                                <Box key={day} sx={{ textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', py: 1 }}>
                                                    {day}
                                                </Box>
                                            ))}
                                            {Array.from({ length: month.startOf('month').day() }).map((_, i) => (
                                                <Box key={`empty-${i}`} />
                                            ))}
                                            {Array.from({ length: month.daysInMonth() }).map((_, i) => {
                                                const date = month.date(i + 1);

                                                const isInGeneral = generalAvailability.some(avail =>
                                                    avail.startDate && avail.endDate &&
                                                    date.isAfter(avail.startDate.subtract(1, 'day')) &&
                                                    date.isBefore(avail.endDate.add(1, 'day'))
                                                );

                                                const unavailableRule = extraRules.find(rule =>
                                                    rule.type === 'unavailability' &&
                                                    rule.startDate && rule.endDate &&
                                                    date.isAfter(rule.startDate.subtract(1, 'day')) &&
                                                    date.isBefore(rule.endDate.add(1, 'day'))
                                                );

                                                const overrideRule = extraRules.find(rule =>
                                                    rule.type === 'price_override' &&
                                                    rule.startDate && rule.endDate &&
                                                    date.isAfter(rule.startDate.subtract(1, 'day')) &&
                                                    date.isBefore(rule.endDate.add(1, 'day'))
                                                );

                                                let bgColor = 'white';
                                                if (unavailableRule) bgColor = '#ffebee';
                                                else if (overrideRule) bgColor = '#fff3e0';
                                                else if (isInGeneral) bgColor = '#e8f5e9';

                                                return (
                                                    <Box
                                                        key={i}
                                                        sx={{
                                                            textAlign: 'center',
                                                            py: 1.5,
                                                            fontSize: '1rem',
                                                            bgcolor: bgColor,
                                                            borderRadius: 1,
                                                            border: '1px solid #e0e0e0',
                                                            cursor: 'default',
                                                        }}
                                                    >
                                                        {i + 1}
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <IconButton onClick={() => setCalendarMonth(calendarMonth.add(1, 'month'))}>
                        <ChevronRightIcon />
                    </IconButton>
                </Box>
            </Box>
            <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Chip label="Available" sx={{ bgcolor: '#e8f5e9' }} />
                <Chip label="Price Override" sx={{ bgcolor: '#fff3e0' }} />
                <Chip label="Unavailable" sx={{ bgcolor: '#ffebee' }} />
            </Box>
        </Box>
    );
};


export default AvailabilityCalendar;