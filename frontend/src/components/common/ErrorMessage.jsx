import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-red-800 my-4 flex items-start space-x-3">
      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <h4 className="font-semibold text-sm text-red-900">{title}</h4>
        {message && <p className="text-sm text-red-700 mt-1">{message}</p>}
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 inline-flex items-center space-x-1.5 text-xs font-semibold bg-red-100 hover:bg-red-200 text-red-900 px-3 py-1.5 rounded-lg transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
}
