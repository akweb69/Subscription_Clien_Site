// src/pages/admin/ManageOrders.jsx   (or wherever you place it)

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Loader2,
    Trash2,
    CheckCircle,
    Clock,
    Search,
    XCircle,
    RefreshCw,
    AlertCircle,
    Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/order`);
            const data = res.data || [];
            setOrders(data);
            setFilteredOrders(data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    // Client-side search
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredOrders(orders);
            return;
        }

        const term = searchTerm.toLowerCase();
        const results = orders.filter(
            (o) =>
                o.userEmail?.toLowerCase().includes(term) ||
                o.userName?.toLowerCase().includes(term) ||
                o.planName?.toLowerCase().includes(term) ||
                o.transactionId?.toLowerCase().includes(term) ||
                o.senderNumber?.toLowerCase().includes(term)
        );

        setFilteredOrders(results);
    }, [searchTerm, orders]);

    const updateStatus = async (id, status) => {
        try {
            await axios.patch(`${import.meta.env.VITE_BASE_URL}/order/${id}`, { status });
            toast.success(`Order updated to ${status}`);
            loadOrders();
        } catch (err) {
            console.error(err);
            toast.error('Failed to update status');
        }
    };

    const deleteOrder = async (id) => {
        if (!window.confirm('Delete this order permanently?')) return;

        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/order/${id}`);
            toast.success('Order deleted successfully');
            loadOrders();
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete order');
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusStyles = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'approved') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        if (s === 'pending') return 'bg-amber-100 text-amber-700 border-amber-200';
        if (s === 'rejected') return 'bg-red-100 text-red-700 border-red-200';
        return 'bg-gray-100 text-gray-700 border-gray-200';
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Header + Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Manage Orders
                </h1>

                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email, plan, trxID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 outline-none transition"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <XCircle size={18} />
                        </button>
                    )}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {filteredOrders.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-white rounded-xl shadow border p-10 text-center"
                    >
                        <AlertCircle className="w-14 h-14 text-amber-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            No orders found
                        </h3>
                        <p className="text-gray-600">
                            {searchTerm ? 'Try different search terms' : 'No orders exist yet'}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="table"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-xl shadow border overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Plan
                                        </th>
                                        <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredOrders.map((order) => (
                                        <tr
                                            key={order._id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {order.userName || '—'}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {order.userEmail}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {order.planName || '—'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-center font-medium text-emerald-700">
                                                ৳{Number(order.amount || 0).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-center text-xs text-gray-500">
                                                {formatDate(order.orderDate)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-center">
                                                <span
                                                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyles(
                                                        order.status
                                                    )}`}
                                                >
                                                    {order.status || 'unknown'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        onClick={() => handleViewDetails(order)}
                                                        className="text-indigo-600 hover:text-indigo-800 p-1 rounded hover:bg-indigo-50 transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={20} />
                                                    </button>

                                                    {order.status?.toLowerCase() !== 'approved' && (
                                                        <button
                                                            onClick={() => updateStatus(order._id, 'approved')}
                                                            className="text-emerald-600 hover:text-emerald-800 p-1 rounded hover:bg-emerald-50 transition-colors"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle size={20} />
                                                        </button>
                                                    )}

                                                    {order.status?.toLowerCase() !== 'pending' && (
                                                        <button
                                                            onClick={() => updateStatus(order._id, 'pending')}
                                                            className="text-amber-600 hover:text-amber-800 p-1 rounded hover:bg-amber-50 transition-colors"
                                                            title="Set Pending"
                                                        >
                                                            <Clock size={20} />
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => deleteOrder(order._id)}
                                                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-3 bg-gray-50 border-t flex justify-between items-center text-sm text-gray-600">
                            <span>
                                Showing {filteredOrders.length} of {orders.length} orders
                            </span>
                            <button
                                onClick={loadOrders}
                                className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-800"
                            >
                                <RefreshCw size={14} />
                                Refresh
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ────────────────────────────────────────────────
          Order Details Modal
      ──────────────────────────────────────────────── */}
            <AnimatePresence>
                {modalOpen && selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
                        onClick={() => setModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                                    <Eye className="text-indigo-600" size={24} />
                                    Order #{selectedOrder._id.slice(-8).toUpperCase()}
                                </h2>
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <XCircle size={24} className="text-gray-600" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-8">
                                {/* Status & Actions */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 p-5 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusStyles(
                                                selectedOrder.status
                                            )}`}
                                        >
                                            {selectedOrder.status?.toUpperCase() || 'UNKNOWN'}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            {formatDate(selectedOrder.orderDate)}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        {selectedOrder.status?.toLowerCase() !== 'approved' && (
                                            <button
                                                onClick={() => {
                                                    updateStatus(selectedOrder._id, 'approved');
                                                    setModalOpen(false);
                                                }}
                                                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                                            >
                                                <CheckCircle size={18} />
                                                Approve
                                            </button>
                                        )}

                                        {selectedOrder.status?.toLowerCase() !== 'pending' && (
                                            <button
                                                onClick={() => {
                                                    updateStatus(selectedOrder._id, 'pending');
                                                    setModalOpen(false);
                                                }}
                                                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                                            >
                                                <Clock size={18} />
                                                Set Pending
                                            </button>
                                        )}

                                        <button
                                            onClick={() => {
                                                deleteOrder(selectedOrder._id);
                                                setModalOpen(false);
                                            }}
                                            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                                        >
                                            <Trash2 size={18} />
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Customer */}
                                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                        <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                                            👤 Customer
                                        </h3>

                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Name</span>
                                                <span className="font-medium text-gray-900">
                                                    {selectedOrder.userName || '—'}
                                                </span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Email</span>
                                                <span className="text-gray-700">
                                                    {selectedOrder.userEmail || '—'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Subscription */}
                                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                        <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                                            📦 Subscription
                                        </h3>

                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Plan</span>
                                                <span className="font-medium text-gray-900">
                                                    {selectedOrder.planName || '—'}
                                                </span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Amount</span>
                                                <span className="font-semibold text-emerald-700">
                                                    ৳{Number(selectedOrder.amount || 0).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Details */}
                                    <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                        <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                                            💳 Payment Details
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Method</span>
                                                <span className="font-medium">
                                                    {selectedOrder.paymentMethod?.toUpperCase() || '—'}
                                                </span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Sender Number</span>
                                                <span className="font-medium">
                                                    {selectedOrder.senderNumber || '—'}
                                                </span>
                                            </div>

                                            <div className="sm:col-span-2">
                                                <span className="text-gray-500 block mb-1">Transaction ID</span>
                                                <code className="inline-block bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg font-mono text-xs">
                                                    {selectedOrder.transactionId || '—'}
                                                </code>
                                            </div>
                                        </div>
                                    </div>



                                    {/* coupon detrails */}
                                    {
                                        selectedOrder?.couponCode && (
                                            <>
                                                <div className="md:col-span-2 bg-white rounded-2xl border border-rose-200 shadow-sm p-6">
                                                    <h3 className="flex items-center gap-2 font-semibold text-rose-700 mb-4 border-b border-rose-100 pb-2">
                                                        🎟️ Coupon Details
                                                    </h3>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-500 text-xs mb-1">Coupon Code</span>
                                                            <span className="font-medium text-gray-900 tracking-wide">
                                                                {selectedOrder.couponCode?.toUpperCase() || '—'}
                                                            </span>
                                                        </div>

                                                        <div className="flex flex-col">
                                                            <span className="text-gray-500 text-xs mb-1">Discount</span>
                                                            <span className="font-semibold text-green-600">
                                                                {selectedOrder.discountAmount || '—'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageOrders;