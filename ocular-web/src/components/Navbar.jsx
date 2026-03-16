import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isLoggedIn, logout } from "../auth";

export default function Navbar() {
  const nav = useNavigate();
  const logged = isLoggedIn();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  function handleLogout() {
    if (!window.confirm("Are you sure you want to logout?")) return;
    logout();
    localStorage.removeItem("ocular_user");
    nav("/login", { replace: true });
  }

  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      padding: "1rem 2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "var(--shadow-sm)",
      borderBottom: "1px solid var(--border-color)"
    }}>
      <div style={{ 
        fontSize: '1.25rem', 
        fontWeight: 800, 
        fontFamily: 'var(--font-heading)',
        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Ocular AI
      </div>

      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <Link to="/" style={{ fontWeight: 500, fontSize: '0.9rem' }}>Home</Link>

        {logged ? (
          <>
            <Link to="/dashboard" style={{ fontWeight: 500, fontSize: '0.9rem' }}>Dashboard</Link>
            <Link to="/history" style={{ fontWeight: 500, fontSize: '0.9rem' }}>History</Link>
            <Link to="/library" style={{ fontWeight: 500, fontSize: '0.9rem' }}>Library</Link>
            <Link to="/reminders" style={{ fontWeight: 500, fontSize: '0.9rem' }}>Reminders</Link>
            <Link to="/profile" style={{ fontWeight: 500, fontSize: '0.9rem' }}>Profile</Link>
            <Link to="/settings" style={{ fontWeight: 500, fontSize: '0.9rem' }}>Settings</Link>

            <div style={{ width: '1px', height: '20px', background: 'var(--border-color)' }}></div>

            <button onClick={toggleTheme} style={{
              background: 'var(--bg-tertiary)',
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            <button
              onClick={handleLogout}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-md)",
                background: "var(--text-primary)",
                color: "var(--bg-primary)",
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
             <button onClick={toggleTheme} style={{
              background: 'var(--bg-tertiary)',
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              marginRight: '0.5rem'
            }}>
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            <Link to="/login" style={{ fontWeight: 500, fontSize: '0.9rem' }}>Login</Link>
            <Link to="/register" style={{
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius-md)",
              background: "var(--accent-primary)",
              color: "#fff",
              fontWeight: 600,
              fontSize: '0.85rem'
            }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}