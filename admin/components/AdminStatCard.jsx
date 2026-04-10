import "../styles/admin.css";

function AdminStatCard({ title, value, note }) {
  return (
    <div className="admin-stat-card">
      <p className="admin-stat-title">{title}</p>
      <h3 className="admin-stat-value">{value}</h3>
      <span className="admin-stat-note">{note}</span>
    </div>
  );
}

export default AdminStatCard;