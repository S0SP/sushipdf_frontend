export type ToolCategory =
  | "Organize PDF"
  | "Optimize PDF"
  | "Convert to PDF"
  | "Convert from PDF"
  | "Edit PDF"
  | "PDF Security"
  | "PDF Intelligence";

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  route: string;
  color: string;
  icon: string; // lucide icon name
  isNew?: boolean;
}

export const categories: ToolCategory[] = [
  "Organize PDF",
  "Optimize PDF",
  "Convert to PDF",
  "Convert from PDF",
  "Edit PDF",
  "PDF Security",
  "PDF Intelligence",
];

export const tools: Tool[] = [
  // Organize PDF
  {
    id: "merge-pdf",
    name: "Merge PDF",
    description: "Combine PDFs in the order you want with the easiest PDF merger available.",
    category: "Organize PDF",
    route: "/workspace?tool=merge-pdfs",
    color: "#E8423F",
    icon: "Merge",
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    description: "Separate one page or a whole set for easy conversion into independent PDF files.",
    category: "Organize PDF",
    route: "/workspace?tool=split-pages",
    color: "#FF6D3A",
    icon: "Scissors",
  },
  {
    id: "remove-pages",
    name: "Remove Pages",
    description: "Select and remove the pages you don't need. Get a new file without your deleted pages.",
    category: "Organize PDF",
    route: "/workspace?tool=remove-pages",
    color: "#E8423F",
    icon: "FileX",
  },
  {
    id: "extract-pages",
    name: "Extract Pages",
    description: "Select the pages of your PDF that you want to save into a new file.",
    category: "Organize PDF",
    route: "/workspace?tool=split-pages",
    color: "#FF6D3A",
    icon: "FileOutput",
  },
  {
    id: "organize-pdf",
    name: "Organize PDF",
    description: "Sort pages of your PDF file however you like. Delete or add PDF pages to your document at your convenience.",
    category: "Organize PDF",
    route: "/workspace?tool=rearrange-pages",
    color: "#E8423F",
    icon: "ArrowUpDown",
  },
  {
    id: "scan-to-pdf",
    name: "Scan to PDF",
    description: "Capture document scans from your mobile device and send them to your browser.",
    category: "Organize PDF",
    route: "/workspace",
    color: "#666666",
    icon: "ScanLine",
  },

  // Optimize PDF
  {
    id: "compress-pdf",
    name: "Compress PDF",
    description: "Reduce file size while optimizing for maximal PDF quality.",
    category: "Optimize PDF",
    route: "/workspace?tool=compress-pdf",
    color: "#E8423F",
    icon: "Minimize2",
  },
  {
    id: "repair-pdf",
    name: "Repair PDF",
    description: "Repair a damaged PDF and recover data from corrupt PDF. Fix PDF files with our Repair tool.",
    category: "Optimize PDF",
    route: "/workspace?tool=repair-pdf",
    color: "#4CAF50",
    icon: "Wrench",
  },
  {
    id: "ocr-pdf",
    name: "OCR PDF",
    description: "Easily convert your scanned PDF files into searchable and selectable documents.",
    category: "Optimize PDF",
    route: "/workspace?tool=ocr-pdf",
    color: "#1976D2",
    icon: "ScanSearch",
  },

  // Convert to PDF
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    description: "Convert JPG images to PDF in seconds. Easily adjust orientation and margins.",
    category: "Convert to PDF",
    route: "/workspace",
    color: "#FFB300",
    icon: "Image",
  },
  {
    id: "word-to-pdf",
    name: "WORD to PDF",
    description: "Make DOC and DOCX files easy to read by converting them to PDF.",
    category: "Convert to PDF",
    route: "/workspace",
    color: "#1976D2",
    icon: "FileText",
  },
  {
    id: "powerpoint-to-pdf",
    name: "POWERPOINT to PDF",
    description: "Make PPT and PPTX slideshows easy to view by converting them to PDF.",
    category: "Convert to PDF",
    route: "/workspace",
    color: "#E8423F",
    icon: "Presentation",
  },
  {
    id: "excel-to-pdf",
    name: "EXCEL to PDF",
    description: "Make EXCEL spreadsheets easy to read by converting them to PDF.",
    category: "Convert to PDF",
    route: "/workspace",
    color: "#4CAF50",
    icon: "Sheet",
  },
  {
    id: "html-to-pdf",
    name: "HTML to PDF",
    description: "Convert webpages in HTML to PDF. Copy and paste the URL of the page you want and convert it to PDF.",
    category: "Convert to PDF",
    route: "/workspace",
    color: "#FF6D3A",
    icon: "Globe",
  },

  // Convert from PDF
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    description: "Convert each PDF page into a JPG or extract all images contained in a PDF.",
    category: "Convert from PDF",
    route: "/workspace?tool=extract-images",
    color: "#FFB300",
    icon: "Image",
  },
  {
    id: "pdf-to-word",
    name: "PDF to WORD",
    description: "Easily convert your PDF files into easy to edit DOC and DOCX documents.",
    category: "Convert from PDF",
    route: "/workspace",
    color: "#1976D2",
    icon: "FileText",
  },
  {
    id: "pdf-to-powerpoint",
    name: "PDF to POWERPOINT",
    description: "Turn your PDF files into easy to edit PPT and PPTX slideshows.",
    category: "Convert from PDF",
    route: "/workspace",
    color: "#E8423F",
    icon: "Presentation",
  },
  {
    id: "pdf-to-excel",
    name: "PDF to EXCEL",
    description: "Pull data straight from PDFs into Excel spreadsheets in a few short seconds.",
    category: "Convert from PDF",
    route: "/workspace",
    color: "#4CAF50",
    icon: "Sheet",
  },
  {
    id: "pdf-to-pdfa",
    name: "PDF to PDF/A",
    description: "Transform your PDF to PDF/A, the ISO-standardized version of PDF for long-term archiving.",
    category: "Convert from PDF",
    route: "/workspace",
    color: "#9C27B0",
    icon: "Archive",
  },

  // Edit PDF
  {
    id: "rotate-pdf",
    name: "Rotate PDF",
    description: "Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!",
    category: "Edit PDF",
    route: "/workspace?tool=rotate-pdf",
    color: "#E8423F",
    icon: "RotateCw",
  },
  {
    id: "add-page-numbers",
    name: "Add Page Numbers",
    description: "Insert page numbers into PDFs with ease. Choose position, dimensions, and typography!",
    category: "Edit PDF",
    route: "/workspace?tool=add-page-numbers",
    color: "#666666",
    icon: "Hash",
  },
  {
    id: "add-watermark",
    name: "Add Watermark",
    description: "Stamp an image or text over your PDF in seconds. Choose the typography, transparency, and position.",
    category: "Edit PDF",
    route: "/workspace?tool=add-watermark",
    color: "#1976D2",
    icon: "Droplets",
  },
  {
    id: "crop-pdf",
    name: "Crop PDF",
    description: "Select the area of the PDF page that you want to crop. Resize PDF pages online.",
    category: "Edit PDF",
    route: "/workspace?tool=crop-pdf",
    color: "#4CAF50",
    icon: "Crop",
  },
  {
    id: "edit-pdf",
    name: "Edit PDF",
    description: "Add text, images, shapes or freehand annotations to a PDF document. Edit the size, font, and color.",
    category: "Edit PDF",
    route: "/workspace?tool=annotate",
    color: "#E8423F",
    icon: "PenLine",
  },

  // PDF Security
  {
    id: "unlock-pdf",
    name: "Unlock PDF",
    description: "Remove PDF password security, giving you the freedom to use your PDFs as you want.",
    category: "PDF Security",
    route: "/workspace?tool=remove-password",
    color: "#4CAF50",
    icon: "Unlock",
  },
  {
    id: "protect-pdf",
    name: "Protect PDF",
    description: "Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.",
    category: "PDF Security",
    route: "/workspace?tool=add-password",
    color: "#E8423F",
    icon: "Lock",
  },
  {
    id: "sign-pdf",
    name: "Sign PDF",
    description: "Sign a document and request signatures. Draw your signature or sign PDF files with a certificate-based digital ID.",
    category: "PDF Security",
    route: "/workspace",
    color: "#1976D2",
    icon: "PenTool",
  },
  {
    id: "redact-pdf",
    name: "Redact PDF",
    description: "Redact PDF to permanently remove visible text and images from PDF documents.",
    category: "PDF Security",
    route: "/workspace?tool=redact",
    color: "#333333",
    icon: "EyeOff",
  },
  {
    id: "compare-pdf",
    name: "Compare PDF",
    description: "Show a side by side comparison of two PDF documents and highlight the differences.",
    category: "PDF Security",
    route: "/workspace",
    color: "#9C27B0",
    icon: "GitCompare",
  },

  // PDF Intelligence
  {
    id: "translate-pdf",
    name: "Translate PDF",
    description: "Translate your PDF documents to any language in a matter of seconds.",
    category: "PDF Intelligence",
    route: "/workspace",
    color: "#1976D2",
    icon: "Languages",
    isNew: true,
  },
];

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((t) => t.category === category);
}

export function getToolById(id: string): Tool | undefined {
  return tools.find((t) => t.id === id);
}

export function getRelatedTools(currentId: string, count = 4): Tool[] {
  const current = getToolById(currentId);
  if (!current) return tools.slice(0, count);
  const sameCategory = tools.filter(
    (t) => t.category === current.category && t.id !== currentId
  );
  const others = tools.filter(
    (t) => t.category !== current.category && t.id !== currentId
  );
  return [...sameCategory, ...others].slice(0, count);
}
