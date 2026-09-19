import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Users as UsersIcon } from 'lucide-react';
import UserTable from '../../components/admin/UserTable';
import UserModal from '../../components/admin/UserModal';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { landslideService } from '../../services/landslideService';
import { useToast } from '../../layouts/AdminLayout';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Modals state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await landslideService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err.message || 'Could not load users list.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtered list
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenCreateModal = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleOpenDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleSaveUser = async (formData) => {
    setIsSubmitting(true);
    try {
      if (selectedUser) {
        await landslideService.updateUser(selectedUser.id, formData);
        showToast(`Updated personnel ${formData.name}`, 'success');
      } else {
        await landslideService.createUser(formData);
        showToast(`Created new user ${formData.name}`, 'success');
      }
      setIsUserModalOpen(false);
      await fetchUsers();
    } catch (err) {
      console.error('Save user failed:', err);
      showToast(err.message || 'Failed to save user.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsSubmitting(true);
    try {
      await landslideService.deleteUser(userToDelete.id);
      showToast(`User ${userToDelete.name} deleted successfully.`, 'success');
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      await fetchUsers();
    } catch (err) {
      console.error('Delete user failed:', err);
      showToast(err.message || 'Failed to delete user.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await landslideService.toggleUserStatus(user.id, user.status);
      const nextStatus = user.status === 'Active' ? 'Inactive' : 'Active';
      showToast(`User ${user.name} is now ${nextStatus}.`, 'info');
      await fetchUsers();
    } catch (err) {
      console.error('Toggle status failed:', err);
      showToast('Failed to update status.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <UsersIcon className="w-7 h-7 text-amber-500" />
            Personnel & Users
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage administrative personnel, state district officers, and field monitoring agents
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add User</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Role:
          </span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-700"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="District Officer">District Officer</option>
            <option value="Field Agent">Field Agent</option>
          </select>
        </div>
      </div>

      {/* Content State */}
      {isLoading ? (
        <Loading message="Fetching authorized personnel..." />
      ) : error ? (
        <ErrorMessage
          title="Could not load users"
          message={error}
          onRetry={fetchUsers}
        />
      ) : (
        <UserTable
          users={filteredUsers}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Create / Edit User Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        user={selectedUser}
        onClose={() => setIsUserModalOpen(false)}
        onSave={handleSaveUser}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Personnel Account"
        message={`Are you sure you want to delete ${userToDelete?.name} (${userToDelete?.email})? This action cannot be undone.`}
        confirmText="Yes, Delete User"
        onConfirm={handleDeleteUser}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={isSubmitting}
      />
    </div>
  );
}
