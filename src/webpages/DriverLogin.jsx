import React, { useState } from "react";
import { Container, TextField, Button, Card, Typography, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { useDispatch } from "react-redux";
import { loginSuccess} from "../redux/authSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DriverLogin = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validate = () => {
    let tempErrors = {};
    tempErrors.mobile =
    mobile ? (/^\d{10}$/.test(mobile) ? "" : "Enter valid 10-digit mobile") : "Mobile is required";
  tempErrors.password = password ? "" : "Password is required";
  setErrors(tempErrors);
  return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/DriversAPI/DriverLogin`,
        { mobile, password }
      );

      if (response.data.code === 1) {
        toast.success(response.data.message);
        localStorage.setItem("drivertoken", response.data.token);
        localStorage.setItem("driverdata", JSON.stringify(response.data.driver));
        navigate("/DriverDashboard");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Login Failed:", error.response?.data || error.message);
      toast.error("Login failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(#fad0c4 0%, #ffd1ff 100%)",
        width:1275

      }}
    >
      <Card sx={{ padding: 4, width: 350, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Driver Login
        </Typography>
        <form onSubmit={handleSubmit}>
        <TextField
            fullWidth
            label="Mobile Number"
            variant="outlined"
            margin="normal"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            error={!!errors.mobile}
            helperText={errors.mobile}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            sx={{ marginTop: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </form>
      </Card>
    </Box>
  );
};

export default DriverLogin;
