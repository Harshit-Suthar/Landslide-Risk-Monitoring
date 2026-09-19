import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDanger = true,
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start space-x-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              isDanger ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="flex-1 mt-1">
            <h3 className="text-lg font-bold text-slate-900 leading-6">
              {title}
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition border border-slate-200"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition shadow-sm ${
              isDanger
                ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
            } disabled:opacity-50`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
