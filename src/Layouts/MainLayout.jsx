import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/Pages/Footer";
import { useEffect, useState } from "react";

const MainLayout = () => {
    const location = useLocation();
    const [notShowNavAndFooter, setNotShowNavAndFooter] = useState(false);
    useEffect(() => {
        if (location.pathname === "/admin_signin") {
            setNotShowNavAndFooter(true);
        }
    }, [location.pathname])
    return (
        <div className="min-h-screen flex flex-col">
            <div className={`${notShowNavAndFooter ? "hidden" : ""}`}>
                <Navbar />
            </div>
            <main className="flex-1   min-h-screen">
                <Outlet />
            </main>
            <div className={`${notShowNavAndFooter ? "hidden" : ""}`}>
                <Footer />
            </div>
        </div>
    );
};

export default MainLayout;
