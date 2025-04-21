import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header'
import Footer from './Footer'

const CustomerLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
      });
    
      const [errors, setErrors] = useState({});
      const [showPassword, setShowPassword] = useState(false);
      const [errorMsg, setErrorMsg] = useState('');
      const [successMsg, setSuccessMsg] = useState('');
    
      const navigate = useNavigate();
    
      const validate = () => {
        const newErrors = {};
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)) newErrors.email = 'Only @gmail.com email is allowed';
        if (!formData.password.trim()) newErrors.password = 'Password is required';
        return newErrors;
      };
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
    
        const formErrors = validate();
        if (Object.keys(formErrors).length > 0) {
          setErrors(formErrors);
          return;
        }
    
        try {
          const res = await axios.post('http://localhost:5000/authAPI/loginUser', formData);
          if (res.data.code === 1) {
            setSuccessMsg(res.data.message);
    
            // Save token and user to localStorage if needed
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
    
            setTimeout(() => {
              navigate('/CustomerDashboard'); // Update route based on your app
            }, 1000);
          } else {
            setErrorMsg(res.data.message);
          }
        } catch (err) {
          setErrorMsg('Something went wrong. Try again.');
        }
      };
  return (
    <>
         <Header />
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" align="center" gutterBottom>
            User Login
          </Typography>

          {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
          {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              type="email"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <Button fullWidth sx={{backgroundColor: "#f7735b",}} variant="contained" type="submit">
              Login
            </Button>
          </form>
        </Paper>
      </Container>
      <Footer />
    </>
  )
}

export default CustomerLogin
