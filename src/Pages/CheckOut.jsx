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
    Smartphone,
    AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import useCouponsData from '@/Admin/Hooks/useCouponsData';

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
    const { couponLoading, couponData } = useCouponsData();
    const navigate = useNavigate();

    const [uiLoading, setUiLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);

    const [setting, setSetting] = useState({});
    const [plan, setPlan] = useState({});

    const [activeMethod, setActiveMethod] = useState('bkash');
    const [senderNumber, setSenderNumber] = useState('');
    const [trxId, setTrxId] = useState('');

    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [finalAmount, setFinalAmount] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [settingRes, planRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_BASE_URL}/settings`),
                    axios.get(`${import.meta.env.VITE_BASE_URL}/subscription`),
                ]);

                const settings = settingRes.data || {};
                setSetting(settings);

                const foundPlan = planRes.data.find((p) => p._id === planId);
                if (foundPlan) {
                    setPlan(foundPlan);
                    setFinalAmount(foundPlan.price || 0);
                }
            } catch (err) {
                console.error(err);
                toast.error('Failed to load plan information');
            } finally {
                setUiLoading(false);
            }
        };

        loadData();
    }, [planId]);

    const handleApplyCoupon = async () => {
        const validCoupons = await couponData;
        if (!couponCode.trim()) {
            toast.error('Please enter a coupon code');
            return;
        }

        const enteredCode = couponCode.trim().toUpperCase();
        const coupon = validCoupons.find(c => c.code === enteredCode);

        if (!coupon) {
            toast.error('Invalid or expired coupon code', { duration: 4000 });
            return;
        }
        if (coupon?.subscriptionName !== plan?.subscriptionName) {
            toast.error('This coupon is not valid for this plan', { duration: 4000 });
            return;
        }

        const discountVal = Math.min(coupon.discount, plan.price || 0);

        setDiscountAmount(discountVal);
        setFinalAmount((plan.price || 0) - discountVal);
        setAppliedCoupon(coupon.code);

        toast.success(`Coupon applied! ৳${discountVal} discount`, {
            icon: <CheckCircle className="text-green-600" />
        });
    };

    const handleCopy = (text, label) => {
        navigator.clipboard.writeText(text)
            .then(() => toast.success(`${label} copied!`))
            .catch(() => toast.error('Failed to copy'));
    };

    const handleOrder = async () => {
        if (!senderNumber.trim() || !trxId.trim()) {
            toast.error(`Please enter your ${activeMethod} number and Transaction ID`);
            return;
        }

        setBtnLoading(true);

        try {
            const orderData = {
                userEmail: user?.email,
                userName: user?.displayName,
                planId: plan?._id,
                planName: plan?.subscriptionName,
                amount: finalAmount,
                originalAmount: plan?.price,
                discountAmount: discountAmount,
                couponCode: appliedCoupon || null,
                validityDays: plan?.validityDays,
                paymentMethod: activeMethod,
                senderNumber: senderNumber,
                transactionId: trxId,
                orderDate: new Date(),
            };

            await axios.post(`${import.meta.env.VITE_BASE_URL}/order`, orderData);

            toast.success('Order placed successfully! 🎉', { duration: 4000 });
            navigate('/order-success');

            setSenderNumber('');
            setTrxId('');
            setCouponCode('');
            setAppliedCoupon(null);
            setDiscountAmount(0);
            setFinalAmount(plan.price || 0);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to place order');
        } finally {
            setBtnLoading(false);
        }
    };

    if (uiLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 px-4">
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
            <div className="min-h-screen flex items-center justify-center text-gray-600 px-4">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-bold mb-4">Plan not found</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
                    >
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    const paymentMethods = [
        { id: 'bkash', name: 'bKash', number: setting?.bkash, icon: Smartphone, color: 'bg-pink-600' },
        { id: 'nagad', name: 'Nagad', number: setting?.nagad, icon: Smartphone, color: 'bg-red-600' },
        { id: 'rocket', name: 'Rocket', number: setting?.rocket, icon: Smartphone, color: 'bg-orange-600' },
        { id: 'upay', name: 'Upay', number: setting?.upay, icon: Smartphone, color: 'bg-teal-600' },
    ].filter(m => m.number && m.number.trim() !== '');

    const activePayment = paymentMethods.find(m => m.id === activeMethod) || paymentMethods[0];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 text-gray-800"
                >
                    Complete Your Subscription
                </motion.h1>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
                >
                    {/* LEFT - Summary Section */}
                    <div className="space-y-5 sm:space-y-6 order-2 lg:order-1">
                        {/* User Info */}
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 p-5 sm:p-6">
                            <div className="flex items-center gap-3 mb-4 sm:mb-5">
                                <div className="p-2.5 sm:p-3 bg-emerald-100 rounded-xl">
                                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Your Information</h3>
                            </div>
                            <div className="space-y-3 text-gray-700 text-sm sm:text-base">
                                <div className="flex items-center gap-3">
                                    <User className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                    <span className="truncate">{user?.displayName || 'Guest'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                    <span className="break-all">{user?.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* Plan Summary */}
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 p-5 sm:p-6">
                            <div className="flex items-center gap-3 mb-4 sm:mb-5">
                                <div className="p-2.5 sm:p-3 bg-amber-100 rounded-xl">
                                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Plan Summary</h3>
                            </div>

                            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                                <div className="flex justify-between font-medium">
                                    <span>{plan.subscriptionName}</span>
                                    <span>৳{plan.price?.toLocaleString() || '0'}</span>
                                </div>

                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Coupon Discount</span>
                                        <span>-৳{discountAmount.toLocaleString()}</span>
                                    </div>
                                )}

                                <div className="pt-3 sm:pt-4 border-t border-gray-200 flex justify-between items-center text-base sm:text-xl font-bold text-emerald-700">
                                    <span>Total to Pay</span>
                                    <span>৳{finalAmount.toLocaleString()}</span>
                                </div>

                                <div className="text-xs sm:text-sm text-gray-600">
                                    Valid for {plan.validityDays} days
                                </div>
                            </div>
                        </div>

                        {/* Coupon */}
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 p-5 sm:p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-indigo-600" />
                                Have a coupon?
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    placeholder="Enter coupon code"
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm sm:text-base"
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    disabled={!couponCode.trim() || appliedCoupon || couponLoading}
                                    className={`w-full sm:w-auto px-6 py-3 rounded-xl font-medium transition-all min-h-[48px]
                    ${appliedCoupon
                                            ? 'bg-green-600 text-white cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'}
                    disabled:opacity-60`}
                                >
                                    {appliedCoupon ? 'Applied' : 'Apply'}
                                </button>
                            </div>
                            {appliedCoupon && (
                                <p className="mt-3 text-sm text-green-700">
                                    Coupon {appliedCoupon} applied • Saved ৳{discountAmount.toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* RIGHT - Payment Section */}
                    <div className="order-1 lg:order-2 lg:sticky lg:top-6 h-fit">
                        <div className="bg-white/85 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/50 p-5 sm:p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-5 sm:mb-6">
                                <div className="p-2.5 sm:p-3 bg-emerald-100 rounded-xl">
                                    <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Payment Details</h3>
                            </div>

                            {/* Payment Methods */}
                            {paymentMethods.length > 0 && (
                                <div className="mb-6 overflow-x-auto pb-2 scrollbar-hide">
                                    <div className="flex gap-2.5 min-w-max">
                                        {paymentMethods.map((method) => (
                                            <button
                                                key={method.id}
                                                onClick={() => {
                                                    setActiveMethod(method.id);
                                                    setSenderNumber('');
                                                }}
                                                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all min-h-[44px]
                          ${activeMethod === method.id
                                                        ? 'bg-indigo-600 text-white shadow-md'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                            >
                                                <method.icon size={18} />
                                                {method.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <p className="text-gray-600 mb-5 sm:mb-6 text-sm sm:text-base leading-relaxed">
                                Send <strong className="text-emerald-700 font-semibold">৳{finalAmount.toLocaleString()}</strong> to the following {activePayment?.name} number.
                            </p>

                            {activePayment?.number && (
                                <div className="bg-emerald-50/70 rounded-xl p-4 sm:p-5 mb-6 border border-emerald-100">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div>
                                            <div className="text-xs text-gray-500 mb-1">Send to ({activePayment.name})</div>
                                            <div className="text-lg sm:text-xl font-bold text-emerald-800 tracking-wide break-all">
                                                {activePayment.number}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleCopy(activePayment.number, `${activePayment.name} number`)}
                                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white rounded-lg shadow-sm hover:shadow-md transition-all w-full sm:w-auto min-h-[44px]"
                                        >
                                            <Copy size={18} className="text-emerald-600" />
                                            <span className="font-medium text-emerald-700">Copy</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-5 sm:space-y-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={senderNumber}
                                        onChange={(e) => setSenderNumber(e.target.value)}
                                        className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/60 backdrop-blur-sm text-sm sm:text-base"
                                        placeholder=" "
                                    />
                                    <label className="absolute left-4 top-2 text-xs text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-emerald-600 transition-all pointer-events-none">
                                        Your {activePayment?.name} Number
                                    </label>
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        value={trxId}
                                        onChange={(e) => setTrxId(e.target.value)}
                                        className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/60 backdrop-blur-sm text-sm sm:text-base"
                                        placeholder=" "
                                    />
                                    <label className="absolute left-4 top-2 text-xs text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-emerald-600 transition-all pointer-events-none">
                                        Transaction ID (TrxID)
                                    </label>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleOrder}
                                disabled={btnLoading}
                                className={`
                  mt-8 w-full py-4 px-6 rounded-xl font-semibold text-white flex items-center justify-center gap-3 shadow-lg min-h-[52px]
                  ${btnLoading
                                        ? 'bg-emerald-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'}
                  transition-all duration-300 text-base sm:text-lg
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

                            <p className="text-center text-xs sm:text-sm text-gray-500 mt-6">
                                Plan will be activated within a few minutes after successful payment verification.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CheckOut;