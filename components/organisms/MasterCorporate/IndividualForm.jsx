import { Transition } from '@headlessui/react';
import React, { useState, useEffect } from 'react';
import {
  Card,
  Label,
  Input,
  Typography,
  Select,
  Button,
  ReactSelect,
  Modal
} from 'components/atoms';
import { getItemLocalStorage } from 'components/utils/localstorage';
import { useRouter } from 'next/router';
import ModalConfirmation from 'components/Modals/ModalConfirmation';
import ModalSuccess from 'components/Modals/ModalsSendLink';
import { useDispatch } from 'react-redux';
import { createMasterCorporate } from 'components/store/actions/corporate';
import * as PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import * as yup from 'yup';
import Head from 'next/head';
import Image from 'next/image';
import assets from 'public/index';

ModalSuccess.propTypes = {
  desc1: PropTypes.string,
  show: PropTypes.any,
  onHide: PropTypes.func
};
const IndividualForm = props => {
  const { isIndividualFormOpen, showModals, postData, siteOptions } = props;

  const router = useRouter();
  const dispatch = useDispatch();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectSite, setSelectSite] = useState([]);
  const [successModal, setSuccessModal] = useState(false);
  const [selectGender, setSelectGender] = useState('');
  const [sendSite, setSendSite] = useState();
  const [selectType, setSelectType] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [onSubmitData, setOnSubmitData] = useState(false);
  const [state, setstate] = useState({
    name: '',
    identityType: '',
    identityId: '',
    gender: '',
    code: '',
    dateOfBirth: new Date(),
    citizenship: '',
    phone: '',
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
    sites: [sendSite],
    corporateType: ''
  });
  // const URL = process.env.NEXT_PUBLIC_API_URL;
  // const ls = JSON.parse(getItemLocalStorage('AUTH'));

  const data = {
    ...state,
    name: state.name,
    code: state.phone,
    identityType: selectType,
    gender: selectGender,
    identityId: state.identityId,
    dateOfBirth: state.dateOfBirth,
    citizenship: state.citizenship,
    phoneNumber: state.phone,
    address: state.address,
    city: state.city,
    province: state.province,
    rt: state.rt,
    district: state.district,
    rw: state.rw,
    subDistinct: state.subDistinct,
    domicileAddress: state.domicileAddress,
    domicileCity: state.domicileCity,
    domicileProvince: state.domicileProvince,
    domicileRt: state.domicileRt,
    domicileDistrict: state.domicileDistrict,
    domicileRw: state.domicileRw,
    domicileSubDistinct: state.domicileSubDistinct,
    sites: [sendSite],
    corporateType: 'individual'
  };

  const submitData = () => {
    setOnSubmitData(true);
    dispatch(createMasterCorporate(data)).then(res => {
      if (res?.statusCode === 200) {
        setSuccessModal(true);
      } else {
        setErrorMessage(res?.response?.data?.message);
        setErrorModal(true);
      }
      setShowConfirm(false);
      setOnSubmitData(false);
    });
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required('This field is required'),
    identityType: yup.string().required('This field is required'),
    gender: yup.string().required('This field is required'),
    dateOfBirth: yup
      .date()
      .typeError('please enter a valid date')
      .required('This field is required'),
    citizenship: yup.string().required('This field is required'),
    phone: yup.string().required('This field is required'),
    address: yup.string().required('This field is required'),
    city: yup.string().required('This field is required'),
    province: yup.string().required('This field is required'),
    rt: yup.string().required('This field is required'),
    district: yup.string().required('This field is required'),
    rw: yup.string().required('This field is required'),
    subdistrict: yup.string().required('This field is required'),
    domicileAddress: yup.string().required('This field is required'),
    domicileCity: yup.string().required('This field is required'),
    domicileProvince: yup.string().required('This field is required'),
    domicileRt: yup.string().required('This field is required'),
    domicileDistrict: yup.string().required('This field is required'),
    domicileRw: yup.string().required('This field is required'),
    domicileSubDistinct: yup.string().required('This field is required'),
    site: yup.string().required('This field is required')
  });

  const HandleCencel = () => {
    router.back();
  };
  const HandleselectType = e => {
    setSelectType(e);
    setstate({ ...state, identityType: selectType });
  };

  // const handleSelectGender = (e) => {
  //   setSelectGender(e);
  //   setstate({ ...state, gender: selectGender });
  //   console.log("selected", state.gender)
  // };

  const handleSelectSite = val => {
    setSelectSite(val);

    let obj = props.siteOptions.find(o => o.siteId == val?.siteId);
    setSendSite(obj);
  };

  const onSubmit = () => {
    setShowConfirm(true);
  };

  const checkIsFormValid = () => {
    if (
      state.name &&
      state.citizenship &&
      state.phone &&
      state.address &&
      state.city &&
      state.province &&
      state.rt &&
      state.district &&
      state.rw &&
      state.subDistinct &&
      state.domicileAddress &&
      state.domicileCity &&
      state.domicileProvince &&
      state.domicileRt &&
      state.domicileDistrict &&
      state.domicileRw &&
      selectType &&
      selectGender &&
      selectSite &&
      state.domicileSubDistinct.length > 0
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  useEffect(() => {
    checkIsFormValid();
  }, [state, sendSite]);

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
      <Transition appear show={isIndividualFormOpen}>
        <Card
          rounded={`rounded-lg`}
          shadow={`shadow-lg`}
          padding={`p-7`}
          className={`mb-5`}
        >
          <Formik
            initialValues={state}
            validationSchema={validationSchema}
            // enableReinitialize
            onSubmit={() => onSubmit()}
          >
            {formik => {
              return (
                <Form>
                  <Typography className={`font-medium text-lg text-[#212121]`}>
                    Individual Identity
                  </Typography>
                  <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                    <div>
                      <Label>Name Client</Label>
                      <Field
                        component={Input}
                        name='name'
                        type={`text`}
                        onChange={e =>
                          setstate({ ...state, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Tipe Identitas</Label>
                      <Field
                        as='select'
                        value={selectType}
                        name='identityType'
                        id=''
                        className='w-full p-2 focus:outline-none bg-white border'
                        onChange={e => {
                          HandleselectType(e.target.value);
                        }}
                      >
                        <option value=''>Select</option>
                        <option value='KTP'>KTP</option>
                        <option value='Passport'>Passport</option>
                      </Field>
                    </div>
                  </div>
                  <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                    <div>
                      <Label>Gender</Label>
                      <Field
                        as='select'
                        value={selectGender}
                        name='gender'
                        id=''
                        onChange={e => {
                          // handleSelectGender(e.target.value);
                          setSelectGender(e.target.value);
                        }}
                        className='w-full p-2 focus:outline-none bg-white border'
                      >
                        <option value=''>Select</option>
                        <option value='Male'>Male</option>
                        <option value='Female'>Female</option>
                      </Field>
                    </div>
                    <div>
                      <Label>Nomer NIK/Passport</Label>
                      <Input
                        type={`text`}
                        onChange={e =>
                          setstate({ ...state, identityId: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                    <div>
                      <Label>Tanggal Lahir</Label>
                      <Field
                        component={Input}
                        name='dateOfBirth'
                        type={`date`}
                        onChange={e =>
                          setstate({ ...state, dateOfBirth: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Kewarganegaraan</Label>
                      <Field
                        component={Input}
                        name='citizenship'
                        type={`text`}
                        onChange={e =>
                          setstate({ ...state, citizenship: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                    <div>
                      <Label>No Hp</Label>
                      <Field
                        component={Input}
                        name='phone'
                        type={`text`}
                        onChange={e =>
                          setstate({ ...state, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <Typography className={`font-medium text-lg text-[#212121]`}>
                    Alamat Sesuai KTP
                  </Typography>
                  <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                    <div>
                      <Label>Address</Label>
                      <Field
                        component={Input}
                        name='address'
                        type={`text`}
                        onChange={e =>
                          setstate({ ...state, address: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>City</Label>
                      <Field
                        component={Input}
                        name='city'
                        type={`text`}
                        onChange={e =>
                          setstate({ ...state, city: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                    <div>
                      <Label>Province</Label>
                      <Field
                        component={Input}
                        name='province'
                        type={`text`}
                        onChange={e =>
                          setstate({ ...state, province: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>RT</Label>
                      <Field
                        component={Input}
                        name='rt'
                        type={`text`}
                        onChange={e =>
                          setstate({ ...state, rt: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                    <div>
                      <Label>District</Label>
                      <Field
                        component={Input}
                        name='district'
                        type={`text`}
                        onChange={e =>
                          setstate({ ...state, district: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>RW</Label>
                      <Field
                        component={Input}
                        name='rw'
                        type={`text`}
                        onChange={e =>
                          setstate({ ...state, rw: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                    <div>
                      <Label>Subdistrict</Label>
                      <Field
                        component={Input}
                        name='subdistrict'
                        type={`text`}
                        onChange={e =>
                          setstate({ ...state, subDistinct: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <Typography className={`font-medium text-lg text-[#212121]`}>
                    Alamat Sesuai Domisili
                  </Typography>
                  <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                    <div>
                      <Label>Address</Label>
                      <Field
                        component={Input}
                        name='domicileAddress'
                        type={`text`}
                        onChange={e =>
                          setstate({
                            ...state,
                            domicileAddress: e.target.value
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>City</Label>
                      <Field
                        component={Input}
                        name='domicileCity'
                        type={`text`}
                        onChange={e =>
                          setstate({ ...state, domicileCity: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                    <div>
                      <Label>Province</Label>
                      <Field
                        component={Input}
                        name='domicileProvince'
                        type={`text`}
                        onChange={e =>
                          setstate({
                            ...state,
                            domicileProvince: e.target.value
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>RT</Label>
                      <Field
                        component={Input}
                        name='domicileRt'
                        type={`text`}
                        onChange={e =>
                          setstate({ ...state, domicileRt: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                    <div>
                      <Label>District</Label>
                      <Field
                        component={Input}
                        name='domicileDistrict'
                        type={`text`}
                        onChange={e =>
                          setstate({
                            ...state,
                            domicileDistrict: e.target.value
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>RW</Label>
                      <Field
                        component={Input}
                        name='domicileRw'
                        type={`text`}
                        onChange={e =>
                          setstate({ ...state, domicileRw: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                    <div>
                      <Label>Subdistrict</Label>
                      <Field
                        component={Input}
                        name='domicileSubDistinct'
                        type={`text`}
                        onChange={e =>
                          setstate({
                            ...state,
                            domicileSubDistinct: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>
                  <Typography className={`font-medium text-lg text-[#212121]`}>
                    Site
                  </Typography>
                  <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                    <div>
                      <Label>Assign site</Label>
                      <ReactSelect
                        name='site'
                        placeholder='Select a site'
                        options={siteOptions}
                        defaultValue={
                          selectSite
                            ? {
                                value: selectSite.siteId,
                                label: selectSite.siteName
                              }
                            : ''
                        }
                        onChange={val => handleSelectSite(val)}
                      />
                      {/* <Field
                        as="select"
                        value={selectSite}
                        onChange={(e) => handleSelectSite(e.target.value)}
                        className="w-full p-2 focus:outline-none bg-white border"
                        name="site">
                        <option value="">Assign site</option>
                        {props.siteOptions ? (
                          props.siteOptions.map((item, key) => {
                            return (
                              <option value={item.siteId} key={key}>
                                {item.siteName}
                              </option>
                            );
                          })
                        ) : (
                          <option value=""></option>
                        )}
                      </Field> */}
                    </div>
                  </div>
                  <div className='flex justify-center mt-6'>
                    <Button
                      paddingVertical={`py-2`}
                      paddingHorizontal={`px-7`}
                      background={`bg-btnBlue`}
                      className={`ml-2 disabled:bg-btn-cancel disabled:text-black`}
                      disabled={!isFormValid || !sendSite}
                      onClick={() => setShowConfirm(true)}
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
                      onClick={() => HandleCencel()}
                    >
                      <Typography className={` font-normal text-sm`}>
                        Cancel
                      </Typography>
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Card>

        <ModalConfirmation
          isLoading={onSubmitData}
          show={showConfirm}
          confirmation={'Confirmation'}
          handleYes={() => {
            submitData();
          }}
          onHide={() => setShowConfirm(false)}
          desc1={`No OTP dan Link URL akan dikirim ke PIC Corporate dengan no handphone berikut ${state.phone}`}
        />
        <ModalSuccess
          show={successModal}
          onHide={() => {
            setSuccessModal(false);
            router.push('/master-corporate');
          }}
          desc1={`No OTP dan link URL berhasil dikirim ke PIC Corporate dengan no handphone berikut ${state.phone}`}
        />
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
      </Transition>
    </>
  );
};

export default IndividualForm;
