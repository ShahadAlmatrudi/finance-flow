import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/admin.css";

const INIT_CATS = [
  { id: "CAT-001", name: "Groceries", type: "Expense", count: 125 },
  { id: "CAT-002", name: "Salary", type: "Income", count: 12 },
  { id: "CAT-003", name: "Utilities", type: "Expense", count: 48 },
  { id: "CAT-004", name: "Rent", type: "Expense", count: 12 },
  { id: "CAT-005", name: "Freelance", type: "Income", count: 8 },
  { id: "CAT-006", name: "Transportation", type: "Expense", count: 70 },
];

const inputStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: 6,
  padding: "6px 10px",
  fontSize: 13,
  outline: "none",
};

const thStyle = {
  textAlign: "left",
  padding: "12px 16px",
  fontSize: 12,
  color: "#718096",
  borderBottom: "1px solid #e8ecf0",
  background: "#f7fafc",
};

const tdStyle = {
  padding: "13px 16px",
  fontSize: 13,
  borderBottom: "1px solid #f1f5f9",
  color: "#2d3748",
};

const BTN = {
  primary: {
    background: "#3d3de4",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    fontSize: 12,
    cursor: "pointer",
    fontWeight: 500,
  },
  danger: {
    background: "#fff5f5",
    color: "#c53030",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    fontSize: 12,
    cursor: "pointer",
    fontWeight: 500,
  },
  edit: {
    background: "#ebf8ff",
    color: "#2b6cb0",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    fontSize: 12,
    cursor: "pointer",
    fontWeight: 500,
  },
};

function Badge({ type }) {
  const map = {
    Income: { bg: "#f0fff4", color: "#276749" },
    Expense: { bg: "#fff5f5", color: "#9b2c2c" },
  };
  const s = map[type] || { bg: "#f7fafc", color: "#4a5568" };

  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 500,
        background: s.bg,
        color: s.color,
      }}
    >
      {type}
    </span>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
    >
      <div style={{ background: "#fff", padding: 24, borderRadius: 12, width: 340, border: "1px solid #e8ecf0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#718096" }}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function AdminCategories() {
  const [cats, setCats] = useState(() => {
    const s = localStorage.getItem("admin_cats");
    return s ? JSON.parse(s) : INIT_CATS;
  });
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [form, setForm] = useState({ name: "", type: "Expense" });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    localStorage.setItem("admin_cats", JSON.stringify(cats));
  }, [cats]);

  const addCat = () => {
    if (!form.name.trim()) {
      setFormError("Category name is required");
      return;
    }
    if (cats.find((c) => c.name.toLowerCase() === form.name.toLowerCase())) {
      setFormError("Category already exists");
      return;
    }

    setFormError("");
    const newId = `CAT-${String(cats.length + 1).padStart(3, "0")}`;
    setCats([...cats, { id: newId, name: form.name.trim(), type: form.type, count: 0 }]);
    setForm({ name: "", type: "Expense" });
    setShowAdd(false);
  };

  const saveEdit = () => {
    if (!editCat.name.trim()) {
      setFormError("Name required");
      return;
    }
    setFormError("");
    setCats(cats.map((c) => (c.id === editCat.id ? editCat : c)));
    setEditCat(null);
  };

  const deleteCat = (id) => setCats(cats.filter((c) => c.id !== id));
  const filtered = cats.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f9" }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
        <div
          style={{
            background: "#fff",
            borderBottom: "1px solid #e8ecf0",
            padding: "0 24px",
            height: 56,
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 600 }}>Category Management</span>
        </div>

        <div style={{ padding: 24 }}>
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8ecf0", overflow: "hidden" }}>
            <div
              style={{
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #e8ecf0",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <input
                placeholder="Search categories…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ ...inputStyle, width: 200 }}
              />
              <button
                style={BTN.primary}
                onClick={() => {
                  setShowAdd(true);
                  setFormError("");
                }}
              >
                + Add New Category
              </button>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Category ID", "Category Name", "Type", "Associated Transactions", "Actions"].map((h) => (
                    <th key={h} style={thStyle}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td style={tdStyle}>{c.id}</td>
                    <td style={tdStyle}>{c.name}</td>
                    <td style={tdStyle}>
                      <Badge type={c.type} />
                    </td>
                    <td style={tdStyle}>{c.count}</td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          style={BTN.edit}
                          onClick={() => {
                            setEditCat({ ...c });
                            setFormError("");
                          }}
                        >
                          Edit
                        </button>
                        <button style={BTN.danger} onClick={() => deleteCat(c.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ ...tdStyle, textAlign: "center", color: "#a0aec0" }}>
                      No categories found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {showAdd && (
              <Modal title="Add Category" onClose={() => setShowAdd(false)}>
                <label style={{ fontSize: 12, color: "#718096", display: "block", marginBottom: 4 }}>Category Name</label>
                <input
                  style={{ ...inputStyle, width: "100%", marginBottom: 10 }}
                  placeholder="e.g. Entertainment"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <label style={{ fontSize: 12, color: "#718096", display: "block", marginBottom: 4 }}>Type</label>
                <select
                  style={{ ...inputStyle, width: "100%", marginBottom: 14 }}
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option>Expense</option>
                  <option>Income</option>
                </select>
                {formError && <div style={{ color: "#e53e3e", fontSize: 12, marginBottom: 10 }}>{formError}</div>}
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={BTN.primary} onClick={addCat}>
                    Add
                  </button>
                  <button style={BTN.danger} onClick={() => setShowAdd(false)}>
                    Cancel
                  </button>
                </div>
              </Modal>
            )}

            {editCat && (
              <Modal title="Edit Category" onClose={() => setEditCat(null)}>
                <label style={{ fontSize: 12, color: "#718096", display: "block", marginBottom: 4 }}>Category Name</label>
                <input
                  style={{ ...inputStyle, width: "100%", marginBottom: 10 }}
                  value={editCat.name}
                  onChange={(e) => setEditCat({ ...editCat, name: e.target.value })}
                />
                <label style={{ fontSize: 12, color: "#718096", display: "block", marginBottom: 4 }}>Type</label>
                <select
                  style={{ ...inputStyle, width: "100%", marginBottom: 14 }}
                  value={editCat.type}
                  onChange={(e) => setEditCat({ ...editCat, type: e.target.value })}
                >
                  <option>Expense</option>
                  <option>Income</option>
                </select>
                {formError && <div style={{ color: "#e53e3e", fontSize: 12, marginBottom: 10 }}>{formError}</div>}
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={BTN.primary} onClick={saveEdit}>
                    Save
                  </button>
                  <button style={BTN.danger} onClick={() => setEditCat(null)}>
                    Cancel
                  </button>
                </div>
              </Modal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}