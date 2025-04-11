import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        width: `calc(100% - 250px)`,
        ml: "10px",
        textAlign: "center",
        py: 2,
        position: "fixed",
        bottom: 0,
        backgroundColor: "#f5f5f5",
      }}
    >
      <Typography variant="body2">© 2024 Vehicle Rental System. All Rights Reserved.</Typography>
    </Box>
  );
};

export default Footer;
