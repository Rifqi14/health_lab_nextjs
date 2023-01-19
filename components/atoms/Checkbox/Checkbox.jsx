import React from 'react';

const Checkbox = props => {
  const {
    checked,
    disabled,
    name,
    value,
    label,
    isGroup = false,
    onChange = () => {}
  } = props;
  return (
    <div className='flex items-center'>
      <input
        disabled={disabled}
        checked={checked || props.field?.value?.includes(value)}
        id={name}
        name={name || props.field?.name}
        type='checkbox'
        onChange={e => {
          props.form?.setFieldValue(
            props.field?.name,
            !isGroup
              ? e.target.value
              : e.target.checked
              ? [...props.form?.values[props.field?.name], e.target.value]
              : props.form?.values[props.field?.name].filter(
                  item => item !== e.target.value
                )
          );
          onChange(e);
        }}
        defaultValue={value || props.form?.values[props.field?.name]}
        className='w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 '
      />
      <label
        htmlFor={name}
        className={`ml-2 text-sm font-medium ${
          !disabled ? 'text-black' : ' text-gray-400'
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
