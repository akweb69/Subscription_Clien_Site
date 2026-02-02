import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
    Pencil,
    Trash2,
    Check,
    X,
    RefreshCw,
} from 'lucide-react';

const EditCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const inputRef = useRef(null);

    const baseURL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${baseURL}/category`);
            setCategories(data || []);
        } catch (err) {
            toast.error('Could not load categories');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (editingId && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingId]);

    const startEditing = (cat) => {
        setEditingId(cat._id);
        setEditValue(cat.name);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditValue('');
    };

    const saveEdit = async () => {
        const trimmed = editValue.trim();
        if (!trimmed) return toast.error('Category name is required');

        const original = categories.find((c) => c._id === editingId);
        if (trimmed === original?.name) return cancelEdit();

        try {
            setSavingId(editingId);
            await axios.patch(`${baseURL}/category/${editingId}`, { name: trimmed });

            toast.success('Category updated');
            setCategories((prev) =>
                prev.map((c) => (c._id === editingId ? { ...c, name: trimmed } : c))
            );
            cancelEdit();
        } catch (err) {
            toast.error('Failed to update');
            console.error(err);
        } finally {
            setSavingId(null);
        }
    };

    const deleteCategory = async (id, name) => {
        if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;

        try {
            setDeletingId(id);
            await axios.delete(`${baseURL}/category/${id}`);
            toast.success('Category deleted');
            setCategories((prev) => prev.filter((c) => c._id !== id));
            if (editingId === id) cancelEdit();
        } catch (err) {
            toast.error('Failed to delete');
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/40 py-6 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Manage Categories
                    </h1>

                    <button
                        onClick={fetchCategories}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 
                     px-4 py-2 text-sm font-medium text-gray-700 
                     hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 
                     transition-colors touch-manipulation"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* Card */}
                <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                    <div className="border-b bg-gray-50 px-4 py-3 sm:px-5">
                        <h2 className="text-base font-semibold text-gray-700">
                            All Categories
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex min-h-[200px] items-center justify-center py-10">
                            <div className="flex items-center gap-3 text-gray-500">
                                <RefreshCw className="h-5 w-5 animate-spin" />
                                <span>Loading categories...</span>
                            </div>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 py-12 text-gray-500">
                            <p className="text-lg font-medium">No categories found</p>
                            <p className="text-sm">Add a new category to get started</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {categories.map((cat) => {
                                const isEditing = editingId === cat._id;
                                const isSaving = savingId === cat._id;
                                const isDeleting = deletingId === cat._id;

                                return (
                                    <li
                                        key={cat._id}
                                        className={`px-4 py-3.5 sm:px-5 transition-colors ${isEditing ? 'bg-blue-50/60' : 'hover:bg-gray-50 active:bg-gray-100'
                                            }`}
                                    >
                                        {isEditing ? (
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                                <input
                                                    ref={inputRef}
                                                    type="text"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') saveEdit();
                                                        if (e.key === 'Escape') cancelEdit();
                                                    }}
                                                    disabled={isSaving}
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm 
                                   focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                                   disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                    placeholder="Category name"
                                                />

                                                <div className="flex items-center gap-2 sm:gap-2.5 mt-3 sm:mt-0">
                                                    <button
                                                        onClick={saveEdit}
                                                        disabled={isSaving || !editValue.trim()}
                                                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 
                                     h-10 sm:h-9 px-4 sm:px-3 rounded-lg bg-green-600 
                                     text-white hover:bg-green-700 disabled:bg-green-400 
                                     disabled:cursor-not-allowed transition-colors font-medium"
                                                    >
                                                        {isSaving ? (
                                                            <RefreshCw className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Check className="h-4 w-4" />
                                                        )}
                                                        <span className="sm:hidden">Save</span>
                                                    </button>

                                                    <button
                                                        onClick={cancelEdit}
                                                        disabled={isSaving}
                                                        className="flex-1 sm:flex-none flex items-center justify-center h-10 sm:h-9 
                                     px-4 sm:px-3 rounded-lg border border-gray-300 
                                     hover:bg-gray-100 disabled:opacity-50 transition-colors"
                                                    >
                                                        <X className="h-4 w-4 text-gray-600" />
                                                        <span className="sm:hidden ml-1.5">Cancel</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                <div className="font-medium text-gray-900 break-words hyphens-auto">
                                                    {cat.name}
                                                </div>

                                                <div className="flex items-center gap-2 sm:gap-1.5">
                                                    <button
                                                        onClick={() => startEditing(cat)}
                                                        disabled={isDeleting}
                                                        className="flex items-center justify-center h-9 w-9 sm:h-8 sm:w-8 
                                     rounded-lg text-blue-600 hover:bg-blue-50 
                                     disabled:opacity-40 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="h-4.5 w-4.5" />
                                                    </button>

                                                    <button
                                                        onClick={() => deleteCategory(cat._id, cat.name)}
                                                        disabled={isDeleting || isSaving}
                                                        className="flex items-center justify-center h-9 w-9 sm:h-8 sm:w-8 
                                     rounded-lg text-red-600 hover:bg-red-50 
                                     disabled:opacity-40 transition-colors"
                                                        title="Delete"
                                                    >
                                                        {isDeleting ? (
                                                            <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-4.5 w-4.5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditCategory;