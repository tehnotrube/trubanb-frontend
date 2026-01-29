import {
    Box,
    Button,
    TextField,
    Typography,
    Link,
    Alert,
} from '@mui/material';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {useState, useContext} from 'react';
import axios, {AxiosError} from "axios";
import {environment} from '../utils/Environment';
import {AuthContext} from '../utils/AuthContext';

const SignInForm = () => {
    const navigate = useNavigate();
    const { setUser, setAuthenticated, setRole } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await axios.post(`${environment}/api/users/auth/login`, {
                emailOrUsername: username,
            const res = await axios.post(`${environment}/api/users/auth/login`, {
                emailOrUsername: username,
                password,
            });

            console.log('Auth success:', res.data);
            
            // Store tokens
            if (res.data.accessToken) {
                localStorage.setItem('accessToken', res.data.accessToken);
            }
            if (res.data.refreshToken) {
                localStorage.setItem('refreshToken', res.data.refreshToken);
            }
            
            // Update auth context immediately
            if (setUser && res.data.user) {
                setUser(res.data.user);
            }
            if (setAuthenticated) {
                setAuthenticated(true);
            }
            if (setRole && res.data.user?.role) {
                setRole(res.data.user.role);
            }
            
            navigate('/');
        } catch (err) {
            const message =
                err instanceof AxiosError
                    ? err.response?.data?.message
                    : 'Invalid username or password';

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                width: 360,
                bgcolor: 'rgba(255, 255, 255, 0.6)', // half transparent
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)', // Safari
                borderRadius: 3,
                boxShadow: 3,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
        >
            {/* Logo */}
            <Box
                component="img"
                src="/logo.png"
                alt="Logo"
                sx={{width: 130, mb: 1}}
            />
            <Box
                component="img"
                src="/logo-text.png"
                alt="Logo"
                sx={{width: 220, mb: 3}}
            />

            {/* Error */}
            {error && (
                <Alert severity="error" sx={{width: '100%', mb: 2}}>
                    {error}
                </Alert>
            )}

            {/* Username */}
            <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                variant='standard'
            />

            {/* Password */}
            <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                variant='standard'
            />

            {/* Sign In Button */}
            <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                    mt: 3, mb: 2,
                    color: 'white'
                }}
            >
                {loading ? 'Signing in…' : 'Sign In'}
            </Button>

            {/* Sign Up Link */}
            <Box display='flex' flexDirection='row'>
                <Typography variant='body1' color='black' sx={{mr: "1px"}}>Don&apos;t have an account?{' '}</Typography>
                <Link variant='body1'
                      component={RouterLink}
                      to="/sign-up"
                      underline="hover"
                      sx={{
                          ml: "1px"
                      }}
                >
                    Sign up
                </Link>
            </Box>
        </Box>
    );
};

export default SignInForm;
