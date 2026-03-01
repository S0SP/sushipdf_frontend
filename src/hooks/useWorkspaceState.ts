"use client";

import { useState, useCallback, useRef } from "react";

// ──────────────────────────────
//  Types
// ──────────────────────────────
export interface WorkspacePdf {
    id: string;
    file: File;
    name: string;
    pageCount: number;
    /** URL.createObjectURL for the file */
    objectUrl: string;
    /** Rotation of the PDF overall (for UI at level 1) */
    rotation: number;
    /** If this was produced by a split operation */
    isDraft: boolean;
    /** ID of parent PDF this was split from (if draft) */
    splitFromId?: string;
}

export interface PageItem {
    id: string;
    pageNumber: number; // 1-indexed
    rotation: number; // 0, 90, 180, 270
    deleted: boolean;
}

export type ViewLevel = "parent" | "pages" | "preview";

export interface WorkspaceState {
    pdfs: WorkspacePdf[];
    activePdfId: string | null;
    activePageIndex: number | null;
    viewLevel: ViewLevel;
    pages: PageItem[]; // pages of the activePdf
    selectedTool: string | null;
}

// ──────────────────────────────
//  History (undo/redo)
// ──────────────────────────────
const MAX_HISTORY = 50;

function cloneState(s: WorkspaceState): WorkspaceState {
    return JSON.parse(JSON.stringify(s));
}

const INITIAL_STATE: WorkspaceState = {
    pdfs: [],
    activePdfId: null,
    activePageIndex: null,
    viewLevel: "parent",
    pages: [],
    selectedTool: null,
};

