import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Bell, Send, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const AddNotifications = () => {
    const base_url = import.meta.env.VITE_BASE_URL;
    const [notificationMessage, setNotificationMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [lastNotification, setLastNotification] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!notificationMessage.trim()) {
            return toast.error('Notification message is required');
        }

        try {
            setLoading(true);
            const res = await axios.post(`${base_url}/message`, {
                message: notificationMessage,
                createdAt: new Date(),
            });

            if (res?.data) {
                toast.success('Notification sent successfully');
                setNotificationMessage('');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to send notification');
        } finally {
            setLoading(false);
        }
    };
    const loadNotifications = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${base_url}/message`);
            if (res?.data) {
                setLastNotification(res.data);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        loadNotifications();

    }, [])

    return (
        <div className="p-6 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Bell className="text-rose-500" />
                <h1 className="text-2xl font-bold">Add Notification</h1>
            </div>

            {/* Form */}
            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow p-6"
            >
                <label className="block text-sm font-medium text-gray-600 mb-2">
                    Notification Message
                </label>

                <textarea
                    rows={5}
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    placeholder="Type notification message here..."
                    className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                />

                <div className="flex justify-end mt-4">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        disabled={loading}
                        className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-xl font-medium disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <Loader className="animate-spin" size={18} />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                Send Notification
                            </>
                        )}
                    </motion.button>
                </div>
            </motion.form>

            {/* if last notification exists */}
            {
                lastNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow p-6 mt-6"
                    >
                        <h2 className="text-lg font-bold mb-2">Last Notification</h2>
                        {/* created at */}
                        <p className="text-gray-600">{new Date(lastNotification.createdAt).toLocaleString()}</p>
                        <p className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-gray-800">{lastNotification.message}</p>
                    </motion.div>
                )
            }
        </div>
    );
};

export default AddNotifications;
