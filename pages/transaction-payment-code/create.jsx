import { Button, Modal, Radio, Typography } from 'components/atoms';
import { CORPORATE_FETCH_DETAIL } from 'components/constants/Corporate';
import { CORPORATE_TRX_FETCH_DETAIL } from 'components/constants/CorporateTransaction';
import Messages from 'components/constants/PopUpMessage';
import {
  TRANSACTION_FETCH_DOCUMENT_LIST,
  TRANSACTION_FETCH_IN_HOUSE_DETAIL,
  TRANSACTION_FETCH_ITEMS,
  TRANSACTION_FETCH_HOUSE_CALL_DETAIL
} from 'components/constants/Transaction';
import { GenerateForm, MainLayout } from 'components/organisms';
import ParseMessage from 'components/utils/string';
import { fetchCorporateDetail } from 'components/store/actions/corporate';
import { createCorporateTrx } from 'components/store/actions/corporateTrx/corporateTrx';
import { createTransaction } from 'components/store/actions/housecall';
import { uploadDocument } from 'components/store/actions/transaction';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import assets from 'public';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const CreateTransactionPaymentCode = props => {
  const [payment_code_type, setPaymentCodeType] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();
  const selector = useSelector(state => state);
  const { corporate } = selector;
  const [onCreate, setOnCreate] = useState(false);
  const [state, setState] = useState({
    headline: 'Type Service',
    breadcrumbs: [
      {
        link: '/transaction-payment-code',
        name: 'Transaction Payment Code'
      },
      {
        link: '/transaction-payment-code/create',
        name: 'Type Service'
      }
    ],
    formInitialValue: {
      typeService: '',
      webRegInitialValue: {
        corporateCode: '',
        productId: 0,
        productName: '',
        productPrice: 0,
        qty: 0,
        discount: 0,
        serviceMethod: '',
        transactionDate: new Date(),
        description: '',
        groupType: 'Covid'
      },
      houseCallCorporateInitialValue: {
        corporateName: '',
        product: '',
        totalPaymentCode: '',
        discount: '',
        paymentCodeTable: [{ paymentCode: '', patientName: '', nik: '' }],
        dataInformation: {
          pic: '',
          address: '',
          cost: '',
          description: ''
        },
        actionSchedule: {
          medic: '',
          bookingDate: '',
          bookingTime: ''
        },
        supportingData: [
          {
            file: '',
            note: ''
          }
        ]
      },
      supportingData: [
        {
          file: '',
          note: ''
        }
      ]
    },
    isGenerateFormOpen: false,
    isHouseCallFormOpen: false,
    isWebRegFormOpen: false,
    isOpenConfirmationDialog: false,
    isOpenSuccessDialog: false,
    typeService: '',
    corporate_name: '',
    corporate_type: ''
  });
  const [submitForm, setSubmitForm] = useState({
    corporateCode: '',
    productId: 0,
    productName: '',
    productPrice: 0,
    qty: 0,
    discount: 0,
    serviceMethod: '',
    groupType: '',
    transactionDate: '',
    startDate: '',
    endDate: '',
    additionalCost: 0,
    description: '',
    picName: '',
    address: '',
    items: [
      {
        identityNumber: '',
        identityName: ''
      }
    ],
    schedule: {
      pic: '',
      bookingDate: '',
      timeStart: 0,
      timeEnd: 0
    },
    site: ''
  });
  const [transactionId, setTransactionId] = useState(undefined);
  const [isOpenErrorDialog, setIsOpenErrorDialog] = useState(false);
  const generateFormRef = useRef();
  const webRegFormRef = useRef();
  const houseCallFormRef = useRef();
  const uploadDocumentFormRef = useRef();
  const onClickRadio = e => {
    setPaymentCodeType(e.target.value);
    state.typeService = e.target.value;
    setState({
      ...state,
      isGenerateFormOpen: e && true,
      headline:
        e.target.value == 'house-call' ? 'Create House Call' : 'Create Web Reg',
      isHouseCallFormOpen: false,
      isHouseCallCorporateFormOpen: false,
      isWebRegFormOpen: false
    });
  };

  const onChangeCorporate = item => {
    if (item?.code) {
      dispatch(fetchCorporateDetail(item?.code));
    } else {
      dispatch({ type: CORPORATE_FETCH_DETAIL, payload: null });
    }
  };

  const setGenerateForm = (e, houseCallType) => {
    let hc = state.isHouseCallFormOpen;
    let wr = state.isWebRegFormOpen;
    if (e == 'house-call') {
      wr = false;
      hc = true;
    } else {
      hc = false;
      wr = true;
    }
    setState({
      ...state,
      isHouseCallFormOpen: hc,
      isWebRegFormOpen: wr
    });
  };
  const setIsOpenConfirmationDialog = (value, type = '') => {
    if (type === 'submit') {
      if (payment_code_type === 'inhouse') {
        const generateFormValue = generateFormRef.current?.values;
        const webRegFormValue = webRegFormRef.current?.values;
        const newWebRegData = {
          corporateCode: generateFormValue.corporateName?.code,
          productId: generateFormValue.product?.productId,
          productName: generateFormValue.product?.productName,
          productPrice: generateFormValue.product?.productPrice,
          qty: generateFormValue.qty,
          discount: generateFormValue.discount,
          startDate: generateFormValue.startDate,
          endDate: generateFormValue.endDate,
          serviceMethod: generateFormValue.serviceMethod?.value ?? '',
          groupType: generateFormValue.product?.type,
          transactionDate: webRegFormValue.transactionDate
            ? webRegFormValue.transactionDate
            : new Date().toISOString(),
          additionalCost: 0,
          description: webRegFormValue.description,
          picName: null,
          address: null,
          items: null,
          schedule: null
        };
        setOnCreate(true);

        dispatch(createCorporateTrx(newWebRegData))
          .then(res => {
            if (!res) {
              setIsOpenConfirmationDialog(false);
              setIsOpenErrorDialog(true);
            }
            if (res?.payload > 0) {
              setTransactionId(res?.payload);
              let uploadDocumentStatus = true;
              webRegFormValue.supportingData.forEach((item, index) => {
                if (item.File) {
                  const newFormData = new FormData();
                  newFormData.append('TransactonId', parseInt(res.payload));
                  newFormData.append('File', item.File);
                  newFormData.append('Type', item.File.type);
                  newFormData.append('Notes', item.Notes);

                  dispatch(uploadDocument(newFormData)).then(res => {
                    if (!res.isSuccess && res.statusCode !== 200) {
                      uploadDocumentStatus = false;
                    }
                  });
                }
              });

              if (uploadDocumentStatus) {
                setIsOpenSuccessDialog(true);
              }
            }
            setOnCreate(false);
          })
          .catch(err => {
            setIsOpenErrorDialog(true);
          });
      }
      if (payment_code_type === 'house-call') {
        const generateFormValue = generateFormRef.current?.values;
        const houseCallFormValue = houseCallFormRef.current?.values;
        const newHouseCallData = {
          corporateCode: generateFormValue.corporateName?.code || '',
          productId: generateFormValue.product?.productId || 0,
          productName: generateFormValue.product?.productName || '',
          productPrice: generateFormValue.product?.productPrice || 0,
          qty: generateFormValue.qty || 0,
          discount: generateFormValue.discount || 0,
          serviceMethod: '',
          groupType: generateFormValue.product?.type || '',
          transactionDate: houseCallFormValue.schedule?.bookingDate
            ? houseCallFormValue.schedule?.bookingDate
            : new Date().toISOString(),
          additionalCost:
            parseInt(
              String(houseCallFormValue.additionalCost).replace('.', '')
            ) || 0,
          description: houseCallFormValue.description || '',
          picName:
            corporate.detail?.pics[0] && corporate.detail?.pics[0]?.name
              ? corporate.detail?.pics[0]?.name
              : '',
          address: corporate.detail?.address ? corporate.detail?.address : '',
          items: houseCallFormValue.transactionItems?.items
            ? houseCallFormValue.transactionItems?.items.map(item => {
                return { ...item, identityNumber: `${item.identityNumber}` };
              })
            : null,
          schedule: {
            pic: houseCallFormValue.schedule?.pic || '',
            bookingDate:
              houseCallFormValue.schedule?.bookingDate ||
              new Date().toISOString(),
            timeStart: houseCallFormValue.schedule?.timeStart || 0,
            timeEnd: houseCallFormValue.schedule?.timeEnd || 0
          },
          SiteCode: generateFormValue.site?.branchCode || ''
        };
        setOnCreate(true);

        dispatch(createTransaction(newHouseCallData)).then(res => {
          if (!res) {
            setIsOpenConfirmationDialog(false);
            setIsOpenErrorDialog(true);
          }
          if (res?.payload) {
            setTransactionId(res?.payload);
            let uploadDocumentStatus = true;
            houseCallFormValue.uploadData?.supportingData.forEach(
              (item, index) => {
                if (item.File) {
                  const newFormData = new FormData();
                  newFormData.append('TransactonId', parseInt(res.payload));
                  newFormData.append('File', item.File);
                  newFormData.append('Type', item.File.type);
                  newFormData.append('Notes', item.Notes);
                  dispatch(uploadDocument(newFormData)).then(res => {
                    if (!res.isSuccess && res.statusCode !== 200) {
                      uploadDocumentStatus = false;
                    }
                  });
                }
              }
            );
            if (uploadDocumentStatus) {
              setIsOpenSuccessDialog(true);
            }
          }
          setOnCreate(false);
        });
      }
    } else {
      setState({
        ...state,
        isOpenConfirmationDialog: value
      });
    }
  };
  const setIsOpenSuccessDialog = value => {
    setState({
      ...state,
      isOpenSuccessDialog: value,
      isOpenConfirmationDialog: false
    });
  };

  const onSubmitGenerate = value => {
    if (payment_code_type === 'inhouse') {
      state.formInitialValue.webRegInitialValue = value;
    }
    if (payment_code_type === 'house-call') {
      state.formInitialValue.houseCallCorporateInitialValue = value;
    }
    setState({
      ...state,
      formInitialValue: {
        ...state.formInitialValue
      }
    });
  };

  const onSubmitWebReg = value => {
    const newData = {
      ...value,
      corporateCode: value.corporateName?.code,
      productId: value.product?.value,
      productName: value.product?.productName,
      productPrice: value.product?.productPrice,
      serviceMethod: value.serviceMethod?.value,
      groupType: value.product?.type,
      transactionDate: value.transactionDate?.toISOString(),
      startDate: value.startDate?.toISOString(),
      endDate: value.endDate?.toISOString(),
      additionalCost: 0,
      picName: '',
      address: '',
      items: [
        {
          identityNumber: '',
          identityName: ''
        }
      ],
      schedule: {
        pic: '',
        bookingDate: '',
        timeStart: 0,
        timeEnd: 0
      },
      site: value.branchCode
    };
    setSubmitForm(newData);
  };

  const onUploadDocument = value => {};

  return (
    <>
      {isOpenErrorDialog && (
        <Modal
          setIsOpen={val => {
            setIsOpenErrorDialog(val);
          }}
          width={`w-[27rem]`}
          title={`Error`}
          headless
          isOpen={isOpenErrorDialog}
        >
          <div>
            <Image src={assets.IconCross} alt={`Success dialog image`} />
          </div>
          <Typography className={`pt-8 text-center`}>
            {
              'Simpan data Gagal. \nData tidak berhasil disimpan, silahkan coba lagi'
            }
          </Typography>
          <div className={`pt-10`}>
            <Button
              onClick={() => {
                setIsOpenErrorDialog(false);
              }}
              className='bg-btnBlue rounded-lg hover:bg-hover-btnBlue text-white'
            >
              <Typography>OK</Typography>
            </Button>
          </div>
        </Modal>
      )}
      <Head>
        <title>Bumame CMS</title>
        <link
          rel='icon'
          href={`${process.env.NEXT_PUBLIC_PREFIX_URL || ''}/favicon.ico`}
        />
      </Head>
      <MainLayout headline={state.headline} breadcrumb={state.breadcrumbs}>
        <main
          className={'flex flex-col bg-white rounded-lg shadow-lg p-7 mb-5'}
        >
          <div className='flex justify-between pb-5'>
            <Typography className={`font-medium text-lg`}>
              Select Type Service
            </Typography>
          </div>
          <div className='w-full h-full overflow-x-auto space-y-[16px] flex flex-col rounded'>
            <div className='flex'>
              <Radio
                label={'House Call'}
                id={'type-1'}
                name={'type'}
                onClick={e => {
                  onClickRadio(e);
                }}
                value={'house-call'}
                className={'mr-4'}
              />
              <Radio
                label={'In House'}
                id={'type-2'}
                name={'type'}
                onClick={e => {
                  onClickRadio(e);
                }}
                value={'inhouse'}
              />
            </div>
          </div>
        </main>
        <GenerateForm
          payment_code_type={payment_code_type}
          setIsOpenConfirmationDialog={setIsOpenConfirmationDialog}
          isGenerateFormOpen={state.isGenerateFormOpen}
          isHouseCallFormOpen={state.isHouseCallFormOpen}
          isWebRegFormOpen={state.isWebRegFormOpen}
          setGenerateForm={setGenerateForm}
          onChangeCorporate={onChangeCorporate}
          corporate_name={state.corporate_name}
          corporate_type={state.corporate_type}
          onSubmitGenerate={onSubmitGenerate}
          onSubmitWebReg={onSubmitWebReg}
          generateFormRef={generateFormRef}
          onUploadDocument={onUploadDocument}
          uploadDocumentFormRef={uploadDocumentFormRef}
          webRegFormRef={webRegFormRef}
          houseCallFormRef={houseCallFormRef}
        />
        {state.isOpenConfirmationDialog && (
          <Modal
            setIsOpen={val => setIsOpenConfirmationDialog(val)}
            width={`w-[27rem]`}
            title={`Confirmation`}
            isOpen={state.isOpenConfirmationDialog}
          >
            <Typography>
              {ParseMessage(
                corporate?.detail &&
                  corporate?.detail?.corporateType === 'Corporate'
                  ? Messages.transactionPaymentCodeConfirmation
                  : Messages.transactionPaymentCodeIndividualConfirmation,
                corporate?.detail &&
                  corporate?.detail?.corporateType === 'Corporate'
                  ? corporate?.detail?.pics[
                      corporate?.detail?.pics.findIndex(
                        x => x.title === 'Operasional'
                      )
                    ]?.contact
                  : corporate?.detail?.phoneNumber
              )}
            </Typography>
            <div className={`pt-12`}>
              <Button
                onClick={() => {
                  setIsOpenConfirmationDialog(false, 'submit');
                }}
                className='bg-btnBlue rounded-lg hover:bg-hover-btnBlue text-white mr-5'
                disabled={onCreate === true ? true : false}
              >
                <span className='font-normal text-sm flex justify-center items-center'>
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
                  <p className='text-white'>Yes</p>
                </span>
              </Button>
              <Button
                onClick={() => setIsOpenConfirmationDialog(false)}
                className='bg-btn-cancel rounded-lg hover:bg-hover-btnCancel text-black'
              >
                <Typography>No</Typography>
              </Button>
            </div>
          </Modal>
        )}
        {state.isOpenSuccessDialog && (
          <Modal
            setIsOpen={val => setIsOpenSuccessDialog(val)}
            width={`w-[27rem]`}
            title={`Success`}
            headless
            isOpen={state.isOpenSuccessDialog}
          >
            <div>
              <Image
                src={assets.ImageCheckedGreen}
                alt={`Success dialog image`}
              />
            </div>
            <Typography className={`pt-8`}>
              {ParseMessage(
                corporate?.detail &&
                  corporate?.detail?.corporateType === 'Corporate'
                  ? Messages.transactionPaymentCodeSuccess
                  : Messages.transactionPaymentCodeIndividualSuccess,
                corporate?.detail &&
                  corporate?.detail?.corporateType === 'Corporate'
                  ? corporate?.detail?.pics[
                      corporate?.detail?.pics.findIndex(
                        x => x.title === 'Operasional'
                      )
                    ]?.contact
                  : corporate?.detail?.phoneNumber
              )}
            </Typography>
            <div className={`pt-10`}>
              <Button
                onClick={() => {
                  setIsOpenSuccessDialog(false);
                  dispatch({
                    type: CORPORATE_TRX_FETCH_DETAIL,
                    payload: undefined
                  });
                  dispatch({
                    type: TRANSACTION_FETCH_IN_HOUSE_DETAIL,
                    payload: undefined
                  });
                  dispatch({
                    type: TRANSACTION_FETCH_ITEMS,
                    payload: undefined
                  });
                  dispatch({
                    type: TRANSACTION_FETCH_DOCUMENT_LIST,
                    payload: undefined
                  });
                  dispatch({
                    type: TRANSACTION_FETCH_HOUSE_CALL_DETAIL,
                    payload: undefined
                  });
                  router.push(
                    `/transaction-payment-code/${transactionId}/${
                      payment_code_type === 'inhouse'
                        ? 'in-house'
                        : 'house-call'
                    }/${payment_code_type === 'house-call' ? 'edit' : 'detail'}`
                  );
                }}
                className='bg-btnBlue rounded-lg hover:bg-hover-btnBlue text-white'
              >
                <Typography>OK</Typography>
              </Button>
            </div>
          </Modal>
        )}
      </MainLayout>
    </>
  );
};

export default CreateTransactionPaymentCode;
