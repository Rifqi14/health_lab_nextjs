import React from 'react';

type Props = {
  children: any;
  background: any;
  textColor?: any;
  rounded: any;
  border?: any;
  type: 'button' | 'submit' | 'reset' | undefined;
  isFull?: boolean;
  disabled: boolean;
  onclick: () => {};
  paddingVertical: any;
};

function Button({
  children,
  background,
  textColor,
  rounded,
  border,
  type,
  isFull,
  disabled,
  onclick,
  paddingVertical
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${
        textColor ? textColor : 'text-white'
      } ${background} hover:bg-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 ${
        isFull && 'w-full'
      }`}
      onClick={onclick}
    >
      {children}
    </button>
  );
}

export default Button;
