import { AppContext } from '@/context/AppContext';
import React from 'react';
import {
    Mail,
    ShieldCheck,
    User,
    Calendar,
    Clock,
    Pencil,
    LogOut,
} from 'lucide-react';

const Profile = () => {
    const { user, loading, logout } = React.useContext(AppContext);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="h-10 w-10 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-slate-500 text-lg">No user data found</p>
            </div>
        );
    }

    const initials =
        user.displayName
            ?.split(' ')
            .map(n => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() || 'U';

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-12">
            <div className="max-w-4xl mx-auto">
                {/* Header Card */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl">
                    <div className="p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center gap-6">
                        {/* Avatar */}
                        {user.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt="Profile"
                                className="h-24 w-24 rounded-full object-cover border-4 border-white/20"
                            />
                        ) : (
                            <div className="h-24 w-24 rounded-full bg-white/10 backdrop-blur text-white flex items-center justify-center text-3xl font-bold">
                                {initials}
                            </div>
                        )}

                        {/* User Info */}
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold">
                                {user.displayName || 'Unnamed User'}
                            </h2>
                            <div className="flex items-center gap-2 mt-2 text-slate-300">
                                <Mail size={16} />
                                <span>{user.email}</span>
                            </div>

                            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10">
                                <ShieldCheck size={14} />
                                {user.emailVerified ? 'Email verified' : 'Email not verified'}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <ActionButton icon={<Pencil size={16} />} label="Edit" />
                            <ActionButton onClick={logout} icon={<LogOut size={16} />} label="Logout" />
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InfoCard
                        icon={<User />}
                        label="Auth Provider"
                        value={user.providerData?.[0]?.providerId || 'password'}
                    />

                    <InfoCard
                        icon={<Calendar />}
                        label="Account Created"
                        value={new Date(
                            user.metadata.creationTime
                        ).toLocaleDateString()}
                    />

                    <InfoCard
                        icon={<Clock />}
                        label="Last Login"
                        value={new Date(
                            user.metadata.lastSignInTime
                        ).toLocaleString()}
                    />

                    <InfoCard
                        icon={<ShieldCheck />}
                        label="UID"
                        value={user.uid.slice(0, 10) + '...'}
                    />
                </div>
            </div>
        </div>
    );
};

/* ---------- Reusable Components ---------- */

const InfoCard = ({ icon, label, value }) => (
    <div className="group bg-white rounded-2xl p-6 border shadow-sm hover:shadow-lg transition-all">
        <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <p className="text-xs font-semibold text-slate-500 uppercase">
            {label}
        </p>
        <p className="mt-1 font-semibold text-slate-900 break-words">
            {value}
        </p>
    </div>
);

const ActionButton = ({ icon, label }) => (
    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-semibold transition-all">
        {icon}
        {label}
    </button>
);

export default Profile;
