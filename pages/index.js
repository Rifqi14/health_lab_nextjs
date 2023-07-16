import Head from 'next/head';
// import SideBar from '../components/Sidebar/SideBar'
import Modals from '../components/Modals/ModalsSendLink';
import { Header, MainLayout } from 'components/organisms';
import authSlice from '/features/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextResponse } from 'next/server';
import assets from '../public';

export default function Home() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Health Lab CMS</title>
        <link
          rel='icon'
          href={`${
            process.env.NEXT_PUBLIC_PREFIX_URL || 'housecall'
          }/favicon.ico`}
        />
      </Head>

      <div className='flex justify-between'>
        {/* <SideBar /> */}

        <Modals />
      </div>

      <MainLayout height={`h-screen`}></MainLayout>
    </>
  );
}
