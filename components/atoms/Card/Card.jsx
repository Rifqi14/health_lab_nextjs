import React from 'react';

const Card = props => {
  const { children, padding, shadow, rounded, hidden, className } = props;
  return (
    <>
      <section
        className={`bg-white ${hidden && 'hidden'} ${
          rounded ? rounded : 'rounded-lg'
        } ${shadow ? shadow : 'shadow-lg'} ${
          padding ? padding : 'p-7'
        } ${className}`}
      >
        {children}
      </section>
    </>
  );
};

export default Card;
