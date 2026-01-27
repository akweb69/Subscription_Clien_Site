import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Check,
    Sparkles,
    Users,
    Crown,
    TrendingUp,
    Shield,
    Zap,
    ChevronDown,
    Menu
} from 'lucide-react';

const Plans = () => {
    const [selectedSector, setSelectedSector] = useState('All Tools');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const plans = [
        {
            name: 'Premium',
            price: 19.99,
            period: 'Per Year',
            popular: false,
            badge: null,
            icon: Shield,
            description: 'Subscribe to the world\'s best learning platforms through our most popular package.',
            platforms: [
                { name: 'Udemy Business', color: 'text-purple-600' },
                { name: 'Coursera', color: 'text-blue-600' },
                { name: 'Skillshare', color: 'text-gray-700' },
                { name: 'LinkedIn Learning', color: 'text-green-600' },
                { name: 'Pluralsight', color: 'text-orange-500' },
            ],
            cta: 'Get Started',
        },
        {
            name: 'Advanced',
            price: 39.99,
            period: 'Per Year',
            popular: true,
            badge: 'Most Popular',
            icon: Sparkles,
            description: 'Subscribe to the world\'s best learning platforms through our most popular package.',
            platforms: [
                { name: 'Udemy Business', color: 'text-purple-600' },
                { name: 'Coursera', color: 'text-blue-600' },
                { name: 'Skillshare', color: 'text-gray-700' },
                { name: 'LinkedIn Learning', color: 'text-green-600' },
                { name: 'Pluralsight', color: 'text-orange-500' },
                { name: 'DataCamp', color: 'text-teal-600' },
                { name: 'Codecademy', color: 'text-indigo-600' },
            ],
            cta: 'Get Started',
        },
        {
            name: 'Elite',
            price: 79.99,
            period: 'Per Year',
            popular: false,
            badge: null,
            icon: Crown,
            description: 'Subscribe to the world\'s best learning platforms through our most popular package.',
            platforms: [
                { name: 'Udemy Business', color: 'text-purple-600' },
                { name: 'Coursera', color: 'text-blue-600' },
                { name: 'Skillshare', color: 'text-gray-700' },
                { name: 'LinkedIn Learning', color: 'text-green-600' },
                { name: 'Pluralsight', color: 'text-orange-500' },
                { name: 'DataCamp', color: 'text-teal-600' },
                { name: 'Codecademy', color: 'text-indigo-600' },
                { name: 'MasterClass', color: 'text-red-600' },
            ],
            cta: 'Get Started',
        },
    ];

    const sectors = [
        'All Tools',
        'Learning Tools',
        'AI Tools',
        'SEO Tools',
        'Productivity',
        'Design'
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 50,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <section className="w-full py-16 md:py-24 bg-gray-50 overflow-hidden">
            <div className="max-w-6xl mx-auto px-6">
                {/* Sector Selector */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-wrap justify-center items-center gap-3 mb-12"
                >
                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="px-5 py-2.5 bg-white border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:border-gray-400 transition flex items-center gap-2"
                        >
                            <Menu size={18} />
                            Choose a Sector
                            <ChevronDown size={18} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </motion.button>

                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute top-full left-0 mt-2 w-48 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-10"
                            >
                                {sectors.map((sector) => (
                                    <button
                                        key={sector}
                                        onClick={() => {
                                            setSelectedSector(sector);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 hover:bg-blue-50 transition ${selectedSector === sector ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'
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
                        whileTap={{ scale: 0.95 }}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <Sparkles size={16} />
                        Learning Tools
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 transition flex items-center gap-2"
                    >
                        <Zap size={16} />
                        AI Tools
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 transition flex items-center gap-2"
                    >
                        <TrendingUp size={16} />
                        SEO Tools
                    </motion.button>
                </motion.div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-center mb-12"
                >
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        Featured Plan
                    </motion.h2>
                    <motion.p
                        className="text-lg text-gray-600 max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        Subscribe to the world's best learning platforms through our most popular package.
                    </motion.p>
                </motion.div>

                {/* Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                >
                    {plans.map((plan, planIdx) => (
                        <motion.div
                            key={plan.name}
                            variants={cardVariants}
                            whileHover={{
                                y: -8,
                                transition: { duration: 0.3 }
                            }}
                            className={`relative bg-white rounded-xl border-2 ${plan.popular ? 'border-blue-600' : 'border-gray-200'
                                } overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl`}
                        >
                            {plan.badge && (
                                <motion.div
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: planIdx * 0.2 + 0.5, duration: 0.5 }}
                                    className="absolute top-0 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-b-lg"
                                >
                                    {plan.badge}
                                </motion.div>
                            )}

                            <div className="p-6 text-left">
                                <motion.h3
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: planIdx * 0.2 + 0.4 }}
                                    className="text-2xl font-bold text-gray-900 mb-1"
                                >
                                    {plan.name}
                                </motion.h3>

                                <motion.div
                                    className="flex items-baseline mb-4"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{
                                        delay: planIdx * 0.2 + 0.6,
                                        duration: 0.5,
                                    }}
                                >
                                    <span className="text-3xl font-bold text-blue-600">
                                        ${plan.price}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-1">{plan.period}</span>
                                </motion.div>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: planIdx * 0.2 + 0.5 }}
                                    className="text-sm text-gray-600 mb-6"
                                >
                                    {plan.description}
                                </motion.p>

                                <ul className="space-y-3 mb-6">
                                    {plan.platforms.map((platform, idx) => (
                                        <motion.li
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                delay: planIdx * 0.2 + idx * 0.1 + 0.8,
                                            }}
                                            className="flex items-center justify-between text-sm"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${platform.color} bg-opacity-10`}>
                                                    <span className={`text-xs font-bold ${platform.color}`}>
                                                        {platform.name.charAt(0)}
                                                    </span>
                                                </div>
                                                <span className="text-gray-700">{platform.name}</span>
                                            </div>
                                            <Check className="text-blue-600 flex-shrink-0" size={18} strokeWidth={2.5} />
                                        </motion.li>
                                    ))}
                                </ul>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full py-3 px-6 rounded-lg font-semibold text-base transition-all duration-300 ${plan.popular
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-white border-2 border-gray-800 hover:bg-gray-800 text-gray-800 hover:text-white'
                                        }`}
                                >
                                    {plan.cta}
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Footer CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="text-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-12 py-4 bg-black text-white font-bold text-lg rounded-lg hover:bg-gray-800 transition-all inline-flex items-center gap-2"
                    >
                        View All Plans
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
};

export default Plans;