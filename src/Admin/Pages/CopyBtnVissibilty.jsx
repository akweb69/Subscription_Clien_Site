import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff, RefreshCw, CheckCircle, XCircle, Loader2 } from "lucide-react";

const CopyBtnVisibility = () => {
    const base_url = import.meta.env.VITE_BASE_URL;

    const [loading, setLoading] = useState(false);
    const [runningData, setRunningData] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Load current visibility status
    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get(`${base_url}/copy-btn`);
            if (res?.data) {
                setRunningData(res.data);
            }
        } catch (error) {
            console.error("Failed to load copy button visibility", error);
            setError("Failed to load current settings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Update visibility
    const handleUpdateVisibility = async () => {
        if (!runningData) return;

        try {
            setUpdating(true);
            setError(null);
            await axios.post(`${base_url}/copy-btn`, {
                copy_btn_visibility: !runningData.copy_btn_visibility,
            });
            await loadData();

            // Show success message
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error("Failed to update visibility", error);
            setError("Failed to update visibility settings");
        } finally {
            setUpdating(false);
        }
    };

    const isVisible = runningData?.copy_btn_visibility;

    return (
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-4">
                <h3 className="font-semibold text-white text-lg flex items-center gap-2">
                    {isVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    Copy Button Visibility Control
                </h3>
            </div>

            <div className="p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
                    </div>
                ) : (
                    <>
                        {/* Current Status Display */}
                        <div className="bg-white rounded-lg p-6 mb-6 border-l-4 border-rose-500 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Current Status</p>
                                    <div className="flex items-center gap-3">
                                        {isVisible ? (
                                            <>
                                                <div className="p-2 bg-green-100 rounded-lg">
                                                    <Eye className="w-6 h-6 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-bold text-green-600">Visible</p>
                                                    <p className="text-xs text-gray-500">Users can see the copy button</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="p-2 bg-gray-100 rounded-lg">
                                                    <EyeOff className="w-6 h-6 text-gray-600" />
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-bold text-gray-600">Hidden</p>
                                                    <p className="text-xs text-gray-500">Copy button is not visible to users</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className={`px-4 py-2 rounded-full ${isVisible
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    <span className="font-medium text-sm">
                                        {isVisible ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Success Message */}
                        {showSuccess && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-green-800">
                                        Settings updated successfully!
                                    </p>
                                    <p className="text-xs text-green-600">
                                        Copy button is now {isVisible ? 'visible' : 'hidden'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center gap-3">
                                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-red-800">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            {/* Toggle Button */}
                            <button
                                onClick={handleUpdateVisibility}
                                disabled={updating || loading}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 ${isVisible
                                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-md'
                                    : 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-md'
                                    }`}
                            >
                                {updating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Updating...</span>
                                    </>
                                ) : (
                                    <>
                                        {isVisible ? (
                                            <>
                                                <EyeOff className="w-5 h-5" />
                                                <span>Hide Copy Button</span>
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="w-5 h-5" />
                                                <span>Show Copy Button</span>
                                            </>
                                        )}
                                    </>
                                )}
                            </button>

                            {/* Refresh Button */}
                            <button
                                onClick={loadData}
                                disabled={loading || updating}
                                className="px-4 py-3 bg-white border-2 border-rose-200 text-rose-600 rounded-lg font-medium hover:bg-rose-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                title="Refresh status"
                            >
                                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        {/* Info Box */}
                        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800 font-medium mb-2">ℹ️ Information</p>
                            <ul className="text-xs text-blue-700 space-y-1">
                                <li>• Changes take effect immediately for all users</li>
                                <li>• This controls the visibility of the copy button across the application</li>
                                <li>• Use the refresh button to verify the current status</li>
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CopyBtnVisibility;