import { ArrowLeft, Phone, X } from 'lucide-react'
import type { SubmitEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { recipientPhoneSchema } from '../../../schemas/connectionSchema'
import { formatRussianPhoneInput, phoneToChatId } from '../../../utils/phone'

type NewChatDialogProps = {
	isOpen: boolean
	onClose: () => void
	onCreate: (chatId: string) => void
}

export function NewChatDialog({ isOpen, onClose, onCreate }: NewChatDialogProps) {
	const [phone, setPhone] = useState('+7')
	const [error, setError] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)
	const handleClose = useCallback(() => {
		setPhone('+7')
		setError('')
		onClose()
	}, [onClose])

	useEffect(() => {
		if (!isOpen) return

		const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 0)
		return () => window.clearTimeout(focusTimer)
	}, [isOpen])

	useEffect(() => {
		if (!isOpen) return

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') handleClose()
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [handleClose, isOpen])

	if (!isOpen) return null

	function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault()

		const result = recipientPhoneSchema.safeParse(phone)
		if (!result.success) {
			setError(result.error.issues[0]?.message || 'Проверьте номер телефона')
			return
		}

		onCreate(phoneToChatId(result.data))
		handleClose()
	}

	return (
		<div
			className='fixed inset-0 z-50 grid bg-[#111827]/45 backdrop-blur-[2px] sm:place-items-center sm:p-5'
			role='presentation'
			onMouseDown={event => {
				if (event.target === event.currentTarget) handleClose()
			}}
		>
			<section
				className='flex min-h-full w-full flex-col bg-white sm:min-h-0 sm:max-w-105 sm:overflow-hidden sm:rounded-3xl sm:shadow-[0_28px_80px_rgba(20,28,50,.24)]'
				role='dialog'
				aria-modal='true'
				aria-labelledby='new-chat-title'
			>
				<header className='flex h-17 items-center gap-3 border-b border-[#e8ebf2] px-4 sm:px-5'>
					<button
						className='grid size-10 place-items-center rounded-full text-[#667085] transition hover:bg-[#f1f4f8]'
						type='button'
						onClick={handleClose}
						aria-label='Закрыть'
					>
						<ArrowLeft className='size-5 sm:hidden' aria-hidden='true' />
						<X className='hidden size-5 sm:block' aria-hidden='true' />
					</button>
					<h2 id='new-chat-title' className='text-[17px] font-bold text-[#172033]'>
						Новый чат
					</h2>
				</header>

				<form className='flex flex-1 flex-col p-5 sm:p-6' onSubmit={handleSubmit} noValidate>
					<h3 className='text-center text-xl font-bold text-[#172033]'>Введите номер телефона</h3>

					<label className='mt-6 grid gap-2'>
						<span className='text-xs font-semibold text-[#596174]'>Номер телефона</span>
						<div
							className={`flex h-14 items-center gap-3 rounded-[14px] border bg-[#f4f7fa] px-4 transition focus-within:bg-white focus-within:ring-4 ${error ? 'border-red-400 focus-within:ring-red-100' : 'focus-within:border-brand/50 focus-within:ring-brand/10 border-transparent'}`}
						>
							<Phone className='size-5 shrink-0 text-[#8e99aa]' aria-hidden='true' />
							<input
								ref={inputRef}
								className='min-w-0 flex-1 bg-transparent text-[17px] font-medium text-[#172033] outline-none placeholder:text-[#a5adba]'
								name='recipientPhone'
								type='tel'
								inputMode='tel'
								autoComplete='tel'
								value={phone}
								placeholder='+7 999 123-45-67'
								aria-invalid={Boolean(error)}
								aria-describedby={error ? 'new-chat-phone-error' : undefined}
								onChange={event => {
									setPhone(formatRussianPhoneInput(event.target.value))
									setError('')
								}}
							/>
						</div>
						{error && (
							<span id='new-chat-phone-error' className='text-xs text-red-500'>
								{error}
							</span>
						)}
					</label>

					<button
						className='bg-brand hover:bg-brand-dark mt-auto flex h-13 items-center justify-center rounded-[14px] text-sm font-bold text-white transition sm:mt-7'
						type='submit'
					>
						Начать чат
					</button>
				</form>
			</section>
		</div>
	)
}
