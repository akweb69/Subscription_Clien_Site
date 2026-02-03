import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const ManageCookiesVideo = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        windowsCookiesVideoLink: '',
        mobileCookiesVideoLink: '',
    });

    const base_url = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

    // Extract YouTube video ID
    const getYouTubeId = (url) => {
        if (!url) return null;
        const match = url.match(
            /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
        );
        return match ? match[1] : null;
    };

    const fetchEntries = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${base_url}/cookies-video`);
            // Show newest first
            setEntries(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load cookies videos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    // ─── Edit handlers ────────────────────────────────────────
    const startEdit = (entry) => {
        setEditingId(entry._id);
        setEditForm({
            windowsCookiesVideoLink: entry.windowsCookiesVideoLink || '',
            mobileCookiesVideoLink: entry.mobileCookiesVideoLink || '',
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ windowsCookiesVideoLink: '', mobileCookiesVideoLink: '' });
    };

    const saveChanges = async (id) => {
        const payload = {
            windowsCookiesVideoLink: editForm.windowsCookiesVideoLink.trim() || null,
            mobileCookiesVideoLink: editForm.mobileCookiesVideoLink.trim() || null,
            updatedAt: new Date().toISOString(),
        };

        try {
            const res = await axios.patch(`${base_url}/cookies-video/${id}`, payload);
            if (res.data.modifiedCount === 1) {
                toast.success('Cookies video links updated');
                setEntries((prev) =>
                    prev.map((item) =>
                        item._id === id ? { ...item, ...payload } : item
                    )
                );
                setEditingId(null);
            } else {
                toast.info('No changes were made');
            }
        } catch (err) {
            toast.error('Failed to update');
            console.error(err);
        }
    };

    // ─── Delete ───────────────────────────────────────────────
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this cookies video entry?')) return;

        try {
            const res = await axios.delete(`${base_url}/cookies-video/${id}`);
            if (res.data.deletedCount === 1) {
                toast.success('Entry deleted');
                setEntries((prev) => prev.filter((item) => item._id !== id));
                if (editingId === id) cancelEdit();
            }
        } catch (err) {
            toast.error('Failed to delete entry');
            console.error(err);
        }
    };

    // ─── Responsive YouTube embed ─────────────────────────────
    const YouTubePlayer = ({ videoId, title }) => {
        if (!videoId) return null;
        return (
            <div className="relative w-full pb-[56.25%] rounded-lg overflow-hidden shadow-sm border border-gray-200">
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

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-indigo-600" />
            </div>
        );
    }

    return (
        <div className="w-full py-8  md:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-2 md:p-8 lg:p-10"
            >
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Manage Cookies Consent Videos
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Edit or remove saved YouTube links for cookies explanation (Windows & Mobile)
                    </p>
                </div>

                {entries.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 text-lg">
                            No cookies video entries found.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {entries.map((entry) => {
                            const isEditing = editingId === entry._id;

                            const currentWindowsLink = isEditing
                                ? editForm.windowsCookiesVideoLink
                                : entry.windowsCookiesVideoLink;
                            const currentMobileLink = isEditing
                                ? editForm.mobileCookiesVideoLink
                                : entry.mobileCookiesVideoLink;

                            const wId = getYouTubeId(currentWindowsLink);
                            const mId = getYouTubeId(currentMobileLink);

                            return (
                                <div
                                    key={entry._id}
                                    className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow hover:shadow-md transition-shadow"
                                >
                                    {/* Header bar */}
                                    <div className="px-5 py-4 md:px-6 bg-gray-50 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Last updated:{' '}
                                                {new Date(entry.updatedAt || Date.now()).toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="flex gap-3">
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        onClick={() => saveChanges(entry._id)}
                                                        className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => startEdit(entry)}
                                                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(entry._id)}
                                                        className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className=" md:p-6 p-3">
                                        {isEditing ? (
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                        Windows Cookies Video Link
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={editForm.windowsCookiesVideoLink}
                                                        onChange={(e) =>
                                                            setEditForm({
                                                                ...editForm,
                                                                windowsCookiesVideoLink: e.target.value,
                                                            })
                                                        }
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                        placeholder="https://www.youtube.com/watch?v=..."
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                        Mobile Cookies Video Link
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={editForm.mobileCookiesVideoLink}
                                                        onChange={(e) =>
                                                            setEditForm({
                                                                ...editForm,
                                                                mobileCookiesVideoLink: e.target.value,
                                                            })
                                                        }
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                        placeholder="https://youtu.be/..."
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                                                {/* Windows */}
                                                <div>
                                                    <h4 className="text-base font-semibold text-gray-800 mb-3">
                                                        Windows Version
                                                    </h4>
                                                    {wId ? (
                                                        <YouTubePlayer
                                                            videoId={wId}
                                                            title="Windows Cookies Explanation"
                                                        />
                                                    ) : (
                                                        <div className="bg-gray-50 rounded-lg p-10 text-center text-gray-500 border border-dashed">
                                                            No Windows video link set
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Mobile */}
                                                <div>
                                                    <h4 className="text-base font-semibold text-gray-800 mb-3">
                                                        Mobile Version
                                                    </h4>
                                                    {mId ? (
                                                        <YouTubePlayer
                                                            videoId={mId}
                                                            title="Mobile Cookies Explanation"
                                                        />
                                                    ) : (
                                                        <div className="bg-gray-50 rounded-lg p-10 text-center text-gray-500 border border-dashed">
                                                            No Mobile video link set
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ManageCookiesVideo;