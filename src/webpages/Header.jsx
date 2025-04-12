import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#f7735b", width: '100%' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          RideEase
        </Typography>
        <Box>
          <Button component={Link} to="/" color="inherit">Home</Button>
          <Button component={Link} to="/about" color="inherit">About</Button>
          <Button component={Link} to="/contact" color="inherit">Contact</Button>
          <Button component={Link} to="/Register" color="inherit">Register</Button>
          <Button component={Link} to="/CustomerLogin" color="inherit">Login</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
