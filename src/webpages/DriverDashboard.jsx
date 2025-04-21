import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions, Button, Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer } from '@mui/material';
import DriverLayout from './DriverLayout';

const DriverDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem('drivertoken'); // adjust if you store token differently
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  

  useEffect(() => {
    
    const fetchBookings = async () => {
      const token = localStorage.getItem("drivertoken");
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/BookingAPI/VehicleBookingInfo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response)
        if (response.data.code === 1) {
          setBookings(response.data.bookings);
        }
        else
        {
            toast.error(response.data.message)
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
    //console.log(localStorage.getItem("user"))
  }, []);

  
  const confirmCancelBooking = async () => {
    
    try {
      const token = localStorage.getItem("drivertoken");
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/BookingAPI/complete/${selectedBookingId}/${selectedCustomerId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      //console.log(response)   
      if (response.data.code === 1) {
        toast.success(response.data.message);
        setOpenConfirm(false);
        window.location.reload(); // or call fetchBookings();
      }
      else
      {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error("Cancel error:", err);
      toast.error("Failed to Complete booking");
      setOpenConfirm(false);
    }
  };
  
  const handleOpenCancelDialog = (bookingId,customerId) => {
    setSelectedBookingId(bookingId);
    setSelectedCustomerId(customerId)
    setOpenConfirm(true);
  };
  

  return (
    <DriverLayout>
      <div style={{ padding: '20px' }}>
        <h1>Dear {JSON.parse(localStorage.getItem("driverdata")).name}</h1>
        <p>Welcome to the Driver dashboard!</p>
      </div>

      <div style={{ padding: '20px' }}>
        <h2>My Bookings</h2>
        {bookings.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Travel Date</TableCell>
                  <TableCell>Route</TableCell>
                  <TableCell>Vehicle</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking, index) => (
                  <TableRow key={booking._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{new Date(booking.travelDateTime).toLocaleDateString()}</TableCell>
                    <TableCell>{booking.routeId?.source} → {booking.routeId?.destination}</TableCell>
                    <TableCell>
                      {booking.vehicleId?.vehicleName} ({booking.vehicleId?.vehicleNumber})
                    </TableCell>
                    <TableCell>
  {booking.customerId
    ? `${booking.customerId.firstName} ${booking.customerId.lastName} (${booking.customerId.mobile})`
    : 'Customer Info Not Found'}
</TableCell>
                    <TableCell>{booking.status}</TableCell>
                    <TableCell>₹{booking.rentAmount}</TableCell>
                    <TableCell>
  {booking.status === "Booked" ? (
    <Button
      color="error"
      variant="outlined"
      size="small"
      onClick={() => handleOpenCancelDialog(booking._id, booking.customerId._id)}
    >
      Complete
    </Button>
  ) : (
    booking.status
  )}
</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p>No bookings found.</p>
        )}
      </div>
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
  <DialogTitle>Confirm Completion</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Are you sure you want to Complete this booking? This action cannot be undone.
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenConfirm(false)} color="primary">
      No
    </Button>
    <Button
      onClick={() => confirmCancelBooking()}
      color="error"
      variant="contained"
    >
      Yes, Complete
    </Button>
  </DialogActions>
</Dialog>

    </DriverLayout>
  );
};

export default DriverDashboard;
