import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LayoutDashboard,
    ShoppingCart,
    Users,
    CreditCard,
    Tag,
    Clock,
    CheckCircle,
    XCircle,
    TrendingUp,
    Activity,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    MoreVertical,
    RefreshCw
} from 'lucide-react';

const AdminDash = () => {
    const date = new Date();
    const today = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const base_url = import.meta.env.VITE_BASE_URL;
    const [totalOrders, setTotalOrders] = useState(0);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [approvedOrders, setApprovedOrders] = useState([]);
    const [rejectedOrders, setRejectedOrders] = useState([]);
    const [totalUser, setTotalUser] = useState([]);
    const [totalSubscription, setTotalSubscription] = useState([]);
    const [totalCoupon, setTotalCoupon] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [orderRes, userRes, subscriptionRes, couponRes] = await Promise.all([
                axios.get(`${base_url}/order`),
                axios.get(`${base_url}/users`),
                axios.get(`${base_url}/subscription`),
                axios.get(`${base_url}/coupon`),
            ]);

            if (orderRes.data) {
                setTotalOrders(orderRes.data.length);
                setPendingOrders(orderRes.data.filter(order => order.status === 'pending'));
                setApprovedOrders(orderRes.data.filter(order => order.status === 'approved'));
                setRejectedOrders(orderRes.data.filter(order => order.status === 'rejected'));
            }
            if (userRes.data) {
                setTotalUser(userRes.data);
            }
            if (subscriptionRes.data) {
                setTotalSubscription(subscriptionRes.data);
            }
            if (couponRes.data) {
                setTotalCoupon(couponRes.data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error loading data:', error);
            setLoading(false);
        }
    };

    const stats = [
        {
            title: 'Total Orders',
            value: totalOrders.toLocaleString(),
            icon: ShoppingCart,
            change: '+12.5%',
            trend: 'up',
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            title: 'Total Users',
            value: totalUser.length.toLocaleString(),
            icon: Users,
            change: '+8.2%',
            trend: 'up',
            color: 'from-emerald-500 to-emerald-600',
            bgColor: 'bg-emerald-50',
            iconColor: 'text-emerald-600'
        },
        {
            title: 'Subscriptions',
            value: totalSubscription.length.toLocaleString(),
            icon: CreditCard,
            change: '+23.1%',
            trend: 'up',
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600'
        },
        {
            title: 'Active Coupons',
            value: totalCoupon.length.toLocaleString(),
            icon: Tag,
            change: '-3.4%',
            trend: 'down',
            color: 'from-amber-500 to-amber-600',
            bgColor: 'bg-amber-50',
            iconColor: 'text-amber-600'
        }
    ];

    const orderStats = [
        {
            title: 'Pending',
            value: pendingOrders.length,
            icon: Clock,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600',
            percentage: ((pendingOrders.length / totalOrders) * 100).toFixed(1)
        },
        {
            title: 'Approved',
            value: approvedOrders.length,
            icon: CheckCircle,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            percentage: ((approvedOrders.length / totalOrders) * 100).toFixed(1)
        },
        {
            title: 'Rejected',
            value: rejectedOrders.length,
            icon: XCircle,
            color: 'from-red-500 to-red-600',
            bgColor: 'bg-red-50',
            iconColor: 'text-red-600',
            percentage: ((rejectedOrders.length / totalOrders) * 100).toFixed(1)
        }
    ];

    const recentActivity = [
        { action: 'New order received', user: 'John Doe', time: '2 min ago', type: 'order' },
        { action: 'User registered', user: 'Jane Smith', time: '15 min ago', type: 'user' },
        { action: 'Subscription renewed', user: 'Mike Johnson', time: '1 hour ago', type: 'subscription' },
        { action: 'Coupon activated', user: 'Sarah Williams', time: '2 hours ago', type: 'coupon' },
        { action: 'Order approved', user: 'Tom Brown', time: '3 hours ago', type: 'order' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                            Dashboard Overview
                        </h1>
                        <div className="flex items-center gap-2 text-slate-600">
                            <Calendar className="w-4 h-4" />
                            <p className="text-sm md:text-base">{today}</p>
                        </div>
                    </div>
                    <button
                        onClick={loadData}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        <span className="font-medium">Refresh Data</span>
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <Activity className="w-6 h-6 text-blue-600 animate-pulse" />
                        </div>
                    </div>
                </div>
            )}

            {/* Main Stats Grid */}
            {!loading && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={stat.title}
                                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
                                style={{
                                    animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
                                }}
                            >
                                {/* Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                                <div className="relative p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                                            <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                                        </div>
                                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${stat.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                            {stat.trend === 'up' ? (
                                                <ArrowUpRight className="w-4 h-4" />
                                            ) : (
                                                <ArrowDownRight className="w-4 h-4" />
                                            )}
                                            <span className="text-xs font-semibold">{stat.change}</span>
                                        </div>
                                    </div>

                                    <h3 className="text-slate-600 text-sm font-medium mb-2">{stat.title}</h3>
                                    <p className="text-3xl font-bold text-slate-800 group-hover:scale-105 transition-transform duration-300">
                                        {stat.value}
                                    </p>

                                    {/* Animated border */}
                                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-0 group-hover:w-full transition-all duration-700"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {orderStats.map((stat, index) => (
                            <div
                                key={stat.title}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group"
                                style={{
                                    animation: `slideInUp 0.6s ease-out ${0.4 + index * 0.1}s both`
                                }}
                            >
                                <div className="relative p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                                            <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                                        </div>
                                        <MoreVertical className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
                                    </div>

                                    <h3 className="text-slate-600 text-sm font-medium mb-2">{stat.title} Orders</h3>
                                    <div className="flex items-end justify-between">
                                        <p className="text-4xl font-bold text-slate-800">{stat.value.toLocaleString()}</p>
                                        <span className={`text-sm font-semibold ${stat.iconColor}`}>{stat.percentage}%</span>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000`}
                                            style={{ width: mounted ? `${stat.percentage}%` : '0%' }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Activity & Quick Stats */}
                    <div className="grid grid-cols-1  gap-6">
                        {/* Recent Activity */}
                        {/* <div
                            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6"
                            style={{ animation: 'slideInUp 0.6s ease-out 0.7s both' }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-blue-600" />
                                    Recent Activity
                                </h2>
                                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                    View All
                                </button>
                            </div>

                            <div className="space-y-4">
                                {recentActivity.map((activity, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-all duration-300 group cursor-pointer"
                                        style={{ animation: `fadeIn 0.5s ease-out ${0.8 + index * 0.1}s both` }}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'order' ? 'bg-blue-100 text-blue-600' :
                                                activity.type === 'user' ? 'bg-emerald-100 text-emerald-600' :
                                                    activity.type === 'subscription' ? 'bg-purple-100 text-purple-600' :
                                                        'bg-amber-100 text-amber-600'
                                            } group-hover:scale-110 transition-transform duration-300`}>
                                            {activity.type === 'order' && <ShoppingCart className="w-5 h-5" />}
                                            {activity.type === 'user' && <Users className="w-5 h-5" />}
                                            {activity.type === 'subscription' && <CreditCard className="w-5 h-5" />}
                                            {activity.type === 'coupon' && <Tag className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-800 truncate">{activity.action}</p>
                                            <p className="text-xs text-slate-500 truncate">{activity.user}</p>
                                        </div>
                                        <span className="text-xs text-slate-400 whitespace-nowrap">{activity.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div> */}

                        {/* Quick Stats */}
                        <div
                            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white"
                            style={{ animation: 'slideInUp 0.6s ease-out 0.7s both' }}
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <TrendingUp className="w-5 h-5" />
                                <h2 className="text-xl font-bold">Performance</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-blue-100">Order Success Rate</span>
                                        <span className="font-semibold">92.7%</span>
                                    </div>
                                    <div className="h-2 bg-blue-800/30 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white rounded-full transition-all duration-1000"
                                            style={{ width: mounted ? '92.7%' : '0%' }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-blue-100">User Engagement</span>
                                        <span className="font-semibold">85.3%</span>
                                    </div>
                                    <div className="h-2 bg-blue-800/30 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white rounded-full transition-all duration-1000"
                                            style={{ width: mounted ? '85.3%' : '0%' }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-blue-100">Revenue Growth</span>
                                        <span className="font-semibold">78.9%</span>
                                    </div>
                                    <div className="h-2 bg-blue-800/30 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white rounded-full transition-all duration-1000"
                                            style={{ width: mounted ? '78.9%' : '0%' }}
                                        ></div>
                                    </div>
                                </div>

                                {/* <div className="pt-4 mt-4 border-t border-blue-500/30">
                                    <p className="text-sm text-blue-100 mb-2">Total Revenue</p>
                                    <p className="text-3xl font-bold">$127,540</p>
                                    <div className="flex items-center gap-1 mt-2 text-sm">
                                        <ArrowUpRight className="w-4 h-4" />
                                        <span>+15.3% from last month</span>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Animations */}
            <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
        </div>
    );
};

export default AdminDash;