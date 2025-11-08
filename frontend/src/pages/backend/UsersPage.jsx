import { useEffect, useState } from "react";
import ReusableTable from "../../components/common/ReusableTable";
import { userService } from "../../services/userService";
import { Eye, Pencil, Trash2, Plus, ToggleLeft, ToggleRight } from "lucide-react";
import UserDetailsModal from "../../components/modals/UserModal";
import { Button } from "../../components/ui";
import CreateUserModal from "../../components/modals/CreateUserModal";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openCreateUserModal, setOpenCreateUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getAllUsers();
      setUsers(res.results || res || []);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserStatus = async (user) => {
    try {
      await userService.toggleStatus(user.id, { is_active_account: !user.is_active_account });
      fetchUsers();
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  const openUserDetails = (user) => {
    setSelectedUser(user);
    setOpenUserModal(true);
  };


  const handleUserCreated = async (userData, userId) => {
    try {
      if (userId) {
        await userService.updateUser(userId, userData);
      } else {
        await userService.createUser(userData);
      }
      fetchUsers();
    } catch (error) {
      console.error(`Error ${userId ? 'updating' : 'creating'} user:`, error);
    }
  };

  const handleUserEdit = (user) => {
    setSelectedUser(user);
    setOpenCreateUserModal(true);
  };

  const closeUserDetailsModal = () => {
    setSelectedUser(null);
    setOpenUserModal(false);
  };

  const columns = [
    { key: "username", title: "Username", sortable: true },
    { key: "email", title: "Email", sortable: true },
    { key: "role", title: "Role", sortable: true },
    { key: "first_name", title: "First Name" },
    { key: "last_name", title: "Last Name" },
    { key: "is_active_account", title: "Status", sortable: true, type: "boolean"},
  ];

  const actions = [
    {
      label: "View",
      icon: <Eye size={14} />,
      className:
        "text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-800",
      onClick: (row) => openUserDetails(row),
    },
    {
      label: "Edit",
      icon: <Pencil size={14} />,
      className:
        "text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-gray-800",
      onClick: (row) => handleUserEdit(row)
    },
    {
      label: "Delete",
      icon: <Trash2 size={14} />,
      className:
        "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800",
      onClick: (row) => console.log("Delete user:", row),
    },
    {
      label: "Toggle Status",
      icon: (row) => {
        return row.is_active_account ? (
          <ToggleRight
            size={16}
            className="text-green-600 dark:text-green-400 transition-all duration-300"
          />
        ) : (
          <ToggleLeft
            size={16}
            className="text-red-400 dark:text-red-300 transition-all duration-300"
          />
        );
      },
      className: (row) => {
        return row.is_active_account
          ? "text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800 rounded-md cursor-pointer p-1"
          : "text-red-400 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800 rounded-md cursor-pointer p-1";
      },
      onClick: (row) => toggleUserStatus(row),
    },
  ];


  return (
    <div className="p-6">
      {/* Page Title */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        button  User Management
        </h1>
        <Button
          variant="primary"
          size="md"
          onClick={() => setOpenCreateUserModal(true)}
        >
          <Plus className="mr-2" />
          Add User
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading users...</p>
        ) : (
          <ReusableTable
            columns={columns}
            data={users}
            actions={actions}
            onRowClick={openUserDetails}
            compact
          />
        )}
      </div>

      {/* Modal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={openUserModal}
        onClose={closeUserDetailsModal}
      />

      <CreateUserModal
        user={selectedUser}
        isOpen={openCreateUserModal}
        onClose={() => setOpenCreateUserModal(false)}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
}
