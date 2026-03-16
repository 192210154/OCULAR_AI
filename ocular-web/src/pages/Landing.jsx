import { Link, useNavigate } from "react-router-dom";

export default function Landing() {
  const token = localStorage.getItem("token");
  const nav = useNavigate();

  function goDashboard() {
    if (!token) {
      nav("/login");
      return;
    }
    nav("/dashboard");
  }

  return (
    <div style={{ flex: 1, paddingBottom: '4rem' }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 20px" }}>
        {/* Hero Section */}
        <div
          className="glass"
          style={{
            borderRadius: "var(--radius-lg)",
            padding: "80px 60px",
            boxShadow: "var(--shadow-lg)",
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <h1 style={{ 
            fontSize: "4rem", 
            marginBottom: "1.5rem",
            background: 'linear-gradient(to right, var(--text-primary), var(--accent-primary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.1
          }}>
            AI-Powered Eye Screening
          </h1>

          <p style={{ 
            fontSize: "1.25rem", 
            color: "var(--text-secondary)", 
            maxWidth: "700px",
            lineHeight: 1.6,
            marginBottom: '3rem'
          }}>
            Advanced Ocular Surface Disease Detection at your fingertips. 
            Upload an image and get instant insights with our state-of-the-art AI model.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: 'center' }}>
             <button
              onClick={() => nav("/register")}
              style={{
                padding: "1rem 2.5rem",
                borderRadius: "var(--radius-md)",
                background: "var(--accent-primary)",
                color: "white",
                fontWeight: 700,
                fontSize: '1.1rem',
                boxShadow: '0 10px 20px rgba(37, 99, 235, 0.2)'
              }}
            >
              Get Started Free
            </button>

            <button
              onClick={goDashboard}
              style={{
                padding: "1rem 2.5rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontWeight: 700,
                fontSize: '1.1rem'
              }}
            >
              Go to Dashboard
            </button>
          </div>

          <p style={{ marginTop: "2.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
            * This tool is for screening purposes and does not replace professional medical advice.
          </p>
        </div>

        {/* Features Grid */}
        <div
          style={{
            marginTop: "4rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          <Feature 
            title="Instant Analysis" 
            desc="Our AI processes your image in seconds to detect potential ocular surface issues." 
            icon="⚡"
          />
          <Feature 
            title="Detailed Reports" 
            desc="Receive comprehensive findings including confidence scores and severity levels." 
            icon="📄"
          />
          <Feature 
            title="Secure History" 
            desc="Track your eye health over time with our encrypted historical data storage." 
            icon="🔒"
          />
        </div>
      </div>
    </div>
  );
}

function Feature({ title, desc, icon }) {
  return (
    <div
      className="glass"
      style={{
        borderRadius: "var(--radius-lg)",
        padding: "2.5rem",
        boxShadow: "var(--shadow-md)",
        transition: 'transform var(--transition-fast)',
        cursor: 'default'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h3>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}