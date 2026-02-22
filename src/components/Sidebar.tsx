import React, { type ReactNode, useContext, useState } from 'react';
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext.tsx";
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { Badge } from '@mui/material';
import { useNotification } from '../utils/NotificationContext';
import NotificationsPanel from './NotificationPanel.tsx';
import SearchPage from "../pages/SearchPage.tsx";

interface SidebarLayoutProps {
  children: ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const { isAuthenticated, role, user } = useContext(AuthContext);
  const username = user?.username || 'guest';
  const profilePic = '';
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { unreadCount } = useNotification();
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);

  const [view, setView] = useState<'menu' | 'search'>(
    location.pathname === "/" ? 'search' : 'menu'
  );

  const [checkIn, setCheckIn] = useState<Dayjs | null>(
    searchParams.get('checkIn') ? dayjs(searchParams.get('checkIn')) : null
  );
  const [checkOut, setCheckOut] = useState<Dayjs | null>(
    searchParams.get('checkOut') ? dayjs(searchParams.get('checkOut')) : null
  );
  const [guests, setGuests] = useState(searchParams.get('guests') || '');
  const [loc, setLoc] = useState(searchParams.get('location') || '');

  const isHome = location.pathname === "/";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/sign-in';
  };

  const goToSignIn = () => window.location.href = '/sign-in';
  const goToSignUp = () => window.location.href = '/sign-up';

  const handleSearch = () => {
    if (!checkIn || !checkOut) {
      alert("Please select both start and end date");
      return;
    }
    if (checkOut.isBefore(checkIn, 'day')) {
      alert("End date must be after start date");
      return;
    }
    const guestsNum = Number(guests);
    if (!guests || isNaN(guestsNum) || guestsNum < 1) {
      alert("Please enter a valid number of guests");
      return;
    }

    const nextParams = {
      checkIn: checkIn.format('YYYY-MM-DD'),
      checkOut: checkOut.format('YYYY-MM-DD'),
      guests: guestsNum.toString(),
    } as Record<string, string>;

    if (loc.trim()) {
      nextParams.location = loc.trim();
    }

    setSearchParams(nextParams);

    // If not already on home → navigate there
    if (!isHome) {
      navigate('/');
    }

    setView('search');
  };

  const renderMenuItems = () => {
    if (role === 'host') {
      return (
        <>
          <NavItem icon={<HomeIcon />} label="My Accommodations" onClick={() => navigate('/my-accommodations')} />
          <NavItem icon={<Add />} label="Add Accommodation" onClick={() => navigate('/create-accommodation')} />
          <NavItem icon={<EventIcon />} label="Reservation Requests" onClick={() => navigate('/reservations')} />
          <NavItem icon={<SearchIcon />} label="Search" onClick={() => setView('search')} />
        </>
      );
    }
    if (role === 'guest') {
      return (
        <>
          <NavItem icon={<EventIcon />} label="My Reservations" onClick={() => navigate('/reservations')} />
          <NavItem icon={<SearchIcon />} label="Search" onClick={() => setView('search')} />
        </>
      );
    }
    return null;
  };

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      maxHeight: '100vh',
      backgroundImage: 'url(/background.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Sidebar */}
      <Box sx={{
        width: 300,
        minWidth: 300,
        maxWidth: 300,
        bgcolor: 'rgba(93, 101, 50, 0.80)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 2,
      }}>
        <Box>
          {/* Logo */}
          <Box display="flex" flexDirection="column" alignItems="center" sx={{ cursor: 'pointer' }} mb={3} onClick={() => {navigate('/'); 
            setSearchParams({}); 
            setCheckIn(null); 
            setCheckOut(null);
            setGuests('');
            setLoc('');
            setView('search');
          }}><Box component="img" src="/logo.png" sx={{ width: 120 }} />
            <Box component="img" src="/logo-text.png" sx={{ width: 150 }} />
          </Box>

          {/* MENU */}
          {view === 'menu' && isAuthenticated && <List>{renderMenuItems()}</List>}

          {/* SEARCH FORM */}
          {(view === 'search' || !isAuthenticated) && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box display="flex" flexDirection="column" gap={2}>
                {isAuthenticated && (
                  <NavItem icon={<BackIcon />} label="Back" onClick={() => setView('menu')} />
                )}

                <Typography textAlign="center" mb={2} mt={2}>Search Accommodations</Typography>

                <DatePicker
                  label="Start date"
                  value={checkIn}
                  onChange={setCheckIn}
                  minDate={dayjs()}
                  slotProps={{
                    textField: {
                      sx: {
                        "& .MuiPickersSectionList-root": { color: "white", WebkitTextFillColor: "white" },
                        "& .MuiInputLabel-root": { color: "white" },
                        "& .MuiSvgIcon-root": { color: "white" },
                        "& .MuiFormLabel-root": { color: "white" },
                      }
                    }
                  }}
                />

                <DatePicker
                  label="End date"
                  value={checkOut}
                  onChange={setCheckOut}
                  minDate={checkIn ?? dayjs()}
                  slotProps={{
                    textField: {
                      sx: {
                        "& .MuiPickersSectionList-root": { color: "white", WebkitTextFillColor: "white" },
                        "& .MuiInputLabel-root": { color: "white" },
                        "& .MuiSvgIcon-root": { color: "white" },
                        "& .MuiFormLabel-root": { color: "white" },
                      }
                    }
                  }}
                />

                <TextField
                  label="Guests"
                  type="number"
                  value={guests}
                  onChange={e => setGuests(e.target.value)}
                  inputProps={{ min: 1 }}
                  variant="outlined"
                  InputLabelProps={{ style: { color: 'white' } }}
                  InputProps={{ style: { color: 'white' } }}
                  sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
                />

                <TextField
                  label="Location"
                  value={loc}
                  onChange={e => setLoc(e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ style: { color: 'white' } }}
                  InputProps={{ style: { color: 'white' } }}
                  sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
                />

                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSearch}
                  sx={{
                    mt: 1,
                    bgcolor: 'white',
                    color: 'rgba(93,101,50,0.9)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                  }}
                >
                  Search
                </Button>
              </Box>
            </LocalizationProvider>
          )}
        </Box>

        {/* Bottom */}
        <Box>
          {isAuthenticated ? (
            <Box display="flex" alignItems="center">
              <IconButton
                  onClick={() => setNotificationsPanelOpen(true)}
                  sx={{ color: 'white', mr: 1 }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Box display='flex' flexDirection='row' justifyContent='center' alignItems='center' onClick={() => navigate('/settings')} sx={{ cursor: 'pointer' }}>
                <Avatar src={profilePic} sx={{ mr: 1 }} />
                <Typography ml={1}>{username}</Typography>
              </Box>
              <IconButton onClick={handleLogout} sx={{ color: 'white', ml: 'auto' }}>
                <LogoutIcon />
              </IconButton>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" gap={1}>
              <Button variant="outlined" onClick={goToSignIn} sx={{ color: 'white', borderColor: 'white' }}>
                Sign In
              </Button>
              <Button variant="outlined" onClick={goToSignUp} sx={{ color: 'primary', backgroundColor: 'rgba(255,255,255,0.8)', borderColor: 'white' }}>
                Sign Up
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Main content */}
      <Box sx={{
        flexGrow: 1,
        p: 4,
        bgcolor: 'rgba(255, 255, 255, 0.90)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        overflow: 'auto'
      }}>
        {view !='search' && children
        }
        {view =='search' && <SearchPage/>}
      </Box>
      {/* Notifications Panel */}
      <NotificationsPanel
          open={notificationsPanelOpen}
          onClose={() => setNotificationsPanelOpen(false)}
      />
    </Box>
  );
};

const NavItem = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) => (
  <ListItemButton onClick={onClick} sx={{ color: 'white', borderRadius: 1, mb: 1, '&:hover': { bgcolor: 'primary.light' } }}>
    <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>{icon}</ListItemIcon>
    <ListItemText primary={label} />
  </ListItemButton>
);

export default SidebarLayout;