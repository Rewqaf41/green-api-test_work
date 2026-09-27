import { useEffect, useRef } from 'react'
import { Check, CheckCheck, CircleAlert, MessageCircle } from 'lucide-react'
import type { ChatMessage, MessageStatus } from '../../types/chat'
import { formatMessageTime } from '../../utils/date'

type MessageListProps = { messages: ChatMessage[] }

export function MessageList({ messages }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <section className="min-h-0 overflow-y-auto bg-[#f5f6fa] bg-[radial-gradient(#dfe2ec_.7px,transparent_.7px)] [background-size:22px_22px] px-[max(13px,calc((100vw-900px)/2))] pt-[18px] pb-7 md:px-[max(20px,calc((100vw-900px)/2))] md:pt-[22px] md:pb-[34px]" aria-live="polite">
      <div className="mb-6 flex items-center gap-3 text-[10px] font-semibold text-[#9ca1b2] before:h-px before:flex-1 before:bg-[#e7e9f0] after:h-px after:flex-1 after:bg-[#e7e9f0]"><span className="rounded-xl border border-[#eaecf2] bg-white/90 px-2.5 py-1.5">Сегодня</span></div>
      {messages.length === 0 ? (
        <div className="flex min-h-[calc(100vh-285px)] flex-col items-center justify-center text-center">
          <div className="mb-[18px] grid size-16 place-items-center rounded-[22px] bg-[#eeedff] text-brand"><MessageCircle className="size-7" aria-hidden="true" /></div>
          <h2 className="mb-2 text-xl font-bold tracking-[-.03em]">Здесь пока тихо</h2>
          <p className="max-w-[330px] text-[13px] leading-relaxed text-[#9499aa]">Напишите первое сообщение — ответ появится автоматически.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-[9px]">
          {messages.map(message => (
            <article
              className={`max-w-[86%] rounded-[17px] px-3.5 pt-[11px] pb-2 shadow-[0_3px_14px_rgba(39,45,73,.06)] animate-[message-in_.2s_ease-out] motion-reduce:animate-none md:max-w-[min(72%,560px)] ${message.direction === 'incoming' ? 'self-start rounded-bl-[5px] bg-white' : 'self-end rounded-br-[5px] bg-linear-to-br from-[#6a65ff] to-[#5955ee] text-white'}`}
              key={message.id}
            >
              <p className="text-sm leading-normal whitespace-pre-wrap [overflow-wrap:anywhere]">{message.text}</p>
              <span className={`mt-[3px] flex items-center justify-end gap-[3px] text-[9px] ${message.direction === 'incoming' ? 'text-[#a2a6b4]' : 'text-white/65'}`}>
                {formatMessageTime(message.timestamp)}
                {message.direction === 'outgoing' && (
                  <MessageStatusIcon
                    status={message.status}
                    description={message.statusDescription}
                  />
                )}
              </span>
            </article>
          ))}
          <div ref={endRef} />
        </div>
      )}
    </section>
  )
}

type MessageStatusIconProps = {
  status?: MessageStatus
  description?: string
}

function MessageStatusIcon({ status, description }: MessageStatusIconProps) {
  if (status === 'read') {
    return (
      <CheckCheck
        className="size-3.5 text-[#9fe6ff]"
        aria-label="Прочитано"
      />
    )
  }

  if (status === 'delivered') {
    return <CheckCheck className="size-3.5" aria-label="Доставлено" />
  }

  if (status === 'failed' || status === 'noAccount' || status === 'notInGroup') {
    return (
      <CircleAlert
        className="size-3 text-[#ffd0d0]"
        aria-label={description || 'Не удалось отправить'}
      />
    )
  }

  return <Check className="size-3" aria-label="Отправлено" />
}
