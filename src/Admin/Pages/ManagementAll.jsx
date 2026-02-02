import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ListPlus,
    Settings,
    Sparkles,
    Zap,
    TrendingUp,
    Layers,
    ChevronRight,
    Star,
    Video
} from 'lucide-react';
import AddNewPlatform from '../Component/AddNewPlatform';
import ManagePlatform from '../Component/ManagePlatform';
import AddNewSubscription from './AddNewSubscription';
import ManageSubscription from './ManageSubscription';
import ManageSubs_Category from './ManageSubs_Category';
import EditCategory from './EditCategory';
import AddNewCoupon from '../Component/AddNewCoupon';
import ManageCoupons from '../Component/ManageCoupons';
import CradentialVideo from '../Component/CradentialVideo';
import CockeisVideo from '../Component/CockeisVideo';
import ManageCredentialVideo from '../Component/ManageCredantialVideo';
import ManageCookiesVideo from '../Component/ManageCockiesVideo';
import AddCockies from '../Component/AddCockies';
import ManageCockies from '../Component/ManageCockies';



const ManagementAll = () => {
    const allTabs = [
        {
            name: "Add Login Credentials ",
            icon: ListPlus,
            gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
            bgGradient: "from-violet-50 to-purple-50",
            shadow: "shadow-violet-200",
            accentColor: "violet"
        },
        {
            name: "Manage Login Credentials ",
            icon: Settings,
            gradient: "from-blue-500 via-cyan-500 to-teal-500",
            bgGradient: "from-blue-50 to-cyan-50",
            shadow: "shadow-blue-200",
            accentColor: "blue"
        },
        {
            name: "Add Cockies ",
            icon: ListPlus,
            gradient: "from-green-500 via-emerald-500 to-rose-500",
            bgGradient: "from-green-50 to-rose-50",
            shadow: "shadow-green-200",
            accentColor: "green"
        },
        {
            name: "Manage Cockies ",
            icon: Settings,
            gradient: "from-rose-500 via-cyan-500 to-teal-500",
            bgGradient: "from-blue-50 to-cyan-50",
            shadow: "shadow-blue-200",
            accentColor: "blue"
        },
        {
            name: "Add New Subscription",
            icon: ListPlus,
            gradient: "from-pink-500 via-rose-500 to-red-500",
            bgGradient: "from-pink-50 to-rose-50",
            shadow: "shadow-pink-200",
            accentColor: "pink"
        },
        {
            name: "Manage Subscription",
            icon: Settings,
            gradient: "from-amber-500 via-orange-500 to-red-500",
            bgGradient: "from-amber-50 to-orange-50",
            shadow: "shadow-amber-200",
            accentColor: "amber"
        },
        {
            name: "Add New Category",
            icon: ListPlus,
            gradient: "from-emerald-500 via-teal-500 to-cyan-500",
            bgGradient: "from-emerald-50 to-teal-50",
            shadow: "shadow-emerald-200",
            accentColor: "emerald"
        },
        {
            name: "Manage Category",
            icon: Settings,
            gradient: "from-indigo-500 via-blue-500 to-cyan-500",
            bgGradient: "from-indigo-50 to-blue-50",
            shadow: "shadow-indigo-200",
            accentColor: "indigo"
        },
        {
            name: "Add New Coupon",
            icon: ListPlus,
            gradient: "from-emerald-500 via-teal-500 to-cyan-500",
            bgGradient: "from-emerald-50 to-teal-50",
            shadow: "shadow-emerald-200",
            accentColor: "emerald"
        },
        {
            name: "Manage Coupon",
            icon: Settings,
            gradient: "from-indigo-500 via-blue-500 to-cyan-500",
            bgGradient: "from-indigo-50 to-blue-50",
            shadow: "shadow-indigo-200",
            accentColor: "indigo"
        },
        {
            name: "Cradential Video",
            icon: Video,
            gradient: "from-blue-500 via-cyan-500 to-teal-500",
            bgGradient: "from-blue-50 to-cyan-50",
            shadow: "shadow-emerald-200",
            accentColor: "emerald"
        },
        {
            name: "Manage Cradential Video",
            icon: Video,
            gradient: "from-blue-500 via-cyan-500 to-teal-500",
            bgGradient: "from-blue-50 to-cyan-50",
            shadow: "shadow-emerald-200",
            accentColor: "emerald"
        },
        {
            name: " Cockies Video",
            icon: Video,
            gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
            bgGradient: "from-violet-50 to-purple-50",
            shadow: "shadow-indigo-200",
            accentColor: "indigo"
        },
        {
            name: "Manage Cockies Video",
            icon: Video,
            gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
            bgGradient: "from-violet-50 to-purple-50",
            shadow: "shadow-indigo-200",
            accentColor: "indigo"
        },
    ];

    const [activeTab, setActiveTab] = useState(0);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.15
            }
        }
    };

    const headerVariants = {
        hidden: { opacity: 0, y: -30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const tabVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }
        },
        hover: {
            y: -8,
            scale: 1.05,
            transition: {
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1]
            }
        },
        tap: {
            scale: 0.95,
            transition: {
                duration: 0.1
            }
        }
    };

    const contentVariants = {
        hidden: {
            opacity: 0,
            x: -30,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }
        },
        exit: {
            opacity: 0,
            x: 30,
            scale: 0.95,
            transition: {
                duration: 0.3
            }
        }
    };

    const floatingVariants = {
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const pulseVariants = {
        animate: {
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.8, 0.5],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    variants={floatingVariants}
                    animate="animate"
                    className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-violet-200/30 to-fuchsia-200/30 rounded-full blur-3xl"
                />
                <motion.div
                    variants={floatingVariants}
                    animate="animate"
                    style={{ animationDelay: '1s' }}
                    className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl"
                />
                <motion.div
                    variants={floatingVariants}
                    animate="animate"
                    style={{ animationDelay: '2s' }}
                    className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-full blur-3xl"
                />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <motion.div
                    variants={headerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mb-8 sm:mb-12"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <motion.div
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-300/50">
                                <Layers className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                            </div>
                            <motion.div
                                variants={pulseVariants}
                                animate="animate"
                                className="absolute inset-0 bg-gradient-to-br from-violet-500 to-pink-500 rounded-2xl sm:rounded-3xl -z-10"
                            />
                        </motion.div>

                        <div className="flex-1">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="flex items-center gap-2 mb-2"
                            >
                                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-violet-500" />
                                <span className="text-xs sm:text-sm font-semibold text-violet-600 uppercase tracking-wider">
                                    Management Dashboard
                                </span>
                            </motion.div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                                Manage Your Subscriptions & Platforms
                            </h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-slate-600 mt-2 text-sm sm:text-base"
                            >
                                Control everything from one powerful dashboard
                            </motion.p>
                        </div>
                    </div>


                </motion.div>

                {/* Tab Sections */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3  mb-8"
                >
                    {allTabs.map((tab, index) => {
                        const isActive = activeTab === index;
                        const Icon = tab.icon;

                        return (
                            <motion.div
                                key={index}
                                variants={tabVariants}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={() => setActiveTab(index)}
                                className={`relative cursor-pointer rounded-2xl overflow-hidden group ${isActive ? 'ring-4 ring-offset-2' : ''
                                    }`}
                                style={{
                                    ringColor: isActive ? `var(--${tab.accentColor}-400)` : 'transparent'
                                }}
                            >
                                {/* Card Background */}
                                <div className={`relative h-full bg-gradient-to-br ${isActive
                                    ? tab.gradient
                                    : 'from-white to-slate-50'
                                    } p-2  transition-all duration-500 border-2 ${isActive
                                        ? 'border-white/40'
                                        : 'border-slate-200'
                                    } shadow-lg hover:shadow-2xl`}>

                                    {/* Shine Effect */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                        initial={false}
                                        animate={isActive ? {
                                            x: ['-100%', '100%'],
                                            transition: { duration: 1.5, repeat: Infinity, repeatDelay: 3 }
                                        } : {}}
                                    />

                                    {/* Content */}
                                    <div className="relative z-10 flex flex-col items-center justify-center gap-3 text-center">
                                        {/* Icon Container */}
                                        <motion.div
                                            animate={isActive ? {
                                                rotate: [0, 10, -10, 0],
                                                scale: [1, 1.1, 1.1, 1]
                                            } : {}}
                                            transition={{ duration: 0.5 }}
                                            className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${isActive
                                                ? 'bg-white/25 backdrop-blur-sm'
                                                : `bg-gradient-to-br ${tab.gradient}`
                                                } shadow-lg`}
                                        >
                                            <Icon
                                                className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-white' : 'text-white'
                                                    }`}
                                            />

                                            {/* Active Indicator */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeIndicator"
                                                    className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full shadow-lg"
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                >
                                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-teal-500" />
                                                </motion.div>
                                            )}
                                        </motion.div>

                                        {/* Text */}
                                        <p className={`text-xs font-bold leading-tight transition-colors duration-300 ${isActive
                                            ? 'text-white drop-shadow-lg'
                                            : 'text-slate-700'
                                            }`}>
                                            {tab.name}
                                        </p>


                                    </div>

                                    {/* Decorative Corner */}
                                    {isActive && (
                                        <motion.div
                                            initial={{ scale: 0, rotate: -45 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            className="absolute top-2 right-2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg"
                                        />
                                    )}
                                </div>

                                {/* Glow Effect */}
                                {isActive && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={`absolute -inset-1 bg-gradient-to-br ${tab.gradient} rounded-2xl blur-xl opacity-50 -z-10`}
                                    />
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Content Section */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative"
                    >
                        {/* Content Container with Glass Effect */}
                        <div className="bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-4 sm:p-6 lg:p-8 overflow-hidden">
                            {/* Decorative Header Bar */}
                            <div className={`h-2 rounded-full bg-gradient-to-r ${allTabs[activeTab].gradient} mb-6`} />

                            {/* Content Area */}
                            <div className="relative z-10">
                                {activeTab === 0 && <AddNewPlatform />}
                                {activeTab === 1 && <ManagePlatform />}
                                {activeTab === 2 && <AddCockies />}
                                {activeTab === 3 && <ManageCockies />}
                                {activeTab === 4 && <AddNewSubscription />}
                                {activeTab === 5 && <ManageSubscription />}
                                {activeTab === 6 && <ManageSubs_Category />}
                                {activeTab === 7 && <EditCategory />}
                                {activeTab === 8 && <AddNewCoupon />}
                                {activeTab === 9 && <ManageCoupons />}
                                {activeTab === 10 && <CradentialVideo />}
                                {activeTab === 11 && <ManageCredentialVideo />}
                                {activeTab === 12 && <CockeisVideo />}
                                {activeTab === 13 && <ManageCookiesVideo />}
                            </div>

                            {/* Decorative Background Pattern */}
                            <div className="absolute inset-0 opacity-5 pointer-events-none">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                                    backgroundSize: '32px 32px'
                                }} />
                            </div>
                        </div>

                        {/* Bottom Glow */}
                        <div className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-gradient-to-r ${allTabs[activeTab].gradient} rounded-full blur-2xl opacity-30`} />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Floating Action Indicator */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="fixed bottom-8 right-8 z-50 hidden lg:block"
            >
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full p-4 shadow-2xl shadow-violet-300/50 cursor-pointer hover:scale-110 transition-transform"
                >
                    <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ManagementAll;