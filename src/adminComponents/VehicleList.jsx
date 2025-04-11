import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { Box, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
     if (!token) {
          toast.error("Unauthorized Access");
          navigate("/AdminLogin");
        }
    fetchVehicles(token);
  }, []);

  const fetchVehicles = async (token) => {
    try {
        
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/vehiclesAPI/Vehiclelist`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        //console.log(response)
      setVehicles(response.data);
    } catch (error) {
      toast.error("Failed to fetch vehicles"+error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/VehicleEdit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/vehiclesAPI/VehicleDelete/${id}`,{
            headers: { Authorization: `Bearer ${token}` },});
        toast.success("Vehicle deleted successfully!");
        fetchVehicles(token);
      } catch (error) {
        toast.error("Failed to delete vehicle"+error);
      }
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
        <Container sx={{ mt: 10, mb: 5 }}>
          <Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
            Vehicle List
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vehicle Name</TableCell>
                  <TableCell>Vehicle Number</TableCell>
                  <TableCell>Vehicle Type</TableCell>
                  <TableCell>Seating Capacity</TableCell>
                  <TableCell>Rate per KM</TableCell>
                  <TableCell>Fuel Efficiency</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicles.length > 0 ? (
                  vehicles.map((vehicle) => (
                    <TableRow key={vehicle._id}>
                      <TableCell>{vehicle.vehicleName}</TableCell>
                      <TableCell>{vehicle.vehicleNumber}</TableCell>
                      <TableCell>{vehicle.vehicleType}</TableCell>
                      <TableCell>{vehicle.seatingCapacity}</TableCell>
                      <TableCell>{vehicle.rentPerDay}</TableCell>
                      <TableCell>{vehicle.fuelEfficiency}</TableCell>
                      
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleEdit(vehicle._id)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(vehicle._id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No vehicles found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
        <Footer />
      </Box>
    </Box>
  );
};

export default VehicleList;
