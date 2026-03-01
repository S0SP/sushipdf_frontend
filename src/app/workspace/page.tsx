"use client";

import { Suspense } from "react";
import PdfWorkspace from "@/components/PdfWorkspace";

export default function WorkspacePage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] text-gray-400 font-bold text-lg">Loading workspace…</div>}>
            <PdfWorkspace />
        </Suspense>
    );
}
