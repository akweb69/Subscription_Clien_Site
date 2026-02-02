import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Copy,
    Mail,
    Key,
    Loader2,
    AlertCircle,
    ShieldCheck,
    Globe,
    CheckCircle2,
    Eye,
    EyeOff
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
const PlanDetails = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [order, setOrder] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [platforms, setPlatforms] = useState([]);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const [showTutorial, setShowTutorial] = useState(false);
    const [tutorialVideos, setTutorialVideos] = useState({});
    const [showSection, setShowSection] = useState(0)
    const [activeTutorila, setActiveTutorila] = useState(0)

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

                const [ordersRes, subsRes, platformsRes, passwordVisibilityData, loadTutorial] = await Promise.all([
                    axios.get(`${baseURL}/order`),
                    axios.get(`${baseURL}/subscription`),
                    axios.get(`${baseURL}/platform`),
                    axios.get(`${baseURL}/copy-btn`),
                    axios.get(`${baseURL}/video`),
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

                if (passwordVisibilityData.data) {
                    setIsPasswordVisible(passwordVisibilityData?.data?.copy_btn_visibility);
                }

                if (loadTutorial.data) {
                    setTutorialVideos(loadTutorial?.data[0] || {});
                    console.log("sdsd------>", loadTutorial.data[0]);

                }

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
    const getYouTubeEmbedUrl = (url) => {
        if (!url) return "";
        const regExp =
            /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regExp);
        return match ? `https://www.youtube.com/embed/${match[1]}` : "";
    };


    const renderPassword = (platformId, password) => {
        // If global visibility is enabled OR individual password is toggled visible
        const shouldShowPassword = isPasswordVisible || visiblePasswords[platformId];

        if (shouldShowPassword) {
            return password || '—';
        }

        // Show dots if password exists
        return password ? '••••••••••' : '—';
    };

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
            {/* select section btn----- */}
            <div className="w-full md:w-1/2 mx-auto bg-white rounded-xl shadow-sm border p-1 grid grid-cols-2 gap-1">
                <button
                    onClick={() => setShowSection(0)}
                    className={`py-2.5 rounded-lg text-sm md:text-base font-medium transition-all duration-200
            ${showSection === 0
                            ? "bg-rose-500 text-white shadow"
                            : "text-slate-600 hover:bg-rose-50"
                        }`}
                >
                    Login Credentials
                </button>

                <button
                    onClick={() => setShowSection(1)}
                    className={`py-2.5 rounded-lg text-sm md:text-base font-medium transition-all duration-200
            ${showSection === 1
                            ? "bg-rose-500 text-white shadow"
                            : "text-slate-600 hover:bg-rose-50"
                        }`}
                >
                    Cookies Credentials
                </button>
            </div>

            {
                showSection === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 200 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 200 }}
                        transition={{ duration: 0.5 }}

                        className="">
                        <div className="mx-auto">
                            {/* tutorial video show btn */}
                            <div
                                onClick={() => setShowTutorial(!showTutorial)}
                                className="cursor-pointer w-fit flex justify-end bg-white shadow p-2 px-4 mb-4 rounded-lg">

                                {
                                    showTutorial ? <div className="flex gap-2 items-center">
                                        <Eye className="h-5 w-5 " />
                                        Show tutorial video
                                    </div> : <div className="flex gap-2 items-center">
                                        <EyeOff className="h-5 w-5 " />
                                        Hide tutorial video
                                    </div>
                                }
                            </div>

                            {showTutorial && (
                                <div className="w-11/12 mb-4 mx-auto max-w-md grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div
                                        onClick={() => setActiveTutorila(0)}
                                        className={`p-2 w-full cursor-pointer text-center rounded-full transition
                ${activeTutorila === 0
                                                ? "bg-emerald-600 text-white"
                                                : "border bg-white shadow border-emerald-600 text-gray-950"
                                            }`}
                                    >
                                        Show Desktop Tutorial
                                    </div>

                                    <div
                                        onClick={() => setActiveTutorila(1)}
                                        className={`p-2 w-full cursor-pointer text-center rounded-full transition
                ${activeTutorila === 1
                                                ? "bg-emerald-600 text-white"
                                                : "border bg-white shadow border-emerald-600 text-gray-950"
                                            }`}
                                    >
                                        Show Mobile Tutorial
                                    </div>
                                </div>
                            )}

                            {/* tutorial video section youtube video link */}
                            <div className="">
                                {
                                    showTutorial && activeTutorila === 0 && <div className="w-full h-full mb-4">
                                        <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-xl">
                                            <iframe
                                                className="absolute top-0 left-0 w-full h-full"
                                                src={getYouTubeEmbedUrl(tutorialVideos?.windowsVideoLink)}
                                                title="Tutorial Video"
                                                frameBorder="0"
                                                loading="lazy"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>



                                    </div>
                                }
                                {
                                    showTutorial && activeTutorila === 1 && <div className="w-full h-full mb-4">
                                        <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-xl">
                                            <iframe
                                                className="absolute top-0 left-0 w-full h-full"
                                                src={getYouTubeEmbedUrl(tutorialVideos?.mobileVideoLink)}
                                                title="Tutorial Video"
                                                frameBorder="0"
                                                loading="lazy"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>



                                    </div>
                                }
                            </div>
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
                                                                <p className={`font-medium text-gray-900 ${!isPasswordVisible && !visiblePasswords[platform._id] ? 'font-mono tracking-wider' : 'font-mono'}`}>
                                                                    {renderPassword(platform._id, platform.platformPassword)}
                                                                </p>
                                                            </div>



                                                            {/* Copy Button - Always enabled */}
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

                                                        {/* go to link btn */}
                                                        <div className="mt-4 w-full bg-emerald-500 text-center p-3 rounded-lg flex items-center ju-center">
                                                            <Link
                                                                to={platform.platformLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center justify-center w-full md:text-lg  gap-2 text-sm text-white capitalize hover:text-indigo-500 transition-colors"
                                                            >
                                                                <Link className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                                                                <span>Go to {platform.platformName}</span>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )
            }
            {
                showSection === 1 && (
                    <div className="w-full min-h-[300px] mt-10 flex flex-col items-center justify-center bg-white rounded-xl border shadow-sm p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                            <span className="text-2xl">🚧</span>
                        </div>

                        <h2 className="text-xl font-semibold text-slate-800 mb-1">
                            Feature Coming Soon
                        </h2>

                        <p className="text-sm text-slate-500 max-w-sm">
                            We’re working hard to bring this feature to you.
                            Stay tuned — it’ll be available very soon!
                        </p>

                        <span className="mt-4 px-3 py-1 text-xs font-medium rounded-full bg-rose-50 text-rose-600">
                            Under Development
                        </span>
                    </div>

                )
            }
        </div >
    );
};

export default PlanDetails;