import useSettingsData from "@/Admin/Hooks/useSettingsData";
import axios from "axios";
import { Toolbox } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const Footer = () => {
    const { settingsLoading, settingsData } = useSettingsData();
    const base_url = import.meta.env.VITE_BASE_URL;

    const [links, setLinks] = useState({ whatsapp: '', telegram: '', phone: '' });
    const [loading, setLoading] = useState(true);
    const footerLinks = [
        { label: "Home", path: "/" },
        { label: "Plans", path: "/plans" },
        { label: "Terms and Conditions", path: "/terms-and-conditions" },
        { label: "Privacy Policy", path: "/privacy-policy" },
    ];
    useEffect(() => {
        axios
            .get(`${base_url}/quick-links`)
            .then((res) => {
                const data = res.data || {};
                setLinks({
                    whatsapp: data.whatsapp || '',
                    telegram: data.telegram || '',
                    phone: data.phone || '',
                });
            })
            .catch((err) => console.error('Quick links fetch failed:', err))
            .finally(() => setLoading(false));
    }, []);

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
                            {footerLinks.map(({ label, path }) => (
                                <li key={label}>
                                    <Link
                                        to={path}
                                        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Support</h4>
                        <ul className="space-y-1 text-sm">
                            <li className="">
                                {/* whatsapp support */}
                                <a
                                    href={`${links.whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                >
                                    Whatsapp Support group
                                </a>
                            </li>
                            <li className="">
                                {/* telegram support */}
                                <a
                                    href={`${links.telegram}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                >
                                    Telegram Support chanel
                                </a>
                            </li>
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
                    © {new Date().getFullYear()} {settingsData?.webName}.. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
