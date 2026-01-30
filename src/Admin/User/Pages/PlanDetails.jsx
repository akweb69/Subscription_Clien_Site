import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Copy,
    Mail,
    Key,
    Loader2,
    AlertCircle,
    ShieldCheck,
    Globe,
    CheckCircle2
} from 'lucide-react';
import { toast } from 'react-hot-toast'; // ← install: npm install react-hot-toast

const PlanDetails = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [order, setOrder] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [platforms, setPlatforms] = useState([]);

    const baseURL = import.meta.env.VITE_BASE_URL;

    const copyToClipboard = async (text, label) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(`${label} copied!`, {
                icon: <CheckCircle2 className="text-green-500" />,
                duration: 2000,
            });
        } catch (err) {
            toast.error('Failed to copy', {
                icon: <AlertCircle className="text-red-500" />,
            });
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [ordersRes, subsRes, platformsRes] = await Promise.all([
                    axios.get(`${baseURL}/order`),
                    axios.get(`${baseURL}/subscription`),
                    axios.get(`${baseURL}/platform`),
                ]);

                const foundOrder = ordersRes.data.find((o) => o._id === id);
                if (!foundOrder) {
                    throw new Error('Order not found');
                }

                const foundSub = subsRes.data.find((s) => s._id === foundOrder.planId);
                if (!foundSub) {
                    throw new Error('Subscription plan not found');
                }

                const platformIds = foundSub.selectedPlan || [];
                const matchedPlatforms = platformsRes.data.filter((p) =>
                    platformIds.includes(p._id)
                );

                setOrder(foundOrder);
                setSubscription(foundSub);
                setPlatforms(matchedPlatforms);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Failed to load plan details');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id, baseURL]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                    <p className="text-gray-600 font-medium">Loading your plan details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md w-full text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                    <h2 className="text-xl font-semibold text-red-800 mb-2">Something went wrong</h2>
                    <p className="text-red-700">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className=" mx-auto">
                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-200">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-8 w-8" />
                            <h1 className="text-2xl md:text-3xl font-bold">
                                {order?.planName || 'Your Plan'}
                            </h1>
                        </div>
                        <p className="mt-2 opacity-90">
                            Order ID: <span className="font-mono text-sm">{id}</span>
                        </p>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Plan Duration</h3>
                            <p className="text-lg font-semibold">
                                {subscription?.validityDays || '?'} days
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Purchase Date</h3>
                            <p className="text-lg font-semibold">
                                {order?.orderDate
                                    ? new Date(order.orderDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })
                                    : '—'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Platforms Section */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="px-6 py-5 border-b bg-gray-50">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Globe className="h-5 w-5 text-indigo-600" />
                            Account Credentials
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            These are the login details for your subscribed platforms
                        </p>
                    </div>

                    {platforms.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            No platform accounts found for this plan.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {platforms.map((platform) => (
                                <div
                                    key={platform._id}
                                    className="p-6 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                {platform.platformName || 'Platform'}
                                            </h3>

                                            {/* Email */}
                                            <div className="flex items-center gap-3 mb-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                <Mail className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-500">Email</p>
                                                    <p className="font-medium text-gray-900 truncate">
                                                        {platform.platformEmail || '—'}
                                                    </p>
                                                </div>
                                                {platform.platformEmail && (
                                                    <button
                                                        onClick={() =>
                                                            copyToClipboard(platform.platformEmail, 'Email')
                                                        }
                                                        className="p-2 hover:bg-gray-200 rounded-md transition-colors flex-shrink-0"
                                                        title="Copy email"
                                                    >
                                                        <Copy className="h-5 w-5 text-gray-600" />
                                                    </button>
                                                )}
                                            </div>

                                            {/* Password */}
                                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                <Key className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-500">Password</p>
                                                    <p className="font-medium text-gray-900 font-mono">
                                                        {platform.platformPassword || '—'}
                                                    </p>
                                                </div>
                                                {platform.platformPassword && (
                                                    <button
                                                        onClick={() =>
                                                            copyToClipboard(platform.platformPassword, 'Password')
                                                        }
                                                        className="p-2 hover:bg-gray-200 rounded-md transition-colors flex-shrink-0"
                                                        title="Copy password"
                                                    >
                                                        <Copy className="h-5 w-5 text-gray-600" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>


        </div>
    );
};

export default PlanDetails;