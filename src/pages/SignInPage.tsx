import {Box} from "@mui/material";
import SignInForm from "../components/SignInForm.tsx";


const SignInPage = () => {
    return (
        <Box
            width="100vw"
            height="100vh"
            sx={{
                backgroundImage: 'url(/background.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <SignInForm />
        </Box>
    );
};



export default SignInPage;