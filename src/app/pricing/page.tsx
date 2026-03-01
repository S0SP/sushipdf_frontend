"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Minus, ChevronDown, ChevronUp } from "lucide-react";

const plans = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        cta: "Get Started",
        highlighted: false,
        features: [
            { label: "Basic PDF tools", included: true },
            { label: "Up to 2 files per task", included: true },
            { label: "Max 25 MB per file", included: true },
            { label: "Batch processing", included: false },
            { label: "No ads", included: false },
            { label: "Priority support", included: false },
        ],
    },
    {
        name: "Premium",
        price: "$7",
        yearlyPrice: "$4",
        period: "/month",
        cta: "Get Premium",
        highlighted: true,
        badge: "Most Popular",
        features: [
            { label: "All PDF tools", included: true },
            { label: "Unlimited files", included: true },
            { label: "Max 4 GB per file", included: true },
            { label: "Batch processing", included: true },
            { label: "No ads", included: true },
            { label: "Priority support", included: false },
        ],
    },
    {
        name: "Business",
        price: "$6",
        yearlyPrice: "$3.5",
        period: "/user/month",
        cta: "Contact Sales",
        highlighted: false,
        features: [
            { label: "All PDF tools", included: true },
            { label: "Unlimited files", included: true },
            { label: "Max 4 GB per file", included: true },
            { label: "Batch processing", included: true },
            { label: "No ads", included: true },
            { label: "Priority support", included: true },
        ],
    },
];

const faqs = [
    {
        q: "Can I cancel my subscription anytime?",
        a: "Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your billing period.",
    },
    {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for business plans.",
    },
    {
        q: "Is there a free trial available?",
        a: "Yes, we offer a 7-day free trial for our Premium plan. No credit card required to start.",
    },
    {
        q: "What happens to my files after processing?",
        a: "All files are automatically deleted from our servers after 2 hours for your security and privacy.",
    },
];

export default function PricingPage() {
    const [yearly, setYearly] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="bg-white min-h-[calc(100vh-64px)]">
            {/* Header */}
            <section className="text-center pt-12 pb-8 px-5">
                <h1 className="text-3xl font-bold text-sushi-gray-800 mb-3">
                    Choose your plan
                </h1>
                <p className="text-sushi-gray-600 mb-6">
                    Pick the perfect plan for your PDF needs
                </p>

                {/* Billing toggle */}
                <div className="flex items-center justify-center gap-3">
                    <span
                        className={`text-sm font-medium ${!yearly ? "text-sushi-gray-800" : "text-sushi-gray-500"
                            }`}
                    >
                        Monthly
                    </span>
                    <button
                        onClick={() => setYearly(!yearly)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${yearly ? "bg-sushi-red" : "bg-sushi-gray-300"
                            }`}
                    >
                        <div
                            className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform ${yearly ? "translate-x-6" : "translate-x-0.5"
                                }`}
                        />
                    </button>
                    <span
                        className={`text-sm font-medium ${yearly ? "text-sushi-gray-800" : "text-sushi-gray-500"
                            }`}
                    >
                        Yearly
                    </span>
                    {yearly && (
                        <span className="text-xs bg-sushi-success/10 text-sushi-success font-bold px-2 py-0.5 rounded-full">
                            Save 40%
                        </span>
                    )}
                </div>
            </section>

            {/* Plan cards */}
            <section className="max-w-[1000px] mx-auto px-5 pb-16">
                <div className="grid md:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative rounded-xl p-6 ${plan.highlighted
                                    ? "border-2 border-sushi-red shadow-lg"
                                    : "border border-sushi-gray-200"
                                }`}
                        >
                            {plan.badge && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sushi-red text-white text-xs font-bold px-3 py-1 rounded-full">
                                    {plan.badge}
                                </span>
                            )}
                            <h3 className="text-lg font-bold text-sushi-gray-800 mb-1">
                                {plan.name}
                            </h3>
                            <div className="mb-4">
                                <span className="text-3xl font-bold text-sushi-gray-800">
                                    {yearly && plan.yearlyPrice ? plan.yearlyPrice : plan.price}
                                </span>
                                <span className="text-sm text-sushi-gray-500">
                                    {plan.period}
                                </span>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feat) => (
                                    <li
                                        key={feat.label}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        {feat.included ? (
                                            <Check className="w-4 h-4 text-sushi-success flex-shrink-0" />
                                        ) : (
                                            <Minus className="w-4 h-4 text-sushi-gray-300 flex-shrink-0" />
                                        )}
                                        <span
                                            className={
                                                feat.included
                                                    ? "text-sushi-gray-700"
                                                    : "text-sushi-gray-400"
                                            }
                                        >
                                            {feat.label}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`w-full py-2.5 rounded-lg text-sm font-bold transition-colors ${plan.highlighted
                                        ? "bg-sushi-red hover:bg-sushi-red-dark text-white"
                                        : "border border-sushi-gray-300 text-sushi-gray-700 hover:bg-sushi-gray-50"
                                    }`}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section className="max-w-[700px] mx-auto px-5 pb-16">
                <h2 className="text-2xl font-bold text-center text-sushi-gray-800 mb-8">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="border border-sushi-gray-200 rounded-lg overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-sushi-gray-800 hover:bg-sushi-gray-50 transition-colors"
                            >
                                {faq.q}
                                {openFaq === i ? (
                                    <ChevronUp className="w-4 h-4 text-sushi-gray-500 flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-sushi-gray-500 flex-shrink-0" />
                                )}
                            </button>
                            {openFaq === i && (
                                <div className="px-5 pb-4 text-sm text-sushi-gray-600">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
