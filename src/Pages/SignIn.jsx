// src/pages/auth/SignIn.jsx
import { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AuthLayout from './AuthLayout';
import { AppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
    const { loginWithEmail, loginWithGoogle } = useContext(AppContext);
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await loginWithEmail(
                formData.email,
                formData.password
            );

            if (res?.success) {
                toast.success('Welcome back!');
                navigate('/');
            }
            else {
                setError('Login failed. Please try again.');
                toast.error('Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('Invalid email or password');
            toast.error('Login failed. Please check your credentials.');
            console.log("---------------->>>>>>________________>>>>");
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
            title="Welcome back"
            subtitle="Securely sign in to your AsterDesk dashboard"
        >
            <form onSubmit={handleLogin} className="space-y-5">
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
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@company.com"
                            className="pl-10 bg-slate-50/50 border-slate-200 focus:ring-amber-500 focus:border-amber-500"
                            required
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-slate-700 font-medium">
                            Password
                        </Label>
                        <a
                            href="#"
                            className="text-xs font-semibold text-amber-700 hover:text-amber-600 transition-colors"
                        >
                            Forgot password?
                        </a>
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="pl-10 pr-10 bg-slate-50/50 border-slate-200 focus:ring-amber-500 focus:border-amber-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <p className="text-sm text-red-600 font-medium">
                        {error}
                    </p>
                )}

                {/* Remember me */}
                <div className="flex items-center space-x-2 py-1">
                    <Checkbox id="remember" />
                    <Label
                        htmlFor="remember"
                        className="text-sm font-medium text-slate-600 cursor-pointer"
                    >
                        Keep me signed in
                    </Label>
                </div>

                {/* Submit */}
                <Button
                    disabled={isLoading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-[0.98] group"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Authenticating...</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2 font-bold text-lg">
                            Sign In
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
                {/* Sign up */}
                <p className="text-center text-sm text-slate-500 pt-4">
                    New to the platform?{' '}
                    <a
                        href="/signup"
                        className="font-bold text-amber-700 hover:text-amber-600 hover:underline decoration-2 underline-offset-4 transition-all"
                    >
                        Create an account
                    </a>
                </p>
            </form>
        </AuthLayout>
    );
}
