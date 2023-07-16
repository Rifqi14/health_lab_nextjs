import React, { useState, useEffect } from 'react';
import {
  Button,
  InputText,
  Modal,
  Typography,
  Radio,
  Label,
  Input,
  Card,
  Select,
  ReactSelect
} from 'components/atoms';
import { MainLayout } from 'components/organisms';
import Image from 'next/image';
import Head from 'next/head';
import assets from 'public/index';
import axios from 'axios';
import { getItemLocalStorage } from 'components/utils/localstorage';
import { useRouter } from 'next/router';
import ModalConfirmation from 'components/Modals/ModalConfirmation';
import { getSiteOption } from '../../../../components/store/actions/corporate';
import { useDispatch } from 'react-redux';
import ModalSuccess from '../../../../components/Modals/ModalsSendLink';
import { Transition } from '@headlessui/react';
import { data } from 'autoprefixer';

const Edit = () => {
  const router = useRouter();
  const code = router.query.id;
  const dispatch = useDispatch();
  const [showModals, setShowModals] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [siteOption, setSiteOption] = useState([]);
  const [sendSite, setSendSite] = useState('');
  const [selectSite, setSelectSite] = useState([]);
  const [typeInput, setTypeInput] = useState(false);
  const [state, setstate] = useState({
    name: '',
    identityType: '',
    identityId: '',
    corporateType: '',
    brand: '',
    catagories: '',
    totalUser: '',
    email: '',
    gender: '',
    code: '',
    dateOfBirth: '',
    citizenship: '',
    taxId: '',
    arDueDate: '',
    phoneNumber: '',
    address: '',
    city: '',
    province: '',
    rt: '',
    rw: '',
    district: '',
    subDistinct: '',
    domicileAddress: '',
    domicileCity: '',
    domicileProvince: '',
    domicileRt: '',
    domicileRw: '',
    domicileDistrict: '',
    domicileSubDistinct: '',
    selectType: '',
    statusData: '',
    sites: [],
    pics: [
      {
        name: '',
        title: '',
        contact: '',
        email: ''
      }
    ],
    numberPhone: ''
  });

  const URL = process.env.NEXT_PUBLIC_API_URL;
  const ls = JSON.parse(getItemLocalStorage('AUTH'));

  const getDetailData = async () => {
    try {
      const res = await axios.get(`${URL}/api/v1/corporates/${code}`, {
        headers: {
          Authorization: `${ls.scheme} ${ls.token}`
        }
      });
      const data = res.data.payload;
      setstate({
        ...state,
        name: data.name,
        identityType: data.identityType,
        identityId: data.identityId,
        corporateType: data.corporateType,
        brand: '',
        catagories: '',
        totalUser: 0,
        email: '',
        gender: data.gender,
        code: data.code,
        dateOfBirth: data.dateOfBirth,
        citizenship: data.citizenship,
        taxId: '',
        arDueDate: '',
        phoneNumber: data.phoneNumber,
        address: data.address,
        city: data.city,
        province: data.province,
        rt: data.rt,
        rw: data.rw,
        district: data.district,
        subDistinct: data.subDistinct,
        domicileAddress: data.domicileAddress,
        domicileCity: data.domicileCity,
        domicileProvince: data.domicileProvince,
        domicileRt: data.domicileRt,
        domicileRw: data.domicileRw,
        domicileDistrict: data.domicileDistrict,
        domicileSubDistinct: data.domicileSubDistinct,
        selectType: '',
        sites: data.sites.map(item => {
          return {
            ...item,
            value: item.siteId,
            label: item.siteName
          };
        }),
        numberPhone: data.phoneNumber
      });
    } catch (err) {
      return err;
    }
  };

  useEffect(() => {
    dispatch(getSiteOption()).then(res => {
      if (res?.statusCode === 200) {
        setSiteOption(
          res?.payload.map(item => {
            return {
              ...item,
              value: item.siteId,
              label: item.siteName
            };
          })
        );
      }
    });
  }, []);

  const handleOptionSite = val => {
    let obj = siteOption.find(o => o.siteId == val?.siteId);
    setSendSite(obj);
  };

  const dataIndividual = {
    ...state,
    name: state.name,
    code: state.code,
    corporateType: 'Individual',
    phoneNumber: state.phoneNumber,
    dateOfBirth: state.dateOfBirth,
    identityType: state.identityType,
    arDueDate: +state.arDueDate,
    // "identityId": "string",
    totalUser: +state.totalUser,
    gender: state.gender,
    citizenship: state.citizenship,
    address: state.address,
    province: state.province,
    district: state.district,
    city: state.city,
    subDistinct: state.subDistinct,
    rt: state.rt,
    rw: state.rw,
    domicileAddress: state.domicileAddress,
    domicileProvince: state.domicileProvince,
    domicileDistrict: state.domicileDistrict,
    domicileCity: state.domicileCity,
    domicileSubDistinct: state.domicileSubDistinct,
    domicileRt: state.domicileRt,
    domicileRw: state.domicileRw,
    sites: sendSite !== '' ? [sendSite] : state.sites,
    pics: [
      {
        name: state.pics.name,
        title: state.pics.title,
        contact: state.pics.contact,
        email: state.pics.email
      }
    ],

    statusData: 'InActive'
  };

  const handleEdit = async () => {
    setOnSubmit(true);
    try {
      const res = await axios.patch(
        `${URL}/api/v1/corporates/${code}`,
        dataIndividual,
        {
          headers: {
            Authorization: `${ls.scheme} ${ls.token}`
          }
        }
      );
      setOnSubmit(false);
      setShowModals(false);
      setSuccessModal(true);
    } catch (err) {
      return err;
    }
  };

  const handleModal = () => {
    setOtpModal(false);
    setShowModals(false);
    setSuccessModal(true);
  };

  useEffect(() => {
    getDetailData();
    getSiteOption();
  }, [code]);

  return (
    <>
      <Head>
        <title>Bumame CMS</title>
        <link
          rel='icon'
          href={`${
            process.env.NEXT_PUBLIC_PREFIX_URL || '/housecall'
          }/favicon.ico`}
        />
      </Head>
      <Transition show={true}>
        <MainLayout>
          <Card
            rounded={`rounded-lg`}
            shadow={`shadow-lg`}
            padding={`p-7`}
            className={`mb-20`}
          >
            <form>
              <Typography className={`font-medium text-lg text-[#212121]`}>
                Individual Identity
              </Typography>
              <div className={`grid gap-16 mt-2 mb-6 md:grid-cols-3`}>
                <div>
                  <Label>Name Client</Label>
                  <Input
                    type={`text`}
                    value={state.name}
                    onChange={e => setstate({ ...state, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Tipe Identitas</Label>
                  <Select value={state.identityType}>
                    <option value='ktp'>KTP</option>
                    <option value='passport'>Passport</option>
                  </Select>
                </div>
              </div>
              <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                <div>
                  <Label>Gender</Label>
                  <select
                    value={state.gender}
                    onChange={e =>
                      setstate({ ...state, gender: e.target.value })
                    }
                    className='w-full py-2 rounded border border-gray-200 px-1'
                    name=''
                    id=''
                  >
                    <option value='pria'>Pria</option>
                    <option value='female'>Wanita</option>
                  </select>
                  {/* <Input
                  type={`text`}
                  value={state.gender}
                  onChange={(e) =>
                    setstate({ ...state, gender: e.target.value })
                  }
                  // onChange={(e) => (data.gender = e.target.value)}
                /> */}
                </div>
                <div>
                  <Label>Nomer NIK/Passport</Label>
                  <Input
                    type={`text`}
                    value={state.identityId}
                    onChange={e =>
                      setstate({ ...state, identityId: e.target.value })
                    }
                    // onChange={(e) => (data.identityId = e.target.value)}
                  />
                </div>
              </div>
              <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                <div>
                  <Label>Tanggal Lahir</Label>
                  <Input
                    type={typeInput == true ? `datetime-local` : `text`}
                    value={state.dateOfBirth}
                    onfocus={(setTypeInput = true)}
                    onChange={e =>
                      setstate({ ...state, dateOfBirth: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Kewarganegaraan</Label>
                  <Input
                    type={`text`}
                    value={state.citizenship}
                    onChange={e =>
                      setstate({ ...state, citizenship: e.target.value })
                    }
                    // onChange={(e) => (data.citizenship = e.target.value)}
                  />
                </div>
              </div>
              <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                <div>
                  <Label>No Hp</Label>
                  <Input
                    type={`text`}
                    value={state.phoneNumber}
                    onChange={e =>
                      setstate({ ...state, phoneNumber: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Input
                    type={`text`}
                    value={`${state.corporateType}`}
                    className={`bg-[#E6E6E6] !rounded-md`}
                    readonly={true}
                  />
                </div>
              </div>
              <Typography className={`font-medium text-lg text-[#212121]`}>
                Alamat Sesuai KTP
              </Typography>
              <div className={`grid gap-16 mb-6 mt-2 md:grid-cols-3`}>
                <div>
                  <Label>Address</Label>
                  <Input
                    type={`text`}
                    value={state.address}
                    onChange={e =>
                      setstate({ ...state, address: e.target.value })
                    }
                    // onChange={(e) => (data.address = e.target.value)}
                  />
                </div>
                <div>
                  <Label>City</Label>
                  <Input
                    type={`text`}
                    value={state.city}
                    onChange={e => setstate({ ...state, city: e.target.value })}
                    // onChange={(e) => (data.city = e.target.value)}
                  />
                </div>
              </div>
              <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                <div>
                  <Label>Province</Label>
                  <Input
                    type={`text`}
                    value={state.province}
                    onChange={e =>
                      setstate({ ...state, province: e.target.value })
                    }
                    // onChange={(e) => (data.province = e.target.value)}
                  />
                </div>
                <div>
                  <Label>RT</Label>
                  <Input
                    type={`text`}
                    value={state.rt}
                    onChange={e => setstate({ ...state, rt: e.target.value })}
                    // onChange={(e) => (data.rt = e.target.value)}
                  />
                </div>
              </div>
              <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                <div>
                  <Label>District</Label>
                  <Input
                    type={`text`}
                    value={state.district}
                    onChange={e =>
                      setstate({ ...state, district: e.target.value })
                    }
                    // onChange={(e) => (data.district = e.target.value)}
                  />
                </div>
                <div>
                  <Label>RW</Label>
                  <Input
                    type={`text`}
                    value={state.rw}
                    onChange={e => setstate({ ...state, rw: e.target.value })}
                    // onChange={(e) => (data.rw = e.target.value)}
                  />
                </div>
              </div>
              <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                <div>
                  <Label>Subdistrict</Label>
                  <Input
                    type={`text`}
                    value={state.subDistinct}
                    onChange={e =>
                      setstate({ ...state, subDistinct: e.target.value })
                    }
                    // onChange={(e) => (data.subDistinct = e.target.value)}
                  />
                </div>
              </div>
              <Typography className={`font-medium text-lg text-[#212121]`}>
                Alamat Sesuai Domisili
              </Typography>
              <div className={`grid gap-16 mb-6 mt-2 md:grid-cols-3`}>
                <div>
                  <Label>Address</Label>
                  <Input
                    type={`text`}
                    value={state.domicileAddress}
                    onChange={e =>
                      setstate({ ...state, domicileAddress: e.target.value })
                    }
                    // onChange={(e) => (data.domicileAddress = e.target.value)}
                  />
                </div>
                <div>
                  <Label>City</Label>
                  <Input
                    type={`text`}
                    value={state.domicileCity}
                    onChange={e =>
                      setstate({ ...state, domicileCity: e.target.value })
                    }
                    // onChange={(e) => (data.domicileCity = e.target.value)}
                  />
                </div>
              </div>
              <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                <div>
                  <Label>Province</Label>
                  <Input
                    type={`text`}
                    value={state.domicileProvince}
                    onChange={e =>
                      setstate({ ...state, domicileProvince: e.target.value })
                    }
                    // onChange={(e) => (data.domicileProvince = e.target.value)}
                  />
                </div>
                <div>
                  <Label>RT</Label>
                  <Input
                    type={`text`}
                    value={state.domicileRt}
                    onChange={e =>
                      setstate({ ...state, domicileRt: e.target.value })
                    }
                    // onChange={(e) => (data.domicileRt = e.target.value)}
                  />
                </div>
              </div>
              <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                <div>
                  <Label>District</Label>
                  <Input
                    type={`text`}
                    value={state.domicileDistrict}
                    onChange={e =>
                      setstate({ ...state, domicileDistrict: e.target.value })
                    }
                    // onChange={(e) => (data.domicileDistrict = e.target.value)}
                  />
                </div>
                <div>
                  <Label>RW</Label>
                  <Input
                    type={`text`}
                    value={state.domicileRw}
                    onChange={e =>
                      setstate({ ...state, domicileRw: e.target.value })
                    }
                    // onChange={(e) => (data.domicileRw = e.target.value)}
                  />
                </div>
              </div>
              <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                <div>
                  <Label>Subdistrict</Label>
                  <Input
                    type={`text`}
                    value={state.domicileSubDistinct}
                    onChange={e =>
                      setstate({
                        ...state,
                        domicileSubDistinct: e.target.value
                      })
                    }
                    // onChange={(e) => (data.domicileSubDistinct = e.target.value)}
                  />
                </div>
              </div>
              <Typography className={`font-medium text-lg text-[#212121]`}>
                Site
              </Typography>
              <div className={`grid gap-16 mb-6 mt-2 md:grid-cols-3`}>
                <div>
                  <Label>Assign site</Label>
                  <ReactSelect
                    name='site'
                    placeholder='Select a site'
                    options={siteOption}
                    defaultValue={
                      sendSite
                        ? {
                            value: sendSite.siteId,
                            label: sendSite.siteName
                          }
                        : state.sites
                    }
                    onChange={val => handleOptionSite(val)}
                  />
                  {/* <select
                    value={sendSite?.siteName}
                    onChange={(e) => handleOptionSite(e.target.value)}
                    className="w-full p-2 focus:outline-none bg-white border"
                    name="site">
                    <option value="">{sendSite?.siteName}</option>
                    {siteOption.length > 0 ? (
                      siteOption.map((item, key) => {
                        return (
                          <option value={item.siteId} key={key}>
                            {item.siteName}
                          </option>
                        );
                      })
                    ) : (
                      <option value=""></option>
                    )}
                  </select> */}
                </div>
              </div>
              <div className='flex justify-center mt-6'>
                <Button
                  paddingVertical={`py-2`}
                  paddingHorizontal={`px-7`}
                  background={`bg-btnBlue`}
                  onClick={() => setShowModals(true)}
                  // onClick={() => handleEdit()}
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
                  onClick={() => router.push('/master-corporate')}
                >
                  <Typography className={` font-normal text-sm`}>
                    Cancel
                  </Typography>
                </Button>
              </div>
            </form>
          </Card>
          <div className='absolute mt-80 z-20 left-[650px] top-0'>
            <ModalConfirmation
              show={showModals}
              confirmation={`Confirmation`}
              onHide={() => setShowModals(false)}
              handleYes={() => {
                handleEdit();
              }}
              desc1='Apakah anda yakin akan menyimpan data ini?'
              isLoading={onSubmit}
            />
          </div>
          <ModalSuccess
            show={successModal}
            onHide={() => {
              setSuccessModal(false);
              if (state.numberPhone !== state.phoneNumber) {
                setOtpModal(true);
              } else {
                router.push('/master-corporate');
              }
            }}
            desc1={`Data berhasil disimpan`}
          />
          <ModalSuccess
            show={otpModal}
            onHide={() => {
              setOtpModal(false);
              router.push('/master-corporate');
            }}
            desc1={`No OTP dan link URL berhasil dikirim ke PIC Corporate dengan no handphone berikut ${state.phoneNumber}`}
          />
        </MainLayout>
      </Transition>
    </>
  );
};

export default Edit;
