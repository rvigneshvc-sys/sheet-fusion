export interface SheetData {
  name: string;
  data: any[]; // Array of row objects
  header: string[];
}

export interface MergedData {
  headers: string[];
  rows: any[];
}

export type MergeMode = 'union' | 'strict';

export interface AnalysisResult {
  summary: string;
  suggestedCharts: string[];
}
