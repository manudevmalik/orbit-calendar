import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { WelcomeStep } from './onboarding/WelcomeStep'
import { AgeGate } from './onboarding/AgeGate'
import { SchoolPicker } from './onboarding/SchoolPicker'
import { FriendsStep } from './onboarding/FriendsStep'

export function OnboardingFlow() {
  const { state, dispatch } = useApp()
  const [emailPath, setEmailPath] = useState(false)

  if (!state.profile.welcomeComplete && !emailPath && !state.profile.connectedWithSnapchat) {
    return (
      <WelcomeStep
        onEmailContinue={() => {
          setEmailPath(true)
          dispatch({ type: 'COMPLETE_WELCOME' })
        }}
      />
    )
  }
  if (!state.profile.ageVerified) return <AgeGate />
  if (!state.profile.schoolId) return <SchoolPicker />
  if (!state.profile.onboardingComplete) return <FriendsStep />
  return null
}
