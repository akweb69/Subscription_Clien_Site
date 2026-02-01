import { AppContext } from '@/context/AppContext';
import React, { useContext, useState } from 'react';
import {
    Mail,
    ShieldCheck,
    User,
    Calendar,
    Clock,
    Pencil,
    LogOut,
    Check,
    X,
} from 'lucide-react';
import { updateProfile } from 'firebase/auth';

const Profile = () => {
    const { user, loading, logout } = useContext(AppContext);

    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [saving, setSaving] = useState(false);

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

    const handleUpdateName = async () => {
        if (!displayName.trim()) return;
        try {
            setSaving(true);
            await updateProfile(user, {
                displayName: displayName.trim(),
            });
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to update name', err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl">
                    <div className="p-8 sm:p-10 flex flex-col sm:flex-row gap-6">
                        {/* Avatar */}
                        {user.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt="Profile"
                                className="h-24 w-24 rounded-full object-cover border-4 border-white/20"
                            />
                        ) : (
                            <div className="h-24 w-24 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold">
                                {initials}
                            </div>
                        )}

                        {/* User Info */}
                        <div className="flex-1">
                            {!isEditing ? (
                                <div className="flex items-center gap-3">
                                    <h2 className="text-3xl font-bold">
                                        {user.displayName || 'Unnamed User'}
                                    </h2>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-wrap items-center gap-2">
                                    <input
                                        value={displayName}
                                        onChange={e => setDisplayName(e.target.value)}
                                        className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 outline-none text-white placeholder:text-slate-300"
                                        placeholder="Enter display name"
                                    />
                                    <button
                                        onClick={handleUpdateName}
                                        disabled={saving}
                                        className="p-2 rounded-lg bg-green-500 hover:bg-green-600 transition"
                                    >
                                        {saving ? (
                                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Check size={16} />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setDisplayName(user.displayName || '');
                                        }}
                                        className="p-2 rounded-lg bg-red-500 hover:bg-red-600 transition"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center gap-2 mt-3 text-slate-300">
                                <Mail size={16} />
                                <span>{user.email}</span>
                            </div>


                        </div>

                        {/* Logout */}
                        <button
                            onClick={logout}
                            className="self-start flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-semibold transition"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    <InfoCard
                        icon={<Calendar />}
                        label="Account Created"
                        value={new Date(user.metadata.creationTime).toLocaleDateString()}
                    />
                    <InfoCard
                        icon={<Clock />}
                        label="Last Login"
                        value={new Date(user.metadata.lastSignInTime).toLocaleString()}
                    />

                </div>
            </div>
        </div>
    );
};

/* ---------- Components ---------- */

const InfoCard = ({ icon, label, value }) => (
    <div className="bg-white rounded-2xl p-6 border shadow-sm hover:shadow-lg transition">
        <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4">
            {icon}
        </div>
        <p className="text-xs font-semibold text-slate-500 uppercase">{label}</p>
        <p className="mt-1 font-semibold text-slate-900 break-words">{value}</p>
    </div>
);

export default Profile;
