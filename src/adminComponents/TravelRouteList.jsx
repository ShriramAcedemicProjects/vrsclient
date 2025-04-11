import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const TravelRouteList = () => {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized Access");
      navigate("/AdminLogin");
    } else {
      fetchRoutes();
    }
  }, []);

  const fetchRoutes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/TravelRoute/RouteList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoutes(res.data);
    } catch (error) {
      toast.error("Failed to fetch route list"+error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure want to delete this route?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/TravelRoute/deleteRoute/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Route Deleted Successfully");
        fetchRoutes();
      } catch (error) {
        toast.error("Failed to delete route",error);
      }
    }
  };

  return (
    <>
      <Header />
      <Sidebar />
      <Box sx={{ p: 10, ml: 30 }}>
        <Typography variant="h5" gutterBottom>
          Travel Route List
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr.No</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Destination</TableCell>
                <TableCell>Kilometer</TableCell>
                <TableCell>Autos</TableCell>
                <TableCell>Cars</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {routes.length > 0 ? (
                routes.map((route, index) => (
                  <TableRow key={route._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{route.source}</TableCell>
                    <TableCell>{route.destination}</TableCell>
                    <TableCell>{route.kilometer}</TableCell>
                    <TableCell>
                      {route.autoIds.map((auto) => auto.vehicleName).join(", ")}
                    </TableCell>
                    <TableCell>
                      {route.carIds.map((car) => car.vehicleName).join(", ")}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => navigate(`/TravelRouteEdit/${route._id}`)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(route._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No Route Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Footer />
    </>
  );
};

export default TravelRouteList;
