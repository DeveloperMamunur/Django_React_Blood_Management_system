import React from "react";
import Modal from "./Modal";
import Button from "../ui/Button";

export default function UserDetailsModal({ user, isOpen, onClose }) {
  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Details"
      modalSize="4xl"
    >
      <div className="space-y-6">
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                <th className="p-3 border-b border-gray-300 dark:border-gray-700 text-left font-semibold w-1/3">
                  Field
                </th>
                <th className="p-3 border-b border-gray-300 dark:border-gray-700 text-left font-semibold">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-3 text-gray-700 dark:text-gray-300">User Name</td>
                <td className="p-3 text-gray-900 dark:text-gray-100">{user.username}</td>
              </tr>

              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-3 text-gray-700 dark:text-gray-300">Role</td>
                <td className="p-3 text-gray-900 dark:text-gray-100">{user.role}</td>
              </tr>

              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-3 text-gray-700 dark:text-gray-300">Bio</td>
                <td className="p-3 text-gray-900 dark:text-gray-100">
                  {user.bio || <span className="italic text-gray-400">No bio provided</span>}
                </td>
              </tr>

              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-3 text-gray-700 dark:text-gray-300">Email</td>
                <td className="p-3 text-gray-900 dark:text-gray-100">{user.email}</td>
              </tr>

              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 align-top">
                <td className="p-3 text-gray-700 dark:text-gray-300">Photo</td>
                <td className="p-3">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm"
                    />
                  ) : (
                    <span className="italic text-gray-400">No photo</span>
                  )}
                </td>
              </tr>

              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-3 text-gray-700 dark:text-gray-300">Status</td>
                <td className="p-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full 
                    ${
                      user.is_active
                        ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                        : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                    }`}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Close button */}
        <div className="flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
