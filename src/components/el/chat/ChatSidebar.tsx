import { LogOut, Plus, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import type { MouseEvent } from 'react'
import { useChatStore } from '../../../store/chatStore'
import { formatMessageTime } from '../../../utils/date'
import { formatChatPhone } from '../../../utils/phone'
import { Skeleton } from '../../ui/Skeleton'
import { ChatContextMenu } from './ChatContextMenu'

type ContextMenuState = {
	chatId: string
	chatTitle: string
	x: number
	y: number
}

type ChatSidebarProps = {
	isOpen: boolean
	onClose: () => void
	onNewChat: () => void
	onLogout: () => void
	isContactLoading: boolean
}

export function ChatSidebar({
	isOpen,
	onClose,
	onNewChat,
	onLogout,
	isContactLoading,
}: ChatSidebarProps) {
	const chats = useChatStore(state => state.chats)
	const activeChatId = useChatStore(state => state.chatId)
	const selectChat = useChatStore(state => state.selectChat)
	const removeChat = useChatStore(state => state.removeChat)
	const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
	const sortedChats = [...chats].sort((a, b) => b.updatedAt - a.updatedAt)
	const closeContextMenu = useCallback(() => setContextMenu(null), [])

	function handleSelect(chatId: string) {
		closeContextMenu()
		selectChat(chatId)
		onClose()
	}

	function handleContextMenu(
		event: MouseEvent<HTMLButtonElement>,
		chatId: string,
		chatTitle: string,
	) {
		event.preventDefault()
		setContextMenu({
			chatId,
			chatTitle,
			x: Math.min(event.clientX, window.innerWidth - 204),
			y: Math.min(event.clientY, window.innerHeight - 60),
		})
	}

	return (
		<>
			<button
				className={`fixed inset-0 z-20 bg-[#15182b]/35 backdrop-blur-[2px] transition md:hidden ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
				type='button'
				onClick={onClose}
				aria-label='Закрыть список чатов'
			/>
			<aside
				className={`fixed inset-y-0 left-0 z-30 flex w-[min(90vw,340px)] shrink-0 flex-col border-r border-[#e7e9f1] bg-white transition-transform duration-200 md:static md:w-80 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
			>
				<div className='flex h-17.5 items-center justify-between border-b border-[#e7e9f1] px-4 md:h-19.5'>
					<div className='flex items-center gap-2.5'>
						<div>
							<strong className='block text-sm'>GREEN-API</strong>
							<span className='text-muted text-[12px]'>Мои чаты</span>
						</div>
					</div>
					<div className='flex items-center gap-1'>
						<button
							className='text-brand hover:bg-brand/10 grid size-9 place-items-center rounded-2xl transition'
							type='button'
							onClick={onNewChat}
							aria-label='Создать чат'
						>
							<Plus className='size-5' aria-hidden='true' />
						</button>
						<button
							className='text-muted grid size-9 place-items-center rounded-lg hover:bg-[#f3f4f8] md:hidden'
							type='button'
							onClick={onClose}
							aria-label='Закрыть меню'
						>
							<X className='size-4.5' aria-hidden='true' />
						</button>
					</div>
				</div>

				<nav className='min-h-0 flex-1 overflow-y-auto px-2 py-3' aria-label='Чаты'>
					{sortedChats.map(chat => {
						const lastMessage = chat.messages.at(-1)
						const title = chat.recipientName || formatChatPhone(chat.chatId)
						const isActiveChatLoading =
							chat.chatId === activeChatId && isContactLoading

						return (
							<button
								className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${chat.chatId === activeChatId ? 'bg-[#efefff]' : 'hover:bg-[#f6f7fa]'}`}
								type='button'
								key={chat.chatId}
								onClick={() => handleSelect(chat.chatId)}
								onContextMenu={event => handleContextMenu(event, chat.chatId, title)}
							>
								{isActiveChatLoading && !chat.avatarUrl ? (
									<Skeleton
										className='size-10 shrink-0 rounded-xl'
										label='Загрузка аватарки контакта'
									/>
								) : (
									<div className='grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-linear-to-br from-[#756fff] to-[#39a6ed] font-bold text-white'>
										{chat.avatarUrl ? (
										<img className='size-full object-cover' src={chat.avatarUrl} alt='' />
										) : (
										title.slice(0, 1).toUpperCase()
										)}
									</div>
								)}
								<div className='min-w-0 flex-1'>
									<div className='flex items-center justify-between gap-2'>
										{isActiveChatLoading && !chat.recipientName ? (
											<Skeleton
												className='h-3.5 w-24'
												label='Загрузка имени контакта'
											/>
										) : (
											<strong className='truncate text-xs'>{title}</strong>
										)}
										{lastMessage && (
											<time className='shrink-0 text-[9px] text-[#a2a6b4]'>
												{formatMessageTime(lastMessage.timestamp)}
											</time>
										)}
									</div>
									<p className='text-muted mt-1 truncate text-[10px]'>
										{lastMessage?.text || formatChatPhone(chat.chatId)}
									</p>
								</div>
							</button>
						)
					})}
				</nav>

				<div className='border-t border-[#e7e9f1] p-3'>
					<button
						className='flex h-10 w-full items-center justify-center gap-2 rounded-xl text-xs font-semibold text-[#777e94]'
						type='button'
						onClick={onLogout}
					>
						<LogOut className='size-4' aria-hidden='true' />
						Выйти из аккаунта
					</button>
				</div>
				{contextMenu && (
					<ChatContextMenu
						chatTitle={contextMenu.chatTitle}
						position={{ x: contextMenu.x, y: contextMenu.y }}
						onClose={closeContextMenu}
						onDelete={() => {
							removeChat(contextMenu.chatId)
							closeContextMenu()
						}}
					/>
				)}
			</aside>
		</>
	)
}