// ──────────────────────────────
//  Hook
// ──────────────────────────────
export function useWorkspaceState() {
    const [state, setStateRaw] = useState<WorkspaceState>(INITIAL_STATE);
    const historyRef = useRef<WorkspaceState[]>([]);
    const futureRef = useRef<WorkspaceState[]>([]);

    // Push to history before every mutation
    const pushAndSet = useCallback((next: WorkspaceState | ((prev: WorkspaceState) => WorkspaceState)) => {
        setStateRaw((prev) => {
            historyRef.current = [...historyRef.current.slice(-MAX_HISTORY), cloneState(prev)];
            futureRef.current = [];
            const nextState = typeof next === "function" ? next(prev) : next;
            return nextState;
        });
    }, []);

    // ── Undo / Redo ──
    const undo = useCallback(() => {
        setStateRaw((prev) => {
            if (historyRef.current.length === 0) return prev;
            futureRef.current = [cloneState(prev), ...futureRef.current];
            const last = historyRef.current.pop()!;
            return last;
        });
    }, []);

    const redo = useCallback(() => {
        setStateRaw((prev) => {
            if (futureRef.current.length === 0) return prev;
            historyRef.current = [...historyRef.current, cloneState(prev)];
            const next = futureRef.current.shift()!;
            return next;
        });
    }, []);

    // ── PDF Management (Level 1) ──
    const addPdfs = useCallback((files: File[]) => {
        pushAndSet((prev) => {
            const newPdfs: WorkspacePdf[] = files.map((f, i) => ({
                id: `pdf-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
                file: f,
                name: f.name,
                pageCount: 0, // will be populated when rendered
                objectUrl: URL.createObjectURL(f),
                rotation: 0,
                isDraft: false,
            }));
            return { ...prev, pdfs: [...prev.pdfs, ...newPdfs] };
        });
    }, [pushAndSet]);

    const removePdf = useCallback((pdfId: string) => {
        pushAndSet((prev) => ({
            ...prev,
            pdfs: prev.pdfs.filter((p) => p.id !== pdfId),
            activePdfId: prev.activePdfId === pdfId ? null : prev.activePdfId,
            viewLevel: prev.activePdfId === pdfId ? "parent" : prev.viewLevel,
            pages: prev.activePdfId === pdfId ? [] : prev.pages,
        }));
    }, [pushAndSet]);

    const reorderPdfs = useCallback((newPdfs: WorkspacePdf[]) => {
        pushAndSet((prev) => ({ ...prev, pdfs: newPdfs }));
    }, [pushAndSet]);

    const renamePdf = useCallback((pdfId: string, newName: string) => {
        pushAndSet((prev) => ({
            ...prev,
            pdfs: prev.pdfs.map((p) => (p.id === pdfId ? { ...p, name: newName } : p)),
        }));
    }, [pushAndSet]);

    const updatePdfPageCount = useCallback((pdfId: string, count: number) => {
        setStateRaw((prev) => ({
            ...prev,
            pdfs: prev.pdfs.map((p) => (p.id === pdfId ? { ...p, pageCount: count } : p)),
        }));
    }, []);

    // ── Navigation ──
    const openPdf = useCallback((pdfId: string, pageCount: number) => {
        pushAndSet((prev) => {
            const pages: PageItem[] = Array.from({ length: pageCount }, (_, i) => ({
                id: `page-${pdfId}-${i + 1}`,
                pageNumber: i + 1,
                rotation: 0,
                deleted: false,
            }));
            return {
                ...prev,
                activePdfId: pdfId,
                viewLevel: "pages",
                pages,
                activePageIndex: null,
                selectedTool: null,
            };
        });
    }, [pushAndSet]);

    const goBack = useCallback(() => {
        pushAndSet((prev) => {
            if (prev.viewLevel === "preview") {
                return { ...prev, viewLevel: "pages", activePageIndex: null };
            }
            if (prev.viewLevel === "pages") {
                return {
                    ...prev,
                    viewLevel: "parent",
                    activePdfId: null,
                    pages: [],
                    activePageIndex: null,
                    selectedTool: null,
                };
            }
            return prev;
        });
    }, [pushAndSet]);

    const openPagePreview = useCallback((pageIdx: number) => {
        pushAndSet((prev) => ({
            ...prev,
            viewLevel: "preview",
            activePageIndex: pageIdx,
        }));
    }, [pushAndSet]);

    // ── Page Operations (Level 2) ──
    const rotatePage = useCallback((pageId: string) => {
        pushAndSet((prev) => ({
            ...prev,
            pages: prev.pages.map((p) =>
                p.id === pageId ? { ...p, rotation: (p.rotation + 90) % 360 } : p
            ),
        }));
    }, [pushAndSet]);

    const deletePage = useCallback((pageId: string) => {
        pushAndSet((prev) => ({
            ...prev,
            pages: prev.pages.map((p) =>
                p.id === pageId ? { ...p, deleted: true } : p
            ),
        }));
    }, [pushAndSet]);

    const reorderPages = useCallback((newPages: PageItem[]) => {
        pushAndSet((prev) => ({ ...prev, pages: newPages }));
    }, [pushAndSet]);

    const rotateAllPages = useCallback(() => {
        pushAndSet((prev) => ({
            ...prev,
            pages: prev.pages.map((p) =>
                p.deleted ? p : { ...p, rotation: (p.rotation + 90) % 360 }
            ),
        }));
    }, [pushAndSet]);

    // ── Tool Selection ──
    const selectTool = useCallback((toolId: string | null) => {
        setStateRaw((prev) => ({ ...prev, selectedTool: toolId }));
    }, []);

    // ── Split Drafts ──
    const addSplitDrafts = useCallback((parentId: string, drafts: { file: File; name: string }[]) => {
        pushAndSet((prev) => {
            const newPdfs: WorkspacePdf[] = drafts.map((d, i) => ({
                id: `draft-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
                file: d.file,
                name: d.name,
                pageCount: 0,
                objectUrl: URL.createObjectURL(d.file),
                rotation: 0,
                isDraft: true,
                splitFromId: parentId,
            }));
            return { ...prev, pdfs: [...prev.pdfs, ...newPdfs] };
        });
    }, [pushAndSet]);

    const rotatePdf = useCallback((pdfId: string) => {
        pushAndSet((prev) => ({
            ...prev,
            pdfs: prev.pdfs.map((p) =>
                p.id === pdfId ? { ...p, rotation: (p.rotation + 90) % 360 } : p
            ),
        }));
    }, [pushAndSet]);

    return {
        state,
        // PDF management
        addPdfs,
        removePdf,
        reorderPdfs,
        renamePdf,
        updatePdfPageCount,
        rotatePdf,
        // Navigation
        openPdf,
        goBack,
        openPagePreview,
        // Page operations
        rotatePage,
        deletePage,
        reorderPages,
        rotateAllPages,
        // Tool
        selectTool,
        // Drafts
        addSplitDrafts,
        // History
        undo,
        redo,
    };
}
