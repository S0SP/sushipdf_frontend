"use client";

import React, { useState } from "react";
import { FileText, Check, X, Edit3 } from "lucide-react";

interface SplitRenameDialogProps {
    files: File[];
    parentName: string;
    onConfirm: (renamedFiles: { file: File; name: string }[]) => void;
    onCancel: () => void;
}

export default function SplitRenameDialog({
    files,
    parentName,
    onConfirm,
    onCancel,
}: SplitRenameDialogProps) {
    const baseName = parentName.replace(/\.pdf$/i, "");
    const [names, setNames] = useState<string[]>(
        files.map((_, i) => `${baseName}_part_${i + 1}`)
    );
    const [editingIdx, setEditingIdx] = useState<number | null>(null);

    const handleNameChange = (idx: number, value: string) => {
        setNames((prev) => prev.map((n, i) => (i === idx ? value : n)));
    };

    const handleConfirm = () => {
        const renamed = files.map((file, i) => ({
            file,
            name: names[i].endsWith(".pdf") ? names[i] : `${names[i]}.pdf`,
        }));
        onConfirm(renamed);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <h2 className="font-extrabold text-lg text-gray-900">Name Your Split PDFs</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Split from <span className="font-bold text-gray-800">{parentName}</span> • {files.length} files
                        </p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        <X size={18} className="text-gray-600" />
                    </button>
                </div>

                {/* File List */}
                <div className="px-7 py-5 max-h-80 overflow-y-auto space-y-3">
                    {files.map((file, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors group"
                        >
                            <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FileText size={22} className="text-sushi-red" />
                            </div>

                            <div className="flex-1 min-w-0">
                                {editingIdx === idx ? (
                                    <input
                                        autoFocus
                                        type="text"
                                        value={names[idx]}
                                        onChange={(e) => handleNameChange(idx, e.target.value)}
                                        onBlur={() => setEditingIdx(null)}
                                        onKeyDown={(e) => e.key === "Enter" && setEditingIdx(null)}
                                        className="w-full text-base font-bold border-2 border-sushi-red rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sushi-red/30 text-gray-900"
                                    />
                                ) : (
                                    <p className="text-base font-bold text-gray-800 truncate">
                                        {names[idx]}.pdf
                                    </p>
                                )}
                                <p className="text-xs font-semibold text-gray-500 mt-0.5">
                                    {(file.size / 1024).toFixed(1)} KB
                                </p>
                            </div>

                            <button
                                onClick={() => setEditingIdx(editingIdx === idx ? null : idx)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Edit3 size={16} className="text-gray-500" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex gap-4 px-7 py-5 border-t border-gray-100 bg-gray-50/50">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-5 py-3 text-base font-bold border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition-colors text-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 flex items-center justify-center gap-2 bg-sushi-red hover:bg-sushi-red-dark text-white text-base font-bold py-3 px-5 rounded-xl transition-all shadow-sm"
                    >
                        <Check size={18} />
                        Save as Draft
                    </button>
                </div>
            </div>
        </div>
    );
}
