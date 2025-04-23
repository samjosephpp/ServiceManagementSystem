import React, {   useContext } from "react";
import { AuthContext } from '../../context/AuthContext';

const Dashboard = () => {

   const { isLoggedIn, userRole, loggedUser } = useContext(AuthContext);

  return (    
    <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold"> Welcome to {loggedUser.name.charAt(0).toUpperCase() + loggedUser.name.slice(1)} Dashboard</h1>    
    <p>This is the provider Dashboard page.</p>
  </div>
  );
}   

export default Dashboard;