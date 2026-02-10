import React, { useEffect, useState, useCallback } from 'react';
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
    EyeOff,
    Link as LinkIcon,
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
    const [cookieCredentials, setCookieCredentials] = useState([]);

    const [showPasswords, setShowPasswords] = useState({});
    const [globalPasswordVisible, setGlobalPasswordVisible] = useState(false);

    const [showTutorial, setShowTutorial] = useState(false);
    const [activeTutorialTab, setActiveTutorialTab] = useState(0); // 0 = desktop, 1 = mobile
    const [tutorialVideos, setTutorialVideos] = useState({});

    const [showSection, setShowSection] = useState(0); // 0 = login creds, 1 = cookies
    const [copyingCookieId, setCopyingCookieId] = useState(null);
    const [countdown, setCountdown] = useState(0);

    const baseURL = import.meta.env.VITE_BASE_URL;

    // Copy helper
    const copyToClipboard = async (text, label) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(`${label} copied!`, {
                icon: <CheckCircle2 className="text-green-500" />,
                duration: 2200,
            });
        } catch {
            toast.error('Failed to copy');
        }
    };

    // Fetch only necessary data for this order
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [ordersRes, subsRes, platformsRes, visibilityRes, videosRes, cookiesRes] = await Promise.all([
                    axios.get(`${baseURL}/order`),
                    axios.get(`${baseURL}/subscription`),
                    axios.get(`${baseURL}/platform`),
                    axios.get(`${baseURL}/copy-btn`),
                    axios.get(`${baseURL}/video`),
                    axios.get(`${baseURL}/add_cockies_platform`),
                ]);

                const foundOrder = ordersRes.data.find((o) => o._id === id);
                if (!foundOrder) throw new Error('Order not found');

                const foundSub = subsRes.data.find((s) => s._id === foundOrder.planId);
                if (!foundSub) throw new Error('Subscription plan not found');

                // Filter matched platforms
                const matchedPlatforms = platformsRes.data.filter((p) =>
                    (foundSub.selectedPlan || []).includes(p._id)
                );

                // Filter matched cookie credentials
                const matchedCookies = cookiesRes.data.filter((c) =>
                    (foundSub.selectedCookiePlatforms || []).includes(c._id)
                );

                setOrder(foundOrder);
                setSubscription(foundSub);
                setPlatforms(matchedPlatforms);
                setCookieCredentials(matchedCookies);
                setGlobalPasswordVisible(visibilityRes?.data?.copy_btn_visibility || false);
                setTutorialVideos(videosRes?.data?.[0] || {});
            } catch (err) {
                console.error(err);
                setError(err.message || 'Failed to load plan details');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id, baseURL]);

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) return;

        const timer = setInterval(() => {
            setCountdown((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    const handleCopyCookie = useCallback(
        async (value, cookieId) => {
            if (copyingCookieId) return; // prevent multiple copies

            setCopyingCookieId(cookieId);
            setCountdown(120);

            try {
                await navigator.clipboard.writeText(value);
                toast.success('Cookie value copied!', {
                    icon: <CheckCircle2 className="text-green-500" />,
                });
            } catch {
                toast.error('Failed to copy cookie');
            } finally {
                setTimeout(() => {
                    setCopyingCookieId(null);
                }, 120000);
            }
        },
        [copyingCookieId]
    );

    const togglePassword = (platformId) => {
        setShowPasswords((prev) => ({
            ...prev,
            [platformId]: !prev[platformId],
        }));
    };

    const getYouTubeEmbedUrl = (url) => {
        if (!url) return '';
        const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return match ? `https://www.youtube.com/embed/${match[1]}` : '';
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-5">
                    <Loader2 className="h-14 w-14 animate-spin text-blue-600" />
                    <p className="text-gray-700 font-medium">Loading your subscription details...</p>
                </div>
            </div>
        );
    }

    if (error || !order || !subscription) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-4">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-10 max-w-lg w-full text-center">
                    <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-6" />
                    <h2 className="text-2xl font-bold text-red-800 mb-3">Error</h2>
                    <p className="text-red-700">{error || 'Plan or order not found'}</p>
                </div>
            </div>
        );
    }

    const desktopVideoUrl = getYouTubeEmbedUrl(tutorialVideos?.windowsVideoLink);
    const mobileVideoUrl = getYouTubeEmbedUrl(tutorialVideos?.mobileVideoLink);

    return (
        <div className="min-h-screen bg-gray-50/70 py-8 px-4 sm:px-6 lg:px-8">
            {/* Tab selector */}
            <div className="max-w-3xl mx-auto mb-8">
                <div className="bg-white rounded-xl shadow-sm border p-1.5 grid grid-cols-2 gap-2">
                    <button
                        onClick={() => setShowSection(0)}
                        className={`py-3 rounded-lg font-medium transition-all ${showSection === 0
                            ? 'bg-rose-600 text-white shadow-md'
                            : 'text-slate-600 hover:bg-rose-50'
                            }`}
                    >
                        Login Credentials
                    </button>
                    <button
                        onClick={() => setShowSection(1)}
                        className={`py-3 rounded-lg font-medium transition-all ${showSection === 1
                            ? 'bg-rose-600 text-white shadow-md'
                            : 'text-slate-600 hover:bg-rose-50'
                            }`}
                    >
                        Cookies Credentials
                    </button>
                </div>
            </div>

            {/* ────────────────────────────── */}
            {/*        LOGIN CREDENTIALS       */}
            {/* ────────────────────────────── */}
            {showSection === 0 && (
                <motion.div
                    key="login"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4 }}
                    className="w-full space-y-8"
                >
                    {/* Tutorial toggle & tabs */}
                    {(desktopVideoUrl || mobileVideoUrl) && (
                        <>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowTutorial(!showTutorial)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50 text-sm font-medium"
                                >
                                    {showTutorial ? <EyeOff size={18} /> : <Eye size={18} />}
                                    {showTutorial ? 'Hide Tutorial' : 'Show Tutorial Video'}
                                </button>
                            </div>

                            {showTutorial && (
                                <div className="bg-white rounded-xl shadow-sm border p-4">
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        {desktopVideoUrl && (
                                            <button
                                                onClick={() => setActiveTutorialTab(0)}
                                                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition ${activeTutorialTab === 0
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-gray-100 hover:bg-gray-200'
                                                    }`}
                                            >
                                                Desktop Tutorial
                                            </button>
                                        )}
                                        {mobileVideoUrl && (
                                            <button
                                                onClick={() => setActiveTutorialTab(1)}
                                                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition ${activeTutorialTab === 1
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-gray-100 hover:bg-gray-200'
                                                    }`}
                                            >
                                                Mobile Tutorial
                                            </button>
                                        )}
                                    </div>

                                    <div className="relative pb-[56.25%] h-0 rounded-xl overflow-hidden border shadow-inner">
                                        <iframe
                                            className="absolute inset-0 w-full h-full"
                                            src={activeTutorialTab === 0 ? desktopVideoUrl : mobileVideoUrl}
                                            title="Tutorial Video"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Plan Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl shadow-xl overflow-hidden text-white">
                        <div className="px-6 py-9">
                            <div className="flex items-center gap-4">
                                <ShieldCheck className="h-10 w-10 opacity-90" />
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold">{order.planName || 'Your Plan'}</h1>
                                    <p className="mt-2 opacity-90 text-sm font-mono">Order #{id.slice(-8)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                            <div>
                                <p className="text-sm opacity-80">Duration</p>
                                <p className="text-2xl font-bold">{subscription.validityDays} days</p>
                            </div>
                            <div>
                                <p className="text-sm opacity-80">Purchased</p>
                                <p className="text-xl font-semibold">
                                    {order.orderDate
                                        ? new Date(order.orderDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })
                                        : '—'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm opacity-80">Status</p>
                                <p className="text-xl font-semibold">Active</p>
                            </div>
                        </div>
                    </div>

                    {/* Credentials */}
                    <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
                        <div className="px-6 py-5 border-b bg-gray-50/80">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                                <Globe className="text-indigo-600" />
                                Account Credentials
                            </h2>
                            <p className="text-sm text-gray-600 mt-1.5">
                                Login details for your active platforms
                            </p>
                        </div>

                        {platforms.length === 0 ? (
                            <div className="p-12 text-center text-gray-500 italic">
                                No platform credentials available for this plan.
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {platforms.map((plat) => {
                                    const visible = globalPasswordVisible || showPasswords[plat._id];

                                    return (
                                        <div key={plat._id} className="p-6 hover:bg-gray-50/60 transition-colors">
                                            <div className="flex flex-col gap-5">
                                                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                                                    {plat.platformName}
                                                </h3>

                                                {/* Email */}
                                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border">
                                                    <Mail className="text-gray-500 flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs text-gray-500 uppercase">Email</p>
                                                        <p className="font-medium truncate">{plat.platformEmail || '—'}</p>
                                                    </div>
                                                    {plat.platformEmail && (
                                                        <button
                                                            onClick={() => copyToClipboard(plat.platformEmail, 'Email')}
                                                            className="p-2 hover:bg-gray-200 rounded-lg"
                                                        >
                                                            <Copy size={18} />
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Password */}
                                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border">
                                                    <Key className="text-gray-500 flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs text-gray-500 uppercase">Password</p>
                                                        <p className={`font-mono font-medium ${visible ? '' : 'tracking-widest'}`}>
                                                            {visible ? plat.platformPassword || '—' : '•••••••••••'}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => togglePassword(plat._id)}
                                                            className="p-2 hover:bg-gray-200 rounded-lg"
                                                            title={visible ? 'Hide password' : 'Show password'}
                                                        >
                                                            {visible ? <EyeOff size={18} /> : ""}
                                                        </button>
                                                        {plat.platformPassword && (
                                                            <button
                                                                onClick={() => copyToClipboard(plat.platformPassword, 'Password')}
                                                                className="p-2 hover:bg-gray-200 rounded-lg"
                                                            >
                                                                <Copy size={18} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Link */}
                                                {plat.platformLink && (
                                                    <a
                                                        href={plat.platformLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-2 inline-flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-5 rounded-xl font-medium transition-colors"
                                                    >
                                                        <LinkIcon size={18} />
                                                        Go to {plat.platformName}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {/* ────────────────────────────── */}
            {/*         COOKIES SECTION        */}
            {/* ────────────────────────────── */}
            {showSection === 1 && (
                <motion.div
                    key="cookies"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className=" w-full"
                >
                    <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
                        <div className="px-6 py-6 border-b bg-rose-50/60">
                            <h2 className="text-2xl font-bold text-rose-800 flex items-center gap-3">
                                <Key className="text-rose-600" />
                                Cookies Credentials
                            </h2>
                            <p className="text-sm text-rose-700 mt-2">
                                Use these cookies carefully — each copy starts a cooldown
                            </p>
                        </div>

                        <div className="p-6 space-y-5">
                            {cookieCredentials.length === 0 ? (
                                <div className="text-center py-12 text-gray-500 italic">
                                    No cookie credentials available for this plan.
                                </div>
                            ) : (
                                cookieCredentials.map((cookie) => {
                                    const isCopying = copyingCookieId === cookie._id;
                                    const isOnCooldown = countdown > 0 && isCopying;

                                    return (
                                        <div
                                            key={cookie._id}
                                            className="p-5 bg-gray-50/70 border border-gray-200 rounded-xl hover:border-rose-200 transition-colors"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {cookie.p_name || 'Cookie Slot'}
                                                </h3>
                                                <div className="text-sm font-medium px-3 py-1 bg-rose-100 text-rose-700 rounded-full">
                                                    Slots: {isOnCooldown ? `1/${cookie.p_slot} ` : `${cookie.p_slot || '?'}`}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleCopyCookie(cookie.p_value, cookie._id)}
                                                disabled={isCopying}
                                                className={`w-full py-4 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-2
                          ${isCopying
                                                        ? 'bg-rose-400 cursor-not-allowed'
                                                        : 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'}
                        `}
                                            >
                                                {isCopying ? (
                                                    <>
                                                        <Loader2 size={18} className="animate-spin" />
                                                        Cooldown: {countdown}s
                                                    </>
                                                ) : (
                                                    'Copy Cookie Value'
                                                )}
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default PlanDetails;