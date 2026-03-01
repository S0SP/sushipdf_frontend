"use client";

import React from "react";
import Link from "next/link";
import {
    Zap, Shield, Globe, Users, FileText, CloudUpload,
    Smartphone, Lock, Check, Minus,
} from "lucide-react";

const features = [
    {
        icon: <Zap className="w-8 h-8 text-sushi-red" />,
        title: "Lightning Fast",
        desc: "Process your PDF files in seconds. Our optimized engine handles even large files efficiently.",
    },
    {
        icon: <Shield className="w-8 h-8 text-[#1976D2]" />,
        title: "Secure & Private",
        desc: "Your files are encrypted and automatically deleted after 2 hours. ISO 27001 certified.",
    },
    {
        icon: <Globe className="w-8 h-8 text-[#4CAF50]" />,
        title: "Works Everywhere",
        desc: "Use on any device with a browser. No software installation needed.",
    },
    {
        icon: <Users className="w-8 h-8 text-[#9C27B0]" />,
        title: "Team Collaboration",
        desc: "Share and manage PDF tools across your team with business accounts.",
    },
    {
        icon: <FileText className="w-8 h-8 text-[#FF6D3A]" />,
        title: "30+ PDF Tools",
        desc: "Every tool you need — merge, split, compress, convert, edit, sign, and more.",
    },
    {
        icon: <CloudUpload className="w-8 h-8 text-[#FFB300]" />,
        title: "Cloud Integration",
        desc: "Connect with Google Drive and Dropbox for seamless file management.",
    },
    {
        icon: <Smartphone className="w-8 h-8 text-sushi-red" />,
        title: "Mobile Ready",
        desc: "Fully responsive design. Process PDFs on the go from any mobile device.",
    },
    {
        icon: <Lock className="w-8 h-8 text-[#333]" />,
        title: "Advanced Security",
        desc: "Password protect, encrypt, redact, and digitally sign your PDF documents.",
    },
];

const comparisonRows = [
    { feature: "Basic tools (Merge, Split, Compress)", free: true, premium: true },
    { feature: "Advanced tools (OCR, Edit, Redact)", free: false, premium: true },
    { feature: "File size limit", free: "25 MB", premium: "4 GB" },
    { feature: "Batch processing", free: false, premium: true },
    { feature: "No advertisement", free: false, premium: true },
    { feature: "Offline desktop app", free: false, premium: true },
    { feature: "Priority support", free: false, premium: true },
];

export default function FeaturesPage() {
    return (
        <div className="bg-white min-h-[calc(100vh-64px)]">
            {/* Hero */}
            <section className="text-center pt-12 pb-10 px-5">
                <h1 className="text-3xl font-bold text-sushi-gray-800 mb-3">
                    Powerful PDF Tools, Simple to Use
                </h1>
                <p className="text-sushi-gray-600 max-w-lg mx-auto">
                    Everything you need to manage your PDF documents, all in one place.
                </p>
            </section>

            {/* Feature grid */}
            <section className="max-w-[1000px] mx-auto px-5 pb-16">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((f) => (
                        <div
                            key={f.title}
                            className="bg-sushi-gray-50 rounded-xl p-6 hover:shadow-sm transition-shadow"
                        >
                            <div className="mb-4">{f.icon}</div>
                            <h3 className="text-sm font-bold text-sushi-gray-800 mb-2">
                                {f.title}
                            </h3>
                            <p className="text-xs text-sushi-gray-600 leading-relaxed">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Social proof */}
            <section className="bg-sushi-gray-100 py-10 text-center">
                <h2 className="text-2xl font-bold text-sushi-gray-800 mb-2">
                    Trusted by millions worldwide
                </h2>
                <p className="text-sushi-gray-600 text-sm">
                    Join over 100 million users who trust SushiPDF
                </p>
            </section>

            {/* Free vs Premium comparison */}
            <section className="max-w-[700px] mx-auto px-5 py-16">
                <h2 className="text-2xl font-bold text-center text-sushi-gray-800 mb-8">
                    Free vs Premium
                </h2>
                <div className="border border-sushi-gray-200 rounded-xl overflow-hidden">
                    {/* Header */}
                    <div className="grid grid-cols-3 bg-sushi-gray-50 border-b border-sushi-gray-200">
                        <div className="p-4 text-sm font-bold text-sushi-gray-800">
                            Feature
                        </div>
                        <div className="p-4 text-sm font-bold text-sushi-gray-800 text-center">
                            Free
                        </div>
                        <div className="p-4 text-sm font-bold text-sushi-red text-center">
                            Premium
                        </div>
                    </div>
                    {/* Rows */}
                    {comparisonRows.map((row) => (
                        <div
                            key={row.feature}
                            className="grid grid-cols-3 border-b border-sushi-gray-200 last:border-b-0"
                        >
                            <div className="p-4 text-sm text-sushi-gray-700">
                                {row.feature}
                            </div>
                            <div className="p-4 flex justify-center">
                                {typeof row.free === "boolean" ? (
                                    row.free ? (
                                        <Check className="w-5 h-5 text-sushi-success" />
                                    ) : (
                                        <Minus className="w-5 h-5 text-sushi-gray-300" />
                                    )
                                ) : (
                                    <span className="text-sm text-sushi-gray-600">
                                        {row.free}
                                    </span>
                                )}
                            </div>
                            <div className="p-4 flex justify-center">
                                {typeof row.premium === "boolean" ? (
                                    row.premium ? (
                                        <Check className="w-5 h-5 text-sushi-success" />
                                    ) : (
                                        <Minus className="w-5 h-5 text-sushi-gray-300" />
                                    )
                                ) : (
                                    <span className="text-sm text-sushi-gray-600">
                                        {row.premium}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-6">
                    <Link
                        href="/pricing"
                        className="inline-block bg-sushi-red hover:bg-sushi-red-dark text-white font-bold text-sm px-8 py-3 rounded-lg transition-colors"
                    >
                        Upgrade to Premium
                    </Link>
                </div>
            </section>
        </div>
    );
}
