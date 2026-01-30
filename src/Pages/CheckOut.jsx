import { AppContext } from '@/context/AppContext';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Mail,
    Wallet,
    Copy,
    CreditCard,
    CheckCircle,
    Loader2,
    ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const CheckOut = () => {
    const { planId } = useParams();
    const { user } = useContext(AppContext);
    const navigate = useNavigate();

    const [uiLoading, setUiLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);

    const [setting, setSetting] = useState({});
    const [plan, setPlan] = useState({});
    const [bkashNumber, setBkashNumber] = useState('');
    const [trxId, setTrxId] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [settingRes, planRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_BASE_URL}/settings`),
                    axios.get(`${import.meta.env.VITE_BASE_URL}/subscription`),
                ]);

                setSetting(settingRes.data || {});
                const foundPlan = planRes.data.find((p) => p._id === planId);
                setPlan(foundPlan || {});
            } catch (err) {
                console.error(err);
                toast.error('Failed to load plan information');
            } finally {
                setUiLoading(false);
            }
        };

        loadData();
    }, [planId]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(setting?.bkash || '');
            toast.success('Bkash number copied!', {
                icon: '📋',
                duration: 2000,
            });
        } catch {
            toast.error('Failed to copy');
        }
    };

    const handleOrder = async () => {
        if (!bkashNumber.trim() || !trxId.trim()) {
            toast.error('Please fill in Bkash number and Transaction ID');
            return;
        }

        setBtnLoading(true);

        try {
            const order = {
                userEmail: user?.email,
                userName: user?.displayName,
                planId: plan?._id,
                planName: plan?.subscriptionName,
                amount: plan?.price,
                validityDays: plan?.validityDays,
                paymentMethod: 'bkash',
                senderNumber: bkashNumber,
                transactionId: trxId,
                orderDate: new Date(),
            };

            await axios.post(`${import.meta.env.VITE_BASE_URL}/order`, order);

            toast.success('Order placed successfully! 🎉', { duration: 4000 });
            navigate('/order-success');
            setBkashNumber('');
            setTrxId('');
        } catch (err) {
            console.error(err);
            toast.error('Failed to place order. Please try again.');
        } finally {
            setBtnLoading(false);
        }
    };

    if (uiLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="p-6 rounded-full bg-white/70 backdrop-blur-sm shadow-xl"
                >
                    <Loader2 className="w-12 h-12 text-emerald-600" />
                </motion.div>
            </div>
        );
    }

    if (!plan?._id) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Plan not found</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-emerald-600 hover:underline"
                    >
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800"
                >
                    Complete Your Subscription
                </motion.h1>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-2 gap-6 md:gap-8"
                >
                    {/* LEFT - Order Summary */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        {/* User Card */}
                        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 p-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-3 bg-emerald-100 rounded-xl">
                                    <User className="w-6 h-6 text-emerald-700" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">Your Info</h3>
                            </div>

                            <div className="space-y-3 text-gray-700">
                                <div className="flex items-center gap-3">
                                    <User className="w-5 h-5 text-gray-500" />
                                    <span>{user?.displayName || 'Guest'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-gray-500" />
                                    <span className="break-all">{user?.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* Plan Card */}
                        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 p-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-3 bg-amber-100 rounded-xl">
                                    <CreditCard className="w-6 h-6 text-amber-700" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">Plan Details</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-lg font-medium">
                                    <span>{plan.subscriptionName}</span>
                                    <span>৳{plan.price + plan.discount}</span>
                                </div>

                                {plan.discount > 0 && (
                                    <div className="flex justify-between text-sm text-red-600">
                                        <span>Discount</span>
                                        <span>-৳{plan.discount}</span>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-gray-200 flex justify-between items-center text-xl font-bold text-emerald-700">
                                    <span>Total</span>
                                    <span>৳{plan.price}</span>
                                </div>

                                <div className="text-sm text-gray-600">
                                    Valid for {plan.validityDays} days
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT - Payment Section */}
                    <motion.div variants={itemVariants}>
                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/50 p-6 md:p-8 sticky top-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-emerald-100 rounded-xl">
                                    <Wallet className="w-6 h-6 text-emerald-700" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">Payment via bKash</h3>
                            </div>

                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Please send{' '}
                                <span className="font-bold text-emerald-700">৳{plan.price}</span> to the
                                following bKash number. Use your name as reference.
                            </p>

                            {/* Bkash Number Display */}
                            <div className="bg-emerald-50/70 rounded-xl p-5 mb-6 border border-emerald-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Send to</div>
                                        <div className="text-xl font-bold text-emerald-800 tracking-wide">
                                            {setting?.bkash || '01XXXXXXXXX'}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md active:scale-95 transition-all"
                                    >
                                        <Copy size={18} className="text-emerald-600" />
                                        <span className="text-sm font-medium text-emerald-700">Copy</span>
                                    </button>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-5">
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="sender"
                                        value={bkashNumber}
                                        onChange={(e) => setBkashNumber(e.target.value)}
                                        className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/60 backdrop-blur-sm"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="sender"
                                        className="absolute left-4 top-2 text-xs text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-emerald-600 transition-all pointer-events-none"
                                    >
                                        Your bKash Number
                                    </label>
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        id="trxid"
                                        value={trxId}
                                        onChange={(e) => setTrxId(e.target.value)}
                                        className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/60 backdrop-blur-sm"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="trxid"
                                        className="absolute left-4 top-2 text-xs text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-emerald-600 transition-all pointer-events-none"
                                    >
                                        Transaction ID (TrxID)
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleOrder}
                                disabled={btnLoading}
                                className={`
                  mt-8 w-full py-4 px-6 rounded-xl font-semibold text-white flex items-center justify-center gap-3 shadow-lg
                  ${btnLoading
                                        ? 'bg-emerald-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                                    }
                  transition-all duration-300
                `}
                            >
                                {btnLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Confirm & Activate Plan
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </motion.button>

                            <p className="text-center text-xs text-gray-500 mt-6">
                                After successful payment, your plan will be activated within few minutes.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default CheckOut;