import { useCallback, useState } from 'react'
import ContentTools from './components/ContentTools.jsx'
import FeedPlanner from './components/FeedPlanner.jsx'
import Header from './components/Header.jsx'
import KpiCards from './components/KpiCards.jsx'
import PlaceholderSection from './components/PlaceholderSection.jsx'
import ScheduleModal from './components/ScheduleModal.jsx'
import Sidebar from './components/Sidebar.jsx'
import TopReels from './components/TopReels.jsx'
import WeeklyCalendar from './components/WeeklyCalendar.jsx'
import Toasts from './components/ui/Toasts.jsx'
import { DashboardProvider, useDashboard } from './state/DashboardContext.jsx'

function InstagramStudio({ onSchedule }) {
  return (
    <>
      <Header onSchedule={onSchedule} />
      <KpiCards />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <FeedPlanner onSchedule={onSchedule} />
          <ContentTools />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <WeeklyCalendar onSchedule={onSchedule} />
          <TopReels />
        </div>
      </div>
    </>
  )
}

function Dashboard() {
  const { section } = useDashboard()

  // `null` = cerrado; un objeto (aunque sea vacío) abre el diálogo con ese prefill.
  const [draft, setDraft] = useState(null)
  const openSchedule = useCallback((prefill = {}) => setDraft(prefill), [])
  const closeSchedule = useCallback(() => setDraft(null), [])

  return (
    <div className="h-full flex bg-[#fbfbfb] text-slate-800 font-sans antialiased overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto bg-surface-gray">
        <div className="max-w-[1400px] mx-auto p-7 space-y-6">
          {section === 'instagram' ? (
            <InstagramStudio onSchedule={openSchedule} />
          ) : (
            <PlaceholderSection id={section} />
          )}
        </div>
      </main>

      <ScheduleModal draft={draft} onClose={closeSchedule} />
      <Toasts />
    </div>
  )
}

export default function App() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  )
}
