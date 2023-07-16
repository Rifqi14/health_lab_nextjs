import React, { useEffect, useState } from 'react';
import { MainLayout, Table } from 'components/organisms';
import Head from 'next/head';
import Image from 'next/image';
import {
  Card,
  Typography,
  Button,
  Label,
  Input,
  Modal,
  Textarea,
  InputFile
} from 'components/atoms';
import InputText from 'components/atoms/Input/InputText';
import { EmptyTable } from 'components/molecules';
import assets from 'public/index';
import { useRouter } from 'next/router';
import axios from 'axios';
import { getItemLocalStorage } from 'components/utils/localstorage';
import { useRef } from 'react';
import Messages from 'components/constants/PopUpMessage';
import ModalConfirmation from 'components/Modals/ModalConfirmation';
import ModalSuccess from 'components/Modals/ModalsSendLink';
import { useDispatch } from 'react-redux';
import {
  createCooperationTerms,
  uploadDocument
} from 'components/store/actions/cooperationTerm';
import { Field, Form, Formik, useField } from 'formik';
import * as yup from 'yup';

const Create = props => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [btnUploadDisabled, setBtnUploadDisabled] = useState(false);
  const [onSubmitData, setOnSubmitData] = useState(false);
  const [state, setState] = useState({
    headline: 'Master Ketentuan Kerjasama',
    breadcrumbs: [
      {
        link: '/master-ketentuan-kerjasama',
        name: 'Master Ketentuan Kerjasama'
      },
      { link: `/master-ketentuan-kerjasama/create`, name: 'Create' }
    ],
    fileUploaded: null,
    cooperationCode: '',
    cooperationName: '',
    cooperationDesc: '',
    uploadData: [],
    isOpenSupportingData: false,
    isOpenSavedConfirmationDialog: false,
    isOpenUploadSupportingData: false
  });

  const validationSchema = yup.object().shape({
    cooperationCode: yup.string().required('This field is required'),
    cooperationName: yup.string().required('This field is required'),
    cooperationDesc: yup.string().required('This field is required')
  });

  const onSubmit = () => {
    setShow(true);
  };

  // const [field, meta] = useField(props);

  const addFile = () => {
    setState({
      ...state,
      uploadData: [
        ...state.uploadData,
        {
          index: state.uploadData.length + 1,
          file: '',
          notes: ''
        }
      ]
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

  const setIsOpenUploadSupportingData = value => {
    setState({ ...state, isOpenUploadSupportingData: value });
  };

  const headColumns = [
    {
      key: 'no',
      name: 'No',
      className: 'w-3 px-4 text-center',
      icon: false
    },
    {
      key: 'file',
      name: 'File',
      className: 'text-left',
      icon: false
    },
    {
      key: 'note',
      name: 'Note',
      className: 'text-left pl-6',
      icon: false
    },
    {
      key: 'deletbtn',
      name: '',
      className: 'w-12 px-2',
      icon: false
    }
  ];

  const handleCooperationCode = val => {
    setState({
      ...state,
      cooperationCode: val
    });
  };

  const handleCooperationName = val => {
    setState({
      ...state,
      cooperationName: val
    });
  };

  const handleCooperationDesc = val => {
    setState({
      ...state,
      cooperationDesc: val
    });
  };

  const onChangeNote = (e, index) => {
    const upload = state.uploadData.map((item, i) => {
      if (item.index === index) {
        item.notes = e.target.value;
      }

      return item;
    });
    setState({
      ...state,
      uploadData: upload
    });
  };

  const buttonDisabled = () => {
    if (state.cooperationCode && state.cooperationName.length > 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  const onSave = () => {
    const dataPost = {
      code: state.cooperationCode,
      name: state.cooperationName,
      description: state.cooperationDesc
    };

    setOnSubmitData(true);
    dispatch(createCooperationTerms(dataPost)).then(res => {
      if (res?.statusCode === 200) {
        setSuccess(true);
        setShow(false);
        let uploadDocumentStatus = true;
        state.uploadData.forEach((item, index) => {
          const newFormData = new FormData();
          newFormData.append('CooperationTermCode', state.cooperationCode);
          newFormData.append('File', item.file);
          newFormData.append('Type', item.file.type);
          newFormData.append('Notes', item.notes);

          dispatch(uploadDocument(newFormData)).then(res => {
            if (res.statusCode !== 200) {
              uploadDocumentStatus = false;
            }
          });
        });
      } else {
        setShow(false);
        setError(true);
      }
      setOnSubmitData(false);
    });
  };

  const handleNoUploadData = () => {
    setIsOpenUploadSupportingData(false);
    state.uploadData.splice(0, state.uploadData.length);
  };

  useEffect(() => {
    buttonDisabled();
    // uploadDisabled();
    state.uploadData.map((item, key) => {
      if (item.file === '' || item.notes === '' || !state.uploadData[0]) {
        setBtnUploadDisabled(true);
      } else {
        setBtnUploadDisabled(false);
      }
    });
  }, [state, state.uploadData]);

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

      <MainLayout
        headline={state.headline}
        breadcrumb={[
          {
            link: '/master-ketentuan-kerjasama',
            name: 'Master Ketentuan Kerjasama'
          },
          { link: `/master-ketentuan-kerjasama/create`, name: 'Create' }
        ]}
        className={`overflow-x-hidden`}
      >
        <main>
          <Card>
            <Formik
              initialValues={state}
              validationSchema={validationSchema}
              onSubmit={() => onSubmit()}
            >
              {formik => {
                return (
                  <Form>
                    <div className={`grid mb-3 grid-cols-1 lg:grid-cols-3`}>
                      <div>
                        <Label>Kode Ketentuan</Label>
                        <Field
                          component={Input}
                          name='cooperationCode'
                          label='Kode Ketentuan'
                          type={`text`}
                          onChange={e =>
                            setState({
                              ...state,
                              cooperationCode: e.target.value
                            })
                          }
                        />
                      </div>
                      <div className={`hidden lg:block`}></div>
                      <div className={`hidden lg:block`}></div>
                      <div className='mt-4'>
                        <Label>Nama Ketentuan Kerjasama</Label>
                        <Field
                          component={Input}
                          label='Nama Ketentuan Kerjasama'
                          name='cooperationName'
                          type='text'
                          onChange={e =>
                            setState({
                              ...state,
                              cooperationName: e.target.value
                            })
                          }
                        />
                      </div>
                      <div className={`hidden lg:block`}></div>
                      <div className={`hidden lg:block`}></div>
                      <div className='mt-4'>
                        <label htmlFor=''>Deskripsi</label>
                        <textarea
                          as='textarea'
                          required
                          name='cooperationDesc'
                          className='focus:outline-none border resize-none border-[#C9CFD6] rounded p-2 bg-white w-full h-[100px]'
                          onChange={e =>
                            setState({
                              ...state,
                              cooperationDesc: e.target.value
                            })
                          }
                        />
                      </div>
                      <div className={`hidden lg:block`}></div>
                      <div className={`hidden lg:block`}></div>
                    </div>
                    <div className={`grid mb-2 grid-cols-1 lg:grid-cols-2`}>
                      <div>
                        <Typography className='text-base'>
                          Supporting Data
                        </Typography>
                        <Table headColumns={headColumns}>
                          {state.uploadData.length > 0 &&
                          state.uploadData[0]?.file !== '' ? (
                            state.uploadData.map((data, key) => {
                              return (
                                <>
                                  <tr
                                    key={key}
                                    className={`text-center ${
                                      key % 2 != 0
                                        ? 'bg-[#FCFCFC]'
                                        : 'bg-[#FFFFFF]'
                                    }`}
                                  >
                                    <td className={`py-[24px] text-center`}>
                                      <Typography>{key + 1}</Typography>
                                    </td>
                                    <td
                                      className={`py-[24px] text-start pl-2 w-52`}
                                    >
                                      <Typography>{data.file.name}</Typography>
                                    </td>
                                    <td className={`py-[24px] text-start pl-6`}>
                                      <Typography>{data.notes}</Typography>
                                    </td>
                                    <td className={'px-2'}>
                                      <Button
                                        className={`bg-[#F64E60] flex items-center p-2`}
                                        onClick={() => deleteFile(data.index)}
                                        emptyPadding
                                      >
                                        <Image
                                          src={assets.IconTrash}
                                          alt={`Delete icon`}
                                        />
                                      </Button>
                                    </td>
                                  </tr>
                                </>
                              );
                            })
                          ) : (
                            <EmptyTable
                              colSpan={3}
                              title={`Supporting data empty`}
                            />
                          )}
                          <tr>
                            <td colSpan='3'>
                              <div className='p-[15px]'>
                                <Button
                                  paddingVertical={`py-1`}
                                  paddingHorizontal={`px-6`}
                                  background={`bg-pattensBlue hover:bg-btnBlue`}
                                  className={
                                    'flex items-center text-btnBlue hover:text-white justify-center'
                                  }
                                  onClick={() =>
                                    setIsOpenUploadSupportingData(true)
                                  }
                                >
                                  <Typography
                                    className={`font-normal text-sm flex items-center justify-center`}
                                  >
                                    <span className='font-bold text-2xl pb-1.5 pr-2'>
                                      +
                                    </span>{' '}
                                    Create
                                  </Typography>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        </Table>
                      </div>
                      <div className={`hidden lg:block`}></div>
                    </div>
                    <div className='flex justify-center items-center mt-[50px]'>
                      <Button
                        paddingVertical={`py-2`}
                        paddingHorizontal={`px-7`}
                        background={`bg-btnBlue disabled:bg-btn-cancel disabled:text-black`}
                        disabled={!disabled}
                        onClick={() => setShow(true)}
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
                        className={`ml-4`}
                        onClick={() => {
                          router.push('/master-ketentuan-kerjasama');
                        }}
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
        </main>
        <Modal
          setIsOpen={val => setIsOpenUploadSupportingData(val)}
          width={`w-[50rem]`}
          title={`Supporting Data`}
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
                          className={'resize-none'}
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
                className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white mr-5 disabled:bg-btn-cancel disabled:text-black`}
                disabled={btnUploadDisabled}
                onClick={() => setIsOpenUploadSupportingData(false)}
              >
                <Typography>Upload</Typography>
              </Button>
              <Button
                onClick={() => handleNoUploadData()}
                className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black`}
              >
                <Typography>No</Typography>
              </Button>
            </div>
          </form>
        </Modal>
        {/* <Modal
          setIsOpen={(val) => setShow(val)}
          width={`w-[27rem]`}
          title={`Confirmation`}
          hadless
          isOpen={show}
        >
          <Typography>Apakah anda yakin akan menyimpan data ini?</Typography>
          <div className={`pt-12`}>
            <Button
              onClick={() => onSave()}
              className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white mr-5`}
              disabled={onSubmitData === true ? true : false}
            >
              <span
                className={`font-normal text-sm flex justify-center items-center`}
              >
                {onSubmitData ? (
                  <svg
                    class="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-[#FFF] dark:fill-gray-300"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                ) : null}
                <p>Yes</p>
              </span>
            </Button>
            <Button
              onClick={() => setShow(false)}
              className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black`}
            >
              <Typography>No</Typography>
            </Button>
          </div>
        </Modal> */}
        <ModalConfirmation
          show={show}
          confirmation={`Confirmation`}
          onHide={() => {
            setShow(false);
          }}
          handleYes={() => onSave()}
          desc1='Apakah anda yakin akan menyimpan data ini?'
          isLoading={onSubmitData}
        />
        <Modal
          setIsOpen={val => setError(val)}
          width={`w-[27rem]`}
          headless
          isOpen={error}
        >
          <div>
            <Image src={assets.IconError} alt={`Error Dialog image`} />
          </div>
          <div className='pt-8 text-center'>
            <Typography>Simpan data gagal. </Typography>
            <br />
            <Typography>
              Data tidak berhasil disimpan, silahkan coba lagi
            </Typography>
          </div>
          <div className='flex justify-center pt-8'>
            <Button
              onClick={() =>
                router.push('/master-ketentuan-kerjasama/create') &&
                setError(false)
              }
              color={`white`}
              background={`bg-inActive`}
            >
              <Typography className={`text-white font-normal text-sm`}>
                OK
              </Typography>
            </Button>
          </div>
        </Modal>
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
              onClick={() => router.push('/master-ketentuan-kerjasama')}
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

export default Create;
