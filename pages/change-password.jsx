import { MainLayout } from 'components/organisms';
import { interceptorResponseErr } from 'components/utils/interceptor';
import { getItemLocalStorage } from 'components/utils/localstorage';
import axios from 'axios';
import ModalConfirmation from 'components/Modals/ModalConfirmation';
import ModalSuccess from 'components/Modals/ModalsSendLink';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { useState } from 'react';
import assets from '../public';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useEffect } from 'react';
import { Button, Input, Modal, Typography } from 'components/atoms';
import Link from 'next/link';

const ChangePassword = () => {
  const [show, setShow] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState(false);
  const handleShowPass = () => {
    setShow(!show);
  };

  const router = useRouter();

  // const URL = process.env.NEXT_PUBLIC_API_URL;
  // const ls = JSON?.parse(getItemLocalStorage('AUTH'));

  const onChangePassword = async () => {
    const data = {
      currentPassword: currentPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword
    };

    try {
      axios.interceptors.response.use(
        res => res,
        error => interceptorResponseErr(error)
      );
      const res = await axios.put(`${URL}/api/v1/users/change-password`, data, {
        headers: {
          Authorization: `${ls.scheme} ${ls.token}`
        }
      });
      setShowModal(false);
      setShowModalSuccess(true);
    } catch (error) {
      setError(true);
      return error;
    }
  };

  const handleChange = value => {
    setCurrentPassword(value);
  };
  const validationSchema = yup.object().shape({
    currentPassword: yup.string().required('Current Password is required'),
    newPassword: yup.string().required('New Password is required'),
    confirmPassword: yup.string().when('newPassword', {
      is: val => (val && val.length > 0 ? true : false),
      then: yup
        .string()
        .oneOf([yup.ref('newPassword')], 'Both password need to be the same')
    })
  });

  const disabledButton = () => {
    if (
      currentPassword !== '' &&
      newPassword !== '' &&
      confirmPassword !== ''
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  useEffect(() => {
    disabledButton();
  }, [currentPassword, newPassword, confirmPassword]);

  return (
    <>
      <Head>
        <title>Bumame CMS</title>
        <link
          rel='icon'
          href={`${
            process.env.NEXT_PUBLIC_PREFIX_URL || 'housecall'
          }/favicon.ico`}
        />
      </Head>

      <MainLayout
        height={'h-full'}
        headline={'Change Password'}
        breadcrumb={[
          {
            link: 'change-password',
            name: 'Change Password'
          }
        ]}
      >
        <main
          className={'flex flex-col bg-white rounded-lg shadow-lg p-7 mb-5'}
        >
          <p className='my-4 font-bold text-lg'>Change Password</p>
          <p className='text-coolGray text-base'>
            Your new password must be different from previous used password
          </p>
          <Formik
            initialValues={{
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            }}
            validationSchema={validationSchema}
            enableReinitialize
          >
            {({ errors, handleBlur, touched }) => {
              return (
                <Form>
                  <div className='mt-4 w-[400px]'>
                    <label className='pb-[5px] pt-5'>Current Password</label>
                    <div className='mb-4 p-2 rounded-[5px] border-solid border-2 flex '>
                      <input
                        type={show ? 'text' : 'password'}
                        name='currentPassword'
                        className='w-full outline-none bg-transparent border-none'
                        onChange={e => handleChange(e.target.value)}
                        value={currentPassword}
                        onBlur={handleBlur}
                      />
                      {show ? (
                        <Image
                          className='hover:cursor-pointer'
                          src={assets.EyeOpen}
                          alt=''
                          onClick={handleShowPass}
                        />
                      ) : (
                        <Image
                          className='hover:cursor-pointer'
                          src={assets.EyeClose}
                          alt=''
                          onClick={handleShowPass}
                        />
                      )}
                    </div>
                    {currentPassword === '' && touched.currentPassword ? (
                      <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                        {errors.currentPassword}
                      </p>
                    ) : null}

                    <label className='pb-[5px] pt-5'>New Password</label>
                    <div className='mb-4 p-2 rounded-[5px] border-solid border-2 flex'>
                      <Field
                        as='input'
                        type={showNewPassword ? 'text' : 'password'}
                        name='newPassword'
                        className='w-full outline-none bg-transparent'
                        onChange={e => setNewPassword(e.target.value)}
                        value={newPassword}
                      />
                      {showNewPassword ? (
                        <Image
                          className='hover:cursor-pointer'
                          src={assets.EyeOpen}
                          alt=''
                          onClick={() => {
                            setShowNewPassword(!showNewPassword);
                          }}
                        />
                      ) : (
                        <Image
                          className='hover:cursor-pointer'
                          src={assets.EyeClose}
                          alt=''
                          onClick={() => {
                            setShowNewPassword(!showNewPassword);
                          }}
                        />
                      )}
                    </div>
                    {newPassword === '' && touched.newPassword ? (
                      <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                        {errors.newPassword}
                      </p>
                    ) : null}
                    <label className='pb-[5px] pt-5'>
                      Confirmation New Password
                    </label>
                    <div className='mb-4 p-2 rounded-[5px] border-solid border-2 flex'>
                      <Field
                        as='input'
                        type={showConfirmPassword ? 'text' : 'password'}
                        name='confirmPassword'
                        className='w-full outline-none bg-transparent'
                        onChange={e => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                      />
                      {showConfirmPassword ? (
                        <Image
                          className='hover:cursor-pointer'
                          src={assets.EyeOpen}
                          alt=''
                          onClick={() => {
                            setShowConfirmPassword(!showConfirmPassword);
                          }}
                        />
                      ) : (
                        <Image
                          className='hover:cursor-pointer'
                          src={assets.EyeClose}
                          alt=''
                          onClick={() => {
                            setShowConfirmPassword(!showConfirmPassword);
                          }}
                        />
                      )}
                    </div>
                    {newPassword !== confirmPassword ? (
                      <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                        Both password need to be the same
                      </p>
                    ) : null}
                  </div>
                </Form>
              );
            }}
          </Formik>
          <div className='flex justify-center mt-4'>
            <button
              className='px-6 bg-btnBlue rounded py-2 text-white disabled:bg-btn-cancel disabled:text-black'
              onClick={() => {
                setShowModal(true);
              }}
              disabled={!disabled}
            >
              Submit
            </button>
            <Link href='/'>
              <button className='px-6 bg-[#DDDDDD] ml-4 rounded py-2'>
                Cancel
              </button>
            </Link>
          </div>
        </main>
        <ModalConfirmation
          show={showModal}
          confirmation={`Confirmation`}
          desc1='Apakah anda yakin akan menyimpan data ini?'
          onHide={() => {
            setShowModal(false);
          }}
          handleYes={() => onChangePassword()}
        />
        <Modal
          setIsOpen={val => showModalSuccess(val)}
          width={`w-[27rem]`}
          title={`Success`}
          headless
          isOpen={showModalSuccess}
        >
          <div>
            <Image
              src={assets.ImageCheckedGreen}
              alt={`Success dialog image`}
            />
          </div>
          <Typography className={`pt-8`}>Password berhasil diubah</Typography>
          <div className='flex justify-center pt-8'>
            <Button
              onClick={() => router.push('/')}
              color={`white`}
              background={`bg-btnBlue`}
            >
              <Typography className={`text-white font-normal text-sm`}>
                OK
              </Typography>
            </Button>
          </div>
        </Modal>
        {/* <ModalSuccess
          show={showModalSuccess}
          desc="Password berhasil diubah"
          onHide={() => {
            setShowModalSuccess(false);
            route.push("/");
          }}
        /> */}
      </MainLayout>
    </>
  );
};

export default ChangePassword;
