import React from 'react';
import { SheetData } from '../types';
import { Check, Square, CheckSquare } from 'lucide-react';

interface SheetSelectorProps {
  sheets: SheetData[];
  selectedIndices: number[];
  onChange: (indices: number[]) => void;
}

export const SheetSelector: React.FC<SheetSelectorProps> = ({ sheets, selectedIndices, onChange }) => {
  const toggleSheet = (index: number) => {
    if (selectedIndices.includes(index)) {
      onChange(selectedIndices.filter(i => i !== index));
    } else {
      onChange([...selectedIndices, index]);
    }
  };

  const toggleAll = () => {
    if (selectedIndices.length === sheets.length) {
      onChange([]);
    } else {
      onChange(sheets.map((_, i) => i));
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h3 className="font-semibold text-gray-800">Select Sheets to Merge</h3>
        <button 
          onClick={toggleAll}
          className="text-sm text-blue-600 font-medium hover:text-blue-700 focus:outline-none"
        >
          {selectedIndices.length === sheets.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>
      
      <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100">
        {sheets.map((sheet, idx) => {
          const isSelected = selectedIndices.includes(idx);
          return (
            <div 
              key={idx}
              onClick={() => toggleSheet(idx)}
              className={`px-6 py-3 flex items-center justify-between cursor-pointer transition-colors ${
                isSelected ? 'bg-blue-50/50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`flex-shrink-0 ${isSelected ? 'text-blue-600' : 'text-gray-300'}`}>
                  {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                </div>
                <div>
                  <p className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                    {sheet.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {sheet.data.length} rows • {sheet.header.length} columns
                  </p>
                </div>
              </div>
              {isSelected && (
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  Included
                </span>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500 border-t border-gray-100 text-center">
        {selectedIndices.length} sheets selected for merging
      </div>
    </div>
  );
};
