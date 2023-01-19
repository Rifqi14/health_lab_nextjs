import assets from '@/public/index';
import {Button, Input, Label, Modal, Typography} from '@atoms';
import { labPartnerVerify } from 'components/store/actions/labPartner';
import { Field, Form, Formik } from 'formik';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

const RegistrasiLabPartnerOtp = props => {
  const router = useRouter();
  const dispatch = useDispatch();
  const ref = useRef();
  const selector = useSelector(state => state);
  const { labpartner } = selector;
  const [state, setState] = useState({
    formInitialValue: {
      otp: ''
    }
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const { token } = router.query;

  const validationSchema = Yup.object().shape({
    otp: Yup.string().required('This field is required')
  });


  const onSubmit = values => {
    dispatch(labPartnerVerify(token, values))
      .then(res => {
        if (res?.status === 200) {
          setSuccessModal(true);
          setIsSuccess(true);
        }
      })
      .catch(err => {
        alert(labpartner.alert.message);
      });
  };

  return (
    <>
      <Head>
        <title>Bumame CMS</title>
        <link
          rel='icon'
          href={`${process.env.NEXT_PUBLIC_PREFIX_URL || ''}/favicon.ico`}
        />
      </Head>
      <div className={`flex flex-col justify-center items-center h-screen`}>
        <div className={`min-w-[30rem] flex flex-col`}>
          <Image src={assets.Logo} alt={`Logo Bumame`} height={82} />
        </div>
        <div className={`flex flex-row items-center`}>
          <Typography className={`text-black text-sm font-semibold`}>
            Corporate
          </Typography>
          <div className={`w-1 h-1 mx-2 bg-black rounded-full`}></div>
          <Typography className={`text-black text-sm font-semibold`}>
            House Call
          </Typography>
          <div className={`w-1 h-1 mx-2 bg-black rounded-full`}></div>
          <Typography className={`text-black text-sm font-semibold`}>
            Lab Partner
          </Typography>
        </div>
        { isSuccess ? (
          <div className="flex flex-col justify-center items-center my-5 text-center">
            <Typography className={`text-xl text-black`}>Verifikasi OTP Berhasil, Anda dipersilakan meninggalkan laman ini</Typography>
          </div>
        ) : (
          <>
            <div className={`pt-14`}>
              <Typography
                className={`font-medium text-sm text-[#959CB6] text-center`}
              >
                Masukan No OTP untuk validasi data corporate
              </Typography>
            </div>
            <Formik
              initialValues={state.formInitialValue}
              onSubmit={values => {
                onSubmit(values);
              }}
              innerRef={ref}
              enableReinitialize
              validationSchema={validationSchema}
            >
              <Form>
                <div className={`flex flex-col items-center`}>
                  <div className={`min-w-[25rem] pt-10`}>
                    <Label htmlFor={`otp`}>No OTP</Label>
                    <Field component={Input} placeholder={`No OTP`} name={`otp`} />
                  </div>
                  <div className={`pt-12`}>
                    <Button
                      className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white mr-5`}
                      type={`submit`}
                    >
                      <Typography>Submit</Typography>
                    </Button>
                  </div>
                </div>
              </Form>
            </Formik>
            <div className={`sticky top-[93vh]`}>
              <Typography
                className={`font-medium text-sm text-[#959CB6] text-center`}
              >
                ©️ 2022 PT. Budimanmaju Megah Farmasi.
              </Typography>
            </div>
          </>
        )}
      </div>
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
              setSuccessModal(false)
            }}
            className={`bg-[#349EFF] rounded-lg hover:bg-[#349EFF] text-white`}
          >
            <Typography>OK</Typography>
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default RegistrasiLabPartnerOtp;
