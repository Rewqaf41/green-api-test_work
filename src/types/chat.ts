export type GreenApiConfig = {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
}

export type ConnectionData = GreenApiConfig & {
  chatId: string
}
