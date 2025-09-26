import React from 'react';
import ReactSelect, { Props as ReactSelectProps } from 'react-select';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends ReactSelectProps<SelectOption, false> {
  label?: string;
  options: SelectOption[];
  value: SelectOption | null;
  onChange: (option: SelectOption | null) => void;
  placeholder?: string;
  isDisabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  isDisabled,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-textSecondary text-sm font-medium">{label}</label>}
      <ReactSelect
        classNamePrefix="react-select"
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isClearable
        {...props}
      />
    </div>
  );
};

export default Select;
