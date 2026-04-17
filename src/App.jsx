import { useState } from 'react';
import Onboarding      from './components/Onboarding';
import BottomNav       from './components/BottomNav';
import SleepAdjustment from './components/SleepAdjustment';
import EveningRoutine  from './components/EveningRoutine';
import MorningCheckin  from './components/MorningCheckin';
import WeeklyReport    from './components/WeeklyReport';

export default function App() {
  const [screen, setScreen] = useState('onboarding');
  const [tab, setTab]       = useState('sleep');

  if (screen === 'onboarding') {
    return <Onboarding onStart={() => setScreen('main')} />;
  }

  return (
    <div className="relative min-h-screen">
      {/* Fade transition via key re-mount */}
      <div key={tab} className="animate-fadeIn">
        {tab === 'sleep'   && <SleepAdjustment />}
        {tab === 'evening' && <EveningRoutine />}
        {tab === 'morning' && <MorningCheckin />}
        {tab === 'report'  && <WeeklyReport />}
      </div>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
