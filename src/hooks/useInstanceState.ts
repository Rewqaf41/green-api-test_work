import { useQuery } from '@tanstack/react-query'
import { getStateInstance } from '../services/greenApi'
import { useChatStore } from '../store/chatStore'

export function useInstanceState() {
  const config = useChatStore(state => state.config)

  return useQuery({
    queryKey: ['instance-state', config?.idInstance],
    queryFn: ({ signal }) => getStateInstance(config!, signal),
    enabled: Boolean(config),
    staleTime: Infinity,
  })
}
