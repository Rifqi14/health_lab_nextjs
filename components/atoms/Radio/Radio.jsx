import React from 'react';

const Radio = props => {
  const {
    label,
    disabled = false,
    onClick = () => {},
    checked,
    id,
    value,
    name,
    className
  } = props;

  return (
    <>
      <div className={`flex items-center mb-4 ${className}`}>
        <input
          id={id}
          type='radio'
          value={value}
          name={name}
          className={`w-4 h-4 border-gray-300`}
          defaultChecked={checked && checked}
          disabled={disabled}
          onClick={onClick}
        />
        <label htmlFor={id} className='ml-2 text-sm font-medium text-gray-900'>
          {label}
        </label>
      </div>
    </>
  );
};

export default Radio;
