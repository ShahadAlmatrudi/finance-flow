import "../styles/admin.css";

function AdminStatCard({ title, value, note, trend = "up" }) {
  return (
    <div className="admin-stat-card">
      <p className="admin-stat-title">{title}</p>
      <h3 className="admin-stat-value">{value}</h3>

      <div className={`admin-stat-trend ${trend === "up" ? "trend-up" : "trend-down"}`}>
        <span className="admin-stat-arrow">
          {trend === "up" ? "↑" : "↓"}
        </span>
        <span>{note}</span>
      </div>
    </div>
  );
}

export default AdminStatCard;