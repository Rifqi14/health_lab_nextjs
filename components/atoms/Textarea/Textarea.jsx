import React, { useRef } from 'react';

const Textarea = props => {
  const {
    readonly,
    placeholder,
    id,
    name,
    value,
    required,
    disabled,
    className,
    rows,
    onChange
  } = props;
  const ref = useRef(null);
  return (
    <textarea
      id={id}
      className={`${className} disabled:outline-none disabled:bg-[#E6E6E6] block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500`}
      placeholder={placeholder}
      ref={ref}
      readOnly={readonly}
      name={name}
      required={required}
      disabled={disabled}
      onChange={val => {
        props.form?.setFieldValue(props.field?.name, val.target?.value);
        onChange && onChange(val);
      }}
      rows={rows}
      value={value ? value : props.field?.value}
    />
  );
};

export default Textarea;
