import React, { useState } from 'react';
import Image from 'next/image';
import assets from 'public/index.js';
import { Modal } from 'components/atoms';
import Modals from '../components/Modals/ModalsSendLink';
import axios from 'axios';
import Link from 'next/link';
import { interceptorResponseErr } from 'components/utils/interceptor';
import Head from 'next/head';

const ForgotPassword = () => {
  const [Data, setData] = useState(null);
  const [showModals, setShowModals] = useState(false);
  const [desc, setdesc] = useState();

  const URL = process.env.NEXT_PUBLIC_API_URL;

  const post = async e => {
    // e.preventDefault();

    try {
      if (Data === null) {
      } else {
        axios.interceptors.response.use(
          res => res,
          error => interceptorResponseErr(error)
        );
        const res = await axios.post(
          `${URL}/api/v1/users/forgot-password/${Data}`
        );
        setShowModals(true);
        setdesc(res.data.message);
      }
    } catch (err) {
      console.log(err);
      return setdesc(err.response.data.message), setShowModals(true);
    }
  };

  return (
    <>
      <Head>
        <title>Bumame CMS | forgotPassword</title>
        <link
          rel='icon'
          href={`${
            process.env.NEXT_PUBLIC_PREFIX_URL || '/housecall'
          }/favicon.ico`}
        />
      </Head>
      <div className='h-auto flex justify-center content-center '>
        <div className=' bg-[#F67612] w-full h-screen flex justify-center items-end'>
          <div className='flex flex-col mt-auto justify-between h-full'>
            <div className='flex justify-center mt-[50px]'>
              <Image alt='' src={assets.Logowhite} />
            </div>
            <div className=' flex justify-center'>
              <Image alt='' src={assets.Imagelogin} />
            </div>
          </div>
        </div>
        <div className='flex flex-col w-full justify-around items-center h-screen '>
          <div className='px-[127px] flex justify-center'>
            <Image alt='' src={assets.Logo} className=' px-20 ' />
          </div>
          <div className='font-bold font-md text-center flex justify-center'>
            <p>Corporate </p>
            <div className=' mx-1'>
              <Image alt='' src={assets.Ellipse} />
            </div>
            <p> House Call</p>
            <div className=' mx-1'>
              <Image alt='' src={assets.Ellipse} />
            </div>
          </div>
          <div className='px-[150px] pt-14'>
            <p className='text-center pb-10'>
              Please enter your email to request a password reset
            </p>
            <form
              // onSubmit={post}
              action=''
              method='post'
              className='flex flex-col'
            >
              <label className='pb-[5px]'>Email</label>
              <input
                type='text'
                name='email'
                className='h-[35px] rounded-[5px] p-2 border-[#C9CFD6] border-solid border-2'
                onChange={e => setData(e.target.value)}
              />
              <div className='flex mt-10 justify-center '>
                <button
                  type='button'
                  className='rounded-[5px] text-white bg-[#349EFF] w-95 h-10 px-8 py-2 mr-[25px]'
                  onClick={() => post()}
                >
                  Submit
                </button>
                <Link href='/login'>
                  <button
                    type='submit'
                    className='rounded-[5px] text-black bg-[#E0E0E0] w-95 h-10 px-8 py-2 '
                  >
                    Cancel
                  </button>
                </Link>
              </div>
            </form>
          </div>
          <div className='text-[#959CB6] flex text-center items-end'>
            <p>©️ 2022 PT. Budimanmaju Megah Farmasi. </p>
          </div>
        </div>
      </div>
      <Modals
        show={showModals}
        onHide={() => setShowModals(false)}
        desc1={'Link reset password berhasil dikirim melalui email.'}
      />
    </>
  );
};

export default ForgotPassword;
