import assets from 'public/index';
import { requestDelete, requestGet, requestPost } from 'components/config';
import {
  Button,
  Card,
  DateInput,
  Input,
  InputFile,
  Label,
  LengthChange,
  Modal,
  Pill,
  Textarea,
  TimePicker,
  Typography
} from 'components/atoms';
import HouseCallButtonLabel, {
  StatusAvailableButton
} from 'components/constants/HouseCallButtonLabel';
import LengthChangeValue from 'components/constants/LengthChange';
import Messages from 'components/constants/PopUpMessage';
import { SERVICE_TYPE } from 'components/constants/ServiceMethod';
import { EmptyTable, Pagination } from 'components/molecules';
import { MainLayout, Table } from 'components/organisms';
import { isAllOf } from '@reduxjs/toolkit';
import { currencyFormatter } from 'components/utils/number';
import ParseMessage from 'components/utils/string';
import {
  checkinItem,
  collectedItem,
  fetchHouseCallDetail,
  completeIdentityData,
  collectAllItem,
  inputStatusItem,
  inputStatusAntigenItem,
  fetchAntigenDetailData,
  fetchDownloadResult
} from 'components/store/actions/housecall';
import { Field, FieldArray, Form, Formik } from 'formik';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import {
  uploadDocument,
  deleteDocument
} from 'components/store/actions/transaction';
import ModalConfirmation from '../../../../components/Modals/ModalConfirmation';
import {
  sampleCodeValidationSpesialChar,
  sampleCodeValidationSpace
} from 'components/constants/SamplecodeValidation';
import { ymdToDmy } from 'components/utils/datetime';

