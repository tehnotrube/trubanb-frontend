import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';

const SettingsPage: React.FC = () => {
    // TODO: Pull data from jwt/API
    const role: 'host' | 'guest' = 'host'; // Change to 'guest' to see guest settings

    // Personal Details State
    const [personalDetails, setPersonalDetails] = useState({
        name: 'Vukasin',
        surname: 'Bogdanovic',
        username: 'vukasinb7',
        email: 'vukasinb7@example.com',
        address: 'Kneza Milosa 10',
        city: 'Belgrade',
        zip: '11000',
        country: 'Serbia',
    });
    console.log(role)

    // Password Change State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Notification Settings State (Guest)
    const [guestNotifications, setGuestNotifications] = useState({
        reservationAnswer: true,
    });

    // Notification Settings State (Host)
    const [hostNotifications, setHostNotifications] = useState({
        newReservationRequest: true,
        reservationCancellation: true,
        newRatingForHost: true,
        newRatingForAccommodation: false,
    });

    // Delete Account Dialog State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handlePersonalDetailsChange = (field: string, value: string) => {
        setPersonalDetails({ ...personalDetails, [field]: value });
    };

    const handlePasswordChange = (field: string, value: string) => {
        setPasswordData({ ...passwordData, [field]: value });
    };

    const handleSavePersonalDetails = () => {
        console.log('Saving personal details:', personalDetails);
        // TODO: API call to save personal details
    };

    const handleChangePassword = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        console.log('Changing password');
        // TODO: API call to change password
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handleGuestNotificationToggle = (field: keyof typeof guestNotifications) => {
        setGuestNotifications({ ...guestNotifications, [field]: !guestNotifications[field] });
    };

    const handleHostNotificationToggle = (field: keyof typeof hostNotifications) => {
        setHostNotifications({ ...hostNotifications, [field]: !hostNotifications[field] });
    };

    const handleDeleteAccount = () => {
        console.log('Deleting account');
        // TODO: API call to delete account
        setDeleteDialogOpen(false);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
                Settings
            </Typography>

            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3,
                width: '100%',
                alignItems: 'stretch'
            }}>
                {/* Personal Details Section */}
                <Card sx={{ flex: 1, minWidth: 0, height:'fit-content',p:3 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                            Personal Details
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Name"
                                variant="standard"
                                value={personalDetails.name}
                                onChange={(e) => handlePersonalDetailsChange('name', e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Surname"
                                variant="standard"
                                value={personalDetails.surname}
                                onChange={(e) => handlePersonalDetailsChange('surname', e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Username"
                                variant="standard"
                                value={personalDetails.username}
                                onChange={(e) => handlePersonalDetailsChange('username', e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Email"
                                variant="standard"
                                type="email"
                                value={personalDetails.email}
                                onChange={(e) => handlePersonalDetailsChange('email', e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Address"
                                variant="standard"
                                value={personalDetails.address}
                                onChange={(e) => handlePersonalDetailsChange('address', e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="City"
                                variant="standard"
                                value={personalDetails.city}
                                onChange={(e) => handlePersonalDetailsChange('city', e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="ZIP"
                                variant="standard"
                                value={personalDetails.zip}
                                onChange={(e) => handlePersonalDetailsChange('zip', e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Country"
                                variant="standard"
                                value={personalDetails.country}
                                onChange={(e) => handlePersonalDetailsChange('country', e.target.value)}
                                fullWidth
                            />

                            <Button
                                variant="contained"
                                onClick={handleSavePersonalDetails}
                                sx={{ mt: 2, color: 'white' }}
                            >
                                Save Changes
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {/* Password Change Section */}
                <Card sx={{ flex: 1, minWidth: 0,height:'fit-content',p:3  }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                            Change Password
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Current Password"
                                variant="standard"
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="New Password"
                                variant="standard"
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Confirm New Password"
                                variant="standard"
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                fullWidth
                            />

                            <Button
                                variant="contained"
                                onClick={handleChangePassword}
                                sx={{ mt: 2, color: 'white' }}
                            >
                                Change Password
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {/* Other Settings Section */}
                <Card sx={{ flex: 1, minWidth: 0, height:'fit-content',p:3 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                            Other Settings
                        </Typography>

                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                            Notifications
                        </Typography>

                        role == 'guest' ? (
                            <Box sx={{ mb: 3 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={guestNotifications.reservationAnswer}
                                            onChange={() => handleGuestNotificationToggle('reservationAnswer')}
                                        />
                                    }
                                    label={
                                        <Typography variant="body2">
                                            Reservation request answer from host
                                        </Typography>
                                    }
                                />
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={hostNotifications.newReservationRequest}
                                            onChange={() => handleHostNotificationToggle('newReservationRequest')}
                                        />
                                    }
                                    label={
                                        <Typography variant="body2">
                                            New reservation request
                                        </Typography>
                                    }
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={hostNotifications.reservationCancellation}
                                            onChange={() => handleHostNotificationToggle('reservationCancellation')}
                                        />
                                    }
                                    label={
                                        <Typography variant="body2">
                                            Reservation cancellation
                                        </Typography>
                                    }
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={hostNotifications.newRatingForHost}
                                            onChange={() => handleHostNotificationToggle('newRatingForHost')}
                                        />
                                    }
                                    label={
                                        <Typography variant="body2">
                                            New rating for host
                                        </Typography>
                                    }
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={hostNotifications.newRatingForAccommodation}
                                            onChange={() => handleHostNotificationToggle('newRatingForAccommodation')}
                                        />
                                    }
                                    label={
                                        <Typography variant="body2">
                                            New rating for accommodation
                                        </Typography>
                                    }
                                />
                            </Box>
                        )

                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'error.main' }}>
                            Danger Zone
                        </Typography>

                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => setDeleteDialogOpen(true)}
                            fullWidth
                        >
                            Delete Account
                        </Button>
                    </CardContent>
                </Card>
            </Box>

            {/* Delete Account Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Delete Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete your account? This action cannot be undone.
                        All your data, including accommodations and reservations, will be permanently deleted.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteAccount} color="error" variant="contained">
                        Delete Account
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SettingsPage;