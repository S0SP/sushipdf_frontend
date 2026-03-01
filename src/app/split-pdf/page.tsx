"use client";

import React, { useState } from "react";
import { Scissors } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";

function SplitPdfEditPhase({
    files,
    onProcess,
}: {
    files: File[];
    onProcess: () => void;
}) {
    const [mode, setMode] = useState<"range" | "extract" | "every" | "size">("range");
    const [rangeInput, setRangeInput] = useState("1-3, 4-6");
    const [everyN, setEveryN] = useState(1);
    const [maxSize, setMaxSize] = useState(10);

    const modes = [
        { id: "range" as const, label: "Split by range" },
        { id: "extract" as const, label: "Extract pages" },
        { id: "every" as const, label: "Split every N pages" },
        { id: "size" as const, label: "Split by file size" },
    ];

    return (
        <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-xl border border-sushi-gray-200 p-6">
                {/* Mode selector */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {modes.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setMode(m.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m.id
                                    ? "bg-sushi-red text-white"
                                    : "bg-sushi-gray-100 text-sushi-gray-700 hover:bg-sushi-gray-200"
                                }`}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>

                {/* Mode-specific options */}
                {mode === "range" && (
                    <div>
                        <label className="block text-sm font-medium text-sushi-gray-700 mb-2">
                            Page ranges (e.g. 1-3, 4-6)
                        </label>
                        <input
                            type="text"
                            value={rangeInput}
                            onChange={(e) => setRangeInput(e.target.value)}
                            className="w-full border border-sushi-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-sushi-red focus:outline-none"
                            placeholder="1-3, 4-6, 7-10"
                        />
                    </div>
                )}

                {mode === "extract" && (
                    <div>
                        <label className="block text-sm font-medium text-sushi-gray-700 mb-2">
                            Pages to extract (e.g. 1, 3, 5)
                        </label>
                        <input
                            type="text"
                            className="w-full border border-sushi-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-sushi-red focus:outline-none"
                            placeholder="1, 3, 5, 7"
                        />
                    </div>
                )}

                {mode === "every" && (
                    <div>
                        <label className="block text-sm font-medium text-sushi-gray-700 mb-2">
                            Split every
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min={1}
                                value={everyN}
                                onChange={(e) => setEveryN(Number(e.target.value))}
                                className="w-24 border border-sushi-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-sushi-red focus:outline-none"
                            />
                            <span className="text-sm text-sushi-gray-600">pages</span>
                        </div>
                    </div>
                )}

                {mode === "size" && (
                    <div>
                        <label className="block text-sm font-medium text-sushi-gray-700 mb-2">
                            Maximum file size
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min={1}
                                value={maxSize}
                                onChange={(e) => setMaxSize(Number(e.target.value))}
                                className="w-24 border border-sushi-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-sushi-red focus:outline-none"
                            />
                            <span className="text-sm text-sushi-gray-600">MB per file</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-center mt-8">
                <button
                    onClick={onProcess}
                    className="bg-sushi-red hover:bg-sushi-red-dark text-white font-bold text-base px-12 py-3.5 rounded-lg transition-all duration-150 active:scale-[0.97]"
                >
                    Split PDF
                </button>
            </div>
        </div>
    );
}

export default function SplitPdfPage() {
    return (
        <ToolPageLayout
            toolId="split-pdf"
            toolName="Split PDF file"
            toolDescription="Separate one page or a whole set for easy conversion into independent PDF files."
            toolColor="#FF6D3A"
            icon={
                <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Scissors className="w-8 h-8 text-orange-500" />
                </div>
            }
            renderEditPhase={(files, onProcess) => (
                <SplitPdfEditPhase files={files} onProcess={onProcess} />
            )}
        />
    );
}
