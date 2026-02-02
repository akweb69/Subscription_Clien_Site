// QuickLinks.jsx  – balanced version 2025 style
import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Loader2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const QuickLinks = () => {
    const base_url = import.meta.env.VITE_BASE_URL;

    const [links, setLinks] = useState({ whatsapp: '', telegram: '' });
    const [loading, setLoading] = useState(true);
    const [hovered, setHovered] = useState(null);

    useEffect(() => {
        axios
            .get(`${base_url}/quick-links`)
            .then((res) => {
                const data = res.data || {};
                setLinks({
                    whatsapp: data.whatsapp || '',
                    telegram: data.telegram || '',
                });
            })
            .catch((err) => console.error('Quick links fetch failed:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!links.whatsapp && !links.telegram) return null;

    const buttonBase =
        'group relative flex items-center gap-3.5 px-7 py-4.5 rounded-2xl font-semibold text-lg ' +
        'border-2 shadow-md transition-all duration-300 overflow-hidden';

    const containerVariants = {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.14 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 12, scale: 0.96 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 22 } },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="px-5 sm:px-8 py-8 sm:py-10"
        >
            <h3 className="mb-6 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Quick Contact
            </h3>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <AnimatePresence>
                    {links.whatsapp && (
                        <motion.a
                            href={links.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            variants={itemVariants}
                            whileHover={{ y: -4, scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onHoverStart={() => setHovered('whatsapp')}
                            onHoverEnd={() => setHovered(null)}
                            className={`${buttonBase} bg-gradient-to-br from-green-50 to-emerald-50 
                hover:from-green-100 hover:to-emerald-100 border-green-200 hover:border-green-300 
                text-green-800`}
                        >
                            <MessageCircle className="h-7 w-7 text-green-600 transition-transform group-hover:rotate-6" />
                            <span>WhatsApp</span>
                            <ExternalLink
                                className={`h-5 w-5 transition-all ${hovered === 'whatsapp' ? 'opacity-100 translate-x-1' : 'opacity-60'}`}
                            />
                        </motion.a>
                    )}

                    {links.telegram && (
                        <motion.a
                            href={links.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            variants={itemVariants}
                            whileHover={{ y: -4, scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onHoverStart={() => setHovered('telegram')}
                            onHoverEnd={() => setHovered(null)}
                            className={`${buttonBase} bg-gradient-to-br from-blue-50 to-cyan-50 
                hover:from-blue-100 hover:to-cyan-100 border-blue-200 hover:border-blue-300 
                text-blue-800`}
                        >
                            <Send className="h-7 w-7 text-blue-600 transition-transform group-hover:-rotate-6" />
                            <span>Telegram</span>
                            <ExternalLink
                                className={`h-5 w-5 transition-all ${hovered === 'telegram' ? 'opacity-100 translate-x-1' : 'opacity-60'}`}
                            />
                        </motion.a>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default QuickLinks;