import { useState, useMemo } from 'react';
import { sleepHistory, formatHours } from '../data/mockData';

/* ── helpers ── */
function t2m(t) { const [h,m]=t.split(':').map(Number); return h*60+m; }
function m2t(m) {
  const tot=((m%1440)+1440)%1440;
  return `${Math.floor(tot/60).toString().padStart(2,'0')}:${(tot%60).toString().padStart(2,'0')}`;
}
function calcCycles(bed,wake) {
  let d=wake-bed; if(d<0)d+=1440; return Math.max(1,Math.floor(d/90));
}
function polar(cx,cy,r,angleDeg) {
  const a=(angleDeg-90)*Math.PI/180;
  return [cx+r*Math.cos(a), cy+r*Math.sin(a)];
}
function timeToAngle(t) { return (t2m(t)/1440)*360; }

/* ── Arc SVG ── */
function SleepArcViz({ bedtime, wakeTime }) {
  const S=200, cx=100, cy=100, R=75, rInner=58;
  const bedA  = timeToAngle(bedtime);
  const wakeA = timeToAngle(wakeTime);

  // Arc from bedA → wakeA going forward (next morning)
  let span = wakeA - bedA; if(span<=0) span+=360;
  const large = span>180?1:0;

  const [bx,by]   = polar(cx,cy,R,bedA);
  const [wx,wy]   = polar(cx,cy,R,bedA+span);
  const [bxi,byi] = polar(cx,cy,rInner,bedA);
  const [wxi,wyi] = polar(cx,cy,rInner,bedA+span);

  // Duration
  const bedM  = t2m(bedtime);
  const wakeM = t2m(wakeTime);
  let durM    = wakeM - bedM; if(durM<0) durM+=1440;
  const durH  = Math.floor(durM/60);
  const durMn = durM%60;
  const cycles= calcCycles(bedM, wakeM);

  // Hour ticks (every 3h)
  const ticks = [0,3,6,9,12,15,18,21].map(h=>{
    const a=(h/24)*360;
    const [x1,y1]=polar(cx,cy,R+6,a);
    const [x2,y2]=polar(cx,cy,R+12,a);
    return {x1,y1,x2,y2,h};
  });

  return (
    <svg viewBox={`0 0 ${S} ${S}`} width={S} height={S}>
      {/* Outer dim ring */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={R-rInner}/>

      {/* Sleep arc */}
      <path
        d={`M ${bx.toFixed(1)} ${by.toFixed(1)}
            A ${R} ${R} 0 ${large} 1 ${wx.toFixed(1)} ${wy.toFixed(1)}
            L ${wxi.toFixed(1)} ${wyi.toFixed(1)}
            A ${rInner} ${rInner} 0 ${large} 0 ${bxi.toFixed(1)} ${byi.toFixed(1)} Z`}
        fill="rgba(167,139,250,0.35)"
        stroke="none"
      />
      <path
        d={`M ${bx.toFixed(1)} ${by.toFixed(1)} A ${R} ${R} 0 ${large} 1 ${wx.toFixed(1)} ${wy.toFixed(1)}`}
        fill="none" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round"
      />

      {/* Hour ticks */}
      {ticks.map(t=>(
        <line key={t.h} x1={t.x1.toFixed(1)} y1={t.y1.toFixed(1)}
          x2={t.x2.toFixed(1)} y2={t.y2.toFixed(1)}
          stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
      ))}

      {/* Bedtime dot + label */}
      <circle cx={bx.toFixed(1)} cy={by.toFixed(1)} r="5" fill="#A78BFA"/>
      {/* Wake dot */}
      <circle cx={wx.toFixed(1)} cy={wy.toFixed(1)} r="5" fill="#FF8C42"/>

      {/* Center text */}
      <text x={cx} y={cy-14} textAnchor="middle" fontSize="22" fontWeight="800"
        fill="white" fontFamily="Inter,sans-serif">
        {durH}:{durMn.toString().padStart(2,'0')}
      </text>
      <text x={cx} y={cy+4} textAnchor="middle" fontSize="10"
        fill="rgba(255,255,255,0.45)" fontFamily="Prompt,sans-serif">ชั่วโมงนอน</text>
      <text x={cx} y={cy+20} textAnchor="middle" fontSize="11" fontWeight="600"
        fill="#FF8C42" fontFamily="Inter,sans-serif">{cycles} cycles</text>

      {/* Time labels */}
      {(() => {
        const lblR=R+22;
        const [blx,bly]=polar(cx,cy,lblR,bedA);
        const [wlx,wly]=polar(cx,cy,lblR,bedA+span);
        return (
          <>
            <text x={blx.toFixed(1)} y={(bly+4).toFixed(1)} textAnchor="middle"
              fontSize="9" fill="#A78BFA" fontFamily="Inter,sans-serif" fontWeight="600">
              {bedtime}
            </text>
            <text x={wlx.toFixed(1)} y={(wly+4).toFixed(1)} textAnchor="middle"
              fontSize="9" fill="#FF8C42" fontFamily="Inter,sans-serif" fontWeight="600">
              {wakeTime}
            </text>
          </>
        );
      })()}
    </svg>
  );
}

/* ── Heatmap ── */
function SleepHeatmap() {
  const maxH=Math.max(...sleepHistory.map(d=>d.hours));
  return (
    <div>
      <div style={{display:'flex',gap:6}}>
        {sleepHistory.map((d,i)=>{
          const pct=d.hours/8;
          const r=Math.round(255*(1-pct)*0.8);
          const g=Math.round(pct*120);
          const b=Math.round(100+pct*155);
          return (
            <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:5}}>
              <div title={`${d.hours} ชม.`} style={{
                width:'100%', paddingTop:'100%', borderRadius:8, position:'relative',
                background:`rgba(${r},${g},${b},0.8)`,
                boxShadow:`0 0 8px rgba(${r},${g},${b},0.35)`,
              }}>
                <span style={{
                  position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',
                  color:'rgba(255,255,255,0.9)',fontSize:9,fontWeight:700,fontFamily:'Inter,sans-serif',
                }}>
                  {d.hours % 1 === 0 ? `${d.hours}h` : `${Math.floor(d.hours)}.${Math.round((d.hours%1)*60/10)}h`}
                </span>
              </div>
              <span style={{color:'rgba(255,255,255,0.45)',fontSize:9,fontFamily:'Prompt,sans-serif'}}>{d.day}</span>
            </div>
          );
        })}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:8}}>
        <span style={{color:'rgba(255,255,255,0.25)',fontSize:9}}>🔴 นอนน้อย</span>
        <span style={{color:'rgba(255,255,255,0.25)',fontSize:9}}>🔵 นอนเยอะ</span>
      </div>
    </div>
  );
}

