import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import axios from 'axios';
import Header from '../webpages/Header';
import Footer from '../webpages/Footer';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    password: '',
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await axios.post('http://localhost:5000/authAPI/registerUser', {
        ...formData,
        role: 'customer',
      });
      setSuccessMsg('Registration successful!');
      setFormData({
        firstName: '',
        lastName: '',
        mobile: '',
        email: '',
        password: '',
      });
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || 'Registration failed. Try again.'
      );
    }
  };

  return (
    <>
    <Header/>
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Customer Registration
        </Typography>

        {successMsg && <Typography color="success.main">{successMsg}</Typography>}
        {errorMsg && <Typography color="error.main">{errorMsg}</Typography>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mobile Number"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Button fullWidth variant="contained" type="submit">
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
    <Footer/>
    </>
  );
};

export default Register;
