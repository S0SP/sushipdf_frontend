"use client";

import React, { useState, useCallback } from "react";
import { Merge, FileText } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileGrid from "@/components/FileGrid";
import { type FileItem } from "@/components/SortableFileCard";

let fileCounter = 0;

function createFileItem(file: File): FileItem {
    fileCounter++;
    return {
        id: `file-${fileCounter}-${Date.now()}`,
        file,
        name: file.name,
        rotation: 0,
    };
}

function MergePdfEditPhase({
    files,
    onProcess,
}: {
    files: File[];
    onProcess: () => void;
}) {
    const [fileItems, setFileItems] = useState<FileItem[]>(() =>
        files.map(createFileItem)
    );

    const handleAddMore = useCallback((newFiles: File[]) => {
        setFileItems((prev) => [...prev, ...newFiles.map(createFileItem)]);
    }, []);

    return (
        <div>
            <FileGrid
                files={fileItems}
                onFilesChange={setFileItems}
                onAddMore={handleAddMore}
            />
            {fileItems.length > 0 && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={onProcess}
                        className="bg-sushi-red hover:bg-sushi-red-dark text-white font-bold text-base px-12 py-3.5 rounded-lg transition-all duration-150 active:scale-[0.97]"
                    >
                        Merge PDF
                    </button>
                </div>
            )}
        </div>
    );
}

export default function MergePdfPage() {
    return (
        <ToolPageLayout
            toolId="merge-pdf"
            toolName="Merge PDF files"
            toolDescription="Combine PDFs in the order you want with the easiest PDF merger available."
            toolColor="#E8423F"
            icon={
                <div className="w-16 h-16 bg-sushi-red/10 rounded-xl flex items-center justify-center">
                    <Merge className="w-8 h-8 text-sushi-red" />
                </div>
            }
            accept=".pdf"
            multiple={true}
            renderEditPhase={(files, onProcess) => (
                <MergePdfEditPhase files={files} onProcess={onProcess} />
            )}
        />
    );
}
