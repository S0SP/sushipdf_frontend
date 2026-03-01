"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
    ArrowLeft, Upload, Plus, Undo2, Redo2, FileText,
    X, ChevronLeft, RotateCw, Check,
} from "lucide-react";
import {
    DndContext, closestCenter, PointerSensor, KeyboardSensor,
    useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext, rectSortingStrategy, useSortable, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useWorkspaceState, type WorkspacePdf } from "@/hooks/useWorkspaceState";
import { API_TOOLS } from "@/lib/apiTools";
import WorkspaceToolbar from "@/components/WorkspaceToolbar";
import PageThumbnailGrid from "@/components/PageThumbnailGrid";
import SplitRenameDialog from "@/components/SplitRenameDialog";
import UploadZone from "@/components/UploadZone";
import dynamic from "next/dynamic";

const PdfThumbnail = dynamic(
    () => import("@/components/PdfPageRenderer").then((mod) => mod.PdfThumbnail),
    { ssr: false, loading: () => <div className="w-full h-full bg-gray-50 flex items-center justify-center animate-pulse" /> }
);

const PdfFullPreview = dynamic(
    () => import("@/components/PdfPageRenderer").then((mod) => mod.PdfFullPreview),
    { ssr: false, loading: () => <div className="w-full h-full bg-gray-50 flex items-center justify-center animate-pulse" /> }
);

// ═══════════════════════════════════
//  Sortable PDF Card (Level 1)
//  Full-card drag — no grip handle
//  Real PDF cover via react-pdf
// ═══════════════════════════════════
function SortablePdfCard({
    pdf,
    onDoubleClick,
    onRemove,
    onRotate,
    onPageCountLoaded,
}: {
    pdf: WorkspacePdf;
    onDoubleClick: () => void;
    onRemove: () => void;
    onRotate: () => void;
    onPageCountLoaded: (pdfId: string, count: number) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: pdf.id,
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onDoubleClick={onDoubleClick}
            className="relative group bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-lg hover:border-sushi-red/30 transition-all cursor-grab active:cursor-grabbing"
        >
            {/* Action Buttons: Rotate & Delete */}
            <div className="absolute -top-2.5 -right-2.5 z-10 flex flex-col md:flex-row items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                {/* Rotate */}
                <button
                    onClick={(e) => { e.stopPropagation(); onRotate(); }}
                    className="w-7 h-7 bg-white hover:bg-sushi-red hover:text-white text-gray-600 rounded-full flex items-center justify-center shadow-md border border-gray-200 transition-colors"
                    title="Rotate PDF"
                >
                    <RotateCw size={13} />
                </button>
                {/* Delete X */}
                <button
                    onClick={(e) => { e.stopPropagation(); onRemove(); }}
                    className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                    title="Remove PDF"
                >
                    <X size={14} />
                </button>
            </div>

            {/* Draft badge */}
            {pdf.isDraft && (
                <div className="absolute top-2 right-2 z-10 px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                    DRAFT
                </div>
            )}

            {/* Thumbnail — Real PDF first page */}
            <div className="w-full aspect-[3/4] bg-gradient-to-b from-gray-50 to-gray-100 rounded-t-xl flex items-center justify-center overflow-hidden">
                <PdfThumbnail
                    fileUrl={pdf.objectUrl}
                    pageNumber={1}
                    width={180}
                    rotation={pdf.rotation}
                    onPageCountLoaded={(count) => onPageCountLoaded(pdf.id, count)}
                    className="w-full h-full flex items-center justify-center"
                />
            </div>

            {/* Footer */}
            <div className="px-3 py-3 border-t border-gray-100">
                <p className="text-sm font-bold text-gray-800 truncate" title={pdf.name}>
                    {pdf.name}
                </p>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">
                    {pdf.pageCount > 0 ? `${pdf.pageCount} pages` : "Loading…"} • {(pdf.file.size / 1024).toFixed(0)} KB
                </p>
            </div>

            {/* Hover instruction */}
            <div className="absolute inset-0 bg-sushi-red/5 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="bg-white/95 px-4 py-2 rounded-xl text-sm font-bold text-sushi-red shadow-sm">
                    Double-click to open
                </span>
            </div>
        </div>
    );
}

