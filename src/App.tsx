import { useState } from 'react'
import { format } from 'date-fns'
import { ChevronRight, Users, X } from 'lucide-react'
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
import { Badge } from './components/ui/Badge'
import { Card } from './components/ui/Card'
import { SectionHeader } from './components/ui/SectionHeader'

function HomeTab() {
  const { state, dispatch } = useApp()
  const [showPlanTogether, setShowPlanTogether] = useState(false)
  const name = state.profile.name || 'there'

  return (
    <div className="space-y-5 animate-orbit-slide-up">
      <div className="pt-1">
        <p className="text-zinc-500 text-sm font-medium">Hey, {name} 👋</p>
        <h1 className="text-2xl font-bold tracking-tight mt-1">
          {format(new Date(), 'EEEE, MMM d')}
        </h1>
      </div>

      <HomeNaturalLanguageBar />

      <NextUpWidget />

      <CalCompareCarousel />

      <TasksWidget />

      {state.reviewQueue.length > 0 && (
        <Card
          interactive
          onClick={() => dispatch({ type: 'SET_TAB', tab: 'add' })}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">
                {state.reviewQueue.length} event{state.reviewQueue.length > 1 ? 's' : ''} to review
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">Tap to approve imported events</p>
            </div>
            <Badge variant="warning">{state.reviewQueue.length}</Badge>
          </div>
        </Card>
      )}

      <Card interactive onClick={() => setShowPlanTogether(true)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orbit-accent/12 flex items-center justify-center">
              <Users size={20} className="text-accent" />
            </div>
            <div>
              <p className="font-semibold tracking-tight">Plan together</p>
              <p className="text-sm text-zinc-500 mt-0.5">Find time with friends</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-zinc-500" />
        </div>
      </Card>

      {showPlanTogether && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto orbit-modal-sheet p-5 pb-8 animate-orbit-slide-up safe-area-bottom">
            <div className="w-10 h-1 rounded-full bg-orbit-border mx-auto mb-4" />
            <div className="flex justify-end mb-2">
              <button onClick={() => setShowPlanTogether(false)} className="p-2 rounded-xl hover:bg-orbit-surface-2 transition-colors">
                <X size={18} className="text-zinc-400" />
              </button>
            </div>
            <PlanTogether onClose={() => setShowPlanTogether(false)} />
          </div>
        </div>
      )}

      <FriendOverlay />

      <div>
        <SectionHeader title="Today's schedule" />
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
    <div className="space-y-6 animate-orbit-slide-up">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Add events</h2>
        <p className="text-sm text-zinc-500 mt-1">Type naturally or import from a photo</p>
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
      <header className="orbit-sticky-header safe-area-top">
        <div className="px-4 py-3 flex items-center justify-between">
          <AppBrandMark />
          {state.reviewQueue.length > 0 && state.activeTab !== 'add' && (
            <button
              onClick={() => dispatch({ type: 'SET_TAB', tab: 'add' })}
              className="text-xs px-2.5 py-1 rounded-full bg-orbit-accent/15 text-accent font-semibold hover:bg-orbit-accent/20 transition-colors"
            >
              {state.reviewQueue.length} to review
            </button>
          )}
        </div>
        <NowNextHeader />
      </header>

      <main className="flex-1 px-4 pt-4 orbit-main-with-nav overflow-y-auto">
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
      <div className="min-h-full max-w-lg mx-auto safe-area-top safe-area-bottom">
        <OnboardingFlow />
      </div>
    )
  }

  return <MainApp />
}
