import React from 'react';
import { MergedData } from '../types';

interface DataPreviewProps {
  data: MergedData;
}

export const DataPreview: React.FC<DataPreviewProps> = ({ data }) => {
  const PREVIEW_LIMIT = 10;
  const displayRows = data.rows.slice(0, PREVIEW_LIMIT);

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div>
           <h3 className="font-semibold text-gray-800">Preview Merged Data</h3>
           <p className="text-xs text-gray-500">Showing first {Math.min(PREVIEW_LIMIT, data.rows.length)} of {data.rows.length} rows</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {data.headers.map((header, idx) => (
                <th 
                  key={idx}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayRows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50">
                {data.headers.map((header, colIdx) => (
                  <td 
                    key={colIdx} 
                    className="px-6 py-4 whitespace-nowrap text-gray-700 max-w-xs overflow-hidden text-ellipsis"
                  >
                    {row[header] !== undefined && row[header] !== null ? String(row[header]) : <span className="text-gray-300 italic">null</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.rows.length > PREVIEW_LIMIT && (
        <div className="px-6 py-3 bg-gray-50 text-center text-xs text-gray-500 border-t border-gray-100">
          ... and {data.rows.length - PREVIEW_LIMIT} more rows
        </div>
      )}
    </div>
  );
};
