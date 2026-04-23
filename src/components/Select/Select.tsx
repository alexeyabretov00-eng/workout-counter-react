import { SelectLabel, SelectStyled } from './Select.styled';

export type SelectOption = { value: string; label: string };

export type SelectProps = {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
};

export const Select: React.FC<SelectProps> = ({
  id,
  label,
  value,
  options,
  onChange,
  disabled,
}) => {
  return (
    <>
      <SelectLabel htmlFor={id}>{label}</SelectLabel>
      <SelectStyled
        id={id}
        value={value}
        disabled={disabled}
        onChange={next => onChange(String(next))}
        options={options}
        popupMatchSelectWidth={false}
      />
    </>
  );
};
