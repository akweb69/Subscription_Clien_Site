// src/components/auth/AuthLayout.jsx
import { motion } from 'framer-motion';
import { LayoutDashboard, CheckCircle, Star } from 'lucide-react';

export default function AuthLayout({
    children,
    title,
    subtitle,
    isSignUp = false,
}) {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white">
            {/* LEFT - Branding / Visual Side */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] relative overflow-hidden">
                {/* Cosmic Glow Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-amber-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px]" />
                </div>

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
                />

                <div className="relative z-10 flex flex-col justify-between px-16 py-16 text-white w-full">
                    {/* Top: Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2"
                    >
                        <div className="bg-amber-500 p-2 rounded-lg">
                            <LayoutDashboard className="h-6 w-6 text-slate-900" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase">AsterDesk</span>
                    </motion.div>

                    {/* Middle: Value Prop */}
                    <div className="max-w-lg">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-medium mb-6">
                                <Star size={12} fill="currentColor" />
                                <span>Trusted by 10k+ teams worldwide</span>
                            </div>

                            <h2 className="text-5xl font-bold leading-tight mb-6">
                                {isSignUp
                                    ? "Elevate your workflow to the stars."
                                    : "Welcome back to your command center."}
                            </h2>
                            <p className="text-lg text-slate-400 leading-relaxed">
                                {isSignUp
                                    ? "Experience the next generation of workspace management. Simple, fast, and remarkably powerful."
                                    : "Your dashboard is ready. Sign in to pick up exactly where you left off."}
                            </p>
                        </motion.div>

                        {/* Feature Tags */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-10 grid grid-cols-2 gap-4"
                        >
                            {[
                                "Enterprise Security",
                                "Real-time Sync",
                                "AI-Powered Tools",
                                "Priority Support"
                            ].map((feature) => (
                                <div key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                                    <CheckCircle size={16} className="text-amber-500" />
                                    {feature}
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Bottom: Footer Info */}
                    <div className="text-slate-500 text-xs tracking-wide">
                        &copy; 2026 ASTERDESK TECHNOLOGIES INC.
                    </div>
                </div>
            </div>

            {/* RIGHT - Form Section */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-[440px]"
                >
                    {/* Mobile Logo Only */}
                    <div className="lg:hidden flex items-center justify-center gap-2 mb-12">
                        <LayoutDashboard className="h-8 w-8 text-amber-500" />
                        <span className="text-2xl font-black tracking-tighter uppercase text-slate-900">AsterDesk</span>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
                        <p className="mt-3 text-slate-500 font-medium">{subtitle}</p>
                    </div>

                    <div className="bg-white">
                        {children}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}