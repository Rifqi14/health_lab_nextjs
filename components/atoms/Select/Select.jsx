import React from 'react';
import Input from '../Input/Input';

const Select = props => {
  const {
    id,
    multiple,
    disabled,
    children,
    name,
    onChanged,
    onClick = () => {},
    defaultValue,
    className,
    readOnly,
    placeholder,
    key
  } = props;

  return (
    <>
      {readOnly ? (
        <input
          type={`text`}
          id={id}
          className={`read-only:border-b read-only:outline-none read-only:ring-0 read-only:rounded-none disabled:rounded-lg disabled:bg-[#E6E6E6] disabled:border-[#C9CFD6] border-[#C9CFD6] text-black read-only:cursor-default text-sm block w-full p-2`}
          placeholder={placeholder}
          defaultValue={defaultValue || props.field?.value}
          disabled={disabled}
          readOnly={readOnly}
          name={name || props.field?.name}
        />
      ) : (
        <select
          id={id}
          className={`${
            className && className
          } border border-[#C9CFD6] text-black text-sm rounded-lg focus:ring-blue-300 focus:border-blue-300 block w-full p-2`}
          multiple={multiple}
          onChange={option => {
            props.form?.setFieldValue(props.field?.name, option.target?.value);
            onChanged && onChanged;
          }}
          disabled={disabled}
          name={name || props.field?.name}
          onClick={onClick}
          defaultValue={defaultValue ? defaultValue : props.field?.value}
        >
          {children}
        </select>
      )}
      {props.form?.errors[props.field?.name] && (
        <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
          {props.form?.errors[props.field?.name]}
        </p>
      )}
    </>
  );
};

export default Select;
