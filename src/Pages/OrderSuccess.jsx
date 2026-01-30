import React from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle,
    ArrowRight,
    Home,
    Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50/70 to-white flex items-center justify-center p-4 sm:p-6 md:p-8">
            {/* Subtle animated background particles (optional) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -left-10 top-20 w-24 h-24 bg-emerald-200/20 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute right-10 bottom-20 w-32 h-32 bg-teal-200/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className={`
          relative bg-white/90 backdrop-blur-sm 
          rounded-2xl sm:rounded-3xl 
          shadow-xl sm:shadow-2xl 
          p-6 sm:p-8 md:p-10 
          w-full max-w-md sm:max-w-lg md:max-w-xl 
          text-center border border-emerald-100/60
        `}
            >
                {/* Success Icon with float animation */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: 'spring',
                        stiffness: 180,
                        damping: 12,
                        delay: 0.2,
                    }}
                    className="relative inline-block mb-6 sm:mb-8"
                >
                    <div className="bg-emerald-100/80 rounded-full p-5 sm:p-6 md:p-8 mx-auto">
                        <CheckCircle
                            className="text-emerald-600 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20"
                        />
                    </div>

                    {/* Small sparkle effect */}
                    <motion.div
                        className="absolute -top-2 -right-2 text-yellow-400"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    >
                        <Sparkles size={28} className="opacity-70" />
                    </motion.div>
                </motion.div>

                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4"
                >
                    Order Placed Successfully!
                </motion.h2>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65, duration: 0.6 }}
                    className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10 leading-relaxed max-w-md mx-auto px-2"
                >
                    Thank you for your order! <br className="sm:hidden" />
                    Your payment is under review. <br />
                    We'll activate your subscription shortly after verification.
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center"
                >
                    <button
                        onClick={() => navigate('/dashboard')}
                        className={`
              w-full sm:w-auto min-w-[220px]
              bg-gradient-to-r from-emerald-600 to-emerald-700 
              hover:from-emerald-700 hover:to-emerald-800
              text-white font-medium
              py-3 px-6 rounded-xl
              flex items-center justify-center gap-2
              shadow-md hover:shadow-lg
              transition-all duration-300 active:scale-97
            `}
                    >
                        Go to Dashboard
                        <ArrowRight size={18} />
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className={`
              w-full sm:w-auto min-w-[220px]
              border border-gray-300 
              hover:bg-gray-50 hover:border-gray-400
              text-gray-700 font-medium
              py-3 px-6 rounded-xl
              flex items-center justify-center gap-2
              transition-all duration-300 active:scale-97
            `}
                    >
                        <Home size={18} />
                        Back to Home
                    </button>
                </motion.div>

                {/* Small note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-8 text-sm text-gray-500"
                >
                    You will receive a confirmation once your plan is active.
                </motion.p>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;