export default function SleepAdjustment() {
  const [bedtime,   setBedtime]   = useState('02:00');
  const [targetBed, setTargetBed] = useState('01:00');
  const [wakeTime,  setWakeTime]  = useState('07:00');
  const [alarmSet,  setAlarmSet]  = useState(false);
  const [expanded,  setExpanded]  = useState(false);

  const plan = useMemo(()=>{
    // Duration is FIXED = targetWake - targetBed (the user's desired sleep window)
    const targetBedM  = t2m(targetBed);
    const targetWakeM = t2m(wakeTime);          // wakeTime input = target wake
    let duration = targetWakeM - targetBedM;
    if (duration <= 0) duration += 1440;         // e.g. 01:00→07:00 = 360 min

    const cycles = Math.max(1, Math.floor(duration / 90));

    const norm = m => (m < 480 ? m + 1440 : m); // treat 00:xx-07:xx as next-day
    const curN = norm(t2m(bedtime));
    const tgtN = norm(targetBedM);

    const makeEntry = (day, bedN, isTarget) => ({
      day,
      bedtime:  m2t(bedN % 1440),
      wakeTime: m2t((bedN + duration) % 1440),
      duration,
      cycles,
      isTarget,
    });

    if (curN <= tgtN) return [makeEntry(1, curN, true)];

    const steps = [];
    let cur = curN;
    for (let day = 1; day <= 30 && cur > tgtN; day++) {
      steps.push(makeEntry(day, cur, false));
      cur -= 5;
    }
    steps.push(makeEntry(steps.length + 1, tgtN, true));
    return steps;
  },[bedtime,targetBed,wakeTime]);

  const tonight=plan[0];

  return (
    <div style={{minHeight:'100vh',paddingBottom:88,background:'linear-gradient(160deg,#0f0c29 0%,#1a1040 60%,#0f0c29 100%)',paddingBottom:112}}>
      {/* Header */}
      <div style={{padding:'40px 20px 16px'}}>
        <p style={{color:'#A78BFA',fontSize:11,fontWeight:600,letterSpacing:2,textTransform:'uppercase'}}>Core Feature</p>
        <h1 style={{color:'#fff',fontSize:28,fontWeight:800,marginTop:4,letterSpacing:-0.5}}>Sleep Adjustment</h1>
      </div>

      {/* Arc viz card */}
      <div style={{padding:'0 20px 16px'}}>
        <div className="glass" style={{borderRadius:24,padding:'24px 16px',display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
          <SleepArcViz bedtime={tonight?.bedtime ?? bedtime} wakeTime={tonight?.wakeTime ?? wakeTime}/>
          {/* 3 time inputs in a row */}
          <div style={{width:'100%',display:'flex',flexDirection:'column',gap:12}}>
            {[
              {icon:'😴',label:'เข้านอน (ปัจจุบัน)',val:bedtime,set:setBedtime,color:'#A78BFA'},
              {icon:'🎯',label:'เป้าหมายเวลานอน',val:targetBed,set:setTargetBed,color:'#FF8C42'},
              {icon:'⏰',label:'เวลาตื่น (เป้าหมาย)',val:wakeTime,set:setWakeTime,color:'#34D399'},
            ].map(f=>(
              <div key={f.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span style={{fontSize:20}}>{f.icon}</span>
                  <span style={{color:'rgba(255,255,255,0.6)',fontSize:14}}>{f.label}</span>
                </div>
                <input type="time" value={f.val} onChange={e=>f.set(e.target.value)}
                  style={{
                    background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',
                    borderRadius:12,padding:'8px 12px',color:'#fff',fontSize:15,fontWeight:700,
                    fontFamily:'Inter,sans-serif',outline:'none',colorScheme:'dark',
                  }}/>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pill badges */}
      <div style={{padding:'0 20px 16px',display:'flex',gap:8}}>
        {[
          {label:'ระยะเวลา',val:`${plan.length-1} วัน`,bg:'rgba(167,139,250,0.15)',color:'#A78BFA'},
          {label:'วันละ',   val:'5 นาที',              bg:'rgba(255,140,66,0.15)', color:'#FF8C42'},
          {label:'Cycles',  val:`${tonight?.cycles}`,  bg:'rgba(52,211,153,0.15)', color:'#34D399'},
        ].map(p=>(
          <div key={p.label} style={{
            flex:1,textAlign:'center',padding:'10px 8px',borderRadius:50,
            background:p.bg,border:`1px solid ${p.color}30`,
          }}>
            <p style={{color:'rgba(255,255,255,0.45)',fontSize:10}}>{p.label}</p>
            <p style={{color:p.color,fontSize:16,fontWeight:800,fontFamily:'Inter,sans-serif',marginTop:2}}>{p.val}</p>
          </div>
        ))}
      </div>

      {/* Tonight card */}
      <div style={{padding:'0 20px 12px'}}>
        <div className="glass" style={{borderRadius:20,padding:'20px'}}>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:11,fontWeight:600,letterSpacing:1.5,textTransform:'uppercase',marginBottom:8}}>คืนนี้</p>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{color:'#A78BFA',fontSize:28,fontWeight:800,fontFamily:'Inter,sans-serif',letterSpacing:-1}}>{tonight?.bedtime}</span>
                <span style={{color:'rgba(255,255,255,0.3)',fontSize:18}}>→</span>
                <span style={{color:'#FF8C42',fontSize:28,fontWeight:800,fontFamily:'Inter,sans-serif',letterSpacing:-1}}>{tonight?.wakeTime}</span>
                <span style={{color:'rgba(255,255,255,0.4)',fontSize:14,fontWeight:400}}>น.</span>
              </div>
              <p style={{color:'rgba(255,255,255,0.4)',fontSize:12,marginTop:4}}>
                {formatHours(tonight ? tonight.duration / 60 : 0)} · {tonight?.cycles} sleep cycles
              </p>
              <p style={{color:'rgba(255,255,255,0.25)',fontSize:11,marginTop:2}}>
                ปรับทั้งเวลานอน-ตื่นพร้อมกัน เพื่อคงชั่วโมงนอน
              </p>
            </div>
          </div>
          {/* Expand/collapse */}
          <button onClick={()=>setExpanded(e=>!e)} style={{
            marginTop:14,width:'100%',padding:'10px',borderRadius:12,
            background:'rgba(167,139,250,0.1)',border:'1px solid rgba(167,139,250,0.2)',
            color:'#A78BFA',fontSize:13,cursor:'pointer',fontFamily:'Prompt,sans-serif',
          }}>
            {expanded ? '▲ ซ่อนแผนทั้งหมด' : `▼ ดูแผน ${plan.length-1} วัน`}
          </button>
          {expanded && (
            <div className="animate-fadeIn" style={{marginTop:12,maxHeight:200,overflowY:'auto',display:'flex',flexDirection:'column',gap:6}}>
              {plan.map((p,i)=>(
                <div key={i} style={{
                  display:'flex',alignItems:'center',gap:10,padding:'8px 10px',borderRadius:10,
                  background:p.isTarget?'rgba(255,140,66,0.12)':'rgba(255,255,255,0.04)',
                  border:`1px solid ${p.isTarget?'rgba(255,140,66,0.3)':'rgba(255,255,255,0.06)'}`,
                }}>
                  <span style={{
                    width:24,height:24,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',
                    background:p.isTarget?'#FF8C42':'rgba(167,139,250,0.3)',
                    color:p.isTarget?'#fff':'#A78BFA',fontSize:10,fontWeight:700,flexShrink:0,
                  }}>{p.isTarget?'🎯':p.day}</span>
                  <span style={{flex:1,color:p.isTarget?'#FF8C42':'rgba(255,255,255,0.8)',fontSize:12,fontWeight:p.isTarget?700:400,fontFamily:'Inter,sans-serif'}}>
                    {p.isTarget?'🎯 เป้าหมาย: ':`วันที่ ${p.day}: `}
                    {p.bedtime} → {p.wakeTime} น.
                  </span>
                  <span style={{color:'rgba(255,255,255,0.3)',fontSize:11,flexShrink:0}}>{formatHours(p.duration/60)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alarm CTA */}
      <div style={{padding:'0 20px 16px'}}>
        <button onClick={()=>setAlarmSet(true)} style={{
          width:'100%',padding:'16px',borderRadius:50,border:'none',cursor:'pointer',
          fontFamily:'Prompt,sans-serif',fontSize:16,fontWeight:700,letterSpacing:0.3,
          transition:'all 0.3s',
          ...(alarmSet ? {
            background:'rgba(52,211,153,0.15)',
            border:'1px solid rgba(52,211,153,0.4)',
            color:'#34D399',
          } : {
            background:'linear-gradient(90deg,#FF8C42,#fbbf24)',
            color:'#fff',
            boxShadow:'0 6px 24px rgba(255,140,66,0.4)',
          }),
        }}>
          {alarmSet ? `✅ ตั้งเตือนแล้ว — ${tonight?.bedtime} → ${tonight?.wakeTime} น.` : '🔔 ตั้งเตือนสำหรับคืนนี้'}
        </button>
      </div>

      {/* Sleep heatmap */}
      <div style={{padding:'0 20px 16px'}}>
        <div className="glass" style={{borderRadius:20,padding:'20px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <p style={{color:'rgba(255,255,255,0.6)',fontSize:13,fontWeight:600}}>ประวัติการนอน 7 วัน</p>
            <span style={{
              color:'#A78BFA',fontSize:11,background:'rgba(167,139,250,0.15)',
              border:'1px solid rgba(167,139,250,0.25)',borderRadius:50,padding:'3px 10px',
            }}>เฉลี่ย 02:02 น.</span>
          </div>
          <SleepHeatmap/>
        </div>
      </div>
    </div>
  );
}
