"use client";

import { Upload, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRef } from "react";

interface FileUploadSelectorProps {
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
}

export function FileUploadSelector({
  selectedFile,
  onFileSelect,
  onClear,
}: FileUploadSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".docx")) {
        alert("Будь ласка, оберіть файл .docx");
        return;
      }
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx"
        onChange={handleFileChange}
        className="hidden"
      />

      {!selectedFile ? (
        <Button
          variant="outline"
          className="w-full h-24 border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition-colors"
          onClick={handleClick}
        >
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-6 w-6 text-slate-500" />
            <span className="text-sm font-medium text-slate-600">
              Завантажити файл .docx
            </span>
            <span className="text-xs text-slate-500">Натисніть для огляду</span>
          </div>
        </Button>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 flex-shrink-0"
                onClick={onClear}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
