import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminToast from "../components/AdminToast";
import { defaultUsers, defaultActions } from "../data/adminData";
import "../styles/admin.css";

function AdminUsers() {
  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("adminUsers")) || defaultUsers
  );

  const [actions, setActions] = useState(
    JSON.parse(localStorage.getItem("adminActions")) || defaultActions
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [toast, setToast] = useState({ message: "", type: "" });
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    status: "Active",
    role: "User",
  });

  const currentAdminEmail =
    localStorage.getItem("currentAdminEmail") || "admin@example.com";

  useEffect(() => {
    localStorage.setItem("adminUsers", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("adminActions", JSON.stringify(actions));
  }, [actions]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (confirmDelete) setConfirmDelete(null);
        if (isModalOpen) closeModal();
      }

      if (e.key === "Enter" && isModalOpen) {
        const tag = document.activeElement?.tagName;
        if (tag !== "TEXTAREA") {
          handleSave();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, confirmDelete, form, editingId, users]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 2500);
  };

  const addAction = (title) => {
  const newAction = {
    id: Date.now(),
    title,
    createdAt: new Date().toISOString(),
  };

  setActions((prev) => [newAction, ...prev.slice(0, 7)]);
};

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      name: "",
      email: "",
      status: "Active",
      role: "User",
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      status: user.status,
      role: user.role,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({
      name: "",
      email: "",
      status: "Active",
      role: "User",
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    } else if (
      users.some(
        (u) =>
          u.email.toLowerCase() === form.email.toLowerCase() &&
          u.id !== editingId
      )
    ) {
      newErrors.email = "Email already exists";
    }

    if (!form.status) {
      newErrors.status = "Status is required";
    }

    if (!form.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid =
    form.name.trim() &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.status &&
    form.role &&
    !users.some(
      (u) =>
        u.email.toLowerCase() === form.email.toLowerCase() &&
        u.id !== editingId
    );

  const handleSave = () => {
    if (!validate()) return;

    if (editingId) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingId
            ? {
                ...u,
                name: form.name.trim(),
                email: form.email.trim(),
                status: form.status,
                role: form.role,
              }
            : u
        )
      );
      addAction(`Updated user ${form.name.trim()}`);
      showToast("User updated successfully");
    } else {
      const newUser = {
        id: Date.now(),
        name: form.name.trim(),
        email: form.email.trim(),
        status: form.status,
        role: form.role,
      };
      setUsers((prev) => [...prev, newUser]);
      addAction(`Added user ${form.name.trim()}`);
      showToast("User added successfully");
    }

    closeModal();
  };

  const handleDelete = (user) => {
    if (user.email === currentAdminEmail) {
      showToast("Admin cannot delete their own account", "error");
      return;
    }

    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    addAction(`Deleted user ${user.name}`);
    showToast("User deleted successfully");
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (filter !== "All") {
      if (filter === "Admin") {
        result = result.filter((u) => u.role === "Admin");
      } else {
        result = result.filter((u) => u.status === filter);
      }
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          u.status.toLowerCase().includes(term) ||
          u.role.toLowerCase().includes(term)
      );
    }

    result.sort((a, b) => {
      const aValue = String(a[sortConfig.key]).toLowerCase();
      const bValue = String(b[sortConfig.key]).toLowerCase();

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [users, searchTerm, filter, sortConfig]);

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <AdminToast message={toast.message} type={toast.type} />

        <div className="admin-users-header">
          <div>
            <h1 className="admin-page-title">User Management</h1>
            <p className="admin-page-subtitle">
              Welcome, {currentAdminEmail}. Manage platform users, their roles,
              and account status.
            </p>
          </div>

          <div className="admin-users-actions">
            <input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />

            <button className="admin-primary-btn" onClick={openAddModal}>
              + Add User
            </button>
          </div>
        </div>

        <div className="admin-filters">
          {["All", "Active", "Pending", "Suspended", "Admin"].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="admin-panel">
          <div className="admin-table-topbar">
            <h2 className="admin-section-title">All Users</h2>
            <span className="admin-user-count">
              Showing {filteredUsers.length} user
              {filteredUsers.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("name")} className="sortable">
                    Name
                    <span className="sort-indicator">
                      {sortConfig.key === "name"
                        ? sortConfig.direction === "asc"
                          ? " ↑"
                          : " ↓"
                        : ""}
                    </span>
                  </th>
                  <th onClick={() => handleSort("email")} className="sortable">
                    Email
                    <span className="sort-indicator">
                      {sortConfig.key === "email"
                        ? sortConfig.direction === "asc"
                          ? " ↑"
                          : " ↓"
                        : ""}
                    </span>
                  </th>
                  <th onClick={() => handleSort("status")} className="sortable">
                    Status
                    <span className="sort-indicator">
                      {sortConfig.key === "status"
                        ? sortConfig.direction === "asc"
                          ? " ↑"
                          : " ↓"
                        : ""}
                    </span>
                  </th>
                  <th onClick={() => handleSort("role")} className="sortable">
                    Role
                    <span className="sort-indicator">
                      {sortConfig.key === "role"
                        ? sortConfig.direction === "asc"
                          ? " ↑"
                          : " ↓"
                        : ""}
                    </span>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="admin-user-cell">
                          <div className="avatar">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="admin-user-name">{user.name}</span>
                        </div>
                      </td>

                      <td>{user.email}</td>

                      <td>
                        <span
                          className={`admin-badge ${getStatusBadgeClass(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`admin-role-badge ${getRoleBadgeClass(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td>
                        <div className="admin-actions">
                          <button
                            className="edit-btn"
                            onClick={() => openEditModal(user)}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => setConfirmDelete(user)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">
                      <div className="admin-empty-state">
                        <div className="admin-empty-icon">⌕</div>
                        <h3>No users found</h3>
                        <p>Try changing your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && (
          <div className="admin-modal-overlay" onClick={closeModal}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h2>{editingId ? "Edit User" : "Add User"}</h2>
                <button className="admin-close-btn" onClick={closeModal}>
                  ×
                </button>
              </div>

              <div className="admin-form-group">
                <label>Name</label>
                <input
                  name="name"
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={handleChange}
                  className={errors.name ? "input-error" : ""}
                />
                {errors.name && (
                  <p className="admin-field-error">{errors.name}</p>
                )}
              </div>

              <div className="admin-form-group">
                <label>Email</label>
                <input
                  name="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={handleChange}
                  className={errors.email ? "input-error" : ""}
                />
                {errors.email && (
                  <p className="admin-field-error">{errors.email}</p>
                )}
              </div>

              <div className="admin-form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={`admin-select ${errors.status ? "input-error" : ""}`}
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
                {errors.status && (
                  <p className="admin-field-error">{errors.status}</p>
                )}
              </div>

              <div className="admin-form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className={`admin-select ${errors.role ? "input-error" : ""}`}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
                {errors.role && (
                  <p className="admin-field-error">{errors.role}</p>
                )}
              </div>

              <div className="admin-form-actions">
                <button
                  onClick={handleSave}
                  className="admin-primary-btn"
                  disabled={!isFormValid}
                >
                  {editingId ? "Update User" : "Add User"}
                </button>
                <button onClick={closeModal} className="admin-secondary-btn">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmDelete && (
          <div
            className="admin-modal-overlay"
            onClick={() => setConfirmDelete(null)}
          >
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h2>Confirm Delete</h2>
                <button
                  className="admin-close-btn"
                  onClick={() => setConfirmDelete(null)}
                >
                  ×
                </button>
              </div>

              <p>
                Are you sure you want to delete{" "}
                <strong>{confirmDelete.name}</strong>?
              </p>

              <div className="admin-form-actions">
                <button
                  className="delete-btn"
                  onClick={() => {
                    handleDelete(confirmDelete);
                    setConfirmDelete(null);
                  }}
                >
                  Yes, Delete
                </button>

                <button
                  className="admin-secondary-btn"
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function getStatusBadgeClass(status) {
  switch (status) {
    case "Active":
      return "badge-active";
    case "Pending":
      return "badge-pending";
    case "Suspended":
      return "badge-suspended";
    default:
      return "";
  }
}

function getRoleBadgeClass(role) {
  switch (role) {
    case "Admin":
      return "role-admin";
    case "User":
      return "role-user";
    default:
      return "";
  }
}

export default AdminUsers;