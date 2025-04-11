import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./adminComponents/Login";
import Dashboard from "./adminComponents/Dashboard";
import VehicleAdd from "./adminComponents/VehicleAdd";
import VehicleList from "./adminComponents/VehicleList";
import VehicleEdit from "./adminComponents/VehicleEdit";
import DriverAdd from "./adminComponents/DriverAdd";
import DriverList from "./adminComponents/DriverList"
import DriverEdit from "./adminComponents/DriverEdit";
import TravelRoute from "./adminComponents/TravelRoute";
import TravelRouteList from "./adminComponents/TravelRouteList";
import TravelRouteEdit from "./adminComponents/TravelRouteEdit";
import Home from "./webpages/Home";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/*<Route path="/register" element={<Register />} />*/}
        <Route path="/" element={<Home />} />
        <Route path="/AdminLogin" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/VehicleAdd" element={<VehicleAdd />} />
        <Route path="/VehicleList" element={<VehicleList />} />
        <Route path="/VehicleEdit/:vehicleId" element={<VehicleEdit />} />
        <Route path="/DriverAdd" element={<DriverAdd />} />
        <Route path="/DriverList" element={<DriverList />} />
        <Route path="/DriverEdit/:driverId" element={<DriverEdit />} />
        <Route path="/TravelRouteAdd" element={<TravelRoute />} />
        <Route path="/TravelRouteList" element={<TravelRouteList />} />
        <Route path="/TravelRouteEdit/:routeId" element={<TravelRouteEdit />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
