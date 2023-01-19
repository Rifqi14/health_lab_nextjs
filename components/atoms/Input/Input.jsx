import Image from 'next/image';
import React, { useEffect, useRef } from 'react';

const Input = props => {
  const {
    readonly = false,
    placeholder,
    id,
    name,
    value = '',
    type,
    required,
    disabled,
    prefixIcon,
    className,
    onChange,
    isFixedValue = false
  } = props;
  return (
    <div className={`relative text-gray-600 focus-within:text-gray-400`}>
      <span className={`absolute inset-y-0 left-0 flex items-center pl-2`}>
        {prefixIcon && <Image src={prefixIcon} alt={name} />}
      </span>
      <input
        type={type}
        id={id}
        className={`${className} ${
          !readonly && 'border focus:ring-blue-300 focus:border-blue-300'
        } read-only:border-b read-only:outline-none read-only:ring-0 read-only:rounded-none disabled:rounded-lg disabled:bg-[#E6E6E6] disabled:border-[#C9CFD6] rounded-lg border-[#C9CFD6] text-black read-only:cursor-default text-sm block w-full p-2 ${
          prefixIcon && 'pl-8'
        }`}
        placeholder={placeholder}
        value={isFixedValue ? value : (value || props.field?.value)}
        onChange={text => {
          props.form?.handleChange(text);
          onChange && onChange(text);
        }}
        required={required}
        disabled={disabled}
        readOnly={readonly}
        name={name || props.field?.name}
        onBlur={() => {
          props.form?.setFieldTouched(props.field?.name);
          props.field?.onBlur(props.field?.name);
        }}
        min={0}
      />
      {props.form?.errors[props.field?.name] && (
        <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
          {props.form?.errors[props.field?.name]}
        </p>
      )}
    </div>
  );
};

export default Input;
