// ManageSubscription.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
    Trash2,
    Edit,
    Save,
    X,
    Loader2,
    Star,
    DollarSign,
    CalendarDays,
    Globe,
    AlertTriangle,
    Check
} from 'lucide-react';
import axios from 'axios';

const ManageSubscription = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [platforms, setPlatforms] = useState([]);

    const [subsLoading, setSubsLoading] = useState(true);
    const [platformsLoading, setPlatformsLoading] = useState(true);

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [deletingId, setDeletingId] = useState(null);

    // Load subscriptions
    const fetchSubscriptions = async () => {
        try {
            setSubsLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/subscription`);
            setSubscriptions(res.data || []);
        } catch (err) {
            console.error('Failed to load subscriptions:', err);
            toast.error('Could not load subscription plans');
        } finally {
            setSubsLoading(false);
        }
    };

    // Load platforms (once)
    const fetchPlatforms = async () => {
        try {
            setPlatformsLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/platform`);
            setPlatforms(res.data || []);
        } catch (err) {
            console.error('Failed to load platforms:', err);
            toast.error('Failed to load platforms');
        } finally {
            setPlatformsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
        fetchPlatforms();
    }, []);

    const handleEditStart = (sub) => {
        setEditingId(sub._id);
        setEditForm({
            subscriptionName: sub.subscriptionName || '',
            validityDays: sub.validityDays || '',
            price: sub.price || '',
            discount: sub.discount || 0,
            isMostPopular: !!sub.isMostPopular,
            subscriptionDescription: sub.subscriptionDescription || '',
            selectedPlan: sub.selectedPlan ? [...sub.selectedPlan] : [] // copy array
        });
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditForm({});
    };

    const togglePlatform = (platformId) => {
        setEditForm((prev) => {
            const current = prev.selectedPlan || [];
            if (current.includes(platformId)) {
                return {
                    ...prev,
                    selectedPlan: current.filter((id) => id !== platformId)
                };
            }
            return {
                ...prev,
                selectedPlan: [...current, platformId]
            };
        });
    };

    const handleSave = async (id) => {
        if (!window.confirm('Save changes to this subscription plan?')) return;

        try {
            const payload = {
                subscriptionName: editForm.subscriptionName.trim(),
                validityDays: Number(editForm.validityDays),
                price: Number(editForm.price),
                discount: Number(editForm.discount) || 0,
                isMostPopular: editForm.isMostPopular,
                subscriptionDescription: editForm.subscriptionDescription.trim(),
                selectedPlan: editForm.selectedPlan
            };

            const res = await axios.patch(
                `${import.meta.env.VITE_BASE_URL}/subscription/${id}`,
                payload
            );

            if (res.data?.modifiedCount === 1) {
                toast.success('Subscription updated');
                setEditingId(null);
                setEditForm({});
                await fetchSubscriptions();
            } else {
                throw new Error('Update failed');
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to update');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this subscription plan permanently?')) return;

        setDeletingId(id);
        try {
            const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/subscription/${id}`);
            if (res.data?.deletedCount === 1) {
                toast.success('Subscription deleted');
                await fetchSubscriptions();
            } else {
                throw new Error('Delete failed');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete');
        } finally {
            setDeletingId(null);
        }
    };

    const formatPrice = (price) =>
        Number(price).toLocaleString('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });

    const isLoading = subsLoading || platformsLoading;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                    <p className="text-gray-600">
                        {subsLoading ? 'Loading plans...' : 'Loading platforms...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Manage Subscription Plans
                        </h1>
                        <p className="mt-1.5 text-gray-600">
                            Edit or remove existing subscription packages
                        </p>
                    </div>
                    <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border shadow-sm">
                        Total plans: <strong className="text-gray-900">{subscriptions.length}</strong>
                    </div>
                </div>

                {subscriptions.length === 0 ? (
                    <div className="bg-white rounded-xl shadow border p-12 text-center">
                        <AlertTriangle className="mx-auto h-14 w-14 text-amber-500 mb-5 opacity-80" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">
                            No subscription plans yet
                        </h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            You can create your first plan using the <strong>Add New Subscription</strong> page.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {subscriptions.map((sub) => {
                            const isEditing = editingId === sub._id;
                            const isDeleting = deletingId === sub._id;

                            return (
                                <motion.div
                                    key={sub._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`
                    bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-200
                    ${isEditing ? 'border-blue-500 ring-1 ring-blue-200/70 shadow-md' : 'border-gray-200 hover:shadow'}
                  `}
                                >
                                    {/* Header */}
                                    <div className="px-5 py-4 border-b bg-gray-50/70 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            {sub.isMostPopular && !isEditing && (
                                                <div className="flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full shrink-0">
                                                    <Star size={14} className="fill-amber-500" />
                                                    Popular
                                                </div>
                                            )}
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {isEditing ? editForm.subscriptionName : sub.subscriptionName}
                                            </h3>
                                        </div>

                                        <div className="flex items-center gap-1.5 shrink-0">
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        onClick={() => handleSave(sub._id)}
                                                        disabled={isDeleting}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Save"
                                                    >
                                                        <Save size={18} />
                                                    </button>
                                                    <button
                                                        onClick={handleEditCancel}
                                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="Cancel"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleEditStart(sub)}
                                                        disabled={isDeleting}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(sub._id)}
                                                        disabled={isDeleting}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        {isDeleting ? (
                                                            <Loader2 size={18} className="animate-spin" />
                                                        ) : (
                                                            <Trash2 size={18} />
                                                        )}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-5 space-y-5 text-sm">
                                        {/* Price & Validity */}
                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <DollarSign size={16} />
                                                    <span className="text-xs">Price</span>
                                                </div>
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={editForm.price}
                                                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                                        className="w-full border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                                    />
                                                ) : (
                                                    <div className="font-medium">
                                                        ৳ {formatPrice(sub.price)}
                                                        {sub.discount > 0 && (
                                                            <span className="ml-2 text-green-600 text-xs font-medium">
                                                                −৳{formatPrice(sub.discount)}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <CalendarDays size={16} />
                                                    <span className="text-xs">Validity</span>
                                                </div>
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={editForm.validityDays}
                                                        onChange={(e) => setEditForm({ ...editForm, validityDays: e.target.value })}
                                                        className="w-full border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                                    />
                                                ) : (
                                                    <div className="font-medium">{sub.validityDays} days</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-1">
                                            <div className="text-xs text-gray-500">Description</div>
                                            {isEditing ? (
                                                <textarea
                                                    value={editForm.subscriptionDescription}
                                                    onChange={(e) =>
                                                        setEditForm({ ...editForm, subscriptionDescription: e.target.value })
                                                    }
                                                    rows={3}
                                                    className="w-full border rounded-lg px-3 py-2 text-sm resize-y focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                                />
                                            ) : (
                                                <p className="text-gray-700 leading-relaxed">
                                                    {sub.subscriptionDescription || <span className="italic opacity-60">—</span>}
                                                </p>
                                            )}
                                        </div>

                                        {/* Platforms */}
                                        <div className="space-y-2">
                                            <div className="text-xs text-gray-500">Platforms</div>

                                            {isEditing ? (
                                                <div className="flex flex-wrap gap-2.5">
                                                    {platformsLoading ? (
                                                        <div className="text-gray-400 italic">Loading platforms...</div>
                                                    ) : platforms.length === 0 ? (
                                                        <div className="text-gray-400 italic">No platforms available</div>
                                                    ) : (
                                                        platforms.map((plat) => {
                                                            const isSelected = editForm.selectedPlan?.includes(plat._id);
                                                            return (
                                                                <button
                                                                    key={plat._id}
                                                                    type="button"
                                                                    onClick={() => togglePlatform(plat._id)}
                                                                    className={`
                                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                                    ${isSelected
                                                                            ? 'bg-blue-600 text-white shadow-sm'
                                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                        }
                                  `}
                                                                >
                                                                    {isSelected && <Check size={14} />}
                                                                    {plat.platformName}
                                                                </button>
                                                            );
                                                        })
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {sub.selectedPlan?.length > 0 ? (
                                                        sub.selectedPlan.map((id, idx) => {
                                                            const platform = platforms.find((p) => p._id === id);
                                                            return (
                                                                <div
                                                                    key={idx}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                                                >
                                                                    <Globe size={12} />
                                                                    {platform?.platformName || id}
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        <span className="text-gray-400 italic text-sm">No platforms included</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Most Popular toggle (only in edit mode) */}
                                        {isEditing && (
                                            <div className="pt-2 border-t">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={editForm.isMostPopular}
                                                        onChange={(e) =>
                                                            setEditForm({ ...editForm, isMostPopular: e.target.checked })
                                                        }
                                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <div className="flex items-center gap-1.5 text-sm">
                                                        <Star size={15} className="text-amber-500" />
                                                        <span>Mark as Most Popular plan</span>
                                                    </div>
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageSubscription;