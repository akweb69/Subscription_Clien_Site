import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import {
    Rocket,
    Zap,
    Clock,
    Tag,
    Smile,
    Headphones,
    Sparkles,
    Star,
    TrendingUp
} from 'lucide-react';

const Advantages = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const advantages = [
        {
            icon: Rocket,
            title: 'Fast Delivery',
            gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
            glowColor: '#06b6d4',
            particles: ['💨', '🚀', '⚡', '💫', '✨'],
            bgPattern: 'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)'
        },
        {
            icon: Zap,
            title: 'Instant Access',
            gradient: 'from-purple-400 via-pink-500 to-rose-600',
            glowColor: '#a855f7',
            particles: ['⚡', '✨', '🎯', '💥', '🌟'],
            bgPattern: 'radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)'
        },
        {
            icon: Clock,
            title: '100% uptime',
            subtitle: 'Guarantee',
            gradient: 'from-orange-400 via-red-500 to-pink-600',
            glowColor: '#f97316',
            particles: ['⏰', '🔥', '💯', '⭐', '🎊'],
            bgPattern: 'radial-gradient(circle at 50% 80%, rgba(249, 115, 22, 0.3) 0%, transparent 50%)'
        },
        {
            icon: Tag,
            title: 'Affordable Pricing',
            subtitle: 'Plan',
            gradient: 'from-emerald-400 via-green-500 to-teal-600',
            glowColor: '#10b981',
            particles: ['💰', '💎', '🎁', '💚', '🌈'],
            bgPattern: 'radial-gradient(circle at 30% 30%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)'
        },
        {
            icon: Smile,
            title: 'User Friendly',
            subtitle: 'Interface',
            gradient: 'from-violet-400 via-purple-500 to-fuchsia-600',
            glowColor: '#8b5cf6',
            particles: ['😊', '👍', '🎨', '💜', '🦄'],
            bgPattern: 'radial-gradient(circle at 70% 70%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)'
        },
        {
            icon: Headphones,
            title: 'Instant Support',
            gradient: 'from-pink-400 via-rose-500 to-red-600',
            glowColor: '#ec4899',
            particles: ['🎧', '💬', '❤️', '🌸', '💖'],
            bgPattern: 'radial-gradient(circle at 40% 60%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)'
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 100,
            scale: 0.6,
            rotateX: -25,
            rotateY: 15
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            transition: {
                duration: 0.8,
                ease: [0.23, 1, 0.32, 1]
            }
        }
    };

    return (
        <section className="w-full py-24 md:py-40 bg-black relative overflow-hidden">
            {/* Ultra Dynamic Background */}
            <div className="absolute inset-0">
                {/* Gradient Orbs */}
                <motion.div
                    className="absolute w-[800px] h-[800px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                    }}
                    animate={{
                        x: [0, 200, -100, 0],
                        y: [0, -150, 100, 0],
                        scale: [1, 1.3, 0.9, 1]
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute right-0 bottom-0 w-[700px] h-[700px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                    }}
                    animate={{
                        x: [0, -150, 100, 0],
                        y: [0, 100, -100, 0],
                        scale: [1, 0.9, 1.4, 1]
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                    }}
                    animate={{
                        x: [0, 100, -150, 0],
                        y: [0, -100, 150, 0],
                        scale: [1, 1.2, 0.8, 1]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px'
                    }}
                />

                {/* Floating Stars */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1.5, 0],
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                        }}
                    />
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Epic Header */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: -100 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                    className="text-center mb-20 relative"
                >
                    {/* Sparkle Effects */}
                    <motion.div
                        className="absolute -top-10 left-1/2 -translate-x-1/2"
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 180, 360]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Sparkles className="text-yellow-400" size={48} />
                    </motion.div>

                    <motion.h2
                        className="text-6xl md:text-8xl font-black mb-6 relative inline-block py-2"
                        style={{
                            background: 'linear-gradient(135deg, #ffffff 0%, #60a5fa 25%, #a855f7 50%, #ec4899 75%, #ffffff 100%)',
                            backgroundSize: '300% 300%',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                        animate={{
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        Our Advantage
                    </motion.h2>

                    {/* Animated Underline */}
                    <motion.div className="flex justify-center gap-2 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                                initial={{ width: 0 }}
                                animate={{ width: "50px" }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0.8 + i * 0.1,
                                    ease: "easeOut"
                                }}
                            />
                        ))}
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        Experience excellence with our cutting-edge features
                    </motion.p>
                </motion.div>

                {/* Advantages Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {advantages.map((advantage, index) => {
                        const Icon = advantage.icon;
                        const isHovered = hoveredIndex === index;

                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                onHoverStart={() => setHoveredIndex(index)}
                                onHoverEnd={() => setHoveredIndex(null)}
                                className="relative group"
                                style={{ perspective: '1000px' }}
                            >
                                {/* Explosion Particles */}
                                {isHovered && advantage.particles.map((particle, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute text-3xl pointer-events-none z-30"
                                        initial={{
                                            x: 100,
                                            y: 60,
                                            opacity: 0,
                                            scale: 0,
                                            rotate: 0
                                        }}
                                        animate={{
                                            x: (Math.random() - 0.5) * 400,
                                            y: -150 - Math.random() * 150,
                                            opacity: [0, 1, 1, 0],
                                            scale: [0, 2, 2, 0],
                                            rotate: Math.random() * 720 - 360
                                        }}
                                        transition={{
                                            duration: 2,
                                            delay: i * 0.1,
                                            ease: [0.23, 1, 0.32, 1]
                                        }}
                                    >
                                        {particle}
                                    </motion.div>
                                ))}

                                {/* Mega Glow */}
                                <motion.div
                                    className="absolute -inset-4 rounded-[2rem] blur-2xl"
                                    style={{
                                        background: `radial-gradient(circle, ${advantage.glowColor} 0%, transparent 70%)`,
                                    }}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{
                                        opacity: isHovered ? 0.8 : 0,
                                        scale: isHovered ? 1.3 : 0.8,
                                    }}
                                    transition={{ duration: 0.4 }}
                                />

                                {/* Card */}
                                <motion.div
                                    whileHover={{
                                        scale: 1.08,
                                        y: -20,
                                        rotateY: 8,
                                        rotateX: -5,
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 15
                                    }}
                                    className="relative rounded-[2rem] p-8 flex items-center gap-6 overflow-hidden"
                                    style={{
                                        background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`,
                                        backdropFilter: 'blur(20px)',
                                        border: '2px solid rgba(255,255,255,0.2)',
                                        transformStyle: 'preserve-3d',
                                        boxShadow: isHovered ? `0 30px 60px ${advantage.glowColor}80` : '0 10px 30px rgba(0,0,0,0.3)'
                                    }}
                                >
                                    {/* Rainbow Border Animation */}
                                    <motion.div
                                        className="absolute inset-0 rounded-[2rem] p-[2px]"
                                        style={{
                                            background: `linear-gradient(135deg, ${advantage.gradient})`,
                                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                            WebkitMaskComposite: 'xor',
                                            maskComposite: 'exclude',
                                        }}
                                        animate={{
                                            opacity: isHovered ? 1 : 0,
                                        }}
                                    />

                                    {/* Background Pattern */}
                                    <div
                                        className="absolute inset-0 opacity-30"
                                        style={{ background: advantage.bgPattern }}
                                    />

                                    {/* Multi-layer Shimmer */}
                                    <motion.div
                                        className="absolute inset-0"
                                        style={{
                                            background: `linear-gradient(120deg, transparent 0%, ${advantage.glowColor}40 50%, transparent 100%)`
                                        }}
                                        animate={{
                                            x: isHovered ? ['-200%', '200%'] : '-200%',
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            ease: "easeInOut",
                                            repeat: isHovered ? Infinity : 0,
                                            repeatDelay: 0.5
                                        }}
                                    />

                                    {/* Icon Container with 3D Effect */}
                                    <motion.div
                                        className="relative z-10"
                                        animate={{
                                            rotateY: isHovered ? [0, 360] : 0,
                                            scale: isHovered ? 1.2 : 1
                                        }}
                                        transition={{
                                            duration: 0.8,
                                            ease: [0.23, 1, 0.32, 1]
                                        }}
                                    >
                                        <div
                                            className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${advantage.gradient} flex items-center justify-center flex-shrink-0 relative`}
                                            style={{
                                                boxShadow: `0 10px 40px ${advantage.glowColor}60, inset 0 -2px 10px rgba(0,0,0,0.3)`,
                                                transform: 'translateZ(30px)'
                                            }}
                                        >
                                            {/* Icon Orbit Ring */}
                                            <motion.div
                                                className={`absolute inset-0 rounded-2xl border-2`}
                                                style={{ borderColor: advantage.glowColor }}
                                                animate={{
                                                    scale: isHovered ? [1, 1.5, 1] : 1,
                                                    opacity: isHovered ? [0.8, 0, 0.8] : 0,
                                                    rotate: isHovered ? [0, 360] : 0
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "linear"
                                                }}
                                            />

                                            <Icon className="text-white relative z-10" size={42} strokeWidth={2.5} />

                                            {/* Icon Glow */}
                                            <motion.div
                                                className="absolute inset-0 rounded-2xl"
                                                style={{
                                                    background: `radial-gradient(circle, ${advantage.glowColor} 0%, transparent 70%)`,
                                                    filter: 'blur(15px)'
                                                }}
                                                animate={{
                                                    opacity: isHovered ? [0.5, 1, 0.5] : 0
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Text Content with Glow */}
                                    <div className="flex-1 relative z-10">
                                        <motion.h3
                                            className="text-2xl font-black text-white leading-tight mb-1"
                                            animate={{
                                                x: isHovered ? 8 : 0,
                                                textShadow: isHovered ? `0 0 20px ${advantage.glowColor}` : 'none'
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {advantage.title}
                                        </motion.h3>
                                        {advantage.subtitle && (
                                            <motion.p
                                                className="text-2xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                                                animate={{
                                                    x: isHovered ? 8 : 0,
                                                }}
                                                transition={{ duration: 0.3, delay: 0.05 }}
                                            >
                                                {advantage.subtitle}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Floating Orbs */}
                                    {isHovered && (
                                        <>
                                            <motion.div
                                                className="absolute top-4 right-4 w-3 h-3 rounded-full"
                                                style={{ background: advantage.glowColor }}
                                                animate={{
                                                    y: [0, -30, 0],
                                                    opacity: [0, 1, 0]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                            <motion.div
                                                className="absolute bottom-4 left-4 w-2 h-2 rounded-full"
                                                style={{ background: advantage.glowColor }}
                                                animate={{
                                                    y: [0, 30, 0],
                                                    opacity: [0, 1, 0]
                                                }}
                                                transition={{
                                                    duration: 2.5,
                                                    repeat: Infinity,
                                                    ease: "easeInOut",
                                                    delay: 0.5
                                                }}
                                            />
                                        </>
                                    )}
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default Advantages;