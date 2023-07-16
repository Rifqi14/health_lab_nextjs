import assets from 'public/index';
import {
  Button,
  Card,
  Input,
  Label,
  Modal,
  Radio,
  Select,
  Typography,
  InputFile,
  Textarea
} from 'components/atoms';
import Messages from 'components/constants/PopUpMessage';
import { MainLayout } from 'components/organisms';
import { Field, Form, Formik } from 'formik';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteLabPartner,
  fetchLabSelectList,
  updateLabPartner,
  uploadLogo
} from 'components/store/actions/labPartner';
import { fetchCooperationTermSelectList } from 'components/store/actions/cooperationTerm';
import ModalConfirmation from 'components/Modals/ModalConfirmation';

const RegistrasiLabPartnerSlug = props => {
  const router = useRouter();
  const dispatch = useDispatch();
  const ref = useRef();
  const selector = useSelector(state => state);
  const { labpartner, cooperationterm } = selector;
  const { slug, code } = router.query;
  const [showSuccessDeleteModal, setShowSuccessDeleteModal] = useState(false);
  const [onSubmitData, setOnSubmitData] = useState(false);
  const [onDeleteData, setOnDeleteData] = useState(false);
  const [status, setStatus] = useState('');
  const [state, setState] = useState({
    headline: 'Registrasi Lab Partner',
    breadcrumbs: [
      {
        link: '/registrasi-lab-partner',
        name: 'List Registrasi Lab Partner'
      },
      {
        link: `/registrasi-lab-partner/${code}/${slug}`,
        name: 'Edit'
      }
    ],
    formInitialValue: labpartner.editInitialValue,
    formEdit: {},
    isOpenSavedConfirmationDialog: false,
    isOpenDeleteDialog: false,
    isReadonly: false
  });
  const [selectedFile, setSelectedFile] = useState();

  const [preview, setPreview] = useState(labpartner.labPartnerDetail.logoUrl);
  const [selectedFileName, setFilename] = useState(
    labpartner.labPartnerDetail.logoFilename
  );
  const [errorMsg, setErrorMsg] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onSelectFile = e => {
    const MAX_FILE_SIZE = 5000;

    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
    } else {
      const fileSizeKiloBytes = e.target.files[0].size / 1000;

      if (
        e.target.files[0].type === 'image/jpeg' ||
        e.target.files[0].type === 'image/jpg' ||
        e.target.files[0].type === 'image/png'
      ) {
        if (fileSizeKiloBytes < MAX_FILE_SIZE) {
          const objectUrl = createObjectURL(e.target.files[0]);
          setSelectedFile(e.target.files[0]);
          setFilename(e.target.files[0].name);
          setPreview(objectUrl);
          setIsSuccess(true);
        } else {
          setErrorMsg('File size is greater than maximum limit');
          setIsSuccess(false);
          setPreview(undefined);
          setSelectedFile(undefined);
        }
      } else {
        setErrorMsg('File type must png/jpg/jpeg');
        setIsSuccess(false);
        setPreview(undefined);
        setSelectedFile(undefined);
      }
    }
  };

  const removeBrand = e => {
    setIsSuccess(false);
    setSelectedFile(undefined);
    setFilename(undefined);
    setPreview(undefined);
  };

  const createObjectURL = object => {
    return window.URL
      ? window.URL.createObjectURL(object)
      : window.webkitURL.createObjectURL(object);
  };

  const setIsOpenSavedConfirmationDialog = (value, ...props) => {
    if (props[0] && props[0] === 'submit') {
      setOnSubmitData(true);
      dispatch(updateLabPartner(state.formEdit, code))
        .then(res => {
          if (res?.isSuccess && res?.statusCode === 200) {
            if (selectedFile !== undefined) {
              let uploadBrandStatus = true;
              const file = new FormData();
              file.append('File', selectedFile, selectedFile?.name);
              file.append('LabPartnerCode', code);
              dispatch(uploadLogo(file)).then(res => {
                if (res?.statusCode !== 200) {
                  uploadBrandStatus = false;
                }
              });
            }
            router.push('/registrasi-lab-partner');
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      setState({
        ...state,
        isOpenSavedConfirmationDialog: value
      });
    }
  };

  const setIsOpenDeleteDialog = (value, ...props) => {
    if (props[0] && props[0] === 'submit') {
      setOnDeleteData(true);
      dispatch(deleteLabPartner(code)).then(res => {
        if (res.isSuccess && res.statusCode === 200) {
          setState({
            ...state,
            isOpenDeleteDialog: false
          });
          setShowSuccessDeleteModal(true);
          setOnDeleteData(false);
        }
      });
    } else {
      setState({
        ...state,
        isOpenDeleteDialog: value
      });
    }
  };

  const validationSchema = Yup.object().shape({
    code: Yup.string().required('This field is required'),
    name: Yup.string().required('This field is required'),
    phoneNumber: Yup.string().required('This field is required'),
    pic: Yup.string().required('This field is required')
  });

  const handleChangeStatus = e => {
    setStatus(e);
  };

  useEffect(() => {
    if (slug == 'detail') {
      setState({
        ...state,
        formInitialValue: {
          ...labpartner.labPartnerDetail,
          labBumame: labpartner.labPartnerDetail?.lab?.name,
          cooperationTermCode:
            labpartner.labPartnerDetail?.cooperationTerm?.name
        },
        isReadonly: true,
        breadcrumbs: [
          {
            link: '/registrasi-lab-partner',
            name: 'List Registrasi Lab Partner'
          },
          {
            link: `/registrasi-lab-partner/${code}/${slug}`,
            name: 'Detail'
          }
        ]
      });
    }
    if (slug === 'edit') {
      setState({
        ...state,
        formInitialValue: {
          ...labpartner.labPartnerDetail,
          labId: labpartner.labPartnerDetail?.lab?.id,
          cooperationTermCode:
            labpartner.labPartnerDetail?.cooperationTerm?.code
        },
        isReadonly: false,
        breadcrumbs: [
          {
            link: '/registrasi-lab-partner',
            name: 'List Registrasi Lab Partner'
          },
          {
            link: `/registrasi-lab-partner/${code}/${slug}`,
            name: 'Edit'
          }
        ]
      });
      setIsSuccess(true);
      setStatus(labpartner.labPartnerDetail.statusData);
    }
    if (!labpartner.labSelectList || labpartner.labSelectList.length === 0) {
      dispatch(fetchLabSelectList());
    }
    if (
      !cooperationterm.cooperationTermSelectList ||
      cooperationterm.cooperationTermSelectList.length === 0
    ) {
      dispatch(fetchCooperationTermSelectList());
    }
  }, [
    slug,
    code,
    dispatch,
    labpartner.labSelectList,
    cooperationterm.cooperationTermSelectList,
    labpartner.labPartnerDetail
  ]);
  return (
    <>
      <Head>
        <title>Health Lab CMS</title>
        <link
          rel='icon'
          href={`${process.env.NEXT_PUBLIC_PREFIX_URL || ''}/favicon.ico`}
        />
      </Head>
      <MainLayout headline={state.headline} breadcrumb={state.breadcrumbs}>
        <Card>
          <Formik
            initialValues={state.formInitialValue}
            onSubmit={values => {
              // same shape as initial values
              setState({
                ...state,
                formEdit: {
                  ...values,
                  statusData: status
                },
                isOpenConfirmationDialog: true
              });
            }}
            innerRef={ref}
            enableReinitialize={true}
            validationSchema={validationSchema}
          >
            <Form>
              <div className={`grid gap-x-16 gap-y-6 mb-2 md:grid-cols-3`}>
                {/* First Row */}
                <div>
                  <Label htmlFor={'institution_code'}>Kode Institusi</Label>
                  <Field
                    name='code'
                    placeholder={`Kode Institusi`}
                    readonly={state.isReadonly}
                    disabled
                    component={Input}
                  />
                </div>
                <div>
                  <Label htmlFor={'partnership_aggrement'}>
                    Pilih Ketentuan Kerjasama
                  </Label>
                  {slug === 'detail' && (
                    <Field
                      name='cooperationTermCode'
                      placeholder={`Ketentuan Kerjasama`}
                      readonly={state.isReadonly}
                      component={Input}
                    />
                  )}

                  {slug === 'edit' && (
                    <Field
                      name='cooperationTermCode'
                      placeholder={`Ketentuan Kerjasama`}
                      component={Select}
                      defaultValue={
                        labpartner.labPartnerDetail?.cooperationTerm?.code
                      }
                    >
                      <option value={``}>Select Cooperation Term</option>
                      {cooperationterm.cooperationTermSelectList.length > 0 &&
                        cooperationterm.cooperationTermSelectList.map(
                          (item, key) => {
                            return (
                              <option
                                key={key}
                                value={`${item.cooperationTermCode}`}
                              >
                                {item.cooperationTermCode +
                                  ' - ' +
                                  item.cooperationTermName}
                              </option>
                            );
                          }
                        )}
                    </Field>
                  )}
                </div>
                <div className={`place-self-end self-start`}>
                  {slug == 'detail' && (
                    <Button
                      className={`bg-[#F64E60] flex items-center px-5`}
                      onClick={() => setIsOpenDeleteDialog(true)}
                    >
                      <div className={`mr-2 flex items-center`}>
                        <Image src={assets.IconTrash} alt={`Delete icon`} />
                      </div>
                      <Typography className={`text-white`}>Delete</Typography>
                    </Button>
                  )}
                </div>
                {/* Second Row */}
                <div>
                  <Label htmlFor={'name'}>Nama Institusi</Label>
                  <Field
                    name='name'
                    placeholder={`Nama Institusi`}
                    readonly={state.isReadonly}
                    component={Input}
                  />
                </div>
                <div>
                  <Label htmlFor={'address'}>Alamat</Label>
                  <Field
                    name='address'
                    placeholder={`Alamat`}
                    readonly={state.isReadonly}
                    component={Textarea}
                  />
                </div>
                <div className={`hidden lg:block`}></div>
                {/* Third Row */}
                <div>
                  <Label htmlFor={'priceQuoteList'}>List Penawaran Harga</Label>
                  <Field
                    name='priceQuoteList'
                    placeholder={`List Penawaran Harga`}
                    readonly={state.isReadonly}
                    component={Input}
                  />
                </div>
                <div>
                  <Label htmlFor={'pic'}>PIC</Label>
                  <Field
                    name='pic'
                    placeholder={`PIC`}
                    readonly={state.isReadonly}
                    component={Input}
                  />
                </div>
                <div className={`hidden lg:block`}></div>
                {/* Forth Row */}
                <div>
                  <Label htmlFor={'labInCharge'}>Penanggung Jawab Lab</Label>
                  <Field
                    name='labInCharge'
                    placeholder={`Penanggung Jawab Lab`}
                    readonly={state.isReadonly}
                    component={Input}
                  />
                </div>
                <div>
                  <Label htmlFor={'phoneNumber'}>No Handphone</Label>
                  <Field
                    name='phoneNumber'
                    placeholder={`No Handphone`}
                    readonly={state.isReadonly}
                    component={Input}
                  />
                </div>
                <div className={`hidden lg:block`}></div>
                {/* Fifth Row */}
                <div>
                  <Label htmlFor={'Health LabInCharge'}>
                    Penanggung Jawab Health Lab
                  </Label>
                  <Field
                    name='Health LabInCharge'
                    placeholder={`Penanggung Jawab Health Lab`}
                    readonly={state.isReadonly}
                    component={Input}
                  />
                </div>
                <div>
                  <Label htmlFor={'npwp'}>NPWP</Label>
                  <Field
                    name='npwp'
                    placeholder={`NPWP`}
                    readonly={state.isReadonly}
                    component={Input}
                  />
                </div>
                <div className={`hidden lg:block`}></div>
                {/* Fifth Row */}
                <div>
                  <div className={`hidden lg:block`}>
                    {slug == 'detail' ? (
                      <>
                        <div className={`hidden lg:block`}>
                          <Label>Upload Brand</Label>{' '}
                          <Typography className={``}>
                            {labpartner.labPartnerDetail.logoFilename}
                          </Typography>
                          <img src={preview} className={`h-[150px] mt-5`} />
                        </div>
                      </>
                    ) : (
                      <>
                        <Label>Upload Brand</Label>
                        <div className={`container`}>
                          <div className={`flex`}>
                            <li className={`pr-6`}> Max Height 922px </li>
                            <li> Max Size 5Mb </li>
                          </div>
                        </div>
                        <div className='container items-center flex my-6'>
                          <div>
                            <InputFile
                              className='whitespace-nowrap'
                              onChange={onSelectFile}
                              fileName={
                                selectedFileName &&
                                selectedFileName?.substring(0, 12) + '...'
                              }
                              accept='image/png, image/jpg, image/jpeg'
                              isWhite
                            />
                          </div>
                          {isSuccess ? (
                            <>
                              <div>
                                <div>
                                  <Button
                                    className='bg-inActive items-center p-2 align-center'
                                    onClick={() => removeBrand()}
                                    emptyPadding
                                  >
                                    <Image
                                      src={assets.IconTrash}
                                      alt={`Delete icon`}
                                    />
                                  </Button>
                                </div>
                              </div>
                            </>
                          ) : null}
                        </div>
                        <div>
                          {!isSuccess ? (
                            <>
                              <p className='error-message text-sm text-red-600 dark:text-red-500'>
                                {errorMsg}
                              </p>
                            </>
                          ) : null}
                          {preview && (
                            <img src={preview} className='h-[150px] mt-5' />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className={`hidden lg:block`}>
                  {slug == 'edit' && (
                    <>
                      <div>
                        <div>
                          <div className='w-full h-full flex flex-col rounded'>
                            <Label htmlFor={'statusData'}>Status</Label>
                            <div className='flex'>
                              <Radio
                                label={'Active'}
                                id={'status-1'}
                                name={'statusData'}
                                value={'Active'}
                                className={'mr-4'}
                                onClick={e => {
                                  handleChangeStatus(e.target.value);
                                }}
                                checked={
                                  labpartner.labPartnerDetail?.statusData ===
                                  'Active'
                                }
                              />
                              <Radio
                                label={'Inactive'}
                                id={'status-2'}
                                name={'statusData'}
                                value={'InActive'}
                                onClick={e => {
                                  handleChangeStatus(e.target.value);
                                }}
                                checked={
                                  labpartner.labPartnerDetail?.statusData ===
                                  'InActive'
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div></div>
                      <div></div>
                    </>
                  )}
                </div>
                <div className={`hidden lg:block`}></div>
                {/* Sixth Row */}

                {/* Seventh Row */}
                <div className={`hidden lg:block`}></div>
                <div className={`pt-5`}>
                  {slug === 'edit' && (
                    <Button
                      className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white mr-6`}
                      onClick={() => {
                        setIsOpenSavedConfirmationDialog(true);
                      }}
                      type={`submit`}
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
                    <Typography>
                      {slug === 'detail' ? 'Back' : 'Cancel'}
                    </Typography>
                  </Button>
                </div>
                <div className={`hidden lg:block`}></div>
                <div className={`hidden lg:block`}></div>
              </div>
            </Form>
          </Formik>
        </Card>

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
                setIsOpenSavedConfirmationDialog(false, 'submit');
              }}
              className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white mr-5`}
              disabled={onSubmitData === true ? true : false}
            >
              <span className='font-normal text-sm flex justify-center items-center'>
                {onSubmitData ? (
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
                <p className='text-white'>Yes</p>
              </span>
            </Button>
            <Button
              onClick={() => setIsOpenSavedConfirmationDialog(false)}
              className='bg-btn-cancel rounded-lg hover:bg-hover-btnCancel text-black'
            >
              <Typography>No</Typography>
            </Button>
          </div>
        </Modal>
        {slug == 'detail' && (
          // <Modal
          //   setIsOpen={(val) => setIsOpenDeleteDialog(val)}
          //   width={`w-[27rem]`}
          //   title={`Success`}
          //   headless
          //   isOpen={state.isOpenDeleteDialog}>
          //   <div>
          //     <Image src={assets.IconInfo} alt={`Success dialog image`} />
          //   </div>
          //   <Typography className={`pt-8`}>
          //     {Messages.confirmationDeleteData}
          //   </Typography>
          //   <div className={`pt-10`}>
          //     <Button
          //       onClick={() => {
          //         setIsOpenDeleteDialog(false);
          //       }}
          //       className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black mr-5`}>
          //       <Typography>No</Typography>
          //     </Button>
          //     <Button
          //       onClick={() => {
          //         setIsOpenDeleteDialog(false, "submit");
          //       }}
          //       className={`bg-inActive rounded-lg hover:bg-inActive text-white`}
          //       disabled={onDeleteData === true ? true : false}>
          //       <span
          //         className={`font-normal text-sm flex justify-center items-center`}>
          //         {onDeleteData ? (
          //           <svg
          //             class="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-[#FFF] dark:fill-gray-300"
          //             viewBox="0 0 100 101"
          //             fill="none"
          //             xmlns="http://www.w3.org/2000/svg">
          //             <path
          //               d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          //               fill="currentColor"
          //             />
          //             <path
          //               d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          //               fill="currentFill"
          //             />
          //           </svg>
          //         ) : null}
          //         <p className="text-white">Yes</p>
          //       </span>
          //     </Button>
          //   </div>
          // </Modal>
          <ModalConfirmation
            show={state.isOpenDeleteDialog}
            onHide={() => setIsOpenDeleteDialog(false)}
            handleYes={() => {
              setIsOpenDeleteDialog(false, 'submit');
            }}
            desc1={Messages.confirmationDeleteData}
            isLoading={onDeleteData}
            confirmDelete={true}
          />
        )}
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
              onClick={() => router.push('/registrasi-lab-partner')}
              color={`white`}
              background='bg-btnBlue'
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

export default RegistrasiLabPartnerSlug;
