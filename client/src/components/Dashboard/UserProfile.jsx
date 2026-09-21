import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteUser, updateUser } from "../../redux/slice/auth/authThunk";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");

  const handleUpdate = () => {
    dispatch(updateUser({ userId: user?._id || user?.id, username: newUsername }));
    setEditModalOpen(false);
  };

  const handleDelete = () => {
    dispatch(deleteUser(user?._id || user?.id));
    setDeleteModalOpen(false);
  };

  return (
    <div className="glass-panel p-6 sm:p-10 shadow-xl rounded-2xl relative overflow-hidden text-[var(--text-color)] max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Account Profile
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Manage your personal credentials and account settings
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 mb-8">
        <img
          src={user?.profilePic || "https://avatar.iran.liara.run/public/1"}
          alt="Profile"
          className="w-24 h-24 rounded-2xl object-cover border border-black/10 dark:border-white/10 shadow-sm"
        />
        <div className="flex-1 text-center sm:text-left space-y-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {user?.fullname || "User"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">@{user?.username}</p>
          <p className="text-sm font-medium text-[var(--text-color)]">{user?.email}</p>
          <div className="pt-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 text-gray-400 border border-black/5 dark:border-white/10 font-mono">
              ID: {user?._id || user?.id}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setEditModalOpen(true)}
          className="btn-primary flex-1 py-3 text-sm font-semibold shadow-sm"
        >
          Edit Username
        </button>
        <button
          onClick={() => setDeleteModalOpen(true)}
          className="flex-1 py-3 px-4 text-sm font-semibold rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all text-center"
        >
          Delete Account
        </button>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-[var(--border-color)] animate-fade-in space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Update Username</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enter your new preferred username
            </p>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-[var(--surface-color)] border border-[var(--border-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="Enter new username"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-gray-500 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="btn-primary text-xs px-5 py-2"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-[var(--border-color)] animate-fade-in space-y-4">
            <h3 className="text-lg font-bold text-red-600 dark:text-red-400">Confirm Account Deletion</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-gray-500 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
