import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Link2 } from "lucide-react"; // added Link2 icon
import axios from "axios";
import toast from "react-hot-toast";

const AddNewPlatform = () => {
    const [platformName, setPlatformName] = useState("");
    const [platformEmail, setPlatformEmail] = useState("");
    const [platformPassword, setPlatformPassword] = useState("");
    const [platformLink, setPlatformLink] = useState(""); // ← new field
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const base_url = import.meta.env.VITE_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        // validation
        if (!platformName || !platformEmail || !platformPassword || !platformLink) {
            setErrorMessage("All fields are required");
            toast.error("Please fill all fields");
            return;
        }

        // optional: basic URL validation
        try {
            new URL(platformLink);
        } catch {
            setErrorMessage("Please enter a valid URL (e.g. https://example.com)");
            toast.error("Invalid platform link");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                platformName,
                platformEmail,
                platformPassword,
                platformLink, // ← added here
            };

            const res = await axios.post(`${base_url}/platform`, payload);

            if (res.data?.acknowledged || res.status === 201) {
                toast.success("Platform added successfully!");

                // reset form
                setPlatformName("");
                setPlatformEmail("");
                setPlatformPassword("");
                setPlatformLink("");
            } else {
                throw new Error("Unexpected response");
            }
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || "Something went wrong!";
            setErrorMessage(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full rounded-xl bg-emerald-50  md:p-6 shadow-sm"
        >
            {/* Header */}
            <div className="mb-5">
                <h1 className="text-xl font-semibold text-emerald-800">
                    Add New Platform
                </h1>
                <p className="text-sm text-emerald-700 mt-1">
                    Create a new platform account with login details
                </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
                >
                    {errorMessage}
                </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Platform Name */}
                <Input
                    className="bg-white h-12"
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                    type="text"
                    placeholder="Platform Name (e.g. Facebook, Netflix)"
                    disabled={loading}
                />

                {/* Link + Email + Password grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Platform Link – new field */}
                    <div className="relative">
                        <Input
                            className="bg-white h-12 pl-10"
                            value={platformLink}
                            onChange={(e) => setPlatformLink(e.target.value.trim())}
                            type="url"
                            placeholder="Platform Link[](https://...)"
                            disabled={loading}
                        />
                        <Link2
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600"
                            size={18}
                        />
                    </div>

                    {/* Email */}
                    <Input
                        className="bg-white h-12"
                        value={platformEmail}
                        onChange={(e) => setPlatformEmail(e.target.value)}
                        type="email"
                        placeholder="Platform Email / Username"
                        disabled={loading}
                    />

                    {/* Password with toggle */}
                    <div className="relative">
                        <Input
                            className="bg-white h-12 pr-11"
                            value={platformPassword}
                            onChange={(e) => setPlatformPassword(e.target.value)}
                            type={showPassword ? "text" : "password"}
                            placeholder="Platform Password"
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-700 transition-colors"
                            disabled={loading}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-base font-medium transition-all"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Adding Platform...
                        </div>
                    ) : (
                        "Add New Platform"
                    )}
                </Button>
            </form>
        </motion.div>
    );
};

export default AddNewPlatform;