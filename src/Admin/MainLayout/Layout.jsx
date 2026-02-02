// AdminLayout.jsx
import React, { useContext, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import AdminAsideBar from './AdminAsideBar';
import {
    Search,
    Bell,
    User,
    Settings,
    LogOut,
    ChevronDown
} from 'lucide-react';
import { AppContext } from '@/context/AppContext';

const AdminLayout = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, logout } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        setShowUserMenu(false);
        navigate('/login');
    };

    return (
        <div className="flex h-screen w-full bg-gray-50">
            {/* Sidebar */}
            <AdminAsideBar />

            {/* Main */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Navbar */}
                <header className="sticky top-0 z-30 bg-white border-b">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            {/* Search */}
                            <div className="hidden md:block flex-1 max-w-xl">
                                <div className="relative">
                                    <Search
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search users, orders, products…"
                                        className="
                                            w-full pl-10 pr-16 py-2 text-sm
                                            border rounded-lg
                                            focus:ring-2 focus:ring-emerald-500
                                        "
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                                        Ctrl + K
                                    </span>
                                </div>
                            </div>

                            {/* Right */}
                            <div className="flex items-center gap-3">
                                {/* Notifications */}
                                <button
                                    aria-label="Notifications"
                                    className="relative p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <Bell size={20} />
                                    <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
                                </button>

                                {/* User Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="
                                            flex items-center gap-3
                                            rounded-lg p-1.5
                                            hover:bg-gray-100
                                            focus:ring-2 focus:ring-emerald-500
                                        "
                                    >
                                        <img
                                            src={user?.photoURL || 'https://i.pravatar.cc/100'}
                                            alt="avatar"
                                            referrerPolicy='no-referrer'
                                            className="h-9 w-9 rounded-full border object-cover"
                                        />

                                        <div className="hidden md:block text-left">
                                            <p className="text-sm font-medium">{user?.name}</p>
                                            <p className="text-xs text-gray-500">{user?.role}</p>
                                        </div>

                                        <ChevronDown size={16} />
                                    </button>

                                    {showUserMenu && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-20"
                                                onClick={() => setShowUserMenu(false)}
                                            />

                                            <div
                                                className="
                                                    absolute right-0 mt-2 w-56 z-30
                                                    rounded-xl bg-white border shadow-lg
                                                    overflow-hidden
                                                "
                                            >
                                                <div className="px-4 py-3 border-b md:hidden">
                                                    <p className="font-medium">{user?.name}</p>
                                                    <p className="text-xs text-gray-500">{user?.role}</p>
                                                </div>




                                                <div className="border-t" />

                                                <button
                                                    onClick={handleLogout}
                                                    className="
                                                        flex w-full items-center gap-3
                                                        px-4 py-2.5 text-red-600
                                                        hover:bg-red-50
                                                    "
                                                >
                                                    <LogOut size={18} /> Logout
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="mx-auto max-w-screen-2xl bg-white border rounded-xl shadow-sm">
                        <div className="p-5 sm:p-6 lg:p-8">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
