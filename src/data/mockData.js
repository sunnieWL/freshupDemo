// Format decimal hours → "X ชม." or "X ชม. Y นาที"
export function formatHours(h) {
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  if (mins === 0) return `${hrs} ชม.`;
  return `${hrs} ชม. ${mins} นาที`;
}

export const weeklyData = [
  { day: 'จ',  score: 60,  bedtime: '02:10', wakeTime: '07:00', hours: 4.8,  cycles: 3 },
  { day: 'อ',  score: 80,  bedtime: '01:50', wakeTime: '07:00', hours: 5.2,  cycles: 3 },
  { day: 'พ',  score: 40,  bedtime: '02:30', wakeTime: '07:00', hours: 4.5,  cycles: 3 },
  { day: 'พฤ', score: 80,  bedtime: '01:45', wakeTime: '07:00', hours: 5.25, cycles: 3 },
  { day: 'ศ',  score: 100, bedtime: '01:00', wakeTime: '07:00', hours: 6.0,  cycles: 4 },
  { day: 'ส',  score: 60,  bedtime: '02:00', wakeTime: '08:00', hours: 6.0,  cycles: 4 },
  { day: 'อา', score: 80,  bedtime: '01:30', wakeTime: '07:30', hours: 6.0,  cycles: 4 },
];

// Sleep history for the past 7 days (Sleep Adjustment page)
export const sleepHistory = [
  { day: 'จ',  date: '9 เม.ย.',  bedtime: '02:15', wakeTime: '07:00', hours: 4.75 },
  { day: 'อ',  date: '10 เม.ย.', bedtime: '02:05', wakeTime: '07:00', hours: 4.92 },
  { day: 'พ',  date: '11 เม.ย.', bedtime: '02:30', wakeTime: '07:00', hours: 4.5  },
  { day: 'พฤ', date: '12 เม.ย.', bedtime: '01:45', wakeTime: '07:00', hours: 5.25 },
  { day: 'ศ',  date: '13 เม.ย.', bedtime: '01:00', wakeTime: '07:00', hours: 6.0  },
  { day: 'ส',  date: '14 เม.ย.', bedtime: '02:00', wakeTime: '08:00', hours: 6.0  },
  { day: 'อา', date: '15 เม.ย.', bedtime: '01:30', wakeTime: '07:30', hours: 6.0  },
];

// Ideal vs Actual — both bedtime AND wake time, for the 4-line chart
export const idealVsActual = [
  { day: 'จ',  idealBed: '02:00', actualBed: '02:15', idealWake: '07:00', actualWake: '07:00' },
  { day: 'อ',  idealBed: '01:55', actualBed: '02:05', idealWake: '07:00', actualWake: '07:15' },
  { day: 'พ',  idealBed: '01:50', actualBed: '02:30', idealWake: '07:00', actualWake: '07:00' },
  { day: 'พฤ', idealBed: '01:45', actualBed: '01:45', idealWake: '07:00', actualWake: '06:45' },
  { day: 'ศ',  idealBed: '01:40', actualBed: '01:00', idealWake: '07:00', actualWake: '07:00' },
  { day: 'ส',  idealBed: '01:35', actualBed: '02:00', idealWake: '07:30', actualWake: '08:00' },
  { day: 'อา', idealBed: '01:30', actualBed: '01:30', idealWake: '07:30', actualWake: '07:30' },
];

export const eveningRoutineItems = [
  { id: 1, icon: '☕', label: 'งดคาเฟอีนหลัง 4 โมงเย็น',  desc: 'ช่วยให้หลับง่ายขึ้น' },
  { id: 2, icon: '📵', label: 'ปิดจอ 30 นาทีก่อนนอน',      desc: 'ลด Blue Light กระตุ้นสมอง' },
  { id: 3, icon: '🧘', label: 'ยืดเส้น / ทำสมาธิ 5 นาที',  desc: 'ผ่อนคลายร่างกายก่อนนอน' },
  { id: 4, icon: '🌙', label: 'จัดห้องให้มืดและเย็น',      desc: 'อุณหภูมิ 20-22°C เหมาะที่สุด' },
  { id: 5, icon: '📔', label: 'เขียน Journal สั้นๆ',       desc: 'ระบายความคิดก่อนนอน' },
  { id: 6, icon: '🚿', label: 'อาบน้ำอุ่นก่อนนอน',        desc: 'ลดอุณหภูมิร่างกาย ช่วยหลับ' },
];

export const morningRoutineItems = [
  { icon: '💧', label: 'ดื่มน้ำ 2 แก้ว',   desc: 'ฟื้นฟูร่างกายหลังนอน 7+ ชั่วโมง' },
  { icon: '☀️', label: 'รับแสงแดด 5 นาที', desc: 'Reset นาฬิกาชีวภาพ' },
  { icon: '🤸', label: 'ยืดเส้น 5 นาที',   desc: 'กระตุ้นการไหลเวียนเลือด' },
];

export const emojiLevels = [
  { emoji: '😴', label: 'ง่วงมาก',    score: 20,  color: '#6366f1' },
  { emoji: '😐', label: 'เฉยๆ',       score: 40,  color: '#8b5cf6' },
  { emoji: '😊', label: 'โอเค',       score: 60,  color: '#f59e0b' },
  { emoji: '😄', label: 'สดชื่น',     score: 80,  color: '#f97316' },
  { emoji: '🤩', label: 'สดชื่นมาก',  score: 100, color: '#10b981' },
];
