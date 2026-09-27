import type { ConnectionData, GreenApiConfig } from '../../../types/chat'
import { ConnectionForm } from './ConnectionForm'
import { ConnectionHero } from './ConnectionHero'

type ConnectionScreenProps = {
  initialConfig: GreenApiConfig | null
  onConnect: (data: ConnectionData) => void
}

export function ConnectionScreen({
  initialConfig,
  onConnect,
}: ConnectionScreenProps) {
  return (
    <main className="grid min-h-screen bg-white md:grid-cols-[minmax(360px,.9fr)_minmax(520px,1.1fr)]">
      <ConnectionHero />
      <section className="grid min-h-screen place-items-center px-[clamp(22px,7vw,110px)] py-9 md:min-h-0 md:py-14">
        <ConnectionForm initialConfig={initialConfig} onConnect={onConnect} />
      </section>
    </main>
  )
}
