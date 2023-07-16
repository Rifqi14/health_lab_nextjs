import { Typography } from 'components/atoms';
import Link from 'next/link';
import React from 'react';

const BreadCrumb = props => {
  const { headline, breadcrumb } = props;

  return (
    <>
      <div className='flex w-full min-h-[3rem] bg-white items-center py-4 pl-11 drop-shadow-md'>
        <Typography className={`text-sm font-semibold text-[#434349]`}>
          {headline}
        </Typography>
        {headline && (
          <div className={`h-[1.2rem] bg-[#EBEDF2] mx-2 p-[1px]`}></div>
        )}
        <div className='w-auto flex items-center gap-2'>
          {breadcrumb &&
            breadcrumb.map((item, index) => (
              <div className='flex items-center gap-2' key={index}>
                <Link href={`${item.link}`}>
                  <a>
                    <Typography className={`text-sm font-medium text-coolGray`}>
                      {item.name}
                    </Typography>
                  </a>
                </Link>
                {breadcrumb.length - 1 !== index && (
                  <div
                    className={`w-1 h-1 mx-2 bg-coolGray rounded-full`}
                  ></div>
                )}
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default BreadCrumb;
