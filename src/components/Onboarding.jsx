import { useState } from 'react';

const slides = [
  {
    icon: '🔄',
    title: 'ปรับ Sleep Schedule',
    subtitle: 'แบบ Gradual',
    desc: 'ค่อยๆ เลื่อนเวลานอนวันละ 5 นาที จนถึงเป้าหมาย ไม่กระทบวงจรการนอน',
    accent: '#A78BFA',
  },
  {
    icon: '✅',
    title: 'Evening Routine',
    subtitle: 'Checklist',
    desc: 'เตรียมร่างกายและจิตใจก่อนนอนอย่างมีระบบ เพื่อการหลับที่ดีขึ้น',
    accent: '#FF8C42',
  },
  {
    icon: '📊',
    title: 'ติดตาม Freshness',
    subtitle: 'Score รายสัปดาห์',
    desc: 'วัดความสดชื่นตอนเช้า วิเคราะห์แนวโน้ม พัฒนาคุณภาพการนอนอย่างต่อเนื่อง',
    accent: '#34D399',
  },
];

export default function Onboarding({ onStart }) {
  const [slide, setSlide] = useState(0);

  const next = () => setSlide((s) => Math.min(s + 1, slides.length - 1));
  const prev = () => setSlide((s) => Math.max(s - 1, 0));

  const cur = slides[slide];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '48px 24px 40px',
      background: 'linear-gradient(160deg,#0f0c29 0%,#302b63 55%,#24243e 100%)',
    }}>
      {/* Brand */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
          <div style={{
            width: 96, height: 96, borderRadius: '50%',
            background: 'linear-gradient(135deg,#6366f1,#7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 40,
            boxShadow: '0 0 48px rgba(99,102,241,0.45)',
          }}>🌙</div>
          <div style={{
            position: 'absolute', bottom: -4, right: -4,
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg,#FF8C42,#fbbf24)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, boxShadow: '0 4px 12px rgba(255,140,66,0.5)',
          }}>☀️</div>
        </div>
        <h1 style={{ color: '#fff', fontSize: 40, fontWeight: 800, letterSpacing: -1, lineHeight: 1 }}>
          Fresh<span style={{ color: '#FF8C42' }}>Up</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 6, letterSpacing: 1 }}>
          ตื่นมาสดชื่นทุกเช้า
        </p>
      </div>

      {/* Carousel */}
      <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <div
          key={slide}
          className="animate-scaleIn"
          style={{
            width: '100%',
            borderRadius: 24,
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.09)',
            padding: '32px 24px',
            textAlign: 'center',
          }}
        >
          <div style={{
            width: 72, height: 72, borderRadius: 20, margin: '0 auto 20px',
            background: `${cur.accent}20`,
            border: `1px solid ${cur.accent}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32,
          }}>{cur.icon}</div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 4 }}>
            {cur.subtitle}
          </p>
          <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
            {cur.title}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.7 }}>
            {cur.desc}
          </p>
        </div>

        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              style={{
                width: i === slide ? 24 : 8,
                height: 8, borderRadius: 99,
                background: i === slide ? '#FF8C42' : 'rgba(255,255,255,0.2)',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Prev / Next */}
        {slide < slides.length - 1 && (
          <button
            onClick={next}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 50, padding: '12px 32px',
              color: 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer',
            }}
          >
            ถัดไป →
          </button>
        )}
      </div>

      {/* CTA — only on last slide */}
      <button
        onClick={onStart}
        style={{ visibility: slide === slides.length - 1 ? 'visible' : 'hidden' }}
        style={{
          width: '100%',
          padding: '18px 0',
          borderRadius: 50,
          border: 'none',
          background: 'linear-gradient(90deg,#FF8C42,#fbbf24)',
          color: '#fff',
          fontSize: 17,
          fontWeight: 700,
          fontFamily: 'Prompt, sans-serif',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(255,140,66,0.45)',
          letterSpacing: 0.5,
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseOver={e => { e.currentTarget.style.transform='scale(1.02)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(255,140,66,0.6)'; }}
        onMouseOut={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='0 8px 32px rgba(255,140,66,0.45)'; }}
      >
        เริ่มต้นใช้งาน →
      </button>
    </div>
  );
}
