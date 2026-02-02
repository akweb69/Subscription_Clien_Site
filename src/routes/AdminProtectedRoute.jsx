import { AppContext } from '@/context/AppContext';
import axios from 'axios';
import { Loader } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute = () => {
    const { user, loading } = useContext(AppContext);
    const [checkingRole, setCheckingRole] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    const base_url = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        // wait until auth loading finishes
        if (loading) return;

        // no user → redirect
        if (!user?.email) {
            setCheckingRole(false);
            return;
        }

        const checkAdminRole = async () => {
            try {
                const res = await axios.get(
                    `${base_url}/admin/${user.email}`
                );

                if (res?.data?.role === 'admin') {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                setIsAdmin(false);
            } finally {
                setCheckingRole(false);
            }
        };

        checkAdminRole();
    }, [user, loading, base_url]);

    // global auth loading
    if (loading || checkingRole) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Loader className="animate-spin" size={24} />
            </div>
        );
    }

    // not admin → kick out
    if (!user || !isAdmin) {
        return <Navigate to="/admin_signin" replace />;
    }

    return <Outlet />;
};

export default AdminProtectedRoute;
