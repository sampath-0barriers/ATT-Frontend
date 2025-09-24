import React, { lazy } from 'react';
import { Navigate } from "react-router-dom";
import Loadable from '../layouts/loader/Loadable';
import { isAuthenticated } from '../utils';
const FullLayout = Loadable(lazy(() => import('../layouts/FullLayout')));

export default function ProtectedLayout() {
    if (!isAuthenticated()) {
        return <Navigate to="/auth/login" />;
    }
    return <FullLayout />;
};
