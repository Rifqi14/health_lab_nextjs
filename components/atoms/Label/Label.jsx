import React from 'react';

const Label = props => {
  const { htmlFor, className, children } = props;

  return (
    <>
      <label
        htmlFor={htmlFor}
        className={`${className} block mb-2 text-sm font-medium text-gray-900`}
      >
        {children}
      </label>
    </>
  );
};

export default Label;
