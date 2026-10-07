import React, { useState, useRef } from "react";
import { FiUpload } from "react-icons/fi";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle click upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      console.log("Selected via click:", selectedFile);
    }
  };

  // Prevent default browser behavior (opening file in browser) on drag over
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // Handle dropped files
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const droppedFile = event.dataTransfer.files[0];
      setFile(droppedFile);
      console.log("Dropped file:", droppedFile);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hidden real file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
        className="hidden"
      />

      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="w-72 h-56 outline-2 flex-col gap-2 outline-offset-2 outline-dashed flex items-center justify-center mx-auto mt-10 cursor-pointer"
      >
        <p>Drag and Drop File here, or click to upload</p>
        <FiUpload className="w-16 h-16" />
        {file && <p className="text-sm text-green-600 mt-2">{file.name}</p>}
      </div>
    </div>
  );
}