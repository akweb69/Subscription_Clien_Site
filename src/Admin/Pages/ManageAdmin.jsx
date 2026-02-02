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

    // 🔹 Load admins
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

    // 🔹 Add admin
    const handleAddAdmin = async (e) => {
        e.preventDefault();

        if (!email) return toast.error('Email is required');

        try {
            await axios.post(`${base_url}/admin`, { email, role });
            toast.success('Admin added');
            setEmail('');
            setRole('admin');
            loadAdmins();
        } catch (err) {
            toast.error('Failed to add admin');
        }
    };

    // 🔹 Update role
    const handleRoleChange = async (id, newRole) => {
        try {
            await axios.patch(`${base_url}/admin/${id}`, { role: newRole });
            toast.success('Role updated');
            loadAdmins();
        } catch {
            toast.error('Failed to update role');
        }
    };

    // 🔹 Delete admin
    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;

        try {
            await axios.delete(`${base_url}/admin/${id}`);
            toast.success('Admin removed');
            loadAdmins();
        } catch {
            toast.error('Failed to delete admin');
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="text-rose-500" />
                <h1 className="text-2xl font-bold">Manage Admins</h1>
            </div>

            {/* Add Admin */}
            <motion.form
                onSubmit={handleAddAdmin}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row gap-4 mb-8"
            >
                <input
                    type="email"
                    placeholder="admin@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2"
                />

                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="border rounded-lg px-3 py-2"
                >
                    <option value="admin">Admin</option>
                    <option value="user">user</option>
                </select>

                <button
                    type="submit"
                    className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg"
                >
                    <Plus size={18} /> Add
                </button>
            </motion.form>

            {/* Admin List */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                {loading ? (
                    <div className="p-6 flex justify-center">
                        <Loader className="animate-spin" />
                    </div>
                ) : admins.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        No admins found
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                                <th className="p-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map((admin) => (
                                <tr
                                    key={admin._id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="p-3">{admin.email}</td>
                                    <td className="p-3">
                                        <select
                                            value={admin.role}
                                            onChange={(e) =>
                                                handleRoleChange(
                                                    admin._id,
                                                    e.target.value
                                                )
                                            }
                                            className="border rounded px-2 py-1"
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="user">
                                                user
                                            </option>
                                        </select>
                                    </td>
                                    <td className="p-3 text-right">
                                        <button
                                            onClick={() =>
                                                handleDelete(admin._id)
                                            }
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageAdmin;
