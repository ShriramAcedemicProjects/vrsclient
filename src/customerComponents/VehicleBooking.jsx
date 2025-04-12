import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
  TextField,
} from "@mui/material";
import CustomerLayout from "./CustomerLayout";

const VehicleBooking = ({ customerId }) => {
  const [routes, setRoutes] = useState([]);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [matchedRoute, setMatchedRoute] = useState(null);

  const [vehicleType, setVehicleType] = useState("Car");
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [travelDateTime, setTravelDateTime] = useState("");
  const [rentAmount, setRentAmount] = useState(0);

  // Fetch all routes from backend
  useEffect(() => {
    const token = localStorage.getItem("token"); // Optional: if auth middleware is applied

    axios.get("http://localhost:5000/TravelRoute/RouteList", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => setRoutes(res.data))
      .catch(err => console.error(err));
  }, []);

  // Update matched route & vehicles when source/destination/type changes
  useEffect(() => {
    if (source && destination) {
      const route = routes.find(
        r => r.source === source && r.destination === destination
      );
      setMatchedRoute(route);

      if (route) {
        const vehicles = vehicleType === "Car" ? route.carIds : route.autoIds;
        const activeVehicles = vehicles.filter(v => v.Active);
        setAvailableVehicles(activeVehicles);
      } else {
        setAvailableVehicles([]);
      }
    }
  }, [source, destination, vehicleType, routes]);

  // Calculate rent
  useEffect(() => {
    if (selectedVehicle && matchedRoute) {
      const vehicle = availableVehicles.find(v => v._id === selectedVehicle);
      if (vehicle) {
        setRentAmount(matchedRoute.kilometer * vehicle.rentPerDay);
      }
    }
  }, [selectedVehicle, matchedRoute, availableVehicles]);

  const handleBooking = () => {
    if (!matchedRoute || !selectedVehicle || !travelDateTime) {
      alert("Please fill all fields.");
      return;
    }

    const bookingData = {
      customerId,
      routeId: matchedRoute._id,
      vehicleId: selectedVehicle,
      vehicleType,
      travelDateTime,
      rentAmount,
    };

    axios.post("http://localhost:5000/VehicleBooking/create", bookingData)
      .then(() => {
        alert("Booking successful!");
        // Reset form if needed
        setSource("");
        setDestination("");
        setSelectedVehicle(null);
        setRentAmount(0);
        setTravelDateTime("");
      })
      .catch(err => console.error(err));
  };

  const uniqueSources = [...new Set(routes.map(r => r.source))];
  const uniqueDestinations = [...new Set(routes.map(r => r.destination))];

  return (
    <CustomerLayout>
      <Box p={3}>
        <Typography variant="h5" mb={2}>Book a Vehicle</Typography>

        {/* Source */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Source</InputLabel>
          <Select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            label="Source"
          >
            {uniqueSources.map((src, i) => (
              <MenuItem key={i} value={src}>{src}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Destination */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Destination</InputLabel>
          <Select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            label="Destination"
          >
            {uniqueDestinations.map((dest, i) => (
              <MenuItem key={i} value={dest}>{dest}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Vehicle Type */}
        <FormControl component="fieldset" margin="normal">
          <RadioGroup
            row
            value={vehicleType}
            onChange={(e) => {
              setVehicleType(e.target.value);
              setSelectedVehicle(null);
            }}
          >
            <FormControlLabel value="Car" control={<Radio />} label="Car" />
            <FormControlLabel value="Auto" control={<Radio />} label="Auto" />
          </RadioGroup>
        </FormControl>

        {/* Available Vehicles */}
        {availableVehicles.length > 0 && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Vehicle</InputLabel>
            <Select
              value={selectedVehicle || ""}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              label="Select Vehicle"
            >
              {availableVehicles.map((vehicle) => (
                <MenuItem key={vehicle._id} value={vehicle._id}>
                  {vehicle.vehicleName} ({vehicle.vehicleNumber}) - ₹{vehicle.rentPerDay}/km
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Travel Date & Time */}
        <TextField
          fullWidth
          type="datetime-local"
          label="Travel Date & Time"
          InputLabelProps={{ shrink: true }}
          margin="normal"
          value={travelDateTime}
          onChange={(e) => setTravelDateTime(e.target.value)}
        />

        {/* Rent */}
        <Typography variant="h6" mt={2}>
          Rent Amount: ₹{rentAmount.toFixed(2)}
        </Typography>

        {/* Submit */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleBooking}
          sx={{ mt: 2 }}
        >
          Confirm Booking
        </Button>
      </Box>
    </CustomerLayout>
  );
};

export default VehicleBooking;
