import { useState } from 'react';
import { BookOpen, Shield, Zap, Heart, X, Clock, ChevronRight } from 'lucide-react';

export default function Library() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { title: "Eye Hygiene", icon: <Shield className="text-blue-500" />, count: 12, color: "var(--accent-primary)" },
    { title: "Digital Strain", icon: <Zap className="text-yellow-500" />, count: 8, color: "var(--warning)" },
    { title: "Conditions", icon: <BookOpen className="text-green-500" />, count: 15, color: "var(--success)" },
    { title: "Exercises", icon: <Clock className="text-purple-500" />, count: 5, color: "var(--accent-secondary)" },
    { title: "Nutrition", icon: <Heart className="text-red-500" />, count: 10, color: "var(--danger)" },
  ];

  const articles = [
    {
      id: 1,
      title: "The 20-20-20 Rule for Digital Eye Strain",
      excerpt: "Learn how to protect your eyes from long hours of screen time with this simple technique.",
      content: `
        Digital eye strain is a common problem in today's screen-centric world. The 20-20-20 rule is a simple yet effective way to give your eyes the break they need.
        
        ### What is the 20-20-20 Rule?
        For every **20 minutes** you spend looking at a screen, you should look at something **20 feet away** for at least **20 seconds**.
        
        ### Why does it work?
        When you look at a screen, your eye muscles are constantly working to maintain focus. Looking into the distance allows those muscles to relax, reducing fatigue and preventing headaches.
        
        ### Tips for Success:
        - Set a timer on your phone or computer.
        - Use the break to stretch or grab a glass of water.
        - Ensure your screen is at a comfortable distance (about an arm's length).
      `,
      category: "Digital Strain",
      readTime: "5 min",
      image: "/digital_strain.png"
    },
    {
      id: 2,
      title: "Best Foods for Healthy Vision",
      excerpt: "Discover the nutrients that help maintain your eye health and prevent age-related diseases.",
      content: `
        What you eat significantly impacts your eye health. Certain nutrients can help prevent conditions like macular degeneration and cataracts.
        
        ### Key Nutrients for Your Eyes:
        1. **Vitamin A & Beta-Carotene:** Essential for night vision. Found in carrots and sweet potatoes.
        2. **Omega-3 Fatty Acids:** Good for dry eyes and retinal health. Found in salmon and walnuts.
        3. **Lutein & Zeaxanthin:** Protect against blue light damage. Found in spinach and kale.
        4. **Vitamin C & E:** Antioxidants that fight cell damage. Found in citrus fruits and almonds.
        
        Maintaining a balanced diet rich in leafy greens, colorful fruits, and healthy fats is one of the best ways to protect your vision long-term.
      `,
      category: "Nutrition",
      readTime: "4 min",
      image: "/nutrition_vision.png"
    },
    {
      id: 3,
      title: "How to Safely Clean Your Eyelids",
      excerpt: "Expert tips on maintaining eyelid hygiene to prevent blepharitis and other infections.",
      content: `
        Proper eyelid hygiene is crucial for preventing irritation and infections like blepharitis or styes.
        
        ### Step-by-Step Cleaning Guide:
        - **Wash your hands:** Always start with clean hands.
        - **Warm Compress:** Apply a warm, clean washcloth to your closed eyes for 1-2 minutes to loosen debris.
        - **Gentle Cleansing:** Use a mild, preservative-free cleanser (or a 50/50 mix of baby shampoo and water) on a clean pad.
        - **Wipe Gently:** Wipe along the base of the lashes with your eyes closed.
        - **Rinse:** Rinse with cool, clean water.
        
        Avoid using harsh chemicals or rubbing your eyes vigorously, as the skin around the eyes is very delicate.
      `,
      category: "Eye Hygiene",
      readTime: "6 min",
      image: "/eyelid_hygiene.png"
    },
    {
      id: 4,
      title: "Understanding Dry Eye Syndrome",
      excerpt: "Common causes, symptoms, and the latest treatment options for persistent dry eyes.",
      content: `
        Dry eye syndrome occurs when your eyes don't produce enough tears or when the tears evaporate too quickly.
        
        ### Common Symptoms:
        - A stinging, burning, or scratchy sensation.
        - Sensitivity to light.
        - Eye redness.
        - Difficulty wearing contact lenses.
        
        ### Treatment Options:
        - **Artificial Tears:** Over-the-counter drops can provide temporary relief.
        - **Prescription Eye Drops:** Focus on reducing eyelid inflammation.
        - **Lifestyle Changes:** Using humidifiers and taking breaks from screens.
        
        If symptoms persist, consult an ophthalmologist to prevent potential damage to the cornea.
      `,
      category: "Conditions",
      readTime: "7 min",
      image: "/dry_eye.png"
    },
    {
      id: 5,
      title: "Quick Eye Exercises for the Office",
      excerpt: "Regain focus and reduce eye fatigue with these easy exercises you can do at your desk.",
      content: `
        If you work at a desk, your eyes are likely focused on a single distance for hours. These exercises help break that pattern and reduce strain.
        
        ### Simple Exercises to Try:
        1. **The Great Eye Roll:** Look up and slowly circle your eyes 10 times clockwise, then 10 times counter-clockwise.
        2. **Focus Shifting:** Hold your thumb at arm's length. Focus on it for 15 seconds, then focus on something 20 feet away for 15 seconds. Repeat 5 times.
        3. **Palming:** Rub your palms together until warm. Place them gently over your closed eyes (don't press). Breath deeply for 30 seconds.
        4. **Slow Blinking:** Blink very slowly 10 times. This helps distribute tears and lubricate the eye surface.
        
        Making these a habit can significantly improve your daily comfort and long-term vision health.
      `,
      category: "Exercises",
      readTime: "3 min",
      image: "/eye_exercises.png"
    }
  ];

  const filteredArticles = selectedCategory 
    ? articles.filter(art => art.category === selectedCategory)
    : articles;

  return (
    <div style={{ flex: 1, padding: "3rem 2rem", position: 'relative' }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <header style={{ marginBottom: "3rem", display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Educational Hub</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
              Expert-reviewed articles and tips for maintaining optimal eye health.
            </p>
          </div>
          {selectedCategory && (
            <button 
              onClick={() => setSelectedCategory(null)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Show All
            </button>
          )}
        </header>

        {/* Categories Grid */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "4rem" }}>
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className={`glass hover-lift ${selectedCategory === cat.title ? 'active-card' : ''}`}
              onClick={() => setSelectedCategory(selectedCategory === cat.title ? null : cat.title)}
              style={{
                padding: "1.5rem",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
                background: "var(--bg-primary)",
                border: selectedCategory === cat.title ? "2px solid var(--accent-primary)" : "1px solid var(--border-color)",
                cursor: "pointer",
                transition: 'all 0.2s ease',
                boxShadow: selectedCategory === cat.title ? '0 0 20px rgba(37, 99, 235, 0.1)' : 'none'
              }}
            >
              <div style={{
                width: "50px",
                height: "50px",
                borderRadius: "12px",
                background: selectedCategory === cat.title ? "var(--accent-primary)" : "rgba(59, 130, 246, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: selectedCategory === cat.title ? "white" : cat.color,
                transition: 'all 0.2s ease'
              }}>
                {cat.icon}
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>{cat.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{cat.count} Articles</p>
              </div>
            </div>
          ))}
        </section>

        {/* Latest Articles */}
        <section>
          <h2 style={{ fontSize: "1.75rem", marginBottom: "1.5rem" }}>
            {selectedCategory ? `${selectedCategory} Articles` : "Latest Articles"}
          </h2>
          {filteredArticles.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              {filteredArticles.map((art) => (
                <div 
                  key={art.id} 
                  className="glass hover-lift" 
                  onClick={() => setSelectedArticle(art)}
                  style={{
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                    cursor: "pointer"
                  }}
                >
                  <img src={art.image} alt={art.title} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                  <div style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                      <span style={{ color: "var(--accent-primary)", fontSize: "0.8rem", fontWeight: 700 }}>{art.category}</span>
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>{art.readTime}</span>
                    </div>
                    <h3 style={{ marginBottom: "1rem", fontSize: "1.25rem", lineHeight: 1.4 }}>{art.title}</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.5 }}>{art.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <BookOpen size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>No articles found for this category yet.</p>
            </div>
          )}
        </section>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
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
          <div className="glass" style={{
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'var(--bg-primary)',
            borderRadius: 'var(--radius-lg)',
            position: 'relative',
            animation: 'slideUp 0.3s ease-out'
          }}>
            <button 
              onClick={() => setSelectedArticle(null)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'var(--bg-tertiary)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={24} />
            </button>

            <img 
              src={selectedArticle.image} 
              alt={selectedArticle.title} 
              style={{ width: '100%', height: '300px', objectFit: 'cover' }}
            />

            <div style={{ padding: '3rem' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                <span style={{ 
                  background: 'rgba(59, 130, 246, 0.1)', 
                  color: 'var(--accent-primary)', 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '0.85rem', 
                  fontWeight: 700 
                }}>
                  {selectedArticle.category}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} /> {selectedArticle.readTime} read
                </span>
              </div>

              <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', lineHeight: 1.2 }}>{selectedArticle.title}</h2>
              
              <div style={{ 
                color: 'var(--text-secondary)', 
                lineHeight: 1.8, 
                fontSize: '1.1rem',
                whiteSpace: 'pre-line' 
              }}>
                {selectedArticle.content}
              </div>

              <div style={{ 
                marginTop: '3rem', 
                paddingTop: '2rem', 
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Ocular Editorial Team</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Fact-checked & reviewed</p>
                </div>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  style={{
                    padding: '12px 24px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
