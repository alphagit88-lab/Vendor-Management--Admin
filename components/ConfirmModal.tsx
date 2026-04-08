"use client";
import { AlertCircle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
              <p className="text-sm text-slate-500 mt-1">{message}</p>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 translate-y-0.5">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isLoading}
            className="px-5 py-2 text-sm font-semibold text-slate-600 rounded-xl hover:bg-gray-100 transition disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button 
            type="button" 
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 shadow-sm transition disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
