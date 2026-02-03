import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const CookiesVideo = () => {
    const [fetching, setFetching] = useState(true);
    const [windowsEmbedId, setWindowsEmbedId] = useState(null);
    const [mobileEmbedId, setMobileEmbedId] = useState(null);

    const base_url = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

    // Extract YouTube video ID from various URL formats
    const extractYouTubeId = (url) => {
        if (!url) return null;
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const fetchCurrentCookiesVideo = async () => {
        try {
            setFetching(true);
            const res = await axios.get(`${base_url}/cookies-video`);

            if (res.data?.length > 0) {
                const latest = res.data[0]; // newest first

                const wLink = latest.windowsCookiesVideoLink || '';
                const mLink = latest.mobileCookiesVideoLink || '';

                setWindowsEmbedId(extractYouTubeId(wLink));
                setMobileEmbedId(extractYouTubeId(mLink));
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to load cookies videos');
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchCurrentCookiesVideo();
    }, []);

    // Responsive YouTube embed component
    const YouTubeEmbed = ({ videoId, title }) => {
        if (!videoId) return null;

        return (
            <div className="relative w-full pb-[56.25%] rounded-xl overflow-hidden shadow-md border border-gray-200">
                <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        );
    };

    return (
        <div className="w-full py-6 md:py-10  md:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-2 md:p-8 lg:p-10"
            >
                {/* Header */}
                <div className="mb-8 text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Cookies Consent Videos
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Explanation videos shown during cookies consent
                    </p>
                </div>

                {fetching ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
                        {/* Windows Version */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Windows Version
                            </h3>

                            {windowsEmbedId ? (
                                <YouTubeEmbed
                                    videoId={windowsEmbedId}
                                    title="Windows Cookies Explanation Video"
                                />
                            ) : (
                                <div className="bg-gray-100 rounded-xl p-12 text-center text-gray-600 border border-dashed border-gray-300 min-h-[240px] flex items-center justify-center">
                                    No Windows cookies video available
                                </div>
                            )}
                        </div>

                        {/* Mobile Version */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Mobile Version
                            </h3>

                            {mobileEmbedId ? (
                                <YouTubeEmbed
                                    videoId={mobileEmbedId}
                                    title="Mobile Cookies Explanation Video"
                                />
                            ) : (
                                <div className="bg-gray-100 rounded-xl p-12 text-center text-gray-600 border border-dashed border-gray-300 min-h-[240px] flex items-center justify-center">
                                    No Mobile cookies video available
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default CookiesVideo;