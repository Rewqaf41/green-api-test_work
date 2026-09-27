export function phoneToChatId(phone: string) {
  return `${phone.replace(/\D/g, '')}@c.us`
}

export function formatRussianPhoneInput(value: string) {
  const digits = value.replace(/\D/g, '')
  const digitsWithoutCountryCode =
    digits === '77' ? '' : digits.startsWith('7') ? digits.slice(1) : digits
  const nationalNumber = digitsWithoutCountryCode.slice(0, 10)
  const groups = [
    nationalNumber.slice(0, 3),
    nationalNumber.slice(3, 6),
    nationalNumber.slice(6, 8),
    nationalNumber.slice(8, 10),
  ].filter(Boolean)

  return groups.length > 0 ? `+7 ${groups.join('-')}`.replace('-', ' ') : '+7'
}

export function formatChatPhone(chatId: string) {
  const phone = chatId.replace(/@c\.us$/, '')
  return phone ? `+${phone}` : chatId
}
