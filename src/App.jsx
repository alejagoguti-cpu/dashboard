import { useCallback, useState } from 'react'
import AccountModals from './components/AccountModals.jsx'
import ContentTools from './components/ContentTools.jsx'
import FeedPlanner from './components/FeedPlanner.jsx'
import Header from './components/Header.jsx'
import KpiCards from './components/KpiCards.jsx'
import LoggedOut from './components/LoggedOut.jsx'
import ScheduleModal from './components/ScheduleModal.jsx'
import Sidebar from './components/Sidebar.jsx'
import { MenuIcon } from './components/icons.jsx'
import TopReels from './components/TopReels.jsx'
import WeeklyCalendar from './components/WeeklyCalendar.jsx'
import Analytics from './components/sections/Analytics.jsx'
import CalendarMonth from './components/sections/CalendarMonth.jsx'
import Competitors from './components/sections/Competitors.jsx'
import Formats from './components/sections/Formats.jsx'
import Home from './components/sections/Home.jsx'
import News from './components/sections/News.jsx'
import PlatformStudio from './components/sections/PlatformStudio.jsx'
import Topics from './components/sections/Topics.jsx'
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

/** Cada entrada de la navegación tiene su pantalla; no queda ninguna vacía. */
function Section({ id, onSchedule }) {
  switch (id) {
    case 'instagram':
      return <InstagramStudio onSchedule={onSchedule} />
    case 'inicio':
      return <Home onSchedule={onSchedule} />
    case 'noticias':
      return <News onSchedule={onSchedule} />
    case 'temas':
      return <Topics onSchedule={onSchedule} />
    case 'formatos':
      return <Formats />
    case 'youtube':
    case 'linkedin':
      return <PlatformStudio id={id} onSchedule={onSchedule} />
    case 'analiticas':
      return <Analytics />
    case 'calendario':
      return <CalendarMonth onSchedule={onSchedule} />
    case 'competidores':
      return <Competitors />
    default:
      return <Home onSchedule={onSchedule} />
  }
}

function Dashboard() {
  const { section, loggedOut } = useDashboard()

  // `null` = cerrado; un objeto (aunque sea vacío) abre el diálogo con ese prefill.
  const [draft, setDraft] = useState(null)
  const [accountModal, setAccountModal] = useState(null)
  const [navOpen, setNavOpen] = useState(false)

  const openSchedule = useCallback((prefill = {}) => setDraft(prefill), [])
  const closeSchedule = useCallback(() => setDraft(null), [])

  if (loggedOut) return <LoggedOut />

  return (
    <div className="h-full flex bg-[#fbfbfb] text-slate-800 font-sans antialiased overflow-hidden">
      <Sidebar
        onAccountAction={setAccountModal}
        open={navOpen}
        onClose={() => setNavOpen(false)}
      />

      <main className="flex-1 overflow-y-auto bg-surface-gray min-w-0">
        <div className="max-w-[1400px] mx-auto p-4 sm:p-7 space-y-6">
          {/* La barra lateral se oculta en pantallas estrechas. */}
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-xs"
          >
            <MenuIcon className="w-4 h-4" />
            Menú
          </button>

          <Section id={section} onSchedule={openSchedule} />
        </div>
      </main>

      <ScheduleModal draft={draft} onClose={closeSchedule} />
      <AccountModals open={accountModal} onClose={() => setAccountModal(null)} />
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
