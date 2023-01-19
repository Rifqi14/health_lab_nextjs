import React from 'react';

const Typography = props => {
  const { children, size, color, weight, className } = props;
  return (
    <>
      <span
        className={`${color} ${weight} ${
          className ? className : 'font-normal text-sm'
        }`}
        style={{ fontSize: size }}
      >
        {children}
      </span>
    </>
  );
};

export default Typography;
