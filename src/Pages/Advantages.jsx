import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Rocket,
    Zap,
    Clock,
    Tag,
    Smile,
    Headphones,
} from 'lucide-react';

const advantages = [
    {
        icon: Rocket,
        title: 'Fast Delivery',
        description: 'Content delivered in record time without compromising quality.',
    },
    {
        icon: Zap,
        title: 'Instant Access',
        description: 'Get started immediately — no long setup or waiting periods.',
    },
    {
        icon: Clock,
        title: '100% Uptime Guarantee',
        description: 'Reliable service you can count on, every single day.',
    },
    {
        icon: Tag,
        title: 'Affordable Pricing',
        description: 'Competitive plans that deliver maximum value.',
    },
    {
        icon: Smile,
        title: 'User-Friendly Interface',
        description: 'Intuitive design that’s easy to use for everyone.',
    },
    {
        icon: Headphones,
        title: 'Instant Support',
        description: 'Real help when you need it — fast and friendly.',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
};

const Advantages = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <section className="w-full py-20 md:py-28 bg-white">
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16 md:mb-20"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                        Why Choose Us
                    </h2>
                    <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        We deliver exceptional value through speed, reliability, and care for our users.
                    </p>
                </motion.div>

                {/* Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                >
                    {advantages.map((adv, index) => {
                        const Icon = adv.icon;
                        const isHovered = hoveredIndex === index;

                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                onHoverStart={() => setHoveredIndex(index)}
                                onHoverEnd={() => setHoveredIndex(null)}
                                className="group relative"
                            >
                                <div
                                    className={`
                    h-full p-7 md:p-8 rounded-2xl border border-gray-200 
                    bg-white shadow-sm transition-all duration-300
                    ${isHovered
                                            ? 'shadow-xl border-gray-300 -translate-y-2'
                                            : 'hover:shadow-md hover:border-gray-300 hover:-translate-y-1'}
                  `}
                                >
                                    {/* Icon */}
                                    <div
                                        className={`
                      inline-flex items-center justify-center w-14 h-14 
                      rounded-xl mb-5 transition-all duration-300
                      ${isHovered
                                                ? 'bg-blue-100 text-blue-600 scale-110'
                                                : 'bg-gray-100 text-gray-600'}
                    `}
                                    >
                                        <Icon size={28} strokeWidth={2} />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                                        {adv.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-600 leading-relaxed">
                                        {adv.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default Advantages;