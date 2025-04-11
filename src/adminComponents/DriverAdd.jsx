import React, { useState } from "react";
import { TextField, Button, Card, Typography, Grid, Box, Container,InputLabel } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import CircularProgress from "@mui/material/CircularProgress";


const DriverAdd = () => {
  const navigate = useNavigate();
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

  const validate = () => {
    let tempErrors = {};
    tempErrors.driverName = driverData.driverName ? "" : "Driver Name is required";
    tempErrors.driverMobile =
      driverData.driverMobile.length === 10 ? "" : "Enter a valid 10-digit mobile number";
    tempErrors.email =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(driverData.email) ? "" : "Enter a valid email address";
    tempErrors.licenseNumber = driverData.licenseNumber ? "" : "License Number is required";
    tempErrors.licenseFile = driverData.licenseFile ? "" : "License file is required";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "driverMobile") {
      // Allow only numbers & max length 10
      const numericValue = value.replace(/\D/g, ""); // remove non-digits
      if (numericValue.length <= 10) {
        setDriverData({ ...driverData, [name]: numericValue });
      }
    } else if (name === "licenseNumber") {
      // Allow only alphanumeric & max length 15
      const alphaNumValue = value.replace(/[^a-zA-Z0-9]/g, ""); // remove non-alphanumeric
      if (alphaNumValue.length <= 15) {
        setDriverData({ ...driverData, [name]: alphaNumValue });
      }
    } else {
      // For other fields
      setDriverData({ ...driverData, [name]: value });
    }
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
  
      // Clear error if valid
      setErrors((prev) => ({ ...prev, [name]: '' }));
      setDriverData((prev) => ({ ...prev, [name]: file }));
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

for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/DriversAPI/DriverAdd`, formData, {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      console.log(response.data)
      if(response.data.code==1)
      {
        toast.success(response.data.message);
        navigate("/DriverList");
        
      }
      else
      {
        toast.error(response.data.message);
        setLoading(false);
      }
      
    } catch (error) {
      toast.error("Failed to add driver. Try again!"+error);
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
          <Container sx={{ mt: 10, mb: 5 }}>
            <Card sx={{ padding: 4, maxWidth: 600, margin: "20px auto", textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Add Driver
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid  xs={12}>
              <TextField fullWidth label="Driver Name" name="driverName" variant="outlined"
                value={driverData.driverName} onChange={handleChange} error={!!errors.driverName} helperText={errors.driverName} />
            </Grid>
            <Grid  xs={12}>
              <TextField fullWidth label="Mobile Number" name="driverMobile" type="number" variant="outlined"
                value={driverData.driverMobile} onChange={handleChange} error={!!errors.driverMobile} helperText={errors.driverMobile} />
            </Grid>
            <Grid  xs={12}>
              <TextField fullWidth label="Email ID" name="email" variant="outlined"
                value={driverData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} />
            </Grid>
            <Grid  xs={12}>
              <TextField fullWidth label="License Number" name="licenseNumber" variant="outlined"
                value={driverData.licenseNumber} onChange={handleChange} error={!!errors.licenseNumber} helperText={errors.licenseNumber} />
            </Grid>
            <Grid  xs={12}>
            <InputLabel>Upload Licence</InputLabel>
              <input type="file" name="licenseFile" onChange={handleFileChange} accept=".pdf,image/*" />
              {errors.licenseFile && <Typography color="error">{errors.licenseFile}</Typography>}
            </Grid>
            <Grid  xs={12}>
              <InputLabel>Upload Aadhaar</InputLabel>
              <input type="file" name="aadhaarCard" onChange={handleFileChange} accept=".pdf,image/*" />
            </Grid>
            <Grid  xs={12}>
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
  {loading ? <CircularProgress size={24} color="inherit" /> : "Add Driver"}
</Button>
        </form>
            </Card>
          </Container>
           <Footer />
       </Box>
    </Box>   
    </>
  );
};

export default DriverAdd;
