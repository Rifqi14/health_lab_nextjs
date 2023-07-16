import assets from 'public/index';
import {
  Button,
  Card,
  DateInput,
  Input,
  InputFile,
  InputCurrency,
  Label,
  LengthChange,
  Modal,
  Select,
  Textarea,
  TimePicker,
  Typography
} from 'components/atoms';
import { Transition } from '@headlessui/react';
import { EmptyTable, Pagination } from 'components/molecules';
import { Field, FieldArray, Form, Formik } from 'formik';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Table from '../Tables/Table';
import * as Yup from 'yup';
import { useRouter } from 'next/router';

const HouseCall = props => {
  const router = useRouter();
  const {
    setIsOpenConfirmationDialog,
    isHouseCallFormOpen,
    houseCallFormRef,
    uploadDocumentFormRef,
    qty
  } = props;
  const selector = useSelector(state => state);
  const { corporate } = selector;
  const [state, setState] = useState({
    formInitialValue: {
      transactionItems: {
        transactionId: 0,
        qty: qty,
        items: []
      },
      picName: '',
      address: '',
      additionalCost: 0,
      description: '',
      schedule: {
        pic: '',
        bookingDate: '',
        timeStart: 0,
        timeEnd: 0
      },
      startBooking: new Date(),
      endBooking: new Date(),
      supportingData: [
        {
          TransactionId: '',
          File: '',
          Type: '',
          Notes: ''
        }
      ]
    },
    uploadData: {
      supportingData: [
        {
          TransactionId: '',
          File: '',
          Type: '',
          Notes: ''
        }
      ]
    },
    isOpenUploadSupportingData: false
  });

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
    }
  ];
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

  const setIsOpenUploadSupportingData = value => {
    setState({ ...state, isOpenUploadSupportingData: value });
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
    const upload = state.uploadData.supportingData.filter((item, i) => {
      return i !== index;
    });
    setState({
      ...state,
      uploadData: {
        ...state.uploadData,
        supportingData: upload
      }
    });
  };

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

  const headColumnsSupportingData = [
    { key: 'no', name: 'No', className: 'w-[8rem]' },
    { key: 'file', name: 'File', className: 'text-left' },
    { key: 'note', name: 'Note', className: 'text-left' },
    { key: 'action', name: 'Action', className: 'text-left' }
  ];

  const itemsValidationSchema = Yup.object().shape({
    transactionItems: Yup.object().shape({
      items: Yup.array().of(
        Yup.object().shape({
          identityName: Yup.string().required('Please fill out this field')
        })
      )
    })
  });

  const validationSchema = Yup.object().shape({
    supportingData: Yup.array().of(
      Yup.object().shape({
        File: Yup.string().required('Please fill out this field'),
        Notes: Yup.string().required('Please fill out this field')
      })
    )
  });

  const onSubmitUpload = values => {
    setState({
      ...state,
      uploadData: values,
      isOpenUploadSupportingData: false
    });
  };

  useEffect(() => {
    let items = [];
    for (let index = 0; index < qty; index++) {
      items.push({
        identityNumber: '',
        identityName: ''
      });
    }
    if (items.length > 0) {
      setState({
        ...state,
        formInitialValue: {
          ...state.formInitialValue,
          transactionItems: {
            ...state.transactionItems,
            items: items
          }
        }
      });
    } else {
      const date = new Date();
      setState({
        ...state,
        formInitialValue: {
          ...state.formInitialValue,
          transactionItems: {
            ...state.transactionItems,
            items: items
          },
          schedule: {
            ...state.schedule,
            timeStart: date.getHours() * 100 + date.getMinutes(),
            timeEnd: date.getHours() * 100 + date.getMinutes()
          }
        }
      });
    }
  }, [qty]);

  return (
    <Transition appear show={isHouseCallFormOpen}>
      <Formik
        initialValues={state.formInitialValue}
        onSubmit={values => {
          houseCallFormRef.current.values.uploadData = state.uploadData;
          setIsOpenConfirmationDialog(true);
        }}
        innerRef={houseCallFormRef}
        enableReinitialize
        // validationSchema={itemsValidationSchema}
      >
        {({ values, errors, touched }) => (
          <Form>
            <Card
              rounded={`rounded-lg`}
              shadow={`shadow-lg`}
              padding={`p-7`}
              className={`mb-5`}
            >
              {/* <FieldArray name='transactionItems'>
                {arrayHelpers => (
                  <div
                    className={`w-full h-full overflow-x-auto space-y-[16px] flex flex-col rounded border border-[#E6E6E6]`}
                  >
                    <Table headColumns={headColumns}>
                      {values.transactionItems.items.length > 0 ? (
                        values.transactionItems.items.map((item, key) => {
                          return (
                            <tr
                              key={key}
                              className={`text-center odd:bg-[#FCFCFC] even:bg-white`}
                            >
                              <td className={`py-6 px-6`}>
                                <Typography>{key + 1}</Typography>
                              </td>
                              <td className={`text-left`}>
                                <Typography>-</Typography>
                              </td>
                              <td className={`pr-7`}>
                                <Field
                                  component={Input}
                                  name={`transactionItems.items[${key}].identityName`}
                                  placeholder='Nama pasien'
                                />
                                {errors &&
                                  errors.transactionItems &&
                                  errors.transactionItems.items &&
                                  errors.transactionItems.items[key] &&
                                  errors.transactionItems.items[key]
                                    .identityName && (
                                    <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                      {
                                        errors.transactionItems.items[key]
                                          .identityName
                                      }
                                    </p>
                                  )}
                              </td>
                              <td className={`pr-7`}>
                                <Field
                                  component={Input}
                                  name={`transactionItems.items[${key}].identityNumber`}
                                  placeholder='NIK'
                                  type='text'
                                />
                                {errors &&
                                  errors.transactionItems &&
                                  errors.transactionItems.items &&
                                  errors.transactionItems.items[key] &&
                                  errors.transactionItems.items[key]
                                    .identityNumber && (
                                    <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                      {
                                        errors.transactionItems.items[key]
                                          .identityNumber
                                      }
                                    </p>
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
                  </div>
                )}
              </FieldArray> */}
              <div
                className={`grid gap-x-16 gap-y-5 mb-6 grid-cols-2 lg:grid-cols-3 pt-6`}
              >
                <Typography className={`font-medium text-lg`}>
                  Data Information
                </Typography>
              </div>
              <div
                className={`grid gap-x-16 gap-y-5 mb-6 grid-cols-2 lg:grid-cols-3`}
              >
                <div>
                  <Label htmlFor={'pic'}>PIC</Label>
                  <Field
                    component={Input}
                    className={`bg-[#E6E6E6] border-[#C9CFD6] text-[#575962]`}
                    type={`text`}
                    id={`picName`}
                    placeholder={`PIC`}
                    value={
                      corporate?.detail?.corporateType === 'Individual'
                        ? corporate?.detail?.name
                        : corporate?.detail?.pics[0]?.name
                    }
                    name={`picName`}
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor={'cost'}>Cost Tambahan</Label>
                  <Field
                    component={InputCurrency}
                    id={`additionalCost`}
                    placeholder={`Cost Tambahan`}
                    name={`additionalCost`}
                  />
                </div>
              </div>
              <div
                className={`grid gap-x-16 gap-y-5 mb-6 grid-cols-2 lg:grid-cols-3`}
              >
                <div>
                  <Label htmlFor={'address'}>Alamat</Label>
                  <Field
                    component={Input}
                    className={`bg-[#E6E6E6] border-[#C9CFD6] text-[#575962]`}
                    type={`text`}
                    id={`address`}
                    placeholder={`Alamat`}
                    name={`address`}
                    value={
                      corporate.detail?.address ? corporate.detail?.address : ''
                    }
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor={'description'}>Description</Label>
                  <Field component={Textarea} rows={3} name='description' />
                </div>
              </div>
              {/* Action Schedule */}
              <div
                className={`grid gap-x-16 gap-y-5 grid-cols-1 mb-6 lg:grid-cols-3`}
              >
                <div>
                  <Typography className={`font-medium text-lg`}>
                    Action Schedule
                  </Typography>
                </div>
                <div className={`hidden lg:block`}></div>
                <div className={`hidden lg:block`}></div>
                <div>
                  <Label htmlFor={'medical_worker'}>Tenaga Kesehatan</Label>
                  <Field
                    component={Input}
                    type={`text`}
                    id={`schedule.pic`}
                    placeholder={`Tenaga Kesehatan`}
                    name={`schedule.pic`}
                  />
                </div>
                <div className={`hidden lg:block`}></div>
                <div className={`hidden lg:block`}></div>
                <div>
                  <Label htmlFor={'booking_date'}>Booking Date</Label>
                  <Field
                    component={DateInput}
                    name={`schedule.bookingDate`}
                    icon={assets.IconCalendar}
                  />
                </div>
                <div>
                  <Label htmlFor={'booking_time'}>Booking Time</Label>
                  <div
                    className={`flex items-center border rounded-lg border-[#C9CFD6]`}
                  >
                    <div className={`w-14`}>
                      <Field
                        component={TimePicker}
                        name={`schedule.timeStart`}
                      />
                    </div>
                    <span className={`px-1`}>-</span>
                    <div className={`w-14`}>
                      <Field
                        component={TimePicker}
                        name={`schedule.timeEnd`}
                        minTime={values.schedule.timeStart}
                      />
                    </div>
                  </div>
                </div>

                <div className={`hidden lg:block`}></div>
              </div>
              {/* Supporting data */}
              <div className={`pb-4`}>
                <Typography className={`font-medium text-lg`}>
                  Supporting Data
                </Typography>
              </div>
              <div
                className={`w-2/3 h-full mb-6 overflow-x-auto space-y-[16px] flex flex-col rounded border border-[#E6E6E6]`}
              >
                <Table headColumns={headColumnsSupportingData}>
                  {state.uploadData?.supportingData?.length > 0 &&
                    state.uploadData?.supportingData[0].File &&
                    state.uploadData?.supportingData.map((item, key) => {
                      return (
                        <tr
                          key={key}
                          className={`text-center odd:bg-[#FCFCFC] even:bg-white`}
                        >
                          <td className={`py-6`}>
                            <Typography>{key + 1}</Typography>
                          </td>
                          <td className={`text-left`}>
                            <Typography>{item.File?.name}</Typography>
                          </td>
                          <td className={`text-left`}>
                            <Typography>{item.Notes}</Typography>
                          </td>
                          <td>
                            <Button
                              className={`bg-[#F64E60] flex items-center p-2`}
                              onClick={() => deleteFile(key)}
                              emptyPadding
                            >
                              <Image
                                src={assets.IconTrash}
                                alt={`Delete icon`}
                              />
                            </Button>
                          </td>
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
                          onClick={() => setIsOpenUploadSupportingData(true)}
                        >
                          <Image
                            src={assets.IconPlusBlue}
                            alt={`Create button`}
                          />
                          <Typography className={`pl-1 font-normal text-sm`}>
                            Add File
                          </Typography>
                        </Button>
                      </div>
                    </td>
                  </tr>
                </Table>
              </div>
              <div
                className={`grid gap-x-16 gap-y-5 mb-7 grid-cols-1 align-middle place-content-stretch lg:grid-cols-3`}
              >
                <div className={`hidden lg:block`}></div>
                <div className={`place-self-end`}>
                  <Button
                    className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white mr-6`}
                    type='submit'
                  >
                    <Typography className={`font-normal text-sm`}>
                      Save
                    </Typography>
                  </Button>
                  <Button
                    className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black`}
                    onClick={() => router.back()}
                  >
                    <Typography>Cancel</Typography>
                  </Button>
                </div>
              </div>
            </Card>
          </Form>
        )}
      </Formik>
      <Modal
        setIsOpen={val => setIsOpenUploadSupportingData(val)}
        width={`w-[50rem]`}
        title={`Supporting Data`}
        isOpen={state.isOpenUploadSupportingData}
      >
        <Formik
          initialValues={state.uploadData}
          onSubmit={values => {
            onSubmitUpload(values);
          }}
          innerRef={uploadDocumentFormRef}
          validationSchema={validationSchema}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form className={`flex flex-col w-full items-center`}>
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
                <FieldArray name='supportingData'>
                  {arrayHelpers => (
                    <div
                      className={`flex flex-col w-full items-center justify-start`}
                    >
                      {values.supportingData?.length > 0 &&
                        values.supportingData?.map((item, key) => {
                          return (
                            <div
                              className={`flex flex-row w-full items-center pb-3`}
                              key={key}
                            >
                              <div className={`w-6/12 mr-2`}>
                                <div className={`border p-3 rounded-md`}>
                                  <Field
                                    component={InputFile}
                                    name={`supportingData[${key}].File`}
                                    onChange={val => {
                                      setFieldValue(
                                        `supportingData[${key}].Type`,
                                        val.target?.files[0]
                                          ? val.target?.files[0]?.Type
                                          : null
                                      );
                                    }}
                                    isWhite
                                  />
                                </div>
                                {errors &&
                                  errors.supportingData &&
                                  errors.supportingData[key] &&
                                  errors.supportingData[key].File &&
                                  touched &&
                                  touched.supportingData &&
                                  touched.supportingData[key] &&
                                  touched.supportingData[key].File && (
                                    <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                      {errors.supportingData[key].File}
                                    </p>
                                  )}
                              </div>
                              <div className={`w-5/12 mx-2`}>
                                <Field
                                  component={Textarea}
                                  cols={4}
                                  name={`supportingData[${key}].Notes`}
                                />
                                {errors &&
                                  errors.supportingData &&
                                  errors.supportingData[key] &&
                                  errors.supportingData[key].Notes &&
                                  touched &&
                                  touched.supportingData &&
                                  touched.supportingData[key] &&
                                  touched.supportingData[key].Notes && (
                                    <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                      {errors.supportingData[key].Notes}
                                    </p>
                                  )}
                              </div>
                              <div className={`w-1/12 ml-2 justify-self-end`}>
                                {key > 0 && (
                                  <Button
                                    className={`bg-[#F64E60] flex items-center p-2`}
                                    onClick={() => arrayHelpers.remove(key)}
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
                          onClick={() =>
                            arrayHelpers.push({
                              transactionId: '',
                              file: '',
                              type: '',
                              notes: ''
                            })
                          }
                        >
                          <Image
                            src={assets.IconPlusBlue}
                            alt={`Create button`}
                          />
                          <Typography className={`pl-1 font-normal text-sm`}>
                            Add File
                          </Typography>
                        </Button>
                      </div>
                    </div>
                  )}
                </FieldArray>
              </div>
              <div className={`pt-6`}>
                <Button
                  className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white mr-5`}
                  type='submit'
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
            </Form>
          )}
        </Formik>
      </Modal>
    </Transition>
  );
};

export default HouseCall;
