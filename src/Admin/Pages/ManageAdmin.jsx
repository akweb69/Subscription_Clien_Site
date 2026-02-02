import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Plus, Trash2, ShieldCheck, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageAdmin = () => {
    const base_url = import.meta.env.VITE_BASE_URL;

    const [admins, setAdmins] = useState([]);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('admin');
    const [loading, setLoading] = useState(false);

    const loadAdmins = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${base_url}/admin`);
            setAdmins(res.data || []);
        } catch (err) {
            toast.error('Failed to load admins');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAdmins();
    }, []);

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        if (!email.trim()) return toast.error('Email is required');

        try {
            await axios.post(`${base_url}/admin`, { email: email.trim(), role });
            toast.success('Admin added successfully');
            setEmail('');
            setRole('admin');
            loadAdmins();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to add admin');
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            await axios.patch(`${base_url}/admin/${id}`, { role: newRole });
            toast.success('Role updated');
            loadAdmins();
        } catch {
            toast.error('Failed to update role');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this admin?')) return;

        try {
            await axios.delete(`${base_url}/admin/${id}`);
            toast.success('Admin removed');
            loadAdmins();
        } catch {
            toast.error('Failed to delete admin');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/40 py-6 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-full bg-rose-100">
                            <ShieldCheck className="text-rose-600" size={24} />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Manage Admins
                        </h1>
                    </div>
                </div>

                {/* Add Admin Form */}
                <motion.form
                    onSubmit={handleAddAdmin}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                    <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-4">
                        <input
                            type="email"
                            placeholder="Enter admin email..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 min-w-0 border border-gray-300 rounded-lg px-4 py-2.5 
                       focus:border-rose-500 focus:ring-1 focus:ring-rose-500 
                       outline-none transition"
                            required
                        />

                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full sm:w-36 border border-gray-300 rounded-lg px-4 py-2.5 
                       focus:border-rose-500 focus:ring-1 focus:ring-rose-500 
                       bg-white"
                        >
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>

                        <button
                            type="submit"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 
                       bg-rose-600 hover:bg-rose-700 active:bg-rose-800 
                       text-white font-medium px-6 py-2.5 rounded-lg 
                       transition-colors shadow-sm min-h-[44px] touch-manipulation"
                        >
                            <Plus size={18} />
                            Add Admin
                        </button>
                    </div>
                </motion.form>

                {/* Admin List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="border-b bg-gray-50 px-5 py-3">
                        <h2 className="text-base font-semibold text-gray-700">
                            Current Admins ({admins.length})
                        </h2>
                    </div>

                    {loading ? (
                        <div className="p-12 flex justify-center items-center">
                            <Loader className="animate-spin text-rose-600" size={28} />
                        </div>
                    ) : admins.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">
                            <p className="text-lg font-medium">No admins found</p>
                            <p className="mt-1">Add your first admin above</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[480px] text-sm">
                                <thead className="bg-gray-50 text-gray-700 text-left">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">Email</th>
                                        <th className="px-5 py-3 font-medium w-36">Role</th>
                                        <th className="px-5 py-3 font-medium text-right w-24">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {admins.map((admin) => (
                                        <tr
                                            key={admin._id}
                                            className="hover:bg-gray-50/70 transition-colors"
                                        >
                                            <td className="px-5 py-3.5 font-medium text-gray-900 break-all">
                                                {admin.email}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <select
                                                    value={admin.role}
                                                    onChange={(e) =>
                                                        handleRoleChange(admin._id, e.target.value)
                                                    }
                                                    className="w-full max-w-[140px] border border-gray-300 rounded 
                                   px-3 py-1.5 bg-white focus:border-rose-500 
                                   focus:ring-1 focus:ring-rose-500"
                                                >
                                                    <option value="admin">Admin</option>
                                                    <option value="user">User</option>
                                                </select>
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                <button
                                                    onClick={() => handleDelete(admin._id)}
                                                    className="p-2 text-red-600 hover:text-red-700 
                                   hover:bg-red-50 rounded-lg transition-colors 
                                   active:scale-95 min-w-[44px] min-h-[44px]"
                                                    title="Remove admin"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageAdmin;