import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// HOC for private routes
const withPrivateRoute = (Component) => {
  const PrivateRouteHOC = (props) => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!currentUser && !localStorage.getItem('token')) {
        navigate('/login', { replace: true });
      }

      if (currentUser && currentUser?.emailVerified === false) {
        navigate('/verification', { replace: true });
      }
    }, [currentUser, navigate]);

    return currentUser || localStorage.getItem('token') ? (
      <Component {...props} />
    ) : (
      <Navigate to='/login' replace />
    );
  };

  return PrivateRouteHOC;
};

export default withPrivateRoute;
