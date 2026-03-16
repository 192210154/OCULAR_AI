import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { DownloadCloud, Mail } from "lucide-react";
export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const image = location.state?.image || null;
  const disease = location.state?.disease || "Unknown";
  const confidence = location.state?.confidence || "N/A";
  const severity = location.state?.severity || "Unknown";

  const severityStyles =
    severity === "High"
      ? { color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" }
      : severity === "Medium"
      ? { color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" }
      : severity === "Low"
      ? { color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" }
      : { color: "var(--text-secondary)", bg: "var(--bg-tertiary)" };

  const handleDownloadPDF = async () => {
    const element = document.getElementById("report-content");
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const data = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgProperties = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

      pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Ocular_Diagnostic_Report_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("PDF Generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handleShareEmail = () => {
    const subject = `Ocular Diagnostic Report - ${disease}`;
    const body = `Hello Dr.,\n\nI am sharing my Ocular Surface AI screening report:\n\nDisease: ${disease}\nConfidence: ${confidence}\nSeverity: ${severity}\n\nPlease let me know your thoughts.\n\nThank you.`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div style={{ flex: 1, padding: "3rem 2rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Analysis Result</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "3rem" }}>
          AI screening report based on the provided eye image.
        </p>

        <div id="report-content" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2.5rem", padding: "1rem", background: "var(--bg-primary)", borderRadius: "var(--radius-lg)" }}>
          <div
            className="glass"
            style={{
              borderRadius: "var(--radius-lg)",
              padding: "2rem",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <h3 style={{ marginBottom: "1.5rem" }}>Uploaded Image</h3>
            <div style={{
              width: "100%",
              height: "450px",
              borderRadius: "var(--radius-md)",
              background: "var(--bg-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: 'hidden',
              border: '1px solid var(--border-color)'
            }}>
              {image ? (
                <img
                  src={image}
                  alt="uploaded"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                   <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>⚠️</span>
                   <p style={{ color: 'var(--text-muted)' }}>No image data found.</p>
                </div>
              )}
            </div>
          </div>

          <div
            className="glass"
            style={{
              borderRadius: "var(--radius-lg)",
              padding: "2.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div>
              <h3 style={{ marginBottom: "1.5rem", fontSize: '1.25rem' }}>AI Findings</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Predicted Disease</span>
                  <p style={{ fontWeight: 700, fontSize: '1.25rem', textTransform: 'capitalize' }}>{disease}</p>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Confidence Score</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{confidence}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Severity Level</span>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    background: severityStyles.bg, 
                    color: severityStyles.color,
                    fontWeight: 700,
                    fontSize: '0.9rem'
                  }}>
                    {severity}
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "auto",
                padding: "1.5rem",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-color)",
                color: "var(--text-secondary)",
                fontSize: '0.85rem',
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>Medical Disclaimer:</strong>
              This screening tool uses machine learning to identify patterns and does not replace professional clinical diagnosis. Always seek the advice of your physician or other qualified health provider.
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button
                style={{
                  flex: 1,
                  padding: "16px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--accent-primary)",
                  color: "white",
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onClick={handleDownloadPDF}
              >
                <DownloadCloud size={20} />
                Download PDF
              </button>

              <button
                style={{
                  flex: 1,
                  padding: "16px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  fontWeight: 700,
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onClick={handleShareEmail}
              >
                <Mail size={20} />
                Share Report
              </button>

              <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
                <button
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    border: '1px solid var(--border-color)',
                  }}
                  onClick={() => navigate("/dashboard")}
                >
                  New Scan
                </button>

                <button
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    border: '1px solid var(--border-color)',
                  }}
                  onClick={() => navigate("/history")}
                >
                  View History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}