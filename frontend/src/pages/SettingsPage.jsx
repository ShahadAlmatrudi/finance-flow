import { useRef, useState } from "react";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { FiCalendar, FiChevronDown, FiX } from "react-icons/fi";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    fullName: "Ola Essam",
    email: "ola123@example.com",
    phone: "555-123-4567",
    address: "123 Main St, Anytown, USA 12345",
    dob: "",
    gender: "Male",
    occupation: "Software Engineer",
    allowNotifications: true,
    smsAlerts: false,
    enable2FA: false,
  });

  const [editable, setEditable] = useState({
    phone: false,
    address: false,
    occupation: false,
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const hiddenDateInputRef = useRef(null);

  const phoneRef = useRef(null);
  const addressRef = useRef(null);
  const occupationRef = useRef(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleEditable = (field) => {
    setEditable((prev) => {
      const nextState = {
        ...prev,
        [field]: !prev[field],
      };

      if (!prev[field]) {
        setTimeout(() => {
          if (field === "phone" && phoneRef.current) {
            phoneRef.current.focus();
          }
          if (field === "address" && addressRef.current) {
            addressRef.current.focus();
          }
          if (field === "occupation" && occupationRef.current) {
            occupationRef.current.focus();
          }
        }, 0);
      }

      return nextState;
    });
  };

  const openDatePicker = () => {
    if (hiddenDateInputRef.current) {
      if (hiddenDateInputRef.current.showPicker) {
        hiddenDateInputRef.current.showPicker();
      } else {
        hiddenDateInputRef.current.focus();
        hiddenDateInputRef.current.click();
      }
    }
  };

  const formatDateForDisplay = (dateValue) => {
    if (!dateValue) return "mm/dd/yyyy";
    const [year, month, day] = dateValue.split("-");
    return `${month}/${day}/${year}`;
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordData({
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <main className="page-content settings-page">
      <h1 className="settings-small-title">profile</h1>

      <section className="settings-wireframe">
        <div className="settings-header">
          <h2>Ola&apos;s Profile</h2>
          <p>Manage your personal information and account settings.</p>
        </div>

        <div className="settings-grid">
          <div className="settings-left-column">
            <div className="card profile-card">
              <div className="profile-avatar-wrap">
                <HiOutlineUserCircle className="profile-avatar-icon" />
              </div>
              <p className="profile-name">{formData.fullName}</p>
            </div>

            <div className="card contact-card">
              <h3>Contact Information</h3>

              <div className="settings-field">
                <label>Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Enter email address"
                  className="settings-read-field"
                />
              </div>

              <div className="settings-field">
                <label>Phone Number</label>
                <div className="settings-inline-field">
                  <input
                    ref={phoneRef}
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="Enter phone number"
                    readOnly={!editable.phone}
                    className={editable.phone ? "editable-white" : "locked-white"}
                  />
                  <button
                    type="button"
                    className="settings-edit-btn"
                    onClick={() => toggleEditable("phone")}
                  >
                    {editable.phone ? "Done" : "Edit"}
                  </button>
                </div>
              </div>

              <div className="settings-field">
                <label>Address</label>
                <div className="settings-inline-field">
                  <textarea
                    ref={addressRef}
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Enter address"
                    readOnly={!editable.address}
                    className={editable.address ? "editable-white" : "locked-white"}
                  />
                  <button
                    type="button"
                    className="settings-edit-btn settings-edit-btn-tall"
                    onClick={() => toggleEditable("address")}
                  >
                    {editable.address ? "Done" : "Edit"}
                  </button>
                </div>
              </div>
            </div>

            <div className="card personal-card">
              <h3>Personal Details</h3>

              <div className="settings-field">
                <label>Date of Birth</label>

                <div className="settings-input-icon-wrap">
                  <input
                    type="text"
                    value={formatDateForDisplay(formData.dob)}
                    readOnly
                    className="settings-read-field"
                  />

                  <button
                    type="button"
                    className="settings-icon-btn"
                    onClick={openDatePicker}
                    aria-label="Open date picker"
                  >
                    <FiCalendar className="settings-input-icon" />
                  </button>

                  <input
                    ref={hiddenDateInputRef}
                    type="date"
                    className="hidden-native-date"
                    value={formData.dob}
                    onChange={(e) => handleChange("dob", e.target.value)}
                    tabIndex={-1}
                  />
                </div>
              </div>

              <div className="settings-field">
                <label>Gender</label>
                <div className="settings-select-wrap">
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <FiChevronDown className="settings-input-icon" />
                </div>
              </div>

              <div className="settings-field">
                <label>Occupation</label>
                <div className="settings-inline-field">
                  <input
                    ref={occupationRef}
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => handleChange("occupation", e.target.value)}
                    placeholder="Enter occupation"
                    readOnly={!editable.occupation}
                    className={editable.occupation ? "editable-white" : "locked-white"}
                  />
                  <button
                    type="button"
                    className="settings-edit-btn"
                    onClick={() => toggleEditable("occupation")}
                  >
                    {editable.occupation ? "Done" : "Edit"}
                  </button>
                </div>
              </div>
            </div>

            <div className="settings-actions">
              <button type="button" className="settings-save-btn">
                Save Changes
              </button>
              <button type="button" className="settings-cancel-btn">
                Cancel
              </button>
            </div>
          </div>

          <div className="settings-right-column">
            <div className="card security-card">
              <h3>Security Settings</h3>

              <button
                type="button"
                className="security-password-btn"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </button>

              <p className="security-last-login">
                Last login: 2023-10-26 10:30 AM from New York, USA
              </p>

              <div className="security-toggle-row">
                <span>Enable 2FA</span>

                <button
                  type="button"
                  className={`toggle-switch ${formData.enable2FA ? "active" : ""}`}
                  aria-label="Enable 2FA"
                  onClick={() => handleChange("enable2FA", !formData.enable2FA)}
                >
                  <span className="toggle-knob"></span>
                </button>
              </div>
            </div>

            <div className="card notification-card">
              <h3>Notification Preferences</h3>

              <label className="custom-check-row">
                <input
                  type="checkbox"
                  checked={formData.allowNotifications}
                  onChange={() =>
                    handleChange("allowNotifications", !formData.allowNotifications)
                  }
                />
                <span className="custom-box">
                  {formData.allowNotifications && <span className="custom-tick">✓</span>}
                </span>
                <span>Allow Notifications</span>
              </label>

              <label className="custom-check-row">
                <input
                  type="checkbox"
                  checked={formData.smsAlerts}
                  onChange={() => handleChange("smsAlerts", !formData.smsAlerts)}
                />
                <span className="custom-box">
                  {formData.smsAlerts && <span className="custom-tick">✓</span>}
                </span>
                <span>SMS Alerts</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {showPasswordModal && (
        <div className="password-modal-overlay">
          <div className="password-modal-card">
            <div className="password-modal-top">
              <h3>Change Password</h3>
              <button
                type="button"
                className="password-modal-close"
                onClick={closePasswordModal}
                aria-label="Close"
              >
                <FiX />
              </button>
            </div>

            <div className="password-modal-field">
              <label>New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <div className="password-modal-field">
              <label>Confirm Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                placeholder="Re-enter password"
              />
            </div>

            <div className="password-modal-actions">
              <button type="button" className="settings-save-btn">
                Save Changes
              </button>
              <button
                type="button"
                className="settings-cancel-btn"
                onClick={closePasswordModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}