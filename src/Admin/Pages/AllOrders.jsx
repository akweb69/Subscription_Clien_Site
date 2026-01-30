import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    Loader2,
    Search,
    XCircle,
    AlertCircle,
    Calendar,
    CreditCard,
    Wallet,
} from 'lucide-react';
import toast from 'react-hot-toast';

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/order`, {
                    // If your backend requires authentication:
                    // headers: { Authorization: `Bearer ${yourToken}` }
                });
                const data = res.data || [];
                setOrders(data);
                setFilteredOrders(data);
            } catch (err) {
                console.error(err);
                toast.error('Failed to load your orders');
            } finally {
                setLoading(false);
            }
        };

        fetchUserOrders();
    }, []);

    // Client-side search/filter
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredOrders(orders);
            return;
        }

        const term = searchTerm.toLowerCase();
        const results = orders.filter((order) =>
            order.planName?.toLowerCase().includes(term) ||
            order.transactionId?.toLowerCase().includes(term) ||
            order.status?.toLowerCase().includes(term) ||
            String(order.amount || '').includes(term)
        );

        setFilteredOrders(results);
    }, [searchTerm, orders]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'approved') {
            return 'bg-green-100 text-green-800 border-green-200';
        }
        if (s === 'pending') {
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
        if (s === 'rejected') {
            return 'bg-red-100 text-red-800 border-red-200';
        }
        return 'bg-gray-100 text-gray-700 border-gray-200';
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    My Orders
                </h1>

                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by plan, trxID, status..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 outline-none transition"
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

            {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-xl shadow border p-10 text-center">
                    <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-800 mb-2">
                        No orders found
                    </h3>
                    <p className="text-gray-600">
                        {searchTerm
                            ? 'Try different search keywords'
                            : 'You haven’t placed any orders yet'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
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
                                        Trx ID
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <motion.tr
                                        key={order._id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {order.planName || '—'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-center font-medium text-emerald-700">
                                            ৳{Number(order.amount || 0).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                                            {formatDate(order.orderDate)}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-center">
                                            <span
                                                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status?.toUpperCase() || 'UNKNOWN'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-mono text-gray-600">
                                            {order.transactionId?.slice(0, 12) || '—'}
                                            {order.transactionId?.length > 12 ? '...' : ''}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-3 bg-gray-50 border-t text-sm text-gray-600 flex justify-between items-center">
                        <span>Showing {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}</span>
                        <span className="text-gray-500">Last updated: just now</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllOrders;