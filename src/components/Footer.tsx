"use client";

import Link from "next/link";

const footerColumns = [
    {
        title: "PRODUCT",
        links: [
            { label: "Home", href: "/" },
            { label: "Features", href: "/features" },
            { label: "Pricing", href: "/pricing" },
            { label: "Tools", href: "/#tools" },
            { label: "FAQ", href: "/faq" },
        ],
    },
    {
        title: "RESOURCES",
        links: [
            { label: "SushiPDF Desktop", href: "#" },
            { label: "SushiPDF Mobile", href: "#" },
            { label: "SushiSign", href: "#" },
            { label: "SushiAPI", href: "#" },
            { label: "SushiIMG", href: "#" },
        ],
    },
    {
        title: "SOLUTIONS",
        links: [
            { label: "Business", href: "#" },
            { label: "Education", href: "#" },
        ],
    },
    {
        title: "LEGAL",
        links: [
            { label: "Security", href: "#" },
            { label: "Privacy policy", href: "#" },
            { label: "Terms & conditions", href: "#" },
            { label: "Cookies", href: "#" },
        ],
    },
    {
        title: "COMPANY",
        links: [
            { label: "About us", href: "#" },
            { label: "Contact us", href: "#" },
            { label: "Blog", href: "#" },
            { label: "Press", href: "#" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="bg-[#2C2C2C] text-[#CCCCCC]">
            <div className="max-w-[1200px] mx-auto px-5 py-12">
                {/* Columns */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">
                    {footerColumns.map((col) => (
                        <div key={col.title}>
                            <h4 className="text-white text-sm font-bold mb-4 tracking-wide">
                                {col.title}
                            </h4>
                            <ul className="space-y-2">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-[13px] text-[#CCCCCC] hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* App Store badges row */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {["Google Play", "App Store", "Mac App Store", "Microsoft Store"].map(
                        (store) => (
                            <div
                                key={store}
                                className="border border-[#555] rounded-md px-4 py-2 text-xs text-white hover:border-white transition-colors cursor-pointer"
                            >
                                {store}
                            </div>
                        )
                    )}
                </div>

                {/* Bottom bar */}
                <div className="border-t border-[#444] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Language selector */}
                    <div className="flex items-center gap-2 text-sm">
                        <span>🌐</span>
                        <select className="bg-transparent text-[#CCCCCC] text-sm border border-[#555] rounded px-2 py-1 outline-none">
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                            <option value="hi">हिन्दी</option>
                        </select>
                    </div>

                    {/* Social icons */}
                    <div className="flex items-center gap-4 text-[#CCCCCC]">
                        {["𝕏", "f", "in", "📷", "🎵"].map((icon, i) => (
                            <span
                                key={i}
                                className="w-8 h-8 flex items-center justify-center rounded-full border border-[#555] text-xs hover:border-white hover:text-white transition-colors cursor-pointer"
                            >
                                {icon}
                            </span>
                        ))}
                    </div>

                    {/* Copyright */}
                    <p className="text-xs text-[#999]">
                        © SushiPDF 2026 ® - Your PDF Editor
                    </p>
                </div>
            </div>
        </footer>
    );
}
