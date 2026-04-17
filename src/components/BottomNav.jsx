const tabs = [
  { id: 'sleep',   icon: '🌙' },
  { id: 'evening', icon: '📋' },
  { id: 'morning', icon: '☀️' },
  { id: 'report',  icon: '📊' },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'rgba(15,12,41,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      zIndex: 50,
    }}>
      <div style={{ display: 'flex' }}>
        {tabs.map((tab) => {
          const on = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px 0 16px',
                gap: 6,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                transition: 'opacity 0.2s',
                opacity: on ? 1 : 0.4,
              }}
            >
              <span style={{ fontSize: 24, lineHeight: 1 }}>{tab.icon}</span>
              {/* Dot indicator */}
              <span style={{
                width: on ? 20 : 4,
                height: 3,
                borderRadius: 99,
                background: on ? '#FF8C42' : 'transparent',
                transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
              }} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
