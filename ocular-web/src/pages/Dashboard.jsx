import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { UploadCloud, FileImage } from "lucide-react";

export default function Dashboard() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const navigate = useNavigate();

  function processFile(f) {
    if (!f) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(f.type)) {
      alert("Only JPG and PNG images are allowed");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (f.size > maxSize) {
      alert("Image size must be less than 5MB");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  function handleImageChange(e) {
    processFile(e.target.files?.[0]);
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    processFile(f);
  };

  async function handleAnalyze() {
    if (!file) {
      alert("Please upload an image first");
      return;
    }

    try {
      setLoading(true);

      const form = new FormData();
      form.append("file", file);

      const res = await api.post("/predict", form);

      const disease = res?.data?.disease ?? "Unknown";
      const confidencePercent = res?.data?.confidence_percent ?? null;
      const severity = res?.data?.severity ?? "Unknown";
      const imagePath = res?.data?.image_path ?? null;
      const historyId = res?.data?.history_id ?? null;

      // Simulate a small delay for the scanning animation effect
      await new Promise(r => setTimeout(r, 2000));

      navigate("/result", {
        state: {
          image: previewUrl,
          disease,
          confidence: confidencePercent !== null ? `${confidencePercent}%` : "N/A",
          severity,
          imagePath,
          historyId,
        },
      });
    } catch (err) {
      console.error(err);
      const errorData = err?.response?.data;
      let errorMsg = "Prediction failed";
      
      if (errorData) {
        if (typeof errorData.detail === "string") {
          errorMsg = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          errorMsg = errorData.detail.map(d => d.msg || JSON.stringify(d)).join(", ");
        } else if (typeof errorData.detail === "object") {
          errorMsg = JSON.stringify(errorData.detail);
        }
      }
      
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ flex: 1, padding: "3rem 2rem" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>AI Screening</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: '2.5rem' }}>
          Upload a clear image of the eye for automated disease detection.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "2rem" }}>
          <div
            className={`glass hover-lift ${isDragging ? "drop-zone-active" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              borderRadius: "var(--radius-lg)",
              padding: "2.5rem",
              textAlign: "center",
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              border: isDragging ? '2px solid var(--accent-primary)' : '2px dashed var(--border-color)',
              background: 'transparent',
              transition: 'all 0.3s ease'
            }}
          >
            <UploadCloud size={64} color="var(--accent-primary)" style={{ opacity: isDragging ? 1 : 0.7, marginBottom: '1rem', alignSelf: 'center', transition: 'all 0.3s ease' }} />
            <h3 style={{ marginBottom: '0.5rem', color: isDragging ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{isDragging ? "Drop your image here" : "Select an eye image"}</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: '2rem' }}>
              Drag & Drop or Click to browse (JPG, PNG)
            </p>

            <label style={{
              padding: '12px 24px',
              background: 'var(--accent-primary)',
              borderRadius: 'var(--radius-md)',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-block',
              transition: 'background 0.2s',
              alignSelf: 'center',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
            }}>
              Browse Files
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </label>

            {file && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: "1.5rem", padding: '8px 16px', background: 'var(--bg-tertiary)', borderRadius: '20px', alignSelf: 'center' }}>
                <FileImage size={16} color="var(--accent-primary)" />
                <span style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 500, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file.name}
                </span>
              </div>
            )}
          </div>

          <div
            className="glass hover-lift"
            style={{
              borderRadius: "var(--radius-lg)",
              padding: "2rem",
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              boxShadow: 'var(--shadow-md)',
              position: 'relative'
            }}
          >
            <h3 style={{ fontSize: '1.1rem' }}>Preview & Analysis</h3>

            <div
              className={`scanning-container ${loading ? "is-scanning" : ""}`}
              style={{
                width: "100%",
                height: "300px",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                position: 'relative'
              }}
            >
              {loading && <div className="scan-line"></div>}
              {loading && <div className="scan-grid"></div>}
              
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: loading ? "brightness(0.6) contrast(1.2)" : "none",
                    transition: 'filter 0.5s ease',
                    position: 'relative',
                    zIndex: 1
                  }}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)' }}>
                  <FileImage size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                  <span style={{ fontSize: '0.9rem' }}>Image preview will appear here</span>
                </div>
              )}

              {loading && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(2, 6, 23, 0.4)',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '1.5rem',
                  letterSpacing: '2px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 0 20px rgba(59,130,246,0.8)',
                  zIndex: 20
                }}>
                  ANALYZING 
                  <span style={{ marginLeft: '4px', animation: 'pulse-grid 1s infinite' }}>...</span>
                </div>
              )}
            </div>

            <button
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "var(--radius-md)",
                background: loading ? "var(--text-muted)" : "var(--accent-primary)",
                color: "white",
                fontWeight: 700,
                fontSize: '1rem',
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
              }}
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? "Processing..." : "Start AI Analysis"}
            </button>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Results are generated instantly using our advanced ML model.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}