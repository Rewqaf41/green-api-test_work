import axios from 'axios'
import type {
  ContactInfo,
  GreenApiConfig,
  Notification,
  SendMessageResponse,
  StateInstanceResponse,
} from '../types/chat'

const RECEIVE_TIMEOUT_SECONDS = 60
const HTTP_TIMEOUT_MS = 65_000

function buildMethodUrl(config: GreenApiConfig, method: string) {
  const apiUrl = config.apiUrl.trim().replace(/\/+$/, '')
  const id = encodeURIComponent(config.idInstance)
  const token = encodeURIComponent(config.apiTokenInstance)

  return `${apiUrl}/waInstance${id}/${method}/${token}`
}

export async function sendMessage(
  config: GreenApiConfig,
  chatId: string,
  message: string,
) {
  const { data } = await axios.post<SendMessageResponse>(
    buildMethodUrl(config, 'sendMessage'),
    { chatId, message },
    { headers: { 'Content-Type': 'application/json' } },
  )

  return data
}

export async function getContactInfo(
  config: GreenApiConfig,
  chatId: string,
  signal?: AbortSignal,
) {
  const { data } = await axios.post<ContactInfo>(
    buildMethodUrl(config, 'getContactInfo'),
    { chatId },
    { signal, headers: { 'Content-Type': 'application/json' } },
  )

  return data
}

export async function getStateInstance(
  config: GreenApiConfig,
  signal?: AbortSignal,
) {
  const { data } = await axios.get<StateInstanceResponse>(
    buildMethodUrl(config, 'getStateInstance'),
    { signal },
  )

  return data
}

export async function receiveNotification(
  config: GreenApiConfig,
  signal: AbortSignal,
) {
  const { data } = await axios.get<Notification | null>(
    buildMethodUrl(config, 'receiveNotification'),
    {
      params: { receiveTimeout: RECEIVE_TIMEOUT_SECONDS },
      signal,
      timeout: HTTP_TIMEOUT_MS,
    },
  )

  return data
}

export async function deleteNotification(
  config: GreenApiConfig,
  receiptId: number,
  signal: AbortSignal,
) {
  await axios.delete(
    `${buildMethodUrl(config, 'deleteNotification')}/${receiptId}`,
    { signal },
  )
}

export function getApiErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : 'Произошла неизвестная ошибка'
  }

  const data = error.response?.data as
    | { message?: string; error?: string; details?: string }
    | string
    | undefined

  if (typeof data === 'string' && data) return data
  if (data && typeof data === 'object') {
    return data.message || data.error || data.details || error.message
  }

  return error.message || 'GREEN-API не отвечает'
}
