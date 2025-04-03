import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/apiService.js';

const PrivateRoutes = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      api
        .get('/profile')
        .then((response) => {
          setIsAuthenticated(true);
        })
        .catch((error) => {
          if (error.response.data.message == 'tokenExpired') {
            setIsAuthenticated(false);
            localStorage.removeItem('token');
            localStorage.removeItem('role');
          }
        });
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  return isAuthenticated ? children : <Navigate to="/auth/signin" />;
};

export default PrivateRoutes;
