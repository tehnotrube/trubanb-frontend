import SidebarLayout from "../components/Sidebar.tsx";
import {
    Home as HomeIcon,
    Settings as SettingsIcon,

} from '@mui/icons-material';
import {Typography} from "@mui/material";

const HomePage = () => {


    return <SidebarLayout
        username="Vule"
        profilePic="/profile.jpg"
        onLogout={() => console.log('Logout')}
        menuItems={[
            { label: 'Home', icon: <HomeIcon />, onClick: () => console.log('Home') },
            { label: 'Settings', icon: <SettingsIcon /> },
        ]}
    >
        <Typography variant="h4">Main Content Goes Here</Typography>
    </SidebarLayout>
}


export default HomePage;