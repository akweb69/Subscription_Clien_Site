import React, { useEffect, useState, useMemo } from 'react';
import {
    ShoppingBag, Package, Clock, Heart,
    User, CreditCard, Wallet, BadgeCheck, AlertCircle
} from 'lucide-react';
import { AppContext } from '@/context/AppContext';
import axios from 'axios';

const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow transition-shadow duration-200">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <p className="text-xl sm:text-2xl font-bold mt-1 text-gray-800">{value}</p>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
        </div>
    </div>
);

// Animated flip card component for countdown digits
const FlipCard = ({ value, label, urgency }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        if (value !== displayValue) {
            setIsFlipping(true);
            const timeout = setTimeout(() => {
                setDisplayValue(value);
                setIsFlipping(false);
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [value, displayValue]);

    const colorScheme = {
        normal: {
            bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
            text: 'text-emerald-100',
            label: 'text-emerald-600',
            glow: 'shadow-emerald-200'
        },
        warning: {
            bg: 'bg-gradient-to-br from-amber-500 to-orange-500',
            text: 'text-amber-100',
            label: 'text-amber-600',
            glow: 'shadow-amber-200'
        },
        critical: {
            bg: 'bg-gradient-to-br from-red-500 to-rose-600',
            text: 'text-red-100',
            label: 'text-red-600',
            glow: 'shadow-red-200'
        },
        expired: {
            bg: 'bg-gradient-to-br from-gray-500 to-gray-600',
            text: 'text-gray-100',
            label: 'text-gray-600',
            glow: 'shadow-gray-200'
        }
    };

    const colors = colorScheme[urgency] || colorScheme.normal;

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative">
                <div
                    className={`
                        relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg ${colors.bg} 
                        shadow-lg ${colors.glow} overflow-hidden
                        ${isFlipping ? 'animate-flip' : ''}
                    `}
                    style={{
                        perspective: '1000px',
                        transformStyle: 'preserve-3d'
                    }}
                >
                    {/* Top half */}
                    <div className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden">
                        <div className={`absolute inset-0 flex items-end justify-center pb-1 text-3xl sm:text-4xl font-bold ${colors.text}`}>
                            {displayValue}
                        </div>
                    </div>

                    {/* Middle divider line */}
                    <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-black/10 z-10"></div>

                    {/* Bottom half */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden">
                        <div className={`absolute inset-0 flex items-start justify-center pt-1 text-3xl sm:text-4xl font-bold ${colors.text}`}>
                            {displayValue}
                        </div>
                    </div>

                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>
                </div>

                {/* Reflection */}
                <div className="absolute -bottom-1 left-0 right-0 h-2 bg-gradient-to-b from-black/10 to-transparent blur-sm"></div>
            </div>

            <span className={`text-xs font-semibold uppercase tracking-wider ${colors.label}`}>
                {label}
            </span>
        </div>
    );
};

const Countdown = ({ expiryDate }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isExpired, setIsExpired] = useState(false);
    const [urgency, setUrgency] = useState('normal');

    useEffect(() => {
        if (!expiryDate) {
            setIsExpired(true);
            // delete order form database-------->
            return;
        }

        const targetTime = new Date(expiryDate).getTime();
        if (isNaN(targetTime)) {
            setIsExpired(true);
            return;
        }

        const update = () => {
            const now = Date.now();
            const diff = targetTime - now;

            if (diff <= 0) {
                setIsExpired(true);
                setUrgency('expired');
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setIsExpired(false);

            const days = Math.floor(diff / 86400000);
            const hours = Math.floor((diff % 86400000) / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });

            // Determine urgency level
            if (diff < 3600000) {           // < 1 hour
                setUrgency('critical');
            } else if (diff < 86400000) {   // < 24 hours
                setUrgency('warning');
            } else if (days <= 3) {         // ≤ 3 days
                setUrgency('warning');
            } else {
                setUrgency('normal');
            }
        };

        update();
        const timer = setInterval(update, 1000); // Update every second

        return () => clearInterval(timer);
    }, [expiryDate]);


    if (isExpired) {
        return (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 shadow-lg shadow-red-200">
                <AlertCircle size={20} className="text-white animate-pulse" />
                <span className="text-white font-bold text-lg">EXPIRED</span>
            </div>
        );
    }

    return (
        <div className="inline-flex items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-gray-100 shadow-xl">
            {timeLeft.days > 0 && (
                <>
                    <FlipCard value={timeLeft.days.toString().padStart(2, '0')} label="Days" urgency={urgency} />
                    <span className="text-3xl font-bold text-gray-400 self-start mt-6">:</span>
                </>
            )}
            <FlipCard value={timeLeft.hours.toString().padStart(2, '0')} label="Hours" urgency={urgency} />
            <span className="text-3xl font-bold text-gray-400 self-start mt-6">:</span>
            <FlipCard value={timeLeft.minutes.toString().padStart(2, '0')} label="Minutes" urgency={urgency} />
            <span className="text-3xl font-bold text-gray-400 self-start mt-6">:</span>
            <FlipCard value={timeLeft.seconds.toString().padStart(2, '0')} label="Seconds" urgency={urgency} />
        </div>
    );
};

const getValidTillDate = (validityDays, approvedDate) => {
    if (!validityDays || !approvedDate) return null;
    try {
        const start = new Date(approvedDate);
        if (isNaN(start.getTime())) return null;
        const end = new Date(start);
        end.setDate(start.getDate() + Number(validityDays));
        return end;
    } catch {
        return null;
    }
};

const UserDashboard = () => {
    const { user } = React.useContext(AppContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const baseURL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            if (!user?.email) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const res = await axios.get(`${baseURL}/order`);

                if (!mounted) return;

                const myOrders = res.data
                    .filter(order => order?.userEmail?.toLowerCase() === user.email.toLowerCase())
                    .sort((a, b) => new Date(b.orderDate || 0) - new Date(a.orderDate || 0));

                setOrders(myOrders);
            } catch (err) {
                console.error(err);
                setError(
                    err.response?.data?.message ||
                    "Could not load dashboard data. Please try again later."
                );
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchData();

        return () => { mounted = false; };
    }, [user?.email, baseURL]);

    const activeSubscriptions = useMemo(() =>
        orders.filter(o => o.status?.toLowerCase() === 'approved'),
        [orders]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
                    <p className="text-gray-600">Loading your account...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-lg w-full text-center">
                    <AlertCircle className="mx-auto text-red-500 mb-4" size={44} />
                    <p className="text-red-700 text-lg font-medium">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Welcome back, {user?.displayName?.split(' ')[0] || 'User'}
                </h1>
                <p className="text-gray-600 mt-1">
                    Here's an overview of your subscriptions & orders
                </p>
            </div>

            {/* Active Subscriptions */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b bg-gradient-to-r from-emerald-50 to-teal-50">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Active Subscriptions
                        </h2>
                    </div>
                </div>

                <div className="p-6">
                    {activeSubscriptions.length > 0 ? (
                        <div className="space-y-6">
                            {activeSubscriptions.map(sub => {
                                const expiry = getValidTillDate(sub.validityDays, sub?.updateDate || sub?.approvedAt || sub?.orderDate);
                                return (
                                    <div
                                        key={sub._id}
                                        className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="flex flex-col gap-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="space-y-2">
                                                    <h3 className="text-xl font-bold text-gray-900">
                                                        {sub.planName || 'Subscription Plan'}
                                                    </h3>
                                                    <div className="flex items-center gap-4 flex-wrap">
                                                        <p className="text-sm text-gray-600 flex items-center gap-2">
                                                            <Clock size={16} className="text-emerald-600" />
                                                            Duration: <span className="font-semibold">{sub.validityDays} days</span>
                                                        </p>
                                                        {sub?.updateDate && (
                                                            <p className="text-xs text-gray-500">
                                                                Started: {new Date(sub.updateDate).toLocaleDateString('en-US', {
                                                                    year: 'numeric', month: 'short', day: 'numeric'
                                                                })}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <span className="inline-flex px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200">
                                                    Active
                                                </span>
                                            </div>

                                            {/* Countdown Timer */}
                                            <div className="flex justify-center pt-4 border-t border-gray-100">
                                                <Countdown expiryDate={expiry} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-16 text-center">
                            <Package className="mx-auto text-gray-400 mb-4" size={48} />
                            <p className="text-gray-600 text-lg font-medium">
                                No active subscriptions
                            </p>
                            <p className="text-gray-400 mt-2">
                                Purchase a plan to get started
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard icon={ShoppingBag} title="Total Orders" value={orders.length} color="bg-emerald-500" />
                <StatCard icon={Package} title="Pending" value={orders.filter(o => o.status?.toLowerCase() === "pending").length} color="bg-amber-500" />
                <StatCard icon={Clock} title="Last Order" value={orders[0]?.orderDate ? new Date(orders[0].orderDate).toLocaleDateString() : '—'} color="bg-blue-500" />
                <StatCard icon={Heart} title="Active Plans" value={activeSubscriptions.length} color="bg-rose-500" />
            </div>

            {/* Recent Orders */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Recent Orders
                    </h2>
                </div>

                <div className="divide-y divide-gray-100">
                    {orders.length > 0 ? (
                        orders.slice(0, 7).map(order => (
                            <div
                                key={order._id}
                                className="p-5 hover:bg-gray-50/60 transition-colors"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-1.5 flex-1">
                                        <p className="font-medium text-gray-900">
                                            {order.planName || 'Order'}
                                        </p>
                                        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-600">
                                            <span className="flex items-center gap-1.5">
                                                <CreditCard size={15} /> ৳{Number(order.amount || 0).toLocaleString()}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Wallet size={15} /> {order.paymentMethod || '?'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 flex-shrink-0">
                                        <span
                                            className={`
                        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap
                        ${order.status?.toLowerCase() === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                                    order.status?.toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-gray-100 text-gray-600'}
                      `}
                                        >
                                            {order.status?.toLowerCase() === 'approved' ? <BadgeCheck size={14} /> : <Clock size={14} />}
                                            {order.status || 'Unknown'}
                                        </span>
                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                            {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '—'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center text-gray-500">
                            No orders found yet.
                        </div>
                    )}
                </div>
            </section>

            <style jsx>{`
                @keyframes flip {
                    0%, 100% { transform: rotateX(0deg); }
                    50% { transform: rotateX(90deg); }
                }
                
                .animate-flip {
                    animation: flip 0.6s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default UserDashboard;