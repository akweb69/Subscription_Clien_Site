import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import { TrendingUp, DollarSign, Tag, ShoppingCart, Users, Percent, Filter, X, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import useCouponsData from '../Hooks/useCouponsData';

const CouponSells = () => {
    const base_url = import.meta.env.VITE_BASE_URL;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const { couponLoading, couponData } = useCouponsData();
    const [selectedCoupon, setSelectedCoupon] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    // load data
    const loadData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${base_url}/order`);
            const filterData = res.data.filter((item) => item.couponCode);
            setData(filterData);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Filter data based on selected coupon and status
    const filteredData = useMemo(() => {
        let result = data;

        if (selectedCoupon !== 'all') {
            result = result.filter(item => item.couponCode === selectedCoupon);
        }

        if (selectedStatus !== 'all') {
            result = result.filter(item => item.status === selectedStatus);
        }

        return result;
    }, [data, selectedCoupon, selectedStatus]);

    // Get unique coupon codes from orders
    const uniqueCouponCodes = useMemo(() => {
        return [...new Set(data.map(item => item.couponCode))].sort();
    }, [data]);

    // Get unique statuses
    const uniqueStatuses = useMemo(() => {
        return [...new Set(data.map(item => item.status))].sort();
    }, [data]);

    // Calculate statistics based on filtered data
    const stats = useMemo(() => {
        const totalOrders = filteredData.length;
        const totalRevenue = filteredData.reduce((sum, item) => sum + (item.amount || 0), 0);
        const totalDiscount = filteredData.reduce((sum, item) => sum + (item.discountAmount || 0), 0);
        const uniqueUsers = new Set(filteredData.map(item => item.userEmail)).size;
        const uniqueCoupons = new Set(filteredData.map(item => item.couponCode)).size;
        const avgDiscount = totalOrders > 0 ? (totalDiscount / totalOrders) : 0;
        const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;
        const discountPercentage = totalRevenue > 0 ? ((totalDiscount / (totalRevenue + totalDiscount)) * 100) : 0;

        // Most used coupon
        const couponCount = filteredData.reduce((acc, item) => {
            acc[item.couponCode] = (acc[item.couponCode] || 0) + 1;
            return acc;
        }, {});
        const mostUsedCoupon = Object.entries(couponCount).sort((a, b) => b[1] - a[1])[0];

        return {
            totalOrders,
            totalRevenue,
            totalDiscount,
            uniqueUsers,
            uniqueCoupons,
            avgDiscount,
            avgOrderValue,
            discountPercentage,
            mostUsedCoupon: mostUsedCoupon ? { code: mostUsedCoupon[0], count: mostUsedCoupon[1] } : null
        };
    }, [filteredData]);

    // Calculate status-based statistics
    const statusStats = useMemo(() => {
        const statsByStatus = {};

        uniqueStatuses.forEach(status => {
            const statusOrders = filteredData.filter(item => item.status === status);
            const count = statusOrders.length;
            const revenue = statusOrders.reduce((sum, item) => sum + (item.amount || 0), 0);
            const discount = statusOrders.reduce((sum, item) => sum + (item.discountAmount || 0), 0);
            const percentage = filteredData.length > 0 ? ((count / filteredData.length) * 100) : 0;

            statsByStatus[status] = {
                count,
                revenue,
                discount,
                percentage
            };
        });

        return statsByStatus;
    }, [filteredData, uniqueStatuses]);

    // Get coupon details from couponData
    const getCouponDetails = (code) => {
        return couponData?.find(c => c.code === code);
    };

    const handleClearFilters = () => {
        setSelectedCoupon('all');
        setSelectedStatus('all');
    };

    const StatCard = ({ icon: Icon, title, value, subtitle, color = "green" }) => (
        <div className={`bg-white rounded-xl shadow-sm p-6 border-l-4 border-${color}-500 hover:shadow-md transition-shadow`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
                    {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
                </div>
                <div className={`p-3 bg-${color}-100 rounded-lg`}>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
            </div>
        </div>
    );

    const StatusStatCard = ({ status, data, icon: Icon, color }) => {
        const statusData = data[status] || { count: 0, revenue: 0, discount: 0, percentage: 0 };

        return (
            <div className={`bg-white rounded-xl shadow-sm p-6 border-t-4 border-${color}-500 hover:shadow-lg transition-all`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className={`p-2 bg-${color}-100 rounded-lg`}>
                            <Icon className={`w-5 h-5 text-${color}-600`} />
                        </div>
                        <h4 className="font-semibold text-gray-800 capitalize">{status}</h4>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${color}-100 text-${color}-700`}>
                        {statusData.percentage.toFixed(1)}%
                    </span>
                </div>

                <div className="space-y-3">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Orders</p>
                        <p className="text-2xl font-bold text-gray-900">{statusData.count}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Revenue</p>
                            <p className="text-sm font-semibold text-gray-900">৳{statusData.revenue.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Discount</p>
                            <p className="text-sm font-semibold text-orange-600">৳{statusData.discount.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return CheckCircle;
            case 'pending':
                return Clock;
            case 'failed':
                return XCircle;
            case 'cancelled':
                return XCircle;
            default:
                return AlertCircle;
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'green';
            case 'pending':
                return 'yellow';
            case 'failed':
                return 'red';
            case 'cancelled':
                return 'gray';
            default:
                return 'blue';
        }
    };

    const activeFilters = selectedCoupon !== 'all' || selectedStatus !== 'all';

    return (
        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Coupon Sales Dashboard
                </h2>
                <p className="text-gray-600">Track and analyze coupon-based orders</p>
            </div>

            {loading || couponLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
            ) : data.length === 0 ? (
                <div className="bg-white rounded-lg p-12 text-center">
                    <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No orders with coupons found.</p>
                </div>
            ) : (
                <>
                    {/* Filters Section */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Filter className="w-5 h-5 text-gray-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                            {activeFilters && (
                                <button
                                    onClick={handleClearFilters}
                                    className="ml-auto flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    Clear Filters
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Coupon Code Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Coupon Code
                                </label>
                                <select
                                    value={selectedCoupon}
                                    onChange={(e) => setSelectedCoupon(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="all">All Coupons ({data.length})</option>
                                    {uniqueCouponCodes.map(code => {
                                        const count = data.filter(item => item.couponCode === code).length;
                                        const couponDetails = getCouponDetails(code);
                                        return (
                                            <option key={code} value={code}>
                                                {code} ({count}) {couponDetails ? `- ${couponDetails.discount}% off` : ''}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Order Status
                                </label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="all">All Statuses</option>
                                    {uniqueStatuses.map(status => {
                                        const count = data.filter(item => item.status === status).length;
                                        return (
                                            <option key={status} value={status}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            {/* Selected Coupon Details */}
                            {selectedCoupon !== 'all' && (
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Selected Coupon Details</p>
                                    {getCouponDetails(selectedCoupon) ? (
                                        <div className="text-sm text-gray-600">
                                            <p className="font-semibold text-green-700">{selectedCoupon}</p>
                                            <p>Discount: {getCouponDetails(selectedCoupon).discount}%</p>
                                            <p className="text-xs">Plan: {getCouponDetails(selectedCoupon).subscriptionName}</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">Coupon details not available</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Active Filter Tags */}
                        {activeFilters && (
                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                                <span className="text-sm text-gray-600">Active filters:</span>
                                {selectedCoupon !== 'all' && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                        Code: {selectedCoupon}
                                        <button
                                            onClick={() => setSelectedCoupon('all')}
                                            className="hover:bg-green-200 rounded-full p-0.5"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                )}
                                {selectedStatus !== 'all' && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                        Status: {selectedStatus}
                                        <button
                                            onClick={() => setSelectedStatus('all')}
                                            className="hover:bg-blue-200 rounded-full p-0.5"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Main Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <StatCard
                            icon={ShoppingCart}
                            title="Total Orders"
                            value={stats.totalOrders}
                            subtitle="with coupons applied"
                            color="blue"
                        />
                        <StatCard
                            icon={DollarSign}
                            title="Total Revenue"
                            value={`৳${stats.totalRevenue.toLocaleString()}`}
                            subtitle={`Avg: ৳${stats.avgOrderValue.toFixed(0)}`}
                            color="green"
                        />
                        <StatCard
                            icon={Tag}
                            title="Total Discount"
                            value={`৳${stats.totalDiscount.toLocaleString()}`}
                            subtitle={`Avg: ৳${stats.avgDiscount.toFixed(0)}`}
                            color="orange"
                        />
                        <StatCard
                            icon={Percent}
                            title="Discount Rate"
                            value={`${stats.discountPercentage.toFixed(1)}%`}
                            subtitle="of original price"
                            color="purple"
                        />
                    </div>

                    {/* Status-Based Stats Section */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-gray-600" />
                            Orders by Status
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {uniqueStatuses.map(status => (
                                <StatusStatCard
                                    key={status}
                                    status={status}
                                    data={statusStats}
                                    icon={getStatusIcon(status)}
                                    color={getStatusColor(status)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Secondary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <StatCard
                            icon={Users}
                            title="Unique Customers"
                            value={stats.uniqueUsers}
                            subtitle="using coupons"
                            color="indigo"
                        />
                        <StatCard
                            icon={Tag}
                            title="Unique Coupons"
                            value={stats.uniqueCoupons}
                            subtitle="codes used"
                            color="pink"
                        />
                        <StatCard
                            icon={TrendingUp}
                            title="Top Coupon"
                            value={stats.mostUsedCoupon?.code || 'N/A'}
                            subtitle={stats.mostUsedCoupon ? `Used ${stats.mostUsedCoupon.count} times` : ''}
                            color="teal"
                        />
                    </div>

                    {/* Orders Table */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">Order Details</h3>
                            <span className="text-sm text-green-50">
                                Showing {filteredData.length} of {data.length} orders
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Plan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Coupon
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Discount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredData.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                                No orders match the selected filters
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredData.map((item) => (
                                            <tr
                                                key={item._id.$oid}
                                                className="hover:bg-green-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{item.userName}</div>
                                                    <div className="text-sm text-gray-500">{item.userEmail}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{item.planName}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-gray-900">৳{item.amount}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        {item.couponCode}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-orange-600">-৳{item.discountAmount}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(item.orderDate).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CouponSells;