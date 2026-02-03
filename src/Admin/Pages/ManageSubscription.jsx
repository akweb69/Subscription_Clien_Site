// ManageSubscription.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    Check,
    Tag,
    AlertCircle
} from 'lucide-react';
import axios from 'axios';
import useCategory from '../Hooks/useCategory';

const ManageSubscription = () => {
    const { categoryLoading, categoryData = [] } = useCategory();

    const [subscriptions, setSubscriptions] = useState([]);
    const [platforms, setPlatforms] = useState([]);

    const [subsLoading, setSubsLoading] = useState(true);
    const [platformsLoading, setPlatformsLoading] = useState(true);

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [deletingId, setDeletingId] = useState(null);

    // Confirmation Modal State
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null); // 'save' or 'delete'
    const [confirmId, setConfirmId] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState('');

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

    // Load platforms
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
            isMostPopular: !!sub.isMostPopular,
            subscriptionDescription: sub.subscriptionDescription || '',
            selectedPlan: sub.selectedPlan ? [...sub.selectedPlan] : [],
            category: sub.category?._id || sub.category || ''
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
                return { ...prev, selectedPlan: current.filter(id => id !== platformId) };
            }
            return { ...prev, selectedPlan: [...current, platformId] };
        });
    };

    // Show confirmation modal
    const showConfirmation = (action, id, message) => {
        setConfirmAction(action);
        setConfirmId(id);
        setConfirmMessage(message);
        setShowConfirmModal(true);
    };

    const handleConfirm = async () => {
        if (confirmAction === 'save') {
            await handleSave(confirmId);
        } else if (confirmAction === 'delete') {
            await handleDelete(confirmId);
        }
        setShowConfirmModal(false);
    };

    const handleCancel = () => {
        setShowConfirmModal(false);
        setConfirmAction(null);
        setConfirmId(null);
        setConfirmMessage('');
    };

    const handleSave = async (id) => {
        try {
            const payload = {
                subscriptionName: editForm.subscriptionName.trim(),
                validityDays: Number(editForm.validityDays),
                price: Number(editForm.price),
                isMostPopular: editForm.isMostPopular,
                subscriptionDescription: editForm.subscriptionDescription.trim(),
                selectedPlan: editForm.selectedPlan,
                category: editForm.category || null
            };

            const res = await axios.patch(
                `${import.meta.env.VITE_BASE_URL}/subscription/${id}`,
                payload
            );

            if (res.data?.modifiedCount === 1 || res.data?.acknowledged) {
                toast.success('Subscription updated successfully');
                setEditingId(null);
                setEditForm({});
                await fetchSubscriptions();
            } else {
                throw new Error('Update failed');
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to update plan');
        }
    };

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/subscription/${id}`);
            if (res.data?.deletedCount === 1 || res.data?.acknowledged) {
                toast.success('Subscription deleted successfully');
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

    const getCategoryName = (catId) => {
        if (!catId) return '—';
        const cat = categoryData.find(c => c._id === catId);
        return cat ? cat.name : 'Unknown';
    };

    const isLoading = subsLoading || platformsLoading || categoryLoading;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
                    <p className="text-gray-600 font-medium">
                        {subsLoading ? 'Loading plans...' : categoryLoading ? 'Loading categories...' : 'Loading platforms...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 md:px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Manage Subscription Plans
                        </h1>
                        <p className="mt-1.5 text-gray-600">
                            Edit, update or remove existing subscription packages
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
                            No subscription plans found
                        </h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Create your first plan from the <strong>Add New Subscription</strong> section.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {subscriptions.map((sub) => {
                            const isEditing = editingId === sub._id;
                            const isDeleting = deletingId === sub._id;

                            return (
                                <motion.div
                                    key={sub._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className={`
                    bg-white rounded-xl shadow-sm border overflow-hidden
                    ${isEditing ? 'border-indigo-500 ring-1 ring-indigo-200 shadow-md' : 'border-gray-200 hover:shadow-md'}
                  `}
                                >
                                    {/* Header */}
                                    <div className="md:px-5 py-4 border-b bg-gray-50/80 flex items-center justify-between gap-3">
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

                                        <div className="flex items-center gap-1 shrink-0">
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        onClick={() => showConfirmation('save', sub._id, 'Are you sure you want to save changes to this subscription plan?')}
                                                        disabled={isDeleting}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Save changes"
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
                                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        title="Edit plan"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => showConfirmation('delete', sub._id, 'Are you sure you want to permanently delete this subscription plan? This action cannot be undone.')}
                                                        disabled={isDeleting}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete plan"
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

                                    {/* Rest of card content remains the same */}
                                    <div className="p-5 space-y-5 text-sm">
                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-gray-500 text-xs">
                                                    <DollarSign size={16} />
                                                    <span>Price</span>
                                                </div>
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={editForm.price}
                                                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
                                                    />
                                                ) : (
                                                    <div className="font-medium text-lg">
                                                        ৳ {formatPrice(sub.price)}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-gray-500 text-xs">
                                                    <CalendarDays size={16} />
                                                    <span>Validity</span>
                                                </div>
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={editForm.validityDays}
                                                        onChange={(e) => setEditForm({ ...editForm, validityDays: e.target.value })}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
                                                    />
                                                ) : (
                                                    <div className="font-medium text-lg">{sub.validityDays} days</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Category, Description, Platforms, Most Popular - unchanged */}
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-gray-500 text-xs">
                                                <Tag size={16} />
                                                <span>Category</span>
                                            </div>
                                            {isEditing ? (
                                                <select
                                                    value={editForm.category || ''}
                                                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white"
                                                    disabled={categoryLoading}
                                                >
                                                    <option value="">Select category</option>
                                                    {categoryData.map((cat) => (
                                                        <option key={cat._id} value={cat._id}>
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <div className="font-medium">
                                                    {getCategoryName(sub.category?._id || sub.category)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <div className="text-xs text-gray-500">Description</div>
                                            {isEditing ? (
                                                <textarea
                                                    value={editForm.subscriptionDescription}
                                                    onChange={(e) =>
                                                        setEditForm({ ...editForm, subscriptionDescription: e.target.value })
                                                    }
                                                    rows={3}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-y focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
                                                />
                                            ) : (
                                                <p className="text-gray-700 leading-relaxed">
                                                    {sub.subscriptionDescription || <span className="italic text-gray-400">No description</span>}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <div className="text-xs text-gray-500">Included Platforms</div>
                                            {isEditing ? (
                                                <div className="flex flex-wrap gap-2.5">
                                                    {platformsLoading ? (
                                                        <div className="text-gray-400 italic">Loading...</div>
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
                                    ${isSelected ? 'bg-indigo-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
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
                                                            const platform = platforms.find(p => p._id === id);
                                                            return (
                                                                <div
                                                                    key={idx}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full"
                                                                >
                                                                    <Globe size={12} />
                                                                    {platform?.platformName || 'Unknown'}
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        <span className="text-gray-400 italic">No platforms included</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {isEditing && (
                                            <div className="pt-3 border-t">
                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={editForm.isMostPopular}
                                                        onChange={(e) =>
                                                            setEditForm({ ...editForm, isMostPopular: e.target.checked })
                                                        }
                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                    <div className="flex items-center gap-1.5 text-sm text-gray-700 group-hover:text-indigo-700 transition-colors">
                                                        <Star size={15} className={editForm.isMostPopular ? "fill-amber-400 text-amber-500" : ""} />
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

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showConfirmModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0  flex  justify-center z-50 p-4"
                        onClick={handleCancel}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md h-fit w-full overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="px-6 py-5 border-b bg-gradient-to-r from-rose-500 to-yellow-500  flex items-center gap-3">
                                <AlertCircle className="h-6 w-6 text-indigo-50" />
                                <h3 className="text-lg font-semibold text-gray-50">
                                    Confirm Action
                                </h3>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                <p className="text-gray-700 leading-relaxed">
                                    {confirmMessage}
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
                                <button
                                    onClick={handleCancel}
                                    className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className={`px-5 py-2.5 rounded-lg font-medium text-white transition-colors flex items-center gap-2
                    ${confirmAction === 'delete'
                                            ? 'bg-red-600 hover:bg-red-700'
                                            : 'bg-indigo-600 hover:bg-indigo-700'
                                        }`}
                                >
                                    {confirmAction === 'delete' ? 'Delete' : 'Save Changes'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageSubscription;