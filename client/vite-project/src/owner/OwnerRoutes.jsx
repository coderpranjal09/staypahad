import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OwnerLogin from './OwnerLogin';
import OwnerDashboard from './OwnerDashboard';

const OwnerRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<OwnerLogin />} />
      <Route path="dashboard" element={<OwnerDashboard />} />
    </Routes>
  );
};

export default OwnerRoutes;