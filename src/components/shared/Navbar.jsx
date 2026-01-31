// components/Navbar.tsx
import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Menu,
    X,
    Home,
    LogIn,
    UserPlus,
    Crown,
    User,
} from "lucide-react";
import { AppContext } from "@/context/AppContext";
import useSettingsData from "@/Admin/Hooks/useSettingsData";

const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Plans", path: "/plans", icon: Crown },
];

const mobileMenuVariants = {
    closed: {
        opacity: 0,
        height: 0,
        transition: {
            duration: 0.3,
            ease: "easeInOut",
            when: "afterChildren",
        },
    },
    open: {
        opacity: 1,
        height: "auto",
        transition: {
            duration: 0.4,
            ease: [0.04, 0.62, 0.23, 0.98],
            when: "beforeChildren",
            staggerChildren: 0.07,
        },
    },
};

const itemVariants = {
    closed: { y: -8, opacity: 0 },
    open: { y: 0, opacity: 1 },
};

export default function Navbar() {
    const { user, loading: authLoading, logout } = useContext(AppContext);
    const { settingsLoading, settingsData } = useSettingsData();
    const [isOpen, setIsOpen] = useState(false);

    const isAuthenticated = !!user && !authLoading;

    const toggleMenu = () => setIsOpen((prev) => !prev);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            {/* Desktop / Main Bar */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-end gap-1 group h-10"
                    >
                        <img
                            className="h-full "
                            src="https://i.ibb.co/Cp3NTgRQ/png-file-removebg-preview.png" alt="" />
                        <motion.div className="text-3xl -mb-1  logoFont md:text-4xl font-semibold">
                            <span className="uppercase">{settingsLoading ? "" : settingsData?.webName.slice(1, 2)}</span>
                            {settingsLoading ? " AsterDesk" : settingsData?.webName.slice(2, 1000)}
                        </motion.div>

                    </Link>

                    {/* Desktop Nav + Auth */}
                    <nav className="hidden md:flex items-center gap-2 lg:gap-4">
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
                                            className="absolute inset-0 rounded-md bg-primary/10 -z-0"
                                            initial={false}
                                            animate={
                                                isActive
                                                    ? { scale: 1, opacity: 0.2 }
                                                    : { scale: 0.95, opacity: 0 }
                                            }
                                            transition={{ duration: 0.25 }}
                                        />
                                    </>
                                )}
                            </NavLink>
                        ))}

                        {isAuthenticated ? (
                            <div className="flex items-center gap-3 pl-6 border-l">
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/30 text-white gap-1.5"
                                    asChild
                                >
                                    <Link to="/dashboard">
                                        <User className="h-4 w-4" />
                                        Dashboard
                                    </Link>
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={logout}
                                    className="gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                >
                                    <LogIn className="h-4 w-4" />
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 pl-6 border-l">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    asChild
                                >
                                    <Link to="/signin">
                                        <LogIn className="h-4 w-4" />
                                        Sign in
                                    </Link>
                                </Button>

                                <Button
                                    size="sm"
                                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/30 text-white gap-1.5"
                                    asChild
                                >
                                    <Link to="/signup">
                                        <UserPlus className="h-4 w-4" />
                                        Sign up
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Hamburger */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={toggleMenu}
                        aria-label="Toggle navigation menu"
                        aria-expanded={isOpen}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={isOpen ? "x" : "menu"}
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </motion.div>
                        </AnimatePresence>
                    </Button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={mobileMenuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="md:hidden overflow-hidden border-b bg-background/95 backdrop-blur-lg"
                    >
                        <div className="container mx-auto px-4 py-6 flex flex-col gap-2">
                            {navItems.map((item) => (
                                <motion.div key={item.path} variants={itemVariants}>
                                    <NavLink
                                        to={item.path}
                                        onClick={toggleMenu}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-5 py-3.5 rounded-xl text-base font-medium transition-all ${isActive
                                                ? "bg-primary/10 text-primary font-semibold"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            }`
                                        }
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.name}
                                    </NavLink>
                                </motion.div>
                            ))}

                            <motion.div
                                variants={itemVariants}
                                className="pt-5 mt-4 border-t flex flex-col gap-4"
                            >
                                {isAuthenticated ? (
                                    <>
                                        <Button
                                            variant="default"
                                            className="justify-start gap-3 text-base bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/30"
                                            asChild
                                            onClick={toggleMenu}
                                        >
                                            <Link to="/dashboard">
                                                <User className="h-5 w-5" />
                                                Dashboard
                                            </Link>
                                        </Button>

                                        <Button
                                            variant="outline"
                                            className="justify-start gap-3 text-base"
                                            onClick={() => {
                                                logout();
                                                toggleMenu();
                                            }}
                                        >
                                            <LogIn className="h-5 w-5" />
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="outline"
                                            className="justify-start gap-3 text-base"
                                            asChild
                                            onClick={toggleMenu}
                                        >
                                            <Link to="/signin">
                                                <LogIn className="h-5 w-5" />
                                                Sign in
                                            </Link>
                                        </Button>

                                        <Button
                                            className="justify-start gap-3 text-base bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/30"
                                            asChild
                                            onClick={toggleMenu}
                                        >
                                            <Link to="/signup">
                                                <UserPlus className="h-5 w-5" />
                                                Create Account
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}