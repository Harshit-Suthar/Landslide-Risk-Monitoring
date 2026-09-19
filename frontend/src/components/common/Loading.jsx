import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading({ message = 'Loading data, please wait...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-3" />
      <p className="text-slate-600 text-sm font-medium">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl p-6 max-w-xs w-full">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
