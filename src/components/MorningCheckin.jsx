import { useState } from 'react';
import { emojiLevels, weeklyData, morningRoutineItems, formatHours } from '../data/mockData';

const todaySleep = { bedtime: '01:30', wakeTime: '07:00', hours: 5.5, cycles: 3 };

/* ── Area chart ── */
function AreaChart() {
  const W=320, H=110, PL=28, PR=8, PT=10, PB=20;
  const iW=W-PL-PR, iH=H-PT-PB;
  const scores=weeklyData.map(d=>d.score);
  const xOf=i=>PL+(i/(scores.length-1))*iW;
  const yOf=s=>PT+((100-s)/100)*iH;
  const line=scores.map((s,i)=>`${i===0?'M':'L'}${xOf(i).toFixed(1)},${yOf(s).toFixed(1)}`).join(' ');
  const area=`${line} L${xOf(scores.length-1).toFixed(1)},${H-PB} L${PL},${H-PB} Z`;
  return (
    <svg width={W} height={H} className="overflow-visible w-full">
      <defs>
        <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#A78BFA" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.02"/>
        </linearGradient>
        <linearGradient id="ml" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#A78BFA"/>
          <stop offset="100%" stopColor="#FF8C42"/>
        </linearGradient>
      </defs>
      {[0,50,100].map(s=>(
        <line key={s} x1={PL} y1={yOf(s).toFixed(1)} x2={W-PR} y2={yOf(s).toFixed(1)}
          stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
      ))}
      <path d={area} fill="url(#mg)"/>
      <path d={line} fill="none" stroke="url(#ml)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {weeklyData.map((d,i)=>(
        <g key={i}>
          <circle cx={xOf(i).toFixed(1)} cy={yOf(d.score).toFixed(1)} r="4"
            fill={d.score>=80?'#FF8C42':'#A78BFA'} stroke="#0f0c29" strokeWidth="2"/>
          <text x={xOf(i).toFixed(1)} y={H-4} textAnchor="middle" fontSize="9"
            fill="rgba(255,255,255,0.4)" fontFamily="Prompt,sans-serif">{d.day}</text>
        </g>
      ))}
    </svg>
  );
}

