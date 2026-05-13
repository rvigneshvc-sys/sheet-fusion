import { ChartColumn, FileSpreadsheet, Layers, Sparkles } from "lucide-react";

export const APP_NAME = "SheetFusion";
export const APP_VERSION = "1.0.0";

export const FEATURES = [
  {
    icon: FileSpreadsheet,
    title: "Excel Support",
    description: "Upload .xlsx or .xls files containing multiple sheets."
  },
  {
    icon: Layers,
    title: "Smart Merge",
    description: "Automatically aligns columns across different sheets."
  },
  {
    icon: Sparkles,
    title: "AI Analysis",
    description: "Get instant insights on your merged dataset using Gemini."
  }
];
