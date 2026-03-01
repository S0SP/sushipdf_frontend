"use client";

import React, { useState } from "react";
import {
    Scissors, Minimize2, RotateCw, Trash2, Image, Hash,
    Lock, Unlock, Droplets, Shield, FileText, Wrench,
    ScanSearch, PenLine, Layers, ChevronRight, Crop, Scale3D,
    Merge, BookOpen, Eye, Download, Highlighter, Save,
} from "lucide-react";
import {
    API_TOOLS, getToolsByCategory, CATEGORY_LABELS,
    type ApiTool, type ApiToolParam, type ToolCategory,
} from "@/lib/apiTools";

interface WorkspaceToolbarProps {
    level: "parent" | "pages";
    selectedToolId: string | null;
    onSelectTool: (toolId: string | null) => void;
    onExecuteTool: (toolId: string, params: Record<string, unknown>) => void;
    processing: boolean;
    onSave: () => void;
    onDownload: () => void;
}

const CATEGORY_ICONS: Record<ToolCategory, React.ReactNode> = {
    split: <Scissors size={20} />,
    optimize: <Minimize2 size={20} />,
    edit: <PenLine size={20} />,
    security: <Shield size={20} />,
    extract: <Image size={20} />,
    convert: <Layers size={20} />,
    annotate: <Highlighter size={20} />,
};

const TOOL_ICONS: Record<string, React.ReactNode> = {
    "split-pages": <Scissors size={22} />,
    "split-by-size-or-count": <Scissors size={22} />,
    "split-by-chapters": <BookOpen size={22} />,
    "split-by-sections": <Layers size={22} />,
    "compress-pdf": <Minimize2 size={22} />,
    "ocr-pdf": <ScanSearch size={22} />,
    "flatten-pdf": <FileText size={22} />,
    "repair-pdf": <Wrench size={22} />,
    "remove-blanks": <Trash2 size={22} />,
    "rotate-pdf": <RotateCw size={22} />,
    "remove-pages": <Trash2 size={22} />,
    "rearrange-pages": <Layers size={22} />,
    "crop-pdf": <Crop size={22} />,
    "scale-pages": <Scale3D size={22} />,
    "add-page-numbers": <Hash size={22} />,
    "add-watermark": <Droplets size={22} />,
    "add-stamp": <PenLine size={22} />,
    "add-image": <Image size={22} />,
    "update-metadata": <FileText size={22} />,
    "add-password": <Lock size={22} />,
    "remove-password": <Unlock size={22} />,
    "redact": <Eye size={22} />,
    "sanitize-pdf": <Shield size={22} />,
    "extract-images": <Image size={22} />,
    "extract-attachments": <Download size={22} />,
    "merge-pdfs": <Merge size={22} />,
    "annotate": <Highlighter size={22} />,
};

