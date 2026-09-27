import { Menu } from 'lucide-react'
import type { InstanceState } from '../../../types/chat'
import { formatChatPhone } from '../../../utils/phone'
import { Skeleton } from '../../ui/Skeleton'

type ChatHeaderProps = {
	chatId: string
	contactName?: string
	avatarUrl?: string
	isContactLoading: boolean
	instanceState: InstanceState | null
	isInstanceStateLoading: boolean
	hasConnectionError: boolean
	onOpenSidebar: () => void
}

export function ChatHeader({
	chatId,
	contactName,
	avatarUrl,
	isContactLoading,
	instanceState,
	isInstanceStateLoading,
	hasConnectionError,
	onOpenSidebar
}: ChatHeaderProps) {
	const status = getInstanceStatus(instanceState, isInstanceStateLoading, hasConnectionError)

	return (
		<header className='relative z-2 flex min-h-17.5 items-center justify-between border-b border-[#e7e9f1] bg-white/95 px-3.5 py-2.5 shadow-[0_4px_24px_rgba(36,42,70,.04)] backdrop-blur-md md:min-h-19.5 md:px-[clamp(20px,4vw,56px)] md:py-3'>
			<div className='flex items-center gap-3.25'>
				<div className='grid size-10.75 place-items-center overflow-hidden rounded-[14px] bg-linear-to-br from-[#756fff] to-[#39a6ed] text-lg font-extrabold text-white shadow-[0_8px_18px_rgba(74,93,228,.2)] md:size-12 md:rounded-[17px]'>
					{avatarUrl ? (
						<img className='size-full object-cover' src={avatarUrl} alt='' referrerPolicy='no-referrer' />
					) : (
						(contactName || chatId).slice(0, 1).toUpperCase()
					)}
				</div>
				<div>
					{isContactLoading ? (
						<Skeleton className='mb-1 h-4 w-36 md:h-5 md:w-44' label='Загрузка имени контакта' />
					) : (
						<h1 className='mb-1 text-sm font-bold tracking-[-.02em] md:text-base'>
							{contactName || 'Чат для MAX / WhatsApp / Telegram'}
						</h1>
					)}
					<p className='text-muted text-[11px]'>{formatChatPhone(chatId)}</p>
				</div>
			</div>
			<div className='flex items-center gap-3.5'>
				<span className='hidden items-center gap-1.75 text-[11px] font-semibold text-[#81879a] md:flex'>
					<i className={`size-1.75 rounded-full ${status.dotClassName}`} />
					{status.label}
				</span>
				<button
					className='hover:text-brand grid size-9.5 place-items-center rounded-[11px] border border-[#eceef4] bg-[#f7f8fb] p-0 text-[#777e94] transition hover:bg-[#f0efff] md:hidden'
					type='button'
					onClick={onOpenSidebar}
					aria-label='Открыть список чатов'
					title='Открыть список чатов'
				>
					s
					<Menu className='size-4.25' aria-hidden='true' />
				</button>
			</div>
		</header>
	)
}

function getInstanceStatus(state: InstanceState | null, isLoading: boolean, hasConnectionError: boolean) {
	if (hasConnectionError) {
		return { label: 'Переподключение…', dotClassName: 'bg-[#f0a13b] shadow-[0_0_0_4px_rgba(240,161,59,.12)]' }
	}

	if (isLoading || !state) {
		return { label: 'Проверка подключения…', dotClassName: 'bg-[#a5a9b8] shadow-[0_0_0_4px_rgba(165,169,184,.12)]' }
	}

	const warning = 'bg-[#f0a13b] shadow-[0_0_0_4px_rgba(240,161,59,.12)]'
	const error = 'bg-red-500 shadow-[0_0_0_4px_rgba(239,68,68,.12)]'
	const statuses: Record<InstanceState, { label: string; dotClassName: string }> = {
		authorized: { label: 'Инстанс подключён', dotClassName: 'bg-[#30c582] shadow-[0_0_0_4px_rgba(48,197,130,.1)]' },
		starting: { label: 'Инстанс запускается…', dotClassName: warning },
		notAuthorized: { label: 'Нужна авторизация', dotClassName: error },
		pendingCode: { label: 'Требуется код', dotClassName: warning },
		pendingPassword: { label: 'Требуется пароль', dotClassName: warning },
		suspended: { label: 'Отправка ограничена', dotClassName: warning },
		sleepMode: { label: 'Телефон недоступен', dotClassName: warning },
		blocked: { label: 'Инстанс заблокирован', dotClassName: error }
	}

	return statuses[state]
}
