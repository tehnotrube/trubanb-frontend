import {Box} from "@mui/material";
import SignUpForm from "../components/SignUpForm.tsx";


const SignUpPage = () => {

    return <Box
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
        <SignUpForm />
    </Box>
}


export default SignUpPage;