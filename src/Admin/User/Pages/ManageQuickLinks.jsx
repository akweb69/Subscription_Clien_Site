import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Loader2, Link as LinkIcon, MessageCircle, Send, Facebook } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const ManageQuickLinks = () => {
    const base_url = import.meta.env.VITE_BASE_URL;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [whatsappLink, setWhatsappLink] = useState('');
    const [telegramLink, setTelegramLink] = useState('');
    const [facebookLink, setFacebookLink] = useState('');
    const [originalData, setOriginalData] = useState({});

    // Fetch current quick links on mount
    useEffect(() => {
        fetchQuickLinks();
    }, []);

    const fetchQuickLinks = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${base_url}/quick-links`);

            // Assuming the backend returns the latest/single document
            // Adjust field names if your document structure is different
            const data = res.data || {};

            setWhatsappLink(data.whatsapp || '');
            setTelegramLink(data.telegram || '');
            setFacebookLink(data.facebook || '');

            // Store original values to detect real changes
            setOriginalData({
                whatsapp: data.whatsapp || '',
                telegram: data.telegram || '',
                facebook: data.facebook || '',
            });
        } catch (err) {
            console.error("Failed to load quick links:", err);
            toast.error("Failed to load links");
        } finally {
            setLoading(false);
        }
    };

    const hasChanges = () => {
        return (
            whatsappLink.trim() !== originalData.whatsapp ||
            telegramLink.trim() !== originalData.telegram ||
            facebookLink.trim() !== originalData.facebook
        );
    };

    const handleSave = async () => {
        // Optional: basic URL validation
        const links = {
            whatsapp: whatsappLink.trim(),
            telegram: telegramLink.trim(),
            facebook: facebookLink.trim(),
        };

        // You can add more strict validation if needed
        if (links.whatsapp && !links.whatsapp.includes('whatsapp.com')) {
            toast.error("WhatsApp link should contain 'whatsapp.com'");
            return;
        }

        setSaving(true);
        const toastId = toast.loading("Saving quick links...");

        try {
            // If you want to always update the same document, use upsert or findOneAndUpdate
            // Here we assume you're using a single document (or the backend handles it)
            const res = await axios.post(`${base_url}/quick-links`, links, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.data?.acknowledged || res.status < 300) {
                toast.success("Quick links updated!", { id: toastId });

                // Update original data after successful save
                setOriginalData({
                    whatsapp: links.whatsapp,
                    telegram: links.telegram,
                    facebook: links.facebook,
                });
            } else {
                throw new Error("Save failed");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to save links", { id: toastId });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100"
        >
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Manage Quick Links</h1>
                <p className="text-gray-600 mt-1">
                    Update WhatsApp, Telegram, and Facebook links shown to users
                </p>
            </div>

            <div className="space-y-6">
                {/* WhatsApp */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <MessageCircle className="h-4 w-4 text-green-600" />
                        WhatsApp Support Link
                    </label>
                    <div className="relative">
                        <Input
                            value={whatsappLink}
                            onChange={(e) => setWhatsappLink(e.target.value)}
                            placeholder="https://wa.me/8801xxxxxxxxx or https://chat.whatsapp.com/..."
                            className="pl-10"
                            disabled={saving}
                        />
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                </div>

                {/* Telegram */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Send className="h-4 w-4 text-blue-500" />
                        Telegram Channel/Group Link
                    </label>
                    <div className="relative">
                        <Input
                            value={telegramLink}
                            onChange={(e) => setTelegramLink(e.target.value)}
                            placeholder="https://t.me/yourchannel or https://t.me/+..."
                            className="pl-10"
                            disabled={saving}
                        />
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                </div>

                {/* Facebook */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Facebook className="h-4 w-4 text-blue-600" />
                        Facebook Page/Group Link
                    </label>
                    <div className="relative">
                        <Input
                            value={facebookLink}
                            onChange={(e) => setFacebookLink(e.target.value)}
                            placeholder="https://www.facebook.com/yourpage"
                            className="pl-10"
                            disabled={saving}
                        />
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={fetchQuickLinks}
                        disabled={saving}
                    >
                        Reset / Reload
                    </Button>

                    <Button
                        onClick={handleSave}
                        disabled={saving || !hasChanges()}
                        className="bg-emerald-600 hover:bg-emerald-700 min-w-[140px]"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default ManageQuickLinks;