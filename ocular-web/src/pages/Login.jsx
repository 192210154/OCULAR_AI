import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import { saveToken } from "../auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const e1 = email.trim().toLowerCase();
    const p1 = password;

    if (!e1) return alert("Please enter email");
    if (!p1) return alert("Please enter password");

    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email: e1, password: p1 });
      saveToken(res.data.token);
      localStorage.setItem("ocular_user", JSON.stringify(res.data.user));
      nav("/dashboard");
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.detail || "Login failed");
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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        width: '100%', 
        maxWidth: '420px', 
        marginBottom: '2rem',
        alignItems: 'center'
      }}>
        <img src="/logos/saveth_logo.jpg" alt="Savetha Logo" style={{ height: '60px', borderRadius: '8px' }} />
        <img src="/logos/ses_logo.png" alt="SES Logo" style={{ height: '60px', borderRadius: '8px' }} />
      </div>

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
        <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem", textAlign: 'center' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2.5rem', fontSize: '0.9rem' }}>
          Please enter your details to sign in
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                background: "var(--bg-primary)",
                color: "var(--text-primary)",
                outline: "none",
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: "var(--text-secondary)", marginLeft: '4px' }}>
                Password
              </label>
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                Forgot Password?
              </Link>
            </div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "12px 16px",
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
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>

        <p style={{ marginTop: "2rem", textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Sign Up</Link>
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