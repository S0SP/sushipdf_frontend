"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle, Download, RotateCcw } from "lucide-react";
import { getRelatedTools } from "@/lib/toolsData";

interface DownloadScreenProps {
    toolId: string;
    fileName?: string;
    fileSize?: string;
    onStartOver: () => void;
}

export default function DownloadScreen({
    toolId,
    fileName = "processed.pdf",
    fileSize = "2.4 MB",
    onStartOver,
}: DownloadScreenProps) {
    const relatedTools = getRelatedTools(toolId, 4);

    return (
        <div className="flex flex-col items-center text-center py-10 px-5">
            {/* Success icon */}
            <div className="w-20 h-20 rounded-full bg-sushi-success/10 flex items-center justify-center mb-5 animate-in zoom-in duration-300">
                <CheckCircle className="w-12 h-12 text-sushi-success" />
            </div>

            <h2 className="text-2xl font-bold text-sushi-gray-800 mb-2">
                Your PDF is ready!
            </h2>
            <p className="text-sm text-sushi-gray-600 mb-1">{fileName}</p>
            <p className="text-xs text-sushi-gray-500 mb-6">{fileSize}</p>

            {/* Download button */}
            <button className="bg-sushi-red hover:bg-sushi-red-dark text-white font-bold text-base px-10 py-3.5 rounded-lg transition-all duration-150 active:scale-[0.97] flex items-center gap-2 mb-4">
                <Download className="w-5 h-5" />
                Download PDF
            </button>

            {/* Cloud save options */}
            <div className="flex items-center gap-3 mb-8">
                <button className="flex items-center gap-2 text-xs text-sushi-gray-600 hover:text-sushi-gray-800 border border-sushi-gray-200 rounded-full px-3 py-1.5 transition-colors">
                    <span className="text-base">📁</span> Save to Google Drive
                </button>
                <button className="flex items-center gap-2 text-xs text-sushi-gray-600 hover:text-sushi-gray-800 border border-sushi-gray-200 rounded-full px-3 py-1.5 transition-colors">
                    <span className="text-base">📦</span> Save to Dropbox
                </button>
            </div>

            {/* Start over */}
            <button
                onClick={onStartOver}
                className="flex items-center gap-1.5 text-sm text-sushi-gray-500 hover:text-sushi-red transition-colors mb-12"
            >
                <RotateCcw className="w-4 h-4" />
                Start over
            </button>

            {/* Related tools */}
            <div className="w-full max-w-2xl">
                <h3 className="text-sm font-bold text-sushi-gray-800 mb-4">
                    What do you want to do next?
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {relatedTools.map((tool) => (
                        <Link
                            key={tool.id}
                            href={tool.route}
                            className="bg-white border border-sushi-gray-200 rounded-lg p-3 text-center hover:shadow-md hover:-translate-y-0.5 transition-all"
                        >
                            <p className="text-xs font-bold text-sushi-gray-800">
                                {tool.name}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
