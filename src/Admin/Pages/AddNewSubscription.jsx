import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
    Save,
    Loader2,
    AlertCircle,
    Calendar,
    DollarSign,
    FileText,
    Globe,
    Star,
    Tag,
} from 'lucide-react';
import useCategory from '../Hooks/useCategory';

const AddNewSubscription = () => {
    const { categoryLoading, categoryData } = useCategory();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [platforms, setPlatforms] = useState([]);
    const [cookiePlatforms, setCookiePlatforms] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        validityDays: '',
        price: '',
        isMostPopular: false,
        description: '',
        selectedPlatforms: [],
        selectedCookiePlatforms: [],
        category: '',
    });

    // Fetch both platforms
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [platformsRes, cookiesRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_BASE_URL}/platform`),
                    axios.get(`${import.meta.env.VITE_BASE_URL}/add_cockies_platform`),
                ]);

                setPlatforms(platformsRes.data || []);
                setCookiePlatforms(cookiesRes.data || []);
            } catch (err) {
                console.error('Failed to load platforms:', err);
                toast.error('Failed to load platforms / cookie platforms');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (error) setError('');
    };

    const handlePlatformToggle = (platformId) => {
        setFormData((prev) => {
            const list = prev.selectedPlatforms;
            if (list.includes(platformId)) {
                return {
                    ...prev,
                    selectedPlatforms: list.filter((id) => id !== platformId),
                };
            }
            return {
                ...prev,
                selectedPlatforms: [...list, platformId],
            };
        });
    };

    const handleCookiePlatformToggle = (cookieId) => {
        setFormData((prev) => {
            const list = prev.selectedCookiePlatforms;
            if (list.includes(cookieId)) {
                return {
                    ...prev,
                    selectedCookiePlatforms: list.filter((id) => id !== cookieId),
                };
            }
            return {
                ...prev,
                selectedCookiePlatforms: [...list, cookieId],
            };
        });
    };

    const validateForm = () => {
        if (!formData.name.trim()) return 'Subscription name is required';
        if (!formData.validityDays || Number(formData.validityDays) <= 0)
            return 'Please enter a valid number of days';
        if (!formData.price || Number(formData.price) <= 0)
            return 'Please enter a valid price';
        if (!formData.description.trim()) return 'Description is required';
        if (formData.selectedPlatforms.length === 0)
            return 'Select at least one platform';
        if (formData.selectedCookiePlatforms.length === 0)
            return 'Select at least one cookie platform';
        if (!formData.category) return 'Please select a category';
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            toast.error(validationError);
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const payload = {
                subscriptionName: formData.name.trim(),
                validityDays: Number(formData.validityDays),
                price: Number(formData.price),
                isMostPopular: formData.isMostPopular,
                subscriptionDescription: formData.description.trim(),
                selectedPlan: formData.selectedPlatforms,
                selectedCookiePlatforms: formData.selectedCookiePlatforms,
                category: formData.category,
            };

            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/subscription`,
                payload
            );

            if (response.data?.acknowledged) {
                toast.success('Subscription plan created successfully!');

                setFormData({
                    name: '',
                    validityDays: '',
                    price: '',
                    isMostPopular: false,
                    description: '',
                    selectedPlatforms: [],
                    selectedCookiePlatforms: [],
                    category: '',
                });
            } else {
                throw new Error(response.data?.message || 'Failed to create');
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Something went wrong';
            setError(message);
            toast.error(message);
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const isFormDisabled = submitting || loading || categoryLoading;

    return (
        <div className="min-h-screen bg-green-50/70 rounded-xl md:p-4 sm:p-6">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Create New Subscription Plan
                </h1>
                <p className="mt-2 text-gray-600">
                    Add a new subscription package for your users
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-4 sm:p-8">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700"
                        >
                            <AlertCircle size={20} />
                            <p>{error}</p>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Plan Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Plan Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Premium Monthly"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    disabled={isFormDisabled}
                                />
                            </div>
                        </div>

                        {/* Validity */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Validity (days) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="number"
                                    name="validityDays"
                                    value={formData.validityDays}
                                    onChange={handleChange}
                                    min="1"
                                    placeholder="30"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    disabled={isFormDisabled}
                                />
                            </div>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Price (BDT) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    min="0.01"
                                    step="0.01"
                                    placeholder="999"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    disabled={isFormDisabled}
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                {categoryLoading ? (
                                    <div className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                                        Loading categories...
                                    </div>
                                ) : (
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                                        disabled={isFormDisabled}
                                    >
                                        <option value="">Select a category</option>
                                        {categoryData?.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>

                        {/* Most Popular */}
                        <div className="md:col-span-2 flex items-center gap-3 py-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="isMostPopular"
                                    checked={formData.isMostPopular}
                                    onChange={handleChange}
                                    disabled={isFormDisabled}
                                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <div className="flex items-center gap-2">
                                    <Star
                                        size={18}
                                        className={`${formData.isMostPopular ? 'text-amber-500 fill-amber-500' : 'text-gray-400'
                                            } group-hover:text-amber-400 transition-colors`}
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Mark as "Most Popular" plan
                                    </span>
                                </div>
                            </label>
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Describe what this subscription includes..."
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all"
                                disabled={isFormDisabled}
                            />
                        </div>

                        {/* Regular Platforms */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2.5">
                                Included Platforms <span className="text-red-500">*</span>
                            </label>

                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="animate-spin text-blue-600" size={32} />
                                </div>
                            ) : platforms.length === 0 ? (
                                <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                                    No platforms available
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {platforms.map((platform) => (
                                        <motion.button
                                            key={platform._id}
                                            type="button"
                                            onClick={() => handlePlatformToggle(platform._id)}
                                            whileTap={{ scale: 0.96 }}
                                            className={`
                        flex flex-col items-center justify-center p-4 rounded-xl border-2 h-full transition-all duration-200
                        ${formData.selectedPlatforms.includes(platform._id)
                                                    ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-200 shadow-sm'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                      `}
                                            disabled={submitting}
                                        >
                                            <Globe
                                                size={28}
                                                className={formData.selectedPlatforms.includes(platform._id) ? 'text-blue-600' : 'text-gray-500'}
                                            />
                                            <span className="mt-3 text-sm font-medium text-center leading-tight">
                                                {platform.platformName}
                                            </span>
                                        </motion.button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ────────────────────────────────────────────── */}
                        {/*          COOKIE PLATFORMS SECTION             */}
                        {/* ────────────────────────────────────────────── */}

                        <div className="md:col-span-2 mt-8">
                            <label className="block text-sm font-medium text-gray-700 mb-2.5">
                                Included Cookie Platforms <span className="text-red-500">*</span>
                            </label>

                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="animate-spin text-blue-600" size={32} />
                                </div>
                            ) : cookiePlatforms.length === 0 ? (
                                <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                                    No cookie platforms available
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {cookiePlatforms.map((cp) => (
                                        <motion.button
                                            key={cp._id}
                                            type="button"
                                            onClick={() => handleCookiePlatformToggle(cp._id)}
                                            whileTap={{ scale: 0.96 }}
                                            className={`
                        flex flex-col items-center justify-center p-4 rounded-xl border-2 h-full transition-all duration-200
                        ${formData.selectedCookiePlatforms.includes(cp._id)
                                                    ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-200 shadow-sm'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                      `}
                                            disabled={submitting}
                                        >
                                            <Globe
                                                size={28}
                                                className={formData.selectedCookiePlatforms.includes(cp._id) ? 'text-indigo-600' : 'text-gray-500'}
                                            />
                                            <span className="mt-3 text-sm font-medium text-center leading-tight">
                                                {cp.p_name || cp.platformName || 'Unnamed'}
                                            </span>
                                        </motion.button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-10 flex justify-end">
                        <button
                            type="submit"
                            disabled={isFormDisabled}
                            className={`
                flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-white transition-all shadow-md
                ${isFormDisabled
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}
              `}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Create Plan
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNewSubscription;