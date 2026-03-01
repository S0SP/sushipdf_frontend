"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RotateCw, X, GripVertical, FileText } from "lucide-react";

export interface FileItem {
    id: string;
    file: File;
    name: string;
    pages?: number;
    rotation: number;
    thumbnail?: string;
}

interface SortableFileCardProps {
    item: FileItem;
    onRotate: (id: string) => void;
    onRemove: (id: string) => void;
}

export function SortableFileCard({ item, onRotate, onRemove }: SortableFileCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="relative bg-white border border-sushi-gray-200 rounded-lg overflow-hidden group hover:shadow-md transition-shadow"
        >
            {/* Drag handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute top-2 left-2 z-10 cursor-grab active:cursor-grabbing p-1 rounded bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <GripVertical className="w-4 h-4 text-sushi-gray-500" />
            </div>

            {/* Remove button */}
            <button
                onClick={() => onRemove(item.id)}
                className="absolute top-2 right-2 z-10 w-6 h-6 bg-sushi-red text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-sushi-red-dark"
            >
                <X className="w-3.5 h-3.5" />
            </button>

            {/* Rotate button */}
            <button
                onClick={() => onRotate(item.id)}
                className="absolute bottom-2 right-2 z-10 w-6 h-6 bg-white border border-sushi-gray-300 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-sushi-gray-100"
            >
                <RotateCw className="w-3 h-3 text-sushi-gray-700" />
            </button>

            {/* Thumbnail area */}
            <div
                className="w-full aspect-[3/4] bg-sushi-gray-50 flex items-center justify-center"
                style={{ transform: `rotate(${item.rotation}deg)` }}
            >
                {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.name} className="w-full h-full object-contain" />
                ) : (
                    <FileText className="w-12 h-12 text-sushi-gray-300" />
                )}
            </div>

            {/* File info */}
            <div className="p-2 border-t border-sushi-gray-200">
                <p className="text-xs text-sushi-gray-800 truncate font-medium" title={item.name}>
                    {item.name}
                </p>
                {item.pages && (
                    <p className="text-[10px] text-sushi-gray-500">{item.pages} pages</p>
                )}
            </div>
        </div>
    );
}
