"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Menu,
    X,
    ChevronDown,
    ChevronUp,
    Merge,
    Scissors,
    Minimize2,
    FileX,
    FileOutput,
    ArrowUpDown,
    ScanLine,
    Wrench,
    ScanSearch,
    Image,
    FileText,
    Presentation,
    Sheet,
    Globe,
    Archive,
    RotateCw,
    Hash,
    Droplets,
    Crop,
    PenLine,
    Unlock,
    Lock,
    PenTool,
    EyeOff,
    GitCompare,
    Languages,
    User,
    LayoutGrid,
} from "lucide-react";
import { tools, categories, type ToolCategory } from "@/lib/toolsData";

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
    Merge, Scissors, Minimize2, FileX, FileOutput, ArrowUpDown, ScanLine,
    Wrench, ScanSearch, Image, FileText, Presentation, Sheet, Globe,
    Archive, RotateCw, Hash, Droplets, Crop, PenLine, Unlock, Lock,
    PenTool, EyeOff, GitCompare, Languages,
};

const navTools = [
    { label: "MERGE PDF", href: "/workspace?tool=merge-pdfs" },
    { label: "SPLIT PDF", href: "/workspace?tool=split-pages" },
    { label: "COMPRESS PDF", href: "/workspace?tool=compress-pdf" },
];

