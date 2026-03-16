import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Search } from 'lucide-react';

export default function History() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  async function load() {
    try {
      setLoading(true);
      const res = await api.get("/history");
      setRows(res.data || []);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.detail || "Failed to load history");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredRows = useMemo(() => {
    return rows.filter(r => {
      const matchDisease = (r.disease || "Unknown").toLowerCase().includes(searchTerm.toLowerCase());
      const dateStr = r.created_at ? new Date(r.created_at).toLocaleDateString() : "";
      const matchDate = dateStr.includes(searchTerm);
      return matchDisease || matchDate;
    });
  }, [rows, searchTerm]);

  const chartData = useMemo(() => {
    const sevCount = { High: 0, Medium: 0, Low: 0, Unknown: 0 };
    filteredRows.forEach(r => {
      sevCount[r.severity || "Unknown"] = (sevCount[r.severity || "Unknown"] || 0) + 1;
    });
    return [
      { name: 'High', count: sevCount.High, color: '#ef4444' },
      { name: 'Medium', count: sevCount.Medium, color: '#f59e0b' },
      { name: 'Low', count: sevCount.Low, color: '#10b981' }
    ].filter(d => d.count > 0);
  }, [filteredRows]);

  function getSeverityStyles(severity) {
    if (severity === "High") return { color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" };
    if (severity === "Medium") return { color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" };
    if (severity === "Low") return { color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" };
    return { color: "var(--text-secondary)", bg: "var(--bg-tertiary)" };
  }

  return (
    <div style={{ flex: 1, padding: "3rem 2rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Scan History</h1>
            <p style={{ color: "var(--text-secondary)" }}>Review your previous eye screening results.</p>
          </div>
          <button
            onClick={load}
            style={{
              padding: "10px 20px",
              borderRadius: "var(--radius-md)",
              background: "var(--bg-tertiary)",
              color: "var(--text-primary)",
              fontWeight: 600,
              border: '1px solid var(--border-color)'
            }}
          >
            Refresh
          </button>
        </div>

        {!loading && rows.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 2fr', gap: '2rem', marginBottom: '2rem' }}>
            <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Severity Overview</h3>
              <div style={{ height: '200px' }}>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                      <XAxis dataKey="name" tick={{fill: 'var(--text-secondary)', fontSize: 12}} axisLine={false} tickLine={false} />
                      <YAxis allowDecimals={false} tick={{fill: 'var(--text-secondary)', fontSize: 12}} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
                        itemStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    No data
                  </div>
                )}
              </div>
            </div>

            <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column' }}>
               <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Filter Records</h3>
               <div style={{ position: 'relative', marginTop: 'auto', marginBottom: 'auto' }}>
                 <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                 <input 
                   type="text" 
                   placeholder="Search by disease or date (e.g. Cataract, 10/24)..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   style={{
                     width: '100%',
                     padding: '16px 16px 16px 48px',
                     borderRadius: 'var(--radius-md)',
                     border: '1px solid var(--border-color)',
                     background: 'var(--bg-primary)',
                     color: 'var(--text-primary)',
                     fontSize: '1rem',
                     outline: 'none'
                   }}
                 />
               </div>
            </div>
          </div>
        )}

        <div
          className="glass"
          style={{
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            boxShadow: "var(--shadow-md)",
            overflowX: 'auto'
          }}
        >
          {loading ? (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {[1, 2, 3, 4, 5].map(i => (
                 <div key={i} className="skeleton" style={{ height: '80px', width: '100%', borderRadius: 'var(--radius-md)' }}></div>
               ))}
             </div>
          ) : rows.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>No scans found yet.</p>
            </div>
          ) : filteredRows.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>No matches found for "{searchTerm}".</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: '0 12px' }}>
              <thead>
                <tr style={{ textAlign: "left" }}>
                  <th style={{ padding: "0 1.5rem", color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Image</th>
                  <th style={{ padding: "0 1.5rem", color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Date</th>
                  <th style={{ padding: "0 1.5rem", color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Disease</th>
                  <th style={{ padding: "0 1.5rem", color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Confidence</th>
                  <th style={{ padding: "0 1.5rem", color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Severity</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((r) => (
                  <tr 
                    key={r.id} 
                    onClick={() => navigate("/result", {
                      state: {
                        image: r.image_path ? `${api.defaults.baseURL}${r.image_path}` : null,
                        disease: r.disease || "Unknown",
                        confidence: r.confidence != null ? `${r.confidence}%` : "N/A",
                        severity: r.severity || "Unknown"
                      }
                    })}
                    style={{ 
                      background: 'var(--bg-primary)', 
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                      e.currentTarget.style.background = 'var(--bg-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.background = 'var(--bg-primary)';
                    }}
                  >
                    <td style={{ padding: "1rem 1.5rem", borderRadius: 'var(--radius-md) 0 0 var(--radius-md)' }}>
                      {r.image_path ? (
                        <img
                          src={`${api.defaults.baseURL}${r.image_path}`}
                          alt="scan"
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: "var(--radius-sm)",
                            background: "var(--bg-tertiary)",
                          }}
                        />
                      ) : (
                        <div style={{ width: 60, height: 60, borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          🚫
                        </div>
                      )}
                    </td>

                    <td style={{ padding: "1rem 1.5rem", fontWeight: 500, fontSize: '0.9rem' }}>
                      {r.created_at ? new Date(r.created_at).toLocaleDateString() : "N/A"}
                    </td>

                    <td style={{ padding: "1rem 1.5rem", fontWeight: 700, fontSize: '1rem' }}>
                      {r.disease || "Unknown"}
                    </td>

                    <td style={{ padding: "1rem 1.5rem", color: 'var(--accent-primary)', fontWeight: 700 }}>
                      {r.confidence != null ? `${r.confidence}%` : "N/A"}
                    </td>

                    <td style={{ padding: "1rem 1.5rem", borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
                      <span
                        style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          background: getSeverityStyles(r.severity).bg,
                          color: getSeverityStyles(r.severity).color,
                          fontWeight: 700,
                          fontSize: '0.8rem'
                        }}
                      >
                        {r.severity || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}