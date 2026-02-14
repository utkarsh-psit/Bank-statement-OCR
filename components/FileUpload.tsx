
import React, { useRef, useState } from 'react';
import { Upload, File, X, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <label
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative group flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer
            ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50'}
            ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="p-4 bg-indigo-100 rounded-full group-hover:scale-110 transition-transform duration-200 mb-4">
              <Upload className="w-8 h-8 text-indigo-600" />
            </div>
            <p className="mb-2 text-sm text-slate-700">
              <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-500">PDF, PNG, or JPG (MAX. 10MB)</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".pdf,image/png,image/jpeg"
            onChange={handleChange}
            disabled={isLoading}
          />
        </label>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <File className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 truncate max-w-[200px] md:max-w-sm">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          {!isLoading && (
            <button
              onClick={removeFile}
              className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
      
      {isLoading && (
        <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center space-x-3">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent"></div>
          <p className="text-sm text-indigo-700 font-medium">Processing statement... Analyzing columns and transactions.</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
