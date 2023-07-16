import assets from 'public/index';
import { Button, InputText, Modal, Typography } from 'components/atoms';
import Image from 'next/image';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useStore } from 'react-redux';
import { verifyOtp } from '../../components/store/actions/corporate';
import { clearError } from '../../components/store/actions/error';

const InputOtp = () => {
  const router = useRouter();
  const store = useStore(state => state);
  const { token } = router.query;
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();
  const state = store.getState();
  const { sidebar, auth, role } = state;
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const submitOtp = () => {
    dispatch(verifyOtp(token, otp)).then(res => {
      if (res && res.status === 200) {
        setSuccessModal(true);
        setIsSuccess(true);
      } else {
        setErrorMessage(res.response.data.message);
        setErrorModal(true);
      }
    });
  };
  return (
    <div className='w-screen bg-white h-screen flex flex-col justify-center items-center'>
      <div>
        <Image alt='' src={assets.Logo} />
      </div>
      <div className='flex text-black justify-center items-center'>
        <span className='mr-2'>Corporate</span>
        <Image src={assets.Ellipse} alt='' />
        <span className='mx-2'>House Call</span>
        <Image src={assets.Ellipse} alt='' />
        <span className='ml-2'>Lab Partner</span>
      </div>
      {isSuccess ? (
        <div className='flex flex-col justify-center items-center my-5'>
          <Typography className={`text-xl text-black`}>
            Verifikasi OTP Berhasil, Anda dipersilakan meninggalkan laman ini
          </Typography>
        </div>
      ) : (
        <>
          <div>
            <p className='text-[#959CB6]'>
              Masukan No OTP untuk validasi data corporate{' '}
            </p>
          </div>
          <div>
            <InputText
              className={'w-[350px]'}
              type={'text'}
              label={'No OTP'}
              onChange={e => setOtp(e.target.value)}
            />
          </div>
          <div className='flex my-10'>
            <Button
              paddingVertical={`py-2`}
              paddingHorizontal={`px-7`}
              background={`bg-btnBlue`}
              onClick={() => submitOtp()}
            >
              <Typography className={`text-white font-normal text-sm`}>
                Submit
              </Typography>
            </Button>
            <Button
              paddingVertical={`py-2`}
              paddingHorizontal={`px-7`}
              background={`bg-[#DDDDDD]`}
              className={'ml-3'}
            >
              <Typography className={`font-normal text-sm`}>Cancel</Typography>
            </Button>
          </div>
        </>
      )}
      <Modal
        setIsOpen={val => setSuccessModal(val)}
        width={`w-[27rem]`}
        title={`Success`}
        headless
        isOpen={successModal}
      >
        <div>
          <Image src={assets.check} alt={`Success dialog image`} />
        </div>
        <div className={`pt-10`}>
          <Typography>Verifikasi otp berhasil</Typography>
        </div>
        <div className={`pt-10`}>
          <Button
            onClick={() => {
              setSuccessModal(false);
            }}
            className={`bg-[#349EFF] rounded-lg hover:bg-[#349EFF] text-white`}
          >
            <Typography>OK</Typography>
          </Button>
        </div>
      </Modal>
      <Modal
        setIsOpen={val => setErrorModal(val)}
        width={`w-[27rem]`}
        title={`Error`}
        headless
        isOpen={errorModal}
      >
        <div>
          <Image src={assets.IconCross} alt={`Error dialog image`} />
        </div>
        <div className={`pt-10`}>
          <Typography>{errorMessage}</Typography>
        </div>
        <div className={`pt-10`}>
          <Button
            onClick={() => {
              setErrorModal(false);
            }}
            className={`bg-[#349EFF] rounded-lg hover:bg-[#349EFF] text-white`}
          >
            <Typography>OK</Typography>
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default InputOtp;
