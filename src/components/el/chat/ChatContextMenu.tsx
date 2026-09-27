import { Trash2 } from 'lucide-react'
import { useEffect } from 'react'

type ChatContextMenuProps = {
  chatTitle: string
  position: { x: number; y: number }
  onClose: () => void
  onDelete: () => void
}

export function ChatContextMenu({
  chatTitle,
  position,
  onClose,
  onDelete,
}: ChatContextMenuProps) {
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', onClose)
    document.addEventListener('keydown', handleEscape)
    window.addEventListener('blur', onClose)

    return () => {
      document.removeEventListener('mousedown', onClose)
      document.removeEventListener('keydown', handleEscape)
      window.removeEventListener('blur', onClose)
    }
  }, [onClose])

  return (
    <div
      className="fixed z-60 w-48 overflow-hidden rounded-xl border border-[#e6e9f0] bg-white p-1.5 shadow-[0_14px_38px_rgba(28,36,58,.18)]"
      style={{ left: position.x, top: position.y }}
      role="menu"
      aria-label={`Действия с чатом ${chatTitle}`}
      onMouseDown={event => event.stopPropagation()}
    >
      <button
        className="flex h-10 w-full items-center gap-2.5 rounded-lg px-3 text-left text-xs font-semibold text-red-500 transition hover:bg-red-50"
        type="button"
        role="menuitem"
        onClick={onDelete}
      >
        <Trash2 className="size-4" aria-hidden="true" />
        Удалить чат
      </button>
    </div>
  )
}
