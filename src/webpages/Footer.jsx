import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ mt: 5, p: 3, backgroundColor: '#f7735b', color: 'white', textAlign: 'center',width:1270 }}>
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} RideEase. All Rights Reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
