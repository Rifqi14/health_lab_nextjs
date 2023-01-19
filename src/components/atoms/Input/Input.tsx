import React from 'react';

type Props = {
  show?: boolean;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  id?: string;
  labelFor?: string;
};

function Input({
  show = true,
  label,
  placeholder,
  isRequired,
  id,
  labelFor
}: Props) {
  return (
    <div>
      <label
        htmlFor={labelFor}
        className='block mb-1 text-sm font-medium text-gray-900'
      >
        {label}
      </label>
      <input
        id={id}
        placeholder={placeholder && placeholder}
        type={show ? 'text' : 'password'}
        className='border border-gray-300 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 '
        required={isRequired}
      />
    </div>
  );
}

export default Input;
