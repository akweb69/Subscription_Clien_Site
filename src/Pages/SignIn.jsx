// src/pages/auth/SignIn.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AuthLayout from './AuthLayout';

export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login
        setTimeout(() => setIsLoading(false), 1500);
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Securely sign in to your AsterDesk dashboard"
        >
            <form onSubmit={handleLogin} className="space-y-5">
                {/* Email field */}
                <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-slate-700 font-medium">Work Email</Label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@company.com"
                            className="pl-10 bg-slate-50/50 border-slate-200 focus:ring-amber-500 focus:border-amber-500"
                            required
                        />
                    </div>
                </div>

                {/* Password field */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
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
                            type={showPassword ? "text" : "password"}
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

                {/* Remember me */}
                <div className="flex items-center space-x-2 py-1">
                    <Checkbox id="remember" className="border-slate-300 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900" />
                    <Label
                        htmlFor="remember"
                        className="text-sm font-medium text-slate-600 cursor-pointer"
                    >
                        Keep me signed in
                    </Label>
                </div>

                {/* Submit button */}
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



                {/* Sign up link */}
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