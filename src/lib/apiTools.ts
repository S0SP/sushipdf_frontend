// Stirling PDF API Tool definitions for the dynamic right-side toolbar
// These map to the backend proxy which talks to http://localhost:8080

export type ToolCategory = "split" | "optimize" | "edit" | "security" | "extract" | "convert" | "annotate";

export interface ApiTool {
    id: string;
    name: string;
    description: string;
    category: ToolCategory;
    endpoint: string;
    method: "POST" | "GET";
    /** Which workspace level this tool is available at: "parent" | "pages" | "both" */
    availableAt: ("parent" | "pages")[];
    /** Parameters the user needs to configure before executing */
    params: ApiToolParam[];
    /** What the API accepts as input */
    inputType: "pdf" | "pdf+image" | "multi-pdf";
    /** What the API returns */
    outputType: "pdf" | "zip" | "json" | "images";
}

export interface ApiToolParam {
    name: string;
    label: string;
    type: "text" | "number" | "select" | "checkbox" | "range" | "file";
    required: boolean;
    defaultValue?: string | number | boolean;
    options?: { label: string; value: string }[];
    placeholder?: string;
    min?: number;
    max?: number;
    description?: string;
}

export const API_TOOLS: ApiTool[] = [
    // ═══════════════════════════════════════════
    //  SPLIT TOOLS
    // ═══════════════════════════════════════════
    {
        id: "split-pages",
        name: "Split by Pages",
        description: "Split PDF by specific page numbers or ranges",
        category: "split",
        endpoint: "/api/v1/general/split-pages",
        method: "POST",
        availableAt: ["pages"],
        inputType: "pdf",
        outputType: "zip",
        params: [
            {
                name: "pageNumbers",
                label: "Page Numbers / Ranges",
                type: "text",
                required: true,
                placeholder: "e.g. 1,3,5-10 or 'all'",
                description: "Comma-separated page numbers, ranges (e.g. 5-10), or 'all' for every page",
            },
        ],
    },
    {
        id: "split-by-size-or-count",
        name: "Split by Size / Count",
        description: "Split into equal-sized documents by page count or file size",
        category: "split",
        endpoint: "/api/v1/general/split-by-size-or-count",
        method: "POST",
        availableAt: ["pages"],
        inputType: "pdf",
        outputType: "zip",
        params: [
            {
                name: "splitType",
                label: "Split Mode",
                type: "select",
                required: true,
                defaultValue: "byCount",
                options: [
                    { label: "By Page Count", value: "byCount" },
                    { label: "By File Size (MB)", value: "bySize" },
                ],
            },
            {
                name: "splitValue",
                label: "Value",
                type: "number",
                required: true,
                defaultValue: 5,
                min: 1,
                placeholder: "Pages per doc or MB per doc",
            },
        ],
    },
    {
        id: "split-by-chapters",
        name: "Split by Chapters",
        description: "Split PDF using its bookmark/chapter structure",
        category: "split",
        endpoint: "/api/v1/general/split-pdf-by-chapters",
        method: "POST",
        availableAt: ["pages"],
        inputType: "pdf",
        outputType: "zip",
        params: [
            {
                name: "bookmarkLevel",
                label: "Bookmark Level",
                type: "number",
                required: false,
                defaultValue: 0,
                min: 0,
                max: 10,
                description: "0 = top-level bookmarks only",
            },
            {
                name: "includeMetadata",
                label: "Include Metadata",
                type: "checkbox",
                required: false,
                defaultValue: true,
            },
        ],
    },
    {
        id: "split-by-sections",
        name: "Split by Sections",
        description: "Split each page into halves, thirds, or quarters",
        category: "split",
        endpoint: "/api/v1/general/split-pdf-by-sections",
        method: "POST",
        availableAt: ["pages"],
        inputType: "pdf",
        outputType: "zip",
        params: [
            {
                name: "horizontalDivisions",
                label: "Horizontal Divisions",
                type: "number",
                required: true,
                defaultValue: 1,
                min: 1,
                max: 10,
            },
            {
                name: "verticalDivisions",
                label: "Vertical Divisions",
                type: "number",
                required: true,
                defaultValue: 2,
                min: 1,
                max: 10,
            },
        ],
    },

    // ═══════════════════════════════════════════
    //  OPTIMIZE TOOLS
    // ═══════════════════════════════════════════
    {
        id: "compress-pdf",
        name: "Compress PDF",
        description: "Reduce file size by optimizing images and content",
        category: "optimize",
        endpoint: "/api/v1/misc/compress-pdf",
        method: "POST",
        availableAt: ["parent", "pages"],
        inputType: "pdf",
        outputType: "pdf",
        params: [
            {
                name: "optimizeLevel",
                label: "Compression Level",
                type: "select",
                required: true,
                defaultValue: "3",
                options: [
                    { label: "Low (larger file)", value: "1" },
                    { label: "Medium", value: "2" },
                    { label: "Recommended", value: "3" },
                    { label: "High", value: "4" },
                    { label: "Extreme (smallest file)", value: "5" },
                ],
            },
        ],
    },
    {
        id: "ocr-pdf",
        name: "OCR (Text Recognition)",
        description: "Make scanned PDFs searchable using OCR",
        category: "optimize",
        endpoint: "/api/v1/misc/ocr-pdf",
        method: "POST",
        availableAt: ["parent", "pages"],
        inputType: "pdf",
        outputType: "pdf",
        params: [
            {
                name: "languages",
                label: "Languages",
                type: "text",
                required: true,
                defaultValue: "eng",
                placeholder: "e.g. eng, fra, deu",
            },
            {
                name: "ocrType",
                label: "OCR Type",
                type: "select",
                required: false,
                defaultValue: "skip-text",
                options: [
                    { label: "Skip pages with text", value: "skip-text" },
                    { label: "Force OCR on all pages", value: "force-ocr" },
                    { label: "Normal", value: "Normal" },
                ],
            },
        ],
    },
    {
        id: "flatten-pdf",
        name: "Flatten PDF",
        description: "Flatten form fields or convert pages to images",
        category: "optimize",
        endpoint: "/api/v1/misc/flatten",
        method: "POST",
        availableAt: ["parent", "pages"],
        inputType: "pdf",
        outputType: "pdf",
        params: [
            {
                name: "flattenOnlyForms",
                label: "Flatten Only Forms",
                type: "checkbox",
                required: false,
                defaultValue: false,
            },
        ],
    },
    {
        id: "repair-pdf",
        name: "Repair PDF",
        description: "Attempt to repair a damaged PDF",
        category: "optimize",
        endpoint: "/api/v1/misc/repair",
        method: "POST",
        availableAt: ["parent"],
        inputType: "pdf",
        outputType: "pdf",
        params: [],
    },
    {
        id: "remove-blanks",
        name: "Remove Blank Pages",
        description: "Detect and remove blank pages",
        category: "optimize",
        endpoint: "/api/v1/misc/remove-blanks",
        method: "POST",
        availableAt: ["pages"],
        inputType: "pdf",
        outputType: "pdf",
        params: [
            {
                name: "threshold",
                label: "Blank Threshold",
                type: "number",
                required: false,
                defaultValue: 10,
                min: 0,
                max: 100,
                description: "Lower = stricter blank detection",
            },
            {
                name: "whitePercent",
                label: "White Percentage",
                type: "number",
                required: false,
                defaultValue: 99.9,
                min: 0,
                max: 100,
            },
        ],
    },

    // ═══════════════════════════════════════════
    //  EDIT TOOLS
    // ═══════════════════════════════════════════
    {
        id: "rotate-pdf",
        name: "Rotate Pages",
        description: "Rotate PDF pages by 90, 180, or 270 degrees",
        category: "edit",
        endpoint: "/api/v1/general/rotate-pdf",
        method: "POST",
        availableAt: ["pages"],
        inputType: "pdf",
        outputType: "pdf",
        params: [
            {
                name: "angle",
                label: "Rotation Angle",
                type: "select",
                required: true,
                defaultValue: "90",
                options: [
                    { label: "90° Clockwise", value: "90" },
                    { label: "180°", value: "180" },
                    { label: "90° Counter-clockwise", value: "270" },
                ],
            },
        ],
    },
    {
        id: "remove-pages",
        name: "Remove Pages",
        description: "Delete specific pages from the PDF",
        category: "edit",
        endpoint: "/api/v1/general/remove-pages",
        method: "POST",
        availableAt: ["pages"],
        inputType: "pdf",
        outputType: "pdf",
        params: [
            {
                name: "pageNumbers",
                label: "Pages to Remove",
                type: "text",
                required: true,
                placeholder: "e.g. 1,3,5-10",
            },
        ],
    },
    {
        id: "rearrange-pages",
        name: "Rearrange Pages",
        description: "Reorder pages using custom page order",
        category: "edit",
        endpoint: "/api/v1/general/rearrange-pages",
        method: "POST",
        availableAt: ["pages"],
        inputType: "pdf",
        outputType: "pdf",
        params: [
            {
                name: "pageOrder",
                label: "New Page Order",
                type: "text",
                required: true,
                placeholder: "e.g. 3,1,2,5,4",
                description: "Comma-separated list of page numbers in new order",
            },
        ],
    },
    {
        id: "crop-pdf",
        name: "Crop Pages",
        description: "Crop pages by specifying coordinates",
        category: "edit",
        endpoint: "/api/v1/general/crop",
        method: "POST",
        availableAt: ["pages"],
        inputType: "pdf",
        outputType: "pdf",
        params: [
            { name: "x", label: "X Position", type: "number", required: true, defaultValue: 0, min: 0 },
            { name: "y", label: "Y Position", type: "number", required: true, defaultValue: 0, min: 0 },
            { name: "width", label: "Width", type: "number", required: true, defaultValue: 595, min: 1 },
            { name: "height", label: "Height", type: "number", required: true, defaultValue: 842, min: 1 },
        ],
    },
    {
        id: "scale-pages",
        name: "Scale Pages",
        description: "Resize pages to a specific paper size",
        category: "edit",
        endpoint: "/api/v1/general/scale-pages",
        method: "POST",
        availableAt: ["pages"],
        inputType: "pdf",
        outputType: "pdf",
        params: [
            {
                name: "pageSize",
                label: "Target Page Size",
                type: "select",
                required: true,
                defaultValue: "A4",
                options: [
                    { label: "A4", value: "A4" },
                    { label: "Letter", value: "LETTER" },
                    { label: "A3", value: "A3" },
                    { label: "Legal", value: "LEGAL" },
                ],
            },
            {
                name: "scaleFactor",
                label: "Scale Factor",
                type: "number",
                required: false,
                defaultValue: 1,
                min: 0.1,
                max: 10,
            },
        ],
    },
    {
        id: "add-page-numbers",
        name: "Add Page Numbers",
        description: "Add page numbers to every page",
        category: "edit",
        endpoint: "/api/v1/misc/add-page-numbers",
        method: "POST",
        availableAt: ["parent", "pages"],
        inputType: "pdf",
        outputType: "pdf",
        params: [
            {
                name: "pageNumberPosition",
                label: "Position",
                type: "select",
                required: false,
                defaultValue: "BOTTOM_CENTER",
                options: [
                    { label: "Bottom Center", value: "BOTTOM_CENTER" },
                    { label: "Bottom Left", value: "BOTTOM_LEFT" },
                    { label: "Bottom Right", value: "BOTTOM_RIGHT" },
                    { label: "Top Center", value: "TOP_CENTER" },
                    { label: "Top Left", value: "TOP_LEFT" },
                    { label: "Top Right", value: "TOP_RIGHT" },
                ],
            },
            {
                name: "startingNumber",
                label: "Starting Number",
                type: "number",
                required: false,
                defaultValue: 1,
                min: 1,
            },
        ],
    },
    {
        id: "add-watermark",
        name: "Add Watermark",
        description: "Add text or image watermark to pages",
        category: "edit",
        endpoint: "/api/v1/security/add-watermark",
        method: "POST",
        availableAt: ["parent", "pages"],
        inputType: "pdf",
        outputType: "pdf",
        params: [
            {
                name: "watermarkType",
                label: "Watermark Type",
                type: "select",
                required: true,
                defaultValue: "text",
                options: [
                    { label: "Text", value: "text" },
                    { label: "Image", value: "image" },
                ],
            },
            {
                name: "watermarkText",
                label: "Watermark Text",
                type: "text",
                required: false,
                placeholder: "e.g. CONFIDENTIAL",
            },
            {
                name: "rotation",
                label: "Rotation (degrees)",
                type: "number",
                required: false,
                defaultValue: 45,
                min: 0,
                max: 360,
            },
            {
                name: "opacity",
                label: "Opacity",
                type: "range",
                required: false,
                defaultValue: 0.3,
                min: 0,
                max: 1,
            },
        ],
    },
    {
        id: "add-stamp",
        name: "Add Stamp",
        description: "Add text or image stamps",
        category: "edit",
        endpoint: "/api/v1/misc/add-stamp",
        method: "POST",
        availableAt: ["pages"],
        inputType: "pdf",
        outputType: "pdf",
        params: [
            {
                name: "stampType",
                label: "Stamp Type",
                type: "select",
                required: true,
                defaultValue: "text",
                options: [
                    { label: "Text", value: "text" },
                    { label: "Image", value: "image" },
                ],
            },
            {
                name: "stampText",
                label: "Stamp Text",
                type: "text",
                required: false,
                placeholder: "e.g. APPROVED",
            },
        ],
    },
    {
        id: "add-image",
        name: "Overlay Image",
        description: "Place an image on top of a PDF page",
        category: "edit",
        endpoint: "/api/v1/misc/add-image",
        method: "POST",
        availableAt: ["pages"],
        inputType: "pdf+image",
        outputType: "pdf",
        params: [
            { name: "x", label: "X Position", type: "number", required: true, defaultValue: 0, min: 0 },
            { name: "y", label: "Y Position", type: "number", required: true, defaultValue: 0, min: 0 },
            {
                name: "everyPage",
                label: "Apply to All Pages",
                type: "checkbox",
                required: false,
                defaultValue: false,
            },
        ],
    },
    {
        id: "update-metadata",
        name: "Edit Metadata",
        description: "Update PDF title, author, and other metadata",
        category: "edit",
        endpoint: "/api/v1/misc/update-metadata",
        method: "POST",
        availableAt: ["parent"],
        inputType: "pdf",
        outputType: "pdf",
        params: [
            { name: "title", label: "Title", type: "text", required: false, placeholder: "Document Title" },
            { name: "author", label: "Author", type: "text", required: false, placeholder: "Author Name" },
            { name: "subject", label: "Subject", type: "text", required: false, placeholder: "Subject" },
            { name: "keywords", label: "Keywords", type: "text", required: false, placeholder: "keyword1, keyword2" },
        ],
    },

    // ═══════════════════════════════════════════
    //  SECURITY TOOLS
    // ═══════════════════════════════════════════
    {
        id: "add-password",
        name: "Add Password",
        description: "Protect PDF with a password",
        category: "security",
        endpoint: "/api/v1/security/add-password",
        method: "POST",
        availableAt: ["parent"],
        inputType: "pdf",
        outputType: "pdf",
        params: [
            { name: "password", label: "Password", type: "text", required: true, placeholder: "Enter password" },
        ],
    },
    {
        id: "remove-password",
        name: "Remove Password",
        description: "Remove password protection from PDF",
        category: "security",
        endpoint: "/api/v1/security/remove-password",
        method: "POST",
        availableAt: ["parent"],
        inputType: "pdf",
        outputType: "pdf",
        params: [
            { name: "password", label: "Current Password", type: "text", required: true, placeholder: "Enter current password" },
        ],
    },
    {
        id: "redact",
        name: "Redact Content",
        description: "Redact areas from PDF pages",
        category: "security",
        endpoint: "/api/v1/security/redact",
        method: "POST",
        availableAt: ["pages"],
        inputType: "pdf",
        outputType: "pdf",
        params: [
            {
                name: "listOfAreas",
                label: "Areas to Redact (JSON)",
                type: "text",
                required: true,
                placeholder: '[{"page":1,"x":0,"y":0,"width":100,"height":50}]',
            },
        ],
    },
    {
        id: "sanitize-pdf",
        name: "Sanitize PDF",
        description: "Remove scripts, embedded content, and other potentially unsafe elements",
        category: "security",
        endpoint: "/api/v1/security/sanitize-pdf",
        method: "POST",
        availableAt: ["parent"],
        inputType: "pdf",
        outputType: "pdf",
        params: [
            { name: "removeJavaScript", label: "Remove JavaScript", type: "checkbox", required: false, defaultValue: true },
            { name: "removeEmbeddedFiles", label: "Remove Embedded Files", type: "checkbox", required: false, defaultValue: true },
            { name: "removeMetadata", label: "Remove Metadata", type: "checkbox", required: false, defaultValue: false },
        ],
    },

    // ═══════════════════════════════════════════
    //  EXTRACT TOOLS
    // ═══════════════════════════════════════════
    {
        id: "extract-images",
        name: "Extract Images",
        description: "Extract all embedded images from PDF",
        category: "extract",
        endpoint: "/api/v1/misc/extract-images",
        method: "POST",
        availableAt: ["parent", "pages"],
        inputType: "pdf",
        outputType: "images",
        params: [
            {
                name: "format",
                label: "Output Format",
                type: "select",
                required: false,
                defaultValue: "png",
                options: [
                    { label: "PNG", value: "png" },
                    { label: "JPEG", value: "jpeg" },
                    { label: "GIF", value: "gif" },
                ],
            },
        ],
    },
    {
        id: "extract-attachments",
        name: "Extract Attachments",
        description: "Extract embedded file attachments from PDF",
        category: "extract",
        endpoint: "/api/v1/misc/extract-attachments",
        method: "POST",
        availableAt: ["parent"],
        inputType: "pdf",
        outputType: "zip",
        params: [],
    },

    // ═══════════════════════════════════════════
    //  ANNOTATION TOOLS
    // ═══════════════════════════════════════════
    {
        id: "annotate",
        name: "Annotate PDF",
        description: "Draw, highlight, and add notes to PDF pages",
        category: "annotate",
        endpoint: "/api/v1/misc/add-stamp",
        method: "POST",
        availableAt: ["pages"],
        inputType: "pdf",
        outputType: "pdf",
        params: [
            {
                name: "annotationType",
                label: "Annotation Type",
                type: "select",
                required: true,
                defaultValue: "highlight",
                options: [
                    { label: "Highlight", value: "highlight" },
                    { label: "Underline", value: "underline" },
                    { label: "Freehand Draw", value: "freehand" },
                    { label: "Text Note", value: "note" },
                ],
            },
            {
                name: "color",
                label: "Color",
                type: "select",
                required: false,
                defaultValue: "#FFFF00",
                options: [
                    { label: "Yellow", value: "#FFFF00" },
                    { label: "Red", value: "#FF0000" },
                    { label: "Green", value: "#00FF00" },
                    { label: "Blue", value: "#0000FF" },
                    { label: "Orange", value: "#FF8800" },
                ],
            },
            {
                name: "opacity",
                label: "Opacity",
                type: "range",
                required: false,
                defaultValue: 0.5,
                min: 0,
                max: 1,
            },
        ],
    },

    // ═══════════════════════════════════════════
    //  MERGE (parent-level only)
    // ═══════════════════════════════════════════
    {
        id: "merge-pdfs",
        name: "Merge PDFs",
        description: "Merge all uploaded PDFs into one file",
        category: "edit",
        endpoint: "/api/v1/general/merge-pdfs",
        method: "POST",
        availableAt: ["parent"],
        inputType: "multi-pdf",
        outputType: "pdf",
        params: [],
    },
];

/** Get tools available for a specific workspace level */
export function getToolsForLevel(level: "parent" | "pages"): ApiTool[] {
    return API_TOOLS.filter((t) => t.availableAt.includes(level));
}

/** Get tools grouped by category */
export function getToolsByCategory(level: "parent" | "pages"): Record<ToolCategory, ApiTool[]> {
    const tools = getToolsForLevel(level);
    const grouped: Record<string, ApiTool[]> = {};
    for (const t of tools) {
        if (!grouped[t.category]) grouped[t.category] = [];
        grouped[t.category].push(t);
    }
    return grouped as Record<ToolCategory, ApiTool[]>;
}

/** Category display labels */
export const CATEGORY_LABELS: Record<ToolCategory, string> = {
    split: "Split",
    optimize: "Optimize",
    edit: "Edit",
    security: "Security",
    extract: "Extract",
    convert: "Convert",
    annotate: "Annotate",
};
