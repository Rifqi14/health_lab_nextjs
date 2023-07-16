import assets from 'public/index';
import {
  Button,
  Card,
  DateInput,
  Input,
  Label,
  Modal,
  Pill,
  ReactSelect,
  Typography
} from 'components/atoms';
import Messages from 'components/constants/PopUpMessage';
import { EmptyTable } from 'components/molecules';
import { MainLayout, Table } from 'components/organisms';
import { ymdToDmy } from 'components/utils/datetime';
import { currencyFormatter } from 'components/utils/number';
import ParseMessage from 'components/utils/string';
import {
  fetchLabPartnerDetail,
  fetchSelectList
} from 'components/store/actions/labPartner';
import { fetchLabTransactionDetail } from 'components/store/actions/labtransaction';
import {
  deleteLabTransaction,
  sendLabTransactionToPic,
  fetchDownloadResult,
  updateTierPricing
} from 'components/store/actions/labtransaction';
import { fetchProductTierSelectList } from 'components/store/actions/product';
import { fetchTierSelectList } from 'components/store/actions/tier';
import { format } from 'date-fns';
import { Field, FieldArray, Form, Formik } from 'formik';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const LabPartnerTransactionSlug = props => {
  const router = useRouter();
  const { slug, id } = router.query;
  const dispatch = useDispatch();
  const selector = useSelector(state => state);
  const { tier, product, labpartner, labtransaction } = selector;
  const [showSuccessDeleteModal, setShowSuccessDeleteModal] = useState(false);
  const [state, setState] = useState({
    headline: 'Lab Partner Transaction',
    breadcrumbs: [
      {
        link: '/lab-partner-transaction',
        name: 'List Lab Partner Transaction'
      },
      {
        link: `/lab-partner-transaction/${id}/${slug}`,
        name: 'Edit'
      }
    ],
    formInitialValue: {
      labPartnerCode: '',
      tierId: 0,
      tierName: '',
      serviceMethod: '',
      serviceGroup: '',
      salesRepresentatif: '',
      transactionDate: new Date().toISOString(),
      items: [
        {
          identityName: '',
          identityNumber: '',
          phoneNumber: '',
          idType: '',
          address: '',
          gender: '',
          nationality: '',
          birtOfDate: '',
          productId: 0,
          productName: '',
          productPrice: 0,
          serviceGroup: 'LAB PARTNER',
          sampleCode: '',
          productType: 'Covid'
        }
      ]
    },
    isOpenSavedConfirmationDialog: false,
    isOpenDeleteDialog: false,
    isOpenSendResultDialog: false,
    isOpenSendResultSuccessDialog: false,
    isReadonly: false
  });
  const [tierData, setTierData] = useState([{ value: '', label: '' }]);
  const [productData, setProductData] = useState([{ value: '', label: '' }]);
  const [cooperationTermData, setCooperationTermData] = useState([]);
  const [tierSelected, setTierSelected] = useState({});
  const [summaryOrder, setSummaryOrder] = useState();
  const [newPatientData, setNewPatientData] = useState([]);
  const [onSubmitData, setOnSubmitData] = useState(false);

  const idTypeData = [
    {
      label: 'NIK KTP',
      value: 'NIK KTP'
    },
    {
      label: 'Passport',
      value: 'Passport'
    }
  ];

  const genderData = [
    {
      label: 'Laki-laki',
      value: 'Laki-laki'
    },
    {
      label: 'Perempuan',
      value: 'Perempuan'
    }
  ];

  const headColumns = [
    {
      key: 'no',
      name: 'No',
      className: 'w-auto .DetailTable'
    },
    {
      key: 'identityName',
      name: 'Nama Pasien',
      className: 'text-left w-auto'
    },
    {
      key: 'sampleCode',
      name: 'Sample Code',
      className: 'text-left w-auto'
    },
    {
      key: 'identityIdType',
      name: 'ID Type',
      className: 'text-left w-auto'
    },
    {
      key: 'identityNumber',
      name: 'ID Client (NIK KTP/Passport)',
      className: 'text-left w-auto'
    },
    {
      key: 'address',
      name: 'Address',
      className: 'text-left w-auto'
    },
    {
      key: 'gender',
      name: 'Gender',
      className: 'text-left w-auto'
    },
    {
      key: 'birtOfDate',
      name: 'Date Of Birth',
      className: 'text-left w-auto'
    },
    {
      key: 'nationality',
      name: 'Nationality',
      className: 'text-left w-auto'
    },
    {
      key: 'nationality',
      name: 'Phone Number',
      className: 'text-left w-auto'
    },
    {
      key: 'product',
      name: 'Product',
      className: 'text-left w-auto'
    },
    {
      key: 'status',
      name: 'Status',
      className: `${
        slug == 'edit' && 'hidden'
      } w-2/12 bg-[#F3F6F9] second-last-header`
    },
    {
      key: 'action',
      name: 'Action',
      className: `${slug == 'edit' && 'hidden'} w-2/12 bg-[#F3F6F9] `
    }
  ];

  const navigateToSlug = value => {
    dispatch(fetchLabTransactionDetail(value.id))
      .then(res => {
        if (res.isSuccess && res.statusCode === 200) {
          router.push(`/lab-partner-transaction/${value.id}/${value.slug}`);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const setIsOpenSavedConfirmationDialog = (value, type = '') => {
    if (type === 'submit') {
      setOnSubmitData(true);
      const data = {
        id: id,
        tierId: tierSelected.value
      };
      dispatch(updateTierPricing(data)).then(res => {
        if (res?.isSuccess && res?.statusCode === 200) {
          navigateToSlug({ id: data.id, slug: 'detail' });
        }
        setOnSubmitData(false);
      });
    } else {
      setState({
        ...state,
        isOpenSavedConfirmationDialog: value
      });
    }
  };

  const setIsOpenDeleteDialog = (value, type = '') => {
    if (type === 'submit') {
      dispatch(deleteLabTransaction(id)).then(res => {
        if (res?.isSuccess && res?.statusCode === 200) {
          setState({
            ...state,
            isOpenDeleteDialog: false
          });
          setShowSuccessDeleteModal(true);
        }
      });
    } else {
      setState({
        ...state,
        isOpenDeleteDialog: value
      });
    }
  };

  const setIsOpenSendResultDialog = (value, type = '') => {
    if (type === 'submit') {
      dispatch(sendLabTransactionToPic(id)).then(res => {
        if (res) {
          setState({
            ...state,
            isOpenSendResultDialog: false,
            isOpenSendResultSuccessDialog: true
          });
        }
      });
    } else {
      setState({
        ...state,
        isOpenSendResultDialog: value
      });
    }
  };

  const setIsOpenSendResultSuccessDialog = value => {
    setState({
      ...state,
      isOpenSendResultSuccessDialog: value
    });
  };

  const setDetailSummaryOrder = () => {
    const uniqueItem = labtransaction.detail.items.reduce((prev, current) => {
      const productId =
        current.productName + ' - ' + currencyFormatter(current.productPrice);
      prev[productId] =
        prev[productId] === undefined ? 1 : (prev[productId] += 1);

      return prev;
    }, {});

    return Object.keys(uniqueItem).map(k => {
      return { name: k, count: uniqueItem[k] };
    });
  };

  const downloadResult = (transactionItemId, fileName) => {
    dispatch(fetchDownloadResult(transactionItemId, fileName));
  };

  useEffect(() => {
    if (slug === 'detail') {
      if (labpartner.labPartnerDetail?.code != labtransaction.detail?.labCode) {
        dispatch(fetchLabPartnerDetail(labtransaction.detail?.labPartnerCode));
      }
      setSummaryOrder(setDetailSummaryOrder());
      setState({
        ...state,
        breadcrumbs: [
          {
            link: '/lab-partner-transaction',
            name: 'List Lab Partner Transaction'
          },
          {
            link: `/lab-partner-transaction/${id}/${slug}`,
            name: 'Detail'
          }
        ],
        isReadonly: true
      });
    } else {
      setSummaryOrder(setDetailSummaryOrder());
      // setSummaryOrder({
      //   totalOrderProduct: labtransaction.detail?.items?.length,
      //   totalProductType: setDetailSummaryOrder().length,
      //   totalPrice: labtransaction.detail?.items?.reduce(
      //     (accum, item) => accum + item.productPrice,
      //     0
      //   ),
      // });
      if (!tierSelected || tierSelected?.value === undefined) {
        setTierSelected({
          value: labtransaction.detail?.tierId,
          label: labtransaction.detail?.tierName
        });
        dispatch(fetchProductTierSelectList(labtransaction.detail?.tierId));
      }
    }
    if (
      (tier.selectList.length <= 0 || tier.selectList !== Array) &&
      slug === 'edit'
    ) {
      dispatch(fetchTierSelectList());
      if (tier.selectList.type !== 'error') {
        const cekProduct = 'pcr';
        if (!labtransaction.detail.tierName.toLowerCase().includes('pcr')) {
          cekProduct = 'antigen';
        }
        const dataTier = tier.selectList?.map(item => {
          if (item.name.toLowerCase().includes(cekProduct)) {
            return {
              value: item.id,
              label: item.name,
              totalProduct: item.totalProduct
            };
          }
        });
        dataTier = dataTier.filter(function (element) {
          return element !== undefined;
        });
        setTierData(dataTier);
      }
    }
    if (tierSelected && tierSelected?.value !== undefined) {
      dispatch(fetchProductTierSelectList(tierSelected.value));
      setProductData(
        product.tierSelectList.map(item => {
          return {
            ...item,
            value: item.productId,
            label: `${item.productName} - ${currencyFormatter(
              item.productPrice
            )}`
          };
        })
      );
    } else {
      setProductData([]);
    }
    if (!labpartner.selectList || labpartner.selectList.length <= 0) {
      dispatch(fetchSelectList({ StatusData: 'Active', p: 1, s: 1000 }));
    } else {
      setCooperationTermData(
        labpartner.selectList?.map(item => {
          return {
            ...item,
            value: item.code,
            label: item.name
          };
        })
      );
    }
  }, [
    slug,
    id,
    state.isOpenSendResultDialog,
    state.isOpenSendResultSuccessDialog,
    dispatch,
    tierSelected
  ]);

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
        <Card>
          <Formik
            initialValues={labtransaction.detail}
            enableReinitialize
            dirty={true}
            onSubmit={values => {
              setState({
                ...state,
                isOpenSavedConfirmationDialog: true
              });
            }}
          >
            {({ values, errors, touched, setFieldValue }) => (
              <Form>
                <div
                  className={`grid gap-x-16 gap-y-6 mb-2 grid-cols-2 lg:grid-cols-3 pb-6`}
                >
                  {/* First Row */}
                  <div>
                    <Label htmlFor={'labPartnerCode'}>Nama Partner</Label>
                    <Field
                      name={`labPartnerCode`}
                      component={ReactSelect}
                      defaultValue={values.labPartnerName}
                      options={cooperationTermData}
                      placeholder={`Choose a partner...`}
                      readonly
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor={tierSelected}>Tier Pricing</Label>
                    <Field
                      name={tierSelected}
                      component={ReactSelect}
                      defaultValue={
                        slug === 'detail' ? values.tierName : tierSelected
                      }
                      value={tierSelected}
                      options={tierData}
                      placeholder={`Choose a tier...`}
                      onChange={option => {
                        setTierSelected(option);
                      }}
                      readonly={state.isReadonly}
                    />
                  </div>
                  <div>
                    <div className={`grid gap-4 grid-cols-1 xl:grid-cols-2 `}>
                      <div>
                        <Label className={`pb-2`}>Status</Label>
                        <div className='inline-flex'>
                          <Pill
                            type={values.status.toLowerCase().replace(' ', '_')}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Second Row */}
                  <div>
                    <Label htmlFor={'site.siteName'}>Assign Site</Label>
                    <Field
                      name={`site.siteName`}
                      placeholder={`Lab Bumame`}
                      component={Input}
                      type='text'
                      readonly
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor={'salesRepresentatif'}>
                      Sales Representatif
                    </Label>
                    <Field
                      name={`salesRepresentatif`}
                      placeholder={`Sales Representatif`}
                      component={Input}
                      type='text'
                      readonly
                    />
                  </div>
                  <div></div>
                  {/* Third Row */}
                  <div>
                    <Label htmlFor={'transactionDate'}>Tanggal Transaksi</Label>
                    <Field
                      id={`transactionDate`}
                      name={`transactionDate`}
                      component={DateInput}
                      defaultValue={ymdToDmy(values.transactionDate)}
                      selectedDate={values.transactionDate}
                      readOnly
                      icon={assets.IconCalendar}
                    />
                  </div>
                </div>
                <div className='grid gap-x-16 gap-y-6 mb-2 md:grid-cols-1'>
                  <div className='pb-3'>
                    <Typography className='font-medium text-base'>
                      Masukan Data Pasien
                    </Typography>
                  </div>
                  <FieldArray name='items'>
                    {arrayHelpers => (
                      <div className='container overflow-x-auto w-full h-full space-y-[16px] rounded border border-disabledItem'>
                        <div
                          className={`${
                            slug === 'detail' && 'DetailTable'
                          } overflow-x-scroll`}
                        >
                          <Table headColumns={headColumns}>
                            {values.items.length > 0 ? (
                              values.items.map((item, key) => {
                                return (
                                  <tr key={key} className='text-center'>
                                    {/* No */}
                                    <td className='py-4'>
                                      <Typography>{key + 1}</Typography>
                                    </td>
                                    {/* Name */}
                                    <td className='py-4 pr-6 text-left'>
                                      <div className='w-[280px]'>
                                        <Typography>
                                          {item.identityName}
                                        </Typography>
                                      </div>
                                    </td>
                                    {/* Sample Code */}
                                    <td className='py-4 pr-6 text-left'>
                                      <div className='w-[200px]'>
                                        <Typography>
                                          {item.sampleCode}
                                        </Typography>
                                      </div>
                                    </td>

                                    {/* identity Type */}
                                    <td className='py-4 pr-6 text-left'>
                                      <div className='w-[150px]'>
                                        <Typography>{item.idType}</Typography>
                                      </div>
                                    </td>
                                    {/* identity Number */}

                                    <td className='py-4 pr-6 text-left'>
                                      <div className='w-[280px]'>
                                        <Typography>
                                          {item.identityNumber}
                                        </Typography>
                                      </div>
                                    </td>
                                    {/* Address */}
                                    <td className='py-4 pr-6 text-left'>
                                      <div className='w-[280px]'>
                                        <Typography>{item.address}</Typography>
                                      </div>
                                    </td>

                                    <td className='py-4 pr-6 text-left'>
                                      <div className='w-[280px]'>
                                        <Typography>{item.gender}</Typography>
                                      </div>
                                    </td>
                                    <td className='py-4 pr-6 text-left'>
                                      <div className='w-[280px]'>
                                        <Typography>
                                          {format(
                                            new Date(item.birtOfDate),
                                            'dd/MM/Y'
                                          )}
                                        </Typography>
                                      </div>
                                    </td>
                                    <td className='py-4 pr-6 text-left'>
                                      <div className='w-[200px]'>
                                        <Typography>
                                          {item.nationality}
                                        </Typography>
                                      </div>
                                    </td>
                                    <td className='py-4 pr-6 text-left'>
                                      <div className='w-[200px]'>
                                        <Typography>
                                          {item.phoneNumber}
                                        </Typography>
                                      </div>
                                    </td>
                                    <td className='py-4 pr-6 text-left'>
                                      <div className='w-[200px]'>
                                        <Typography>
                                          {item.productName}
                                        </Typography>
                                      </div>
                                    </td>
                                    {slug === 'detail' ? (
                                      <>
                                        <td className='py-6 px-6 second-last'>
                                          <div>
                                            <Pill
                                              type={item.status
                                                .toLowerCase()
                                                .replace(' ', '_')}
                                            />
                                          </div>
                                        </td>
                                      </>
                                    ) : null}
                                    {slug === 'detail' ? (
                                      <>
                                        <td className='py-6 pr-6 w-[120px]'>
                                          {item.result.toLowerCase() !==
                                          'reswab' ? (
                                            <>
                                              <div>
                                                <Button
                                                  onClick={() =>
                                                    dispatch(
                                                      fetchDownloadResult(
                                                        item.id,
                                                        item.resultUrl
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
                                        </td>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </tr>
                                );
                              })
                            ) : (
                              <EmptyTable
                                colSpan={3}
                                title={`List pasien kosong`}
                              />
                            )}
                          </Table>
                        </div>
                      </div>
                    )}
                  </FieldArray>
                </div>
                <div className={`pb-1 pt-6`}>
                  <Typography className={`font-medium text-base`}>
                    Summary Order
                  </Typography>
                </div>
                <div className={`grid gap-x-5 grid-cols-1 lg:grid-cols-3`}>
                  <div>
                    <Label htmlFor={'total_order_product'}>Tipe Produk</Label>
                  </div>
                  <div>
                    <Label htmlFor={'totalProductType'}>Jumlah Order</Label>
                  </div>
                </div>
                {summaryOrder &&
                  summaryOrder.length > 0 &&
                  summaryOrder.map((item, key) => {
                    return (
                      <div
                        className={`grid gap-x-5 gap-y-2 mb-2 grid-cols-1 lg:grid-cols-3`}
                        key={key}
                      >
                        <div className={`pb-5`}>
                          <Field
                            id={`totalOrderProduct`}
                            name={`totalOrderProduct`}
                            component={Input}
                            value={item.name}
                            readonly
                          />
                        </div>
                        <div className={`pb-5`}>
                          <Field
                            id={`totalProductType`}
                            name={`totalProductType`}
                            component={Input}
                            value={item.count}
                            readonly
                          />
                        </div>
                      </div>
                    );
                  })}
                <div className={`grid gap-x-16 gap-y-6 mb-2 md:grid-cols-3`}>
                  <div>
                    {labtransaction.detail.status
                      .toLowerCase()
                      .replace(' ', '_') == 'result_received' &&
                      slug === 'detail' && (
                        <Button
                          className={`bg-label-completed-text rounded-lg text-white mr-6`}
                          onClick={() => setIsOpenSendResultDialog(true)}
                        >
                          <Typography className={`font-normal text-sm`}>
                            Send Result To PIC
                          </Typography>
                        </Button>
                      )}
                  </div>
                  <div className={`mx-auto`}>
                    {slug == 'edit' && (
                      <Button
                        className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white mr-6`}
                        type='submit'
                      >
                        <Typography className={`font-normal text-sm`}>
                          Save
                        </Typography>
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        router.push(`/lab-partner-transaction`);
                      }}
                      className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black`}
                    >
                      <Typography>Cancel</Typography>
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Card>
        {slug == 'edit' && (
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
                disabled={onSubmitData}
                className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white mr-5`}
              >
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
        )}
        {labtransaction.detail.status.toLowerCase() === 'collected' &&
          slug === 'detail' && (
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
                    setIsOpenDeleteDialog(false, 'submit');
                  }}
                  className={`bg-inActive rounded-lg hover:bg-inActive text-white`}
                >
                  <Typography>Yes</Typography>
                </Button>
              </div>
            </Modal>
          )}
        {slug === 'detail' &&
          labtransaction.detail.status.toLowerCase().replace(' ', '_') ==
            'result_received' &&
          labpartner.labPartnerDetail?.phoneNumber && (
            <>
              <Modal
                setIsOpen={val => setIsOpenSendResultDialog(val)}
                width={`w-[27rem]`}
                title={`Confirmation`}
                isOpen={state.isOpenSendResultDialog}
              >
                <Typography>
                  {ParseMessage(
                    Messages.transactionPaymentCodeConfirmationResult,
                    labpartner.labPartnerDetail?.phoneNumber
                  )}
                </Typography>
                <div className={`pt-10`}>
                  <Button
                    onClick={() => {
                      setIsOpenSendResultDialog(false, 'submit');
                    }}
                    className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white mr-5`}
                  >
                    <Typography>Yes</Typography>
                  </Button>
                  <Button
                    onClick={() => setIsOpenSendResultDialog(false)}
                    className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black`}
                  >
                    <Typography>No</Typography>
                  </Button>
                </div>
              </Modal>
              <Modal
                setIsOpen={val => setIsOpenSendResultSuccessDialog(val)}
                width={`w-[27rem]`}
                title={`Confirmation`}
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
                    Messages.transactionPaymentCodeSuccessResult,
                    '+62 8112334455'
                  )}
                </Typography>
                <div className={`pt-10`}>
                  <Button
                    onClick={() => setIsOpenSendResultSuccessDialog(false)}
                    className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white`}
                  >
                    <Typography>OK</Typography>
                  </Button>
                </div>
              </Modal>
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
                <Typography className={`pt-8`}>
                  Data berhasil dihapus
                </Typography>
                <div className='flex justify-center pt-8'>
                  <Button
                    onClick={() => router.push('/lab-partner-transaction')}
                    color={`white`}
                    background={`bg-btnBlue`}
                  >
                    <Typography className={`text-white font-normal text-sm`}>
                      OK
                    </Typography>
                  </Button>
                </div>
              </Modal>
            </>
          )}
      </MainLayout>
    </>
  );
};

export default LabPartnerTransactionSlug;
