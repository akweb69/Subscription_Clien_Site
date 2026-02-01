import { Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";
import Layout from "@/Admin/MainLayout/Layout";
import AdminDash from "@/Admin/MainLayout/AdminDash";
import UserLayout from "@/Admin/User/Layout/UserLayout";
import UserDash from "@/Admin/User/Layout/UserDash";
import SignIn from "@/Pages/SignIn";
import SignUp from "@/Pages/SignUp";
import ManagementAll from "@/Admin/Pages/ManagementAll";
import Plans from "@/Pages/Plans";
import Profile from "@/Admin/Pages/Profile";
import OrdersManagement from "@/Admin/Pages/OrdersManagement";
import Settings from "@/Admin/Pages/Settings";
import Users from "@/Admin/Pages/Users";
import CheckOut from "@/Pages/CheckOut";
import OrderSuccess from "@/Pages/OrderSuccess";
import PlanDetails from "@/Admin/User/Pages/PlanDetails";
import CouponSells from "@/Admin/Pages/CouponSells";
import Others from "@/Admin/Pages/Others";

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/checkout/:planId" element={<CheckOut />} />
                <Route path="/order-success" element={<OrderSuccess />} />
            </Route>

            {/* admin routes */}
            <Route element={<Layout />}>
                <Route path="/admin" element={<AdminDash />} />
                <Route path="/admin/management" element={<ManagementAll />} />
                <Route path="/admin/orders" element={<OrdersManagement />} />
                <Route path="/admin/settings" element={<Settings />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/couponSells" element={<CouponSells />} />
                <Route path="/admin/others" element={<Others />} />

            </Route>
            {/* user Dashboard routes */}
            <Route element={<UserLayout />}>
                <Route path="/dashboard" element={<UserDash />} />
                <Route path="/dashboard/profile" element={<Profile />} />
                <Route path="/dashboard/myplan_details/:id" element={<PlanDetails />} />

            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
