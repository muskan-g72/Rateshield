import { useCallback, useRef, type ReactNode } from 'react'
import {
  SimulatorContext,
  type PacketEvent,
  type PacketListener,
} from '@/context/simulatorContextInstance'

export type { PacketEvent } from '@/context/simulatorContextInstance'

export function SimulatorProvider({ children }: { children: ReactNode }) {
  const listenersRef = useRef<Set<PacketListener>>(new Set())

  const emitPacket = useCallback((packet: PacketEvent) => {
    listenersRef.current.forEach((listener) => {
      try {
        listener(packet)
      } catch (err) {
        console.error('Error in packet listener:', err)
      }
    })
  }, [])

  const subscribePackets = useCallback((listener: PacketListener) => {
    listenersRef.current.add(listener)
    return () => {
      listenersRef.current.delete(listener)
    }
  }, [])

  return (
    <SimulatorContext.Provider value={{ emitPacket, subscribePackets }}>
      {children}
    </SimulatorContext.Provider>
  )
}
