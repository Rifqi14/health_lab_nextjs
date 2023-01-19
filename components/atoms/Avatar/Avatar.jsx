import React from 'react';
import Image from 'next/image';
import Typography from '../Typography/Typography';

const Avatar = props => {
  const {
    img,
    size = 32,
    isImage,
    text,
    textColor = 'text-white',
    bgColor = 'bg-[#F77712]',
    className,
    textClassName,
    userAlias
  } = props;

  return (
    <>
      <div
        style={{ width: size, height: size }}
        className={`rounded-full bg-danger ${className}`}
      >
        {isImage ? (
          <div className={`rounded ${bgColor} w-full h-full p-2`}>
            <Image
              src={img}
              height={size}
              width={size}
              layout={'responsive'}
              alt={`avatar-${img}`}
            />
          </div>
        ) : (
          <div
            className={`rounded ${bgColor} w-full h-full text-center flex items-center justify-center`}
          >
            <Typography
              size={'text-base'}
              color={textColor}
              weight={'font-medium'}
              className={`${textClassName} uppercase`}
            >
              {text}
            </Typography>
          </div>
        )}
      </div>
    </>
  );
};

export default Avatar;
