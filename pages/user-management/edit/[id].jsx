import { Button, Modal, Typography } from 'components/atoms';
import { MainLayout } from 'components/organisms';
import InputText from 'components/atoms/Input/InputText';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import ModalConfirmation from 'components/Modals/ModalConfirmation';
import ModalsSendLink from 'components/Modals/ModalsSendLink';
import { useRouter } from 'next/router';
import axios from 'axios';
import { getItemLocalStorage } from 'components/utils/localstorage';
import { interceptorResponseErr } from 'components/utils/interceptor';
import Image from 'next/image';
import assets from 'public/index';

const Edit = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [password, setPassword] = useState('');
  const [selectRole, setSelectRole] = useState([]);
  const [select, setSelect] = useState();
  const [showModals, setShowModals] = useState(false);
  const [onEditUser, setOnEditUser] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const userId = router.query.id;

  const URL = process.env.NEXT_PUBLIC_API_URL;
  const ls = JSON.parse(getItemLocalStorage('AUTH'));

  const getUser = async () => {
    try {
      axios.interceptors.response.use(
        res => res,
        error => interceptorResponseErr(error)
      );
      const res = await axios.get(`${URL}/api/v1/users/${userId}`, {
        headers: {
          Authorization: `${ls.scheme} ${ls.token}`
        }
      });
      const data = res.data.payload;
      setName(data.name);
      setEmail(data.email);
      setRole(data);
      setStatus(data.statusData);
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

  const data = {
    name: name,
    email: email,
    roleCode: select === undefined ? role.roleCode : select,
    statusData: status,
    password: password
  };

  useEffect(() => {
    getUser();
    getRole();
  }, []);

  const handleSelectRole = value => {
    setSelect(value);
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

  const handleEditUser = async () => {
    try {
      setOnEditUser(true);
      axios.interceptors.response.use(
        res => res,
        error => interceptorResponseErr(error)
      );
      const res = await axios.patch(`${URL}/api/v1/users/${userId}`, data, {
        headers: {
          Authorization: `${ls.scheme} ${ls.token}`
        }
      });
      setOnEditUser(false);
      setShowModals(false);
      setSuccess(true);
    } catch (error) {
      return error;
    }
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
            name: 'Edit'
          }
        ]}
      >
        <main
          className={'flex flex-col bg-white rounded-lg shadow-lg p-7 mb-5'}
        >
          <div className='w-96 -mt-4'>
            <InputText
              onChange={e => setName(e.target.value)}
              value={name}
              label='Nama'
              type='text'
            />
            <InputText
              onChange={e => setEmail(e.target.value)}
              value={email}
              label='Email'
              type='text'
            />
            <div className='mt-2'>
              <Typography className={'mt-4'}>Role</Typography>
              <select
                value={select}
                onChange={e => handleSelectRole(e.target.value)}
                className='w-full p-2 focus:outline-none bg-white border'
                name='role'
                id=''
              >
                <option value=''>Select Role</option>
                {selectRole.length > 0 ? (
                  selectRole.map((item, key) => {
                    return (
                      <option
                        selected={
                          item.roleCode === role.roleCode ? item.roleName : ''
                        }
                        value={item.roleCode}
                        key={key}
                      >
                        {item.roleName}
                      </option>
                    );
                  })
                ) : (
                  <option>Kosong</option>
                )}
              </select>
            </div>
            <div className='mt-4'>
              <Typography>Status</Typography>
              <div className='flex items-center'>
                <input
                  onChange={e => setStatus(e.target.value)}
                  value={'Active'}
                  checked={status === 'Active' ? true : false}
                  type='radio'
                  name='status'
                />
                <label className='pl-1' htmlFor=''>
                  Active
                </label>
                <input
                  onChange={e => setStatus(e.target.value)}
                  value={'InActive'}
                  checked={status === 'InActive' ? true : false}
                  className='ml-5'
                  type='radio'
                  name='status'
                />
                <label className='pl-1' htmlFor=''>
                  Inactive
                </label>
              </div>
            </div>
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
              background={`bg-btnBlue`}
              onClick={() => setShowModals(true)}
            >
              <Typography className={`text-white font-normal text-sm`}>
                Save
              </Typography>
            </Button>
            <Button
              paddingVertical={`py-2`}
              paddingHorizontal={`px-7`}
              background={`bg-btn-cancel`}
              className={`ml-2`}
              onClick={() => {
                router.push(`/user-management`);
              }}
            >
              <Typography className={` font-normal text-sm`}>Cancel</Typography>
            </Button>
          </div>
        </main>
        <ModalConfirmation
          show={showModals}
          confirmation={`Confirmation`}
          onHide={() => setShowModals(false)}
          handleYes={() => {
            handleEditUser();
          }}
          desc1='Apakah anda yakin akan menyimpan data ini?'
          isLoading={onEditUser}
        />
        <Modal
          setIsOpen={val => setSuccess(val)}
          width={`w-[27rem]`}
          title={`Success`}
          headless
          isOpen={success}
        >
          <div>
            <Image
              src={assets.ImageCheckedGreen}
              alt={`Success dialog image`}
            />
          </div>
          <Typography className={`pt-8`}>Data berhasil disimpan</Typography>
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
      </MainLayout>
    </>
  );
};

export default Edit;
