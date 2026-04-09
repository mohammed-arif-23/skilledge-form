'use client';

import { useActionState, useEffect } from 'react';
import { loginAction } from '@/actions/authActions';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function LoginPage() {
    const [state, action, isPending] = useActionState(loginAction, null);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.push('/admin/dashboard');
        }
    }, [state, router]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
            >
                <div className="text-center mb-8">
                    <Image src="/logo.png" alt="Logo" width={180} height={50} className="mx-auto mb-6 object-contain" priority />
                    <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
                    <p className="text-gray-500 mt-2">Manage your forms</p>
                </div>

                <form action={action} className="space-y-6">
                    {state?.error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {state.error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
                            placeholder="admin@formflow.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-70 flex justify-center items-center"
                    >
                        {isPending ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
