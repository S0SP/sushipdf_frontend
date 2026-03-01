"use client";

import React, { useCallback, useRef } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    rectSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { ArrowDownAZ, Plus } from "lucide-react";
import { SortableFileCard, type FileItem } from "./SortableFileCard";

interface FileGridProps {
    files: FileItem[];
    onFilesChange: (files: FileItem[]) => void;
    onAddMore: (newFiles: File[]) => void;
}

export default function FileGrid({ files, onFilesChange, onAddMore }: FileGridProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor)
    );

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;
            if (over && active.id !== over.id) {
                const oldIndex = files.findIndex((f) => f.id === active.id);
                const newIndex = files.findIndex((f) => f.id === over.id);
                onFilesChange(arrayMove(files, oldIndex, newIndex));
            }
        },
        [files, onFilesChange]
    );

    const handleRotate = useCallback(
        (id: string) => {
            onFilesChange(
                files.map((f) =>
                    f.id === id ? { ...f, rotation: (f.rotation + 90) % 360 } : f
                )
            );
        },
        [files, onFilesChange]
    );

    const handleRemove = useCallback(
        (id: string) => {
            onFilesChange(files.filter((f) => f.id !== id));
        },
        [files, onFilesChange]
    );

    const handleSortAZ = useCallback(() => {
        const sorted = [...files].sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" })
        );
        onFilesChange(sorted);
    }, [files, onFilesChange]);

    const handleAddMore = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newFiles = Array.from(e.target.files || []);
            if (newFiles.length) onAddMore(newFiles);
            // Reset input
            if (inputRef.current) inputRef.current.value = "";
        },
        [onAddMore]
    );

    return (
        <div className="w-full">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".pdf"
                        multiple
                        onChange={handleAddMore}
                        className="hidden"
                    />
                    <button
                        onClick={() => inputRef.current?.click()}
                        className="flex items-center gap-1.5 text-sm font-medium text-sushi-red hover:text-sushi-red-dark border border-sushi-red rounded-lg px-3 py-1.5 transition-colors hover:bg-sushi-red-light"
                    >
                        <Plus className="w-4 h-4" />
                        Add more files
                    </button>
                </div>
                <button
                    onClick={handleSortAZ}
                    className="flex items-center gap-1.5 text-sm font-medium text-sushi-gray-600 hover:text-sushi-gray-800 border border-sushi-gray-300 rounded-lg px-3 py-1.5 transition-colors hover:bg-sushi-gray-50"
                    title="Sort alphabetically"
                >
                    <ArrowDownAZ className="w-4 h-4" />
                    Sort
                </button>
            </div>

            {/* Grid */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={files.map((f) => f.id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {files.map((file) => (
                            <SortableFileCard
                                key={file.id}
                                item={file}
                                onRotate={handleRotate}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
