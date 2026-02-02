// Plans.jsx
import axios from 'axios';
import {
    Loader,
    CheckCircle2,
    Crown,
    Clock,
    ArrowRight
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.92 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { delay: i * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }
    }),
    hover: {
        y: -12,
        scale: 1.04,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        transition: { duration: 0.4, ease: "easeOut" }
    }
};

const badgeVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
        scale: 1,
        opacity: 1,
        transition: { delay: 0.4, type: "spring", stiffness: 200 }
    }
};

const Plans = () => {
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [allPlans, setAllPlans] = useState([]);
    const [filteredPlans, setFilteredPlans] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [platformMap, setPlatformMap] = useState({});   // ← new: id → name
    const navigate = useNavigate();
    const gotoCheckOut = (planId) => navigate(`/checkout/${planId}`);
    const loadData = async () => {
        try {
            const [categoryRes, planRes, platformRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_BASE_URL}/category`),
                axios.get(`${import.meta.env.VITE_BASE_URL}/subscription`),
                axios.get(`${import.meta.env.VITE_BASE_URL}/platform`)
            ]);

            setAllCategory(categoryRes.data || []);
            const plans = planRes.data || [];
            setAllPlans(plans);
            setFilteredPlans(plans.filter(p => p.category === categoryRes.data[0]._id));
            setSelectedCategory(categoryRes.data[0]._id);

            // Create lookup map
            const map = {};
            (platformRes.data || []).forEach(p => {
                map[p._id] = p.platformName;
            });
            setPlatformMap(map);

        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        console.log(category);
        setFilteredPlans(allPlans.filter(plan => plan.category === category));

    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="w-full py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="w-11/12 mx-auto ">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                        Choose Your Perfect Plan
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Find the subscription that fits your needs — upgrade or switch anytime.
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-4 mb-12">
                    <select
                        value={selectedCategory}
                        onChange={(e) => handleSelectCategory(e.target.value)}
                        className="w-64 px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition "
                    >
                        {allCategory.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    {/* show all catefory in btn  */}
                    <div className="flex gap-3 items-center flex-wrap ">

                        {allCategory.map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => handleSelectCategory(cat._id)}
                                className={`px-4 py-3 rounded-lg text-sm font-medium ${selectedCategory === cat._id
                                    ? "bg-blue-500 text-white shadow"
                                    : "bg-white text-gray-600 shadow"
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <AnimatePresence mode="wait">
                        {filteredPlans.length === 0 ? (
                            <motion.p
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="col-span-full text-center text-xl text-gray-500 py-16"
                            >
                                No plans found in this category.
                            </motion.p>
                        ) : (
                            filteredPlans.map((plan, index) => (
                                <motion.div
                                    key={plan._id}
                                    custom={index}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                    className={`
                                        relative rounded-2xl overflow-hidden border bg-white
                                        ${plan.isMostPopular
                                            ? 'border-blue-500/50 shadow-2xl shadow-blue-200/40'
                                            : 'border-gray-200 shadow-lg'}
                                        transition-shadow duration-300
                                    `}
                                >
                                    {plan.isMostPopular && (
                                        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                                    )}

                                    <div className="p-7 pb-9 flex flex-col h-full">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-2xl font-bold text-gray-900">
                                                {plan.subscriptionName}
                                            </h3>
                                            {plan.isMostPopular && (
                                                <motion.div
                                                    variants={badgeVariants}
                                                    initial="initial"
                                                    animate="animate"
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 rounded-full text-xs font-semibold shadow-sm"
                                                >
                                                    <Crown size={14} />
                                                    <span>Most Popular</span>
                                                </motion.div>
                                            )}
                                        </div>

                                        <p className="text-gray-600 mb-6 min-h-[3rem]">
                                            {plan.subscriptionDescription || "Perfect plan to get started"}
                                        </p>

                                        <div className="mb-6">
                                            <div className="flex items-baseline">
                                                <span className="text-5xl font-extrabold text-gray-900">
                                                    ৳{plan.price}
                                                </span>
                                                <span className="text-xl text-gray-500 ml-1">/{plan.validityDays} Days</span>
                                            </div>



                                            <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                                                <Clock size={14} />
                                                Valid for {plan.validityDays} days
                                            </div>
                                        </div>

                                        <ul className="space-y-3 mb-8 flex-grow">
                                            {plan.selectedPlan?.map((featureId, idx) => (
                                                <li key={idx} className="flex items-center gap-2 text-gray-700">
                                                    <CheckCircle2 size={18} className="text-green-500" />
                                                    <span>{platformMap[featureId] || '—'}</span>
                                                </li>
                                            ))}
                                            {(!plan.selectedPlan || plan.selectedPlan.length === 0) && (
                                                <li className="text-gray-400 italic">No features listed</li>
                                            )}
                                        </ul>

                                        <motion.button
                                            onClick={() => gotoCheckOut(plan._id)}
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.97 }}
                                            className={`
                                                w-full py-4 px-6 rounded-xl font-semibold text-lg
                                                flex items-center justify-center gap-2
                                                transition-all duration-300
                                                ${plan.isMostPopular
                                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40'
                                                    : 'bg-gray-900 text-white hover:bg-gray-800'}
                                            `}
                                        >
                                            Get Started
                                            <ArrowRight size={18} />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Plans;