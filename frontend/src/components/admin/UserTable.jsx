import React from 'react';
import { Edit2, Trash2, Shield, MapPin, CheckCircle2, XCircle } from 'lucide-react';

export default function UserTable({
  users = [],
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading = false,
}) {
  const getRoleBadge = (role) => {
    switch (role) {
      case 'Admin':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
            <Shield className="w-3 h-3" />
            Admin
          </span>
        );
      case 'District Officer':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            District Officer
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
            Field Agent
          </span>
        );
    }
  };

  if (!isLoading && users.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
        <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h4 className="text-base font-bold text-slate-800">No personnel found</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Try adjusting your search query or role filter, or add a new personnel member.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-4">Name & Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Assigned District</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </td>
                <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                <td className="px-6 py-4">
                  <div className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>{user.district}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onToggleStatus(user)}
                    className={`inline-flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border transition cursor-pointer ${
                      user.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                    }`}
                    title="Click to toggle status"
                  >
                    {user.status === 'Active' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span>Inactive</span>
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                      title="Edit User"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
