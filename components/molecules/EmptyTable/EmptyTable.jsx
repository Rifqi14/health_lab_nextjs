import { Typography } from '@atoms';
import Image from 'next/image';
import React from 'react';

const EmptyTable = props => {
  const { colSpan, title, description, image = false } = props;
  return (
    <>
      <tr>
        <td colSpan={colSpan}>
          <div
            className={`py-12 w-full flex flex-col items-center space-y-[48px]`}
          >
            {image && (
              <Image src={image} width={200} height={110} alt={description} />
            )}
            <div className={`flex flex-col items-center`}>
              {title && (
                <Typography className={`text-base text-black font-medium`}>
                  {title}
                </Typography>
              )}
              {description && (
                <Typography className={`text-sm text-black font-normal`}>
                  {description}
                </Typography>
              )}
            </div>
          </div>
        </td>
      </tr>
    </>
  );
};

export default EmptyTable;
