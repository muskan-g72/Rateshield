import { useContext } from 'react'
import { SimulatorContext } from '@/context/simulatorContextInstance'

export function useSimulatorEvents() {
  const context = useContext(SimulatorContext)
  if (!context) {
    throw new Error('useSimulatorEvents must be used within a SimulatorProvider')
  }
  return context
}
