import { z } from 'zod'

export const recipientPhoneSchema = z
	.string()
	.trim()
	.refine(value => /^7\d{10}$/.test(value.replace(/\D/g, '')), 'Введите российский номер из 10 цифр')

export const connectionSchema = z.object({
	apiUrl: z
		.string()
		.trim()
		.pipe(
			z.url({
				protocol: /^https?$/,
				error: 'Введите корректный HTTP(S) URL'
			})
		),
	idInstance: z.string().trim().min(1, 'Введите idInstance').regex(/^\d+$/, 'idInstance должен содержать только цифры'),
	apiTokenInstance: z.string().trim().min(1, 'Введите apiTokenInstance'),
	recipientPhone: recipientPhoneSchema
})

export type ConnectionFormData = z.infer<typeof connectionSchema>
