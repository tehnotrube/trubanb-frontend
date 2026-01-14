import React, {type ReactNode, useState } from 'react';
import {
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Typography,
    IconButton,
    Button,
    TextField,
} from '@mui/material';
import {
    ExitToApp as LogoutIcon,
    ArrowBack as BackIcon,
    Search as SearchIcon,
    Home as HomeIcon,
    Event as EventIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';

interface SidebarLayoutProps {
    children: ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
    const [view, setView] = useState<'menu' | 'search'>('menu');

    //TODO: Pull data from jwt/API
    const isAuthenticated = true;
    const role = 'host';
    const username = 'vukasinb7';
    const profilePic = '';

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    };

    const goToSignIn = () => {
        window.location.href = '/sign-in';
    };

    const goToSignUp = () => {
        window.location.href = '/sign-up';
    };

    const goToSearch = () => {
        setView('search')
    };

    const renderMenuItems = () => {

        if (role === 'host') {
            return (
                <>
                    <NavItem icon={<HomeIcon />} label="My Accommodations" />
                    <NavItem icon={<EventIcon />} label="Reservation Requests" />
                    <NavItem
                        icon={<SearchIcon />}
                        label="Search"
                        onClick={goToSearch}
                    />
                </>
            );
        }

        if (role === 'guest') {
            return (
                <>
                    <NavItem icon={<EventIcon />} label="My Reservations" />
                    <NavItem
                        icon={<SearchIcon />}
                        label="Search"
                        onClick={goToSearch}
                    />
                </>
            );
        }

        return null;
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', maxHeight: '100vh', backgroundImage: 'url(/background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat', }}>
            {/* Sidebar */}
            <Box
                sx={{
                    width: 250,
                    bgcolor: 'rgba(93, 101, 50, 0.80)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 2,
                }}
            >
                {/* Top */}
                <Box>
                    {/* Logo */}
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        mb={3}
                    >
                        <Box component="img" src="/logo.png" sx={{ width: 120 }} />
                        <Box component="img" src="/logo-text.png" sx={{ width: 150 }} />
                    </Box>

                    {/* MENU VIEW */}
                    {view === 'menu' && <List>{renderMenuItems()}</List>}

                    {/* SEARCH VIEW */}
                    {(view === 'search'|| !isAuthenticated) && (
                        <Box display="flex" flexDirection="column" gap={2}>
                            {isAuthenticated && (
                                <NavItem
                                    icon={<BackIcon />}
                                    label="Back"
                                    onClick={() => setView('menu')}
                                />
                            )}

                            <DatePicker slotProps={{
                                textField: {
                                    sx: {
                                        "& .MuiPickersSectionList-root": {
                                            color: "white",
                                            WebkitTextFillColor: "white", // 🔑 REQUIRED
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: "white",
                                        },
                                        "& .MuiSvgIcon-root": {
                                            color: "white",
                                        },
                                        "& .MuiFormLabel-roott": {
                                            color: "white",
                                        }
                                    }
                                }
                            }}  label="Start date"/>
                            <DatePicker slotProps={{
                                textField: {
                                    sx: {
                                        "& .MuiPickersSectionList-root": {
                                            color: "white",
                                            WebkitTextFillColor: "white", // 🔑 REQUIRED
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: "white",
                                        },
                                        "& .MuiSvgIcon-root": {
                                            color: "white",
                                        },
                                        "& .MuiFormLabel-roott": {
                                            color: "white",
                                        }
                                    }
                                }
                            }} label="End date" />

                            <TextField
                                label="Guests"
                                type="number"
                                variant="outlined"
                                InputLabelProps={{ style: { color: 'white' } }}
                                InputProps={{ style: { color: 'white' } }}
                            />

                            <TextField
                                label="Location"
                                variant="outlined"
                                InputLabelProps={{ style: { color: 'white' } }}
                                InputProps={{ style: { color: 'white' } }}
                            />
                        </Box>
                    )}
                </Box>

                {/* Bottom */}
                <Box>
                    {isAuthenticated ? (
                        <Box display="flex" alignItems="center" gap={1}>
                            <Avatar src={profilePic} />
                            <Typography>{username}</Typography>
                            <IconButton
                                onClick={handleLogout}
                                sx={{ color: 'white', ml: 'auto' }}
                            >
                                <LogoutIcon />
                            </IconButton>
                        </Box>
                    ) : (
                        <Box display="flex" flexDirection="column" gap={1}>
                            <Button variant="contained" onClick={goToSignIn}>
                                Sign In
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={goToSignUp}
                                sx={{ color: 'white', borderColor: 'white' }}
                            >
                                Sign Up
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Main content */}
            <Box sx={{ flexGrow: 1, p: 4, bgcolor: 'rgba(255, 255, 255, 0.90)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)', overflow:'auto'}}>{children}</Box>
        </Box>
    );
};

const NavItem = ({
                     icon,
                     label,
                     onClick,
                 }: {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
}) => (
    <ListItemButton
        onClick={onClick}
        sx={{
            color: 'white',
            borderRadius: 1,
            mb: 1,
            '&:hover': { bgcolor: 'primary.light' },
        }}
    >
        <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
            {icon}
        </ListItemIcon>
        <ListItemText primary={label} />
    </ListItemButton>
);

export default SidebarLayout;
