import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";

const STEPS = {
  EMAIL: "EMAIL",
  OTP: "OTP",
  RESET: "RESET",
  SUCCESS: "SUCCESS"
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleEmailSubmit(e) {
    if (e) e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("email", email);
      const res = await api.post("/auth/forgot_password", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      if (res.data.error) {
        setError(res.data.message);
      } else {
        setStep(STEPS.OTP);
      }
    } catch (err) {
      console.error("OTP Error:", err);
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : (Array.isArray(detail) ? detail[0]?.msg : "Failed to send code. Make sure your email is correct."));
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("email", email);
      params.append("otp", otp);
      const res = await api.post("/auth/verify_otp", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      if (res.data.error) {
        setError(res.data.message);
      } else {
        setResetToken(res.data.reset_token);
        setStep(STEPS.RESET);
      }
    } catch (err) {
      setError(err?.response?.data?.detail || "Invalid code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetSubmit(e) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("token", resetToken);
      params.append("new_password", password);
      const res = await api.post("/auth/reset_password", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      if (res.data.error) {
        setError(res.data.message);
      } else {
        setStep(STEPS.SUCCESS);
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (err) {
      setError(err?.response?.data?.detail || "Session expired. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)', padding: '2rem' }}>
      <div className="glass" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          {step === STEPS.EMAIL && "Forgot Password"}
          {step === STEPS.OTP && "Verify Identity"}
          {step === STEPS.RESET && "New Password"}
          {step === STEPS.SUCCESS && "Success!"}
        </h2>

        {error && (
          <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)', color: '#ef4444', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 500 }}>
            {error}
          </div>
        )}

        {step === STEPS.EMAIL && (
          <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Enter your email to receive a 6-digit verification code.</p>
            <div style={{ textAlign: 'left' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', marginTop: '4px', outline: 'none' }} />
            </div>
            <button type="submit" disabled={loading} style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--accent-primary)', color: 'white', fontWeight: 700 }}>
              {loading ? "Sending..." : "Get Code"}
            </button>
          </form>
        )}

        {step === STEPS.OTP && (
          <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>We sent a code to <b>{email}</b></p>
            <div style={{ textAlign: 'left' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Enter 6-digit Code</label>
              <input type="text" maxLength="6" required value={otp} onChange={(e) => setOtp(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', marginTop: '4px', textAlign: 'center', fontSize: '1.5rem', letterSpacing: '4px', outline: 'none' }} />
            </div>
            <button type="submit" disabled={loading} style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--accent-primary)', color: 'white', fontWeight: 700 }}>
              {loading ? "Verifying..." : "Verify Code"}
            </button>
            <button type="button" onClick={handleEmailSubmit} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.85rem' }}>Resend Code</button>
          </form>
        )}

        {step === STEPS.RESET && (
          <form onSubmit={handleResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>New Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', marginTop: '4px', outline: 'none' }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Confirm Password</label>
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', marginTop: '4px', outline: 'none' }} />
            </div>
            <button type="submit" disabled={loading} style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--accent-primary)', color: 'white', fontWeight: 700 }}>
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        )}

        {step === STEPS.SUCCESS && (
          <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: 'var(--radius-md)', color: '#16a34a' }}>
            <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>Password Updated!</p>
            <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Redirecting to login...</p>
          </div>
        )}

        <div style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
          <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
