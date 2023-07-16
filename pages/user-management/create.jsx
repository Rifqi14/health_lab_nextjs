/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { MainLayout } from 'components/organisms';
import {
  Button,
  Label,
  Typography,
  In,
  Input,
  Modal,
  Select
} from 'components/atoms';
import InputText from 'components/atoms/Input/InputText';
import ModalConfirmation from 'components/Modals/ModalConfirmation';
import { useRouter } from 'next/router';
import axios from 'axios';
import { getItemLocalStorage } from 'components/utils/localstorage';
import { interceptorResponseErr } from 'components/utils/interceptor';
import { Formik, Field, Form } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { createRoleManagement } from 'components/store/actions/userManajement';
import Image from 'next/image';
import assets from 'public/index';
const CreateUser = () => {
  const router = useRouter();
  const [showModals, setShowModals] = useState(false);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [password, setPassword] = useState('');
  const [selectRole, setSelectRole] = useState([]);
  const [select, setSelect] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // const URL = process.env.NEXT_PUBLIC_API_URL;
  // const ls = JSON.parse(getItemLocalStorage('AUTH'));

  const data = {
    name: name,
    email: email,
    password: password,
    roleCode: select,
    statusData: status
  };
  const handlePost = () => {
    setOnSubmit(true);
    dispatch(createRoleManagement(data))
      .then(res => {
        setShowModals(false);
        setSuccess(true);
        setOnSubmit(false);
      })
      .catch(error => {
        setOnSubmit(false);
        setShowModals(false);
        setErrorModal(true);
      });
  };

  const generatePassword = async () => {
    try {
      axios.interceptors.response.use(
        res => res,
        error => interceptorResponseErr(error)
      );
      const res = await axios.get(`${URL}/api/v1/users/generate-password`, {
        headers: {
          Authorization: `${ls.scheme} ${ls.token}`
        }
      });
      setPassword(res.data.payload);
    } catch (error) {
      return error;
    }
  };

  const getRole = async () => {
    try {
      axios.interceptors.response.use(
        res => res,
        error => interceptorResponseErr(error)
      );
      const res = await axios.get(`${URL}/api/v1/roles/select-list`, {
        headers: {
          Authorization: `${ls.scheme} ${ls.token}`
        }
      });
      const dataRole = res.data.payload;
      setSelectRole(dataRole);
    } catch (error) {
      return error;
    }
  };

  const handleSelectRole = e => {
    setSelect(e);
  };

  const validationSchema = yup.object().shape({
    nama: yup.string().required('This field is required'),
    email: yup.string().email().required('This field is required'),
    roleType: yup.string().required('This field is required'),
    statusData: yup.string().required('This field is required')
  });

  const checkEmailIsValid = () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    let output = true;
    if (!emailRegex.test(email)) {
      output = false;
    }
    return output;
  };

  const checkFormValid = () => {
    const isEmailValid = checkEmailIsValid();
    if (
      name !== '' &&
      password !== '' &&
      select !== '' &&
      status !== '' &&
      isEmailValid
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  useEffect(() => {
    getRole();
    checkFormValid();
  }, [name, email, select, status, password]);

  return (
    <div>
      <Head>
        <title>Bumame CMS</title>
        <link
          rel='icon'
          href={`${process.env.NEXT_PUBLIC_PREFIX_URL || ''}/favicon.ico`}
        />
      </Head>
      <MainLayout
        height={'h-auto'}
        pBottom={'pb-14'}
        headline={'User Management'}
        breadcrumb={[
          {
            link: '/user-management',
            name: 'List User Management'
          },
          {
            link: '/user-management/create',
            name: 'Create'
          }
        ]}
      >
        <main
          className={'flex flex-col bg-white rounded-lg shadow-lg p-7 mb-5'}
        >
          <div className='w-96 -mt-4'>
            <Formik
              initialValues={{
                name: '',
                email: '',
                roleType: ''
              }}
              validationSchema={validationSchema}
              enableReinitialize
            >
              {({ errors }) => (
                <Form>
                  <Label className={'font-normal text-sm'}>Nama</Label>
                  <Field
                    onChange={e => setName(e.target.value)}
                    name='nama'
                    component={Input}
                  />
                  <Label className={'mt-4 font-normal text-sm'}>Email</Label>
                  <Field
                    onChange={e => setEmail(e.target.value)}
                    name='email'
                    component={Input}
                  />
                  <div className='mt-2'>
                    <Typography className={'mt-4'}>Role</Typography>
                    <Field
                      value={select}
                      onChange={e => handleSelectRole(e.target.value)}
                      className='w-full p-2 focus:outline-none bg-white border rounded-md'
                      as='select'
                      name='roleType'
                      placeholder={`Select Role`}
                    >
                      <option value=''>Select Role</option>
                      {selectRole.length > 0
                        ? selectRole.map((item, key) => {
                            return (
                              <option value={item.roleCode} key={key}>
                                {item.roleName}
                              </option>
                            );
                          })
                        : null}
                    </Field>
                  </div>
                  <div className='mt-4'>
                    <Typography>Status</Typography>
                    <div className='flex items-center'>
                      <input
                        onChange={e => setStatus(e.target.value)}
                        value='Active'
                        type='radio'
                        name='statusData'
                        checked={status === 'Active'}
                      />
                      <label className='pl-1' htmlFor='active'>
                        Active
                      </label>
                      <input
                        onChange={e => setStatus(e.target.value)}
                        value='InActive'
                        className='ml-5'
                        type='radio'
                        name='statusData'
                        checked={status === 'InActive'}
                      />
                      <label className='pl-1' htmlFor='inactive'>
                        InActive
                      </label>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
            <div className='flex justify-between items-center mt-2'>
              <InputText
                readOnly
                value={password}
                label={'Password'}
                type={'text'}
              />
              <Button
                paddingVertical={`py-2`}
                paddingHorizontal={`px-7`}
                background={`bg-btnBlue`}
                onClick={() => generatePassword()}
                className={
                  'mt-6 ml-4 bg-opacity-20 text-btnBlue hover:bg-btnBlue hover:text-white hover:opacity-100'
                }
              >
                <Typography className={`font-normal text-sm`}>
                  Generate
                </Typography>
              </Button>
            </div>
          </div>
          <div className='flex justify-center mt-6'>
            <Button
              paddingVertical={`py-2`}
              paddingHorizontal={`px-7`}
              background={
                isFormValid ? `bg-btnBlue text-white` : `bg-btn-cancel`
              }
              disabled={!isFormValid}
              onClick={() => setShowModals(true)}
            >
              <Typography className={`font-normal text-sm`}>Save</Typography>
            </Button>
            <Button
              paddingVertical={`py-2`}
              paddingHorizontal={`px-7`}
              background={`bg-btn-cancel`}
              className={`ml-2`}
              onClick={() => {
                router.push('/user-management');
              }}
            >
              <Typography className={` font-normal text-sm`}>Cancel</Typography>
            </Button>
          </div>
        </main>
      </MainLayout>
      {/* Modal Confirmation Submit Data */}
      <ModalConfirmation
        show={showModals}
        confirmation={`Confirmation`}
        onHide={() => setShowModals(false)}
        handleYes={() => {
          handlePost();
        }}
        desc1='Apakah anda yakin akan menyimpan data ini?'
        isLoading={onSubmit}
      />
      <Modal
        setIsOpen={val => setSuccess(val)}
        width={`w-[27rem]`}
        title={`Success`}
        headless
        isOpen={success}
      >
        <div>
          <Image src={assets.ImageCheckedGreen} alt={`Success dialog image`} />
        </div>
        <Typography className={`pt-8`}>
          Password berhasil dikirim melalui email
        </Typography>
        <div className='flex justify-center pt-8'>
          <Button
            onClick={() => router.push('/user-management')}
            color={`white`}
            background={`bg-btnBlue`}
          >
            <Typography className={`text-white font-normal text-sm`}>
              OK
            </Typography>
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
          <Typography>{`Data gagal disimpan, silahkan coba lagi`}</Typography>
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

export default CreateUser;