// ══════════════════════════════════
//  Param Form for a selected tool
// ══════════════════════════════════
function ToolParamForm({
    tool,
    onExecute,
    onCancel,
    processing,
}: {
    tool: ApiTool;
    onExecute: (params: Record<string, unknown>) => void;
    onCancel: () => void;
    processing: boolean;
}) {
    const [values, setValues] = useState<Record<string, unknown>>(() => {
        const init: Record<string, unknown> = {};
        tool.params.forEach((p) => {
            if (p.defaultValue !== undefined) init[p.name] = p.defaultValue;
        });
        return init;
    });

    const setValue = (name: string, val: unknown) =>
        setValues((prev) => ({ ...prev, [name]: val }));

    return (
        <div className="flex flex-col gap-5 animate-in slide-in-from-right-4 duration-200">
            <div className="flex items-center gap-3 mb-1">
                <span className="text-sushi-red">{TOOL_ICONS[tool.id]}</span>
                <h3 className="font-extrabold text-lg text-gray-900">{tool.name}</h3>
            </div>
            <p className="text-sm text-gray-600 -mt-2 leading-relaxed">{tool.description}</p>

            {tool.params.length === 0 && (
                <p className="text-sm text-gray-400 italic">No configuration needed — just execute.</p>
            )}

            {tool.params.map((p) => (
                <ParamInput key={p.name} param={p} value={values[p.name]} onChange={(v) => setValue(p.name, v)} />
            ))}

            <div className="flex gap-3 mt-3">
                <button
                    onClick={() => onExecute(values)}
                    disabled={processing}
                    className="flex-1 bg-sushi-red hover:bg-sushi-red-dark text-white text-base font-bold py-3 px-5 rounded-xl transition-all disabled:opacity-50 shadow-sm"
                >
                    {processing ? "Processing…" : "Execute"}
                </button>
                <button
                    onClick={onCancel}
                    disabled={processing}
                    className="px-5 py-3 rounded-xl text-base font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-all disabled:opacity-50"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

function ParamInput({
    param,
    value,
    onChange,
}: {
    param: ApiToolParam;
    value: unknown;
    onChange: (v: unknown) => void;
}) {
    const base = "w-full text-base font-medium border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sushi-red/40 focus:border-sushi-red transition-all text-gray-900";

    switch (param.type) {
        case "text":
            return (
                <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-bold text-gray-800">{param.label}</span>
                    <input
                        type="text"
                        className={base}
                        placeholder={param.placeholder}
                        value={(value as string) ?? ""}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    {param.description && <span className="text-xs text-gray-500">{param.description}</span>}
                </label>
            );
        case "number":
            return (
                <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-bold text-gray-800">{param.label}</span>
                    <input
                        type="number"
                        className={base}
                        min={param.min}
                        max={param.max}
                        value={(value as number) ?? ""}
                        onChange={(e) => onChange(Number(e.target.value))}
                    />
                    {param.description && <span className="text-xs text-gray-500">{param.description}</span>}
                </label>
            );
        case "select":
            return (
                <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-bold text-gray-800">{param.label}</span>
                    <select className={base} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)}>
                        {param.options?.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                </label>
            );
        case "checkbox":
            return (
                <label className="flex items-center gap-3 cursor-pointer py-1">
                    <input
                        type="checkbox"
                        checked={(value as boolean) ?? false}
                        onChange={(e) => onChange(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-400 text-sushi-red focus:ring-sushi-red"
                    />
                    <span className="text-sm font-bold text-gray-800">{param.label}</span>
                </label>
            );
        case "range":
            return (
                <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-bold text-gray-800">{param.label}: <span className="text-sushi-red">{String(value ?? param.defaultValue)}</span></span>
                    <input
                        type="range"
                        min={param.min}
                        max={param.max}
                        step={0.05}
                        value={(value as number) ?? 0}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="accent-sushi-red h-2"
                    />
                </label>
            );
        default:
            return null;
    }
}

// ══════════════════════════════════
//  Main Toolbar Component
// ══════════════════════════════════
export default function WorkspaceToolbar({
    level,
    selectedToolId,
    onSelectTool,
    onExecuteTool,
    processing,
    onSave,
    onDownload,
}: WorkspaceToolbarProps) {
    const grouped = getToolsByCategory(level);
    const selectedTool = selectedToolId ? API_TOOLS.find((t) => t.id === selectedToolId) : null;
    const [expandedCategory, setExpandedCategory] = useState<ToolCategory | null>(null);

    return (
        <div className="w-80 border-l-2 border-gray-200 bg-white flex flex-col flex-shrink-0 h-[calc(100vh-64px)] overflow-hidden">
            <div className="flex-1 overflow-y-auto">
                {selectedTool ? (
                    <div className="p-5">
                        <ToolParamForm
                            tool={selectedTool}
                            onExecute={(params) => onExecuteTool(selectedTool.id, params)}
                            onCancel={() => onSelectTool(null)}
                            processing={processing}
                        />
                    </div>
                ) : (
                    <>
                        <div className="p-5 border-b border-gray-100">
                            <h2 className="font-extrabold text-lg text-gray-900">Tools</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {level === "parent" ? "Select a PDF, then choose a tool" : "Select a tool to apply"}
                            </p>
                        </div>

                        {(Object.entries(grouped) as [ToolCategory, ApiTool[]][]).map(([cat, tools]) => (
                            <div key={cat} className="border-b border-gray-100">
                                <button
                                    onClick={() => setExpandedCategory(expandedCategory === cat ? null : cat)}
                                    className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                                >
                                    <span className="text-gray-600">{CATEGORY_ICONS[cat]}</span>
                                    <span className="text-base font-bold text-gray-800 flex-1">{CATEGORY_LABELS[cat]}</span>
                                    <span className="text-sm font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{tools.length}</span>
                                    <ChevronRight
                                        size={18}
                                        className={`text-gray-400 transition-transform ${expandedCategory === cat ? "rotate-90" : ""}`}
                                    />
                                </button>

                                {expandedCategory === cat && (
                                    <div className="pb-3 animate-in slide-in-from-top-2 duration-150">
                                        {tools.map((tool) => (
                                            <button
                                                key={tool.id}
                                                onClick={() => onSelectTool(tool.id)}
                                                className="w-full flex items-center gap-3 px-7 py-3 hover:bg-red-50 text-left transition-colors group"
                                            >
                                                <span className="text-gray-500 group-hover:text-sushi-red transition-colors">
                                                    {TOOL_ICONS[tool.id] ?? <Wrench size={22} />}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-800 group-hover:text-sushi-red transition-colors">{tool.name}</p>
                                                    <p className="text-xs text-gray-500 truncate leading-relaxed">{tool.description}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="p-4 border-t-2 border-gray-200 bg-gray-50 flex flex-col gap-2 shrink-0">
                <button
                    onClick={onSave}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-100 border-2 border-gray-300 text-gray-800 text-sm font-bold rounded-xl transition-all shadow-sm"
                >
                    <Save size={18} />
                    Save Draft
                </button>
                <button
                    onClick={onDownload}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sushi-red hover:bg-sushi-red-dark text-white text-sm font-bold rounded-xl transition-all shadow-sm"
                >
                    <Download size={18} />
                    Download PDF
                </button>
            </div>
        </div >
    );
}
