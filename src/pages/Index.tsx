
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index: React.FC = () => {
  return <Navigate to="/agendamentos" replace />;
};

export default Index;
