import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Plus, Loader, Cookie } from 'lucide-react';
import toast from 'react-hot-toast';

const AddCockies = () => {
    const [loading, setLoading] = useState(false);
    const [p_name, setP_name] = useState('');
    const [p_value, setP_value] = useState('');
    const [p_slot, setP_slot] = useState(0);


    const handleAdd = async (e) => {
        e.preventDefault();

        if (!p_name || !p_value || p_slot <= 0) {
            return toast.error('All fields are required');
        }

        try {
            setLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/add_cockies_platform`, {
                p_name,
                p_value,
                p_slot,
            });

            if (res?.data) {
                toast.success('Cookies platform added', { position: 'top-center' });
                setP_name('');
                setP_value('');
                setP_slot(0);
            }
        } catch (error) {
            toast.error('Failed to add cookies');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Cookie className="text-rose-500" />
                <h1 className="text-2xl font-bold">Add Cookies Platform</h1>
            </div>

            {/* Form */}
            <motion.form
                onSubmit={handleAdd}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                {/* Platform Name */}
                <div>
                    <label className="text-sm font-medium text-gray-600">
                        Platform Name
                    </label>
                    <input
                        type="text"
                        value={p_name}
                        onChange={(e) => setP_name(e.target.value)}
                        placeholder="Netflix / Spotify / Facebook"
                        className="mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                </div>

                {/* Slots */}
                <div>
                    <label className="text-sm font-medium text-gray-600">
                        No of Slots
                    </label>
                    <input
                        type="number"
                        min={1}
                        value={p_slot}
                        onChange={(e) => setP_slot(Number(e.target.value))}
                        placeholder="1"
                        className="mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                </div>

                {/* Cookies Value */}
                <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">
                        Cookies Value
                    </label>
                    <textarea
                        rows={12}
                        value={p_value}
                        onChange={(e) => setP_value(e.target.value)}
                        placeholder="Paste cookies data here..."
                        className="mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                    />
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2 flex justify-end">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        disabled={loading}
                        className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-xl font-medium disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <Loader className="animate-spin" size={18} />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Plus size={18} />
                                Add Platform
                            </>
                        )}
                    </motion.button>
                </div>
            </motion.form>
        </div>
    );
};

export default AddCockies;
