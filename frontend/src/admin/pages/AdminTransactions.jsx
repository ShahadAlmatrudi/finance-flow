import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/admin.css";

const INIT_TRANSACTIONS = [
  { id: "TXN-001", user: "Alice Johnson", amount: 150, type: "Income", status: "Completed", date: "2023-10-26" },
  { id: "TXN-002", user: "Bob Williams", amount: -25.5, type: "Expense", status: "Pending", date: "2023-10-26" },
  { id: "TXN-003", user: "Charlie Davis", amount: 75, type: "Income", status: "Completed", date: "2023-10-25" },
  { id: "TXN-004", user: "Diana Prince", amount: -120, type: "Expense", status: "Failed", date: "2023-10-25" },
  { id: "TXN-005", user: "Eve Adams", amount: 200, type: "Transfer", status: "Completed", date: "2023-10-24" },
  { id: "TXN-006", user: "Frank Green", amount: -30, type: "Expense", status: "Completed", date: "2023-10-24" },
  { id: "TXN-007", user: "Grace Hall", amount: 500, type: "Income", status: "Pending", date: "2023-10-23" },
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
};

function Badge({ type }) {
  const map = {
    Income: { bg: "#f0fff4", color: "#276749" },
    Expense: { bg: "#fff5f5", color: "#9b2c2c" },
    Transfer: { bg: "#ebf4ff", color: "#1a365d" },
    Completed: { bg: "#f0fff4", color: "#276749" },
    Pending: { bg: "#fffbeb", color: "#92400e" },
    Failed: { bg: "#fff5f5", color: "#9b2c2c" },
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

export default function AdminTransactions() {
  const [txns, setTxns] = useState(() => {
    const s = localStorage.getItem("admin_txns");
    return s ? JSON.parse(s) : INIT_TRANSACTIONS;
  });
  const [statusF, setStatusF] = useState("All Status");
  const [typeF, setTypeF] = useState("All Types");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    localStorage.setItem("admin_txns", JSON.stringify(txns));
  }, [txns]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = txns
    .filter(
      (t) =>
        (statusF === "All Status" || t.status === statusF) &&
        (typeF === "All Types" || t.type === typeF)
    )
    .filter(
      (t) =>
        t.user.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase())
    )
    .filter((t) => {
      if (fromDate && t.date < fromDate) return false;
      if (toDate && t.date > toDate) return false;
      return true;
    })
    .sort((a, b) => {
      let av = a[sortField];
      let bv = b[sortField];
      if (sortField === "amount") {
        av = Number(av);
        bv = Number(bv);
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const deleteTxn = (id) => setTxns(txns.filter((t) => t.id !== id));
  const arrow = (f) => (sortField === f ? (sortDir === "asc" ? "↑" : "↓") : "↕");
  const fmtAmt = (amt) => (amt >= 0 ? `+$${amt.toFixed(2)}` : `-$${Math.abs(amt).toFixed(2)}`);

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
          <span style={{ fontSize: 16, fontWeight: 600 }}>Transaction Management</span>
        </div>

        <div style={{ padding: 24 }}>
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8ecf0", overflow: "hidden" }}>
            <div
              style={{
                padding: "14px 16px",
                display: "flex",
                gap: 8,
                borderBottom: "1px solid #e8ecf0",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <input
                placeholder="Search user or ID…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ ...inputStyle, width: 160 }}
              />
              <select value={statusF} onChange={(e) => setStatusF(e.target.value)} style={inputStyle}>
                {["All Status", "Completed", "Pending", "Failed"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <select value={typeF} onChange={(e) => setTypeF(e.target.value)} style={inputStyle}>
                {["All Types", "Income", "Expense", "Transfer"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 12, color: "#718096" }}>From:</span>
                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 12, color: "#718096" }}>To:</span>
                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {[
                    ["id", "Transaction ID"],
                    ["user", "User"],
                    ["amount", "Amount"],
                    ["type", "Type"],
                    ["status", "Status"],
                    ["date", "Date"],
                  ].map(([f, l]) => (
                    <th
                      key={f}
                      style={{ ...thStyle, cursor: "pointer", userSelect: "none" }}
                      onClick={() => handleSort(f)}
                    >
                      {l} {arrow(f)}
                    </th>
                  ))}
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id}>
                    <td style={tdStyle}>{t.id}</td>
                    <td style={tdStyle}>{t.user}</td>
                    <td style={{ ...tdStyle, color: t.amount >= 0 ? "#276749" : "#c53030", fontWeight: 500 }}>
                      {fmtAmt(t.amount)}
                    </td>
                    <td style={tdStyle}>
                      <Badge type={t.type} />
                    </td>
                    <td style={tdStyle}>
                      <Badge type={t.status} />
                    </td>
                    <td style={tdStyle}>{t.date}</td>
                    <td style={tdStyle}>
                      <button style={BTN.danger} onClick={() => deleteTxn(t.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ ...tdStyle, textAlign: "center", color: "#a0aec0" }}>
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div
              style={{
                padding: "10px 16px",
                fontSize: 12,
                color: "#718096",
                borderTop: "1px solid #f1f5f9",
              }}
            >
              Showing {filtered.length} of {txns.length} transactions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}