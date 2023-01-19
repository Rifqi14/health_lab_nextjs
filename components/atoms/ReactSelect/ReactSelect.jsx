import React from 'react';
import Select from 'react-select';

const ReactSelect = props => {
  const {
    options,
    defaultValue,
    isDisabled,
    name,
    className,
    isMulti,
    readonly,
    placeholder,
    onChange,
    onChangeInput
  } = props;
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: '38.89px',
      border: '1px solid #C9CFD6',
      borderRadius: '0.5rem',
      minWidth: '13rem'
    }),
    menuPortal: base => ({
      ...base,
      zIndex: 9999
    })
  };
  return (
    <>
      {readonly ? (
        <input
          type={`text`}
          id={name}
          onChange={onChangeInput}
          className={`read-only:border-b read-only:outline-none read-only:ring-0 read-only:rounded-none disabled:rounded-lg disabled:bg-[#E6E6E6] disabled:border-[#C9CFD6] border-[#C9CFD6] text-black read-only:cursor-default text-sm block w-full p-2`}
          placeholder={placeholder}
          defaultValue={defaultValue || props.field?.value}
          disabled={isDisabled}
          readOnly={readonly}
          name={name || props.field?.name}
        />
      ) : (
        <Select
          styles={customStyles}
          isMulti={isMulti}
          name={name}
          value={
            defaultValue
              ? defaultValue
              : props.field?.value
              ? props.field?.value
              : null
          }
          menuPortalTarget={document.body}
          onChange={option => {
            props.form?.setFieldValue(props.field?.name, option);
            onChange && onChange(option);
          }}
          isClearable
          isSearchable
          options={options}
          className={`${className} basic-multi-select`}
          classNamePrefix='select'
          placeholder={placeholder}
          onInputChange={onChangeInput}
        />
      )}
    </>
  );
};

export default ReactSelect;
