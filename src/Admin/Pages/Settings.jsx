import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Save,
    Loader2,
    Smartphone,
    Globe,
    MapPin,
    Phone,
    Mail,
    Clock,
    Settings as SettingsIcon,
    CheckCircle2
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const Settings = () => {
    const base_url = import.meta.env.VITE_BASE_URL;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // MFS numbers
    const [bkash, setBkash] = useState('');
    const [nagad, setNagad] = useState('');
    const [rocket, setRocket] = useState('');
    const [upay, setUpay] = useState('');

    // Other fields
    const [webName, setWebName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [supportEmail, setSupportEmail] = useState('');
    const [serviceTime, setServiceTime] = useState('');

    const [runningSettings, setRunningSettings] = useState({});

    const handleSettings = async () => {
        setSaving(true);
        try {
            const finalData = {
                bkash,
                nagad,
                rocket,
                upay,
                webName,
                address,
                phone,
                supportEmail,
                serviceTime,
                runningSettings
            };
            const res = await axios.post(`${base_url}/settings`, finalData);
            if (res.data.acknowledged) {
                toast.success('Settings updated successfully!', {
                    icon: '✨',
                    style: {
                        borderRadius: '12px',
                        background: '#10b981',
                        color: '#fff',
                    },
                });
            } else {
                toast.error('Something went wrong!');
            }
        } catch (error) {
            toast.error('Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    const loadRunningSettings = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${base_url}/settings`);
            if (res.data) {
                setBkash(res.data.bkash || '');
                setNagad(res.data.nagad || '');
                setRocket(res.data.rocket || '');
                setUpay(res.data.upay || '');

                setWebName(res.data.webName || '');
                setAddress(res.data.address || '');
                setPhone(res.data.phone || '');
                setSupportEmail(res.data.supportEmail || '');
                setServiceTime(res.data.serviceTime || '');

                setRunningSettings(res.data.runningSettings || {});
            }
        } catch (error) {
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRunningSettings();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const formFields = [
        {
            id: 'bkash',
            label: 'bKash Number',
            value: bkash,
            setValue: setBkash,
            icon: Smartphone,
            placeholder: '+880 1XXX-XXXXXX',
            type: 'tel'
        },
        {
            id: 'nagad',
            label: 'Nagad Number',
            value: nagad,
            setValue: setNagad,
            icon: Smartphone,
            placeholder: '+880 1XXX-XXXXXX',
            type: 'tel'
        },
        {
            id: 'rocket',
            label: 'Rocket Number',
            value: rocket,
            setValue: setRocket,
            icon: Smartphone,
            placeholder: '+880 1XXX-XXXXXX',
            type: 'tel'
        },
        {
            id: 'upay',
            label: 'Upay Number',
            value: upay,
            setValue: setUpay,
            icon: Smartphone,
            placeholder: '+880 1XXX-XXXXXX',
            type: 'tel'
        },
        {
            id: 'webName',
            label: 'Website Name',
            value: webName,
            setValue: setWebName,
            icon: Globe,
            placeholder: 'Enter website name',
            type: 'text'
        },
        {
            id: 'address',
            label: 'Business Address',
            value: address,
            setValue: setAddress,
            icon: MapPin,
            placeholder: 'Enter full address',
            type: 'text'
        },
        {
            id: 'phone',
            label: 'Contact Phone',
            value: phone,
            setValue: setPhone,
            icon: Phone,
            placeholder: '+880 1XXX-XXXXXX',
            type: 'tel'
        },
        {
            id: 'supportEmail',
            label: 'Support Email',
            value: supportEmail,
            setValue: setSupportEmail,
            icon: Mail,
            placeholder: 'support@example.com',
            type: 'email'
        },
        {
            id: 'serviceTime',
            label: 'Service Hours',
            value: serviceTime,
            setValue: setServiceTime,
            icon: Clock,
            placeholder: '9:00 AM - 6:00 PM',
            type: 'text'
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
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
                        <Loader2 className="w-12 h-12 text-indigo-600" />
                    </motion.div>
                    <p className="text-slate-600 font-medium">Loading settings...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8 rounded-lg">
            <Toaster position="top-right" />

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className=""
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
                    <div className="flex items-center gap-4 mb-3">
                        <motion.div
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.6, ease: 'easeInOut' }}
                            className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200"
                        >
                            <SettingsIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </motion.div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 py-2 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                                Settings
                            </h1>
                            <p className="text-slate-600 text-sm sm:text-base mt-1">
                                Manage your application configuration
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Settings Form */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-100/50 border border-white/60 overflow-hidden"
                >
                    <div className="p-6 sm:p-8 lg:p-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                            {formFields.map((field, index) => {
                                const Icon = field.icon;
                                return (
                                    <motion.div
                                        key={field.id}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                        className="relative group"
                                    >
                                        <label
                                            htmlFor={field.id}
                                            className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2"
                                        >
                                            <Icon className="w-4 h-4 text-indigo-600" />
                                            {field.label}
                                        </label>
                                        <div className="relative">
                                            <input
                                                id={field.id}
                                                type={field.type}
                                                value={field.value}
                                                onChange={(e) => field.setValue(e.target.value)}
                                                placeholder={field.placeholder}
                                                className="w-full px-4 py-3 sm:py-3.5 rounded-xl border-2 border-slate-200 
                                 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 
                                 transition-all duration-300 outline-none bg-white/50
                                 text-slate-800 placeholder:text-slate-400
                                 group-hover:border-indigo-300"
                                            />
                                            <motion.div
                                                className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 -z-10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Save Button */}
                        <motion.div
                            variants={itemVariants}
                            className="mt-8 lg:mt-10 flex justify-end"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSettings}
                                disabled={saving}
                                className="relative px-8 py-3.5 sm:px-10 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 
                         text-white font-semibold rounded-xl shadow-xl shadow-indigo-300/40
                         hover:shadow-2xl hover:shadow-indigo-400/50 transition-all duration-300
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
                         overflow-hidden group"
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                />
                                <span className="relative flex items-center gap-2 text-sm sm:text-base">
                                    {saving ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            >
                                                <Loader2 className="w-5 h-5" />
                                            </motion.div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Save Settings
                                        </>
                                    )}
                                </span>
                            </motion.button>
                        </motion.div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl -z-10" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl -z-10" />
                </motion.div>

                {/* Info Card */}
                <motion.div
                    variants={itemVariants}
                    className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 border border-blue-200/50"
                >
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-slate-800 text-sm sm:text-base mb-1">
                                Auto-save enabled
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600">
                                Your changes will be saved automatically. Make sure all information is accurate before saving.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Settings;