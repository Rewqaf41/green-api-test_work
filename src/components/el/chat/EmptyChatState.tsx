import { Menu, MessageSquarePlus } from 'lucide-react'

type EmptyChatStateProps = {
  onNewChat: () => void
  onOpenSidebar: () => void
}

export function EmptyChatState({
  onNewChat,
  onOpenSidebar,
}: EmptyChatStateProps) {
  return (
    <main className="relative grid min-w-0 flex-1 place-items-center bg-[#f5f6fa] p-6 text-center">
      <button
        className="absolute top-4 right-4 grid size-10 place-items-center rounded-xl border border-[#e7e9f1] bg-white text-muted shadow-sm md:hidden"
        type="button"
        onClick={onOpenSidebar}
        aria-label="Открыть список чатов"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>
      <div className="max-w-sm">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-brand/10 text-brand">
          <MessageSquarePlus className="size-7" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-xl font-bold text-ink">Чатов пока нет</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Создайте новый чат — повторно вводить данные инстанса не потребуется.
        </p>
        <button
          className="mt-6 h-11 rounded-xl bg-brand px-6 text-sm font-bold text-white transition hover:bg-brand-dark"
          type="button"
          onClick={onNewChat}
        >
          Создать чат
        </button>
      </div>
    </main>
  )
}
