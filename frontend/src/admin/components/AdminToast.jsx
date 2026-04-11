import "../styles/admin.css";

function AdminToast({ message, type }) {
  if (!message) return null;

  return <div className={`admin-toast ${type}`}>{message}</div>;
}

export default AdminToast;