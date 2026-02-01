import { AppContext } from '@/context/AppContext';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const OrderHistory = () => {
    const { user, loading } = useContext(AppContext);
    const [orders, setOrders] = useState([]);
    const [uiLoading, setUiLoading] = useState(false);

    const base_url = import.meta.env.VITE_BASE_URL;

    const loadData = async () => {
        if (!user?.email) return;
        try {
            setUiLoading(true);
            const res = await axios.get(`${base_url}/order`);
            const myOrders = res.data.filter(
                o => o.userEmail === user.email
            );
            setOrders(myOrders);
        } catch (err) {
            console.error(err);
        } finally {
            setUiLoading(false);
        }
    };

    useEffect(() => {
        if (!loading) loadData();
    }, [loading]);

    if (loading || uiLoading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <Loader2 className="animate-spin text-gray-500" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <h2 className="text-2xl font-semibold mb-6">My Orders</h2>

            {orders.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    No orders found.
                </div>
            ) : (
                <div className="grid gap-4">
                    {orders.map(order => (
                        <div
                            key={order._id}
                            className="bg-white rounded-xl border shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                        >
                            {/* LEFT */}
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {order.planName}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Transaction ID: {order.transactionId}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Payment: {order.paymentMethod}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Date:{' '}
                                    {new Date(order.orderDate).toLocaleDateString()}
                                </p>
                            </div>

                            {/* RIGHT */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                                <div>
                                    <p className="text-sm text-gray-500">Amount</p>
                                    <p className="text-lg font-semibold">
                                        ৳ {order.amount}
                                    </p>
                                    {order.discountAmount && (
                                        <p className="text-xs text-green-600">
                                            Discount: ৳ {order.discountAmount}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Validity</p>
                                    <p className="font-medium">
                                        {order.validityDays} day(s)
                                    </p>
                                </div>

                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium
                                    ${order.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : order.status === 'approved'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}
                                >
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
