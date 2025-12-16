// components/RoleRoute.tsx
import React, { type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

interface RoleRouteProps {
    children: JSX.Element;
    allowedRoles: Array<'ADMIN' | 'USER'>;
}

const RoleRoute: React.FC<RoleRouteProps> = ({ children, allowedRoles }) => {
    const { user, isLoading } = useUser();

    if (isLoading) {
        return <div>Cargando...</div>; // o un spinner si tenés uno
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.rol)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RoleRoute;