const convertToTools = tools.filter((t) => t.category === "Convert to PDF");
const convertFromTools = tools.filter((t) => t.category === "Convert from PDF");

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [convertOpen, setConvertOpen] = useState(false);
    const [megaOpen, setMegaOpen] = useState(false);
    const convertRef = useRef<HTMLDivElement>(null);
    const megaRef = useRef<HTMLDivElement>(null);
    const convertTimer = useRef<NodeJS.Timeout | null>(null);
    const megaTimer = useRef<NodeJS.Timeout | null>(null);

    // Close dropdowns on route change
    useEffect(() => {
        setConvertOpen(false);
        setMegaOpen(false);
        setMobileOpen(false);
    }, [pathname]);

    const handleConvertEnter = () => {
        if (convertTimer.current) clearTimeout(convertTimer.current);
        setConvertOpen(true);
        setMegaOpen(false);
    };
    const handleConvertLeave = () => {
        convertTimer.current = setTimeout(() => setConvertOpen(false), 150);
    };
    const handleMegaEnter = () => {
        if (megaTimer.current) clearTimeout(megaTimer.current);
        setMegaOpen(true);
        setConvertOpen(false);
    };
    const handleMegaLeave = () => {
        megaTimer.current = setTimeout(() => setMegaOpen(false), 150);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-sushi-gray-300 shadow-[0_1px_4px_rgba(0,0,0,0.1)]">
            <div className="max-w-[1200px] mx-auto px-5 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-1.5 shrink-0">
                    <span className="text-2xl font-bold tracking-tight">
                        <span className="text-sushi-gray-800">Sushi</span>
                        <span className="text-sushi-red">PDF</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-1 ml-8">
                    {navTools.map((t) => (
                        <Link
                            key={t.href}
                            href={t.href}
                            className={`px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors hover:text-sushi-red ${pathname === t.href ? "text-sushi-red" : "text-sushi-gray-800"
                                }`}
                        >
                            {t.label}
                        </Link>
                    ))}

                    {/* Convert PDF dropdown */}
                    <div
                        ref={convertRef}
                        className="relative"
                        onMouseEnter={handleConvertEnter}
                        onMouseLeave={handleConvertLeave}
                    >
                        <button
                            className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors hover:text-sushi-red ${convertOpen ? "text-sushi-red" : "text-sushi-gray-800"
                                }`}
                        >
                            CONVERT PDF
                            {convertOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {convertOpen && (
                            <div className="absolute top-full left-0 mt-0 bg-white border border-sushi-gray-200 rounded-lg shadow-lg p-5 min-w-[420px] grid grid-cols-2 gap-x-10 gap-y-1 z-50">
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-sushi-gray-600 mb-3 tracking-wider">
                                        CONVERT TO PDF
                                    </h4>
                                    {convertToTools.map((tool) => {
                                        const Icon = iconMap[tool.icon];
                                        return (
                                            <Link
                                                key={tool.id}
                                                href={tool.route}
                                                className="flex items-center gap-2.5 py-1.5 text-sm text-sushi-gray-800 hover:text-sushi-red transition-colors"
                                            >
                                                {Icon && <Icon className="w-5 h-5 shrink-0" style={{ color: tool.color }} />}
                                                {tool.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-sushi-gray-600 mb-3 tracking-wider">
                                        CONVERT FROM PDF
                                    </h4>
                                    {convertFromTools.map((tool) => {
                                        const Icon = iconMap[tool.icon];
                                        return (
                                            <Link
                                                key={tool.id}
                                                href={tool.route}
                                                className="flex items-center gap-2.5 py-1.5 text-sm text-sushi-gray-800 hover:text-sushi-red transition-colors"
                                            >
                                                {Icon && <Icon className="w-5 h-5 shrink-0" style={{ color: tool.color }} />}
                                                {tool.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* All PDF Tools megamenu */}
                    <div
                        ref={megaRef}
                        className="relative"
                        onMouseEnter={handleMegaEnter}
                        onMouseLeave={handleMegaLeave}
                    >
                        <button
                            className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors hover:text-sushi-red ${megaOpen ? "text-sushi-red" : "text-sushi-gray-800"
                                }`}
                        >
                            ALL PDF TOOLS
                            {megaOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {megaOpen && (
                            <div className="absolute top-full right-0 mt-0 bg-white border border-sushi-gray-200 rounded-lg shadow-lg p-6 z-50 w-[900px]">
                                <div className="grid grid-cols-4 gap-6">
                                    {categories.map((cat) => {
                                        const catTools = tools.filter((t) => t.category === cat);
                                        return (
                                            <div key={cat}>
                                                <h4 className="text-xs font-bold uppercase text-sushi-gray-600 mb-3 tracking-wider">
                                                    {cat}
                                                </h4>
                                                {catTools.map((tool) => {
                                                    const Icon = iconMap[tool.icon];
                                                    return (
                                                        <Link
                                                            key={tool.id}
                                                            href={tool.route}
                                                            className="flex items-center gap-2 py-1.5 text-sm text-sushi-gray-800 hover:text-sushi-red transition-colors"
                                                        >
                                                            {Icon && <Icon className="w-4 h-4 shrink-0" style={{ color: tool.color }} />}
                                                            <span>{tool.name}</span>
                                                            {tool.isNew && (
                                                                <span className="text-[10px] bg-sushi-red text-white px-1.5 py-0.5 rounded-full font-bold">
                                                                    NEW
                                                                </span>
                                                            )}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right side */}
                <div className="hidden lg:flex items-center gap-3">
                    <Link
                        href="/login"
                        className="text-sm text-sushi-gray-700 hover:text-sushi-red transition-colors"
                    >
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="bg-sushi-red hover:bg-sushi-red-dark text-white text-sm font-bold px-5 py-2 rounded transition-colors"
                    >
                        Sign up
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="lg:hidden p-2 text-sushi-gray-800"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className="lg:hidden border-t border-sushi-gray-200 bg-white max-h-[80vh] overflow-y-auto">
                    <div className="px-5 py-4 space-y-3">
                        {navTools.map((t) => (
                            <Link
                                key={t.href}
                                href={t.href}
                                className="block text-sm font-semibold uppercase text-sushi-gray-800 hover:text-sushi-red py-1"
                            >
                                {t.label}
                            </Link>
                        ))}
                        <div className="border-t border-sushi-gray-200 pt-3">
                            <p className="text-xs font-bold uppercase text-sushi-gray-600 mb-2">Convert PDF</p>
                            {[...convertToTools, ...convertFromTools].map((tool) => (
                                <Link
                                    key={tool.id}
                                    href={tool.route}
                                    className="block text-sm text-sushi-gray-800 hover:text-sushi-red py-1 pl-2"
                                >
                                    {tool.name}
                                </Link>
                            ))}
                        </div>
                        <div className="border-t border-sushi-gray-200 pt-3">
                            <p className="text-xs font-bold uppercase text-sushi-gray-600 mb-2">All Tools</p>
                            {categories.map((cat) => (
                                <div key={cat} className="mb-3">
                                    <p className="text-xs font-semibold text-sushi-gray-500 uppercase mb-1">{cat}</p>
                                    {tools
                                        .filter((t) => t.category === cat)
                                        .map((tool) => (
                                            <Link
                                                key={tool.id}
                                                href={tool.route}
                                                className="block text-sm text-sushi-gray-800 hover:text-sushi-red py-1 pl-2"
                                            >
                                                {tool.name}
                                            </Link>
                                        ))}
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-sushi-gray-200 pt-3 flex flex-col gap-2">
                            <Link href="/login" className="text-sm text-sushi-gray-700 hover:text-sushi-red">
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="bg-sushi-red text-white text-sm font-bold px-5 py-2 rounded text-center"
                            >
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
