import { Hero } from '@/components/landing/Hero'
import { FlowGraph } from '@/components/landing/FlowGraph'
import { LatencyRuler } from '@/components/landing/LatencyRuler'
import { RequestPath } from '@/components/landing/RequestPath'
import { StackPills } from '@/components/landing/StackPills'
import { SimulatorProvider } from '@/context/SimulatorEventContext'

export function HomePage() {
  return (
    <SimulatorProvider>
      <div className="space-y-4">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Interactive Architecture Flow Graph (Connected to Simulator) */}
        <FlowGraph />

        {/* 3. Load Test Latency Ruler */}
        <LatencyRuler />

        {/* 4. Request Path Flow */}
        <RequestPath />

        {/* 5. Technology Stack */}
        <StackPills />
      </div>
    </SimulatorProvider>
  )
}
