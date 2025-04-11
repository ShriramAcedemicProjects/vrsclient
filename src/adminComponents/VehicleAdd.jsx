import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Card, Typography, Grid, Box, Container } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const VehicleAdd = () => {
  const navigate = useNavigate();
  const [vehicleData, setVehicleData] = useState({
    vehicleName: "",
    vehicleNumber: "",
    seatingCapacity: "",
    rentPerDay: "",
    fuelEfficiency: "",
    vehicleCategory: "",
  });
  const [errors, setErrors] = useState({});
  const vehicleTypes = ["Petrol", "Diesel", "CNG"];
  const vehicleCategories = ["Auto", "Car"];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized Access");
      navigate("/AdminLogin");
    }
  }, [navigate]);

  const validate = () => {
    let tempErrors = {};
    tempErrors.vehicleName = vehicleData.vehicleName ? "" : "Vehicle Name is required";
    tempErrors.vehicleNumber = vehicleData.vehicleNumber ? "" : "Vehicle Number is required";
    
    tempErrors.seatingCapacity = vehicleData.seatingCapacity ? "" : "Seating Capacity is required";
    tempErrors.rentPerDay = vehicleData.rentPerDay ? "" : "Rate per KM is required";
    //tempErrors.fuelEfficiency = vehicleData.fuelEfficiency ? "" : "Fuel Efficiency is required";
    tempErrors.vehicleCategory = vehicleData.vehicleCategory ? "" : "Vehicle Category is required";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleChange = (e) => {
    setVehicleData({ ...vehicleData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/vehiclesAPI/VehicleAdd`, vehicleData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Vehicle added successfully!");
      window.setTimeout(()=>{navigate("/VehicleList")},3000)
      
    } catch (error) {
      toast.error("Failed to add vehicle. Try again!");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
        <Container sx={{ mt: 10, mb: 5 }}>
          <Card sx={{ padding: 4, width: "90%", maxWidth: 800, margin: "20px auto", textAlign: "center" }}>
            <Typography variant="h5" gutterBottom>
              Add Vehicle
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
              
                  <TextField select fullWidth label="Vehicle Category" name="vehicleCategory" variant="outlined"
                    value={vehicleData.vehicleCategory} onChange={handleChange} error={!!errors.vehicleCategory} helperText={errors.vehicleCategory}>
                    {vehicleCategories.map((category) => (<MenuItem key={category} value={category}>{category}</MenuItem>))}
                  </TextField>
                
                <Grid item >
                  <TextField sx={{width:300}} label="Vehicle Name" name="vehicleName" variant="outlined" 
                    value={vehicleData.vehicleName} onChange={handleChange} error={!!errors.vehicleName} helperText={errors.vehicleName} />
                </Grid>
                <Grid item >
                  <TextField fullWidth label="Vehicle Number" name="vehicleNumber" variant="outlined" 
                    value={vehicleData.vehicleNumber} onChange={handleChange} error={!!errors.vehicleNumber} helperText={errors.vehicleNumber} />
                </Grid>
                {/*<Grid item >
                  <TextField select fullWidth label="Vehicle Type" name="vehicleType" variant="outlined"
                    value={vehicleData.vehicleType} onChange={handleChange} error={!!errors.vehicleType} helperText={errors.vehicleType}>
                    {vehicleTypes.map((type) => (<MenuItem key={type} value={type}>{type}</MenuItem>))}
                  </TextField>
                </Grid>*/}
                
                <Grid item >
                  <TextField fullWidth label="Seating Capacity" name="seatingCapacity" type="number" variant="outlined"
                    value={vehicleData.seatingCapacity} onChange={handleChange} error={!!errors.seatingCapacity} helperText={errors.seatingCapacity} />
                </Grid>
                <Grid item >
                  <TextField fullWidth label="Rate per KM" name="rentPerDay" type="number" variant="outlined"
                    value={vehicleData.rentPerDay} onChange={handleChange} error={!!errors.rentPerDay} helperText={errors.rentPerDay} />
                </Grid>
                <Grid item >
                  <TextField fullWidth label="Fuel Efficiency (km/l)" name="fuelEfficiency" type="number" variant="outlined"
                    value={vehicleData.fuelEfficiency} onChange={handleChange} error={!!errors.fuelEfficiency} helperText={errors.fuelEfficiency} />
                </Grid>
              </Grid>
              <Button fullWidth variant="contained" color="primary" type="submit" sx={{ marginTop: 2 }}>
                Add Vehicle
              </Button>
            </form>
          </Card>
        </Container>
        <Footer />
      </Box>
    </Box>
  );
};

export default VehicleAdd;
