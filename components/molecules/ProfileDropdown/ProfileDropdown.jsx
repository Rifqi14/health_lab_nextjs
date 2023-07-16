import { Avatar, Typography } from 'components/atoms';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import authSlice from 'features/authSlice';
import { removeItemLocalStorage } from '../../utils/localstorage';
import { useRouter } from 'next/router';
import { authCurrentUser, authlogout } from '../../store/actions/auth/index';
import assets from 'public/index';
import Dropdown from './Dropdown';
import OnClickOut from 'react-onclickoutside';

const ProfileDropdown = props => {
  const { username, usernameAlias, className } = props;
  const [isClicked, setIsClicked] = useState(false);
  const dispatch = useDispatch();
  const state = useSelector(state => state);
  const { auth } = state;
  const [userInitial, setUserInitial] = useState(undefined);

  const isClickedHandler = () => {
    setIsClicked(!isClicked);
  };

  ProfileDropdown.handleClickOutside = () => {
    setIsClicked(false);
  };

  const getUserInitial = userName => {
    const names = userName.split(' ');
    const initials = '';

    for (const i in names) {
      initials += names[i].substring(0, 1).toUpperCase();
    }

    setUserInitial(initials);
  };

  useEffect(() => {
    if (!auth.currentLoginUser) {
      dispatch(authCurrentUser());
    }
    if (Boolean(!userInitial)) {
      const { currentLoginUser } = auth || {};
      const { name } = currentLoginUser || {};
      getUserInitial(name || 'John Doe');
    }
  }, [auth]);

  return (
    <>
      <div className={`${className} pr-8`}>
        <button
          id='dropdownAvatar'
          className='flex items-center cursor-pointer'
          onClick={isClickedHandler}
        >
          <Typography
            color={'text-[#434349]'}
            weight={'font-medium'}
            size={'text-sm'}
            className={'pr-4'}
          >
            {auth.currentLoginUser?.name}
          </Typography>
          <Avatar text={userInitial} />
        </button>
        {isClicked && <Dropdown />}
      </div>
    </>
  );
};

const clickOutsideConfig = {
  handleClickOutside: () => ProfileDropdown.handleClickOutside
};

export default OnClickOut(ProfileDropdown, clickOutsideConfig);
