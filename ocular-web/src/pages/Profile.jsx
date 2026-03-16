import { useState, useEffect } from "react";
import { api } from "../api/client";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("ocular_user") || "{}");
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/auth/me");
        if (res.data) {
          setName(res.data.name || "");
          setEmail(res.data.email || "");
          localStorage.setItem("ocular_user", JSON.stringify(res.data));
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchProfile();
  }, []);

  async function handleSave() {
    setMessage({ text: "", type: "" });
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("user_id", user.id);
      params.append("name", name);
      params.append("email", email);
      // Backend expects 'password' form field, leaving empty if not changing in this view
      params.append("password", "");

      const res = await api.post("/auth/update_profile", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (res.data.error) {
        setMessage({ text: res.data.message, type: "error" });
      } else {
        const updatedUser = { ...user, name, email };
        localStorage.setItem("ocular_user", JSON.stringify(updatedUser));
        setMessage({ text: "Profile updated successfully!", type: "success" });
        setEditing(false);
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to update profile.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 2rem' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Your Profile</h1>
      
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

      <div className="glass" style={{
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {initialLoading ? (
            <div className="skeleton" style={{ width: '100px', height: '100px', borderRadius: '50%' }}></div>
          ) : (
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              color: 'white',
              fontWeight: 800
            }}>
              {name ? name.charAt(0).toUpperCase() : "?"}
            </div>
          )}
          
          <div>
            {initialLoading ? (
              <>
                <div className="skeleton" style={{ width: '150px', height: '28px', marginBottom: '8px', borderRadius: '4px' }}></div>
                <div className="skeleton" style={{ width: '120px', height: '20px', borderRadius: '4px' }}></div>
              </>
            ) : (
              <>
                <h2 style={{ fontSize: '1.5rem' }}>{name || "User"}</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Ocular AI Member</p>
              </>
            )}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Full Name</label>
              {initialLoading ? (
                <div className="skeleton" style={{ width: '100%', height: '40px', borderRadius: 'var(--radius-sm)' }}></div>
              ) : editing ? (
                <input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
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
              ) : (
                <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>{name}</p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Email Address</label>
              {initialLoading ? (
                <div className="skeleton" style={{ width: '100%', height: '40px', borderRadius: 'var(--radius-sm)' }}></div>
              ) : editing ? (
                <input 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
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
              ) : (
                <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>{email}</p>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          {editing ? (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => setEditing(false)}
                disabled={loading}
                style={{
                  padding: '8px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={loading}
                style={{
                  padding: '8px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--accent-primary)',
                  color: 'white',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setEditing(true)}
              style={{
                padding: '8px 25px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--text-primary)',
                color: 'var(--bg-primary)',
                fontWeight: 600
              }}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
