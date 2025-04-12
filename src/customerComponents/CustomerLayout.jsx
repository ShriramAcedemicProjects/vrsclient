import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { useNavigate ,Link} from 'react-router-dom';
import {
  Box, AppBar as MuiAppBar, Toolbar, CssBaseline, Drawer, IconButton,
  Typography, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Menu, MenuItem, Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: open ? 0 : `-${drawerWidth}px`,
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

const CustomerLayout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ background: '#f7735b' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
<Box sx={{ flexGrow: 1 }}>
          <Link to="/CustomerDashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
     <Typography
          variant="h6"
          noWrap
          sx={{
            cursor: "pointer",
            color: "inherit",
            transition: "color 0.3s, text-decoration 0.3s",
            "&:hover": {
              color: "#1976d2", // MUI primary color or choose any like "#007BFF"
              // textDecoration: "underline",
            },
          }}
        >
     Customer Dashboard
    </Typography>
  </Link>
  </Box>

          <IconButton onClick={handleMenuOpen} color="inherit">
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem disabled>
              <Typography variant="body1">
                {user ? user.firstName  : 'Guest'}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => navigate('/settings')}>
              <SettingsIcon sx={{ mr: 1 }} /> Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
        <ListItem disablePadding>
    <ListItemButton onClick={() => navigate('/CustomerDashboard')}>
      <ListItemIcon>
      <DashboardCustomizeIcon/>
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
  </ListItem>
  <ListItem disablePadding>
    <ListItemButton onClick={() => navigate('/VehicleBooking')}>
      <ListItemIcon>
      <DirectionsCarIcon />
      </ListItemIcon>
      <ListItemText primary="Vehicle Booking" />
    </ListItemButton>
  </ListItem>

 
</List>

      </Drawer>

      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
};

export default CustomerLayout;