export default function MorningCheckin() {
  const [selected, setSelected]     = useState(null);
  const [routineDone, setRoutineDone] = useState({});

  const sel      = selected !== null ? emojiLevels[selected] : null;
  const togRoutine = i => setRoutineDone(p=>({...p,[i]:!p[i]}));

  return (
    <div style={{ minHeight:'100vh', paddingBottom:88,
      background:'linear-gradient(160deg,#1a0a00 0%,#2d1200 40%,#0f0c29 100%)', paddingBottom:112 }}>

      {/* Header */}
      <div style={{ padding:'40px 20px 20px' }}>
        <p style={{ color:'#FF8C42', fontSize:11, fontWeight:600, letterSpacing:2, textTransform:'uppercase' }}>ตอนเช้า</p>
        <h1 style={{ color:'#fff', fontSize:28, fontWeight:800, marginTop:4, letterSpacing:-0.5 }}>Morning Check-in</h1>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:13, marginTop:4 }}>วันนี้คุณตื่นมารู้สึกอย่างไร?</p>
      </div>

      {/* Emoji — 5 big circles */}
      <div style={{ padding:'0 20px 20px', display:'flex', gap:10, justifyContent:'space-between' }}>
        {emojiLevels.map((lv, i) => {
          const on = selected === i;
          return (
            <button key={i} onClick={() => setSelected(i)}
              style={{
                flex:1, display:'flex', flexDirection:'column', alignItems:'center',
                gap:8, padding:'12px 4px', borderRadius:20, border:'none', cursor:'pointer',
                transition:'all 0.2s cubic-bezier(.4,0,.2,1)',
                background: on ? `${lv.color}22` : 'rgba(255,255,255,0.05)',
                outline: on ? `2px solid ${lv.color}` : '2px solid transparent',
                transform: on ? 'scale(1.08)' : 'scale(1)',
                boxShadow: on ? `0 4px 20px ${lv.color}40` : 'none',
              }}>
              <span style={{ fontSize:30, lineHeight:1 }}>{lv.emoji}</span>
              <span style={{ fontSize:9, fontWeight:600, color: on ? lv.color : 'rgba(255,255,255,0.4)',
                textAlign:'center', lineHeight:1.3 }}>{lv.label}</span>
            </button>
          );
        })}
      </div>

      {/* Result card — score + sleep summary combined */}
      {sel && (
        <div className="animate-scaleIn" style={{ padding:'0 20px 20px' }}>
          <div style={{
            borderRadius:24, padding:'20px',
            background:`linear-gradient(135deg,${sel.color}15,${sel.color}05)`,
            border:`1px solid ${sel.color}30`,
          }}>
            {/* Score row */}
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
              <div style={{ position:'relative', width:72, height:72, flexShrink:0 }}>
                <svg width="72" height="72" style={{ transform:'rotate(-90deg)' }}>
                  <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6"/>
                  <circle cx="36" cy="36" r="30" fill="none" stroke={sel.color} strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${(sel.score/100)*188.5} 188.5`}
                    style={{ transition:'stroke-dasharray 0.7s ease' }}/>
                </svg>
                <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'center' }}>
                  <span style={{ color:'#fff', fontSize:18, fontWeight:800, fontFamily:'Inter,sans-serif', lineHeight:1 }}>{sel.score}</span>
                </div>
              </div>
              <div>
                <p style={{ color:'#fff', fontSize:20, fontWeight:700 }}>{sel.label}</p>
                <p style={{ color:'rgba(255,255,255,0.4)', fontSize:12, marginTop:2 }}>Freshness Score วันนี้</p>
                <div style={{
                  marginTop:8, display:'inline-block', padding:'4px 12px',
                  borderRadius:50, fontSize:12, fontWeight:600,
                  background:`${sel.color}25`, color:sel.color,
                }}>
                  {sel.score>=80?'สดชื่นดีมาก 🌟':sel.score>=60?'โอเคนะ 👍':sel.score>=40?'พอได้ 😐':'ต้องปรับปรุง 💤'}
                </div>
              </div>
            </div>
            {/* Sleep summary inline */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:8 }}>
              {[
                { icon:'🌙', label:'นอน',        val:todaySleep.bedtime },
                { icon:'☀️', label:'ตื่น',        val:todaySleep.wakeTime },
                { icon:'🔄', label:'Cycles',      val:`${todaySleep.cycles}×` },
                { icon:'⏱️', label:'รวม',         val:formatHours(todaySleep.hours) },
              ].map(s => (
                <div key={s.label} style={{
                  borderRadius:12, padding:'10px 6px', textAlign:'center',
                  background:'rgba(255,255,255,0.06)',
                }}>
                  <span style={{ fontSize:16 }}>{s.icon}</span>
                  <p style={{ color:'#fff', fontSize:13, fontWeight:700,
                    fontFamily:'Inter,sans-serif', marginTop:4, lineHeight:1 }}>{s.val}</p>
                  <p style={{ color:'rgba(255,255,255,0.35)', fontSize:9, marginTop:3 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7-day area chart */}
      <div style={{ padding:'0 20px 20px' }}>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:11, fontWeight:600,
          letterSpacing:1.5, textTransform:'uppercase', marginBottom:12 }}>Freshness Score 7 วัน</p>
        <div className="glass" style={{ borderRadius:20, padding:'16px' }}>
          <div style={{ overflowX:'auto' }}><AreaChart/></div>
        </div>
      </div>

      {/* Morning routine — gradient cards */}
      <div style={{ padding:'0 20px' }}>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:11, fontWeight:600,
          letterSpacing:1.5, textTransform:'uppercase', marginBottom:12 }}>Morning Routine</p>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {morningRoutineItems.map((r, i) => {
            const done = !!routineDone[i];
            return (
              <button key={i} onClick={() => togRoutine(i)}
                style={{
                  display:'flex', alignItems:'center', gap:14,
                  padding:'14px 16px', borderRadius:18, border:'none', cursor:'pointer',
                  textAlign:'left', transition:'all 0.2s',
                  background: done
                    ? 'linear-gradient(135deg,rgba(255,140,66,0.2),rgba(251,191,36,0.1))'
                    : 'linear-gradient(135deg,rgba(255,140,66,0.08),rgba(251,191,36,0.04))',
                  borderWidth:1, borderStyle:'solid',
                  borderColor: done ? 'rgba(255,140,66,0.4)' : 'rgba(255,140,66,0.15)',
                }}>
                <div style={{
                  width:32, height:32, borderRadius:'50%', flexShrink:0,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  background: done ? '#FF8C42' : 'transparent',
                  border: `2px solid ${done ? '#FF8C42' : 'rgba(255,140,66,0.4)'}`,
                  transition:'all 0.2s',
                  boxShadow: done ? '0 0 12px rgba(255,140,66,0.5)' : 'none',
                }}>
                  {done && <span style={{ color:'#fff', fontSize:13, fontWeight:700 }}>✓</span>}
                </div>
                <span style={{ fontSize:22 }}>{r.icon}</span>
                <div style={{ flex:1 }}>
                  <p style={{ color: done ? 'rgba(255,255,255,0.45)' : '#fff',
                    fontSize:14, fontWeight:600,
                    textDecoration: done ? 'line-through' : 'none' }}>{r.label}</p>
                  <p style={{ color:'rgba(255,255,255,0.35)', fontSize:11, marginTop:2 }}>{r.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
