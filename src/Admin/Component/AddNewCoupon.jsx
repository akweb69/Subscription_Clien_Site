import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import useSubscriptionData from '../Hooks/useSubscriptionData';

const AddNewCoupon = () => {
    const [loading, setLoading] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [selectedSubscription, setSelectedSubscription] = useState('');

    const { subscriptionLoading, subscriptionData } = useSubscriptionData();

    const base_url = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!couponCode.trim()) {
            toast.error('Coupon code is required');
            return;
        }
        if (!discount || isNaN(discount) || Number(discount) <= 0) {
            toast.error('Please enter a valid discount amount');
            return;
        }
        if (!selectedSubscription) {
            toast.error('Please select a subscription plan');
            return;
        }

        const payload = {
            code: couponCode.trim().toUpperCase(),
            discount: Number(discount),
            subscriptionName: selectedSubscription,
            createdAt: new Date(),
        };

        try {
            setLoading(true);
            const response = await axios.post(`${base_url}/coupon`, payload);
            if (response.data?.insertedId) {
                toast.success('Coupon created successfully!');
                setCouponCode('');
                setDiscount('');
                setSelectedSubscription('');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create coupon');
        } finally {
            setLoading(false);
        }
    };

    // ────────────────────────────────────────────────
    // Live Preview Data
    // ────────────────────────────────────────────────
    const previewCode = couponCode.trim() ? couponCode.trim().toUpperCase() : 'PROMO123';
    const previewDiscount = discount && !isNaN(discount) ? Number(discount) : 20;
    const previewSub = selectedSubscription || 'Premium Monthly';

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    Create New Coupon
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* ─── LEFT: FORM ──────────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-7 rounded-xl shadow-lg"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Subscription */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Coupon For Subscription <span className="text-red-500">*</span>
                                </label>
                                {subscriptionLoading ? (
                                    <div className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-500">
                                        Loading plans...
                                    </div>
                                ) : (
                                    <select
                                        value={selectedSubscription}
                                        onChange={(e) => setSelectedSubscription(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    >
                                        <option value="">Select Subscription Plan</option>
                                        {subscriptionData?.map((sub) => (
                                            <option key={sub._id} value={sub.subscriptionName}>
                                                {sub.subscriptionName}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Coupon Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Coupon Code <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    placeholder="SUMMER25"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    maxLength={12}
                                    required
                                />
                            </div>

                            {/* Discount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Discount Value <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                    placeholder="25"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            {/* Submit */}
                            <div className="!mt-8">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading || subscriptionLoading}
                                    className={`w-full py-3.5 px-6 rounded-lg text-white font-medium text-lg transition
                    ${loading || subscriptionLoading
                                            ? 'bg-indigo-400 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                >
                                    {loading ? 'Creating Coupon...' : 'Create Coupon'}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>

                    {/* ─── RIGHT: LIVE PREVIEW ─────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-xl shadow-lg flex flex-col "
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">
                            Live Preview
                        </h2>

                        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl  border-2 border-dashed border-indigo-200">
                            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                                {/* Coupon Card Header */}
                                <div className="bg-indigo-600 px-6 py-5 text-white">
                                    <h3 className="text-xl font-bold text-center">
                                        Special Offer
                                    </h3>
                                </div>

                                {/* Main Content */}
                                <div className="p-6 text-center">
                                    <div className="text-5xl font-black text-indigo-600 mb-2">
                                        {previewDiscount} TK
                                    </div>
                                    <div className="text-lg font-semibold text-gray-700 mb-4">
                                        OFF
                                    </div>

                                    <div className="inline-block bg-yellow-100 text-yellow-800 font-bold px-6 py-2 rounded-full text-xl tracking-wider mb-5 border-2 border-yellow-300">
                                        {previewCode}
                                    </div>

                                    <p className="text-sm text-gray-600 mb-4">
                                        Applicable on <strong>{previewSub}</strong> plan
                                    </p>

                                    <div className="text-xs text-gray-500">
                                        Use code at checkout • Limited time offer
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-center text-sm text-gray-500 mt-6">
                            This is a preview — actual design may vary based on your frontend
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AddNewCoupon;