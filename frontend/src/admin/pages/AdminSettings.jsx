import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/admin.css";

function Toggle({ on, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        width: 40,
        height: 22,
        borderRadius: 20,
        background: on ? "#63b3ed" : "#cbd5e0",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          position: "absolute",
          top: 2,
          left: on ? 20 : 2,
          transition: "left 0.2s",
        }}
      />
    </div>
  );
}

export default function AdminSettings() {
  const [saved, setSaved] = useState({
    general: "",
    user: "",
    notif: "",
    security: "",
  });

  const [error, setError] = useState({
    general: "",
    user: "",
    notif: "",
    security: "",
  });

  const [general, setGeneral] = useState(() => {
    const s = localStorage.getItem("settings_general");
    return s ? JSON.parse(s) : { appName: "", currency: "SAR" };
  });

  const [userSettings, setUserSettings] = useState(() => {
    const s = localStorage.getItem("settings_user");
    return s ? JSON.parse(s) : { allowReg: true, defaultRole: "Standard User", requireEmail: false };
  });

  const [notif, setNotif] = useState(() => {
    const s = localStorage.getItem("settings_notif");
    return s ? JSON.parse(s) : { email: true, sms: false, digest: "Daily" };
  });

  const [security, setSecurity] = useState(() => {
    const s = localStorage.getItem("settings_security");
    return s ? JSON.parse(s) : { tfa: true, minPass: 8, timeout: 60 };
  });

  const showMsg = (section, ok, msg) => {
    if (ok) {
      setSaved((s) => ({ ...s, [section]: msg }));
      setError((e) => ({ ...e, [section]: "" }));
      setTimeout(() => setSaved((s) => ({ ...s, [section]: "" })), 3000);
    } else {
      setError((e) => ({ ...e, [section]: msg }));
      setSaved((s) => ({ ...s, [section]: "" }));
      setTimeout(() => setError((e) => ({ ...e, [section]: "" })), 3000);
    }
  };

  const saveGeneral = () => {
    if (!general.appName.trim()) {
      showMsg("general", false, "Application Name is required");
      return;
    }
    localStorage.setItem("settings_general", JSON.stringify(general));
    showMsg("general", true, "General settings saved");
  };

  const saveUser = () => {
    localStorage.setItem("settings_user", JSON.stringify(userSettings));
    showMsg("user", true, "User registration settings saved");
  };

  const saveNotif = () => {
    localStorage.setItem("settings_notif", JSON.stringify(notif));
    showMsg("notif", true, "Notification settings saved");
  };

  const saveSecurity = () => {
    if (!security.minPass || security.minPass < 1) {
      showMsg("security", false, "Minimum Password Length is required");
      return;
    }
    if (!security.timeout || security.timeout < 1) {
      showMsg("security", false, "Session Timeout is required");
      return;
    }
    localStorage.setItem("settings_security", JSON.stringify(security));
    showMsg("security", true, "Security settings saved");
  };

  const inp = {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    fontSize: 13,
    outline: "none",
    marginBottom: 14,
    boxSizing: "border-box",
  };

  const btn = {
    background: "#3434e7",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: 8,
    fontSize: 13,
    cursor: "pointer",
    fontWeight: 500,
    marginTop: 6,
  };

  const row = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #f7fafc",
  };

  const sectionTitle = {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 14,
    paddingBottom: 10,
    borderBottom: "1px solid #e8ecf0",
  };

  const card = {
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    border: "1px solid #e8ecf0",
    marginBottom: 16,
  };

  const successStyle = {
    background: "#f0fff4",
    border: "1px solid #9ae6b4",
    color: "#276749",
    padding: "10px 16px",
    borderRadius: 8,
    marginTop: 10,
    fontSize: 13,
  };

  const errorStyle = {
    background: "#fff5f5",
    border: "1px solid #feb2b2",
    color: "#c53030",
    padding: "10px 16px",
    borderRadius: 8,
    marginTop: 10,
    fontSize: 13,
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
          <span style={{ fontSize: 16, fontWeight: 600 }}>System Settings</span>
        </div>

        <div style={{ padding: 24 }}>
          <div style={card}>
            <div style={sectionTitle}>General Settings</div>
            <label style={{ fontSize: 12, color: "#718096", display: "block", marginBottom: 6 }}>
              Application Name <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <input
              style={{ ...inp, border: !general.appName.trim() ? "1px solid #fed7d7" : inp.border }}
              placeholder="e.g. MoneyPlan"
              value={general.appName}
              onChange={(e) => setGeneral({ ...general, appName: e.target.value })}
            />
            {!general.appName.trim() && (
              <div style={{ color: "#e53e3e", fontSize: 11, marginTop: -10, marginBottom: 10 }}>Required</div>
            )}

            <label style={{ fontSize: 12, color: "#718096", display: "block", marginBottom: 6 }}>Default Currency</label>
            <select style={inp} value={general.currency} onChange={(e) => setGeneral({ ...general, currency: e.target.value })}>
              <option value="SAR">SAR (ريال)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>

            <button style={btn} onClick={saveGeneral}>
              Save General Settings
            </button>

            {saved.general && <div style={successStyle}>✓ {saved.general}</div>}
            {error.general && <div style={errorStyle}>✕ {error.general}</div>}
          </div>

          <div style={card}>
            <div style={sectionTitle}>User Management Settings</div>
            <div style={row}>
              <span style={{ fontSize: 13 }}>Allow New User Registration</span>
              <Toggle on={userSettings.allowReg} onToggle={() => setUserSettings({ ...userSettings, allowReg: !userSettings.allowReg })} />
            </div>

            <label style={{ fontSize: 12, color: "#718096", display: "block", margin: "12px 0 6px" }}>Default User Role</label>
            <select
              style={inp}
              value={userSettings.defaultRole}
              onChange={(e) => setUserSettings({ ...userSettings, defaultRole: e.target.value })}
            >
              <option>Standard User</option>
              <option>Admin</option>
            </select>

            <div style={row}>
              <span style={{ fontSize: 13 }}>Require Email Verification</span>
              <Toggle
                on={userSettings.requireEmail}
                onToggle={() => setUserSettings({ ...userSettings, requireEmail: !userSettings.requireEmail })}
              />
            </div>

            <button style={btn} onClick={saveUser}>
              Save User Settings
            </button>

            {saved.user && <div style={successStyle}>✓ {saved.user}</div>}
            {error.user && <div style={errorStyle}>✕ {error.user}</div>}
          </div>

          <div style={card}>
            <div style={sectionTitle}>Notification Settings</div>
            <div style={row}>
              <span style={{ fontSize: 13 }}>Enable Email Notifications</span>
              <Toggle on={notif.email} onToggle={() => setNotif({ ...notif, email: !notif.email })} />
            </div>

            <div style={row}>
              <span style={{ fontSize: 13 }}>Enable SMS Notifications</span>
              <Toggle on={notif.sms} onToggle={() => setNotif({ ...notif, sms: !notif.sms })} />
            </div>

            <label style={{ fontSize: 12, color: "#718096", display: "block", margin: "12px 0 6px" }}>Daily Digest Email</label>
            <select style={inp} value={notif.digest} onChange={(e) => setNotif({ ...notif, digest: e.target.value })}>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Never</option>
            </select>

            <button style={btn} onClick={saveNotif}>
              Save Notification Settings
            </button>

            {saved.notif && <div style={successStyle}>✓ {saved.notif}</div>}
            {error.notif && <div style={errorStyle}>✕ {error.notif}</div>}
          </div>

          <div style={card}>
            <div style={sectionTitle}>Security Settings</div>
            <div style={row}>
              <span style={{ fontSize: 13 }}>Enable Two-Factor Auth (2FA)</span>
              <Toggle on={security.tfa} onToggle={() => setSecurity({ ...security, tfa: !security.tfa })} />
            </div>

            <label style={{ fontSize: 12, color: "#718096", display: "block", margin: "12px 0 6px" }}>
              Minimum Password Length <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <input
              type="number"
              min={1}
              max={32}
              style={{ ...inp, border: !security.minPass || security.minPass < 1 ? "1px solid #fed7d7" : inp.border }}
              value={security.minPass}
              onChange={(e) => setSecurity({ ...security, minPass: Number(e.target.value) })}
            />
            {(!security.minPass || security.minPass < 1) && (
              <div style={{ color: "#e53e3e", fontSize: 11, marginTop: -10, marginBottom: 10 }}>Required</div>
            )}

            <label style={{ fontSize: 12, color: "#718096", display: "block", marginBottom: 6 }}>
              Session Timeout (minutes) <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <input
              type="number"
              min={1}
              style={{ ...inp, border: !security.timeout || security.timeout < 1 ? "1px solid #fed7d7" : inp.border }}
              value={security.timeout}
              onChange={(e) => setSecurity({ ...security, timeout: Number(e.target.value) })}
            />
            {(!security.timeout || security.timeout < 1) && (
              <div style={{ color: "#e53e3e", fontSize: 11, marginTop: -10, marginBottom: 10 }}>Required</div>
            )}

            <button style={btn} onClick={saveSecurity}>
              Save Security Settings
            </button>

            {saved.security && <div style={successStyle}>✓ {saved.security}</div>}
            {error.security && <div style={errorStyle}>✕ {error.security}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}