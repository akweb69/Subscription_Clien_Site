import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManageSubs_Category = () => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [runningCategory, setRunningCategory] = useState([]);
    const [newCategory, setNewCategory] = useState('');

    const baseURL = import.meta.env.VITE_BASE_URL;

    // Load categories
    const loadCategory = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${baseURL}/category`);
            setRunningCategory(res.data || []);
        } catch (error) {
            toast.error('Failed to load categories');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategory();
    }, []);

    // Add new category
    const handleAddNewCategory = async () => {
        if (!newCategory.trim()) {
            toast.error('Category name is required');
            return;
        }

        try {
            setSubmitting(true);
            await axios.post(`${baseURL}/category`, {
                name: newCategory.trim(),
            });

            toast.success('Category added successfully!');
            setNewCategory('');
            loadCategory();
        } catch (error) {
            toast.error('Failed to add category');
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full p-4 bg-green-200 rounded-lg md:p-6">
            <div className="max-w-3xl mx-auto p-4 bg-green-50 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">
                    Manage Subscription Categories
                </h2>

                {/* Add Category */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Enter new category name"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />

                    <button
                        onClick={handleAddNewCategory}
                        disabled={submitting}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        {submitting ? 'Adding...' : 'Add'}
                    </button>
                </div>

                {/* Category List */}
                <div className="bg-white rounded-xl shadow-sm border">
                    <div className="px-4 py-3 border-b font-medium text-sm">
                        Running Categories
                    </div>

                    {loading ? (
                        <div className="p-4 text-sm text-gray-500">
                            Loading categories...
                        </div>
                    ) : runningCategory.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500">
                            No categories found
                        </div>
                    ) : (
                        <ul className="divide-y">
                            {runningCategory.map((cat, index) => (
                                <li
                                    key={cat._id || index}
                                    className="px-4 py-3 text-sm flex justify-between items-center"
                                >
                                    <span>{cat.name}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageSubs_Category;
