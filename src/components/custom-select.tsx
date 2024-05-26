"use client";

import { useMemo } from "react";

import { SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";

type Props = {
  options: { label: string; value: string }[];
  onCreate?: (value: string) => void;
  value?: string | null | undefined;
  disabled?: boolean;
  placeholder?: string;
  onChange: (value?: string) => void;
};

const CustomSelect = ({
  options,
  onCreate,
  value,
  disabled,
  placeholder,
  onChange,
}: Props) => {
  const onSelect = (option: SingleValue<{ label: string; value: string }>) => {
    onChange(option?.value);
  };

  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  return (
    <CreatableSelect
      isDisabled={disabled}
      onChange={onSelect}
      onCreateOption={onCreate}
      options={options}
      value={formattedValue}
      placeholder={placeholder}
      className="text-sm h-10"
      styles={{
        control: (base) => ({
          ...base,
          borderColor: "#e2e8f0",
          ":hover": {
            borderColor: "#e2e8f0",
          },
        }),
      }}
    />
  );
};

export default CustomSelect;
