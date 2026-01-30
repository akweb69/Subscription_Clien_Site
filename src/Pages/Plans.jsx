import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Check,
    Sparkles,
    Crown,
    Shield,
    Loader2,
    AlertTriangle,
    ChevronDown,
    Menu,
    BookOpen,
    GraduationCap
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Plans = () => {
    const [selectedSector, setSelectedSector] = useState('All Tools');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [plans, setPlans] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch real data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [subsRes, platsRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_BASE_URL}/subscription`),
                    axios.get(`${import.meta.env.VITE_BASE_URL}/platform`)
                ]);

                const fetchedPlatforms = platsRes.data || [];
                setPlatforms(fetchedPlatforms);

                // Map subscriptions to UI-friendly format
                const mappedPlans = (subsRes.data || []).map((sub) => {
                    // Find platform names by matching _id
                    const planPlatformNames = (sub.selectedPlan || []).map((id) => {
                        const found = fetchedPlatforms.find((p) => p._id === id);
                        return found ? found.platformName : 'Unknown Platform';
                    });

                    return {
                        name: sub.subscriptionName || 'Unnamed Plan',
                        price: Number(sub.price) || 0,
                        discount: Number(sub.discount) || 0,
                        period: 'Per Year', // ← you can make this dynamic later
                        popular: !!sub.isMostPopular,
                        badge: sub.isMostPopular ? 'Most Popular' : null,
                        icon: getIconForPlan(sub.subscriptionName),
                        description: sub.subscriptionDescription || 'Access premium learning content',
                        platforms: planPlatformNames,
                        cta: 'Get Started'
                    };
                });

                // Sort: popular first, then by price ascending
                mappedPlans.sort((a, b) => {
                    if (a.popular && !b.popular) return -1;
                    if (!a.popular && b.popular) return 1;
                    return a.price - b.price;
                });

                setPlans(mappedPlans);
            } catch (err) {
                console.error('Failed to load plans/platforms:', err);
                toast.error('Could not load subscription plans');
                setError('Failed to load plans. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Fallback icon based on plan name
    const getIconForPlan = (name = '') => {
        const lower = name.toLowerCase();
        if (lower.includes('premium') || lower.includes('basic')) return Shield;
        if (lower.includes('advanced') || lower.includes('pro')) return Sparkles;
        if (lower.includes('elite') || lower.includes('ultimate')) return Crown;
        return GraduationCap;
    };

    // Format price in Bangladeshi style with ৳
    const formatPrice = (amount) => {
        return Number(amount).toLocaleString('bn-BD', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    };

    const sectors = [
        'All Tools',
        'Learning Platforms',
        'AI & Tech',
        'Design & Creative',
        'Business & SEO',
        'Productivity'
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
    };

    const featuredPlan = plans.find((p) => p.popular) || plans[0] || null;

    if (loading) {
        return (
            <section className="w-full py-20 bg-gray-50 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Loading premium plans...</p>
                </div>
            </section>
        );
    }

    if (error || plans.length === 0) {
        return (
            <section className="w-full py-20 bg-gray-50">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                        {error || 'No subscription plans available yet'}
                    </h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Please check back later or contact support if this persists.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
                {/* Sector Filter */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-wrap justify-center gap-3 mb-14"
                >
                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="px-6 py-3 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 hover:border-gray-400 shadow-sm transition flex items-center gap-2"
                        >
                            <Menu size={18} />
                            {selectedSector}
                            <ChevronDown
                                size={18}
                                className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </motion.button>

                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden"
                            >
                                {sectors.map((sector) => (
                                    <button
                                        key={sector}
                                        onClick={() => {
                                            setSelectedSector(sector);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-5 py-3 hover:bg-blue-50 transition-colors ${selectedSector === sector ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'
                                            }`}
                                    >
                                        {sector}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.96 }}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition"
                    >
                        <Sparkles size={16} className="inline mr-2" />
                        Learning Platforms
                    </motion.button>
                </motion.div>

                {/* Featured Highlight */}
                {featuredPlan && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-3 mb-4">
                            <Sparkles className="text-amber-500" size={32} />
                            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                                Featured Plan
                            </h2>
                        </div>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            {featuredPlan.description}
                        </p>
                    </motion.div>
                )}

                {/* Pricing Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8"
                >
                    {plans.map((plan, idx) => {
                        const Icon = plan.icon;
                        const isPopular = plan.popular;
                        const finalPrice = plan.discount > 0 ? plan.price - plan.discount : plan.price;

                        return (
                            <motion.div
                                key={plan.name}
                                variants={cardVariants}
                                whileHover={{ y: -12, transition: { duration: 0.3 } }}
                                className={`
                  relative bg-white rounded-2xl border-2 overflow-hidden
                  ${isPopular ? 'border-blue-600 shadow-2xl' : 'border-gray-200 shadow-lg'}
                  transition-all duration-300 hover:shadow-2xl group
                `}
                            >
                                {plan.badge && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-6 py-1.5 rounded-full shadow-md">
                                        {plan.badge}
                                    </div>
                                )}

                                <div className="p-8 pb-10">
                                    <div className="flex items-center gap-4 mb-5">
                                        <div
                                            className={`p-4 rounded-xl ${isPopular ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            <Icon size={32} />
                                        </div>
                                        <h3 className="text-3xl font-bold text-gray-900">{plan.name}</h3>
                                    </div>

                                    <div className="flex items-baseline mb-2">
                                        <span className="text-5xl font-extrabold text-blue-700">
                                            ৳{formatPrice(finalPrice)}
                                        </span>
                                        <span className="text-lg text-gray-500 ml-2 font-medium">
                                            {plan.period}
                                        </span>
                                    </div>

                                    {plan.discount > 0 && (
                                        <div className="text-green-600 text-sm mb-4">
                                            Save ৳{formatPrice(plan.discount)} • Original: ৳{formatPrice(plan.price)}
                                        </div>
                                    )}

                                    <p className="text-gray-600 mb-8 leading-relaxed min-h-[3.5rem]">
                                        {plan.description}
                                    </p>

                                    <ul className="space-y-4 mb-10">
                                        {plan.platforms.map((platName, i) => (
                                            <li key={i} className="flex items-center gap-3 text-gray-700">
                                                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50">
                                                    <BookOpen size={20} className="text-blue-600" />
                                                </div>
                                                <span className="font-medium">{platName}</span>
                                                <Check className="ml-auto text-green-500" size={20} />
                                            </li>
                                        ))}
                                    </ul>

                                    <motion.button
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.96 }}
                                        className={`
                      w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 shadow-md
                      ${isPopular
                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                                                : 'bg-gray-900 text-white hover:bg-gray-800'
                                            }
                    `}
                                    >
                                        {plan.cta}
                                    </motion.button>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.7 }}
                    className="text-center mt-16"
                >
                    <button className="px-10 py-5 bg-gray-900 text-white font-bold text-xl rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl">
                        View All Available Plans →
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default Plans;