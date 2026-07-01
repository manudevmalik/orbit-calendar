import { useState } from 'react'
import { format } from 'date-fns'
import { useApp } from './context/AppContext'
import { OnboardingFlow } from './components/OnboardingFlow'
import { BottomNav } from './components/BottomNav'
import { CalendarHeader } from './components/CalendarHeader'
import { DayView } from './components/DayView'
import { WeekView } from './components/WeekView'
import { AgendaView, NextUpWidget } from './components/AgendaView'
import { NaturalLanguageAdd, PhotoImport, ReviewQueue } from './components/IngestPanel'
import { FriendOverlay, PlanTogether } from './components/SocialPanel'
import { CalCompareCarousel } from './components/CalCompareCarousel'
import { TasksWidget } from './components/TasksWidget'
import { HomeNaturalLanguageBar } from './components/HomeNaturalLanguageBar'
import { NowNextHeader } from './components/NowNextHeader'
import { ProfileTab } from './components/ProfileTab'
import { AppBrandMark } from './components/SaturnLogo'
import { MyAIChat, MyAIFloatingButton } from './components/MyAIChat'
import { Users, X } from 'lucide-react'

function HomeTab() {
  const { state, dispatch } = useApp()
  const [showPlanTogether, setShowPlanTogether] = useState(false)
  const name = state.profile.name || 'there'

  return (
    <div className="space-y-4 animate-slide-up">
      <div>
        <p className="text-zinc-500 text-sm">Hey, {name}</p>
        <h1 className="text-2xl font-bold tracking-tight mt-0.5">
          {format(new Date(), 'EEEE, MMM d')}
        </h1>
      </div>

      <HomeNaturalLanguageBar />

      <CalCompareCarousel />

      <NextUpWidget />

      <TasksWidget />

      {state.reviewQueue.length > 0 && (
        <button
          onClick={() => dispatch({ type: 'SET_TAB', tab: 'add' })}
          className="w-full p-4 rounded-xl card text-left hover:bg-orbit-surface transition-colors"
        >
          <p className="font-medium text-sm">
            {state.reviewQueue.length} event{state.reviewQueue.length > 1 ? 's' : ''} to review
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">Tap to approve imported events</p>
        </button>
      )}

      <button
        onClick={() => setShowPlanTogether(true)}
        className="w-full p-4 rounded-xl card text-left hover:bg-orbit-surface transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Plan together</p>
            <p className="text-sm text-zinc-500 mt-0.5">Find time with friends</p>
          </div>
          <Users size={18} className="text-zinc-500" />
        </div>
      </button>

      {showPlanTogether && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70">
          <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-t-2xl bg-orbit-surface border border-orbit-border p-5 pb-8 animate-slide-up">
            <div className="flex justify-end mb-2">
              <button onClick={() => setShowPlanTogether(false)} className="p-1.5 rounded-lg hover:bg-orbit-surface-2">
                <X size={18} className="text-zinc-400" />
              </button>
            </div>
            <PlanTogether onClose={() => setShowPlanTogether(false)} />
          </div>
        </div>
      )}

      <FriendOverlay />

      <div>
        <h3 className="font-medium text-sm text-zinc-500 mb-2">Today's schedule</h3>
        <DayView />
      </div>
    </div>
  )
}

function CalendarTab() {
  const { state, dispatch } = useApp()

  return (
    <div className="space-y-4">
      <CalendarHeader
        selectedDate={state.selectedDate}
        view={state.currentView}
        onDateChange={(date) => dispatch({ type: 'SET_DATE', date })}
        onViewChange={(view) => dispatch({ type: 'SET_VIEW', view })}
      />
      {state.currentView === 'day' && <DayView />}
      {state.currentView === 'week' && <WeekView />}
      {state.currentView === 'agenda' && <AgendaView />}
    </div>
  )
}

function AddTab() {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Add events</h2>
        <p className="text-sm text-zinc-500 mt-0.5">Type naturally or import from a photo</p>
      </div>
      <NaturalLanguageAdd />
      <PhotoImport />
      <ReviewQueue />
    </div>
  )
}

function MainApp() {
  const { state, dispatch } = useApp()
  const [showMyAI, setShowMyAI] = useState(false)

  return (
    <div className="min-h-full flex flex-col max-w-lg mx-auto">
      <header className="sticky top-0 z-40 app-header">
        <div className="px-4 py-3 flex items-center justify-between">
          <AppBrandMark />
          {state.reviewQueue.length > 0 && state.activeTab !== 'add' && (
            <button
              onClick={() => dispatch({ type: 'SET_TAB', tab: 'add' })}
              className="text-xs px-2.5 py-1 rounded-full bg-orbit-accent/15 text-accent font-medium"
            >
              {state.reviewQueue.length} to review
            </button>
          )}
        </div>
        <NowNextHeader />
      </header>

      <main className="flex-1 px-4 pt-3 pb-24 overflow-y-auto">
        {state.activeTab === 'home' && <HomeTab />}
        {state.activeTab === 'calendar' && <CalendarTab />}
        {state.activeTab === 'add' && <AddTab />}
        {state.activeTab === 'profile' && <ProfileTab />}
      </main>

      <BottomNav
        active={state.activeTab}
        onChange={(tab) => dispatch({ type: 'SET_TAB', tab })}
      />

      {!showMyAI && <MyAIFloatingButton onClick={() => setShowMyAI(true)} />}
      {showMyAI && <MyAIChat onClose={() => setShowMyAI(false)} />}
    </div>
  )
}

export default function App() {
  const { state } = useApp()

  if (!state.profile.onboardingComplete) {
    return (
      <div className="min-h-full max-w-lg mx-auto">
        <OnboardingFlow />
      </div>
    )
  }

  return <MainApp />
}
