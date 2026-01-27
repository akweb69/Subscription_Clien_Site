import React from 'react';
import { motion } from 'framer-motion';

// Animation variants
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.18,
            delayChildren: 0.2,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 40, scale: 0.94 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 110,
            damping: 15,
        },
    },
};

const HowItWork = () => {
    const steps = ['Browse Plan', 'Choose Plan', 'Complete Purchase', 'Access Content'];

    return (
        <div className="bg-white w-full rounded-t-4xl -mt-6 z-20 py-10 md:py-16 shadow-2xl shadow-violet-100/50">
            <div className="max-w-7xl mx-auto px-6">
                {/* Title */}
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center text-4xl md:text-5xl font-bold text-gray-900 logoFont tracking-tight mb-12 md:mb-16"
                >
                    How It Works
                </motion.h2>

                {/* Steps */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                    className="relative flex flex-col md:flex-row items-center justify-center gap-10 md:gap-6 lg:gap-12"
                >
                    {/* Desktop background connector line */}
                    <div className="hidden md:block absolute top-[48%] left-[12%] right-[12%] h-[3px] bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-400 rounded-full opacity-60" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            className="relative z-10 flex flex-col items-center text-center group w-full max-w-[200px] md:max-w-none"
                            whileHover={{ y: -6, scale: 1.04 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            {/* Step Circle */}
                            <div className="
                w-20 h-20 md:w-24 md:h-24 
                rounded-full 
                bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700
                flex items-center justify-center 
                text-white text-3xl md:text-4xl font-bold 
                shadow-xl shadow-indigo-500/40 
                group-hover:shadow-2xl group-hover:shadow-indigo-600/50 
                transition-all duration-300
              ">
                                {index + 1}
                            </div>

                            {/* Mobile vertical connector */}
                            {index < steps.length - 1 && (
                                <div className="md:hidden w-[3px] h-16 my-6 bg-gradient-to-b from-indigo-500 to-violet-500 rounded-full opacity-80" />
                            )}

                            {/* Step Text */}
                            <p className="
                mt-5 md:mt-6 
                text-base md:text-lg font-semibold 
                text-gray-800 group-hover:text-indigo-700 
                transition-colors duration-300
                tracking-wide
              ">
                                {step}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default HowItWork;