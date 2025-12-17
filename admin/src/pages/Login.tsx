import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authApi, type LoginRequest, type AuthResponse } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const loginMutation = useMutation({
        mutationFn: async (credentials: LoginRequest) => {
            const response = await authApi.post<AuthResponse>('/login', credentials);
            return response.data;
        },
        onSuccess: (data) => {
            // Store token and user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                id: data.id,
                email: data.email,
                fullName: data.fullName,
                role: data.role
            }));

            // Navigate to dashboard
            navigate('/dashboard');
        },
        onError: (error: any) => {
            setError(error.response?.data?.message || 'Invalid email or password');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        loginMutation.mutate({ email, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
            </div>

            <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/80 backdrop-blur-xl">
                <CardHeader className="space-y-4 pb-8">
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-lg opacity-50" />
                            <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
                                <ShoppingBag className="h-8 w-8 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="text-center space-y-2">
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Admin Portal
                        </CardTitle>
                        <CardDescription className="text-base">
                            Sign in to manage your e-commerce platform
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Mail className="h-4 w-4 text-purple-600" />
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="admin@example.com"
                                className="flex h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 placeholder:text-slate-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Lock className="h-4 w-4 text-purple-600" />
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="flex h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 placeholder:text-slate-400"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loginMutation.isPending}
                            className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loginMutation.isPending ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Signing in...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4" />
                                    Sign In
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600">
                            Demo credentials: <span className="font-mono text-purple-600">admin@test.com</span> / <span className="font-mono text-purple-600">admin123</span>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
