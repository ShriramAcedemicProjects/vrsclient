import React from "react";
import { AppBar, Toolbar, Typography, Avatar, Menu, MenuItem, IconButton } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout} from "../redux/authSlice";

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    console.log("Logout clicked");
    dispatch(logout())
    navigate("/AdminLogin")
    // Handle logout logic here
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" sx={{ width: `calc(100% - 250px)`, ml: "250px",backgroundColor:"#6a11cb" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
          Admin Dashboard
        </Typography>
        <IconButton onClick={handleMenuOpen}>
          <Avatar><AccountCircle /></Avatar>
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
