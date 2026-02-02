import { AppContext } from '@/context/AppContext';
import { Loader } from 'lucide-react';
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const { user, loading } = useContext(AppContext);

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="animate-spin">
                    <Loader size={20} />
                </div>
            </div>
        );
    }

    if (!user || !user?.email) {
        return <Navigate to="/signin" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
