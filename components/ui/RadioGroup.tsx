import React from 'react';

interface RadioOption<T extends string> {
  value: T;
  label: string;
}

interface RadioGroupProps<T extends string> {
  label?: string;
  name: string;
  options: RadioOption<T>[];
  selectedValue: T;
  onChange: (value: T) => void;
  className?: string;
}

const RadioGroup = <T extends string>({
  label,
  name,
  options,
  selectedValue,
  onChange,
  className,
}: RadioGroupProps<T>) => {
  return (
    <div className={`flex flex-col gap-2 ${className || ''}`}>
      {label && <span className="text-textSecondary text-sm font-medium">{label}</span>}
      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <label key={option.value} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => onChange(option.value)}
              className="hidden"
            />
            <span
              className={`relative w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
                ${selectedValue === option.value ? 'border-primary bg-primary' : 'border-border bg-surface'}
              `}
            >
              {selectedValue === option.value && (
                <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
              )}
            </span>
            <span className="ml-2 text-text text-sm">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
