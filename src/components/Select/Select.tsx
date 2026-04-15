import { SelectField, SelectLabel } from './Select.styled';

export type SelectOption = { value: string; label: string };

export type SelectProps = {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
};

export const Select = ({ id, label, value, options, onChange, disabled }: SelectProps) => {
  return (
    <>
      <SelectLabel htmlFor={id}>{label}</SelectLabel>
      <SelectField
        id={id}
        value={value}
        disabled={disabled}
        onChange={event => onChange(event.target.value)}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectField>
    </>
  );
};
