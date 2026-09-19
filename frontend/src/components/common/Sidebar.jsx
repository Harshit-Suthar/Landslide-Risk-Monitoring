import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ items = [], title = 'Navigation' }) {
  const location = useLocation();

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 min-h-screen p-4 flex flex-col border-r border-slate-800">
      {title && (
        <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold px-3 py-2">
          {title}
        </div>
      )}
      <nav className="mt-2 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
