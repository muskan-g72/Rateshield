import { createContext } from 'react'

export interface PacketEvent {
  id: string
  allowed: boolean
  timestamp: number
  slotNumber?: number
}

export type PacketListener = (packet: PacketEvent) => void

export interface SimulatorContextValue {
  emitPacket: (packet: PacketEvent) => void
  subscribePackets: (listener: PacketListener) => () => void
}

export const SimulatorContext = createContext<SimulatorContextValue | undefined>(undefined)
