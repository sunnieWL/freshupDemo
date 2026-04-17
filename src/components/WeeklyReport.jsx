import { weeklyData, idealVsActual, formatHours } from '../data/mockData';

const avgScore    = Math.round(weeklyData.reduce((s, d) => s + d.score, 0) / weeklyData.length);
const avgHoursRaw = weeklyData.reduce((s, d) => s + d.hours, 0) / weeklyData.length;
const best   = weeklyData.reduce((a, b) => (a.score > b.score ? a : b));
const worst  = weeklyData.reduce((a, b) => (a.score < b.score ? a : b));
const onPlanDays = 5, totalDays = 7;
const streakDays = 5;

const DAY_LABELS = {
  จ:'จันทร์', อ:'อังคาร', พ:'พุธ', พฤ:'พฤหัสบดี', ศ:'ศุกร์', ส:'เสาร์', อา:'อาทิตย์'
};

function t2m(t) { const [h,m]=t.split(':').map(Number); return h*60+m; }
function m2t(m) {
  return `${Math.floor(m/60).toString().padStart(2,'0')}:${(m%60).toString().padStart(2,'0')}`;
}

/* ── Activity ring for avg score ── */
function ActivityRing({ score }) {
  const R=64, circ=2*Math.PI*R;
  const offset = circ*(1-score/100);
  return (
    <div style={{ position:'relative', width:160, height:160 }}>
      <svg width="160" height="160" style={{ transform:'rotate(-90deg)' }}>
        <circle cx="80" cy="80" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14"/>
        <circle cx="80" cy="80" r={R} fill="none"
          stroke="url(#ringGrad)" strokeWidth="14" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition:'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)' }}/>
        <defs>
          <linearGradient id="ringGrad" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#FF8C42"/>
            <stop offset="100%" stopColor="#A78BFA"/>
          </linearGradient>
        </defs>
      </svg>
      <div style={{
        position:'absolute', inset:0, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
      }}>
        <span style={{ color:'#fff', fontSize:38, fontWeight:800,
          fontFamily:'Inter,sans-serif', lineHeight:1, letterSpacing:-2 }}>{score}</span>
        <span style={{ color:'rgba(255,255,255,0.4)', fontSize:12, marginTop:4 }}>คะแนนเฉลี่ย</span>
        <span style={{ color:'#FF8C42', fontSize:11, fontWeight:600, marginTop:2 }}>Freshness</span>
      </div>
    </div>
  );
}

/* ── Ideal vs Actual 4-line chart with area fills ── */
function IdeaVsActualChart() {
  const W=320, H=180, PL=42, PR=8, PT=14, PB=24;
  const iW=W-PL-PR, iH=H-PT-PB;
  const all=idealVsActual.flatMap(d=>[t2m(d.idealBed),t2m(d.actualBed),t2m(d.idealWake),t2m(d.actualWake)]);
  const minY=Math.floor((Math.min(...all)-30)/30)*30;
  const maxY=Math.ceil((Math.max(...all)+30)/30)*30;
  const xOf=i=>PL+(i/(idealVsActual.length-1))*iW;
  const yOf=m=>PT+((m-minY)/(maxY-minY))*iH;
  const path=key=>idealVsActual.map((d,i)=>`${i===0?'M':'L'}${xOf(i).toFixed(1)},${yOf(t2m(d[key])).toFixed(1)}`).join(' ');
  const areaPath=(k1,k2)=>{
    const fwd=idealVsActual.map((d,i)=>`${i===0?'M':'L'}${xOf(i).toFixed(1)},${yOf(t2m(d[k1])).toFixed(1)}`).join(' ');
    const bwd=[...idealVsActual].reverse().map((d,i)=>`L${xOf(idealVsActual.length-1-i).toFixed(1)},${yOf(t2m(d[k2])).toFixed(1)}`).join(' ');
    return `${fwd} ${bwd} Z`;
  };
  const grid=[]; for(let m=Math.ceil(minY/60)*60;m<=maxY;m+=60) grid.push(m);

  return (
    <svg width={W} height={H} className="overflow-visible w-full">
      <defs>
        <linearGradient id="bedArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#A78BFA" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.03"/>
        </linearGradient>
        <linearGradient id="wakeArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#FF8C42" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#FF8C42" stopOpacity="0.03"/>
        </linearGradient>
      </defs>
      {/* Grid */}
      {grid.map(m=>(
        <g key={m}>
          <line x1={PL} y1={yOf(m).toFixed(1)} x2={W-PR} y2={yOf(m).toFixed(1)}
            stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
          <text x={PL-4} y={(yOf(m)+3.5).toFixed(1)} textAnchor="end" fontSize="9"
            fill="rgba(255,255,255,0.35)" fontFamily="Inter,sans-serif">{m2t(m)}</text>
        </g>
      ))}
      {/* Area fills between ideal and actual */}
      <path d={areaPath('idealBed','actualBed')} fill="url(#bedArea)"/>
      <path d={areaPath('idealWake','actualWake')} fill="url(#wakeArea)"/>
      {/* Lines */}
      {[
        {key:'idealBed', color:'#A78BFA', dash:'5 3', w:2.5},
        {key:'actualBed',color:'#A78BFA', dash:'', w:3},
        {key:'idealWake',color:'#FF8C42', dash:'5 3', w:2.5},
        {key:'actualWake',color:'#FF8C42',dash:'', w:3},
      ].map(l=>(
        <path key={l.key} d={path(l.key)} fill="none" stroke={l.color} strokeWidth={l.w}
          strokeDasharray={l.dash||undefined} strokeLinecap="round" strokeLinejoin="round"/>
      ))}
      {/* Dots */}
      {idealVsActual.map((d,i)=>(
        <g key={i}>
          {[
            {key:'idealBed', color:'#A78BFA', r:3},
            {key:'actualBed',color:'#A78BFA', r:5},
            {key:'idealWake',color:'#FF8C42', r:3},
            {key:'actualWake',color:'#FF8C42',r:5},
          ].map(l=>(
            <circle key={l.key}
              cx={xOf(i).toFixed(1)} cy={yOf(t2m(d[l.key])).toFixed(1)} r={l.r}
              fill={l.r>3?l.color:'transparent'} stroke={l.color} strokeWidth="2"/>
          ))}
          <text x={xOf(i).toFixed(1)} y={H-4} textAnchor="middle" fontSize="9"
            fill="rgba(255,255,255,0.4)" fontFamily="Prompt,sans-serif">{d.day}</text>
        </g>
      ))}
    </svg>
  );
}

