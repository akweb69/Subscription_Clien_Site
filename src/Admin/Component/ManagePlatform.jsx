// ManagePlatform.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save, Trash2, Edit, Eye, EyeOff, Loader2,
    AlertTriangle, Link2
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import usePlatform from '../Hooks/usePlatform';
import Loader from '@/components/ui/Loader';
import axios from 'axios';

const ManagePlatform = () => {
    const { platformRefetch, platformLoading, platforms } = usePlatform();
    const base_url = import.meta.env.VITE_BASE_URL;

    const [editMode, setEditMode] = useState({});
    const [formData, setFormData] = useState({});
    const [showPassword, setShowPassword] = useState({});

    const [deletingId, setDeletingId] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    if (platformLoading) return <Loader />;

    const enterEditMode = (platform) => {
        setEditMode(prev => ({ ...prev, [platform._id]: true }));
        setFormData(prev => ({
            ...prev,
            [platform._id]: {
                platformEmail: platform.platformEmail || '',
                platformPassword: platform.platformPassword || '',
                platformLink: platform.platformLink || '',   // ← new field
            }
        }));
    };

    const exitEditMode = (id) => {
        setEditMode(prev => ({ ...prev, [id]: false }));
        setFormData(prev => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
        });
    };

    const handleInputChange = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value,
            }
        }));
    };

    const hasChanges = (id, original) => {
        if (!formData[id]) return false;
        return (
            formData[id].platformEmail !== (original.platformEmail || '') ||
            formData[id].platformPassword !== (original.platformPassword || '') ||
            formData[id].platformLink !== (original.platformLink || '')   // ← added
        );
    };

    const handleUpdate = async (platform) => {
        const id = platform._id;
        const updates = formData[id] || {};

        if (!hasChanges(id, platform)) {
            toast('No changes detected', { icon: 'ℹ️' });
            exitEditMode(id);
            return;
        }

        setUpdatingId(id);
        const toastId = toast.loading('Updating platform...');

        try {
            const res = await axios.patch(`${base_url}/platform/${id}`, updates);

            if (res.data.modifiedCount === 1) {
                toast.success('Platform updated!', { id: toastId });
                platformRefetch();
            } else {
                toast.error('Update failed – no changes applied', { id: toastId });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed', { id: toastId });
            console.error(err);
        } finally {
            setUpdatingId(null);
            exitEditMode(id);
        }
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Delete platform "${name}"? This action cannot be undone.`)) return;

        setDeletingId(id);
        const toastId = toast.loading('Deleting...');

        try {
            const res = await axios.delete(`${base_url}/platform/${id}`);

            if (res.data.deletedCount === 1) {
                toast.success('Platform deleted', { id: toastId });
                platformRefetch();
            } else {
                toast.error('Platform not found', { id: toastId });
            }
        } catch (err) {
            toast.error('Delete failed', { id: toastId });
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full min-h-[80vh] p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-emerald-50/80 via-teal-50/60 to-emerald-50/80 rounded-2xl border border-emerald-100/60 shadow-xl backdrop-blur-[2px]"
        >
            <Toaster position="top-center" richColors toastOptions={{ duration: 5000 }} />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                    Manage Platforms
                </h1>
                <div className="text-sm font-medium text-emerald-700/80 bg-emerald-100/60 px-4 py-1.5 rounded-full">
                    {platforms.length} platform{platforms.length !== 1 ? 's' : ''}
                </div>
            </div>

            {platforms.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16 text-gray-500 bg-white/40 rounded-xl border border-dashed border-gray-300"
                >
                    <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
                    <p className="text-lg font-medium">No platforms added yet</p>
                    <p className="mt-2">You can add platforms from the "Add New Platform" section.</p>
                </motion.div>
            ) : (
                <div className="grid gap-5 sm:gap-6">
                    <AnimatePresence>
                        {platforms.map((p) => {
                            const isEditing = editMode[p._id];
                            const isUpdating = updatingId === p._id;
                            const isDeleting = deletingId === p._id;
                            const changes = hasChanges(p._id, p);

                            return (
                                <motion.div
                                    key={p._id}
                                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                    whileHover={{ scale: 1.01 }}
                                    className="bg-white/80 backdrop-blur-sm rounded-xl border border-emerald-100/70 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                                >
                                    <div className="p-5 sm:p-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                                            <h2 className="text-lg font-semibold text-emerald-800 tracking-tight">
                                                {p.platformName}
                                            </h2>

                                            <div className="flex gap-3 self-end sm:self-center">
                                                {isEditing ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdate(p)}
                                                            disabled={isUpdating || !changes}
                                                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${changes && !isUpdating
                                                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                                                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                                }`}
                                                        >
                                                            {isUpdating ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Save className="h-4 w-4" />
                                                            )}
                                                            Save Changes
                                                        </button>
                                                        <button
                                                            onClick={() => exitEditMode(p._id)}
                                                            className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => enterEditMode(p)}
                                                        disabled={isDeleting || isUpdating}
                                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        Edit
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => handleDelete(p._id, p.platformName)}
                                                    disabled={isDeleting || isUpdating}
                                                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${isDeleting
                                                        ? 'bg-gray-300 text-gray-500 cursor-wait'
                                                        : 'bg-rose-100 hover:bg-rose-200 text-rose-700'
                                                        }`}
                                                >
                                                    {isDeleting ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                            {/* Platform Link */}
                                            <div className="relative">
                                                <input
                                                    type="url"
                                                    value={
                                                        isEditing
                                                            ? formData[p._id]?.platformLink ?? ''
                                                            : p.platformLink ?? ''
                                                    }
                                                    onChange={(e) => isEditing && handleInputChange(p._id, 'platformLink', e.target.value.trim())}
                                                    disabled={!isEditing}
                                                    placeholder=" "
                                                    className={`peer w-full px-4 pt-6 pb-2 pl-10 border rounded-lg bg-white/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 ${isEditing
                                                        ? 'border-emerald-400 focus:border-emerald-500'
                                                        : 'border-gray-300 cursor-default'
                                                        }`}
                                                />
                                                <Link2 className="absolute left-3 top-4 text-emerald-600" size={18} />
                                                <label className="absolute left-10 top-2 text-xs font-medium text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">
                                                    Platform Link (URL)
                                                </label>
                                            </div>

                                            {/* Email */}
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    value={
                                                        isEditing
                                                            ? formData[p._id]?.platformEmail ?? ''
                                                            : p.platformEmail ?? ''
                                                    }
                                                    onChange={(e) => isEditing && handleInputChange(p._id, 'platformEmail', e.target.value)}
                                                    disabled={!isEditing}
                                                    placeholder=" "
                                                    className={`peer w-full px-4 pt-6 pb-2 border rounded-lg bg-white/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 ${isEditing
                                                        ? 'border-emerald-400 focus:border-emerald-500'
                                                        : 'border-gray-300 cursor-default'
                                                        }`}
                                                />
                                                <label className="absolute left-4 top-2 text-xs font-medium text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">
                                                    Platform Email / Username
                                                </label>
                                            </div>

                                            {/* Password */}
                                            <div className="relative">
                                                <input
                                                    type={showPassword[p._id] ? 'text' : 'password'}
                                                    value={
                                                        isEditing
                                                            ? formData[p._id]?.platformPassword ?? ''
                                                            : p.platformPassword ?? ''
                                                    }
                                                    onChange={(e) => isEditing && handleInputChange(p._id, 'platformPassword', e.target.value)}
                                                    disabled={!isEditing}
                                                    placeholder=" "
                                                    className={`peer w-full px-4 pt-6 pb-2 pr-10 border rounded-lg bg-white/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 ${isEditing
                                                        ? 'border-emerald-400 focus:border-emerald-500'
                                                        : 'border-gray-300 cursor-default'
                                                        }`}
                                                />
                                                <label className="absolute left-4 top-2 text-xs font-medium text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">
                                                    Platform Password
                                                </label>

                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(prev => ({ ...prev, [p._id]: !prev[p._id] }))}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                    disabled={!isEditing}
                                                >
                                                    {showPassword[p._id] ? (
                                                        <EyeOff className="h-5 w-5" />
                                                    ) : (
                                                        <Eye className="h-5 w-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
};

export default ManagePlatform;