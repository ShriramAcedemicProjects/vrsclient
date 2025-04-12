import React from 'react'
import CustomerLayout from './CustomerLayout'

const CustomerDashboard = () => {
  return (
   <>
   <CustomerLayout>
    <div style={{ padding: '20px' }}>
      <h1>Customer Dashboard</h1>
      <p>Welcome to the customer dashboard!</p>
      {/* Add your dashboard content here */}
    </div>
    <div style={{ padding: '20px' }}>
      <h2>Upcoming Trips</h2>
      {/* Add your upcoming trips content here */}
      <p>No upcoming trips scheduled.</p>
      </div>
      </CustomerLayout>
   </>
  )
}

export default CustomerDashboard
