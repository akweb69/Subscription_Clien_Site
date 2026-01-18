// components/Navbar.tsx
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Menu,
    X,
    Home,
    Info,
    LogIn,
    UserPlus,
    Sparkles
} from "lucide-react";

const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "About", path: "/about", icon: Info },
    { name: "Features", path: "/features", icon: Sparkles },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            {/* Main navbar */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16  items-center justify-between">

                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2.5 group"
                    >
                        <motion.div
                            initial={{ rotate: -8 }}
                            whileHover={{ rotate: 0, scale: 1.08 }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                            className="text-2xl font-black bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent"
                        >
                            MyApp
                        </motion.div>
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 0.7, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-xs font-medium tracking-widest uppercase text-muted-foreground/80"
                        >
                            2025
                        </motion.span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1 lg:gap-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `group relative px-4 py-2 text-sm font-medium transition-colors hover:text-foreground ${isActive ? "text-foreground" : "text-muted-foreground"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className="relative z-10 flex items-center gap-1.5">
                                            <item.icon className="h-4 w-4" />
                                            {item.name}
                                        </span>
                                        <motion.span
                                            className="absolute inset-0 rounded-md bg-primary/10 scale-95 opacity-0 group-hover:opacity-100 -z-0"
                                            initial={false}
                                            animate={isActive ? { scale: 1, opacity: 0.15 } : {}}
                                            transition={{ duration: 0.2 }}
                                        />
                                    </>
                                )}
                            </NavLink>
                        ))}

                        <div className="flex items-center gap-2 pl-4 ml-4 border-l">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1.5 text-muted-foreground hover:text-foreground"
                                asChild
                            >
                                <Link to="/login">
                                    <LogIn className="h-4 w-4" />
                                    Sign in
                                </Link>
                            </Button>

                            <Button
                                size="sm"
                                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/20"
                                asChild
                            >
                                <Link to="/signup" className="gap-1.5">
                                    <UserPlus className="h-4 w-4" />
                                    Get Started
                                </Link>
                            </Button>
                        </div>
                    </nav>

                    {/* Mobile menu button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={isOpen ? "close" : "menu"}
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </Button>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="md:hidden overflow-hidden border-b bg-background/95 backdrop-blur-lg"
                    >
                        <div className="container mx-auto px-4 py-5 flex flex-col gap-2">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        }`
                                    }
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </NavLink>
                            ))}

                            <div className="flex flex-col gap-3 pt-4 mt-3 border-t">
                                <Button
                                    variant="outline"
                                    className="justify-start gap-2"
                                    asChild
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Link to="/login">
                                        <LogIn className="h-4 w-4" />
                                        Sign in
                                    </Link>
                                </Button>

                                <Button
                                    className="justify-start gap-2 bg-gradient-to-r from-violet-600 to-indigo-600"
                                    asChild
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Link to="/signup">
                                        <UserPlus className="h-4 w-4" />
                                        Create Account
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}