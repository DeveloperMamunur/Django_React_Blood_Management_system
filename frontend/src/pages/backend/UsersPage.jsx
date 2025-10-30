import { useEffect, useState } from "react";
import ReusableTable from "../../components/common/ReusableTable";
import { userService } from "../../services/userService";
import { Eye, Pencil, Trash2, Users, Hospital, HeartHandshake, User } from "lucide-react";
import UserDetailsModal from "../../components/modals/UserModal";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

    fetchUsers();
  }, []);


  const openUserDetails = (user) => {
    setSelectedUser(user);
    setOpenUserModal(true);
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
      onClick: (row) => console.log("Edit user:", row),
    },
    {
      label: "Delete",
      icon: <Trash2 size={14} />,
      className:
        "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800",
      onClick: (row) => console.log("Delete user:", row),
    },
  ];


  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        User Management
      </h1>

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
    </div>
  );
}
