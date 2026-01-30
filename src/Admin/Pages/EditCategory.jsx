import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Lucide icons – import only what we use (tree-shakable)
import {
    Pencil,
    Trash2,
    Check,
    X,
    RefreshCw,
    AlertTriangle, // optional – for emphasis if you want
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

    // ────────────────────────────────────────────────
    // Fetch
    // ────────────────────────────────────────────────
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
        fetchCategories();
    }, []);

    // Auto-focus & select when editing starts
    useEffect(() => {
        if (editingId && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingId]);

    // ────────────────────────────────────────────────
    // Actions
    // ────────────────────────────────────────────────
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
        if (!trimmed) {
            toast.error('Category name is required');
            return;
        }
        if (trimmed === categories.find((c) => c._id === editingId)?.name) {
            cancelEdit();
            return;
        }

        try {
            setSavingId(editingId);
            await axios.patch(`${baseURL}/category/${editingId}`, { name: trimmed });

            toast.success('Category updated');
            setCategories((prev) =>
                prev.map((c) => (c._id === editingId ? { ...c, name: trimmed } : c))
            );
            cancelEdit();
        } catch (err) {
            toast.error('Failed to update category');
            console.error(err);
        } finally {
            setSavingId(null);
        }
    };

    const deleteCategory = async (id, name) => {
        if (
            !window.confirm(
                `Delete category "${name}"?\nThis cannot be undone.`
            )
        ) {
            return;
        }

        try {
            setDeletingId(id);
            await axios.delete(`${baseURL}/category/${id}`);
            toast.success('Category deleted');
            setCategories((prev) => prev.filter((c) => c._id !== id));
            if (editingId === id) cancelEdit();
        } catch (err) {
            toast.error('Failed to delete category');
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    // ────────────────────────────────────────────────
    // Render
    // ────────────────────────────────────────────────
    return (
        <div className="mx-auto max-w-2xl px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    Manage Categories
                </h1>

                <button
                    onClick={fetchCategories}
                    disabled={loading}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                    />
                    Refresh
                </button>
            </div>

            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                {/* Header */}
                <div className="border-b bg-gray-50 px-5 py-3">
                    <h2 className="text-sm font-semibold text-gray-700">
                        All Categories
                    </h2>
                </div>

                {/* Body */}
                {loading ? (
                    <div className="flex min-h-[180px] items-center justify-center py-12">
                        <div className="flex items-center gap-3 text-gray-500">
                            <RefreshCw className="h-5 w-5 animate-spin" />
                            <span>Loading categories...</span>
                        </div>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 py-12 text-gray-500">
                        <p>No categories found</p>
                        <p className="text-sm">Create one to get started</p>
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
                                    className={`px-5 py-3.5 transition-colors ${isEditing ? 'bg-blue-50/50' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    {isEditing ? (
                                        <div className="flex items-center gap-3">
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
                                                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                placeholder="Enter category name"
                                            />

                                            <button
                                                onClick={saveEdit}
                                                disabled={isSaving || !editValue.trim()}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 transition-colors"
                                                title="Save changes (⏎)"
                                            >
                                                {isSaving ? (
                                                    <RefreshCw className="h-5 w-5 animate-spin" />
                                                ) : (
                                                    <Check className="h-5 w-5" />
                                                )}
                                            </button>

                                            <button
                                                onClick={cancelEdit}
                                                disabled={isSaving}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                                                title="Cancel (Esc)"
                                            >
                                                <X className="h-5 w-5 text-gray-600" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-900">{cat.name}</span>

                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() => startEditing(cat)}
                                                    disabled={isDeleting}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 disabled:opacity-40 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4.5 w-4.5" />
                                                </button>

                                                <button
                                                    onClick={() => deleteCategory(cat._id, cat.name)}
                                                    disabled={isDeleting || isSaving}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-40 transition-colors"
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
    );
};

export default EditCategory;