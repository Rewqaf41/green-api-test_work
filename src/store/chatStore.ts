import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
	ChatMessage,
	ChatThread,
	ConnectionData,
	GreenApiConfig,
	InstanceState,
	MessageStatus
} from '../types/chat'

type RecipientProfile = {
	recipientName?: string
	avatarUrl?: string
}

type ChatState = {
	config: GreenApiConfig | null
	chatId: string
	chats: ChatThread[]
	instanceState: InstanceState | null
	pollingError: string
	connect: (data: ConnectionData) => void
	disconnect: () => void
	selectChat: (chatId: string) => void
	ensureChat: (chatId: string) => void
	removeChat: (chatId: string) => void
	addMessage: (chatId: string, message: ChatMessage) => void
	updateMessageStatus: (id: string, status: MessageStatus, description?: string) => void
	setRecipientProfile: (chatId: string, profile: RecipientProfile) => void
	setInstanceState: (state: InstanceState) => void
	setPollingError: (message: string) => void
}

const emptySession = {
	config: null,
	chatId: '',
	chats: [],
	instanceState: null,
	pollingError: ''
} satisfies Pick<ChatState, 'config' | 'chatId' | 'chats' | 'instanceState' | 'pollingError'>

export const useChatStore = create<ChatState>()(
	persist(
		set => ({
			...emptySession,
			connect: ({ chatId, ...config }) =>
				set(state => {
					const chats = isSameInstance(state.config, config) ? state.chats : []
					const hasChat = chats.some(chat => chat.chatId === chatId)

					return {
						config,
						chatId,
						chats: hasChat ? chats : [createChat(chatId), ...chats],
						instanceState: null,
						pollingError: ''
					}
				}),
			disconnect: () => {
				set(emptySession)
				useChatStore.persist.clearStorage()
			},
			selectChat: chatId => set({ chatId }),
			ensureChat: chatId =>
				set(state =>
					state.chats.some(chat => chat.chatId === chatId)
						? { chatId: state.chatId || chatId }
						: {
								chatId: state.chatId || chatId,
								chats: [createChat(chatId), ...state.chats]
							}
				),
			removeChat: chatId =>
				set(state => {
					const chats = state.chats.filter(chat => chat.chatId !== chatId)
					const nextActiveChat = [...chats].sort((a, b) => b.updatedAt - a.updatedAt)[0]

					return {
						chats,
						chatId: state.chatId === chatId ? nextActiveChat?.chatId || '' : state.chatId
					}
				}),
			addMessage: (chatId, message) =>
				set(state => ({
					chats: state.chats.map(chat => {
						if (chat.chatId !== chatId) return chat
						if (chat.messages.some(item => item.id === message.id)) return chat

						return {
							...chat,
							messages: [...chat.messages, message],
							updatedAt: message.timestamp
						}
					})
				})),
			updateMessageStatus: (id, status, statusDescription) =>
				set(state => ({
					chats: state.chats.map(chat => ({
						...chat,
						messages: chat.messages.map(message =>
							message.id === id ? { ...message, status, statusDescription } : message
						)
					}))
				})),
			setRecipientProfile: (chatId, profile) =>
				set(state => ({
					chats: state.chats.map(chat =>
						chat.chatId === chatId
							? {
									...chat,
									recipientName: profile.recipientName ?? chat.recipientName,
									avatarUrl: profile.avatarUrl ?? chat.avatarUrl
								}
							: chat
					)
				})),
			setInstanceState: instanceState => set({ instanceState }),
			setPollingError: pollingError => set({ pollingError })
		}),
		{
			name: 'green-api-chat-session',
			version: 1,
			partialize: state => ({
				config: state.config,
				chatId: state.chatId,
				chats: state.chats
			})
		}
	)
)

function createChat(chatId: string): ChatThread {
	return {
		chatId,
		recipientName: '',
		avatarUrl: '',
		messages: [],
		updatedAt: Date.now()
	}
}

function isSameInstance(current: GreenApiConfig | null, next: GreenApiConfig) {
	return (
		current?.apiUrl === next.apiUrl &&
		current.idInstance === next.idInstance &&
		current.apiTokenInstance === next.apiTokenInstance
	)
}
