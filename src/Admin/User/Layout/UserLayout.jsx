import React, { useContext, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import UserAsideBar from './UserAsideBar';
import {
    Search,
    Bell,
    ChevronDown,
    User as UserIcon,
    Settings,
    LogOut,
} from 'lucide-react';
import { AppContext } from '@/context/AppContext';

const UserLayout = () => {
    const [showMenu, setShowMenu] = useState(false);
    const { user, logout, loading } = useContext(AppContext);

    const initials =
        user?.displayName
            ?.split(' ')
            .map(n => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() || 'U';

    return (
        <div className="flex h-screen bg-slate-50">
            <UserAsideBar />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navbar */}
                <header className="bg-white border-b shadow-sm sticky top-0 z-30">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between gap-4">
                            {/* Left placeholder */}
                            <div />

                            {/* Search */}
                            <div className="flex-1 max-w-md hidden md:block">
                                {/* <div className="relative">
                                    <Search
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search orders, wishlist..."
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div> */}
                            </div>

                            {/* Right */}
                            <div className="flex items-center gap-3 sm:gap-5">
                                {/* Notification */}


                                {/* User menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowMenu(v => !v)}
                                        className="flex items-center gap-2 sm:gap-3 p-1.5 rounded-xl hover:bg-slate-100 transition"
                                    >
                                        {user?.photoURL ? (
                                            <img
                                                src={user.photoURL}
                                                alt="Profile"
                                                className="h-9 w-9 rounded-full object-cover border"
                                            />
                                        ) : (
                                            <div className="h-9 w-9 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-semibold">
                                                {initials}
                                            </div>
                                        )}

                                        <span className="hidden md:block font-medium text-slate-800">
                                            {user?.displayName || 'User'}
                                        </span>
                                        <ChevronDown size={16} className="text-slate-500" />
                                    </button>

                                    {showMenu && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-20"
                                                onClick={() => setShowMenu(false)}
                                            />

                                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border z-30 overflow-hidden">
                                                <Link
                                                    to="/dashboard/profile"
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-slate-700"
                                                >
                                                    <UserIcon size={18} />
                                                    Profile
                                                </Link>

                                                <Link
                                                    to="/plans"
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-slate-700"
                                                >
                                                    <Settings size={18} />
                                                    Visit Plans
                                                </Link>

                                                <div className="border-t" />

                                                <button
                                                    onClick={logout}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
                                                >
                                                    <LogOut size={18} />
                                                    Logout
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto  sm:p-6 lg:p-8">
                    <div className="mx-auto max-w-screen-2xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserLayout;
