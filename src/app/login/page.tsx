"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="min-h-[calc(100vh-64px)] bg-sushi-gray-50 flex items-center justify-center px-5 py-12">
            <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-sushi-gray-200 p-8">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="text-2xl font-bold">
                        <span className="text-sushi-gray-800">Sushi</span>
                        <span className="text-sushi-red">PDF</span>
                    </Link>
                </div>

                {/* Form */}
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-sushi-gray-700 mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-sushi-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-sushi-red focus:outline-none transition-colors"
                            placeholder="your@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-sushi-gray-700 mb-1.5">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-sushi-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-sushi-red focus:outline-none transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-sushi-gray-600">
                            <input type="checkbox" className="rounded border-sushi-gray-300" />
                            Remember me
                        </label>
                        <a href="#" className="text-sushi-red hover:text-sushi-red-dark">
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-sushi-red hover:bg-sushi-red-dark text-white font-bold text-sm py-3 rounded-lg transition-colors"
                    >
                        Log in
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-sushi-gray-200" />
                    <span className="text-xs text-sushi-gray-500">or continue with</span>
                    <div className="flex-1 h-px bg-sushi-gray-200" />
                </div>

                {/* Social login */}
                <div className="space-y-3">
                    <button className="w-full flex items-center justify-center gap-2 border border-sushi-gray-300 rounded-lg py-2.5 text-sm font-medium text-sushi-gray-700 hover:bg-sushi-gray-50 transition-colors">
                        <span className="text-lg">G</span> Continue with Google
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 border border-sushi-gray-300 rounded-lg py-2.5 text-sm font-medium text-sushi-gray-700 hover:bg-sushi-gray-50 transition-colors">
                        <span className="text-lg">🍎</span> Continue with Apple
                    </button>
                </div>

                {/* Sign up link */}
                <p className="text-center text-sm text-sushi-gray-600 mt-6">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-sushi-red hover:text-sushi-red-dark font-medium">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
