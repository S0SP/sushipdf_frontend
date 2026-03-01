"use client";

import React from "react";
import {
    DndContext, closestCenter, KeyboardSensor, PointerSensor,
    useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext, rectSortingStrategy, useSortable,
    arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RotateCw, X } from "lucide-react";
import type { PageItem } from "@/hooks/useWorkspaceState";
import dynamic from "next/dynamic";

const PdfThumbnail = dynamic(
    () => import("@/components/PdfPageRenderer").then((mod) => mod.PdfThumbnail),
    { ssr: false, loading: () => <div className="w-full h-full bg-gray-50 flex items-center justify-center animate-pulse" /> }
);

interface PageThumbnailGridProps {
    pages: PageItem[];
    pdfUrl: string;
    onReorder: (pages: PageItem[]) => void;
    onRotate: (pageId: string) => void;
    onDelete: (pageId: string) => void;
    onPageClick: (index: number) => void;
    onRotateAll: () => void;
}

function SortablePageCard({
    page,
    pdfUrl,
    onRotate,
    onDelete,
    onClick,
}: {
    page: PageItem;
    pdfUrl: string;
    onRotate: () => void;
    onDelete: () => void;
    onClick: () => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: page.id,
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : page.deleted ? 0.3 : 1,
    };

    if (page.deleted) return null;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="relative group bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-lg hover:border-sushi-red/30 transition-all cursor-grab active:cursor-grabbing"
        >
            {/* Action Buttons: Rotate & Delete */}
            <div className="absolute -top-2.5 -right-2.5 z-10 flex flex-col md:flex-row items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                {/* Rotate */}
                <button
                    onClick={(e) => { e.stopPropagation(); onRotate(); }}
                    className="w-7 h-7 bg-white hover:bg-sushi-red hover:text-white text-gray-600 rounded-full flex items-center justify-center shadow-md border border-gray-200 transition-colors"
                    title="Rotate Page"
                >
                    <RotateCw size={13} />
                </button>
                {/* Delete X */}
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                    title="Delete Page"
                >
                    <X size={14} />
                </button>
            </div>

            {/* Page Preview Area — real PDF rendering */}
            <div
                onClick={onClick}
                className="w-full aspect-[3/4] bg-gray-50 rounded-t-xl flex items-center justify-center overflow-hidden cursor-pointer"
            >
                <PdfThumbnail
                    fileUrl={pdfUrl}
                    pageNumber={page.pageNumber}
                    width={160}
                    rotation={page.rotation}
                    className="w-full h-full flex items-center justify-center"
                />
            </div>

            {/* Footer */}
            <div className="px-3 py-2.5 text-center border-t border-gray-100">
                <span className="text-sm font-bold text-gray-700">Page {page.pageNumber}</span>
                {page.rotation > 0 && (
                    <span className="text-xs text-sushi-red font-semibold ml-1.5">({page.rotation}°)</span>
                )}
            </div>
        </div>
    );
}

export default function PageThumbnailGrid({
    pages,
    pdfUrl,
    onReorder,
    onRotate,
    onDelete,
    onPageClick,
    onRotateAll,
}: PageThumbnailGridProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor)
    );

    const visiblePages = pages.filter((p) => !p.deleted);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIdx = pages.findIndex((p) => p.id === active.id);
        const newIdx = pages.findIndex((p) => p.id === over.id);
        if (oldIdx !== -1 && newIdx !== -1) {
            onReorder(arrayMove(pages, oldIdx, newIdx));
        }
    };

    return (
        <div>
            {/* Toolbar row */}
            <div className="flex items-center gap-4 mb-5 flex-wrap">
                <button
                    onClick={onRotateAll}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-colors text-gray-700"
                >
                    <RotateCw size={15} />
                    Rotate All
                </button>
                <span className="text-sm font-semibold text-gray-500">
                    {visiblePages.length} page{visiblePages.length !== 1 && "s"} • Long-press & drag to reorder
                </span>
            </div>

            {/* Grid */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={visiblePages.map((p) => p.id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                        {visiblePages.map((page, idx) => (
                            <SortablePageCard
                                key={page.id}
                                page={page}
                                pdfUrl={pdfUrl}
                                onRotate={() => onRotate(page.id)}
                                onDelete={() => onDelete(page.id)}
                                onClick={() => onPageClick(idx)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
