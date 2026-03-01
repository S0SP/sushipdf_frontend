"use client";

import React, { useState, useCallback } from "react";
import UploadZone from "./UploadZone";
import DownloadScreen from "./DownloadScreen";
import { Loader2 } from "lucide-react";

type Phase = "upload" | "edit" | "processing" | "download";

interface ToolPageLayoutProps {
    toolId: string;
    toolName: string;
    toolDescription: string;
    toolColor: string;
    icon: React.ReactNode;
    accept?: string;
    multiple?: boolean;
    /** Render the edit phase UI — receives uploaded files */
    renderEditPhase?: (
        files: File[],
        onProcess: () => void
    ) => React.ReactNode;
    /** If no edit phase, just process on upload */
    skipEditPhase?: boolean;
    actionLabel?: string;
}

export default function ToolPageLayout({
    toolId,
    toolName,
    toolDescription,
    toolColor,
    icon,
    accept = ".pdf",
    multiple = false,
    renderEditPhase,
    skipEditPhase = false,
    actionLabel,
}: ToolPageLayoutProps) {
    const [phase, setPhase] = useState<Phase>("upload");
    const [files, setFiles] = useState<File[]>([]);

    const handleFilesSelected = useCallback(
        (newFiles: File[]) => {
            setFiles(newFiles);
            if (skipEditPhase) {
                setPhase("processing");
                // Simulate processing
                setTimeout(() => setPhase("download"), 2000);
            } else {
                setPhase("edit");
            }
        },
        [skipEditPhase]
    );

    const handleProcess = useCallback(() => {
        setPhase("processing");
        // Simulate processing
        setTimeout(() => setPhase("download"), 2500);
    }, []);

    const handleStartOver = useCallback(() => {
        setPhase("upload");
        setFiles([]);
    }, []);

    return (
        <div className="bg-sushi-gray-50 min-h-[calc(100vh-64px)]">
            {/* Tool header */}
            <div className="text-center pt-10 pb-6 px-5">
                <div className="flex justify-center mb-4">{icon}</div>
                <h1 className="text-2xl md:text-3xl font-bold text-sushi-gray-800 mb-2">
                    {toolName}
                </h1>
                <p className="text-sm text-sushi-gray-600 max-w-lg mx-auto">
                    {toolDescription}
                </p>
            </div>

            {/* Phase content */}
            <div className="max-w-[1000px] mx-auto px-5 pb-16">
                {phase === "upload" && (
                    <div className="flex justify-center py-8">
                        <UploadZone
                            onFilesSelected={handleFilesSelected}
                            accept={accept}
                            multiple={multiple}
                            label={`Select ${accept === ".pdf" ? "PDF" : ""} file`}
                        />
                    </div>
                )}

                {phase === "edit" && renderEditPhase && (
                    <div className="py-6">
                        {renderEditPhase(files, handleProcess)}
                    </div>
                )}

                {phase === "processing" && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-sushi-red animate-spin mb-4" />
                        <p className="text-lg font-medium text-sushi-gray-800">
                            Processing your file...
                        </p>
                        <p className="text-xs text-sushi-gray-500 mt-2">
                            Files are automatically deleted from our servers after 2 hours
                        </p>
                    </div>
                )}

                {phase === "download" && (
                    <DownloadScreen
                        toolId={toolId}
                        fileName={files[0]?.name || "processed.pdf"}
                        onStartOver={handleStartOver}
                    />
                )}
            </div>
        </div>
    );
}
