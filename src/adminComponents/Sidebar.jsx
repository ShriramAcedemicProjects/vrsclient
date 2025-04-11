import React, { useState } from "react";
import { Drawer, List, ListItemButton,ListItem, ListItemText, Collapse, ListItemIcon } from "@mui/material";
import { ExpandLess, ExpandMore, DirectionsCar, Person, People, Add, List as ListIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [openDriver, setOpenDriver] = useState(false);
  const [openVehicle, setOpenVehicle] = useState(false);
  const [openRoute, setOpenRoute] = useState(false);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 250,
          boxSizing: "border-box",
          background: "#6a11cb",
          opacity:0.7,
          color: "#fff",
        },
      }}
    >
      <List>
        <ListItem>
          <ListItemText primary="Admin Panel" sx={{ fontWeight: "bold", textAlign: "center" }} />
        </ListItem>
        {/* Driver Master */}
        <ListItemButton onClick={() => setOpenDriver(!openDriver)}>
          <ListItemIcon>
            <Person sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText sx={{ color: "#fff" }} primary="Driver Master" />
          {openDriver ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openDriver} timeout="auto" unmountOnExit>
        <ListItem button component={Link} to="/DriverAdd">
            <ListItemIcon><Add sx={{ color: "#fff" }} /></ListItemIcon>
            <ListItemText sx={{ color: "#fff" }} primary="Driver Add" />
          </ListItem>
          <ListItem button component={Link} to="/DriverList">
            <ListItemIcon><ListIcon sx={{ color: "#fff" }} /></ListItemIcon>
            <ListItemText sx={{ color: "#fff" }} primary="Driver List" />
          </ListItem>
        </Collapse>

        {/* Vehicle Master */}
        <ListItemButton onClick={() => setOpenVehicle(!openVehicle)}>
          <ListItemIcon>
            <DirectionsCar sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Vehicle Master" />
          {openVehicle ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openVehicle} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
          <ListItem button component={Link} to="/VehicleAdd">
            <ListItemIcon><Add sx={{ color: "#fff" }} /></ListItemIcon>
            <ListItemText sx={{ color: "#fff" }} primary="Vehicle Add" />
          </ListItem>
          <ListItem button component={Link} to="/VehicleList">
            <ListItemIcon><ListIcon sx={{ color: "#fff" }} /></ListItemIcon>
            <ListItemText sx={{ color: "#fff" }} primary="Vehicle List" />
          </ListItem>
          </List>
        </Collapse>

          {/* Travel Master */}
          <ListItemButton onClick={() => setOpenRoute(!openRoute)}>
          <ListItemIcon>
            <DirectionsCar sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Route" />
          {openRoute ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openRoute} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
          <ListItem button component={Link} to="/TravelRouteAdd">
            <ListItemIcon><Add sx={{ color: "#fff" }} /></ListItemIcon>
            <ListItemText sx={{ color: "#fff" }} primary="Route Add" />
          </ListItem>
          <ListItem button component={Link} to="/TravelRouteList">
            <ListItemIcon><ListIcon sx={{ color: "#fff" }} /></ListItemIcon>
            <ListItemText sx={{ color: "#fff" }} primary="Route List" />
          </ListItem>
          </List>
        </Collapse>

      </List>
    </Drawer>
  );
};

export default Sidebar;
