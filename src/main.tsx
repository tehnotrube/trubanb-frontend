import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {createTheme, ThemeProvider} from "@mui/material";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import SignInPage from "./pages/SignInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";

import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import Sidebar from "./components/Sidebar.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import CreateAccommodationPage from "./pages/CreateAccommodationPage.tsx";
import AccommodationPage from "./pages/AccommodationPage.tsx";
import ReservationPage from "./pages/ReservationsPage.tsx";
import {AuthProvider} from "./utils/AuthProvider.tsx";
import {UnauthenticatedRoute} from "./pages/UnauthenticatedRoute.tsx";
import {AuthenticatedRoute} from "./pages/AuthenticatedRoute.tsx";
import MyAccommodationsPage from "./pages/MyAccommodationsPage.tsx";
import {NotificationProvider} from "./utils/NotificationContext.tsx";

const theme = createTheme({
    typography: {
        fontFamily: '"Inter", "Libre Baskerville", sans-serif',
        h1: {fontFamily: '"Libre Baskerville", serif'},
        h2: {fontFamily: '"Libre Baskerville", serif'},
        h3: {fontFamily: '"Libre Baskerville", serif'},
        h4: {fontFamily: '"Libre Baskerville", serif'},
        h5: {fontFamily: '"Libre Baskerville", serif'},
        h6: {fontFamily: '"Libre Baskerville", serif'},
        body1: {fontFamily: '"Libre Baskerville", serif'},
        body2: {fontFamily: '"Libre Baskerville", serif'},
        button: {
            fontFamily: '"Libre Baskerville", serif',
            textTransform: 'uppercase',
            color: '#ffffff',
        },
    },
    palette: {
        primary: {
            main: '#5D6532',
            dark: '#3D4221',
            light: '#7a8852',
            contrastText: '#000000'
        },
        secondary: {
            main: '#D4E673',
            contrastText: '#3D4221',
        },
        background: {
            default: '#c5cabc',
        },
        success: {
            main: '#AFBD5E',
        },
        warning: {
            main: '#e8a44b',
        },
        error: {
            main: '#d13939',
        },
        text: {
            primary: '#3D4221',
            secondary: '#5D6532',
        },
    },
});

export default theme;


const router = createBrowserRouter([ // TODO: Add guards to routes
    {path: "/sign-in", element: <UnauthenticatedRoute><SignInPage/></UnauthenticatedRoute>},
    {path: "/sign-up", element: <UnauthenticatedRoute><SignUpPage/></UnauthenticatedRoute>},
    {path: "", element: <Sidebar><SearchPage/></Sidebar>},
    {path: "/settings", element: <AuthenticatedRoute><Sidebar><SettingsPage/></Sidebar></AuthenticatedRoute>},
    {path: "/my-accommodations", element: <AuthenticatedRoute><Sidebar><MyAccommodationsPage/></Sidebar></AuthenticatedRoute>},
    {path: "/create-accommodation", element: <AuthenticatedRoute><Sidebar><CreateAccommodationPage/></Sidebar></AuthenticatedRoute>},
    {path: "/:id/edit-accommodation", element: <AuthenticatedRoute><Sidebar><CreateAccommodationPage/></Sidebar></AuthenticatedRoute>},
    {path: "/accommodation/:id", element: <Sidebar><AccommodationPage/></Sidebar>},
    {path: "/reservations", element: <AuthenticatedRoute><Sidebar><ReservationPage/></Sidebar></AuthenticatedRoute>},
    {path: "*", element: <Navigate to="" replace/>},
])

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AuthProvider>
                    <NotificationProvider>
                        <RouterProvider router={router}/>
                    </NotificationProvider>
                </AuthProvider>
            </LocalizationProvider>
        </ThemeProvider>
    </StrictMode>,
)
