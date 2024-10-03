// LoginPage.js
import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  CircularProgress,
  Paper,
  Grid,
} from '@mui/material';
import { styled } from '@mui/system';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../App';
import APIConnection from '../../config';
import img from '../img/marketing-pillar-page-marketing-overview_0.png';

const themeColor = {
  primary: '#444',
  primaryDark: '#666',
  success: '#4caf50',
  error: '#f44336',
  headerBg: '#444',
  headerTextColor: '#ffffff',
  borderColor: '#777',
  color: '#000000',
  rowHoverColor: '#f5f5f5',
  scrollbarThumbColor: '#888',
};

const Background = styled(Box)(({ theme }) => ({
  background: '#ffffff',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
}));

const ContentBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '12px',
  background: '#ffffff',
  height: '60%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '12px',
  boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.0)',
  background: '#fafafa',
  animation: 'fadeIn 1s ease-in-out',
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  color: '#000000',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: themeColor.borderColor,
    },
    '&:hover fieldset': {
      borderColor: themeColor.primary,
    },
    '&.Mui-focused fieldset': {
      borderColor: themeColor.primaryDark,
    },
  },
  '& .MuiInputAdornment-root': {
    color: themeColor.primaryDark,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: 'bold',
  textTransform: 'none',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: themeColor.primaryDark,
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(2),
}));

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const loginapi = APIConnection.loginapi;

  const handleLogin = async () => {
    setLoading(true);
    try {
      const portalID = 2;
      const response = await axios.post(
        loginapi,
        { username: email, password, portalID },
        { withCredentials: true } // This is important to allow cookies to be sent and received
      );
      if (response.status === 200) {
        if (response.data.firstLogin) {
          Swal.fire('Welcome!', 'Please change your password.', 'info');
          localStorage.setItem('token', response.data.tempToken); // Store the token
          navigate('/changepassword');
        } else {
          Swal.fire('Success!', 'Logged in successfully!', 'success');
          setIsAuthenticated(true);
          navigate('/dashboard');
        }
      }
    } catch (error) {
      Swal.fire('Error!', 'Invalid email or password. Please try again.', 'error');
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={6}>
          <ContentBox>
            <img
              src={img}
              alt="Company Logo"
              style={{ marginTop: '-100px', maxWidth: '80%' }}
            />
            <Typography variant="h4" gutterBottom>
              Welcome to the New Marketing Portal
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Our new marketing portal is a one-stop solution for all your marketing needs. It offers a range of powerful tools and features that will help you manage your campaigns more efficiently and effectively.
            </Typography>
          </ContentBox>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper elevation={6}>
            <TitleTypography variant="h5">Login to Your Account</TitleTypography>
            <StyledTextField
              fullWidth
              variant="outlined"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleIcon />
                  </InputAdornment>
                ),
              }}
            />
            <StyledTextField
              fullWidth
              variant="outlined"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="Remember Me"
                sx={{ color: themeColor.primaryDark }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: themeColor.primary,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  '&:hover': { color: themeColor.primaryDark },
                }}
              >
                Forgot Password?
              </Typography>
            </Box>
            <StyledButton
              variant="contained"
              onClick={handleLogin}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{
                backgroundColor: '#0b2d9c',
                width: '100%',
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </StyledButton>
          </StyledPaper>
        </Grid>
      </Grid>
    </Background>
  );
};

export default LoginPage;
