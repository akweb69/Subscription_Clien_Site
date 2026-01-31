import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const ManageCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ code: '', discount: '' });

    const base_url = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

    // Fetch coupons
    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${base_url}/coupon`);
            setCoupons(res.data || []);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to load coupons');
            toast.error('Failed to load coupons');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    // ─── Edit handlers ────────────────────────────────────────
    const handleSelectCoupon = (coupon) => {
        setSelectedCoupon(coupon);
        if (editingId !== coupon._id) {
            setEditingId(null);
        }
    };

    const handleEditClick = (coupon) => {
        setEditingId(coupon._id);
        setEditForm({
            code: coupon.code || '',
            discount: coupon.discount || '',
        });
        setSelectedCoupon(coupon); // show it in preview while editing
    };

    const handleCancelEdit = () => {
        setEditingId(null);
    };

    const handleSaveEdit = async (id) => {
        if (!editForm.code.trim()) {
            toast.error('Coupon code is required');
            return;
        }
        if (!editForm.discount || isNaN(editForm.discount) || Number(editForm.discount) <= 0) {
            toast.error('Valid discount required');
            return;
        }

        const payload = {
            code: editForm.code.trim().toUpperCase(),
            discount: Number(editForm.discount),
        };

        try {
            const res = await axios.patch(`${base_url}/coupon/${id}`, payload);
            if (res.data.modifiedCount === 1) {
                toast.success('Coupon updated!');
                setCoupons((prev) =>
                    prev.map((c) => (c._id === id ? { ...c, ...payload } : c))
                );
                setSelectedCoupon((prev) => ({ ...prev, ...payload }));
                setEditingId(null);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this coupon?')) return;

        try {
            const res = await axios.delete(`${base_url}/coupon/${id}`);
            if (res.data.deletedCount === 1) {
                toast.success('Coupon deleted');
                setCoupons((prev) => prev.filter((c) => c._id !== id));
                if (selectedCoupon?._id === id) {
                    setSelectedCoupon(null);
                }
                setEditingId(null);
            }
        } catch (err) {
            toast.error('Failed to delete coupon');
        }
    };

    // ─── Preview values ────────────────────────────────────────
    const previewCode =
        editingId && selectedCoupon?._id === editingId
            ? editForm.code.trim() || 'PROMO123'
            : selectedCoupon?.code || 'PROMO123';

    const previewDiscount =
        editingId && selectedCoupon?._id === editingId
            ? Number(editForm.discount) || 20
            : selectedCoupon?.discount || 20;

    const previewSubName = selectedCoupon?.subscriptionName || 'Premium Plan';

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-600 text-xl p-10">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    Manage Coupons
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* ─── LEFT: Table ─────────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden"
                    >
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-semibold text-gray-800">
                                All Coupons
                            </h2>
                        </div>

                        {coupons.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                No coupons created yet.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Code
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Discount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                For Plan
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {coupons.map((coupon) => (
                                            <tr
                                                key={coupon._id}
                                                onClick={() => handleSelectCoupon(coupon)}
                                                className={`cursor-pointer hover:bg-indigo-50 transition-colors ${selectedCoupon?._id === coupon._id ? 'bg-indigo-50' : ''
                                                    }`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingId === coupon._id ? (
                                                        <input
                                                            type="text"
                                                            value={editForm.code}
                                                            onChange={(e) =>
                                                                setEditForm({ ...editForm, code: e.target.value })
                                                            }
                                                            className="border border-gray-300 rounded px-2 py-1 w-full"
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <span className="font-medium text-indigo-700">
                                                            {coupon.code}
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingId === coupon._id ? (
                                                        <input
                                                            type="number"
                                                            value={editForm.discount}
                                                            onChange={(e) =>
                                                                setEditForm({ ...editForm, discount: e.target.value })
                                                            }
                                                            min="0"
                                                            step="0.01"
                                                            className="border border-gray-300 rounded px-2 py-1 w-20"
                                                        />
                                                    ) : (
                                                        `${coupon.discount}%`
                                                    )}
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {coupon.subscriptionName || '—'}
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                    {editingId === coupon._id ? (
                                                        <>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleSaveEdit(coupon._id);
                                                                }}
                                                                className="text-green-600 hover:text-green-800 mr-3 font-medium"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleCancelEdit();
                                                                }}
                                                                className="text-gray-600 hover:text-gray-800 font-medium"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEditClick(coupon);
                                                                }}
                                                                className="text-indigo-600 hover:text-indigo-800 mr-4 font-medium"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDelete(coupon._id);
                                                                }}
                                                                className="text-red-600 hover:text-red-800 font-medium"
                                                            >
                                                                Delete
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>

                    {/* ─── RIGHT: Live Preview ─────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-xl shadow-lg p-6 flex flex-col"
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">
                            Coupon Preview
                        </h2>

                        {selectedCoupon ? (
                            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-8 border-2 border-dashed border-indigo-200">
                                <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 transform hover:scale-105 transition-transform">
                                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
                                        <h3 className="text-2xl font-bold text-center">
                                            Special Discount
                                        </h3>
                                    </div>

                                    <div className="p-8 text-center">
                                        <div className="text-6xl font-black text-indigo-600 mb-1">
                                            {previewDiscount} TK
                                        </div>
                                        <div className="text-xl font-semibold text-gray-700 mb-6">
                                            OFF
                                        </div>

                                        <div className="inline-block bg-yellow-100 text-yellow-800 font-extrabold px-8 py-3 rounded-full text-2xl tracking-widest mb-6 border-4 border-yellow-300 shadow-md">
                                            {previewCode}
                                        </div>

                                        <p className="text-base text-gray-700 mb-4">
                                            Valid for <strong>{previewSubName}</strong> subscription
                                        </p>

                                        <div className="text-sm text-gray-500 mt-4">
                                            Use code at checkout • Limited offer
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
                                Select a coupon to see preview
                            </div>
                        )}

                        <p className="text-center text-sm text-gray-500 mt-6 pt-4 border-t">
                            Preview updates live when editing
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ManageCoupons;