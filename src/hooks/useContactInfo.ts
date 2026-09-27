import { useQuery } from '@tanstack/react-query'
import { getContactInfo } from '../services/greenApi'
import { useChatStore } from '../store/chatStore'

export function useContactInfo() {
  const config = useChatStore(state => state.config)
  const chatId = useChatStore(state => state.chatId)

  return useQuery({
    queryKey: ['contact-info', config?.idInstance, chatId],
    queryFn: ({ signal }) => getContactInfo(config!, chatId, signal),
    enabled: Boolean(config && chatId),
    staleTime: Infinity,
  })
}
