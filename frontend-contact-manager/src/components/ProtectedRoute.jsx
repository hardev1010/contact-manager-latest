import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    // console.log("this is token in protected route", token);
    
    return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
