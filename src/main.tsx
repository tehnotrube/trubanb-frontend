import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {createTheme, ThemeProvider} from "@mui/material";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import SignInPage from "./pages/SignInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import HomePage from "./pages/HomePage.tsx";

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Sidebar from "./components/Sidebar.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import CreateAccommodationPage from "./pages/CreateAccommodationPage.tsx";

const theme = createTheme({
    typography: {
        fontFamily: '"Inter", "Libre Baskerville", sans-serif',
        h1: { fontFamily: '"Libre Baskerville", serif' },
        h2: { fontFamily: '"Libre Baskerville", serif' },
        h3: { fontFamily: '"Libre Baskerville", serif' },
        h4: { fontFamily: '"Libre Baskerville", serif' },
        h5: { fontFamily: '"Libre Baskerville", serif' },
        h6: { fontFamily: '"Libre Baskerville", serif' },
        body1: { fontFamily: '"Libre Baskerville", serif' },
        body2: { fontFamily: '"Libre Baskerville", serif' },
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
    {path: "/sign-in", element: <SignInPage/>},
    {path: "/sign-up", element: <SignUpPage/>},
    {path: "", element: <HomePage/>},
    {path:"/search", element:<Sidebar><SearchPage/></Sidebar>},
    {path:"/settings", element:<Sidebar><SettingsPage/></Sidebar>},
    {path:"/create-accommodation", element:<Sidebar><CreateAccommodationPage/></Sidebar>},
    {path: "*", element: <Navigate to="/" replace/>},
])

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            {/*TODO: Add AUTH Provider*/}
            <RouterProvider router={router}/>
            </LocalizationProvider>
        </ThemeProvider>
    </StrictMode>,
)
