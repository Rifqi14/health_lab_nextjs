import React from 'react';
import Image from 'next/image';

const Button = props => {
  const {
    children,
    background,
    rounded,
    border,
    type = 'button',
    disabled = false,
    onClick = () => {},
    paddingVertical = 'py-2',
    paddingHorizontal = 'px-8',
    emptyPadding = false,
    className,
    img
  } = props;

  return (
    <>
      <button
        type={type}
        disabled={disabled}
        className={`${border && 'border ' + border} ${background} ${rounded} ${
          !emptyPadding && paddingVertical
        } ${
          !emptyPadding && paddingHorizontal
        } justify-center rounded ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
