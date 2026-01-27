"use client";

import React from "react";

const GitHubIcon = ({ size = 24, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.835 2.809 1.305 3.492.998.108-.776.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.046.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
);

const TwitterIcon = ({ size = 24, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const LinkedInIcon = ({ size = 24, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

const AsterDeskLogo = () => (
    <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            AD
        </div>
        <h3 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
            AsterDesk
        </h3>
    </div>
);

const Footer = () => {
    return (
        <footer className="bg-gradient-to-b from-gray-950 via-indigo-950 to-violet-950 text-gray-300 pt-16 pb-10 border-t border-violet-900/30 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
                    {/* Brand + Newsletter */}
                    <div className="space-y-6">
                        <AsterDeskLogo />

                        <p className="text-gray-400 leading-relaxed text-base">
                            Premium AI tools & assistants — all in one powerful subscription. Unlock creativity, productivity, and more.
                        </p>

                        {/* Newsletter */}
                        <div className="space-y-3">
                            <p className="text-sm font-medium text-violet-300">Stay updated — never miss a feature</p>
                            <form className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="flex-1 px-5 py-3 bg-gray-900/60 border border-violet-800/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition-all"
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium rounded-lg shadow-lg shadow-violet-900/30 transition-all hover:shadow-xl hover:shadow-violet-900/50 active:scale-95"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>

                        {/* Socials */}
                        <div className="flex gap-5 pt-2">
                            {[
                                { Icon: GitHubIcon, href: "#" },
                                { Icon: TwitterIcon, href: "#" },
                                { Icon: LinkedInIcon, href: "#" },
                            ].map(({ Icon, href }, i) => (
                                <a
                                    key={i}
                                    href={href}
                                    className="text-gray-400 hover:text-violet-400 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5"
                                    aria-label="Social link"
                                >
                                    <Icon size={26} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-white">Quick Links</h4>
                        <ul className="space-y-3 text-gray-400">
                            {["Home", "Pricing", "Features", "About", "Blog"].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="hover:text-violet-300 transition-colors duration-300 hover:translate-x-1.5 inline-block"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-white">Resources</h4>
                        <ul className="space-y-3 text-gray-400">
                            {["Help Center", "API Docs", "Status", "Privacy Policy", "Terms of Service"].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="hover:text-violet-300 transition-colors duration-300 hover:translate-x-1.5 inline-block"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-white">Get in Touch</h4>
                        <div className="space-y-3 text-gray-400 text-sm">
                            <p>Email: hello@asterdesk.com</p>
                            <p>Support: support@asterdesk.com</p>
                            <p>Discord: discord.gg/asterdesk</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-10 border-t border-violet-900/40 text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} AsterDesk. All rights reserved.</p>
                    <p className="mt-2">
                        Built with <span className="text-red-400">♥</span> for creators & innovators
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;