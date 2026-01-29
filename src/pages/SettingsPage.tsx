import React, {useContext, useState, useEffect} from 'react';
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
    Alert,
} from '@mui/material';
import {AuthContext} from "../utils/AuthContext.tsx";
import axios, {AxiosError} from "axios";
import {environment} from "../utils/Environment.tsx";

const SettingsPage: React.FC = () => {
    const { role, user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);


    // Personal Details State
    const [personalDetails, setPersonalDetails] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        country: '',
    });

    useEffect(() => {
        if (user) {
            // Parse address field by comma (address, city, zip, country)
            const addressParts = (user.address || '').split(',').map(part => part.trim());
            
            setPersonalDetails({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                username: user.username || '',
                email: user.email || '',
                address: addressParts[0] || '',
                city: addressParts[1] || '',
                zip: addressParts[2] || '',
                country: addressParts[3] || '',
            });
        }
    }, [user]);

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
        setError(null);
        setSuccess(null);
    };

    const handlePasswordChange = (field: string, value: string) => {
        setPasswordData({ ...passwordData, [field]: value });
        setError(null);
    };

    const handleSavePersonalDetails = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem('accessToken');
            // Combine address fields with commas
            const fullAddress = [
                personalDetails.address,
                personalDetails.city,
                personalDetails.zip,
                personalDetails.country
            ].filter(part => part.trim()).join(', ');

            await axios.put(`${environment}/api/users/profile`, {
                firstName: personalDetails.firstName,
                lastName: personalDetails.lastName,
                email: personalDetails.email,
                address: fullAddress,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSuccess('Profile updated successfully!');
        } catch (err) {
            const message = err instanceof AxiosError
                ? err.response?.data?.message
                : 'Failed to update profile';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        if (!passwordData.currentPassword || !passwordData.newPassword) {
            setError('Please fill in all password fields');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem('accessToken');
            await axios.put(`${environment}/api/users/credentials`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSuccess('Password changed successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            const message = err instanceof AxiosError
                ? err.response?.data?.message
                : 'Failed to change password';
            setError(message);
        } finally {
            setLoading(false);
        }
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

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

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
                                label="First Name"
                                variant="standard"
                                value={personalDetails.firstName}
                                onChange={(e) => handlePersonalDetailsChange('firstName', e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Last Name"
                                variant="standard"
                                value={personalDetails.lastName}
                                onChange={(e) => handlePersonalDetailsChange('lastName', e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Username"
                                variant="standard"
                                value={personalDetails.username}
                                disabled
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
                                label="ZIP Code"
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
                                disabled={loading}
                                sx={{ mt: 2 }}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
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
                                disabled={loading}
                                sx={{ mt: 2 }}
                            >
                                {loading ? 'Changing...' : 'Change Password'}
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

                        {role == 'guest' ? (
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
                        )}

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