export default function WeeklyReport() {
  return (
    <div style={{ minHeight:'100vh', paddingBottom:88,
      background:'linear-gradient(160deg,#0f0c29 0%,#1a1040 60%,#0f0c29 100%)', paddingBottom:112 }}>

      {/* Header */}
      <div style={{ padding:'40px 20px 20px' }}>
        <p style={{ color:'#A78BFA', fontSize:11, fontWeight:600, letterSpacing:2, textTransform:'uppercase' }}>สรุปประจำสัปดาห์</p>
        <h1 style={{ color:'#fff', fontSize:28, fontWeight:800, marginTop:4, letterSpacing:-0.5 }}>Weekly Report</h1>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, marginTop:4 }}>9 – 15 เมษายน 2026</p>
      </div>

      {/* ── Activity ring — big centre piece ── */}
      <div style={{ padding:'0 20px 20px', display:'flex', justifyContent:'center' }}>
        <div className="glass" style={{ borderRadius:24, padding:'28px 24px',
          display:'flex', flexDirection:'column', alignItems:'center', gap:0, width:'100%' }}>
          <ActivityRing score={avgScore}/>
        </div>
      </div>

      {/* ── 2×2 stats grid ── */}
      <div style={{ padding:'0 20px 16px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {[
          { icon:'🌙', label:'นอนเฉลี่ย',        val:formatHours(avgHoursRaw), color:'#A78BFA' },
          { icon:'⭐', label:'Score เฉลี่ย',      val:`${avgScore} คะแนน`,     color:'#FF8C42' },
          { icon:'🤩', label:'วันสดชื่นที่สุด',   val:DAY_LABELS[best.day],    color:'#34D399', sub:`${best.score} คะแนน` },
          { icon:'😴', label:'วันที่แย่ที่สุด',   val:DAY_LABELS[worst.day],   color:'#f87171', sub:`${worst.score} คะแนน` },
        ].map(s=>(
          <div key={s.label} className="glass" style={{ borderRadius:18, padding:'16px 14px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
              <span style={{ fontSize:20 }}>{s.icon}</span>
              <p style={{ color:'rgba(255,255,255,0.45)', fontSize:11 }}>{s.label}</p>
            </div>
            <p style={{ color:s.color, fontSize:16, fontWeight:800,
              fontFamily:'Inter,sans-serif', lineHeight:1.2 }}>{s.val}</p>
            {s.sub && <p style={{ color:'rgba(255,255,255,0.3)', fontSize:11, marginTop:3 }}>{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* ── Ideal vs Actual chart ── */}
      <div style={{ padding:'0 20px 16px' }}>
        <div className="glass" style={{ borderRadius:20, padding:'18px' }}>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:13, fontWeight:700, marginBottom:12 }}>
            Ideal vs Actual — เวลานอน & ตื่น
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
            {[
              {color:'#A78BFA',dash:true, label:'Ideal นอน'},
              {color:'#FF8C42',dash:true, label:'Ideal ตื่น'},
              {color:'#A78BFA',dash:false,label:'Actual นอน'},
              {color:'#FF8C42',dash:false,label:'Actual ตื่น'},
            ].map(l=>(
              <div key={l.label} style={{ display:'flex', alignItems:'center', gap:6 }}>
                <svg width="20" height="8">
                  <line x1="0" y1="4" x2="20" y2="4" stroke={l.color} strokeWidth="2.5"
                    strokeDasharray={l.dash?'4 2':undefined} strokeLinecap="round"/>
                  {!l.dash && <circle cx="10" cy="4" r="3.5" fill={l.color}/>}
                </svg>
                <span style={{ color:l.color, fontSize:10, fontWeight:500 }}>{l.label}</span>
              </div>
            ))}
          </div>
          <div style={{ overflowX:'auto' }}><IdeaVsActualChart/></div>
        </div>
      </div>

      {/* ── Plan adherence — 7 dot circles ── */}
      <div style={{ padding:'0 20px 16px' }}>
        <div className="glass" style={{ borderRadius:20, padding:'18px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <p style={{ color:'rgba(255,255,255,0.65)', fontSize:13, fontWeight:700 }}>ทำตามแผนได้</p>
            <span style={{ color:'#A78BFA', fontWeight:800, fontFamily:'Inter,sans-serif', fontSize:16 }}>
              {onPlanDays}/{totalDays} วัน
            </span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', gap:6 }}>
            {weeklyData.map((d, i) => {
              const done = i < onPlanDays;
              return (
                <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                  <div style={{
                    width:36, height:36, borderRadius:'50%',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    transition:'all 0.3s',
                    background: done ? 'linear-gradient(135deg,#A78BFA,#6366f1)' : 'transparent',
                    border: done ? 'none' : '2px solid rgba(255,255,255,0.15)',
                    boxShadow: done ? '0 4px 12px rgba(167,139,250,0.4)' : 'none',
                  }}>
                    {done && <span style={{ color:'#fff', fontSize:14, fontWeight:700 }}>✓</span>}
                  </div>
                  <span style={{ color:'rgba(255,255,255,0.4)', fontSize:9,
                    fontFamily:'Prompt,sans-serif' }}>{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Streak counter ── */}
      <div style={{ padding:'0 20px 16px' }}>
        <div style={{
          borderRadius:20, padding:'18px 20px',
          background:'linear-gradient(135deg,rgba(255,140,66,0.15),rgba(251,191,36,0.08))',
          border:'1px solid rgba(255,140,66,0.25)',
          display:'flex', alignItems:'center', justifyContent:'space-between',
        }}>
          <div>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:11, fontWeight:600,
              letterSpacing:1.5, textTransform:'uppercase', marginBottom:4 }}>Current Streak</p>
            <p style={{ color:'#fff', fontSize:28, fontWeight:800,
              fontFamily:'Inter,sans-serif', letterSpacing:-1, lineHeight:1 }}>
              {streakDays} <span style={{ fontSize:16, fontWeight:400, color:'rgba(255,255,255,0.5)' }}>วัน</span>
            </p>
            <p style={{ color:'#FF8C42', fontSize:12, marginTop:4 }}>ทำตามแผนติดต่อกัน</p>
          </div>
          <div style={{ fontSize:48, lineHeight:1 }}>🔥</div>
        </div>
      </div>

      {/* ── Insight card ── */}
      <div style={{ padding:'0 20px' }}>
        <div style={{
          borderRadius:20, padding:'18px 20px',
          background:'linear-gradient(135deg,rgba(167,139,250,0.12),rgba(99,102,241,0.06))',
          border:'1px solid rgba(167,139,250,0.2)',
          display:'flex', gap:14,
        }}>
          <span style={{ fontSize:28, lineHeight:1, flexShrink:0 }}>💡</span>
          <div>
            <p style={{ color:'#A78BFA', fontSize:13, fontWeight:700, marginBottom:6 }}>คำแนะนำสัปดาห์นี้</p>
            <p style={{ color:'rgba(255,255,255,0.55)', fontSize:13, lineHeight:1.7 }}>
              สัปดาห์นี้คุณนอนดึกกว่าแผน 2 วัน
              ลองปรับ Evening Routine ให้สม่ำเสมอกว่านี้
              และหลีกเลี่ยง Social Media หลังเที่ยงคืน
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
