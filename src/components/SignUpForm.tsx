import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    Link,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@mui/material';
import {useState, useContext} from 'react';
import {alpha} from '@mui/material/styles';
import axios, {AxiosError} from 'axios';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {environment} from '../utils/Environment';
import {AuthContext} from '../utils/AuthContext';

const SignUpForm = () => {
    const navigate = useNavigate();
<<<<<<< HEAD
    const { setUser, setAuthenticated, setRole } = useContext(AuthContext);
=======
    const { setUser, setAuthenticated } = useContext(AuthContext);
>>>>>>> bc8225d (feat: Connected login and register)
    const [form, setForm] = useState({
        name: '',
        surname: '',
        username: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        country: '',
        password: '',
        repeatPassword: '',
        role: 'guest' as 'guest' | 'host',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange =
        (field: keyof typeof form) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                setForm({...form, [field]: e.target.value});
            };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (form.password !== form.repeatPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${environment}/api/users/auth/register`, {
                username: form.username,
                email: form.email,
                password: form.password,
                firstName: form.name,
                lastName: form.surname,
                address: `${form.address}, ${form.city}, ${form.zip}, ${form.country}`,
<<<<<<< HEAD
                role: form.role,
=======
>>>>>>> bc8225d (feat: Connected login and register)
            });
            
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
<<<<<<< HEAD
            if (setRole && res.data.user?.role) {
                setRole(res.data.user.role);
            }
=======
>>>>>>> bc8225d (feat: Connected login and register)
            
            navigate('/');
        } catch (err) {
            const message =
                err instanceof AxiosError
                    ? err.response?.data?.message
                    : 'Registration failed';

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={(theme) => ({
                width: 440,
                bgcolor: alpha(theme.palette.background.paper, 0.6),
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: 3,
                boxShadow: 3,
                p: 4,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 2,
                border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
            })}
        >
            {/* Logo */}
            <Box
                component="img"
                src="/logo.png"
                alt="Logo"
                sx={{
                    width: 80,
                    mx: 'auto',
                    gridColumn: '1 / -1',
                }}
            />
            <Box
                component="img"
                src="/logo-text.png"
                alt="Logo"
                sx={{
                    width: 120,
                    mx: 'auto',
                    mb: 1,
                    gridColumn: '1 / -1',
                }}
            />
            <Typography
                variant="h6"
                sx={{gridColumn: '1 / -1', textAlign: 'center'}}
            >
                Create Account
            </Typography>

            {error && (
                <Alert
                    severity="error"
                    sx={{gridColumn: '1 / -1'}}
                >
                    {error}
                </Alert>
            )}

            <TextField
                label="Name"
                variant="standard"
                required
                onChange={handleChange('name')}
            />
            <TextField
                label="Surname"
                variant="standard"
                required
                onChange={handleChange('surname')}
            />

            <TextField
                label="Username"
                variant="standard"
                required
                onChange={handleChange('username')}
            />
            <TextField
                label="Email"
                variant="standard"
                type="email"
                required
                onChange={handleChange('email')}
            />

            <TextField
                label="Password"
                variant="standard"
                type="password"
                required
                onChange={handleChange('password')}
            />
            <TextField
                label="Repeat Password"
                variant="standard"
                type="password"
                required
                onChange={handleChange('repeatPassword')}
            />

            <TextField
                label="Address"
                variant="standard"
                required
                onChange={handleChange('address')}
            />
            <TextField
                label="City"
                variant="standard"
                required
                onChange={handleChange('city')}
            />

            <TextField
                label="Country"
                variant="standard"
                required
                onChange={handleChange('country')}
            />
            <TextField
                label="ZIP"
                variant="standard"
                required
                onChange={handleChange('zip')}
            />

            <FormControl sx={{ gridColumn: '1 / -1', mt: 2 }}>
                <FormLabel sx={{ mb: 1, color: 'text.primary' }}>I am registering as:</FormLabel>
                <RadioGroup
                    row
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value as 'guest' | 'host' })}
                    sx={{ justifyContent: 'left' }}
                >
                    <FormControlLabel 
                        value="guest" 
                        control={<Radio />} 
                        label="Guest (looking for accommodation)"
                        sx={{ '& .MuiFormControlLabel-label': { color: 'text.primary' } }}
                    />
                    <FormControlLabel 
                        value="host" 
                        control={<Radio />} 
                        label="Host (offering accommodation)"
                        sx={{ '& .MuiFormControlLabel-label': { color: 'text.primary' } }}
                    />
                </RadioGroup>
            </FormControl>

            <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{gridColumn: '1 / -1', mt: 2,
                    color: 'white'
                }}
            >
                {loading ? 'Creating account…' : 'Sign Up'}
            </Button>

            {/* Sign In Link */}
            <Box display='flex' flexDirection='row'
                 sx={{
                     gridColumn: '1 / -1',
                     textAlign: 'center',
                     mt: 1,
                     mx: 'auto'
                 }}>
                <Typography variant='body1' color='black' sx={{mr: "1px"}}>Already have an account?{' '}</Typography>
                <Link variant='body1'
                      component={RouterLink}
                      to="/sign-in"
                      underline="hover"
                      sx={{ml: "1px"}}
                >
                    Sign in
                </Link>
            </Box>
        </Box>
    );
};

export default SignUpForm;
