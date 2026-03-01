"use client";

import React from "react";
import {
    Merge, Scissors, Minimize2, FileX, FileOutput, ArrowUpDown, ScanLine,
    Wrench, ScanSearch, Image, FileText, Presentation, Sheet, Globe,
    Archive, RotateCw, Hash, Droplets, Crop, PenLine, Unlock, Lock,
    PenTool, EyeOff, GitCompare, Languages,
} from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import { getToolById } from "@/lib/toolsData";

const iconComponents: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
    Merge, Scissors, Minimize2, FileX, FileOutput, ArrowUpDown, ScanLine,
    Wrench, ScanSearch, Image, FileText, Presentation, Sheet, Globe,
    Archive, RotateCw, Hash, Droplets, Crop, PenLine, Unlock, Lock,
    PenTool, EyeOff, GitCompare, Languages,
};

interface SimpleToolPageProps {
    toolId: string;
    accept?: string;
    multiple?: boolean;
}

export default function SimpleToolPage({
    toolId,
    accept = ".pdf",
    multiple = false,
}: SimpleToolPageProps) {
    const tool = getToolById(toolId);
    if (!tool) return <div>Tool not found</div>;

    const Icon = iconComponents[tool.icon];

    return (
        <ToolPageLayout
            toolId={tool.id}
            toolName={tool.name}
            toolDescription={tool.description}
            toolColor={tool.color}
            icon={
                <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${tool.color}15` }}
                >
                    {Icon && <Icon className="w-8 h-8" style={{ color: tool.color }} />}
                </div>
            }
            accept={accept}
            multiple={multiple}
            skipEditPhase={true}
        />
    );
}
