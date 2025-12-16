// components/PrivateRoute.tsx
import React, { type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

interface PrivateRouteProps {
    children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { user } = useUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
