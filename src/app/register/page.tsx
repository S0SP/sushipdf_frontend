"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agreed, setAgreed] = useState(false);

    // Simple password strength
    const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
    const strengthLabels = ["", "Weak", "Medium", "Strong"];
    const strengthColors = ["", "bg-red-400", "bg-yellow-400", "bg-green-400"];

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
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-sushi-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-sushi-red focus:outline-none transition-colors"
                            placeholder="Your name"
                        />
                    </div>
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
                        {password.length > 0 && (
                            <div className="mt-2 flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-sushi-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all ${strengthColors[strength]}`}
                                        style={{ width: `${(strength / 3) * 100}%` }}
                                    />
                                </div>
                                <span className="text-xs text-sushi-gray-500">
                                    {strengthLabels[strength]}
                                </span>
                            </div>
                        )}
                    </div>

                    <label className="flex items-start gap-2 text-sm text-sushi-gray-600">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="rounded border-sushi-gray-300 mt-0.5"
                        />
                        <span>
                            I agree to the{" "}
                            <a href="#" className="text-sushi-red hover:text-sushi-red-dark">
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-sushi-red hover:text-sushi-red-dark">
                                Privacy Policy
                            </a>
                        </span>
                    </label>

                    <button
                        type="submit"
                        className="w-full bg-sushi-red hover:bg-sushi-red-dark text-white font-bold text-sm py-3 rounded-lg transition-colors disabled:opacity-50"
                        disabled={!agreed}
                    >
                        Create account
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-sushi-gray-200" />
                    <span className="text-xs text-sushi-gray-500">or continue with</span>
                    <div className="flex-1 h-px bg-sushi-gray-200" />
                </div>

                {/* Social sign up */}
                <div className="space-y-3">
                    <button className="w-full flex items-center justify-center gap-2 border border-sushi-gray-300 rounded-lg py-2.5 text-sm font-medium text-sushi-gray-700 hover:bg-sushi-gray-50 transition-colors">
                        <span className="text-lg">G</span> Sign up with Google
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 border border-sushi-gray-300 rounded-lg py-2.5 text-sm font-medium text-sushi-gray-700 hover:bg-sushi-gray-50 transition-colors">
                        <span className="text-lg">🍎</span> Sign up with Apple
                    </button>
                </div>

                {/* Login link */}
                <p className="text-center text-sm text-sushi-gray-600 mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="text-sushi-red hover:text-sushi-red-dark font-medium">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
