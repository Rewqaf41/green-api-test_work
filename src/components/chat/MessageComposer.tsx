import { useState } from 'react'
import type { KeyboardEvent, SubmitEvent } from 'react'
import { Send } from 'lucide-react'

type MessageComposerProps = {
  error: string
  isSending: boolean
  onSend: (text: string) => Promise<void>
}

export function MessageComposer({ error, isSending, onSend }: MessageComposerProps) {
  const [text, setText] = useState('')

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedText = text.trim()
    if (!normalizedText || isSending) return
    try {
      await onSend(normalizedText)
      setText('')
    } catch {
      // Ошибка отображается состоянием мутации, текст остаётся для повтора.
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <footer className="relative z-2 border-t border-[#e7e9f1] bg-white px-[max(10px,calc((100vw-900px)/2))] pt-2.5 pb-2 md:px-[max(20px,calc((100vw-900px)/2))] md:pt-3.5 md:pb-3">
      {error && <div className="mb-2 rounded-[10px] border border-[#ffd9d9] bg-[#fff0f0] px-3 py-[9px] text-[11px] text-[#9d3d3d]" role="alert">{error}</div>}
      <form className="flex items-end gap-2.5 rounded-[18px] border border-[#eceef3] bg-[#f6f7fa] py-[7px] pr-[7px] pl-[17px] focus-within:border-[#c6c3ff] focus-within:bg-white focus-within:ring-4 focus-within:ring-brand/7" onSubmit={handleSubmit}>
        <textarea
          className="max-h-[120px] min-h-10 flex-1 resize-none overflow-y-auto border-0 bg-transparent py-2.5 pr-0 pb-2 text-sm leading-[1.45] text-ink outline-0 placeholder:text-[#a7abba]"
          value={text}
          onChange={event => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Сообщение"
          rows={1}
          maxLength={4000}
          aria-label="Текст сообщения"
        />
        <button
          className="grid size-[42px] shrink-0 place-items-center rounded-[13px] border-0 bg-brand text-white transition enabled:hover:-translate-y-px disabled:cursor-default disabled:opacity-40"
          type="submit"
          disabled={!text.trim() || isSending}
          aria-label="Отправить сообщение"
        >
          {isSending ? <span className="size-[17px] animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <Send className="size-[19px]" aria-hidden="true" />}
        </button>
      </form>
      <p className="mt-[7px] mr-1 hidden text-right text-[9px] text-[#a4a8b7] md:block">Enter — отправить · Shift + Enter — новая строка</p>
    </footer>
  )
}
