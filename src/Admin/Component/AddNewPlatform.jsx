import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";


const AddNewPlatform = () => {
    const [platformName, setPlatformName] = useState("");
    const [platformEmail, setPlatformEmail] = useState("");
    const [platformPassword, setPlatformPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const base_url = import.meta.env.VITE_BASE_URL


    // submit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!platformName || !platformEmail || !platformPassword) {
            setErrorMessage("All fields are required");
            return;
        }

        try {
            setLoading(true);

            // demo submit
            console.log({
                platformName,
                platformEmail,
                platformPassword,
            });
            const res = await axios.post(`${base_url}/platform`, {
                platformName,
                platformEmail,
                platformPassword
            })
            if (res.data.acknowledged) {
                console.log(res);
                toast.success("Platform added successfully!");
                // reset form
                setPlatformName("");
                setPlatformEmail("");
                setPlatformPassword("");
            }
            else {
                toast.error("Something went wrong!");
                setErrorMessage("Something went wrong!");
            }

        } catch (err) {
            setErrorMessage("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full rounded-xl bg-emerald-50 p-4 md:p-6 shadow-sm"
        >
            {/* Header */}
            <div className="mb-4">
                <h1 className="text-xl font-semibold text-emerald-700">
                    Add New Platform
                </h1>
                <p className="text-sm text-emerald-600">
                    Create a new platform account
                </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-3 rounded-md bg-red-100 px-3 py-2 text-sm text-red-600"
                >
                    {errorMessage}
                </motion.p>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    className="bg-white h-12"
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                    type="text"
                    placeholder="Platform Name"
                    disabled={loading}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        className="bg-white h-12"
                        value={platformEmail}
                        onChange={(e) => setPlatformEmail(e.target.value)}
                        type="email"
                        placeholder="Platform Email"
                        disabled={loading}
                    />

                    {/* Password with Eye Toggle */}
                    <div className="relative">
                        <Input
                            className="bg-white h-12 pr-10"
                            value={platformPassword}
                            onChange={(e) => setPlatformPassword(e.target.value)}
                            type={showPassword ? "text" : "password"}
                            placeholder="Platform Password"
                            disabled={loading}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>


                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 h-12 hover:bg-emerald-700"
                >
                    {loading ? "Adding Platform..." : "Add New Platform"}
                </Button>
            </form>
        </motion.div>
    );
};

export default AddNewPlatform;
