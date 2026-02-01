import useSettingsData from "@/Admin/Hooks/useSettingsData";
import { Toolbox } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";


const Footer = () => {
    const { settingsLoading, settingsData } = useSettingsData()
    return (
        <footer className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 pt-16 pb-8 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Toolbox className="w-6 h-6 text-indigo-600" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{settingsData?.webName}</h3>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Premium digital subscriptions that give you access to the best online learning platforms.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Quick Links</h4>
                        <ul className="space-y-1 text-sm">
                            {["Home", "Plans"].map((link) => (
                                <li key={link}>
                                    <Link
                                        to={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                                        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    >
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Legal</h4>
                        <ul className="space-y-1 text-sm">
                            {["Terms of Service", "Privacy Policy"].map((link) => (
                                <li key={link}>
                                    <a
                                        href="#"
                                        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Contact</h4>
                        <p className="text-sm">Email: {settingsData?.supportEmail}</p>
                        <p className="text-sm">Phone: {settingsData?.phone}</p>
                        <p className="text-sm">Service Time: {settingsData?.serviceTime}</p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
                    © {new Date().getFullYear()} Master Tools BD. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
