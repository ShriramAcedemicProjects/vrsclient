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
import { toast } from "react-toastify";
import CustomerLayout from "./CustomerLayout";

const VehicleBooking = () => {
  
  const [routes, setRoutes] = useState([]);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [matchedRoute, setMatchedRoute] = useState(null);
  const [km, setKM] = useState(null);

  const [vehicleType, setVehicleType] = useState();
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [travelDateTime, setTravelDateTime] = useState("");
  const [rentAmount, setRentAmount] = useState(0);

  // Fetch all routes from backend
  useEffect(() => {
    const token = localStorage.getItem("token"); // Optional: if auth middleware is applied

    axios.get(`${import.meta.env.VITE_API_BASE_URL}/TravelRoute/RouteList`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => setRoutes(res.data))
      .catch(err => console.error(err));
  }, []);

  const fetchAvailableVehicle = async (type) => {
    try {
      const token = localStorage.getItem("token"); // or wherever your token is
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/BookingAPI/getAvailableVehicles`, {
        params: {
          type: type,
          source: source,         // or your state variable for source
          destination: destination // or your state variable for destination
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  console.log(response.data);
      if (response.data.code === 1) {
        setAvailableVehicles(response.data.vehicles);
        setKM(response.data.kilometer+"KM")
      } else {
        setAvailableVehicles([]);
        toast.error(response.data.message || "No vehicles found.");
      }
    } catch (error) {
      console.error("Error fetching available vehicles:", error);
      toast.error("Failed to fetch vehicles.");
      setAvailableVehicles([]);
    }
  };
  

  const handleBooking = () => {
    if (!source || !destination || !selectedVehicle || !travelDateTime) {
      //alert("Please fill all fields.");
      toast.error("Please fill all fields.")
      return;
    }

    const bookingData = {
      source:source,
      destination:destination,
      vehicleId: selectedVehicle,
      vehicleType,
      travelDateTime,
      rentAmount,
    };
    const token = localStorage.getItem("token"); // or wherever your token is
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/BookingAPI/CreateBooking`,bookingData,{ headers: {
      Authorization: `Bearer ${token}`,
    }})
          .then((response) => {
        //alert("Booking successful!");
        toast.success(response.data.message)
        // Reset form if needed
        setSource("");
        setDestination("");
        setSelectedVehicle(null);
        setRentAmount(0);
        setTravelDateTime("");
      })
      .catch(err => console.error(err));
  };

  //const uniqueSources = [...new Set(routes.map(r => r.source))];
  //const uniqueDestinations = [...new Set(routes.map(r => r.destination))];
  const uniqueSources = Array.from({ length: 10 }, (_, i) => `Source-${i + 1}`);
  const uniqueDestinations = Array.from({ length: 10 }, (_, i) => `Destination-${i + 1}`);

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
<Typography>{km}</Typography>
        {/* Vehicle Type */}
        <FormControl fullWidth margin="normal">
  <InputLabel id="vehicle-type-label">Vehicle Type</InputLabel>
  <Select
    labelId="vehicle-type-label"
    value={vehicleType}
    label="Vehicle Type"
    onChange={(e) => {
      const type = e.target.value;
      setVehicleType(type);
      setSelectedVehicle(null);
      if (type !== "SELECT" && source && destination) {
        fetchAvailableVehicle(type);
      } else {
        toast.warn("Please select source and destination first.");
        setAvailableVehicles([]);
      }
    }}
  >
    <MenuItem value="SELECT">--SELECT VEHICLE--</MenuItem>
    <MenuItem value="Car">Car</MenuItem>
    <MenuItem value="Auto">Auto</MenuItem>
  </Select>
</FormControl>

        {/* Available Vehicles */}
        {availableVehicles.length > 0 && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Vehicle</InputLabel>
            <Select
              value={selectedVehicle || ""}
              onChange={(e) =>{
                const selectedId = e.target.value;
                setSelectedVehicle(selectedId);
          
                // Find the selected vehicle object
                const vehicle = availableVehicles.find((v) => v._id === selectedId);
          
          const kilometer = parseFloat(km.replace("KM",""))
          
                if (vehicle && kilometer > 0) {
                  const rent = vehicle.rentPerDay * kilometer;
                  setRentAmount(rent);
                } else {
                  setRentAmount(0);
                }
              }}
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
