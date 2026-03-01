"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Merge, Scissors, Minimize2, FileX, FileOutput, ArrowUpDown, ScanLine,
  Wrench, ScanSearch, Image, FileText, Presentation, Sheet, Globe,
  Archive, RotateCw, Hash, Droplets, Crop, PenLine, Unlock, Lock,
  PenTool, EyeOff, GitCompare, Languages, ShieldCheck, Globe2, Award,
} from "lucide-react";
import { tools, categories, type ToolCategory } from "@/lib/toolsData";

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Merge, Scissors, Minimize2, FileX, FileOutput, ArrowUpDown, ScanLine,
  Wrench, ScanSearch, Image, FileText, Presentation, Sheet, Globe,
  Archive, RotateCw, Hash, Droplets, Crop, PenLine, Unlock, Lock,
  PenTool, EyeOff, GitCompare, Languages,
};

const filterTabs: { label: string; value: string }[] = [
  { label: "All", value: "All" },
  ...categories.map((c) => ({ label: c, value: c })),
];

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredTools =
    activeFilter === "All"
      ? tools
      : tools.filter((t) => t.category === activeFilter);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="text-center pt-12 pb-6 px-5 max-w-[800px] mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-sushi-gray-800 mb-4 leading-tight">
          Every tool you need to work with PDFs in one place
        </h1>
        <p className="text-sushi-gray-700 text-base md:text-lg leading-relaxed">
          Every tool you need to use PDFs, at your fingertips. All are 100% FREE
          and easy to use! Merge, split, compress, convert, rotate, unlock and
          watermark PDFs with just a few clicks.
        </p>
      </section>

      {/* Category Filter Tabs */}
      <section className="max-w-[1200px] mx-auto px-5 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === tab.value
                ? "bg-sushi-gray-800 text-white"
                : "bg-white text-sushi-gray-700 border border-sushi-gray-300 hover:border-sushi-gray-800"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Tool Grid */}
      <section id="tools" className="max-w-[1200px] mx-auto px-5 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredTools.map((tool) => {
            const Icon = iconMap[tool.icon];
            return (
              <Link
                key={tool.id}
                href={tool.route}
                className="group bg-white border border-sushi-gray-200 rounded-lg p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 relative"
              >
                {tool.isNew && (
                  <span className="absolute top-3 right-3 text-[10px] bg-sushi-red text-white px-2 py-0.5 rounded-full font-bold">
                    NEW
                  </span>
                )}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${tool.color}15` }}
                >
                  {Icon && (
                    <Icon
                      className="w-6 h-6"
                      style={{ color: tool.color }}
                    />
                  )}
                </div>
                <h3 className="text-sm font-bold text-sushi-gray-800 mb-1 group-hover:text-sushi-red transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-sushi-gray-600 leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Platform Promo Section */}
      <section className="bg-sushi-gray-100 py-16">
        <div className="max-w-[1200px] mx-auto px-5">
          <h2 className="text-2xl font-bold text-center text-sushi-gray-800 mb-10">
            Solutions for Every Situation
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Desktop",
                subtitle: "Work offline with Desktop",
                desc: "Access all your favorite PDF tools offline. Process files without an Internet connection.",
                icon: "💻",
              },
              {
                title: "Mobile",
                subtitle: "On-the-go with Mobile",
                desc: "A complete set of PDF tools right in your pocket. All tools available on your mobile device.",
                icon: "📱",
              },
              {
                title: "Business",
                subtitle: "Built for business",
                desc: "Control and manage PDF tools for your business teams, departments and companies.",
                icon: "🏢",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl p-8 text-center border border-sushi-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-sushi-gray-800 mb-2">
                  {item.subtitle}
                </h3>
                <p className="text-sm text-sushi-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Upsell */}
      <section className="py-16 px-5">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-sushi-gray-800 mb-4">
              Get more with Premium
            </h2>
            <ul className="space-y-3 text-sushi-gray-700 mb-6">
              {[
                "Unlimited document processing",
                "Batch processing for multiple files",
                "No file size limitations",
                "Priority support",
                "Access to all tools",
              ].map((feat) => (
                <li key={feat} className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full bg-sushi-success text-white flex items-center justify-center text-xs flex-shrink-0">
                    ✓
                  </span>
                  {feat}
                </li>
              ))}
            </ul>
            <Link
              href="/pricing"
              className="inline-block bg-sushi-red hover:bg-sushi-red-dark text-white font-bold text-sm px-8 py-3 rounded transition-colors"
            >
              Get Premium
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-64 h-64 bg-sushi-gray-100 rounded-2xl flex items-center justify-center text-7xl">
              🚀
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-sushi-gray-100 py-10">
        <div className="max-w-[1200px] mx-auto px-5 text-center">
          <p className="text-lg font-bold text-sushi-gray-800 mb-6">
            The PDF software trusted by millions of users
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: <ShieldCheck className="w-8 h-8 text-[#1976D2]" />, label: "ISO 27001 Certified" },
              { icon: <Globe2 className="w-8 h-8 text-[#4CAF50]" />, label: "Secure HTTPS Connection" },
              { icon: <Award className="w-8 h-8 text-[#FFC107]" />, label: "PDF Association Member" },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-3">
                {badge.icon}
                <span className="text-sm font-medium text-sushi-gray-700">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
