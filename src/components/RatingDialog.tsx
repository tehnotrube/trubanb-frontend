import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Rating,
    TextField,
    Tabs,
    Tab,
    Stack,
    IconButton,
    Tooltip,
} from '@mui/material';
import { Person, Home, Edit, Delete } from '@mui/icons-material';

interface ExistingRating {
    rating: number;
    comment?: string;
}

interface RatingDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmitHost?: (rating: number, comment?: string) => void;
    onSubmitAccommodation?: (rating: number, comment?: string) => void;
    onDeleteHost?: () => void;
    onDeleteAccommodation?: () => void;
    accommodationName: string;
    guestName: string;
    existingHostRating?: ExistingRating;
    existingAccommodationRating?: ExistingRating;
}

const RatingDialog: React.FC<RatingDialogProps> = ({
                                                       open,
                                                       onClose,
                                                       onSubmitHost,
                                                       onSubmitAccommodation,
                                                       onDeleteHost,
                                                       onDeleteAccommodation,
                                                       accommodationName,
                                                       guestName,
                                                       existingHostRating,
                                                       existingAccommodationRating,
                                                   }) => {
    const [currentTab, setCurrentTab] = useState(0);
    const [hostRating, setHostRating] = useState<number>(existingHostRating?.rating ?? 0);
    const [accommodationRating, setAccommodationRating] = useState<number>(existingAccommodationRating?.rating ?? 0);
    const [hostComment, setHostComment] = useState(existingHostRating?.comment ?? '');
    const [accommodationComment, setAccommodationComment] = useState(existingAccommodationRating?.comment ?? '');
    const [isEditingHost, setIsEditingHost] = useState(false);
    const [isEditingAccommodation, setIsEditingAccommodation] = useState(false);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    const handleSubmitHost = () => {
        if (hostRating === 0) {
            alert('Please provide a rating for the host');
            return;
        }
        if (onSubmitHost) {
            onSubmitHost(hostRating, hostComment || undefined);
        }
        setIsEditingHost(false);
    };

    const handleSubmitAccommodation = () => {
        if (accommodationRating === 0) {
            alert('Please provide a rating for the accommodation');
            return;
        }
        if (onSubmitAccommodation) {
            onSubmitAccommodation(accommodationRating, accommodationComment || undefined);
        }
        setIsEditingAccommodation(false);
    };

    const handleDeleteHost = () => {
        if (window.confirm('Are you sure you want to delete your host rating?')) {
            if (onDeleteHost) {
                onDeleteHost();
            }
            setHostRating(0);
            setHostComment('');
            setIsEditingHost(false);
        }
    };

    const handleDeleteAccommodation = () => {
        if (window.confirm('Are you sure you want to delete your accommodation rating?')) {
            if (onDeleteAccommodation) {
                onDeleteAccommodation();
            }
            setAccommodationRating(0);
            setAccommodationComment('');
            setIsEditingAccommodation(false);
        }
    };

    const handleClose = () => {
        setIsEditingHost(false);
        setIsEditingAccommodation(false);
        onClose();
    };

    const bothRated = existingHostRating && existingAccommodationRating;
    const hasHostRating = !!existingHostRating;
    const hasAccommodationRating = !!existingAccommodationRating;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            key={`${existingHostRating?.rating}-${existingAccommodationRating?.rating}-${open}`}
        >
            <DialogTitle>
                {bothRated && !isEditingHost && !isEditingAccommodation
                    ? 'Your Ratings'
                    : 'Rate Your Experience'}
            </DialogTitle>
            <DialogContent>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
                >
                    <Tab icon={<Person />} iconPosition="start" label="Host Rating" />
                    <Tab icon={<Home />} iconPosition="start" label="Accommodation Rating" />
                </Tabs>

                {currentTab === 0 ? (
                    <Stack spacing={3}>
                        {hasHostRating && !isEditingHost ? (
                            // Display existing host rating
                            <Box>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="subtitle1" fontWeight="600">
                                        Your Host Rating
                                    </Typography>
                                    <Stack direction="row" spacing={1}>
                                        <Tooltip title="Edit rating">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => setIsEditingHost(true)}
                                            >
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete rating">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={handleDeleteHost}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Stack>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Rating value={hostRating} readOnly size="large" />
                                    <Typography variant="body1" color="primary">
                                        {hostRating} star{hostRating !== 1 ? 's' : ''}
                                    </Typography>
                                </Box>
                                {hostComment && (
                                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight="600">
                                            Your Comment:
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            {hostComment}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        ) : (
                            // Edit/Create host rating
                            <>
                                <Box>
                                    <Typography variant="subtitle1" gutterBottom fontWeight="600">
                                        {hasHostRating ? 'Edit Your Host Rating' : 'How was your experience with the host?'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Rate {guestName}'s hospitality and communication
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Rating
                                            name="host-rating"
                                            value={hostRating}
                                            onChange={(_, newValue) => setHostRating(newValue || 0)}
                                            size="large"
                                        />
                                        {hostRating > 0 && (
                                            <Typography variant="body1" color="primary">
                                                {hostRating} star{hostRating !== 1 ? 's' : ''}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                                <TextField
                                    label="Comment (Optional)"
                                    multiline
                                    rows={4}
                                    value={hostComment}
                                    onChange={(e) => setHostComment(e.target.value)}
                                    placeholder="Share your thoughts about the host..."
                                    fullWidth
                                />
                            </>
                        )}
                    </Stack>
                ) : (
                    <Stack spacing={3}>
                        {hasAccommodationRating && !isEditingAccommodation ? (
                            // Display existing accommodation rating
                            <Box>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="subtitle1" fontWeight="600">
                                        Your Accommodation Rating
                                    </Typography>
                                    <Stack direction="row" spacing={1}>
                                        <Tooltip title="Edit rating">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => setIsEditingAccommodation(true)}
                                            >
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete rating">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={handleDeleteAccommodation}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Stack>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Rating value={accommodationRating} readOnly size="large" />
                                    <Typography variant="body1" color="primary">
                                        {accommodationRating} star{accommodationRating !== 1 ? 's' : ''}
                                    </Typography>
                                </Box>
                                {accommodationComment && (
                                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight="600">
                                            Your Comment:
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            {accommodationComment}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        ) : (
                            // Edit/Create accommodation rating
                            <>
                                <Box>
                                    <Typography variant="subtitle1" gutterBottom fontWeight="600">
                                        {hasAccommodationRating ? 'Edit Your Accommodation Rating' : 'How was the accommodation?'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Rate {accommodationName}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Rating
                                            name="accommodation-rating"
                                            value={accommodationRating}
                                            onChange={(_, newValue) => setAccommodationRating(newValue || 0)}
                                            size="large"
                                        />
                                        {accommodationRating > 0 && (
                                            <Typography variant="body1" color="primary">
                                                {accommodationRating} star{accommodationRating !== 1 ? 's' : ''}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                                <TextField
                                    label="Comment (Optional)"
                                    multiline
                                    rows={4}
                                    value={accommodationComment}
                                    onChange={(e) => setAccommodationComment(e.target.value)}
                                    placeholder="Share your thoughts about the accommodation..."
                                    fullWidth
                                />
                            </>
                        )}
                    </Stack>
                )}

                {!hasHostRating && !hasAccommodationRating && (
                    <Box
                        sx={{
                            mt: 3,
                            p: 2,
                            bgcolor: 'background.default',
                            borderRadius: 1,
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            <strong>Note:</strong> You can rate the host and accommodation independently. Each rating is optional.
                        </Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    {bothRated && !isEditingHost && !isEditingAccommodation ? 'Close' : 'Cancel'}
                </Button>
                {currentTab === 0 && (isEditingHost || !hasHostRating) && (
                    <Button
                        onClick={handleSubmitHost}
                        variant="contained"
                        sx={{color:'white'}}
                        disabled={hostRating === 0}
                    >
                        {hasHostRating ? 'Update Host Rating' : 'Submit Host Rating'}
                    </Button>
                )}
                {currentTab === 1 && (isEditingAccommodation || !hasAccommodationRating) && (
                    <Button
                        onClick={handleSubmitAccommodation}
                        variant="contained"
                        sx={{color:'white'}}
                        disabled={accommodationRating === 0}
                    >
                        {hasAccommodationRating ? 'Update Accommodation Rating' : 'Submit Accommodation Rating'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default RatingDialog;