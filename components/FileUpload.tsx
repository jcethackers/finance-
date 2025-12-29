import React, { useCallback, useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onUpload: (file: File | null) => void;
  onUseDemo: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload, onUseDemo }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "text/csv" || file.name.endsWith('.csv')) {
        onUpload(file);
      } else {
        setError("Please upload a valid CSV file.");
      }
    }
  }, [onUpload]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-display font-bold text-white mb-3">Add Financial Data</h2>
        <p className="text-slate-400">Upload your bank statement or use our demo dataset to see the AI in action instantly.</p>
      </div>

      <div 
        className={`relative group border-2 border-dashed rounded-3xl p-10 transition-all duration-300 ease-in-out
          ${isDragging 
            ? 'border-fintech-accent bg-fintech-accent/5 scale-[1.02]' 
            : 'border-slate-700 bg-fintech-800/30 hover:border-slate-600 hover:bg-fintech-800/50'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept=".csv"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        <div className="flex flex-col items-center justify-center text-center pointer-events-none">
          <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? 'bg-fintech-accent/20 text-fintech-accent' : 'bg-slate-800 text-slate-400 group-hover:text-white'}`}>
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">
            Drag & Drop CSV file
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            or click to browse from your computer
          </p>
          
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
            <CheckCircle className="w-3 h-3 text-fintech-accent" />
            <span>Bank-standard CSV support</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center">
        <div className="h-px bg-slate-800 w-full" />
        <span className="px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">OR</span>
        <div className="h-px bg-slate-800 w-full" />
      </div>

      <button 
        onClick={onUseDemo}
        className="mt-8 w-full group flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all"
      >
        <FileText className="w-5 h-5 text-fintech-accent" />
        <div className="text-left">
          <div className="text-sm font-semibold text-white">Use Demo Dataset</div>
          <div className="text-xs text-slate-400">Pre-loaded with diverse transaction history</div>
        </div>
      </button>
    </div>
  );
};