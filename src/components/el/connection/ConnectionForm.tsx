import { ArrowRight, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import type { SubmitEvent } from 'react'
import {
  connectionSchema,
  type ConnectionFormData,
} from '../../../schemas/connectionSchema'
import type { ConnectionData } from '../../../types/chat'
import { formatRussianPhoneInput, phoneToChatId } from '../../../utils/phone'
import { FormField } from '../../ui/FormField'

const initialForm: ConnectionFormData = {
  apiUrl: 'https://api.green-api.com',
  idInstance: '',
  apiTokenInstance: '',
  recipientPhone: '+7',
}

type ConnectionFormProps = {
  onConnect: (data: ConnectionData) => void
}

type FormErrors = Partial<Record<keyof ConnectionFormData, string>>

export function ConnectionForm({ onConnect }: ConnectionFormProps) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})

  function updateField(field: keyof ConnectionFormData, value: string) {
    setForm(current => ({ ...current, [field]: value }))
    setErrors(current => ({ ...current, [field]: undefined }))
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = connectionSchema.safeParse(form)
    if (!result.success) {
      setErrors(getFormErrors(result.error.issues, form))
      return
    }

    setErrors({})
    onConnect({
      apiUrl: result.data.apiUrl,
      idInstance: result.data.idInstance,
      apiTokenInstance: result.data.apiTokenInstance,
      chatId: phoneToChatId(result.data.recipientPhone),
    })
  }

  return (
    <div className="w-full max-w-125">
      <MobileBrand />
      <div className="text-[13px] font-extrabold tracking-[.12em] text-brand uppercase">
        Подключение
      </div>
      <h1 className="my-3 text-4xl leading-[1.08] font-extrabold tracking-[-.045em] md:text-[clamp(34px,4vw,50px)]">
        Начните общение
      </h1>
      <p className="mb-8 text-[15px] leading-relaxed text-muted">
        Укажите данные инстанса GREEN-API и номер телефона получателя.
      </p>

      <form className="grid gap-4.5" onSubmit={handleSubmit} noValidate>
        <FormField
          name="apiUrl"
          label="API URL"
          type="url"
          value={form.apiUrl}
          placeholder="https://api.green-api.com"
          error={errors.apiUrl}
          onChange={value => updateField('apiUrl', value)}
        />
        <FormField
          name="idInstance"
          label="idInstance"
          value={form.idInstance}
          placeholder="3100000000"
          inputMode="numeric"
          error={errors.idInstance}
          onChange={value => updateField('idInstance', value)}
        />
        <FormField
          name="apiTokenInstance"
          label="apiTokenInstance"
          type="password"
          value={form.apiTokenInstance}
          placeholder="Токен инстанса"
          autoComplete="off"
          error={errors.apiTokenInstance}
          onChange={value => updateField('apiTokenInstance', value)}
        />
        <FormField
          name="recipientPhone"
          label="Номер телефона получателя"
          type="tel"
          value={form.recipientPhone}
          placeholder="+7 999 123-45-67"
          inputMode="tel"
          error={errors.recipientPhone}
          onChange={value =>
            updateField('recipientPhone', formatRussianPhoneInput(value))
          }
        />
        <button
          className="mt-2 flex h-13.5 items-center justify-center gap-3 rounded-[14px] border-0 bg-brand font-bold text-white shadow-[0_14px_30px_rgba(97,92,255,.23)] transition hover:-translate-y-px hover:bg-brand-dark"
          type="submit"
        >
          Создать чат
          <ArrowRight className="size-4.5" aria-hidden="true" />
        </button>
      </form>

      <p className="mt-5.5 flex items-center justify-center gap-2 text-[11px] text-[#9ba0b1]">
        <LockKeyhole className="size-3.5" aria-hidden="true" />
        Данные используются только в текущей вкладке и не сохраняются.
      </p>
    </div>
  )
}

function MobileBrand() {
  return (
    <div className="mb-10 flex items-center gap-3 text-[13px] font-extrabold tracking-[.08em] md:hidden">
      <div className="grid size-11 place-items-center rounded-[14px] bg-linear-to-br from-[#8d85ff] to-[#514bff] text-xl font-extrabold text-white shadow-[0_12px_32px_rgba(23,18,117,.24)]">
        M
      </div>
      <span>Чат для MAX / WhatsApp / Telegram</span>
    </div>
  )
}

function getFormErrors(
  issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>,
  form: ConnectionFormData,
) {
  const errors: FormErrors = {}

  for (const issue of issues) {
    const field = issue.path[0]
    if (
      typeof field === 'string' &&
      field in form &&
      !errors[field as keyof ConnectionFormData]
    ) {
      errors[field as keyof ConnectionFormData] = issue.message
    }
  }

  return errors
}
