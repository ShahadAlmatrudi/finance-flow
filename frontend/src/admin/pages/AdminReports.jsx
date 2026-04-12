import { useState } from "react";
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

export default function AdminReports() {
  const [txns] = useState(() => {
    const s = localStorage.getItem("admin_txns");
    return s ? JSON.parse(s) : INIT_TRANSACTIONS;
  });
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filtered = txns.filter((t) => {
    if (fromDate && t.date < fromDate) return false;
    if (toDate && t.date > toDate) return false;
    return true;
  });

  const exportCSV = () => {
    const headers = ["ID", "User", "Amount", "Type", "Status", "Date"];
    const rows = filtered.map((t) => [t.id, t.user, t.amount, t.type, t.status, t.date]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyIncome = Array(12).fill(0);
  const monthlyExpense = Array(12).fill(0);

  txns.forEach((t) => {
    const m = new Date(t.date).getMonth();
    if (isNaN(m)) return;
    if (t.amount > 0) monthlyIncome[m] += t.amount;
    else monthlyExpense[m] += Math.abs(t.amount);
  });

  const maxVal = Math.max(...monthlyIncome, ...monthlyExpense, 1);

  const top5 = [
    { name: "Groceries", pct: "25%", color: "#3b82f6" },
    { name: "Rent", pct: "20%", color: "#ef4444" },
    { name: "Utilities", pct: "15%", color: "#f59e0b" },
    { name: "Transportation", pct: "10%", color: "#10b981" },
    { name: "Dining Out", pct: "8%", color: "#6366f1" },
    { name: "Other", pct: "22%", color: "#9ca3af" },
  ];

  const card = {
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    border: "1px solid #e8ecf0",
    marginBottom: 16,
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
          <span style={{ fontSize: 16, fontWeight: 600 }}>Financial Reports & Analytics</span>
        </div>

        <div style={{ padding: 24 }}>
          <div style={{ ...card, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#718096" }}>From:</label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#718096" }}>To:</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={inputStyle} />
            </div>
            <select style={inputStyle}>
              <option>All Reports</option>
            </select>
            <button
              style={{
                background: "#1da541",
                color: "#fff",
                border: "none",
                padding: "7px 14px",
                borderRadius: 6,
                fontSize: 13,
                cursor: "pointer",
                fontWeight: 500,
              }}
              onClick={exportCSV}
            >
              Export to CSV
            </button>
            <button
              style={{
                background: "#3d3de4",
                color: "#fff",
                border: "none",
                padding: "7px 14px",
                borderRadius: 6,
                fontSize: 13,
                cursor: "pointer",
                fontWeight: 500,
              }}
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
            >
              ↺ Refresh
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 16 }}>
            <div style={card}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Monthly Income vs. Expense</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 130, marginBottom: 8 }}>
                {months.map((m, i) => (
                  <div key={m} style={{ flex: 1, display: "flex", gap: 2, alignItems: "flex-end" }}>
                    <div
                      style={{
                        flex: 1,
                        height: `${(monthlyIncome[i] / maxVal) * 100}%`,
                        background: "#22c55e",
                        borderRadius: "3px 3px 0 0",
                        minHeight: monthlyIncome[i] > 0 ? 4 : 0,
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        height: `${(monthlyExpense[i] / maxVal) * 100}%`,
                        background: "#ef4444",
                        borderRadius: "3px 3px 0 0",
                        minHeight: monthlyExpense[i] > 0 ? 4 : 0,
                      }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                {months.map((m) => (
                  <div key={m} style={{ flex: 1, fontSize: 9, color: "#a0aec0", textAlign: "center" }}>
                    {m}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 30, marginTop: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 12, height: 12, background: "#22c55e", borderRadius: 3 }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#4a5568" }}>Income</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 12, height: 12, background: "#ef4444", borderRadius: 3 }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#4a5568" }}>Expense</span>
                </div>
              </div>
            </div>

            <div style={card}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Top 5 Spending Categories</div>
              {top5.map(({ name, pct, color }) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#4a5568", marginBottom: 10 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 4, background: color, display: "inline-block" }} />
                  <span style={{ flex: 1 }}>{name}</span>
                  <span style={{ fontWeight: 600, color: "#1a1a2e" }}>{pct}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...card, padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #e8ecf0", fontSize: 14, fontWeight: 600 }}>
              Recent User Activity
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["User ID", "Username", "Action"].map((h) => (
                    <th key={h} style={thStyle}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["USR-001", "Alice Johnson", "Logged in"],
                  ["USR-002", "Bob Williams", "Added new transaction"],
                  ["USR-001", "Alice Johnson", "Updated profile"],
                  ["USR-003", "Charlie Davis", "Viewed reports"],
                  ["USR-002", "Bob Williams", "Logged out"],
                ].map(([id, u, a]) => (
                  <tr key={id + a}>
                    <td style={tdStyle}>{id}</td>
                    <td style={tdStyle}>{u}</td>
                    <td style={tdStyle}>{a}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}