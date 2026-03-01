"use client";

import React, { useState, useCallback } from "react";
import { RotateCw, X, FileText } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";

interface PageItem {
    id: string;
    pageNumber: number;
    rotation: number;
    removed: boolean;
}

function RotatePdfEditPhase({
    files,
    onProcess,
}: {
    files: File[];
    onProcess: () => void;
}) {
    // Simulate 8 pages
    const [pages, setPages] = useState<PageItem[]>(() =>
        Array.from({ length: 8 }, (_, i) => ({
            id: `page-${i + 1}`,
            pageNumber: i + 1,
            rotation: 0,
            removed: false,
        }))
    );

    const handleRotate = useCallback((id: string) => {
        setPages((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p
            )
        );
    }, []);

    const handleRemove = useCallback((id: string) => {
        setPages((prev) =>
            prev.map((p) => (p.id === id ? { ...p, removed: !p.removed } : p))
        );
    }, []);

    const handleRotateAll = useCallback(() => {
        setPages((prev) =>
            prev.map((p) => ({ ...p, rotation: (p.rotation + 90) % 360 }))
        );
    }, []);

    const activePages = pages.filter((p) => !p.removed);

    return (
        <div>
            {/* Toolbar */}
            <div className="flex items-center justify-end mb-4">
                <button
                    onClick={handleRotateAll}
                    className="flex items-center gap-1.5 text-sm font-medium text-sushi-gray-600 hover:text-sushi-gray-800 border border-sushi-gray-300 rounded-lg px-3 py-1.5 transition-colors hover:bg-sushi-gray-50"
                >
                    <RotateCw className="w-4 h-4" />
                    Rotate all
                </button>
            </div>

            {/* Page grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {pages.map((page) => (
                    <div
                        key={page.id}
                        className={`relative bg-white border rounded-lg overflow-hidden group transition-all ${page.removed
                                ? "border-red-300 opacity-50"
                                : "border-sushi-gray-200 hover:shadow-md"
                            }`}
                    >
                        {/* Remove button */}
                        <button
                            onClick={() => handleRemove(page.id)}
                            className={`absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-opacity ${page.removed
                                    ? "bg-red-500 text-white opacity-100"
                                    : "bg-sushi-red text-white opacity-0 group-hover:opacity-100 hover:bg-sushi-red-dark"
                                }`}
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>

                        {/* Rotate button */}
                        <button
                            onClick={() => handleRotate(page.id)}
                            className="absolute bottom-12 right-2 z-10 w-6 h-6 bg-white border border-sushi-gray-300 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-sushi-gray-100"
                        >
                            <RotateCw className="w-3 h-3 text-sushi-gray-700" />
                        </button>

                        {/* Page preview */}
                        <div
                            className="w-full aspect-[3/4] bg-sushi-gray-50 flex items-center justify-center transition-transform duration-200"
                            style={{ transform: `rotate(${page.rotation}deg)` }}
                        >
                            <FileText className="w-12 h-12 text-sushi-gray-300" />
                        </div>

                        {/* Page number */}
                        <div className="p-2 border-t border-sushi-gray-200 text-center">
                            <p className="text-xs text-sushi-gray-600 font-medium">
                                Page {page.pageNumber}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Action button */}
            <div className="flex justify-center mt-8">
                <button
                    onClick={onProcess}
                    className="bg-sushi-red hover:bg-sushi-red-dark text-white font-bold text-base px-12 py-3.5 rounded-lg transition-all duration-150 active:scale-[0.97]"
                >
                    Rotate PDF
                </button>
            </div>
        </div>
    );
}

export default function RotatePdfPage() {
    return (
        <ToolPageLayout
            toolId="rotate-pdf"
            toolName="Rotate PDF"
            toolDescription="Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!"
            toolColor="#E8423F"
            icon={
                <div className="w-16 h-16 bg-sushi-red/10 rounded-xl flex items-center justify-center">
                    <RotateCw className="w-8 h-8 text-sushi-red" />
                </div>
            }
            renderEditPhase={(files, onProcess) => (
                <RotatePdfEditPhase files={files} onProcess={onProcess} />
            )}
        />
    );
}
