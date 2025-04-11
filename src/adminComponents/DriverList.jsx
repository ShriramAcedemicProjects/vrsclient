import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions,Button,TextField,Menu, MenuItem,Box,Typography,Container,Card,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import {Visibility, Edit, Delete } from "@mui/icons-material";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyIcon from "@mui/icons-material/VpnKey";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DriverList = () => {
  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate();

const [openAssignModal, setOpenAssignModal] = useState(false);
const [selectedDriver, setSelectedDriver] = useState(null);
const [selectedVehicle, setSelectedVehicle] = useState("");
const [vehicles, setVehicles] = useState([]);

const [anchorEl, setAnchorEl] = useState(null);
const [selectedDriverId, setSelectedDriverId] = useState(null);



  useEffect(() => {
     const token = localStorage.getItem("token");
         if (!token) {
              toast.error("Unauthorized Access");
              navigate("/AdminLogin");
            }
        
    fetchDrivers(token);
  }, []);

  const fetchDrivers = async (token) => {
    try {
      
         const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/DriversAPI/DriverList`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                console.log(response.data)
      setDrivers(response.data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  const handleActionClick = (event, driverId) => {
    setAnchorEl(event.currentTarget);
    setSelectedDriverId(driverId);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGeneratePassword = async (driverId) => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/DriversAPI/generate-password/${driverId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      toast.success(response.data.message);
      console.log("Username:", response.data.username);
      console.log("Password:", response.data.password);
      fetchDrivers(token); // Refresh list
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate password");
    }
  };
  

  
  const handleOpenAssignModal = async (driver) => {
    //console.log(driver)
    setSelectedDriver(driver);
    setOpenAssignModal(true);
    //setSelectedVehicle(driver.vehicleId)
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/vehiclesAPI/Vehiclelist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      //console.log(response.data)
      setVehicles(response.data);

        // Check if driver has vehicleId and it exists in fetched vehicles
    const vehicleExists = response.data.find(
      (vehicle) => vehicle._id === driver.vehicleId
    );

    if (vehicleExists) {
      setSelectedVehicle(driver.vehicleId);
    } else {
      setSelectedVehicle(""); // Clear if not found
    }
      
    } catch (error) {
      console.log(error)
      toast.error("Failed to fetch vehicles list"+error);
    }
  };
  
  const handleCloseAssignModal = () => {
    setOpenAssignModal(false);
    setSelectedVehicle("");
  };
  
  const handleAssignVehicle = async () => {
    if (!selectedVehicle) {
      toast.error("Please select a vehicle");
      return;
    }
  
    try {
      const token = localStorage.getItem("token")
      //console.log(token)
      const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/DriversAPI/assign-vehicle/${selectedDriver._id}`,
        { vehicleId: selectedVehicle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if(response.data.code==1)
      {
      toast.success("Vehicle Assigned Successfully");
      handleCloseAssignModal();
      fetchDrivers(token); // refresh list
    }
    else{
         toast.error(response.data.message)
    }
    } catch (error) {
      toast.error("Failed to assign vehicle"+error);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit driver with ID:", id);
    // Add edit logic here
    navigate("/DriverEdit/"+id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/DriversAPI/DriverDelete/${id}`,{
          headers: { Authorization: `Bearer ${token}` },});
          toast.success("Driver Deleted Succesfully")
        setDrivers(drivers.filter(driver => driver._id !== id));
      } catch (error) {
        console.error("Error deleting driver:", error);
      }
    }
  };

  return (
   
    <Box sx={{ display: "flex" }}>
    <Sidebar />
    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
        <Container sx={{ mt: 10, mb: 5 }}>
          <Card sx={{ padding: 4, maxWidth: 950, margin: "20px auto", textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Driver List
      </Typography>
      <TableContainer component={Paper}>
      <Table>
  <TableHead>
    <TableRow>
      <TableCell>Name</TableCell>
      <TableCell>Mobile</TableCell>
      <TableCell>Email</TableCell>
      <TableCell>License Number</TableCell>
      <TableCell>License File</TableCell>
      <TableCell>Aadhaar File</TableCell>
      <TableCell>PAN File</TableCell>
      <TableCell>Actions</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {drivers.map((driver) => (
      <TableRow key={driver._id}>
        <TableCell>{driver.driverName}</TableCell>
        <TableCell>{driver.driverMobile}</TableCell>
        <TableCell>{driver.email}</TableCell>
        <TableCell>{driver.licenseNumber}</TableCell>

        {/* License File View */}
        <TableCell>
          {driver.licenceUpload && (
            <IconButton
              component="a"
              href={`${import.meta.env.VITE_API_BASE_URL}/uploads/${driver.licenceUpload}`}
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
            >
              <Visibility />
            </IconButton>
          )}
        </TableCell>

        {/* Aadhaar File View */}
        <TableCell>
          {driver.aadhaarCard && (
            <IconButton
              component="a"
              href={`${import.meta.env.VITE_API_BASE_URL}/uploads/${driver.aadhaarCard}`}
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
            >
              <Visibility />
            </IconButton>
          )}
        </TableCell>

        {/* PAN File View */}
        <TableCell>
          {driver.panCard && (
            <IconButton
              component="a"
              href={`${import.meta.env.VITE_API_BASE_URL}/uploads/${driver.panCard}`}
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
            >
              <Visibility />
            </IconButton>
          )}
        </TableCell>

        {/* Actions */}
        <TableCell>
        
           <IconButton onClick={(e) => handleActionClick(e, driver._id)}>
              <MoreVertIcon />
           </IconButton>

           <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl) && selectedDriverId === driver._id}
    onClose={handleClose}
  >
    <MenuItem
      onClick={() => {
        handleEdit(driver._id);
        handleClose();
      }}
      
    >
     <Edit color="primary" /> Edit
    </MenuItem>
    <MenuItem
      onClick={() => {
        handleDelete(driver._id);
        handleClose();
      }}
    >
    <Delete color="secondary" /> Delete
    </MenuItem>
   
    <MenuItem
      onClick={() => {
        handleOpenAssignModal(driver);
        handleClose();
      }}
    >
        <DirectionsCarIcon color="success" /> Assign Driver
      </MenuItem>
      <MenuItem
  onClick={() => {
    handleGeneratePassword(driver._id);
    handleClose();
  }}
>
  <KeyIcon fontSize="small" sx={{ mr: 1 }} /> Generate Password
</MenuItem>

      </Menu>
         
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
    </TableContainer>

    <Dialog open={openAssignModal} onClose={handleCloseAssignModal}>
  <DialogTitle>Assign Vehicle to {selectedDriver?.driverName}</DialogTitle>
  <DialogContent>
    <TextField
      select
      label="Select Vehicle"
      value={selectedVehicle || ""}
      onChange={(e) => setSelectedVehicle(e.target.value)}
      fullWidth
    >
      {vehicles.map((vehicle) => (
        <MenuItem key={vehicle._id} value={vehicle._id}>
          {vehicle.vehicleNumber} {vehicle.vehicleName}
        </MenuItem>
      ))}
    </TextField>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseAssignModal}>Cancel</Button>
    <Button onClick={handleAssignVehicle} variant="contained" color="primary">
      Assign
    </Button>
  </DialogActions>
</Dialog>
          </Card>
        </Container>
         <Footer />
     </Box>
  </Box>  
  );
};

export default DriverList;
