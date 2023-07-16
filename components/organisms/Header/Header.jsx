import { Typography } from 'components/atoms';
import { ProfileDropdown } from 'components/molecules';
import React from 'react';

const Header = props => {
  const { className } = props;
  return (
    <>
      <div
        className={`flex w-full bg-white h-fit py-[0.85rem] pl-7 items-center border-b-[1px] ${className}`}
      >
        <Typography className={`text-black text-xl font-semibold`}>
          Health Lab Corporate
        </Typography>
        <div className={`w-1 h-1 mx-2 bg-black rounded-full`}></div>
        <Typography className={`text-black text-xl font-semibold`}>
          House Call
        </Typography>
        <div className={`w-1 h-1 mx-2 bg-black rounded-full`}></div>
        <Typography className={`text-black text-xl font-semibold`}>
          Lab Partner
        </Typography>
        <ProfileDropdown
          username={'Super Admin'}
          usernameAlias={'SA'}
          className={`ml-auto pr-8`}
        />
      </div>
    </>
  );
};

export default Header;
