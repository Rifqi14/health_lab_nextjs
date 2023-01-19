import Image from "next/image";
import React from "react";

const InputCurrency = (props) => {
  const toCurrency = (number) => {
    return addCommas(removeNonNumeric(number))
  };
  const addCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const removeNonNumeric = num => num.toString().replace(/[^0-9]/g, "");
  const {
    readonly = false,
    placeholder,
    id,
    name,
    value = props.field?.value,
    type,
    required,
    disabled,
    prefixIcon,
    className,
    onChange,
  } = props;
  return (
    <div className="relative text-gray-600 focus-within:text-gray-400">
      <span className="absolute inset-y-0 left-0 flex items-center pl-2">
        {prefixIcon && <Image src={prefixIcon} alt={name} />}
      </span>
      <input
        type={`text`}
        id={id}
        className={`${className} ${
          !readonly && "border focus:ring-blue-300 focus:border-blue-300"
        } read-only:border-b read-only:outline-none read-only:ring-0 read-only:rounded-none disabled:rounded-lg disabled:bg-disabledItem disabled:border-light-shade rounded-lg border-light-shade text-black read-only:cursor-default text-sm block w-full p-2 ${
          prefixIcon && "pl-8"
        }`}
        placeholder={placeholder}
        value={
          toCurrency(value)
        }
        onChange={(text) => {
          props.form?.handleChange(text);
          onChange && onChange(text);
        }}
        required={required}
        disabled={disabled}
        readOnly={readonly}
        name={name}
        onBlur={() => {
          props.form?.setFieldTouched(props.field?.name);
          props.field?.onBlur(props.field?.name);
        }}
        min={0}
      />
      {props.form?.errors[props.field?.name] && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
          {props.form?.errors[props.field?.name]}
        </p>
      )}
    </div>
  );
};

export default InputCurrency;
