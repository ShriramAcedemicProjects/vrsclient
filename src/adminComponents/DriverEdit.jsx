import React, { useEffect, useState } from "react";
import { TextField, Button, Card, Typography, Grid, Box, Container, InputLabel, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const DriverEdit = () => {
  const navigate = useNavigate();
  const { driverId } = useParams();
  const [driverData, setDriverData] = useState({
    driverName: "",
    driverMobile: "",
    email: "",
    licenseNumber: "",
    licenseFile: null,
    aadhaarCard: null,
    panCard: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    console.log(driverId)
    fetchDriverDetails(driverId);
  }, [driverId]);

  const validate = () => {
    let tempErrors = {};
    tempErrors.driverName = driverData.driverName ? "" : "Driver Name is required";
    tempErrors.driverMobile = driverData.driverMobile.length === 10 ? "" : "Enter a valid 10-digit mobile number";
    tempErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(driverData.email) ? "" : "Enter a valid email address";
    tempErrors.licenseNumber = driverData.licenseNumber ? "" : "License Number is required";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleChange = (e) => {
    setDriverData({ ...driverData, [e.target.name]: e.target.value });
  };

  

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [name]: 'Only PDF and image files (jpg, jpeg, png) are allowed.',
        }));
        setDriverData((prev) => ({ ...prev, [name]: null }));
        return;
      }

      setErrors((prev) => ({ ...prev, [name]: '' }));
      setDriverData((prev) => ({ ...prev, [name]: file }));
    }
  };

  const fetchDriverDetails = async (driverId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/DriversAPI/GetDriverById/${driverId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data)
      if (res.data.code === 1) {
        setDriverData(res.data.driver); 
      } else {
        toast.error("Failed to fetch driver details");
        //navigate("/DriverList");
      }
    } catch (error) {
      toast.error("Error fetching driver details"+error);
      //navigate("/DriverList");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const formData = new FormData();
    Object.keys(driverData).forEach((key) => {
      if (driverData[key]) {
        formData.append(key, driverData[key]);
      }
    });

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/DriversAPI/DriverUpdate/${driverId}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
//console.log(res.data)
      if (res.data.code === 1) {
        toast.success(res.data.message);
        navigate("/DriverList");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Error updating driver"+error);
    } finally {
      setLoading(false);
    }
  };

 

  if (initialLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 20 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
        <Container sx={{ mt: 10, mb: 5 }}>
          <Card sx={{ padding: 4, maxWidth: 600, margin: "20px auto", textAlign: "center" }}>
            <Typography variant="h5" gutterBottom>
              Edit Driver
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <TextField fullWidth label="Driver Name" name="driverName" variant="outlined"
                    value={driverData.driverName} onChange={handleChange} error={!!errors.driverName} helperText={errors.driverName} />
                </Grid>
                <Grid xs={12}>
                  <TextField fullWidth label="Mobile Number" name="driverMobile" type="number" variant="outlined"
                    value={driverData.driverMobile} onChange={handleChange} error={!!errors.driverMobile} helperText={errors.driverMobile} />
                </Grid>
                <Grid xs={12}>
                  <TextField fullWidth label="Email ID" name="email" variant="outlined"
                    value={driverData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} />
                </Grid>
                <Grid xs={12}>
                  <TextField fullWidth label="License Number" name="licenseNumber" variant="outlined"
                    value={driverData.licenseNumber} onChange={handleChange} error={!!errors.licenseNumber} helperText={errors.licenseNumber} />
                </Grid>
                <Grid xs={12}>
                  <InputLabel>Upload Licence</InputLabel>
                  <input type="file" name="licenseFile" onChange={handleFileChange} accept=".pdf,image/*" />
                  {errors.licenseFile && <Typography color="error">{errors.licenseFile}</Typography>}
                </Grid>
                <Grid xs={12}>
                  <InputLabel>Upload Aadhaar</InputLabel>
                  <input type="file" name="aadhaarCard" onChange={handleFileChange} accept=".pdf,image/*" />
                </Grid>
                <Grid xs={12}>
                  <InputLabel>Upload PAN</InputLabel>
                  <input type="file" name="panCard" onChange={handleFileChange} accept=".pdf,image/*" />
                </Grid>
              </Grid>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{ marginTop: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Update Driver"}
              </Button>
            </form>
          </Card>
        </Container>
        <Footer />
      </Box>
    </Box>
  );
};

export default DriverEdit;