const HouseCallSlug = props => {
  const router = useRouter();
  const { slug, id } = router.query;
  const dispatch = useDispatch();
  const selector = useSelector(state => state);
  const { transaction } = selector;
  const [selectedFile, setSelectedFile] = useState();
  const [errorMsg, setErrorMsg] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [state, setState] = useState({
    headline: 'Edit House Call',
    breadcrumbs: [
      {
        link: '/transaction-payment-code',
        name: 'Transaction Payment Code'
      },
      {
        link: `/transaction-payment-code/${id}/house-call/${slug}`,
        name: 'Edit'
      }
    ],
    pagination: {
      p: 1,
      s: LengthChangeValue[0],
      offset: 0,
      limit: LengthChangeValue[0],
      limit: LengthChangeValue[0]
    },
    formInitialValue: {
      transaction_id: '123',
      corporate_name: 'Radya Digital',
      total_payment_code: 5,
      product: 'PCR 12 Jam - Rp 275.000',
      discount: '10%',
      type_service: 'House Call',
      type_service_code: 'house-call',
      status: 'Booked',
      product: 'PCR 12 Jam - Rp 275.000',
      discount: '10%',
      type_service: 'House Call',
      type_service_code: 'house-call',
      status: 'Booked',
      isNeedToSendResult: true,
      table: [
        {
          no: 1,
          payment_code: 'BMPaymentCode_1',
          patient_name: 'Budi',
          nik: '344000000000000',
          sample_code: '-',
          status: 'Booked',
          id: 1
        },
        {
          no: 2,
          payment_code: 'BMPaymentCode_2',
          patient_name: 'Budi',
          nik: '344000000000000',
          sample_code: '-',
          status: 'Booked',
          id: 2
        },
        {
          no: 3,
          payment_code: 'BMPaymentCode_3',
          patient_name: 'Budi',
          nik: '344000000000000',
          sample_code: '-',
          status: 'Booked',
          id: 3
        },
        {
          no: 4,
          payment_code: 'BMPaymentCode_4',
          patient_name: 'Budi',
          nik: '344000000000000',
          sample_code: '-',
          status: 'Booked',
          id: 4
        },
        {
          no: 5,
          payment_code: 'BMPaymentCode_5',
          patient_name: 'Budi',
          nik: '344000000000000',
          sample_code: '-',
          status: 'Booked',
          id: 5
        },
        {
          payment_code: 'BMPaymentCode_6',
          patient_name: 'Budi',
          nik: '344000000000000',
          sample_code: '-',
          status: 'Booked',
          id: 6
        }
      ],
      pic: 'Ahmad',
      address: 'Jl. Setiabudi No. 6',
      cost: '1.000.000',
      note: '',
      medical: 'Ahmad',
      datetime: '22/09/2022 10:00',
      pic: 'Ahmad',
      address: 'Jl. Setiabudi No. 6',
      cost: '1.000.000',
      note: '',
      medical: 'Ahmad',
      datetime: '22/09/2022 10:00',
      supportingData: [
        {
          id: 1,
          file: 'file_supporting_1.doc',
          note: 'Keterangan file Supporting data 1'
        },
        {
          id: 2,
          file: 'file_supporting_2.doc',
          note: 'Keterangan file Supporting data 2'
        }
      ]
    },
    uploadData: [{ index: 1, file: '', note: '' }],
    isOpenUploadSupportingData: false,
    isOpenUpCollectingAll: false,
    startBooking: new Date(),
    endBooking: new Date(),
    spkFileName: 'File_upload.doc',
    penawaranFileName: 'File_upload.doc',
    npwpFileName: 'File_upload.doc',
    ktpFileName: '',
    vendorFileName: '',
    isOpenCheckInConfirmationDialog: false,
    isOpenCollectedConfirmationDialog: false,
    isOpenSavedConfirmationDialog: false,
    isOpenUpdatedConfirmationDialog: false,
    isOpenSendResultConfirmationDialog: false,
    isOpenSampleCodeInput: false,
    isOpenSendResultSuccessDialog: false,
    isOpenDeleteDialog: false,
    isOpenResultConfirmation: false,
    isOpenOTPSuccessDialog: false,
    isOpenError: false,
    isReadonly: false,
    isDisabled: true
  });
  const [itemId, setItemId] = useState(undefined);
  const [statusCovid, setStatusCovid] = useState(undefined);
  const [sampleCode, setSampleCode] = useState(undefined);
  const [checkInState, setCheckInState] = useState({
    itemId: undefined,
    sampleCode: undefined,
    error: false
  });
  const [patientsData, setPatiendData] = useState(new FormData());
  const [cekPCR, setCekPCR] = useState(undefined);
  const [disabledUploadBtn, setDisabledUploadBtn] = useState(false);
  const [onCreate, setOnCreate] = useState(false);

  const submitAll = () => {
    setOnCreate(true);
    if (cekPCR == true) {
      const data = {
        result: 'Negatif'
      };
      dispatch(collectedItem(itemId, data)).then(res => {
        if (res.isSuccess && res.statusCode == 200) {
          setState({
            ...state,
            isOpenUpdatedConfirmationDialog: false,
            isOpenOTPSuccessDialog: true
          });
        } else {
          setErrorMsg(res.response?.data.message);
          setState({
            ...state,
            isOpenUpdatedConfirmationDialog: false,
            isOpenError: true
          });
        }
        setOnCreate(false);
      });
    } else {
      const data = {
        sampleCode,
        result: statusCovid
      };
      dispatch(inputStatusAntigenItem(itemId, data)).then(res => {
        if (res.isSuccess && res.statusCode == 200) {
          setState({
            ...state,
            isOpenUpdatedConfirmationDialog: false,
            isOpenOTPSuccessDialog: true
          });
        } else {
          setErrorMsg(res.response?.data.message);
          setState({
            ...state,
            isOpenUpdatedConfirmationDialog: false,
            isOpenError: true
          });
        }
        setOnCreate(false);
      });
    }
  };

  const onChangeStartBooking = value => {
    setState({
      ...state,
      startBooking: value,
      endBooking: new Date(state.endBooking) < new Date(value) && value
    });
  };

  const onChangeEndBooking = value => {
    setState({
      ...state,
      endBooking:
        new Date(state.startBooking) > new Date(value)
          ? state.startBooking
          : value
    });
  };

  const onChangeLength = val => {
    const offset = (1 - 1) * val;
    setState({
      ...state,
      pagination: {
        ...state.pagination,
        s: val,
        p: 1,
        offset: offset,
        limit: +offset + +val
      }
    });
  };

  const onClickPagination = val => {
    const offset = (val - 1) * state.pagination.s;
    setState({
      ...state,
      pagination: {
        ...state.pagination,
        p: val,
        offset: offset,
        limit: +offset + +state.pagination.s
      }
    });
  };

  const setIsOpenSampleCodeDialog = (value, itemId, type = '') => {
    if (itemId) {
      setCheckInState({
        ...checkInState,
        itemId: itemId
      });
    } else {
      setCheckInState({
        ...checkInState,
        sampleCode: undefined,
        error: false
      });
    }
    if (type === 'submit') {
      setState({
        ...state,
        isOpenSampleCodeDialog: false,
        isOpenCheckInConfirmationDialog: true
      });
    } else {
      setState({
        ...state,
        isOpenSampleCodeDialog: value
      });
    }
  };

  const setIsOpenCheckInConfirmationDialog = (value, itemId) => {
    if (itemId) {
      setItemId(itemId);
    }
    setState({
      ...state,
      isOpenCheckInConfirmationDialog: value
    });
  };

  const setIsOpenCollectedConfirmationDialog = (value, itemId) => {
    if (itemId) {
      setItemId(itemId);
    }
    setState({
      ...state,
      isOpenCollectedConfirmationDialog: value
    });
  };

  const setIsOpenSavedConfirmationDialog = value => {
    setState({
      ...state,
      isOpenSavedConfirmationDialog: value
    });
  };

  const setIsOpenUpdatedConfirmationDialog = (value, itemId) => {
    if (itemId) {
      setItemId(itemId);
    }
    setState({
      ...state,
      isOpenUpdatedConfirmationDialog: value
    });
  };

  const setIsOpenSendResultConfirmationDialog = value => {
    setState({
      ...state,
      isOpenSendResultConfirmationDialog: value
    });
  };
  const setIsOpenOTPSuccessDialog = value => {
    setState({
      ...state,
      isOpenOTPSuccessDialog: value
    });
  };

  const setIsOpenError = value => {
    setState({
      ...state,
      isOpenError: value
    });
  };

  const setIsOpenSendResultSuccessDialog = value => {
    setState({
      ...state,
      isOpenSendResultSuccessDialog: value
    });
  };

  const setIsOpenDeleteDialog = value => {
    setState({
      ...state,
      isOpenDeleteDialog: value
    });
  };

  const setIsOpenUploadSupportingData = value => {
    setState({ ...state, isOpenUploadSupportingData: value });
  };

  const setIsOpenUpCollectingAll = value => {
    setState({ ...state, isOpenUpCollectingAll: value });
  };

  const setIsOpenUpSampleCodeInput = (value, itemId = 0) => {
    if (itemId > 0) {
      setItemId(itemId);
    }
    setState({ ...state, isOpenSampleCodeInput: value });
  };

  const setIsOpenUpResultConfirmation = (value, itemId, status, sampleCode) => {
    if (itemId) {
      setItemId(itemId);
    }
    if (sampleCode) {
      setSampleCode(sampleCode);
    }
    if (status == false) {
      setCekPCR(true);
      setState({ ...state, isOpenUpdatedConfirmationDialog: value });
    } else {
      setCekPCR(false);
      setState({ ...state, isOpenResultConfirmation: value });
    }
  };

  const addFile = () => {
    setState({
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
  const onChangeBrowseFile = (e, index) => {
    const upload = state.uploadData.map((item, i) => {
      if (item.index === index) {
        item.file = e.target.files[0];
      }

      return item;
    });
    setState({
      ...state,
      uploadData: upload
    });
  };

  const deleteFile = index => {
    const upload = state.uploadData.filter((item, i) => {
      return item.index !== index;
    });
    setState({
      ...state,
      uploadData: upload
    });
  };

  const deleteSupportingData = documentId => {
    dispatch(deleteDocument(documentId)).then(res => {
      dispatch(fetchHouseCallDetail(id));
    });
  };

  const validationSchema = Yup.object().shape({
    sample: Yup.string()
      .min(20, 'Too Short!')
      .required('This field is required')
      .matches(sampleCodeValidationSpesialChar, 'No special character')
      .matches(sampleCodeValidationSpace, 'Cant use blankspace')
  });

  const onChangeNote = (e, index) => {
    const upload = state.uploadData.map((item, i) => {
      if (item.index === index) {
        item.note = e.target.value;
      }

      return item;
    });
    setState({
      ...state,
      uploadData: upload
    });
  };
  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
    }
    const data = new FormData();
    setSelectedFile(e.target.files[0]);
    setIsSuccess(true);
  };

  const uploadSupportinData = () => {
    state.uploadData.forEach((item, index) => {
      const formData = new FormData();
      formData.append('TransactonId', id);
      formData.append('Type', 'supporting-data');
      formData.append('file', item.file);
      formData.append('notes', item.note);

      dispatch(uploadDocument(formData)).then(res => {
        if (res?.statusCode === 200 && index === state.uploadData.length - 1) {
          router.reload();
        }
      });
    });
  };

  const removePatientData = e => {
    setIsSuccess(false);
    setSelectedFile(undefined);
  };

  const collectAll = id => {
    dispatch(collectAllItem(id)).then(res => {
      if (res.statusCode == 200) {
        setState({
          ...state,
          isOpenUpCollectingAll: false,
          isOpenOTPSuccessDialog: true
        });
      } else {
        setErrorMsg(res.response.data.message);
        setIsOpenError(true);
      }
    });
  };

  const submitCheckin = () => {
    dispatch(checkinItem(itemId, sampleCode)).then(res => {
      if (res) {
        setState({
          ...state,
          isOpenCheckInConfirmationDialog: false
        });
      }
    });
    setState({
      ...state,
      isOpenCheckInConfirmationDialog: false
    });
  };

  const form = useRef(null);

  const headColumns = [
    {
      key: 'no',
      name: 'No'
    },
    {
      key: 'payment_code',
      name: 'Payment Code',
      className: 'text-left'
    },
    {
      key: 'patient_name',
      name: 'Nama Pasien',
      className: 'text-left'
    },
    {
      key: 'nik',
      name: 'NIK',
      className: 'text-left'
    },
    {
      key: 'sample_code',
      name: 'Sample Code',
      className: `${
        state.formInitialValue.status === 'Booked' && slug == 'edit'
          ? 'hidden'
          : ''
      } text-left`
    },
    {
      key: 'status',
      name: 'Status',
      className: `${
        state.formInitialValue.status === 'Booked' && slug == 'edit'
          ? 'hidden'
          : ''
      }`
    },
    {
      key: 'action',
      name: `${
        state.formInitialValue.status === 'Booked' ||
        state.formInitialValue.status === 'Check In'
          ? 'Action'
          : 'Result'
      }`,
      className: `${
        state.formInitialValue.status === 'Collected' ||
        (state.formInitialValue.status === 'Booked' && slug == 'edit')
          ? 'hidden'
          : ''
      }`
    }
  ];

  const suppDataHeadColumns = [
    { key: 'no', name: 'No', className: 'w-[3rem] py-[15px] px-[0px]' },
    { key: 'file', name: 'File', className: 'text-left py-[15px] px-[0px]' },
    { key: 'note', name: 'Note', className: 'text-left py-[15px] px-[0px]' },
    { key: 'action', name: '', className: 'text-left py-[15px] px-[0px]' }
  ];

  const validationSchemaSampleCode = Yup.object().shape({
    sampleCode: Yup.string()
      .required('Please fill out this field')
      .min(20, 'Minimal 20 character')
      .max(25, 'Maximal 25 character')
      .matches(sampleCodeValidationSpesialChar, 'No special character')
      .matches(sampleCodeValidationSpace, 'Cant use blankspace')
  });

  const UploadControl = ({ children, value, onChange, disabled, accept }) => {
    return (
      <label htmlFor='contained-button-file' className='m-0 w-100'>
        <input
          value={value}
          accept={accept}
          disabled={disabled}
          style={{ display: 'none' }}
          id='contained-button-file'
          multiple
          type='file'
          onChange={disabled ? () => {} : onChange}
        />
        {children}
      </label>
    );
  };

  String.prototype.insert = function (index, string) {
    if (index > 0) {
      return this.substring(0, index) + string + this.substr(index);
    }

    return string + this;
  };

  useEffect(() => {
    if (slug == 'detail') {
      setState({
        ...state,
        isReadonly: true,
        isDisabled: false,
        headline: 'Detail House Call',
        breadcrumbs: [
          {
            link: '/transaction-payment-code',
            name: 'Transaction Payment Code'
          },
          {
            link: `/transaction-payment-code/${id}/house-call/${slug}`,
            name: 'Detail'
          }
        ]
      });
    }
    if (state.isOpenSendResultSuccessDialog) {
      setState({
        ...state,
        isOpenSendResultConfirmationDialog: false
      });
    }
    if (id) {
      dispatch(fetchHouseCallDetail(id));
    }
  }, [slug, id, state.isOpenSendResultSuccessDialog, dispatch]);
  return (
    <>
      <Head>
        <title>Bumame CMS</title>
        <link
          rel='icon'
          href={`${process.env.NEXT_PUBLIC_PREFIX_URL || ''}/favicon.ico`}
        />
      </Head>
      <MainLayout headline={state.headline} breadcrumb={state.breadcrumbs}>
        {transaction.houseCallDetail && (
          <Formik
            initialValues={transaction.houseCallDetail}
            enableReinitialize
          >
            {({ values, errors }) => (
              <Form>
                {/* Upper Section Form */}
                {slug == 'detail' && (
                  <Card
                    rounded={`rounded-lg`}
                    shadow={`shadow-lg`}
                    padding={`p-7`}
                    className={`mb-5`}
                  >
                    {/* First Row */}
                    <div className={`grid gap-16 mb-5 md:grid-cols-3`}>
                      <div>
                        <Label htmlFor={`id`}>Transaction Id</Label>
                        <Field
                          component={Input}
                          placeholder='Transaction ID'
                          name='id'
                          readonly={state.isReadonly}
                          disabled={state.isDisabled}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`serviceType`}>Type Service</Label>
                        <Field
                          component={Input}
                          placeholder={`Type Service`}
                          name='serviceType'
                          value={
                            SERVICE_TYPE.find(obj => {
                              if (obj?.value === values?.serviceType) {
                                return obj?.label;
                              }
                              return values?.serviceType;
                            })?.label
                          }
                          readonly={state.isReadonly}
                          disabled={state.isDisabled}
                        />
                      </div>
                      <div className={`grid gap-4 md:grid-cols-2`}>
                        <div>
                          <Label className={`pb-2`}>Status</Label>
                          <div className='inline-flex'>
                            <Pill
                              type={values.statusValue
                                .toLowerCase()
                                .replace(' ', '_')}
                            />
                          </div>
                        </div>
                        <div></div>
                      </div>
                    </div>
                    {/* Second Row */}
                    <div className={`grid gap-16 mb-5 md:grid-cols-3`}>
                      <div>
                        <Label htmlFor={`corporateName`}>Name Corporate</Label>
                        <Field
                          component={Input}
                          placeholder={`Corporate Name`}
                          name='corporateName'
                          readonly={state.isReadonly}
                          disabled={state.isDisabled}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`productName`}>Product</Label>
                        <Field
                          component={Input}
                          placeholder={`Corporate Name`}
                          name='productName'
                          value={`${values.productName} - ${currencyFormatter(
                            values.productPrice
                          )}`}
                          readonly={state.isReadonly}
                          disabled={state.isDisabled}
                        />
                      </div>
                    </div>
                    {/* Third Row */}
                    <div className={`grid gap-16 mb-5 md:grid-cols-3`}>
                      <div>
                        <Label htmlFor={`qty`}>Total Payment Code</Label>
                        <Field
                          component={Input}
                          placeholder={`Total Payment Code`}
                          name='qty'
                          readonly={state.isReadonly}
                          disabled={state.isDisabled}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`discount`}>Discount</Label>
                        <Field
                          component={Input}
                          placeholder={`Discount`}
                          name='discount'
                          value={values.discount + '%'}
                          readonly={state.isReadonly}
                          disabled={state.isDisabled}
                        />
                      </div>
                    </div>
                    <div className={`grid gap-16 mb-5 md:grid-cols-3`}>
                      <div>
                        <Label htmlFor={`qty`}>Assign Site</Label>
                        <Field
                          component={Input}
                          placeholder={`Total Payment Code`}
                          name='site.siteName'
                          readonly={state.isReadonly}
                          disabled={state.isDisabled}
                        />
                      </div>
                      <div></div>
                    </div>
                  </Card>
                )}
                {slug == 'edit' && (
                  <Card
                    rounded={`rounded-lg`}
                    shadow={`shadow-lg`}
                    padding={`p-7`}
                    className={`mb-5`}
                  >
                    {/* First Row */}
                    <div className={`grid gap-16 mb-5 md:grid-cols-3`}>
                      <div>
                        <Label htmlFor={`corporateName`}>Name Corporate</Label>
                        <Field
                          component={Input}
                          placeholder={`Corporate Name`}
                          name='corporateName'
                          readonly={state.isReadonly}
                          disabled={state.isDisabled}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`product`}>Select Product</Label>
                        <Field
                          component={Input}
                          placeholder={`Corporate Name`}
                          name='productName'
                          value={`${values.productName} - ${currencyFormatter(
                            values.productPrice
                          )}`}
                          readonly={state.isReadonly}
                          disabled={state.isDisabled}
                        />
                      </div>
                      <div className={`grid md:grid-cols-2`}>
                        <div>
                          <Label className={`pb-2`}>Status</Label>
                          <div className='inline-flex'>
                            <Pill
                              type={values.statusValue
                                .toLowerCase()
                                .replace(' ', '_')}
                            />
                          </div>
                        </div>
                        <div></div>
                      </div>
                    </div>
                    {/* Second Row */}
                    <div className={`grid gap-16 mb-5 md:grid-cols-3`}>
                      <div>
                        <Label htmlFor={`qty`}>Total Payment Code</Label>
                        <Field
                          component={Input}
                          placeholder={`Total Payment Code`}
                          name='qty'
                          readonly={state.isReadonly}
                          disabled={state.isDisabled}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`discount`}>Discount</Label>
                        <Field
                          component={Input}
                          placeholder={`Discount`}
                          name='discount'
                          value={values.discount + '%'}
                          readonly={state.isReadonly}
                          disabled={state.isDisabled}
                        />
                      </div>
                    </div>
                    {/* Third Row */}
                    <div className={`grid gap-16 mb-5 md:grid-cols-3`}>
                      <div>
                        <Label htmlFor={`qty`}>Assign Site</Label>
                        <Field
                          component={Input}
                          placeholder={`Total Payment Code`}
                          name='site.siteName'
                          readonly={state.isReadonly}
                          disabled={state.isDisabled}
                        />
                      </div>
                      <div></div>
                    </div>
                  </Card>
                )}
                {/* Lower Section Form */}
                <Card
                  rounded={`rounded-lg`}
                  shadow={`shadow-lg`}
                  padding={`p-7`}
                  className={`mb-5`}
                >
                  <div className={`grid gap-16 mb-5 md:grid-cols-2`}>
                    <Label>Table Payment Code</Label>
                    <div
                      className={`flex items-end justify-end align-end ${
                        values.isNeedToSendResult === false &&
                        slug == 'detail' &&
                        values.statusValue.toLowerCase() == 'checkin'
                          ? ''
                          : 'hidden'
                      }`}
                    >
                      <Button
                        className={`bg-[#B0DC00] flex items-center px-6 py-2`}
                        onClick={() => setIsOpenUpCollectingAll(true)}
                        emptyPadding
                      >
                        <Typography
                          className={`font-normal text-sm text-white`}
                        >
                          Collected All
                        </Typography>
                      </Button>
                    </div>
                  </div>
                  <div
                    className={`${
                      values.statusValue === 'Booked' && slug == 'edit'
                        ? ''
                        : 'hidden'
                    }`}
                  >
                    <div className={`flex my-6`}>
                      <div
                        className={`flex items-center justify-center align-center`}
                      >
                        <Button
                          className={`bg-[#349EFF] disabled:bg-[#D8DFE5]`}
                          htmlFor='formId'
                          disabled={disabledUploadBtn}
                        >
                          <UploadControl
                            onChange={onSelectFile}
                            disabled={disabledUploadBtn}
                          >
                            {isSuccess ? (
                              <>
                                <div className={`flex items-center text-white`}>
                                  <Image
                                    src={assets.IconTableRefresh}
                                    alt={`Add Icon`}
                                  />
                                  <div className={`ml-5`}>
                                    Replace Data Pasien
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className={`flex items-center text-white`}>
                                  <Image
                                    src={assets.IconPlus}
                                    alt={`Add Icon`}
                                  />
                                  <div className={`ml-5`}>
                                    Import Data Pasien
                                  </div>
                                </div>
                              </>
                            )}
                          </UploadControl>
                        </Button>
                      </div>
                      {isSuccess ? (
                        <>
                          <div
                            className={`mx-5 flex items-center justify-center align-center`}
                          >
                            {selectedFile.name}
                          </div>
                        </>
                      ) : null}
                      {isSuccess ? (
                        <>
                          <div
                            className={`flex items-center justify-center align-center`}
                          >
                            <Button
                              className={`bg-[#F64E60] flex items-center p-2`}
                              onClick={() => removePatientData()}
                              emptyPadding
                            >
                              <Image
                                src={assets.IconTrash}
                                alt={`Delete icon`}
                              />
                            </Button>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <FieldArray name={`items`}>
                    {arrayHelpers => (
                      <div
                        className={`w-full h-full overflow-x-auto space-y-[16px] flex flex-col rounded border border-[#E6E6E6]`}
                      >
                        <Table headColumns={headColumns}>
                          {values.items?.length > 0 ? (
                            values.items
                              ?.slice(
                                state.pagination.offset,
                                state.pagination.limit
                              )
                              .map((item, key) => {
                                return (
                                  <tr
                                    key={key}
                                    className={`text-center odd:bg-[#FCFCFC] even:bg-white`}
                                  >
                                    <td className={`py-6 px-6`}>
                                      <Typography>
                                        {key + 1 + state.pagination.offset}
                                      </Typography>
                                    </td>
                                    <td className={`text-left`}>
                                      <Typography>
                                        {item.paymentCode}
                                      </Typography>
                                    </td>
                                    <td
                                      className={` ${
                                        state.formInitialValue.status ===
                                          'Booked' && slug == 'edit'
                                          ? 'pr-5'
                                          : ''
                                      }`}
                                    >
                                      <Field
                                        className={`read-only:border-none read-only:hover:cursor-default read-only:bg-transparent`}
                                        component={Input}
                                        name={`items[${key}].identityName`}
                                        readonly={state.isReadonly}
                                        disabled={state.isDisabled}
                                        placeholder='Nama Pasien'
                                      />
                                    </td>
                                    <td
                                      className={`${
                                        state.formInitialValue.status ===
                                          'Booked' && slug == 'edit'
                                          ? 'pr-5'
                                          : ''
                                      }`}
                                    >
                                      <Field
                                        className={`read-only:border-none read-only:hover:cursor-default read-only:bg-transparent`}
                                        component={Input}
                                        name={`items[${key}].identityNumber`}
                                        readonly={state.isReadonly}
                                        disabled={state.isDisabled}
                                        placeholder='NIK'
                                      />
                                    </td>
                                    <td
                                      className={`text-left ${
                                        slug == 'edit' ? 'hidden' : ''
                                      }`}
                                    >
                                      <Typography>
                                        {item.sampleCode
                                          ? item.sampleCode
                                          : '-'}
                                      </Typography>
                                    </td>
                                    <td
                                      className={`px-6 text-center h-full w-fit ${
                                        slug == 'edit' ? 'hidden' : ''
                                      }`}
                                    >
                                      <Pill
                                        type={item.status
                                          .toLowerCase()
                                          .replace(' ', '_')}
                                        fit={false}
                                      >
                                        {item.status}
                                      </Pill>
                                    </td>

                                    <td
                                      className={`pr-2 ${
                                        slug == 'detail' ? '' : 'hidden'
                                      }`}
                                    >
                                      {item.status === 'Booked' ||
                                      item.status == 'CheckIn' ? (
                                        <>
                                          <Button
                                            onClick={
                                              item.status.toLowerCase() !=
                                              'checkin'
                                                ? () =>
                                                    setIsOpenSampleCodeDialog(
                                                      true,
                                                      item.id
                                                    )
                                                : () =>
                                                    setIsOpenUpResultConfirmation(
                                                      true,
                                                      item.id,
                                                      values.isNeedToSendResult,
                                                      item.sampleCode
                                                    )
                                            }
                                            className={`${
                                              item.status
                                                .toLowerCase()
                                                .replace(' ', '_') === 'booked'
                                                ? 'bg-label-completed-text hover:bg-label-completed-text/80'
                                                : 'bg-label-collected-text hover:bg-label-collected-text/80'
                                            } rounded-lg text-white disabled:bg-[#D8DFE5] disabled:hover:bg-[#D8DFE5]`}
                                            disabled={
                                              item.status
                                                .toLowerCase()
                                                .replace(' ', '_') ==
                                                'collected' ||
                                              item.identityName == ''
                                            }
                                          >
                                            <Typography
                                              className={`font-normal text-sm`}
                                            >
                                              {item.status
                                                .toLowerCase()
                                                .replace(' ', '_') == 'booked'
                                                ? 'Check In'
                                                : 'Collected'}
                                            </Typography>
                                          </Button>
                                        </>
                                      ) : (
                                        <Link
                                          href={
                                            item.resultUrl
                                              ? item.resultUrl
                                              : '#'
                                          }
                                          target='_blank'
                                        >
                                          {item.result.toLowerCase() !==
                                          'reswab' ? (
                                            <>
                                              <div>
                                                <Button
                                                  onClick={() =>
                                                    dispatch(
                                                      fetchDownloadResult(
                                                        item.id,
                                                        item.resultFilename
                                                      )
                                                    )
                                                  }
                                                  className={`${
                                                    item.status.toLowerCase() ===
                                                    'completed'
                                                      ? 'bg-label-waiting-result-text hover:bg-label-waiting-result-text/80 rounded-lg text-white '
                                                      : 'bg-gray-400 text-white'
                                                  }`}
                                                  disabled={
                                                    item.status.toLowerCase() !==
                                                    'completed'
                                                  }
                                                >
                                                  <Typography className='font-normal text-sm'>
                                                    Download PDF
                                                  </Typography>
                                                </Button>
                                              </div>
                                            </>
                                          ) : (
                                            <>
                                              <Pill
                                                type={item.result
                                                  .toLowerCase()
                                                  .replace(' ', '_')}
                                              />
                                            </>
                                          )}
                                        </Link>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })
                          ) : (
                            <EmptyTable
                              colSpan={headColumns.length}
                              title={`List House Calls Empty`}
                            />
                          )}
                        </Table>
                        <div className={`py-4 pl-3 flex`}>
                          <div className={`flex flex-row items-center`}>
                            <Typography>Showing</Typography>
                            <LengthChange length={onChangeLength} />
                            <Typography>Entries</Typography>
                          </div>
                          <Pagination
                            itemsPerPage={state.pagination.s || 10}
                            total={
                              transaction.items ? transaction.items.length : 0
                            }
                            onClick={value => onClickPagination(value)}
                            currentPage={state.pagination.p}
                          />
                        </div>
                      </div>
                    )}
                  </FieldArray>

                  <div
                    className={`grid gap-x-16 gap-y-5 grid-cols-1 mb-6 lg:grid-cols-3 pt-6`}
                  >
                    <div>
                      <Typography className={`font-medium text-lg`}>
                        Data Information
                      </Typography>
                    </div>
                    <div></div>
                    <div></div>
                    <div>
                      <Label htmlFor={'picName'}>PIC</Label>
                      <Field
                        placeholder='PIC Name'
                        component={Input}
                        name={`picName`}
                        readonly={state.isReadonly}
                        disabled={state.isDisabled}
                        value={
                          values?.picName === ''
                            ? values?.corporateName
                            : values?.picName
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor={'additionalCost'}>Cost Tambahan​</Label>
                      <Field
                        placeholder='Cost Tambahan​'
                        component={Input}
                        name={`additionalCost`}
                        value={currencyFormatter(values.additionalCost)}
                        readonly={state.isReadonly}
                        disabled={state.isDisabled}
                      />
                    </div>
                    <div></div>
                    <div>
                      <Label htmlFor={'address'}>Alamat</Label>
                      <Field
                        placeholder='Alamat'
                        component={Input}
                        name={`address`}
                        readonly={state.isReadonly}
                        disabled={state.isDisabled}
                      />
                    </div>
                    <div>
                      <Label htmlFor={'notes'}>Description</Label>
                      {state.isReadonly ? (
                        <Field
                          placeholder='Description'
                          component={Input}
                          name={`notes`}
                          readonly={state.isReadonly}
                          disabled={state.isDisabled}
                        />
                      ) : (
                        <Field
                          placeholder='Description'
                          component={Textarea}
                          name={`notes`}
                          rows={3}
                          readonly={state.isReadonly}
                          disabled={state.isDisabled}
                        />
                      )}
                    </div>
                    <div></div>
                  </div>
                  <div
                    className={`grid gap-x-16 gap-y-5 grid-cols-1 mb-6 lg:grid-cols-3 pt-6`}
                  >
                    <div>
                      <Typography className={`font-medium text-lg`}>
                        Action Schedule
                      </Typography>
                    </div>
                    <div></div>
                    <div></div>
                    <div>
                      <Label htmlFor={'pic'}>Tenaga Kesehatan</Label>
                      <Field
                        placeholder='Tenaga Kesehatan'
                        component={Input}
                        name={`schedule.pic`}
                        readonly={state.isReadonly}
                        disabled={state.isDisabled}
                      />
                    </div>
                    <div></div>
                    <div></div>
                    <div>
                      <Label htmlFor={'booking_date'}>Booking Date</Label>
                      <Field
                        placeholder='Booking Date'
                        component={Input}
                        name={`schedule.bookingDate`}
                        value={ymdToDmy(values?.schedule?.bookingDate)}
                        readonly={state.isReadonly}
                        disabled
                      />
                    </div>
                    <div>
                      <Label htmlFor={'booking_time'}>Booking Time</Label>
                      <Field
                        placeholder='Booking Time'
                        component={Input}
                        name={`schedule.timeStart`}
                        value={
                          values.schedule?.timeStart && values.schedule?.timeEnd
                            ? `${('' + values.schedule?.timeStart)
                                .padStart(4, '0')
                                .insert(2, ':')} - ${(
                                '' + values.schedule?.timeEnd
                              )
                                .padStart(4, '0')
                                .insert(2, ':')}`
                            : null
                        }
                        readonly={state.isReadonly}
                        disabled
                      />
                    </div>
                    <div></div>
                  </div>
                  <div className={`pb-4`}>
                    <Typography className={`font-medium text-lg`}>
                      Supporting Data
                    </Typography>
                  </div>
                  <FieldArray name={`documents`}>
                    {arrayHelpers => (
                      <div
                        className={`w-2/3 h-full mb-6 overflow-x-auto space-y-[16px] flex flex-col rounded border border-[#E6E6E6]`}
                      >
                        <Table headColumns={suppDataHeadColumns}>
                          {values.documents?.length > 0 &&
                            values.documents?.map((item, key) => {
                              return (
                                <tr
                                  key={key}
                                  className={`text-center odd:bg-[#FCFCFC] even:bg-white`}
                                >
                                  <td className={`py-4 w-1/12`}>
                                    <Typography>{key + 1}</Typography>
                                  </td>
                                  <td className={`text-left w-4/12`}>
                                    <Typography>{item.fileName}</Typography>
                                  </td>
                                  <td className={`text-left w-6/12`}>
                                    <Typography>{item.notes}</Typography>
                                  </td>
                                  {/* {slug === 'detail' && ( */}
                                  <td className={`text-center w-1/12`}>
                                    <div className={`ml-2 justify-self-end`}>
                                      <Button
                                        className={`bg-[#F64E60] flex items-center p-2`}
                                        onClick={() =>
                                          deleteSupportingData(item.id)
                                        }
                                        emptyPadding
                                      >
                                        <Image
                                          src={assets.IconTrash}
                                          alt={`Delete icon`}
                                        />
                                      </Button>
                                    </div>
                                  </td>
                                  {/* )} */}
                                </tr>
                              );
                            })}
                          <tr>
                            <td colSpan={2}>
                              <div className={`p-4`}>
                                <Button
                                  paddingVertical={`py-2`}
                                  paddingHorizontal={`px-5`}
                                  background={`bg-pattensBlue`}
                                  className={`flex justify-between items-center text-btnBlue`}
                                  onClick={() =>
                                    setIsOpenUploadSupportingData(true)
                                  }
                                >
                                  <Image
                                    src={assets.IconPlusBlue}
                                    alt={`Create button`}
                                  />
                                  <Typography
                                    className={`pl-1 font-normal text-sm`}
                                  >
                                    Add File
                                  </Typography>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        </Table>
                      </div>
                    )}
                  </FieldArray>
                  <div className={`grid gap-16 mt-14 mb-7 md:grid-cols-3`}>
                    <div>
                      {StatusAvailableButton.includes(
                        state.formInitialValue.status
                          .toLowerCase()
                          .replace(' ', '_')
                      ) && (
                        <Button
                          className={`bg-label-completed-text rounded-lg text-white mr-6`}
                          onClick={() => {
                            state.formInitialValue.status
                              .toLowerCase()
                              .replace(' ', '_') == 'collected'
                              ? setIsOpenUpdatedConfirmationDialog(
                                  true,
                                  item.id
                                )
                              : setIsOpenSendResultConfirmationDialog(true);
                          }}
                        >
                          <Typography className={`font-normal text-sm`}>
                            {
                              HouseCallButtonLabel[
                                state.formInitialValue.status
                                  .toLowerCase()
                                  .replace(' ', '_')
                              ]
                            }
                          </Typography>
                        </Button>
                      )}
                    </div>
                    <div>
                      {slug === 'edit' && (
                        <Button
                          background={
                            selectedFile !== undefined
                              ? `bg-btnBlue`
                              : `bg-gray-400`
                          }
                          className={` mr-6
                              ${
                                selectedFile !== undefined
                                  ? `bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white`
                                  : `text-white`
                              }
                              `}
                          onClick={() => {
                            setIsOpenSavedConfirmationDialog(true);
                          }}
                          disabled={selectedFile === undefined}
                        >
                          <Typography className={`font-normal text-sm`}>
                            Save
                          </Typography>
                        </Button>
                      )}
                      <Button
                        className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black`}
                        onClick={() => {
                          router.back();
                        }}
                      >
                        <Typography>Back</Typography>
                      </Button>
                    </div>
                  </div>
                </Card>
              </Form>
            )}
          </Formik>
        )}

        <Modal
          setIsOpen={val => setIsOpenCollectedConfirmationDialog(val)}
          width={`w-[27rem]`}
          title={`Confirmation`}
          isOpen={state.isOpenCollectedConfirmationDialog}
        >
          <Typography>
            {ParseMessage(Messages.checkInConfirmation, 'Collected')}
          </Typography>
          <div className={`pt-10`}>
            <Button
              onClick={() => {
                if (itemId) {
                  dispatch(collectedItem(itemId)).then(res => {
                    if (res) {
                      setItemId(undefined);
                      setIsOpenCollectedConfirmationDialog(false);
                    }
                  });
                }
              }}
              className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white mr-5`}
            >
              <Typography>Yes</Typography>
            </Button>
            <Button
              onClick={() => setIsOpenCollectedConfirmationDialog(false)}
              className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black`}
            >
              <Typography>No</Typography>
            </Button>
          </div>
        </Modal>
        {/* Checkin Input Sample Code */}
        {state.isOpenSampleCodeDialog && (
          <Modal
            setIsOpen={val => setIsOpenSampleCodeDialog(val)}
            width={`w-[27rem]`}
            title={`Check In`}
            isOpen={state.isOpenSampleCodeDialog}
          >
            <Formik
              initialValues={checkInState}
              validationSchema={validationSchemaSampleCode}
              onSubmit={values => {
                setCheckInState({
                  itemId: values.itemId,
                  sampleCode: values.sampleCode
                });
                setState({
                  ...state,
                  isOpenCheckInConfirmationDialog: true,
                  isOpenSampleCodeDialog: false
                });
              }}
              enableReinitialize
            >
              {({ values, errors, touched, setFieldValue }) => (
                <Form className='w-full flex flex-col items-center'>
                  <Typography>Masukan Sample Code</Typography>
                  <div className='w-full pt-4'>
                    <Field
                      name='sampleCode'
                      component={Input}
                      type='text'
                      placeholder='Sample Code'
                    />
                    {errors &&
                      errors.items &&
                      errors.items[key] &&
                      errors.items[key].sampleCode &&
                      touched &&
                      touched.items &&
                      touched.items[key] &&
                      touched.items[key].sampleCode && (
                        <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                          {errors.items[key].sampleCode}
                        </p>
                      )}
                    {checkInState.error && (
                      <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                        Sample Code Exist
                      </p>
                    )}
                    <Field
                      name='itemId'
                      component={Input}
                      type='hidden'
                      placeholder='Item ID'
                    />
                  </div>
                  <div className={`pt-10`}>
                    <Button
                      type='submit'
                      className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white mr-5`}
                    >
                      <Typography>Submit</Typography>
                    </Button>
                    <Button
                      onClick={() => setIsOpenSampleCodeDialog(false)}
                      className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black`}
                    >
                      <Typography>No</Typography>
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Modal>
        )}
        {/* Checkin Confirmation Dialog */}
        {state.isOpenCheckInConfirmationDialog && (
          <Modal
            setIsOpen={val => setIsOpenCheckInConfirmationDialog(val)}
            width={`w-[27rem]`}
            title={`Confirmation`}
            isOpen={state.isOpenCheckInConfirmationDialog}
          >
            <Typography>
              {ParseMessage(Messages.checkInConfirmation, 'Check In')}
            </Typography>
            <div className={`pt-10`}>
              <Button
                onClick={() => {
                  if (checkInState.itemId && checkInState.sampleCode) {
                    dispatch(
                      checkinItem(checkInState.itemId, {
                        sampleCode: checkInState.sampleCode
                      })
                    ).then(res => {
                      if (res.isSuccess && res.statusCode == 200) {
                        setIsOpenCheckInConfirmationDialog(false);
                        dispatch(fetchHouseCallDetail(id));
                        setCheckInState({
                          itemId: undefined,
                          sampleCode: undefined,
                          error: false
                        });
                      } else {
                        setState({
                          ...state,
                          isOpenCheckInConfirmationDialog: false,
                          isOpenError: true
                        });
                        setCheckInState({
                          itemId: checkInState.itemId,
                          sampleCode: checkInState.sampleCode,
                          error: true
                        });
                        setErrorMsg(res.response?.data.message);
                      }
                    });
                  }
                }}
                className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white mr-5`}
              >
                <Typography>Yes</Typography>
              </Button>
              <Button
                onClick={() => setIsOpenCheckInConfirmationDialog(false)}
                className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black`}
              >
                <Typography>No</Typography>
              </Button>
            </div>
          </Modal>
        )}
        <Modal
          setIsOpen={val => setIsOpenSavedConfirmationDialog(val)}
          width={`w-[27rem]`}
          title={`Confirmation`}
          isOpen={state.isOpenSavedConfirmationDialog}
        >
          <Typography>{Messages.confirmationSavedData}</Typography>
          <div className={`pt-10`}>
            <Button
              onClick={() => {
                setIsOpenSavedConfirmationDialog(false);
                const data = new FormData();
                if (selectedFile) {
                  data.append('file', selectedFile, selectedFile.name);
                  dispatch(completeIdentityData(id, data)).then(res => {
                    if (res?.isSuccess == true) {
                      setIsOpenOTPSuccessDialog(true);
                      setState({
                        ...state,
                        isOpenSavedConfirmationDialog: false,
                        isOpenOTPSuccessDialog: false
                      });
                      dispatch(fetchHouseCallDetail(id));
                      router.push(
                        `/transaction-payment-code/${id}/house-call/detail`
                      );
                    } else {
                      setErrorMsg(res.response?.data.message);
                      setState({
                        ...state,
                        isOpenSavedConfirmationDialog: false,
                        isOpenError: true
                      });
                    }
                  });
                }
              }}
              className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white mr-5`}
            >
              <Typography>Yes</Typography>
            </Button>
            <Button
              onClick={() => setIsOpenSavedConfirmationDialog(false)}
              className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black`}
            >
              <Typography>No</Typography>
            </Button>
          </div>
        </Modal>
        {state.isOpenUpdatedConfirmationDialog && (
          <Modal
            setIsOpen={val => setIsOpenUpdatedConfirmationDialog(val)}
            width={`w-[28rem]`}
            title={`Confirmation`}
            isOpen={state.isOpenUpdatedConfirmationDialog}
          >
            <Typography className={`text-center`}>
              {statusCovid === undefined
                ? ParseMessage(
                    Messages.confirmationUpdateData,
                    `status menjadi collected`
                  )
                : ParseMessage(
                    Messages.confirmationUpdateData,
                    `status menjadi collected. Dengan hasil ${statusCovid}`
                  )}
            </Typography>
            <div className={`pt-10`}>
              <Button
                onClick={() => {
                  submitAll();
                }}
                className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white mr-5`}
                disabled={onCreate}
              >
                {onCreate ? (
                  <svg
                    class='inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-[#FFF] dark:fill-gray-300'
                    viewBox='0 0 100 101'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                      fill='currentColor'
                    />
                    <path
                      d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                      fill='currentFill'
                    />
                  </svg>
                ) : null}
                <Typography>Yes</Typography>
              </Button>
              <Button
                onClick={() => setIsOpenUpdatedConfirmationDialog(false)}
                className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black`}
              >
                <Typography>No</Typography>
              </Button>
            </div>
          </Modal>
        )}
        <Modal
          setIsOpen={val => setIsOpenSendResultConfirmationDialog(val)}
          width={`w-[27rem]`}
          title={`Confirmation`}
          isOpen={state.isOpenSendResultConfirmationDialog}
        >
          <Typography>
            {ParseMessage(
              Messages.transactionPaymentCodeConfirmation,
              `+62 8112334455`
            )}
          </Typography>
          <div className={`pt-12`}>
            <Button
              onClick={() => {
                setIsOpenSendResultSuccessDialog(true);
              }}
              className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white mr-5`}
            >
              <Typography>Yes</Typography>
            </Button>
            <Button
              onClick={() => setIsOpenSendResultConfirmationDialog(false)}
              className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black`}
            >
              <Typography>No</Typography>
            </Button>
          </div>
        </Modal>
        <Modal
          setIsOpen={val => setIsOpenSendResultSuccessDialog(val)}
          width={`w-[27rem]`}
          title={`Success`}
          headless
          isOpen={state.isOpenSendResultSuccessDialog}
        >
          <div>
            <Image
              src={assets.ImageCheckedGreen}
              alt={`Success dialog image`}
            />
          </div>
          <Typography className={`pt-8`}>
            {ParseMessage(
              Messages.transactionPaymentCodeSuccess,
              `+62 8112334455`
            )}
          </Typography>
          <div className={`pt-10`}>
            <Button
              onClick={() => {
                setIsOpenSendResultSuccessDialog(false);
              }}
              className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white`}
            >
              <Typography>OK</Typography>
            </Button>
          </div>
        </Modal>
        <Modal
          setIsOpen={val => setIsOpenDeleteDialog(val)}
          width={`w-[27rem]`}
          title={`Success`}
          headless
          isOpen={state.isOpenDeleteDialog}
        >
          <div>
            <Image src={assets.IconInfo} alt={`Success dialog image`} />
          </div>
          <Typography className={`pt-8`}>
            {Messages.confirmationDeleteData}
          </Typography>
          <div className={`pt-10`}>
            <Button
              onClick={() => {
                setIsOpenDeleteDialog(false);
              }}
              className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black mr-5`}
            >
              <Typography>No</Typography>
            </Button>
            <Button
              onClick={() => {
                setIsOpenDeleteDialog(false);
              }}
              className={`bg-inActive rounded-lg hover:bg-inActive text-white`}
            >
              <Typography>Yes</Typography>
            </Button>
          </div>
        </Modal>
        <Modal
          setIsOpen={val => setIsOpenUploadSupportingData(val)}
          width={`w-[50rem]`}
          title={`Confirmation`}
          isOpen={state.isOpenUploadSupportingData}
        >
          <form className={`flex flex-col w-full items-center`}>
            <div className={`flex flex-col w-full items-center justify-start`}>
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
                            onChange={e => onChangeBrowseFile(e, item.index)}
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
                            <Image src={assets.IconTrash} alt={`Delete icon`} />
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
                className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white mr-5`}
                onClick={() => {
                  uploadSupportinData();
                }}
              >
                <Typography>Upload</Typography>
              </Button>
              <Button
                onClick={() => setIsOpenUploadSupportingData(false)}
                className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black`}
              >
                <Typography>No</Typography>
              </Button>
            </div>
          </form>
        </Modal>
        <Modal
          setIsOpen={val => setIsOpenUpCollectingAll(val)}
          width={`w-[50rem]`}
          title={`Confirmation`}
          isOpen={state.isOpenUpCollectingAll}
        >
          <form className={`flex flex-col w-full items-center`}>
            <div className={`flex flex-col w-full`}>
              <div className={`py-4 w-full justify-center align-center flex`}>
                Apakah anda yakin akan merubah data ini menjadi Collected All?
              </div>
            </div>
            <div className={`pt-6 items-center flex justify-start`}>
              <Button
                className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white mr-5`}
                onClick={() => collectAll(id)}
              >
                <Typography>Yes</Typography>
              </Button>
              <Button
                onClick={() => setIsOpenUpCollectingAll(false)}
                className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black`}
              >
                <Typography>No</Typography>
              </Button>
            </div>
          </form>
        </Modal>
        {/** Modal Input Sample Code */}
        <Modal
          setIsOpen={val => setIsOpenUpResultConfirmation(val)}
          width={`w-[50rem]`}
          title={`Confirmation`}
          isOpen={state.isOpenResultConfirmation}
        >
          <div className={`flex flex-col w-full`}>
            <div className={`py-4 w-full justify-center align-center flex`}>
              Silahkan pilih result Positif/Negatif
            </div>
          </div>
          <div className={`pt-6 items-center flex justify-center`}>
            <Button
              className={`bg-[#1BC5BD] rounded-lg hover:bg-[#1BC5BD] text-white mr-5`}
              onClick={() => {
                setStatusCovid('Positive');
                setState({
                  ...state,
                  isOpenResultConfirmation: false,
                  isOpenUpdatedConfirmationDialog: true
                });
              }}
            >
              <Typography>Positif</Typography>
            </Button>
            <Button
              onClick={() => {
                setStatusCovid('Negative');
                setState({
                  ...state,
                  isOpenResultConfirmation: false,
                  isOpenUpdatedConfirmationDialog: true
                });
              }}
              className={`bg-[#8950FC] rounded-lg hover:bg-[#8950FC] text-white`}
            >
              <Typography>Negatif</Typography>
            </Button>
          </div>
        </Modal>
        <Modal
          setIsOpen={val => setIsOpenOTPSuccessDialog(val)}
          width={`w-[27rem]`}
          title={`Success`}
          headless
          isOpen={state.isOpenOTPSuccessDialog}
        >
          <div>
            <Image
              src={assets.ImageCheckedGreen}
              alt={`Success dialog image`}
            />
          </div>
          <Typography className={`pt-8 font-normal text-sm`}>
            Data Berhasil Disimpan
          </Typography>
          <div className={`pt-10`}>
            <Button
              onClick={() => {
                setState({
                  ...state,
                  isOpenUpdatedConfirmationDialog: false,
                  isOpenOTPSuccessDialog: false
                });
                dispatch(fetchHouseCallDetail(id));
              }}
              className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white`}
            >
              <Typography>OK</Typography>
            </Button>
          </div>
        </Modal>
        <Modal
          setIsOpen={val => setIsOpenError(val)}
          width={`w-[27rem]`}
          title={``}
          headless
          isOpen={state.isOpenError}
        >
          <div>
            <Image src={assets.IconError} alt={`Success dialog image`} />
          </div>
          <Typography className={`pt-8 font-normal text-sm`}>
            {errorMsg}
          </Typography>
          <div className={`pt-10`}>
            <Button
              onClick={() => {
                if (slug === 'edit') {
                  setState({
                    ...state,
                    isOpenCheckInConfirmationDialog: false,
                    isOpenError: false,
                    isOpenSampleCodeDialog: false
                  });
                } else {
                  if (statusCovid !== undefined) {
                    setState({
                      ...state,
                      isOpenCheckInConfirmationDialog: false,
                      isOpenError: false,
                      isOpenSampleCodeDialog: true
                    });
                  } else {
                    setState({
                      ...state,
                      isOpenCheckInConfirmationDialog: false,
                      isOpenError: false,
                      isOpenSampleCodeDialog: false
                    });
                  }
                }
              }}
              className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white`}
            >
              <Typography>OK</Typography>
            </Button>
          </div>
        </Modal>
      </MainLayout>
    </>
  );
};

export default HouseCallSlug;
