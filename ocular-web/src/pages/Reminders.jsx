import { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Clock, CheckCircle2 } from 'lucide-react';

export default function Reminders() {
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('ocular_reminders');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTime, setNewTime] = useState('09:00');

  useEffect(() => {
    localStorage.setItem('ocular_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const addReminder = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    const newReminder = {
      id: Date.now(),
      name: newName,
      time: newTime,
      active: true
    };
    
    setReminders([...reminders, newReminder]);
    setNewName('');
    setShowAdd(false);
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const toggleReminder = (id) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, active: !r.active } : r
    ));
  };

  return (
    <div style={{ flex: 1, padding: "3rem 2rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <header style={{ marginBottom: "3rem", display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Treatment Reminders</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
              Stay on track with your eye drops and treatment schedule.
            </p>
          </div>
          <button 
            onClick={() => setShowAdd(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: 'var(--accent-primary)',
              color: 'white',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
            }}
          >
            <Plus size={20} />
            Add Reminder
          </button>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reminders.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem', 
              background: 'var(--bg-primary)', 
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border-color)',
              color: 'var(--text-muted)'
            }}>
              <Bell size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>No reminders set. Use the button above to add your first treatment.</p>
            </div>
          ) : (
            reminders.map((r) => (
              <div key={r.id} className="glass" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                gap: '1.5rem',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                opacity: r.active ? 1 : 0.6
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: r.active ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: r.active ? 'var(--accent-primary)' : 'var(--text-muted)'
                }}>
                  <Clock size={24} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', textDecoration: r.active ? 'none' : 'line-through' }}>{r.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Daily at {r.time}</p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    onClick={() => toggleReminder(r.id)}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      background: 'transparent',
                      border: '1px solid var(--border-color)',
                      color: r.active ? 'var(--success)' : 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    <CheckCircle2 size={20} />
                  </button>
                  <button 
                    onClick={() => deleteReminder(r.id)}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      background: 'transparent',
                      border: '1px solid var(--border-color)',
                      color: 'var(--danger)',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Reminder Modal */}
        {showAdd && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2, 6, 23, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '2rem',
            backdropFilter: 'blur(8px)'
          }}>
            <form 
              onSubmit={addReminder}
              className="glass" 
              style={{
                maxWidth: '450px',
                width: '100%',
                padding: '2rem',
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}
            >
              <h2 style={{ fontSize: '1.5rem' }}>New Reminder</h2>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Medicine Name</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Antibiotic Eye Drops"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                  autoFocus
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Daily Time</label>
                <input 
                  type="time" 
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="button"
                  onClick={() => setShowAdd(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-primary)',
                    color: 'white',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Set Reminder
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
