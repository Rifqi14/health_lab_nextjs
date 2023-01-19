import Image from 'next/image';
import React from 'react';
import { bumameLogoWhite, bumameLoginImage } from '@images';
import { Colors } from '@constants';
import LoginForm from './LoginForm';

type Props = {};

function Login({}: Props) {
  return (
    <div className='flex flex-row h-screen'>
      <div className={`bg-bumame-primary lg:w-1/2 hidden lg:block`}>
        <div className='h-screen flex flex-col grid justify-items-center'>
          <div className='h-1/3 w-96 mt-6 xl:w-[550px] xl:h-[157px] xl:mt-28'>
            <Image
              src={bumameLogoWhite}
              alt='Bumame Logo White'
              layout='intrinsic'
            />
          </div>
          <div className='absolute bottom-0 xl:h-2/3 overflow-hidden flex flex-col'>
            <Image src={bumameLoginImage} alt='Bumame Login Image' />
          </div>
        </div>
      </div>
      <div className=' lg:w-1/2 w-screen flex flex-col'>
        <LoginForm />
        {/* Footer */}
        <div className='self-center mt-auto w-full text-center pb-5'>
          <span className='font-medium text-sm text-[#959CB6]'>
            ©️ 2022 PT. Budimanmaju Megah Farmasi.
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
