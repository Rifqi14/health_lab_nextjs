import {
  Card,
  Typography,
  UserDetail,
  Label,
  Button,
  Modal
} from 'components/atoms';
import { MainLayout } from 'components/organisms';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import assets from 'public/index';
import axios from 'axios';
import { getItemLocalStorage } from 'components/utils/localstorage';
import { useRouter } from 'next/router';
import ModalDelete from 'components/Modals/ModalDelete';
import { useDispatch } from 'react-redux';
import { deleteCorporate } from 'components/store/actions/corporate';
import ModalConfirmation from '../../../../components/Modals/ModalConfirmation';

const Detail = () => {
  const [showModals, setShowModals] = useState(false);
  const router = useRouter();
  const code = router.query.id;
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [sites, setSites] = useState([]);
  const [showSuccessDeleteModal, setShowSuccessDeleteModal] = useState(false);
  const [onDeleteData, setOnDeleteData] = useState(false);
  const URL = process.env.NEXT_PUBLIC_API_URL;
  const ls = JSON.parse(getItemLocalStorage('AUTH'));

  const getDetailData = async () => {
    try {
      const res = await axios.get(`${URL}/api/v1/corporates/${code}`, {
        headers: {
          Authorization: `${ls.scheme} ${ls.token}`
        }
      });
      const dataSites = res.data.payload.sites;
      setData(res.data.payload);
      setSites(dataSites);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    router.push('/master-corporate');
  };

  useEffect(() => {
    getDetailData();
  }, [code]);

  const handleDelete = code => {
    setOnDeleteData(true);
    dispatch(deleteCorporate(code)).then(res => {
      setShowModals(false);
      setShowSuccessDeleteModal(true);
      setOnDeleteData(false);
    });
  };

  return (
    <>
      <Head>
        <title>CMS Bumame</title>
      </Head>
      <MainLayout>
        <Card>
          <div className='mb-[15px] flex justify-between'>
            <Typography className={`font-medium text-lg text-[#212121]`}>
              Individual Identity
            </Typography>
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
          <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
            <div>
              <Label>Nama Client</Label>
              <UserDetail title={`${data.name}`} className={'!w-auto'} />
            </div>
            <div>
              <Label>Tipe Identitas</Label>
              <UserDetail
                title={`${data.identityType}`}
                className={'!w-auto'}
              />
            </div>
          </div>
          <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
            <div>
              <Label>Gender</Label>
              <UserDetail title={`${data.gender}`} className={'!w-auto'} />
            </div>
            <div>
              <Label>Nomer NIK/Passport</Label>
              <UserDetail title={`${data.identityId}`} className={'!w-auto'} />
            </div>
          </div>
          <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
            <div>
              <Label>Tanggal Lahir</Label>
              <UserDetail title={`${data.dateOfBirth}`} className={'!w-auto'} />
            </div>
            <div>
              <Label>Kewarganegaraan</Label>
              <UserDetail title={`${data.citizenship}`} className={'!w-auto'} />
            </div>
          </div>
          <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
            <div>
              <Label>No HP</Label>
              <UserDetail title={`${data.phoneNumber}`} className={'!w-auto'} />
            </div>
            <div>
              <Label>Type</Label>
              <UserDetail
                title={`${data.corporateType}`}
                className={'!w-auto'}
              />
            </div>
          </div>
          <Typography className={`font-medium text-lg text-[#212121]`}>
            Alamat Sesuai KTP
          </Typography>
          <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
            <div>
              <Label>Address</Label>
              <UserDetail title={`${data.address}`} className={'!w-auto'} />
            </div>
            <div>
              <Label>City</Label>
              <UserDetail title={`${data.city}`} className={'!w-auto'} />
            </div>
          </div>
          <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
            <div>
              <Label>Province</Label>
              <UserDetail title={`${data.province}`} className={'!w-auto'} />
            </div>
            <div>
              <Label>RT</Label>
              <UserDetail title={`${data.rt}`} className={'!w-auto'} />
            </div>
          </div>
          <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
            <div>
              <Label>District</Label>
              <UserDetail title={`${data.district}`} className={'!w-auto'} />
            </div>
            <div>
              <Label>Sub District</Label>
              <UserDetail title={`${data.subDistinct}`} className={'!w-auto'} />
            </div>
          </div>
          <Typography className={`font-medium text-lg text-[#212121]`}>
            Alamat Sesuai Domisili
          </Typography>
          <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
            <div>
              <Label>Address</Label>
              <UserDetail
                title={`${data.domicileAddress}`}
                className={'!w-auto'}
              />
            </div>
            <div>
              <Label>City</Label>
              <UserDetail
                title={`${data.domicileCity}`}
                className={'!w-auto'}
              />
            </div>
          </div>
          <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
            <div>
              <Label>Province</Label>
              <UserDetail
                title={`${data.domicileProvince}`}
                className={'!w-auto'}
              />
            </div>
            <div>
              <Label>RT</Label>
              <UserDetail title={`${data.domicileRt}`} className={'!w-auto'} />
            </div>
          </div>
          <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
            <div>
              <Label>District</Label>
              <UserDetail
                title={`${data.domicileDistrict}`}
                className={'!w-auto'}
              />
            </div>
            <div>
              <Label>Sub District</Label>
              <UserDetail
                title={`${data.domicileSubDistinct}`}
                className={'!w-auto'}
              />
            </div>
          </div>
          <Typography className={`font-medium text-lg text-[#212121]`}>
            Site
          </Typography>
          <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
            <div>
              <Label>Assign Site</Label>
              {sites.length > 0 &&
                sites.map((item, key) => {
                  return (
                    <UserDetail
                      key={key}
                      title={`${item.siteName}`}
                      className={'!w-auto'}
                    />
                  );
                })}
            </div>
          </div>
          <div className='flex justify-center mt-6'>
            <Button
              paddingVertical={`py-2`}
              paddingHorizontal={`px-7`}
              background={`bg-btn-cancel`}
              className={`ml-2`}
              onClick={() => handleBack()}
            >
              <Typography className={` font-normal text-sm`}>Back</Typography>
            </Button>
          </div>
        </Card>
        {/* Confirmation Delete Data */}

        <ModalConfirmation
          show={showModals}
          // confirmation={`Confirmation`}
          confirmDelete={true}
          onHide={() => setShowModals(false)}
          handleYes={() => {
            handleDelete(code);
          }}
          desc1='Apakah anda yakin akan menghapus data ini?'
          isLoading={onDeleteData}
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
              onClick={() => router.push('/master-corporate')}
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
