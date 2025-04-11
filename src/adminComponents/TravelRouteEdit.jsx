import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Typography,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  OutlinedInput,
  Chip,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate, useParams } from "react-router-dom";

const TravelRouteEdit = () => {
  const navigate = useNavigate();
  const { routeId } = useParams(); // Get routeId from URL params

  const [routeData, setRouteData] = useState({
    source: "",
    destination: "",
    kilometer: "",
    autoIds: [],
    carIds: [],
  });

  const [errors, setErrors] = useState({});
  const [autos, setAutos] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);

  const sourceList = Array.from({ length: 10 }, (_, i) => `Source-${i + 1}`);
  const destinationList = Array.from({ length: 10 }, (_, i) => `Destination-${i + 1}`);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized Access");
      navigate("/AdminLogin");
    }
    fetchVehicles();
    fetchRouteDetails();
  }, [routeId]);

  // Fetch vehicles (auto and car lists)
  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem("token");
      const [autoRes, carRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/vehiclesAPI/getAutoList`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/vehiclesAPI/getCarList`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setAutos(autoRes.data);
      setCars(carRes.data);
    } catch (error) {
      toast.error("Failed to fetch vehicles");
    }
  };

  // Fetch route details
  const fetchRouteDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/TravelRoute/getRouteById/${routeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
console.log(response.data)
      if (response.data.code === 1) {
        setRouteData({
          source: response.data.route.source,
          destination: response.data.route.destination,
          kilometer: response.data.route.kilometer,
          autoIds: response.data.route.autoIds.map((auto) => auto._id),  // extract only _id
          carIds: response.data.route.carIds.map((car) => car._id),     // extract only _id
      
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch route details");
    }
    setLoading(false);
  };

  

  const handleChange = (e) => {
    setRouteData({ ...routeData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Handle multi-select change
const handleMultiSelectChange = (e) => {
    const { name, value } = e.target;
    setRouteData({ ...routeData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!routeData.source) newErrors.source = "Source is required";
    if (!routeData.destination) newErrors.destination = "Destination is required";
    if (!routeData.kilometer) newErrors.kilometer = "Kilometer is required";
    if (routeData.autoIds.length === 0) newErrors.autoIds = "Select at least one Auto";
    if (routeData.carIds.length === 0) newErrors.carIds = "Select at least one Car";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/TravelRoute/updateRoute/${routeId}`,
        routeData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
//console.log(response.data)
      if (response.data.code === 1) {
        toast.success(response.data.message);
        navigate("/TravelRouteList"); // Redirect to list after successful update
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update route");
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <Sidebar />
      <Box sx={{ p: 10, ml: 30 }}>
        <Typography variant="h5" gutterBottom>Edit Travel Route</Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            select
            label="Source"
            name="source"
            value={routeData.source}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.source}
            helperText={errors.source}
          >
            {sourceList.map((src) => (
              <MenuItem key={src} value={src}>{src}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Destination"
            name="destination"
            value={routeData.destination}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.destination}
            helperText={errors.destination}
          >
            {destinationList.map((dest) => (
              <MenuItem key={dest} value={dest}>{dest}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="Kilometer"
            name="kilometer"
            type="number"
            value={routeData.kilometer}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.kilometer}
            helperText={errors.kilometer}
          />

          {/* Multi Select Auto */}
          <FormControl fullWidth margin="normal" error={Boolean(errors.autoIds)}>
  <InputLabel>Auto List</InputLabel>
  <Select
    multiple
    name="autoIds"
    value={routeData.autoIds}
    onChange={handleMultiSelectChange}
    input={<OutlinedInput label="Auto List" />}
    renderValue={(selected) => (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {selected.map((id) => {
          // Find the vehicleName for each selected autoId
          const auto = autos.find(a => a._id === id);
          return auto ? (
            <Chip key={auto._id} label={auto.vehicleName} />
          ) : null;
        })}
      </Box>
    )}
  >
    {autos.map((auto) => (
      <MenuItem key={auto._id} value={auto._id}>
        {auto.vehicleName}
      </MenuItem>
    ))}
  </Select>
  <FormHelperText>{errors.autoIds}</FormHelperText>
</FormControl>


          {/* Multi Select Car */}
          <FormControl fullWidth margin="normal" error={Boolean(errors.carIds)}>
  <InputLabel>Car List</InputLabel>
  <Select
    multiple
    name="carIds"
    value={routeData.carIds}
    onChange={handleMultiSelectChange}
    input={<OutlinedInput label="Car List" />}
    renderValue={(selected) => (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {selected.map((id) => {
          // Find the vehicleName for each selected carId
          const car = cars.find(c => c._id === id);
          return car ? (
            <Chip key={car._id} label={car.vehicleName} />
          ) : null;
        })}
      </Box>
    )}
  >
    {cars.map((car) => (
      <MenuItem key={car._id} value={car._id}>
        {car.vehicleName}
      </MenuItem>
    ))}
  </Select>
  <FormHelperText>{errors.carIds}</FormHelperText>
</FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Update Route"}
          </Button>
        </form>
      </Box>
      <Footer />
    </>
  );
};

export default TravelRouteEdit;
