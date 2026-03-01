"use client";

import React, { useState } from "react";
import { Minimize2 } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";

function CompressPdfEditPhase({
    files,
    onProcess,
}: {
    files: File[];
    onProcess: () => void;
}) {
    const [level, setLevel] = useState<"extreme" | "recommended" | "less">("recommended");

    const levels = [
        {
            id: "extreme" as const,
            label: "Extreme Compression",
            desc: "Less quality, high compression",
            color: "border-red-400",
        },
        {
            id: "recommended" as const,
            label: "Recommended Compression",
            desc: "Good quality, good compression",
            color: "border-sushi-red",
        },
        {
            id: "less" as const,
            label: "Less Compression",
            desc: "High quality, less compression",
            color: "border-green-400",
        },
    ];

    return (
        <div className="max-w-md mx-auto">
            <div className="space-y-3">
                {levels.map((l) => (
                    <button
                        key={l.id}
                        onClick={() => setLevel(l.id)}
                        className={`w-full text-left border-2 rounded-xl p-4 transition-all ${level === l.id
                                ? `${l.color} bg-white shadow-sm`
                                : "border-sushi-gray-200 bg-white hover:border-sushi-gray-300"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${level === l.id ? "border-sushi-red" : "border-sushi-gray-300"
                                    }`}
                            >
                                {level === l.id && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-sushi-red" />
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-sushi-gray-800">{l.label}</p>
                                <p className="text-xs text-sushi-gray-500">{l.desc}</p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            <div className="flex justify-center mt-8">
                <button
                    onClick={onProcess}
                    className="bg-sushi-red hover:bg-sushi-red-dark text-white font-bold text-base px-12 py-3.5 rounded-lg transition-all duration-150 active:scale-[0.97]"
                >
                    Compress PDF
                </button>
            </div>
        </div>
    );
}

export default function CompressPdfPage() {
    return (
        <ToolPageLayout
            toolId="compress-pdf"
            toolName="Compress PDF"
            toolDescription="Reduce file size while optimizing for maximal PDF quality."
            toolColor="#E8423F"
            icon={
                <div className="w-16 h-16 bg-sushi-red/10 rounded-xl flex items-center justify-center">
                    <Minimize2 className="w-8 h-8 text-sushi-red" />
                </div>
            }
            renderEditPhase={(files, onProcess) => (
                <CompressPdfEditPhase files={files} onProcess={onProcess} />
            )}
        />
    );
}
