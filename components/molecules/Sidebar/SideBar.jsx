import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import assets from '@/public/index.js';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSidebar } from 'components/store/actions/sidebar';
import {
  SIDEBAR,
  SidebarIcon,
  SideBarList,
  SIDEBAR_UNALLOWED_MODULE, CHANGE_SIDEBAR_MODE
} from '@constants/Sidebar';
import HouseCallButtonLabel from '@constants/HouseCallButtonLabel';
import { fetchRoleModuleAccess } from 'components/store/actions/role';
import { authCurrentUser } from '@actions';

function SideBar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { sidebar, auth, role } = useSelector(state => state);
  const sideBarList = [
    {
      id: 1,
      icon: assets.SidebarRoleManagement,
      title: 'Role Management',
      link: 'role-management',
      moduleCode: 'role-management'
    },
    {
      id: 2,
      icon: assets.SidebarUserManagement,
      title: 'User Management',
      link: 'user-management',
      moduleCode: 'user-management'
    },
    {
      id: 3,
      icon: assets.SidebarMasterCorporate,
      title: 'Master Corporate',
      link: 'master-corporate',
      moduleCode: 'master-corporate'
    },
    {
      id: 4,
      icon: assets.SidebarTransaction,
      title: 'Transaction Payment Code',
      link: 'transaction-payment-code',
      moduleCode: 'transaction-payment-code'
    },
    {
      id: 5,
      icon: assets.SidebarKerjasama,
      title: 'Master Ketentuan Kerjasama',
      link: 'master-ketentuan-kerjasama',
      moduleCode: 'master-cooperation-termId'
    },
    {
      id: 6,
      icon: assets.SidebarLab,
      title: 'Registrasi Lab Partner',
      link: 'registrasi-lab-partner',
      moduleCode: 'registrasi-lab-partner'
    },
    {
      id: 7,
      icon: assets.SidebarLabTransaction,
      title: 'Lab Partner Transaction',
      link: 'lab-partner-transaction',
      moduleCode: 'lab-partner-transaction'
    }
  ];
  const [allowedModules, setAllowedModules] = useState([]);
  // const [allowedSidebar, setAllowedSidebar] = useState([]);

  useEffect(() => {
    if (!sidebar || sidebar.modules.length === 0) {
      dispatch(fetchSidebar());
    }
    if (!auth.currentLoginUser) {
      dispatch(authCurrentUser());
    }
    // if (role.roleModules?.length <= 0 && auth.currentLoginUser) {
    //   dispatch(fetchRoleModuleAccess(auth.currentLoginUser?.roleCode));
    // } else {
    //   if (sidebar.unAllowedModules?.length <= 0) {
    //     dispatch({
    //       type: SIDEBAR_UNALLOWED_MODULE,
    //       payload: role.roleModules?.map(item => {
    //         if (item.statusData === 'Active') {
    //           return item.moduleCode;
    //         }
    //       })
    //     });
    //   }
    //   if (sidebar.sideBar?.length <= 0) {
    //     dispatch({
    //       type: SIDEBAR,
    //       payload: SideBarList.filter(item => {
    //         if (sidebar.unAllowedModules?.includes(item.moduleCode)) {
    //           return item;
    //         }
    //       })
    //     });
    //   }
    // }
  }, [auth.currentLoginUser, dispatch, sidebar]);

  const handleChangeSidebarMode = () => {
    dispatch({ type: CHANGE_SIDEBAR_MODE, payload: !sidebar.active });
  }

  useEffect(() => {
    dispatch(authCurrentUser());
    console.log(sidebar.active)
  //   if(router.pathname !== '/login'){
  //     dispatch(authCurrentUser()).then((res) => {
  //       const moduleCodes = res.payload.roleModules.map((item) => {
  //         return item.moduleCode;
  //       });
  //       const allowedSideBarList = SideBarList.filter((item) => {
  //         return moduleCodes.includes(item.moduleCode);
  //       });
  //       setAllowedSidebar(allowedSideBarList);
  //     });
  //   }
  }, []);

  return (
    <div className='min-h-screen flex flex-col'>
      <div className={`flex bg-white items-center py-2 ${!sidebar.active && 'pb-5'}`} style={{minWidth: 80}}>
        <div className={'ml-7 mr-2' }>
          <Image  src={sidebar.active ? assets.Logo : assets.FavIconSVG} alt='bumame' />
        </div>
        <span className={sidebar.active &&'pl-28'}></span>
        <Image className={sidebar.active ? 'hover:cursor-pointer' : 'rotate-180 hover:cursor-pointer'}
               onClick={() => handleChangeSidebarMode()}
               src={assets.DoubleArrow} alt='arrow'
        />
      </div>
      <div className={`bg-primary h-full text-white ${sidebar.active ? 'w-80' : 'w-30'}`}>
        <div className='pt-10'>
          {sidebar?.allowedSidebar?.map(item => (
            <div
              key={item.id}
              className={`${sidebar.active && 'pl-8'} hover:cursor-pointer hover:bg-isActive ${
                router.pathname.includes(item.link) && 'bg-isActive'
              }`}
            >
              <Link href={`/${item.link}`}>
                <div className={sidebar.active ? 'flex py-4' :  'py-4 flex flex-col items-center'}>
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={20}
                    height={20}
                  />
                  {sidebar.active && (
                    <p className='ml-2'>{item.title}</p>
                  )
                  }

                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default SideBar
