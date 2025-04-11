import React, { useState } from "react";
import { Container, TextField, Button, Card, Typography, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { useDispatch } from "react-redux";
import { loginSuccess} from "../redux/authSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validate = () => {
    let tempErrors = {};
    tempErrors.email =
      email ? (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Invalid Email Format") : "Email is required";
    tempErrors.password = password ? "" : "Password is required";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/authAPI/loginUser`, { email, password });
      //console.log("Login Success:", response.data);
      // Handle successful login (store token, redirect, etc.)
      if(response.data.code==1)
      {
        toast.success(response.data.message)
        dispatch(loginSuccess(response.data));
        navigate("/dashboard")
      }
      else{
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error("Login Failed:", error.response?.data || error.message);
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
        background: "linear-gradient(rgba(106, 17, 203, 0.7), rgba(37, 117, 252, 0.7))",
       
        width:1275

      }}
    >
      <Card sx={{ padding: 4, width: 350, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Admin Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email ID"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
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

export default Login;
