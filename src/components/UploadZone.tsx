"use client";

import React, { useCallback, useState, useRef } from "react";
import { Upload } from "lucide-react";

interface UploadZoneProps {
    onFilesSelected: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
    label?: string;
    sublabel?: string;
}

export default function UploadZone({
    onFilesSelected,
    accept = ".pdf",
    multiple = false,
    label = "Select PDF file",
    sublabel = "or drop PDF here",
}: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            const files = Array.from(e.dataTransfer.files);
            if (files.length) onFilesSelected(files);
        },
        [onFilesSelected]
    );

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(e.target.files || []);
            if (files.length) onFilesSelected(files);
        },
        [onFilesSelected]
    );

    return (
        <div className="flex flex-col items-center gap-3">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full max-w-lg border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-all duration-200 ${isDragging
                    ? "border-sushi-red bg-sushi-red-light"
                    : "border-sushi-gray-300 bg-white hover:border-sushi-gray-500"
                    }`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleInputChange}
                    className="hidden"
                />
                <button
                    onClick={() => inputRef.current?.click()}
                    className="bg-sushi-red hover:bg-sushi-red-dark text-white font-bold text-base px-10 py-3.5 rounded-lg transition-all duration-150 active:scale-[0.97] flex items-center gap-2"
                >
                    <Upload className="w-5 h-5" />
                    {label}
                </button>
                <p className="text-sm text-sushi-gray-500 mt-3">{sublabel}</p>
            </div>

            {/* Cloud integrations */}
            <div className="flex items-center gap-4 mt-2">
                <button className="flex items-center gap-2 text-xs text-sushi-gray-600 hover:text-sushi-gray-800 transition-colors border border-sushi-gray-200 rounded-full px-3 py-1.5">
                    <span className="text-base">📁</span> Google Drive
                </button>
                <button className="flex items-center gap-2 text-xs text-sushi-gray-600 hover:text-sushi-gray-800 transition-colors border border-sushi-gray-200 rounded-full px-3 py-1.5">
                    <span className="text-base">📦</span> Dropbox
                </button>
            </div>
        </div>
    );
}
