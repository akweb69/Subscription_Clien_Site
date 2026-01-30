import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users as UsersIcon,
    Search,
    Loader2,
    Mail,
    User,
    Shield,
    Filter,
    ChevronDown,
    Eye,
    Trash2,
    MoreVertical,
    UserPlus,
    Download,
    RefreshCw,
    AlertCircle
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const Users = () => {
    const base_url = import.meta.env.VITE_BASE_URL;
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Load users from API
    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${base_url}/users`);
            if (res.data) {
                setUsers(res.data);
                setFilteredUsers(res.data);
            }
        } catch (error) {
            toast.error('Failed to load users');
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    // Refresh users
    const handleRefresh = async () => {
        setRefreshing(true);
        await loadUsers();
        setRefreshing(false);
        toast.success('Users refreshed!');
    };

    // Search functionality
    useEffect(() => {
        const filtered = users.filter(
            (user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    // Load users on mount
    useEffect(() => {
        loadUsers();
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1]
            }
        },
        hover: {
            y: -4,
            scale: 1.02,
            transition: {
                duration: 0.2
            }
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1]
            }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            transition: {
                duration: 0.2
            }
        }
    };

    // View user details
    const handleViewUser = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    // Delete user (placeholder)
    const handleDeleteUser = (userId) => {
        toast.error('Delete functionality not implemented');
    };

    // Export users to CSV
    const handleExport = () => {
        const csvContent = [
            ['Name', 'Email'],
            ...filteredUsers.map(user => [user.name, user.email])
        ]
            .map(row => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.csv';
        a.click();
        toast.success('Users exported!');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center ">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="inline-block mb-4"
                    >
                        <Loader2 className="w-16 h-16 text-teal-600" />
                    </motion.div>
                    <p className="text-slate-700 font-semibold text-lg">Loading users...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-6 px-4 sm:px-6 lg:px-8 rounded-xl">
            <Toaster position="top-right" />

            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <motion.div
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                                className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl shadow-teal-200"
                            >
                                <UsersIcon className="w-7 h-7 text-white" />
                            </motion.div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-teal-700 via-cyan-700 to-emerald-700 bg-clip-text text-transparent">
                                    Users
                                </h1>
                                <p className="text-slate-600 text-sm sm:text-base mt-1">
                                    {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="px-4 py-2.5 bg-white border-2 border-teal-200 text-teal-700 font-semibold rounded-xl hover:bg-teal-50 hover:border-teal-300 transition-all duration-200 shadow-md flex items-center gap-2"
                            >
                                <motion.div
                                    animate={refreshing ? { rotate: 360 } : {}}
                                    transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: 'linear' }}
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </motion.div>
                                <span className="hidden sm:inline">Refresh</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleExport}
                                className="px-4 py-2.5 bg-white border-2 border-cyan-200 text-cyan-700 font-semibold rounded-xl hover:bg-cyan-50 hover:border-cyan-300 transition-all duration-200 shadow-md flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">Export</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all duration-300 outline-none bg-white/80 backdrop-blur-sm shadow-lg text-slate-700 placeholder:text-slate-400"
                        />
                    </motion.div>
                </motion.div>

                {/* Users Grid */}
                {filteredUsers.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 text-center border-2 border-dashed border-slate-300"
                    >
                        <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No users found</h3>
                        <p className="text-slate-500">
                            {searchTerm ? 'Try adjusting your search terms' : 'No users available in the system'}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                    >
                        {filteredUsers.map((user, index) => (
                            <motion.div
                                key={user._id.$oid}
                                variants={cardVariants}
                                whileHover="hover"
                                className="group relative bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-slate-200/50 hover:shadow-2xl hover:border-teal-300/50 transition-all duration-300 overflow-hidden"
                            >
                                {/* Decorative gradient */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400" />

                                {/* User Avatar */}
                                <div className="flex items-start justify-between mb-4">
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                                    >
                                        {user.name.charAt(0).toUpperCase()}
                                    </motion.div>

                                    {/* Actions Menu */}
                                    <div className="flex gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleViewUser(user)}
                                            className="p-2 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="space-y-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-1 truncate">
                                            {user.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Mail className="w-4 h-4 text-teal-500" />
                                            <span className="truncate">{user.email}</span>
                                        </div>
                                    </div>

                                    {/* Password Indicator */}
                                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                                        <Shield className="w-4 h-4 text-emerald-500" />
                                        <span className="text-xs text-slate-500 font-medium">Password Protected</span>
                                    </div>
                                </div>

                                {/* Hover effect overlay */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-teal-400/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* User Details Modal */}
            <AnimatePresence>
                {showModal && selectedUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowModal(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-6 text-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold">
                                        {selectedUser.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold mb-1">{selectedUser.name}</h2>
                                        <p className="text-teal-100 text-sm">{selectedUser.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                                        <User className="w-5 h-5 text-teal-600 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                                                Full Name
                                            </p>
                                            <p className="text-slate-800 font-medium">{selectedUser.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                                        <Mail className="w-5 h-5 text-cyan-600 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                                                Email Address
                                            </p>
                                            <p className="text-slate-800 font-medium break-all">{selectedUser.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                                        <Shield className="w-5 h-5 text-emerald-600 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                                                User ID
                                            </p>
                                            <p className="text-slate-800 font-mono text-sm">{selectedUser._id.$oid}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Actions */}
                                <div className="flex gap-3 pt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                                    >
                                        Close
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            handleDeleteUser(selectedUser._id.$oid);
                                            setShowModal(false);
                                        }}
                                        className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Users;