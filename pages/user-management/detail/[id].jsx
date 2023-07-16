import { MainLayout } from 'components/organisms';
import { Button, Modal, Pill, Typography, UserDetail } from 'components/atoms';
import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import assets from 'public/index';
import ModalDelete from 'components/Modals/ModalDelete';
import axios from 'axios';
import { getItemLocalStorage } from 'components/utils/localstorage';
import { interceptorResponseErr } from 'components/utils/interceptor';
import ModalConfirmation from '../../../components/Modals/ModalConfirmation';

const Detail = () => {
  const [showModals, setShowModals] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [role, setRole] = useState();
  const [status, setStatus] = useState();
  const [showSuccessDeleteModal, setShowSuccessDeleteModal] = useState(false);
  const [onDeleteUser, setOnDeleteUser] = useState(false);
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
      setRole(data.roleType);
      setStatus(data.statusData);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleDelete = async () => {
    try {
      setOnDeleteUser(true);
      axios.interceptors.response.use(
        res => res,
        error => interceptorResponseErr(error)
      );
      const res = await axios.delete(`${URL}/api/v1/users/${userId}`, {
        headers: {
          Authorization: `${ls.scheme} ${ls.token}`
        }
      });
      setOnDeleteUser(false);
      setShowModals(false);
      setShowSuccessDeleteModal(true);
    } catch (error) {
      return error;
    }
  };

  return (
    <>
      <Head>
        <title>CMS Health Lab</title>
      </Head>

      <MainLayout
        height={'h-screen'}
        pBottom={'pb-14'}
        headline={'User Management'}
        breadcrumb={[
          {
            link: '/user-management',
            name: 'List User Management'
          },
          {
            link: `/user-management/detail/${userId}`,
            name: 'Detail'
          }
        ]}
      >
        <main className={' bg-white rounded-lg shadow-lg p-7 mb-5'}>
          <div className='flex justify-between mx-5'>
            <div className='flex flex-col'>
              <UserDetail title={name} label={'Nama'} />
              <UserDetail className='py-6' title={email} label={'Email'} />
              <UserDetail title={role} label={'Role'} />
            </div>
            <div className='mr-64'>
              <p className='pb-1'>Status</p>
              <Pill type={status} />
            </div>
            <div className='mt-3'>
              <Button
                paddingVertical={`py-2`}
                paddingHorizontal={`px-4`}
                background={`bg-inActive`}
                className={'flex items-center justify-center'}
                onClick={() => setShowModals(true)}
              >
                <Image src={assets.IconTrash} alt='create' />
                <Typography className={`text-white font-normal text-sm pl-2`}>
                  Delete
                </Typography>
              </Button>
            </div>
          </div>
          <div className='flex justify-center mt-8'>
            <Button
              paddingVertical={`py-2`}
              paddingHorizontal={`px-7`}
              background={`bg-btn-cancel`}
              onClick={() => router.push('/user-management')}
            >
              <Typography className={`font-normal text-sm`}>Back</Typography>
            </Button>
          </div>
        </main>
        {/* Confirmation Delete */}
        <ModalConfirmation
          show={showModals}
          confirmDelete={true}
          // confirmation={`Confirmation`}
          onHide={() => setShowModals(false)}
          handleYes={() => {
            handleDelete();
          }}
          desc1='Apakah anda yakin akan menghapus data ini?'
          isLoading={onDeleteUser}
        />
        <Modal
          setIsOpen={val => setShowSuccessDeleteModal(val)}
          width={`w-[27rem]`}
          title={`Success`}
          headless
          isOpen={showSuccessDeleteModal}
        >
          <div>
            <Image
              src={assets.ImageCheckedGreen}
              alt={`Success dialog image`}
            />
          </div>
          <Typography className={`pt-8`}>Data berhasil dihapus</Typography>
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

export default Detail;
