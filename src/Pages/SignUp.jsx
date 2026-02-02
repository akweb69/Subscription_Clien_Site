// src/pages/auth/SignUp.jsx
import { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Eye, EyeOff, Mail, Lock, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from './AuthLayout';
import { AppContext } from '@/context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
    const { signUpWithEmail, loginWithGoogle } = useContext(AppContext);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    // Plain state instead of react-hook-form
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false,
    });

    const navigate = useNavigate();
    const base_url = import.meta.env.VITE_BASE_URL;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setServerError('');

        const { firstName, lastName, email, password, confirmPassword, terms } = formData;

        // Minimal check — you can remove even this if you want zero frontend validation
        if (!email || !password) {
            setServerError('Email and password are required');
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setServerError("Passwords don't match");
            setIsLoading(false);
            return;
        }

        if (!terms) {
            setServerError('You must accept the terms to continue');
            setIsLoading(false);
            return;
        }

        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

        try {
            const result = await signUpWithEmail(email, password, fullName);

            if (result.success) {
                // Save to your backend
                await axios.post(`${base_url}/users`, {
                    email,
                    name: fullName,
                    password,
                });

                toast.success('Account created successfully!');
                navigate("/plans");
            }
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.message || err.message;

            if (msg?.toLowerCase().includes('email') && msg?.toLowerCase().includes('already')) {
                setServerError('This email is already registered with MASTERDESK.');
            } else {
                setServerError(msg || 'Something went wrong. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    const handleloginWithGoogle = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await loginWithGoogle();
        // send user data to db----->
        console.log("dsdsd----->", result)
        // check if user already exist--->

        if (result.success) {
            const email = await result.user.email;
            const name = await result.user.displayName;
            const password = await result.user.uid;

            const userFind = await axios.get(`${base_url}/users/${email}`);
            if (!userFind.data) {
                await axios.post(`${base_url}/users`, {
                    email,
                    name,
                    password,
                });
            }
            navigate("/plans");
        }
        setIsLoading(false);


    }

    return (
        <AuthLayout
            title={
                <span className="flex items-center justify-center gap-2 tracking-tight">
                    Join <span className="font-extrabold text-slate-900">MASTERDESK</span>
                </span>
            }
            subtitle="Your premium workspace for seamless digital management."
            isSignUp={true}
        >
            <form onSubmit={onSubmit} className="space-y-5">

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="firstName" className="text-slate-700 font-medium">
                            First name
                        </Label>
                        <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="bg-slate-50/50 border-slate-200 focus:ring-amber-500"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="lastName" className="text-slate-700 font-medium">
                            Last name
                        </Label>
                        <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="bg-slate-50/50 border-slate-200 focus:ring-amber-500"
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-slate-700 font-medium">
                        Work Email
                    </Label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@Masterdesk.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="pl-10 bg-slate-50/50 border-slate-200 focus:ring-amber-500"
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-slate-700 font-medium">
                        Password
                    </Label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            className="pl-10 pr-10 bg-slate-50/50 border-slate-200 focus:ring-amber-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                        Confirm Password
                    </Label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="pl-10 pr-10 bg-slate-50/50 border-slate-200 focus:ring-amber-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {/* Terms */}
                <div className="flex items-center space-x-2 pt-2">
                    <input
                        type="checkbox"
                        id="terms"
                        name="terms"
                        checked={formData.terms}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                    <Label htmlFor="terms" className="text-xs text-slate-500 leading-none cursor-pointer">
                        I accept the{' '}
                        <a href="#" className="text-amber-700 font-semibold hover:underline">
                            Terms of Service
                        </a>
                    </Label>
                </div>

                {/* Server / simple error */}
                {serverError && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md text-xs text-red-700"
                    >
                        {serverError}
                    </motion.div>
                )}

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-[0.98] group"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Creating account...</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2 font-bold text-lg">
                            Create Account
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                    )}
                </Button>
                {/* continue with google btn---> */}
                <Button
                    variant='ghost'
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 text-slate-900 py-6 rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-[0.98] group cursor-pointer"
                    onClick={handleloginWithGoogle}
                >
                    <div className="flex items-center justify-center gap-2 font-bold text-lg">
                        Continue with Google
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Button>

                <p className="text-center text-sm text-slate-500">
                    Already an MASTERDESK member?{' '}
                    <a href="/signin" className="font-bold text-amber-700 hover:text-amber-600 transition-colors">
                        Sign in here
                    </a>
                </p>
            </form>
        </AuthLayout>
    );
}