import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Input,
  Label,
  Select,
  Typography,
  InputText,
  Radio,
  Modal,
  InputFile,
  Textarea,
  ReactSelect
} from 'components/atoms';
import Image from 'next/image';
import assets from 'public/index';
import { MainLayout } from 'components/organisms';
import { getItemLocalStorage } from 'components/utils/localstorage';
import axios from 'axios';
import ModalConfirmation from 'components/Modals/ModalConfirmation';
import { useRouter } from 'next/router';
import { Transition } from '@headlessui/react';
import { numberOnly } from 'components/constants/NumberValidation';
import {
  getSiteOption,
  uploadDocument
} from '../../../../components/store/actions/corporate';
import { useDispatch } from 'react-redux';
import ModalSuccess from '../../../../components/Modals/ModalsSendLink';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

const Edit = props => {
  const router = useRouter();
  const dispatch = useDispatch();
  const code = router.query.id;
  var [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [showModals, setShowModals] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [siteOption, setSiteOption] = useState([]);
  const [sendSite, setSendSite] = useState('');
  const [isDocumentValid, setIsDocumentValid] = useState(false);
  const [selectSite, setSelectSite] = useState([]);
  const [dataPics, setDataPics] = useState({
    name: '',
    title: '',
    contact: '',
    email: ''
  });
  const [dataDocument, setDataDocument] = useState([]);
  const [status, setStatus] = useState('');
  const [state, setstate] = useState({
    name: '',
    identityType: '',
    corporateType: '',
    brand: '',
    catagories: '',
    totalUser: 0,
    email: '',
    gender: '',
    code: '',
    dateOfBirth: new Date(),
    citizenship: '',
    taxId: '',
    arDueDate: 0,
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
    sites: [],
    pics: [
      {
        index: 0,
        name: '',
        title: 'Operasional',
        contact: '',
        email: ''
      },
      {
        index: 1,
        name: '',
        title: 'Corporate',
        contact: '',
        email: ''
      },
      {
        index: 2,
        name: '',
        title: 'Finance',
        contact: '',
        email: ''
      }
    ],
    documents: data.documents,
    statusData: '',
    fileUploaded: null,
    uploadData: [{ index: 1, file: null, notes: '' }],
    isOpenSupportingData: false,
    isOpenSavedConfirmationDialog: false,
    isOpenUploadSupportingData: false,
    docType: ''
  });
  const [initialPhoneNumber, setInitialPhoneNumber] = useState('');
  const URL = process.env.NEXT_PUBLIC_API_URL;
  const ls = JSON.parse(getItemLocalStorage('AUTH'));

  const addFile = () => {
    setstate({
      ...state,
      uploadData: [
        ...state.uploadData,
        {
          index: state.uploadData[state.uploadData.length - 1].index + 1,
          file: '',
          note: ''
        }
      ]
    });
  };
  const deleteFile = index => {
    const upload = state.uploadData.filter((item, i) => {
      return item.index !== index;
    });
    setstate({
      ...state,
      uploadData: upload
    });
  };
  const onChangeBrowseFile = (e, index) => {
    const upload = state.uploadData.map((item, i) => {
      if (item.index === index) {
        item.file = e.target.files[0];
      }

      return item;
    });
    setstate({
      ...state,
      uploadData: upload
    });
  };
  const onChangeNote = (e, index) => {
    const upload = state.uploadData.map((item, i) => {
      if (item.index === index) {
        item.notes = e.target.value;
      }

      return item;
    });
    setstate({
      ...state,
      uploadData: upload
    });
  };
  const handleUploadDocument = () => {
    let uploadDocumentStatus = true;
    const Notes = '';
    const File = '';

    state.uploadData.forEach(async (item, index) => {
      const formData = new FormData();
      formData.append('CorporateCode', code);
      formData.append('Type', state.docType);
      formData.append('Notes', item.notes);
      formData.append('File', item.file);

      const res = await dispatch(uploadDocument(formData));

      router.reload();
    });
  };

  const onClickRadio = e => {
    setStatus(e.target.value);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleModals = (value, type) => {
    setstate({ ...state, isOpenUploadSupportingData: value, docType: type });
  };

  const getDeatilData = async () => {
    try {
      const res = await axios.get(`${URL}/api/v1/corporates/${code}`, {
        headers: {
          Authorization: `${ls.scheme} ${ls.token}`
        }
      });
      const data = res.data.payload;
      if (data.dateOfBirth === '') {
        setstate(previousInputs => ({
          ...previousInputs,
          dateOfBirth: new Date()
        }));
      }
      if (data.pics.length === 0 || !data.pics || data.pics[0] === null) {
        setstate(previousInputs => ({
          ...previousInputs,
          pics: [
            {
              index: 0,
              name: '',
              title: 'Corporate',
              contact: '',
              email: ''
            },
            {
              index: 1,
              name: '',
              title: 'Operasional',
              contact: '',
              email: ''
            },
            {
              index: 2,
              name: '',
              title: 'Finance',
              contact: '',
              email: ''
            }
          ]
        }));
      } else {
        setstate(previousInputs => ({
          ...previousInputs,
          pics: data.pics
        }));
      }
      setstate(previousInputs => ({
        ...previousInputs,
        arDueDate: data.arDueDate || 0,
        corporateType: data.corporateType || '',
        name: data.name || '',
        totalUser: data.totalUser || 0,
        brand: data.brand || '',
        catagories: data.catagories || '',
        email: data.email || '',
        gender: data.gender || '',
        code: String(data.code) || '',
        citizenship: data.citizenship || '',
        taxId: data.taxId || '',
        arDueDate: data.arDueDate || 0,
        phoneNumber: data.phoneNumber || '',
        address: data.address || '',
        city: data.city || '',
        province: data.province || '',
        rt: data.rt || '',
        rw: data.rw || '',
        district: data.district || '',
        subDistinct: data.subDistinct || '',
        domicileSubDistinct: '',
        selectType: '',
        sites: data.sites.map(item => {
          return {
            ...item,
            value: item.siteId,
            label: item.siteName
          };
        })
      }));
      setDataDocument(res.data.payload.documents);
      setStatus(data.statusData);
      setInitialPhoneNumber(data.pics[0].contact);
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

  useEffect(() => {
    checkIsFormValid();
  }, [state]);

  useEffect(() => {
    let uploadDocumentStatus = false;
    state.uploadData.forEach((item, index) => {
      if (!item.file || !item.notes) {
        uploadDocumentStatus = false;
      }
    });
    setIsDocumentValid(uploadDocumentStatus);
  }, [state.uploadData, state.docType]);

  const handleOptionSite = val => {
    setSelectSite(val);
    let obj = siteOption.find(o => o.siteId == val?.siteId);
    setSendSite(obj);
  };

  const dataCorporate = {
    ...state,
    code: state.code,
    name: state.name,
    brand: state.brand,
    corporateType: 'corporate',
    phoneNumber: state.phoneNumber,
    arDueDate: +state.arDueDate,
    email: state.email,
    taxId: state.taxId,
    taxName: state.taxName,
    catagories: state.catagories,
    totalUser: state.totalUser,
    dateOfBirth: state.dateOfBirth,
    identityType: '',
    identityId: '',
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
    pics: state.pics,
    documents: state.documents,
    statusData: status
  };

  useEffect(() => {
    getDeatilData();
    getSiteOption();
  }, [code, dataDocument.id]);

  var docSpk = dataDocument.filter(item => {
    return item.type.toLowerCase() == 'spk';
  });

  var docSph = dataDocument.filter(item => {
    return item.type.toLowerCase() == 'sph';
  });

  var NPWP = dataDocument.filter(item => {
    return item.type.toLowerCase() == 'npwp';
  });

  var identity = dataDocument.filter(item => {
    return item.type.toLowerCase() == 'identity';
  });

  var docVendor = dataDocument.filter(item => {
    return item.type.toLowerCase() == 'vendor_document';
  });

  const handleEdit = async () => {
    setOnSubmit(true);
    try {
      const res = await axios.patch(
        `${URL}/api/v1/corporates/${code}`,
        dataCorporate,
        {
          headers: {
            Authorization: `${ls.scheme} ${ls.token}`
          }
        }
      );
      setShowModals(false);
      setSuccessModal(true);
      setOnSubmit(false);
    } catch (err) {
      return err;
    }
  };

  const handleDeleteDoc = async docId => {
    try {
      const res = await axios.delete(
        `${URL}/api/v1/corporates/document/${docId}`,
        {
          headers: {
            Authorization: `${ls.scheme} ${ls.token}`
          }
        }
      );
      await getDeatilData();
    } catch (err) {
      return err;
    }
  };

  const onChangeData = (e, index, type) => {
    const upload = state.pics.map((item, i) => {
      if (i === index) {
        if (type == 'name') {
          item.name = e.target.value;
        } else if (type == 'contact') {
          item.contact = e.target.value;
        } else if (type == 'title') {
          item.title = e.target.value;
        } else if (type == 'email') {
          item.email = e.target.value;
        }
      }
      return item;
    });
    setstate({
      ...state,
      pics: upload
    });
  };

  const [isFormValid, setIsFormValid] = useState(false);

  const isEmptyObject = data => {
    const formCek = [
      'name',
      'totalUser',
      'brand',
      'phoneNumber',
      'taxId',
      'catagories',
      'address',
      'city',
      'province',
      'rt',
      'rw',
      'district',
      'subDistinct',
      'pics',
      'arDueDate'
    ];

    for (const key in data) {
      if (formCek.includes(key)) {
        const keyData = data[key];
        if (key === 'totalUser' || key === 'arDueDate') {
          if (typeof keyData === 'number' && keyData <= 0) {
            return true;
          }
        } else if (key === 'pics') {
          for (const pic in keyData) {
            if (keyData[pic].title !== 'Finance') {
              for (const data in keyData[pic]) {
                if (data !== 'index') {
                  if (data === 'email') {
                    if (!checkPICEmailIsValid(keyData[pic][data])) {
                      return true;
                    }
                  } else if (data === 'contact') {
                    if (
                      keyData[pic][data].length < 10 ||
                      !numberOnly.test(keyData[pic][data])
                    ) {
                      return true;
                    }
                  } else if (
                    keyData[pic][data] === null ||
                    (typeof keyData[pic][data] === 'string' &&
                      keyData[pic][data] === '') ||
                    !keyData[pic][data] ||
                    !keyData[pic][data].length
                  ) {
                    return true;
                  }
                }
              }
            }
          }
        } else if (
          keyData === null ||
          (typeof keyData === 'string' && keyData === '') ||
          !keyData ||
          !keyData.length
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const checkIsFormValid = () => {
    if (!isEmptyObject(state)) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required('This field is required'),
    totalUser: yup.number().integer().min(1).required('This field is required'),
    brand: yup.string().required('This field is required'),
    phoneNumber: yup.number().integer().required('This field is required'),
    code: yup.string().required('This field is required'),
    taxId: yup.string().required('This field is required'),
    catagories: yup.string().required('This field is required'),
    ArDueDate: yup.string().required('This field is required'),
    address: yup.string().required('This field is required'),
    city: yup.string().required('This field is required'),
    province: yup.string().required('This field is required'),
    rt: yup.string().required('This field is required'),
    district: yup.string().required('This field is required'),
    rw: yup.string().required('This field is required'),
    subDistinct: yup.string().required('This field is required'),
    site: yup.string().required('This field is required'),
    picName1: yup.string().required('This field is required'),
    picContact1: yup
      .string()
      .required('This field is required')
      .matches(numberOnly, 'Only numbers')
      .min(10, 'Too Short!'),
    picEmail1: yup.string().email('email').required('This field is required'),
    picName2: yup.string().required('This field is required'),
    picContact2: yup.string().required('This field is required'),
    picEmail2: yup.string().email().required('This field is required')
  });

  const checkPICEmailIsValid = data => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(data);
  };

  return (
    <>
      <Transition show={true}>
        <MainLayout>
          <Card
            rounded={`rounded-lg`}
            shadow={`shadow-lg`}
            padding={`p-7`}
            className='mb-5'
          >
            <Formik
              validationSchema={validationSchema}
              // enableReinitialize
              initialValues={state}
              onSubmit={() => setShowModals(true)}
            >
              {formik => {
                return (
                  <Form>
                    <div>
                      <Typography
                        className={`font-medium text-lg text-[#212121]`}
                      >
                        Corporate Identity
                      </Typography>
                    </div>
                    <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                      <div>
                        <InputText
                          label='Name Corporate'
                          type='text'
                          onChange={e =>
                            setstate({ ...state, name: e.target.value })
                          }
                          value={state.name}
                        />
                        {!isFormValid && !state.name && (
                          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                            This field is required
                          </p>
                        )}
                      </div>
                      <div>
                        <InputText
                          label='Total User'
                          type='number'
                          onChange={e => {
                            setstate({
                              ...state,
                              totalUser: parseInt(e.target.value)
                            });
                          }}
                          value={state.totalUser}
                        />
                        {!isFormValid && !state.totalUser && (
                          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                            This field is required
                          </p>
                        )}
                      </div>
                    </div>
                    <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                      <div>
                        <InputText
                          label='Brand Corporate'
                          type='text'
                          onChange={e =>
                            setstate({ ...state, brand: e.target.value })
                          }
                          value={state.brand}
                        />
                        {!isFormValid && !state.brand && (
                          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                            This field is required
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input
                          label='Phone'
                          value={state.phoneNumber}
                          onChange={e =>
                            setstate({ ...state, phoneNumber: e.target.value })
                          }
                          type='text'
                        />
                        {!isFormValid && !state.phoneNumber && (
                          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                            This field is required
                          </p>
                        )}
                      </div>
                    </div>
                    <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                      <div>
                        <Label>Code Corporate</Label>
                        <Input
                          label='Code Coporate'
                          value={state.code}
                          readonly
                          className={`bg-[#E6E6E6] !rounded-lg`}
                          type='text'
                        />
                      </div>
                      <div>
                        <Label>Tax ID</Label>
                        <Input
                          type='text'
                          label='Tax ID'
                          value={state.taxId}
                          onChange={e =>
                            setstate({ ...state, taxId: e.target.value })
                          }
                        />
                        {!isFormValid && !state.taxId && (
                          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                            This field is required
                          </p>
                        )}
                      </div>
                    </div>
                    <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                      <div>
                        <Label>Categories</Label>
                        <Input
                          type='text'
                          value={state.catagories}
                          onChange={e =>
                            setstate({ ...state, catagories: e.target.value })
                          }
                        />
                        {!isFormValid && !state.catagories && (
                          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                            This field is required
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>AR Due Date</Label>
                        <InputText
                          type='number'
                          value={state.arDueDate}
                          onChange={e =>
                            setstate({ ...state, arDueDate: e.target.value })
                          }
                        />
                        {!isFormValid && !state.arDueDate && (
                          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                            This field is required
                          </p>
                        )}
                      </div>
                    </div>
                    <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                      <div>
                        <Label>Type</Label>
                        <Input
                          type='text'
                          value={state.corporateType}
                          className={`bg-[#E6E6E6] !rounded-lg`}
                          readonly={`readOnly`}
                        />
                      </div>
                      <div>
                        <Label htmlfor={'statusData'}>Status</Label>
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
                    </div>
                    <Typography
                      className={`font-medium text-lg text-[#212121]`}
                    >
                      Address
                    </Typography>
                    <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                      <div>
                        <Label>Address</Label>
                        <Input
                          type='text'
                          value={state.address}
                          onChange={e =>
                            setstate({ ...state, address: e.target.value })
                          }
                        />
                        {!isFormValid && !state.address && (
                          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                            This field is required
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Subdistrict</Label>
                        <Input
                          type='text'
                          value={state.subDistinct}
                          onChange={e =>
                            setstate({ ...state, subDistinct: e.target.value })
                          }
                        />
                        {!isFormValid && !state.subDistinct && (
                          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                            This field is required
                          </p>
                        )}
                      </div>
                    </div>
                    <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                      <div>
                        <Label>Province</Label>
                        <Input
                          type='text'
                          value={state.province}
                          onChange={e =>
                            setstate({ ...state, province: e.target.value })
                          }
                        />
                        {!isFormValid && !state.province && (
                          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                            This field is required
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>RT</Label>
                        <Input
                          type='text'
                          value={state.rt}
                          onChange={e =>
                            setstate({ ...state, rt: e.target.value })
                          }
                        />
                        {!isFormValid && !state.rt && (
                          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                            This field is required
                          </p>
                        )}
                      </div>
                    </div>
                    <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                      <div>
                        <Label>City</Label>
                        <Input
                          type='text'
                          value={state.city}
                          onChange={e =>
                            setstate({ ...state, city: e.target.value })
                          }
                        />
                        {!isFormValid && !state.city && (
                          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                            This field is required
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>RW</Label>
                        <Input
                          type='text'
                          value={state.rw}
                          onChange={e =>
                            setstate({ ...state, rw: e.target.value })
                          }
                        />
                        {!isFormValid && !state.rw && (
                          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                            This field is required
                          </p>
                        )}
                      </div>
                    </div>
                    <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                      <div>
                        <Label>District</Label>
                        <Input
                          type='text'
                          value={state.district}
                          onChange={e =>
                            setstate({ ...state, district: e.target.value })
                          }
                        />
                        {!isFormValid && !state.district && (
                          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                            This field is required
                          </p>
                        )}
                      </div>
                    </div>
                    <Typography
                      className={`font-medium text-lg text-[#212121]`}
                    >
                      PIC
                    </Typography>
                    <div>
                      {state.pics.map((data, key) => {
                        return (
                          <>
                            {data ? (
                              <>
                                <div className='grid gap-16 mb-6 md:grid-cols-3'>
                                  <div>
                                    <Label>PIC Name </Label>
                                    <InputText
                                      type='text'
                                      name={
                                        key !== 2
                                          ? `picName${key + 1}`
                                          : 'picname'
                                      }
                                      value={`${data.name}`}
                                      onChange={e =>
                                        onChangeData(e, key, 'name')
                                      }
                                    />
                                    {key !== 2 ? (
                                      <>
                                        {!isFormValid && !data.name && (
                                          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                            This field is required
                                          </p>
                                        )}
                                      </>
                                    ) : null}
                                  </div>
                                  <div>
                                    <Label>Contact PIC </Label>
                                    <InputText
                                      type='text'
                                      name={
                                        key !== 2
                                          ? `picContact${key + 1}`
                                          : 'piccontact'
                                      }
                                      value={data.contact}
                                      onChange={e =>
                                        onChangeData(e, key, 'contact')
                                      }
                                    />
                                    {key !== 2 ? (
                                      <>
                                        {!isFormValid && !data.contact && (
                                          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                            This field is required
                                          </p>
                                        )}
                                        {!isFormValid &&
                                          data.contact &&
                                          data.contact.length < 10 &&
                                          numberOnly.test(data.contact) && (
                                            <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                              Too Short!
                                            </p>
                                          )}
                                        {!isFormValid &&
                                          data.contact &&
                                          !numberOnly.test(data.contact) && (
                                            <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                              Number Only!
                                            </p>
                                          )}
                                      </>
                                    ) : null}
                                  </div>
                                </div>
                                <div className='grid gap-16 mb-6 md:grid-cols-3'>
                                  <div>
                                    <Label>Title PIC </Label>
                                    <Input
                                      className='bg-disabledItem !rounded-lg !py-2'
                                      readonly
                                      disabled
                                      value={data.title}
                                      name={
                                        key !== 2
                                          ? `picTitle${key + 1}`
                                          : 'pictitle'
                                      }
                                      type='text'
                                    />
                                  </div>
                                  <div>
                                    <Label>Email PIC </Label>
                                    <InputText
                                      name={
                                        key !== 2
                                          ? `picEmail${key + 1}`
                                          : `picOtherEmail`
                                      }
                                      type={'email'}
                                      value={data.email}
                                      onChange={e =>
                                        onChangeData(e, key, 'email')
                                      }
                                    />
                                    {key !== 2 ? (
                                      <>
                                        {!isFormValid && !data.email && (
                                          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                            This field is required
                                          </p>
                                        )}
                                      </>
                                    ) : null}
                                    {!checkPICEmailIsValid(data.email) &&
                                      data.email && (
                                        <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                          PIC Email must be a valid email
                                        </p>
                                      )}
                                  </div>
                                </div>
                              </>
                            ) : null}

                            {key !== 2 ? (
                              <div className='grid mb-6 md:grid-cols-3'>
                                <div className='w-100 bg-disabled-btn h-[3px] grid md:grid-cols-2'></div>
                                <div className='w-100 bg-disabled-btn h-[3px] grid md:grid-cols-2'></div>
                              </div>
                            ) : null}
                          </>
                        );
                      })}
                    </div>
                    <Typography
                      className={`font-medium text-lg text-[#212121]`}
                    >
                      Site
                    </Typography>
                    <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
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
                      </div>
                    </div>
                    <Typography
                      className={`font-medium text-lg text-[#212121]`}
                    >
                      Supporting Data
                    </Typography>
                    <div className={`grid gap-16 mb-6 md:grid-cols-2`}>
                      <div>
                        <Label>
                          <Typography>SPK</Typography>
                        </Label>
                        <div className='border-[1px] border-[#E6E6E6] rounded-[5px]'>
                          <table className='w-full '>
                            <thead className='bg-[#F3F6F9] text-sm font-semibold text-[#575962] h-[50px] '>
                              <th className='text-start py-[15px] px-[19px]'>
                                No
                              </th>
                              <th className='text-start py-[15px] px-[19px]'>
                                File
                              </th>
                              <th className='text-start py-[15px] px-[19px]'>
                                Note
                              </th>
                              <th className='text-start py-[15px] px-[19px]'>
                                {' '}
                              </th>
                            </thead>
                            <tbody>
                              {docSpk.map((item, index) => {
                                return (
                                  <>
                                    <tr>
                                      <td className='px-[19px] font-normal text-sm'>
                                        {index + 1}
                                      </td>
                                      <td className='font-normal text-sm'>
                                        {item.filename}
                                      </td>
                                      <td className='font-normal text-sm'>
                                        {item.notes}
                                      </td>
                                      <td className='flex justify-center items-center m-2'>
                                        <div
                                          className='bg-[#F64E60] p-1 hover:cursor-pointer rounded-md flex items-center justify-center'
                                          onClick={() =>
                                            handleDeleteDoc(item.id)
                                          }
                                        >
                                          <Image
                                            alt=''
                                            src={assets.IconTrash}
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  </>
                                );
                              })}
                              <tr>
                                <td colSpan='3'>
                                  <div className='p-[15px]'>
                                    <Button
                                      paddingVertical={`py-2`}
                                      paddingHorizontal={`px-4`}
                                      background={`bg-pattensBlue`}
                                      className={
                                        'flex items-center justify-center'
                                      }
                                      onClick={() => handleModals(true, 'SPK')}
                                    >
                                      <Image
                                        src={assets.IconPlusBlue}
                                        alt='create'
                                      />
                                      <Typography
                                        className={`text-btnBlue font-normal text-sm pl-2`}
                                      >
                                        Add File
                                      </Typography>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div>
                        <Label>
                          <Typography>Surat Penawaran Harga</Typography>
                        </Label>
                        <div className='border-[1px] border-[#E6E6E6] rounded-[5px]'>
                          <table className='w-full '>
                            <thead className='bg-[#F3F6F9] text-sm font-semibold text-[#575962] h-[50px] '>
                              <th className='text-start py-[15px] px-[19px]'>
                                No
                              </th>
                              <th className='text-start py-[15px] px-[19px]'>
                                File
                              </th>
                              <th className='text-start py-[15px] px-[19px]'>
                                Note
                              </th>
                              <th className='text-start py-[15px] px-[19px]'></th>
                            </thead>
                            <tbody>
                              {docSph.map((item, index) => {
                                return (
                                  <>
                                    <tr>
                                      <td className='px-[19px] font-normal text-sm'>
                                        {index + 1}
                                      </td>
                                      <td className='font-normal text-sm'>
                                        {item.filename}
                                      </td>
                                      <td className='font-normal text-sm'>
                                        {item.notes}
                                      </td>
                                      <td className='flex justify-center items-center m-2'>
                                        <div
                                          className='bg-[#F64E60] p-1 hover:cursor-pointer rounded-md flex items-center justify-center'
                                          onClick={() =>
                                            handleDeleteDoc(item.id)
                                          }
                                        >
                                          <Image
                                            alt=''
                                            src={assets.IconTrash}
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  </>
                                );
                              })}
                              <tr>
                                <td colSpan='3'>
                                  <div className='p-[15px]'>
                                    <Button
                                      paddingVertical={`py-2`}
                                      paddingHorizontal={`px-4`}
                                      background={`bg-pattensBlue`}
                                      className={
                                        'flex items-center justify-center'
                                      }
                                      onClick={() => handleModals(true, 'SPH')}
                                    >
                                      <Image
                                        src={assets.IconPlusBlue}
                                        alt='create'
                                      />
                                      <Typography
                                        className={`text-btnBlue font-normal text-sm pl-2`}
                                      >
                                        Add File
                                      </Typography>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className={`grid gap-16 mb-6 md:grid-cols-2`}>
                      <div>
                        <Label>
                          <Typography>NPWP</Typography>
                        </Label>
                        <div className='border-[1px] border-[#E6E6E6] rounded-[5px]'>
                          <table className='w-full '>
                            <thead className='bg-[#F3F6F9] text-sm font-semibold text-[#575962] h-[50px] '>
                              <th className='text-start py-[15px] px-[19px]'>
                                No
                              </th>
                              <th className='text-start py-[15px] px-[19px]'>
                                File
                              </th>
                              <th className='text-start py-[15px] px-[19px]'>
                                Note
                              </th>
                              <th></th>
                            </thead>
                            <tbody>
                              {NPWP.map((item, index) => {
                                return (
                                  <>
                                    <tr>
                                      <td className='px-[19px] font-normal text-sm'>
                                        {index + 1}
                                      </td>
                                      <td className='font-normal text-sm'>
                                        {item.filename}
                                      </td>
                                      <td className='font-normal text-sm'>
                                        {item.notes}
                                      </td>
                                      <td className='flex justify-center items-center m-2'>
                                        <div
                                          className='bg-[#F64E60] p-1 hover:cursor-pointer rounded-md flex items-center justify-center'
                                          onClick={() =>
                                            handleDeleteDoc(item.id)
                                          }
                                        >
                                          <Image
                                            alt=''
                                            src={assets.IconTrash}
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  </>
                                );
                              })}
                              <tr>
                                <td colSpan='3'>
                                  <div className='p-[15px]'>
                                    <Button
                                      paddingVertical={`py-2`}
                                      paddingHorizontal={`px-4`}
                                      background={`bg-pattensBlue`}
                                      className={
                                        'flex items-center justify-center'
                                      }
                                      onClick={() => handleModals(true, 'NPWP')}
                                    >
                                      <Image
                                        src={assets.IconPlusBlue}
                                        alt='create'
                                      />
                                      <Typography
                                        className={`text-btnBlue font-normal text-sm pl-2`}
                                      >
                                        Add File
                                      </Typography>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div>
                        <Label>
                          <Typography>
                            Data ID(KTP/Passport) Karyawan yang di swab
                          </Typography>
                        </Label>
                        <div className='border-[1px] border-[#E6E6E6] rounded-[5px]'>
                          <table className='w-full '>
                            <thead className='bg-[#F3F6F9] text-sm font-semibold text-[#575962] h-[50px] '>
                              <th className='text-start py-[15px] px-[19px]'>
                                No
                              </th>
                              <th className='text-start py-[15px] px-[19px]'>
                                File
                              </th>
                              <th className='text-start py-[15px] px-[19px]'>
                                Note
                              </th>
                              <th></th>
                            </thead>
                            <tbody>
                              {identity.map((item, index) => {
                                return (
                                  <>
                                    <tr>
                                      <td className='px-[19px] font-normal text-sm'>
                                        {index + 1}
                                      </td>
                                      <td className='font-normal text-sm'>
                                        {item.filename}
                                      </td>
                                      <td className='font-normal text-sm'>
                                        {item.notes}
                                      </td>
                                      <td className='flex justify-center items-center m-2'>
                                        <div
                                          className='bg-[#F64E60] p-1 hover:cursor-pointer rounded-md flex items-center justify-center'
                                          onClick={() =>
                                            handleDeleteDoc(item.id)
                                          }
                                        >
                                          <Image
                                            alt=''
                                            src={assets.IconTrash}
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  </>
                                );
                              })}
                              <tr>
                                <td colSpan='3'>
                                  <div className='p-[15px]'>
                                    <Button
                                      paddingVertical={`py-2`}
                                      paddingHorizontal={`px-4`}
                                      background={`bg-pattensBlue`}
                                      className={
                                        'flex items-center justify-center'
                                      }
                                      onClick={() =>
                                        handleModals(true, 'IDENTITY')
                                      }
                                    >
                                      <Image
                                        src={assets.IconPlusBlue}
                                        alt='create'
                                      />
                                      <Typography
                                        className={`text-btnBlue font-normal text-sm pl-2`}
                                      >
                                        Add File
                                      </Typography>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className={`grid gap-16 mb-6 md:grid-cols-2`}>
                      <div>
                        <Label>
                          <Typography>Surat Vendor</Typography>
                        </Label>
                        <div className='border-[1px] border-[#E6E6E6] rounded-[5px]'>
                          <table className='w-full '>
                            <thead className='bg-[#F3F6F9] text-sm font-semibold text-[#575962] h-[50px] '>
                              <th className='text-start py-[15px] px-[19px]'>
                                No
                              </th>
                              <th className='text-start py-[15px] px-[19px]'>
                                File
                              </th>
                              <th className='text-start py-[15px] px-[19px]'>
                                Note
                              </th>
                              <th></th>
                            </thead>
                            <tbody>
                              {docVendor.map((item, index) => {
                                return (
                                  <>
                                    <tr>
                                      <td className='px-[19px] font-normal text-sm'>
                                        {index + 1}
                                      </td>
                                      <td className='font-normal text-sm'>
                                        {item.filename}
                                      </td>
                                      <td className='font-normal text-sm'>
                                        {item.notes}
                                      </td>
                                      <td className='flex justify-center items-center m-2'>
                                        <div
                                          className='bg-[#F64E60] p-1 hover:cursor-pointer rounded-md flex items-center justify-center'
                                          onClick={() =>
                                            handleDeleteDoc(item.id)
                                          }
                                        >
                                          <Image
                                            alt=''
                                            src={assets.IconTrash}
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  </>
                                );
                              })}
                              <tr>
                                <td colSpan='3'>
                                  <div className='p-[15px]'>
                                    <Button
                                      paddingVertical={`py-2`}
                                      paddingHorizontal={`px-4`}
                                      background={`bg-pattensBlue`}
                                      className={
                                        'flex items-center justify-center'
                                      }
                                      onClick={() =>
                                        handleModals(true, 'VENDOR_DOCUMENT')
                                      }
                                    >
                                      <Image
                                        src={assets.IconPlusBlue}
                                        alt='create'
                                      />
                                      <Typography
                                        className={`text-btnBlue font-normal text-sm pl-2`}
                                      >
                                        Add File
                                      </Typography>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className='flex justify-center mt-6'>
                      <Button
                        paddingVertical={`py-2`}
                        paddingHorizontal={`px-7`}
                        background={`bg-btnBlue`}
                        className={`disabled:bg-btn-cancel disabled:text-black`}
                        type={`submit`}
                        disabled={!isFormValid}
                        onClick={() => setShowModals(true)}
                      >
                        <Typography
                          className={`text-white font-normal text-sm`}
                        >
                          Save
                        </Typography>
                      </Button>
                      <Button
                        paddingVertical={`py-2`}
                        paddingHorizontal={`px-7`}
                        background={`bg-btn-cancel`}
                        className={`ml-2`}
                        onClick={handleCancel}
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
            <ModalSuccess
              show={successModal}
              onHide={() => {
                setSuccessModal(false);
                if (initialPhoneNumber !== state.pics[0].contact) {
                  setOtpModal(true);
                } else {
                  router.push('/master-corporate');
                }
              }}
              desc1={`Data berhasil disimpan`}
            />
            <Modal
              setIsOpen={val => handleModals(val)}
              width={`w-[50rem]`}
              title={`Confirmation`}
              isOpen={state.isOpenUploadSupportingData}
            >
              <form className={`flex flex-col w-full items-center`}>
                <div
                  className={`flex flex-col w-full items-center justify-start`}
                >
                  <div className={`flex flex-row w-full`}>
                    <div className={`w-6/12 mr-2`}>
                      <Typography className={`pl-1 font-normal text-sm`}>
                        File
                      </Typography>
                    </div>
                    <div className={`w-5/12`}>
                      <Typography className={`pl-1 font-normal text-sm`}>
                        Note
                      </Typography>
                    </div>
                    <div className={`w-1/12 ml-2`}></div>
                  </div>
                  {state.uploadData.length > 0 &&
                    state.uploadData.map((item, key) => {
                      return (
                        <div
                          className={`flex flex-row w-full items-center pb-3`}
                          key={key}
                        >
                          <div className={`w-6/12 mr-2`}>
                            <div className={`border p-3 rounded-md`}>
                              <InputFile
                                onChange={e =>
                                  onChangeBrowseFile(e, item.index)
                                }
                                name={`file[${item.index}]`}
                                fileName={
                                  item.file?.name &&
                                  item.file?.name.substring(0, 12) + '...'
                                }
                                className={`bg-[#1BC5BD] text-[#FFF]`}
                                isWhite
                              />
                            </div>
                          </div>
                          <div className={`w-5/12 mx-2`}>
                            <Textarea
                              cols={4}
                              name={`note[${item.index}]`}
                              onChange={e => onChangeNote(e, item.index)}
                            />
                          </div>
                          <div className={`w-1/12 ml-2 justify-self-end`}>
                            {key > 0 && (
                              <Button
                                className={`bg-[#F64E60] flex items-center p-2`}
                                onClick={() => deleteFile(item.index)}
                                emptyPadding
                              >
                                <Image
                                  src={assets.IconTrash}
                                  alt={`Delete icon`}
                                />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  <div className={`py-4 w-full`}>
                    <Button
                      paddingVertical={`py-2`}
                      paddingHorizontal={`px-5`}
                      background={`bg-pattensBlue`}
                      className={`flex justify-between items-center text-btnBlue`}
                      onClick={() => addFile()}
                    >
                      <Image src={assets.IconPlusBlue} alt={`Create button`} />
                      <Typography className={`pl-1 font-normal text-sm`}>
                        Add File
                      </Typography>
                    </Button>
                  </div>
                </div>
                <div className={`pt-6`}>
                  <Button
                    className={
                      isDocumentValid
                        ? `bg-btnBlue text-white mr-5`
                        : `bg-gray-300 text-white mr-5`
                    }
                    onClick={() => handleUploadDocument()}
                    disabled={!isDocumentValid}
                  >
                    <Typography>Upload</Typography>
                  </Button>
                  <Button
                    onClick={() => handleModals(false)}
                    className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black`}
                  >
                    <Typography>No</Typography>
                  </Button>
                </div>
              </form>
            </Modal>
            <ModalSuccess
              show={otpModal}
              onHide={() => {
                setOtpModal(false);
                router.push('/master-corporate');
              }}
              desc1={`No OTP dan link URL berhasil dikirim ke PIC Corporate dengan no handphone berikut ${state.pics[0]?.contact}`}
            />
          </Card>
        </MainLayout>
      </Transition>
    </>
  );
};

export default Edit;
