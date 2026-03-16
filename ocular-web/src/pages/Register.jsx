import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import { saveToken } from "../auth";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const n1 = name.trim();
    const e1 = email.trim().toLowerCase();
    const p1 = password;

    if (!n1) return alert("Please enter name");
    if (!e1) return alert("Please enter email");
    if (!p1) return alert("Please enter password");
    if (p1.length < 6) return alert("Password must be at least 6 characters");

    try {
      setLoading(true);
      const res = await api.post("/auth/register", {
        name: n1,
        email: e1,
        password: p1,
        // Default values for missing expected fields to prevent backend errors
        gender: "Prefer not to say",
        qualification: "Standard"
      });

      saveToken(res.data.token);
      localStorage.setItem("ocular_user", JSON.stringify(res.data.user));
      nav("/dashboard");
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.detail || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      minHeight: "100vh",
      background: "var(--bg-secondary)"
    }}>
      <div
        className="glass"
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "3rem",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-lg)",
          background: "var(--bg-primary)"
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem", textAlign: 'center' }}>Join Ocular AI</h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2.5rem', fontSize: '0.9rem' }}>
          Create an account to start screening
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: "block", fontSize: '0.85rem', fontWeight: 600, color: "var(--text-secondary)", marginBottom: '6px', marginLeft: '4px' }}>
              Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              autoComplete="name"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                background: "var(--bg-primary)",
                color: "var(--text-primary)",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: '0.85rem', fontWeight: 600, color: "var(--text-secondary)", marginBottom: '6px', marginLeft: '4px' }}>
              Email Address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                background: "var(--bg-primary)",
                color: "var(--text-primary)",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: '0.85rem', fontWeight: 600, color: "var(--text-secondary)", marginBottom: '6px', marginLeft: '4px' }}>
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              type="password"
              autoComplete="new-password"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                background: "var(--bg-primary)",
                color: "var(--text-primary)",
                outline: "none",
              }}
            />
          </div>

          <button
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "0.5rem",
              padding: "12px",
              borderRadius: "var(--radius-md)",
              background: loading ? "var(--text-muted)" : "var(--accent-primary)",
              color: "#fff",
              fontWeight: 700,
              fontSize: '1rem',
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
            }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p style={{ marginTop: "2rem", textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>

      <div style={{ 
        marginTop: '2rem', 
        textAlign: 'center', 
        color: 'var(--text-secondary)', 
        fontSize: '0.85rem',
        opacity: 0.8
      }}>
        2026 © Powered by SIMATS Engineering
      </div>
    </div>
  );
}