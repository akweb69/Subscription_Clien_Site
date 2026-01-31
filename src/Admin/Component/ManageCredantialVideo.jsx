import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const ManageCredentialVideo = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        windowsVideoLink: '',
        mobileVideoLink: '',
    });

    const base_url = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

    // Extract YouTube ID
    const extractYouTubeId = (url) => {
        if (!url) return null;
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${base_url}/video`);
            // newest first → we reverse to show oldest first (or keep as is)
            setVideos(res.data.reverse()); // optional: .reverse() if you want oldest first
        } catch (err) {
            console.error(err);
            toast.error('Failed to load credential videos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const startEditing = (video) => {
        setEditingId(video._id);
        setEditForm({
            windowsVideoLink: video.windowsVideoLink || '',
            mobileVideoLink: video.mobileVideoLink || '',
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ windowsVideoLink: '', mobileVideoLink: '' });
    };

    const saveEdit = async (id) => {
        const payload = {
            windowsVideoLink: editForm.windowsVideoLink.trim() || null,
            mobileVideoLink: editForm.mobileVideoLink.trim() || null,
            updatedAt: new Date().toISOString(),
        };

        try {
            const res = await axios.patch(`${base_url}/video/${id}`, payload);
            if (res.data.modifiedCount === 1) {
                toast.success('Video links updated');
                setVideos((prev) =>
                    prev.map((v) =>
                        v._id === id ? { ...v, ...payload } : v
                    )
                );
                setEditingId(null);
            } else {
                toast.error('No changes were saved');
            }
        } catch (err) {
            toast.error('Failed to update video links');
            console.error(err);
        }
    };

    const deleteVideo = async (id) => {
        if (!window.confirm('Delete this credential video entry?')) return;

        try {
            const res = await axios.delete(`${base_url}/video/${id}`);
            if (res.data.deletedCount === 1) {
                toast.success('Entry deleted');
                setVideos((prev) => prev.filter((v) => v._id !== id));
            }
        } catch (err) {
            toast.error('Failed to delete entry');
            console.error(err);
        }
    };

    // Responsive embed
    const YouTubeEmbed = ({ videoId, title }) => {
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
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600" />
            </div>
        );
    }

    return (
        <div className="w-full py-6 md:py-10 px-4 md:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8"
            >
                <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Manage Credential Videos
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Edit or delete saved credential/demo video links
                    </p>
                </div>

                {videos.length === 0 ? (
                    <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl border border-dashed">
                        No credential video entries found.
                    </div>
                ) : (
                    <div className="space-y-8">
                        {videos.map((video) => {
                            const isEditing = editingId === video._id;
                            const wId = extractYouTubeId(
                                isEditing ? editForm.windowsVideoLink : video.windowsVideoLink
                            );
                            const mId = extractYouTubeId(
                                isEditing ? editForm.mobileVideoLink : video.mobileVideoLink
                            );

                            return (
                                <div
                                    key={video._id}
                                    className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="p-5 md:p-6 border-b bg-gray-50">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Updated:{' '}
                                                    {new Date(video.updatedAt || video.createdAt || Date.now()).toLocaleString()}
                                                </p>
                                            </div>

                                            <div className="flex gap-3">
                                                {isEditing ? (
                                                    <>
                                                        <button
                                                            onClick={() => saveEdit(video._id)}
                                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => startEditing(video)}
                                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => deleteVideo(video._id)}
                                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 md:p-6">
                                        {isEditing ? (
                                            <div className="space-y-5">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                        Windows Video Link
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={editForm.windowsVideoLink}
                                                        onChange={(e) =>
                                                            setEditForm({ ...editForm, windowsVideoLink: e.target.value })
                                                        }
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                        placeholder="https://www.youtube.com/watch?v=..."
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                        Mobile Video Link
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={editForm.mobileVideoLink}
                                                        onChange={(e) =>
                                                            setEditForm({ ...editForm, mobileVideoLink: e.target.value })
                                                        }
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                        placeholder="https://youtu.be/..."
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="text-base font-semibold text-gray-800 mb-3">
                                                        Windows Version
                                                    </h4>
                                                    {wId ? (
                                                        <YouTubeEmbed videoId={wId} title="Windows Credential Video" />
                                                    ) : (
                                                        <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500 border border-dashed">
                                                            No Windows video link
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <h4 className="text-base font-semibold text-gray-800 mb-3">
                                                        Mobile Version
                                                    </h4>
                                                    {mId ? (
                                                        <YouTubeEmbed videoId={mId} title="Mobile Credential Video" />
                                                    ) : (
                                                        <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500 border border-dashed">
                                                            No Mobile video link
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

export default ManageCredentialVideo;