import { useState } from "react";
import { api } from "../api/client";
import { logout } from "../auth";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const user = JSON.parse(localStorage.getItem("ocular_user") || "{}");
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    autoSave: false,
  });

  async function handlePasswordChange(e) {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    
    if (!currentPassword || !newPassword) {
      setMessage({ text: "Please fill in all password fields.", type: "error" });
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("email", user.email);
      params.append("current_password", currentPassword);
      params.append("new_password", newPassword);

      const res = await api.post("/auth/change_password", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (res.data.error) {
        setMessage({ text: res.data.message, type: "error" });
      } else {
        setMessage({ text: "Password changed successfully!", type: "success" });
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to change password.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAccount() {
    if (!window.confirm("Are you sure you want to delete your account? This action is permanent and will delete all your scan history.")) {
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("email", user.email);

      const res = await api.post("/auth/delete_account", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (res.data.error) {
        alert(res.data.message);
      } else {
        alert("Account deleted successfully.");
        logout();
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 2rem' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Settings</h1>

      {message.text && (
        <div style={{ 
          padding: '1rem', 
          borderRadius: 'var(--radius-md)', 
          marginBottom: '1.5rem',
          background: message.type === "success" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
          color: message.type === "success" ? "#16a34a" : "#ef4444",
          fontWeight: 600
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Preferences</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={preferences.emailNotifications} 
                onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})}
              />
              <span>Receive email notifications for scan results</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={preferences.autoSave}
                onChange={(e) => setPreferences({...preferences, autoSave: e.target.checked})}
              />
              <span>Auto-save analysis to history</span>
            </label>
          </div>
        </section>

        <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Security</h2>
          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Current Password</label>
              <input 
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>New Password</label>
              <input 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              style={{
                width: 'fit-content',
                padding: '10px 25px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--text-primary)',
                color: 'var(--bg-primary)',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>

          <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '2rem', paddingTop: '2rem' }}>
             <h3 style={{ color: '#ef4444', fontSize: '1rem', marginBottom: '0.5rem' }}>Danger Zone</h3>
             <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>Deleting your account will delete all historical scan data permanently.</p>
             <button 
               onClick={handleDeleteAccount}
               disabled={loading}
               style={{
                 padding: '8px 20px',
                 borderRadius: 'var(--radius-md)',
                 border: '1px solid #ef4444',
                 color: '#ef4444',
                 background: 'transparent',
                 fontWeight: 600,
                 cursor: loading ? 'not-allowed' : 'pointer'
               }}
             >
               Delete My Account
             </button>
          </div>
        </section>
      </div>
    </div>
  );
}
