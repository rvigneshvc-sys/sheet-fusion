import React, { useRef, useState } from 'react';
import { UploadCloud, FileSpreadsheet } from 'lucide-react';
import { Button } from './Button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndPass(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndPass(e.target.files[0]);
    }
  };

  const validateAndPass = (file: File) => {
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      onFileSelect(file);
    } else {
      alert("Please upload a valid Excel file (.xlsx or .xls)");
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div 
      className={`relative p-10 w-full max-w-2xl mx-auto border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out text-center ${
        dragActive 
          ? "border-blue-500 bg-blue-50 scale-[1.02]" 
          : "border-gray-300 bg-white hover:border-gray-400"
      }`}
      onDragEnter={handleDrag} 
      onDragLeave={handleDrag} 
      onDragOver={handleDrag} 
      onDrop={handleDrop}
    >
      <input 
        ref={inputRef}
        type="file" 
        className="hidden" 
        multiple={false} 
        accept=".xlsx,.xls"
        onChange={handleChange} 
      />
      
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`p-4 rounded-full ${dragActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
          <UploadCloud className={`w-10 h-10 ${dragActive ? 'text-blue-600' : 'text-gray-500'}`} />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Upload your Excel file</h3>
          <p className="text-sm text-gray-500 mt-1">Drag & drop or browse to upload</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            .xlsx
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            .xls
          </span>
        </div>
        <Button onClick={onButtonClick} variant="outline" className="mt-4">
          Select File
        </Button>
      </div>
    </div>
  );
};
