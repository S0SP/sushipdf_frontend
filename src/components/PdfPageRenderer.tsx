"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// ══════════════════════════════════
//  PDF Thumbnail — fixed-size render
//  Used in Level 1 (cover) & Level 2 (page thumbnails)
// ══════════════════════════════════
export interface PdfThumbnailProps {
    fileUrl: string;
    pageNumber: number;
    width?: number;
    rotation?: number;
    onPageCountLoaded?: (count: number) => void;
    className?: string;
}

export function PdfThumbnail({
    fileUrl,
    pageNumber,
    width = 160,
    rotation = 0,
    onPageCountLoaded,
    className,
}: PdfThumbnailProps) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [error, setError] = useState(false);

    const handleDocumentLoad = useCallback(
        ({ numPages: n }: { numPages: number }) => {
            setNumPages(n);
            onPageCountLoaded?.(n);
        },
        [onPageCountLoaded]
    );

    if (error) {
        return (
            <div className={`flex items-center justify-center bg-gray-100 text-gray-400 text-xs font-bold ${className}`}>
                PDF Preview Unavailable
            </div>
        );
    }

    return (
        <div className={`overflow-hidden ${className}`}>
            <Document
                file={fileUrl}
                onLoadSuccess={handleDocumentLoad}
                onLoadError={() => setError(true)}
                loading={
                    <div className="flex items-center justify-center w-full h-full bg-gray-50">
                        <div className="w-6 h-6 border-2 border-gray-300 border-t-sushi-red rounded-full animate-spin" />
                    </div>
                }
            >
                {numPages && pageNumber <= numPages && (
                    <Page
                        pageNumber={pageNumber}
                        width={width}
                        rotate={rotation}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                    />
                )}
            </Document>
        </div>
    );
}

// ══════════════════════════════════
//  PDF Full Preview — adaptive size
//  Used in Level 3 (page preview)
//  Scales to fit container while
//  respecting the page's intrinsic
//  orientation (portrait/landscape)
// ══════════════════════════════════
export interface PdfFullPreviewProps {
    fileUrl: string;
    pageNumber: number;
    rotation?: number;
    containerRef?: React.RefObject<HTMLDivElement | null>;
}

export function PdfFullPreview({
    fileUrl,
    pageNumber,
    rotation = 0,
    containerRef,
}: PdfFullPreviewProps) {
    const [error, setError] = useState(false);
    const [dims, setDims] = useState<{ width: number; height: number } | null>(null);
    const [pageAspectRatio, setPageAspectRatio] = useState<number | null>(null);
    const internalRef = useRef<HTMLDivElement | null>(null);
    const ref = containerRef ?? internalRef;

    // Measure container
    useEffect(() => {
        const measure = () => {
            if (ref.current) {
                setDims({
                    width: ref.current.clientWidth,
                    height: ref.current.clientHeight,
                });
            }
        };
        measure();
        const ro = new ResizeObserver(measure);
        if (ref.current) ro.observe(ref.current);
        return () => ro.disconnect();
    }, [ref]);

    if (error) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400 font-bold">
                PDF Preview Unavailable
            </div>
        );
    }

    // Determine sizes to fit inside container
    const padding = 32;
    let renderWidth: number | undefined = undefined;
    let renderHeight: number | undefined = undefined;

    if (dims && pageAspectRatio) {
        const availableW = dims.width - padding;
        const availableH = dims.height - padding;
        const containerRatio = availableW / availableH;

        if (pageAspectRatio > containerRatio) {
            renderWidth = availableW;
        } else {
            renderHeight = availableH;
        }
    } else if (dims) {
        // Fallback before page loads
        renderWidth = dims.width - padding;
    }

    return (
        <div ref={ref} className="flex items-center justify-center w-full h-full overflow-hidden">
            <Document
                file={fileUrl}
                onLoadError={() => setError(true)}
                loading={
                    <div className="flex items-center justify-center w-full h-full">
                        <div className="w-8 h-8 border-3 border-gray-300 border-t-sushi-red rounded-full animate-spin" />
                    </div>
                }
            >
                <Page
                    pageNumber={pageNumber}
                    width={renderWidth}
                    height={renderHeight}
                    rotate={rotation}
                    onLoadSuccess={({ originalWidth, originalHeight }) => {
                        const isRotated = rotation === 90 || rotation === 270;
                        const w = isRotated ? originalHeight : originalWidth;
                        const h = isRotated ? originalWidth : originalHeight;
                        setPageAspectRatio(w / h);
                    }}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="shadow-lg rounded-lg overflow-hidden flex items-center justify-center bg-white"
                />
            </Document>
        </div>
    );
}
