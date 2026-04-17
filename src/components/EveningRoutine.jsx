import { useState, useEffect } from 'react';
import { eveningRoutineItems } from '../data/mockData';

const TARGET_BED = '01:30';
const QUOTES = [
  'คืนนี้ปิดจอเร็วขึ้น 5 นาทีนะ 🌙',
  'การนอนดีคือการลงทุนที่ดีที่สุด ✨',
  'ร่างกายที่พักผ่อนดีคือ superpower 💜',
];

function getCountdown(target) {
  const now = new Date();
  const [h, m] = target.split(':').map(Number);
  const t = new Date(now);
  t.setHours(h, m, 0, 0);
  if (t <= now) t.setDate(t.getDate() + 1);
  const diff = Math.max(0, Math.floor((t - now) / 1000));
  return { h: Math.floor(diff / 3600), m: Math.floor((diff % 3600) / 60), s: diff % 60 };
}

export default function EveningRoutine() {
  const [checked, setChecked] = useState({});
  const [cd, setCd] = useState(getCountdown(TARGET_BED));

  useEffect(() => {
    const id = setInterval(() => setCd(getCountdown(TARGET_BED)), 1000);
    return () => clearInterval(id);
  }, []);

  const toggle = (id) => setChecked(p => ({ ...p, [id]: !p[id] }));
  const done   = Object.values(checked).filter(Boolean).length;
  const total  = eveningRoutineItems.length;
  const pct    = done / total;
  const allDone= done === total;

  // Circular ring params
  const R = 44, circ = 2 * Math.PI * R;
  const offset = circ * (1 - pct);
  const quote  = QUOTES[done % QUOTES.length];

  return (
    <div style={{ minHeight:'100vh', paddingBottom:88,
      background:'linear-gradient(160deg,#0f0c29 0%,#1a1040 60%,#0f0c29 100%)', paddingBottom:112 }}>

      {/* Header + circular ring */}
      <div style={{ padding:'40px 20px 20px', display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <div>
          <p style={{ color:'#A78BFA', fontSize:11, fontWeight:600, letterSpacing:2, textTransform:'uppercase' }}>ก่อนนอน</p>
          <h1 style={{ color:'#fff', fontSize:28, fontWeight:800, marginTop:4, letterSpacing:-0.5 }}>Evening Routine</h1>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:13, marginTop:4 }}>เตรียมร่างกายก่อนนอน</p>
        </div>
        {/* Circular progress ring */}
        <div style={{ position:'relative', width:80, height:80, flexShrink:0 }}>
          <svg width="80" height="80" style={{ transform:'rotate(-90deg)' }}>
            <circle cx="40" cy="40" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7"/>
            <circle cx="40" cy="40" r={R} fill="none"
              stroke={allDone ? '#34D399' : '#A78BFA'} strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              style={{ transition:'stroke-dashoffset 0.5s ease, stroke 0.3s' }}/>
          </svg>
          <div style={{
            position:'absolute', inset:0, display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center',
          }}>
            <span style={{ color:'#fff', fontSize:18, fontWeight:800, fontFamily:'Inter,sans-serif', lineHeight:1 }}>{done}</span>
            <span style={{ color:'rgba(255,255,255,0.35)', fontSize:10 }}>/{total}</span>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div style={{ padding:'0 20px', display:'flex', flexDirection:'column', gap:10 }}>
        {eveningRoutineItems.map((item) => {
          const isDone = !!checked[item.id];
          return (
            <button key={item.id} onClick={() => toggle(item.id)}
              style={{
                display:'flex', alignItems:'center', gap:14,
                padding:'14px 16px', borderRadius:18, border:'none', cursor:'pointer',
                textAlign:'left', transition:'all 0.2s',
                background: isDone ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.05)',
                borderWidth:1, borderStyle:'solid',
                borderColor: isDone ? 'rgba(167,139,250,0.35)' : 'rgba(255,255,255,0.08)',
              }}>
              {/* Checkbox LEFT */}
              <div style={{
                width:32, height:32, borderRadius:'50%', flexShrink:0,
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all 0.25s cubic-bezier(.4,0,.2,1)',
                background: isDone ? '#34D399' : 'transparent',
                border: `2px solid ${isDone ? '#34D399' : 'rgba(255,255,255,0.25)'}`,
                boxShadow: isDone ? '0 0 14px rgba(52,211,153,0.5)' : 'none',
                transform: isDone ? 'scale(1.1)' : 'scale(1)',
              }}>
                {isDone && <span style={{ color:'#fff', fontSize:14, fontWeight:700 }}>✓</span>}
              </div>
              <span style={{ fontSize:22 }}>{item.icon}</span>
              <span style={{
                flex:1, color: isDone ? 'rgba(255,255,255,0.45)' : '#fff',
                fontSize:14, fontWeight:600,
                textDecoration: isDone ? 'line-through' : 'none',
                transition:'all 0.2s',
              }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Completion banner */}
      {allDone && (
        <div className="animate-fadeIn" style={{ margin:'16px 20px 0' }}>
          <div style={{
            borderRadius:20, padding:'20px', textAlign:'center',
            background:'linear-gradient(135deg,rgba(52,211,153,0.15),rgba(16,185,129,0.1))',
            border:'1px solid rgba(52,211,153,0.3)',
          }}>
            <div style={{ fontSize:36 }}>🌟</div>
            <p style={{ color:'#34D399', fontWeight:700, fontSize:15, marginTop:8 }}>ยอดเยี่ยม! พร้อมสำหรับการนอนหลับที่ดี</p>
          </div>
        </div>
      )}

      {/* Countdown card */}
      <div style={{ padding:'16px 20px 0' }}>
        <div style={{
          borderRadius:24, padding:'20px',
          background:'linear-gradient(135deg,rgba(167,139,250,0.15),rgba(99,102,241,0.1))',
          border:'1px solid rgba(167,139,250,0.25)',
        }}>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:11, fontWeight:600, letterSpacing:1.5, textTransform:'uppercase', marginBottom:10 }}>
            เวลาเข้านอนแนะนำคืนนี้
          </p>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <p style={{ color:'#fff', fontSize:32, fontWeight:800, fontFamily:'Inter,sans-serif', letterSpacing:-1, lineHeight:1 }}>
                {TARGET_BED}
                <span style={{ fontSize:16, color:'rgba(255,255,255,0.4)', fontWeight:400, marginLeft:4 }}>น.</span>
              </p>
              <p style={{ color:'#A78BFA', fontSize:13, marginTop:6 }}>
                อีก{cd.h > 0 ? ` ${cd.h} ชม.` : ''} {cd.m} นาที {cd.s} วินาที
              </p>
            </div>
            <div style={{
              width:56, height:56, borderRadius:'50%',
              background:'rgba(167,139,250,0.2)',
              border:'2px solid rgba(167,139,250,0.4)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:24,
            }}>🌙</div>
          </div>
          <div style={{
            marginTop:14, height:4, borderRadius:99,
            background:'rgba(255,255,255,0.08)',
          }}>
            <div style={{
              height:'100%', borderRadius:99,
              background:'linear-gradient(90deg,#A78BFA,#818cf8)',
              width:`${pct*100}%`,
              transition:'width 0.5s ease',
            }}/>
          </div>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:11, marginTop:6, textAlign:'right' }}>
            Routine {Math.round(pct*100)}% พร้อม
          </p>
        </div>
      </div>

      {/* Motivational quote */}
      <div style={{ padding:'12px 20px 0' }}>
        <div style={{
          borderRadius:16, padding:'14px 18px',
          background:'rgba(255,255,255,0.04)',
          border:'1px solid rgba(255,255,255,0.07)',
          textAlign:'center',
        }}>
          <p style={{ color:'rgba(255,255,255,0.55)', fontSize:13, fontStyle:'italic', lineHeight:1.6 }}>
            "{quote}"
          </p>
        </div>
      </div>
    </div>
  );
}
