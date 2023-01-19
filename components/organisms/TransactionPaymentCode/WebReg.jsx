import assets from '@/public/index';
import {
  Button,
  Card,
  DateInput,
  Input,
  InputFile,
  Label,
  Modal,
  Textarea,
  Typography
} from '@atoms';
import { Transition } from '@headlessui/react';
import { EmptyTable } from '@molecules';
import { Field, FieldArray, Form, Formik } from 'formik';
import Image from 'next/image';
import React, { useState } from 'react';
import Table from '../Tables/Table';
import * as Yup from 'yup';
import { useRouter } from 'next/router';

const WebReg = props => {
  const router = useRouter()
  const {
    setIsOpenConfirmationDialog,
    isWebRegFormOpen,
    onSubmitWebReg,
    uploadDocumentFormRef,
    webRegFormRef,
    setUploadData
  } = props;
  const [state, setState] = useState({
    formInitialValue: {
      transactionDate: new Date(),
      description: '',
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
    transactionDate: '',
    description: '',
    isOpenUploadSupportingData: false
  });

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
    const upload = state.uploadData.filter((item, i) => {
      return item.index !== index;
    });
    setState({
      ...state,
      uploadData: upload
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

  const headColumns = [
    { key: 'no', name: 'No', className: 'w-[8rem]' },
    { key: 'file', name: 'File', className: 'text-left' },
    { key: 'note', name: 'Note', className: 'text-left' }
  ];

  const dummyData = [
    { no: 1, payment_code: '-' },
    { no: 2, payment_code: '-' },
    { no: 3, payment_code: '-' },
    { no: 4, payment_code: '-' },
    { no: 5, payment_code: '-' }
  ];

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

  return (
    <Transition appear show={isWebRegFormOpen}>
      <Formik
        initialValues={state.formInitialValue}
        onSubmit={values => {
          const uploadData = state.uploadData.supportingData;
          setState({
            ...state,
            formInitialValue: {
              transactionDate: values.transactionDate,
              description: values.description,
              supportingData: uploadData
            }
          });
          setIsOpenConfirmationDialog(true);
        }}
        innerRef={webRegFormRef}
        enableReinitialize
      >
        {({ values, errors }) => (
          <Form>
            <Card>
              <div>
                <Typography className={`font-medium text-lg`}>
                  Data Information
                </Typography>
              </div>
              <div className={`grid gap-16 mb-6 md:grid-cols-2 pt-4`}>
                <div>
                  <Label htmlFor={'transactionDate'}>Transaction Date</Label>
                  <Field
                    component={DateInput}
                    name={`transactionDate`}
                    icon={assets.IconCalendar}
                  />
                </div>
              </div>
              <div className={`grid gap-16 mb-6 md:grid-cols-2`}>
                <div>
                  <Label htmlFor={'description'}>Description</Label>
                  <Field component={Textarea} cols={4} name={`description`} />
                </div>
              </div>
              <div className={`pb-4`}>
                <Typography className={`font-medium text-lg`}>
                  Supporting Data
                </Typography>
              </div>
              <div
                className={`w-2/3 h-full mb-6 overflow-x-auto space-y-[16px] flex flex-col rounded border border-[#E6E6E6]`}
              >
                <Table headColumns={headColumns}>
                  {state.uploadData?.supportingData?.length > 0 &&
                    state.uploadData.supportingData[0].File &&
                    state.uploadData.supportingData.map((item, key) => {
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
              <div className={`grid gap-16 md:grid-cols-3`}>
                <div></div>
                <div>
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
            <Form className='flex flex-col w-full items-center justify-start'>
              <div
                className={`flex flex-col w-full items-center justify-start`}
              >
                <div className={`flex flex-row w-full pb-2`}>
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

export default WebReg;
