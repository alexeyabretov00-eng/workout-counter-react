import './Select.css'

export type SelectOption = { value: string; label: string }

export type SelectProps = {
  id: string
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  disabled?: boolean
}

export function Select({ id, label, value, options, onChange, disabled }: SelectProps) {
  return (
    <>
      <label htmlFor={id} className="select__label">
        {label}
      </label>
      <select
        id={id}
        className="select__field"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  )
}