// ═══════════════════════════════════
//  Main Workspace Component
// ═══════════════════════════════════
export default function PdfWorkspace() {
    const ws = useWorkspaceState();
    const { state } = ws;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const previewContainerRef = useRef<HTMLDivElement>(null);
    const [processing, setProcessing] = useState(false);
    const [splitDialogFiles, setSplitDialogFiles] = useState<File[] | null>(null);
    const searchParams = useSearchParams();

    // Draft saved indicator state
    const [showDraftSaved, setShowDraftSaved] = useState(false);
    const stateHash = useRef(0);

    useEffect(() => {
        // Detect actual modifications to pages/pdfs
        const currentHash = state.pdfs.length + state.pages.length +
            state.pages.reduce((acc, p) => acc + p.rotation + (p.deleted ? 1 : 0), 0) +
            state.pdfs.reduce((acc, p) => acc + p.rotation, 0);

        if (stateHash.current !== 0 && currentHash !== stateHash.current) {
            setShowDraftSaved(true);
            const t = setTimeout(() => setShowDraftSaved(false), 3000);
            return () => clearTimeout(t);
        }
        stateHash.current = currentHash;
    }, [state.pdfs, state.pages]);

    // Read ?tool= from URL and auto-select it
    const urlToolId = searchParams.get("tool");
    const urlTool = urlToolId ? API_TOOLS.find((t) => t.id === urlToolId) : null;

    useEffect(() => {
        if (urlToolId && !state.selectedTool) {
            ws.selectTool(urlToolId);
        }
    }, [urlToolId]); // eslint-disable-line react-hooks/exhaustive-deps

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor)
    );

    // Ctrl+Z / Ctrl+Y for undo/redo
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
                e.preventDefault();
                ws.undo();
            }
            if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
                e.preventDefault();
                ws.redo();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [ws]);

    // Dynamic header title
    const headerTitle = (() => {
        if (state.viewLevel === "preview") {
            return `Page ${state.activePageIndex !== null ? state.activePageIndex + 1 : ""}`;
        }
        if (state.viewLevel === "pages") {
            const activePdf = state.pdfs.find((p) => p.id === state.activePdfId);
            return activePdf?.name ?? "Pages";
        }
        if (urlTool) return urlTool.name;
        return "PDF Workspace";
    })();

    // ── File upload ──
    const handleFilesSelected = useCallback((files: File[]) => {
        const pdfFiles = files.filter((f) => f.type === "application/pdf" || f.name.endsWith(".pdf"));
        if (pdfFiles.length > 0) ws.addPdfs(pdfFiles);
    }, [ws]);

    const handleAddMore = () => fileInputRef.current?.click();

    // ── Page count callback from PdfThumbnail ──
    const handlePageCountLoaded = useCallback((pdfId: string, count: number) => {
        ws.updatePdfPageCount(pdfId, count);
    }, [ws]);

    // ── PDF drag reorder (Level 1) ──
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIdx = state.pdfs.findIndex((p) => p.id === active.id);
        const newIdx = state.pdfs.findIndex((p) => p.id === over.id);
        if (oldIdx !== -1 && newIdx !== -1) {
            ws.reorderPdfs(arrayMove(state.pdfs, oldIdx, newIdx));
        }
    };

    // ── Execute tool ──
    const handleExecuteTool = useCallback(async (toolId: string, params: Record<string, unknown>) => {
        setProcessing(true);
        try {
            await new Promise((r) => setTimeout(r, 1500));
            if (toolId.startsWith("split")) {
                const mockFiles = [
                    new File(["split1"], "split_1.pdf", { type: "application/pdf" }),
                    new File(["split2"], "split_2.pdf", { type: "application/pdf" }),
                ];
                setSplitDialogFiles(mockFiles);
            }
        } finally {
            setProcessing(false);
        }
    }, []);

    // ── Split rename confirm ──
    const handleSplitRenameConfirm = useCallback((renamed: { file: File; name: string }[]) => {
        if (state.activePdfId) {
            ws.addSplitDrafts(state.activePdfId, renamed);
        }
        setSplitDialogFiles(null);
    }, [ws, state.activePdfId]);

    // ── Get active PDF ──
    const activePdf = state.activePdfId
        ? state.pdfs.find((p) => p.id === state.activePdfId)
        : null;

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50/50 flex flex-col">
            {/* ══════════════ HEADER BAR ══════════════ */}
            <div className="bg-white border-b-2 border-gray-200 px-5 py-3.5 flex items-center gap-4">
                {state.viewLevel !== "parent" && (
                    <button
                        onClick={ws.goBack}
                        className="flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-sushi-red transition-colors"
                    >
                        <ArrowLeft size={18} />
                        <span className="hidden sm:inline">{state.viewLevel === "preview" ? "Pages" : "All PDFs"}</span>
                    </button>
                )}

                <div className="flex-1 min-w-0">
                    <h1 className="text-lg font-extrabold text-gray-900 truncate">{headerTitle}</h1>
                </div>

                {/* Undo/Redo & Draft Status */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={ws.undo}
                        title="Undo (Ctrl+Z)"
                        className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 disabled:opacity-30"
                    >
                        <Undo2 size={18} />
                    </button>
                    <button
                        onClick={ws.redo}
                        title="Redo (Ctrl+Y)"
                        className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 disabled:opacity-30"
                    >
                        <Redo2 size={18} />
                    </button>

                    <div className={`ml-3 flex items-center gap-1.5 text-sm font-extrabold text-[#22c55e] transition-opacity duration-300 ${showDraftSaved ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <div className="w-5 h-5 bg-[#22c55e]/10 rounded-full flex items-center justify-center">
                            <Check size={14} strokeWidth={4} />
                        </div>
                        Saved
                    </div>
                </div>

                {state.viewLevel === "parent" && state.pdfs.length > 0 && (
                    <button
                        onClick={handleAddMore}
                        className="flex items-center gap-2 px-4 py-2 bg-sushi-red hover:bg-sushi-red-dark text-white text-sm font-bold rounded-xl transition-all"
                    >
                        <Plus size={16} />
                        Add PDF
                    </button>
                )}
            </div>

            {/* ══════════════ MAIN CONTENT ══════════════ */}
            <div className="flex-1 flex overflow-hidden">
                {/* Central Pane */}
                <div className="flex-1 overflow-y-auto p-6">

                    {/* ── Level 1: Parent View ── */}
                    {state.viewLevel === "parent" && state.pdfs.length === 0 && (
                        <div className="max-w-xl mx-auto mt-12">
                            <UploadZone onFilesSelected={handleFilesSelected} accept=".pdf" multiple label="Select PDF files" />
                        </div>
                    )}

                    {state.viewLevel === "parent" && state.pdfs.length > 0 && (
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={state.pdfs.map((p) => p.id)} strategy={rectSortingStrategy}>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                                    {state.pdfs.map((pdf) => (
                                        <SortablePdfCard
                                            key={pdf.id}
                                            pdf={pdf}
                                            onDoubleClick={() => ws.openPdf(pdf.id, pdf.pageCount || 5)}
                                            onRemove={() => ws.removePdf(pdf.id)}
                                            onRotate={() => ws.rotatePdf(pdf.id)}
                                            onPageCountLoaded={handlePageCountLoaded}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}

                    {/* ── Level 2: Pages View ── */}
                    {state.viewLevel === "pages" && activePdf && (
                        <PageThumbnailGrid
                            pages={state.pages}
                            pdfUrl={activePdf.objectUrl}
                            onReorder={ws.reorderPages}
                            onRotate={ws.rotatePage}
                            onDelete={ws.deletePage}
                            onPageClick={ws.openPagePreview}
                            onRotateAll={ws.rotateAllPages}
                        />
                    )}

                    {/* ── Level 3: Adaptive Real PDF Preview ── */}
                    {state.viewLevel === "preview" && activePdf && state.activePageIndex !== null && (
                        <div className="flex flex-col h-full">
                            {/* Adaptive PDF render — fills available space */}
                            <div
                                ref={previewContainerRef}
                                className="flex-1 flex items-center justify-center p-4 min-h-0"
                                style={{ maxHeight: "calc(100vh - 200px)" }}
                            >
                                <PdfFullPreview
                                    fileUrl={activePdf.objectUrl}
                                    pageNumber={state.pages[state.activePageIndex]?.pageNumber ?? state.activePageIndex + 1}
                                    rotation={state.pages[state.activePageIndex]?.rotation ?? 0}
                                    containerRef={previewContainerRef}
                                />
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-white">
                                <button
                                    onClick={() => {
                                        const prev = state.activePageIndex! - 1;
                                        if (prev >= 0) ws.openPagePreview(prev);
                                    }}
                                    disabled={state.activePageIndex === 0}
                                    className="flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-sushi-red disabled:opacity-30 transition-colors"
                                >
                                    <ChevronLeft size={16} /> Previous
                                </button>
                                <span className="text-sm font-bold text-gray-500">
                                    {state.activePageIndex + 1} / {state.pages.filter((p) => !p.deleted).length}
                                </span>
                                <button
                                    onClick={() => {
                                        const next = state.activePageIndex! + 1;
                                        if (next < state.pages.filter((p) => !p.deleted).length) ws.openPagePreview(next);
                                    }}
                                    disabled={state.activePageIndex >= state.pages.filter((p) => !p.deleted).length - 1}
                                    className="flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-sushi-red disabled:opacity-30 transition-colors"
                                >
                                    Next <ChevronLeft size={16} className="rotate-180" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Right-Side Toolbar ── */}
                {state.pdfs.length > 0 && (
                    <WorkspaceToolbar
                        level={state.viewLevel === "parent" ? "parent" : "pages"}
                        selectedToolId={state.selectedTool}
                        onSelectTool={ws.selectTool}
                        onExecuteTool={handleExecuteTool}
                        processing={processing}
                        onSave={() => {
                            setShowDraftSaved(true);
                            setTimeout(() => setShowDraftSaved(false), 3000);
                        }}
                        onDownload={() => {
                            const link = document.createElement("a");
                            link.href = activePdf?.objectUrl || "";
                            link.download = `sushi-pdf-${Date.now()}.pdf`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }}
                    />
                )}
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                multiple
                className="hidden"
                onChange={(e) => {
                    if (e.target.files) handleFilesSelected(Array.from(e.target.files));
                    e.target.value = "";
                }}
            />

            {/* Split Rename Dialog */}
            {splitDialogFiles && activePdf && (
                <SplitRenameDialog
                    files={splitDialogFiles}
                    parentName={activePdf.name}
                    onConfirm={handleSplitRenameConfirm}
                    onCancel={() => setSplitDialogFiles(null)}
                />
            )}
        </div>
    );
}
