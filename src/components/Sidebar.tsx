import React, {type ReactNode, useContext, useState} from 'react';
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
    Add,
} from '@mui/icons-material';
import {DatePicker} from '@mui/x-date-pickers';
import SearchPage from "../pages/SearchPage.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {AuthContext} from "../utils/AuthContext.tsx";

interface SidebarLayoutProps {
    children: ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({children}) => {
    //TODO: Pull data from jwt/API
    const {isAuthenticated, role, user} = useContext(AuthContext);
    const username = user?.username || 'guest';
    const profilePic = '';
    const location = useLocation();
    const navigate = useNavigate();
    const [view, setView] = useState<'menu' | 'search'>(location.pathname=="/"?'search':'menu');

    const isHome = location.pathname === "/";

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
        if (window.location.pathname === '/') {
            setView('search');
        }else{
            navigate('/')
        }
    };

    const renderMenuItems = () => {

        if (role === 'host') {
            return (
                <>
                    <NavItem icon={<HomeIcon/>} label="My Accommodations" onClick={() => navigate('/my-accommodations')}/>
                    <NavItem icon={<Add/>} label="Add Accommodation" onClick={() => navigate('/create-accommodation')}/>
                    <NavItem icon={<EventIcon/>} label="Reservation Requests" onClick={()=>navigate('/reservations')} />
                    <NavItem
                        icon={<SearchIcon/>}
                        label="Search"
                        onClick={goToSearch}
                    />
                </>
            );
        }

        if (role === 'guest') {
            return (
                <>
                    <NavItem icon={<EventIcon/>} label="My Reservations" onClick={()=>navigate('/reservations')}/>
                    <NavItem
                        icon={<SearchIcon/>}
                        label="Search"
                        onClick={goToSearch}
                    />
                </>
            );
        }

        return null;
    };

    return (
        <Box sx={{
            display: 'flex', minHeight: '100vh', maxHeight: '100vh', backgroundImage: 'url(/background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'

        }}>
            {/* Sidebar */}
            <Box
                sx={{
                    width: 300,
                    minWidth:300,
                    maxWidth: 300,
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
                        sx={{cursor:'pointer'}}
                        mb={3}
                        onClick={()=>navigate('/')}
                    >
                        <Box component="img" src="/logo.png" sx={{width: 120}}/>
                        <Box component="img" src="/logo-text.png" sx={{width: 150}}/>
                    </Box>

                    {/* MENU VIEW */}
                    {view === 'menu' && isAuthenticated && <List>{renderMenuItems()}</List>}

                    {/* SEARCH VIEW */}
                    {(view === 'search' || !isAuthenticated) && (
                        <Box display="flex" flexDirection="column" gap={2}>
                            {isAuthenticated && (
                                <NavItem
                                    icon={<BackIcon/>}
                                    label="Back"
                                    onClick={() => setView('menu')}
                                />
                            )}
                            <Typography textAlign="center" mb={2} mt={2}>Search Accommodations</Typography>

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
                            }} label="Start date"/>
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
                            }} label="End date"/>

                            <TextField
                                label="Guests"
                                type="number"
                                variant="outlined"
                                InputLabelProps={{style: {color: 'white'}}}
                                InputProps={{style: {color: 'white'}}}
                            />

                            <TextField
                                label="Location"
                                variant="outlined"
                                InputLabelProps={{style: {color: 'white'}}}
                                InputProps={{style: {color: 'white'}}}
                            />
                        </Box>
                    )}
                </Box>

                {/* Bottom */}
                <Box>
                    {isAuthenticated ? (
                        <Box display="flex" alignItems="center">
                            <Box display='flex' flexDirection='row' justifyContent='center' alignItems='center' onClick={()=>navigate('/settings')} sx={{cursor:'pointer'}}>
                                <Avatar src={profilePic} sx={{mr:1}}/>
                                <Typography ml='1'>{username}</Typography>
                            </Box>
                            <IconButton
                                onClick={handleLogout}
                                sx={{color: 'white', ml: 'auto'}}
                            >
                                <LogoutIcon onClick={() => navigate('/sign-in')}/>
                            </IconButton>
                        </Box>
                    ) : (
                        <Box display="flex" flexDirection="column" gap={1}>
                            <Button variant="outlined" onClick={goToSignIn} sx={{color: 'white', borderColor: 'white'}}>
                                Sign In
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={goToSignUp}
                                sx={{color: 'primary', backgroundColor: 'rgba(255,255,255,0.8)', borderColor: 'white'}}
                            >
                                Sign Up
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Main content */}
            <Box sx={{
                flexGrow: 1, p: 4, bgcolor: 'rgba(255, 255, 255, 0.90)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)', overflow: 'auto'
            }}>{(!isAuthenticated && isHome) ? <SearchPage></SearchPage> : children}</Box>
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
            '&:hover': {bgcolor: 'primary.light'},
        }}
    >
        <ListItemIcon sx={{color: 'white', minWidth: 40}}>
            {icon}
        </ListItemIcon>
        <ListItemText primary={label}/>
    </ListItemButton>
);

export default SidebarLayout;
