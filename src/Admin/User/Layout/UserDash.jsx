import React from 'react';
import { ShoppingBag, Package, Clock, Heart } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
        </div>
    </div>
);

const UserDash = () => {
    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome back, Abu!</h1>
                <p className="text-gray-600 mt-1">Here's what's happening with your account</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard icon={ShoppingBag} title="Total Orders" value="2" color="bg-emerald-500" />
                <StatCard icon={Package} title="Pending" value="1" color="bg-amber-500" />
                <StatCard icon={Clock} title="Last Order" value="Jan 12" color="bg-blue-500" />
                <StatCard icon={Heart} title="Complete Orders" value="1" color="bg-rose-500" />
            </div>
            {/* your subscriptions */}
            <div className="p-4 w-full rounded-xl bg-emerald-50 border border-emerald-100 shadow">
                <div className="flex items-center gap-2
                ">

                    <p className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></p>
                    <h2 className="text-lg font-semibold">Your Active Subscriptions</h2>


                </div>
                <div className="min-h-[150px] flex items-center justify-center">
                    <p className="text-rose-700 text-xl md:text-2xl font-semibold">You have no active subscription.</p>
                </div>
            </div>

            {/* Recent Activity / Placeholder sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
                    <p className="text-gray-500 text-sm">No recent orders to show yet.</p>
                    {/* Add real list here later */}
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h2 className="text-lg font-semibold mb-4">Wishlist Highlights</h2>
                    <p className="text-gray-500 text-sm">Items you're saving for later...</p>
                </div>
            </div>
        </div>
    );
};

export default UserDash;