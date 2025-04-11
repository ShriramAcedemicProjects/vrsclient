import React,{useEffect} from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";


const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized Access");
      navigate("/AdminLogin");
    }
  }, [navigate]);


  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Header */}
        <Header />
        <Container sx={{ mt: 10, mb: 5 }}>
          <Typography variant="h4">Welcome to Admin Dashboard</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Manage drivers, vehicles, and bookings efficiently.
          </Typography>
        </Container>
        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  );
};

export default Dashboard;
