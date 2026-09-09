import ContentTools from './components/ContentTools.jsx'
import FeedPlanner from './components/FeedPlanner.jsx'
import Header from './components/Header.jsx'
import KpiCards from './components/KpiCards.jsx'
import Sidebar from './components/Sidebar.jsx'
import TopReels from './components/TopReels.jsx'
import WeeklyCalendar from './components/WeeklyCalendar.jsx'

export default function App() {
  return (
    <div className="h-full flex bg-[#fbfbfb] text-slate-800 font-sans antialiased overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto bg-surface-gray">
        <div className="max-w-[1400px] mx-auto p-7 space-y-6">
          <Header />
          <KpiCards />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-6">
              <FeedPlanner />
              <ContentTools />
            </div>

            <div className="lg:col-span-5 space-y-6">
              <WeeklyCalendar />
              <TopReels />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
