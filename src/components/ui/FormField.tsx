type FormFieldProps = {
  name: string
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
  error?: string
  type?: string
  inputMode?: 'numeric' | 'tel'
  autoComplete?: string
}

export function FormField({
  name,
  label,
  error,
  onChange,
  ...inputProps
}: FormFieldProps) {
  const errorId = `${name}-error`

  return (
    <label className="grid gap-2">
      <span className="text-xs font-bold text-[#50566d]">{label}</span>
      <input
        {...inputProps}
        name={name}
        className={`h-13 w-full rounded-[13px] border bg-[#f8f9fc] px-4 text-ink outline-none transition placeholder:text-[#b0b4c3] focus:bg-white focus:ring-4 ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-[#eceef4] focus:border-[#8d89ff] focus:ring-brand/10'}`}
        onChange={event => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        required
      />
      {error && (
        <span id={errorId} className="text-xs text-red-500">
          {error}
        </span>
      )}
    </label>
  )
}
