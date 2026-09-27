import { LogOut } from 'lucide-react'
import { formatChatPhone } from '../../utils/phone'

type ChatHeaderProps = {
  chatId: string
  hasConnectionError: boolean
  onDisconnect: () => void
}

export function ChatHeader({
  chatId,
  hasConnectionError,
  onDisconnect,
}: ChatHeaderProps) {
  return (
    <header className="relative z-2 flex min-h-[70px] items-center justify-between border-b border-[#e7e9f1] bg-white/95 px-3.5 py-2.5 shadow-[0_4px_24px_rgba(36,42,70,.04)] backdrop-blur-md md:min-h-[78px] md:px-[clamp(20px,4vw,56px)] md:py-3">
      <div className="flex items-center gap-[13px]">
        <div className="grid size-[43px] place-items-center rounded-[14px] bg-linear-to-br from-[#756fff] to-[#39a6ed] text-lg font-extrabold text-white shadow-[0_8px_18px_rgba(74,93,228,.2)] md:size-12 md:rounded-[17px]">{chatId.slice(0, 1).toUpperCase()}</div>
        <div>
          <h1 className="mb-1 text-sm font-bold tracking-[-.02em] md:text-base">
            Чат для MAX / WhatsApp / Telegram
          </h1>
          <p className="text-[11px] text-muted">{formatChatPhone(chatId)}</p>
        </div>
      </div>
      <div className="flex items-center gap-[18px]">
        <span className="hidden items-center gap-[7px] text-[11px] font-semibold text-[#81879a] md:flex">
          <i className={`size-[7px] rounded-full ${hasConnectionError ? 'bg-[#f0a13b] shadow-[0_0_0_4px_rgba(240,161,59,.12)]' : 'bg-[#30c582] shadow-[0_0_0_4px_rgba(48,197,130,.1)]'}`} />
          {hasConnectionError ? 'Переподключение…' : 'В сети'}
        </span>
        <button
          className="grid size-[38px] place-items-center rounded-[11px] border border-[#eceef4] bg-[#f7f8fb] p-0 text-[#777e94] transition hover:bg-[#f0efff] hover:text-brand"
          type="button"
          onClick={onDisconnect}
          aria-label="Выйти из чата"
          title="Выйти из чата"
        >
          <LogOut className="size-[17px]" aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
