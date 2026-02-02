import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Trash2, Edit, Save, X, Loader, Cookie } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageCockies = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({
        p_name: '',
        p_value: '',
        p_slot: 0,
    });

    // 🔹 Load cookies platforms
    const loadData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/add_cockies_platform`);
            setData(res.data || []);
        } catch (err) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // 🔹 Start edit
    const handleEdit = (item) => {
        setEditId(item._id);
        setEditData({
            p_name: item.p_name,
            p_value: item.p_value,
            p_slot: item.p_slot,
        });
    };

    // 🔹 Save edit
    const handleUpdate = async (id) => {
        try {
            await axios.patch(`${import.meta.env.VITE_BASE_URL}/add_cockies_platform/${id}`, editData);
            toast.success('Updated successfully');
            setEditId(null);
            loadData();
        } catch {
            toast.error('Update failed');
        }
    };

    // 🔹 Delete
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this platform?')) return;

        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/add_cockies_platform/${id}`);
            toast.success('Deleted successfully');
            loadData();
        } catch {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Cookie className="text-rose-500" />
                <h1 className="text-2xl font-bold">Manage Cookies Platforms</h1>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">
                {loading ? (
                    <div className="p-10 flex justify-center">
                        <Loader className="animate-spin" />
                    </div>
                ) : data.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        No data found
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Platform</th>
                                <th className="p-3 text-left">Slots</th>
                                <th className="p-3 text-left">Cookies</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <motion.tr
                                    key={item._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="border-t hover:bg-gray-50"
                                >
                                    {/* Platform */}
                                    <td className="p-3 font-medium">
                                        {item.p_name}
                                    </td>

                                    {/* Slots */}
                                    <td className="p-3">
                                        {editId === item._id ? (
                                            <input
                                                type="number"
                                                min={0}
                                                value={editData.p_slot}
                                                onChange={(e) =>
                                                    setEditData({
                                                        ...editData,
                                                        p_slot: Number(
                                                            e.target.value
                                                        ),
                                                    })
                                                }
                                                className="border rounded px-2 py-1 w-20"
                                            />
                                        ) : (
                                            item.p_slot
                                        )}
                                    </td>

                                    {/* Cookies */}
                                    <td className="p-3 max-w-xs">
                                        {editId === item._id ? (
                                            <textarea
                                                rows={10}
                                                value={editData.p_value}
                                                onChange={(e) =>
                                                    setEditData({
                                                        ...editData,
                                                        p_value: e.target.value,
                                                    })
                                                }
                                                className="w-full border rounded px-2 py-1 text-xs"
                                            />
                                        ) : (
                                            <span className="line-clamp-2 text-gray-600">
                                                {item.p_value}
                                            </span>
                                        )}
                                    </td>

                                    {/* Actions */}
                                    <td className="p-3 text-right">
                                        {editId === item._id ? (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleUpdate(item._id)
                                                    }
                                                    className="text-green-600 hover:text-green-700"
                                                >
                                                    <Save size={18} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setEditId(null)
                                                    }
                                                    className="text-gray-500 hover:text-gray-600"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(item)
                                                    }
                                                    className="text-blue-600 hover:text-blue-700"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(item._id)
                                                    }
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageCockies;
