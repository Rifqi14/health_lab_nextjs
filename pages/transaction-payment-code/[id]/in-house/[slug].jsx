import assets from 'public/index';
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
  Radio,
  Textarea,
  Typography
} from 'components/atoms';
import HouseCallButtonLabel, {
  StatusAvailableButton
} from 'components/constants/HouseCallButtonLabel';
import LengthChangeValue from 'components/constants/LengthChange';
import Messages from 'components/constants/PopUpMessage';
import { EmptyTable, Pagination } from 'components/molecules';
import { MainLayout, Table } from 'components/organisms';
import { ymdToDmy } from 'components/utils/datetime';
import { currencyFormatter } from 'components/utils/number';
import ParseMessage from 'components/utils/string';
import {
  fetchCorporateTrxDetail,
  setStatus
} from 'components/store/actions/corporateTrx/corporateTrx';
import {
  fetchTransactionDocumentList,
  fetchTransactionItems,
  uploadDocument
} from 'components/store/actions/transaction';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadDocument as uploadDocumentApi } from 'components/store/actions/transaction';

const WebRegSlug = props => {
  const router = useRouter();
  const { slug, id } = router.query;
  const dispatch = useDispatch();
  const selector = useSelector(state => state);
  const { transaction } = selector;
  const [isOpenUploadSupportingData, setIsOpenUploadSupportingData] =
    useState(false);
  const [state, setState] = useState({
    headline: 'Detail In House',
    breadcrumbs: [
      {
        link: '/transaction-payment-code',
        name: 'Transaction Payment Code'
      },
      {
        link: `/transaction-payment-code/${id}/in-house/${slug}`,
        name: 'Detail'
      }
    ],
    pagination: {
      p: 1,
      s: LengthChangeValue[0],
      offset: 0,
      limit: LengthChangeValue[0]
    },
    formInitialValue: {
      transaction_id: '123',
      corporate_name: 'Radya Digital',
      total_payment_code: 5,
      product: 'PCR 12 Jam - Rp 275.000',
      discount: '10%',
      type_service: 'Web Reg',
      type_service_code: 'web-reg',
      service_method: 'Drive Thru',
      status: 'Booked',
      description: '',
      table: [
        {
          no: 1,
          payment_code: 'BMPaymentCode_1',
          status: 'Terpakai',
          patient_name: 'Budi',
          used_date: '29-09-2022'
        },
        {
          no: 2,
          payment_code: 'BMPaymentCode_2',
          status: 'Belum Terpakai',
          patient_name: 'Budi',
          used_date: '29-09-2022'
        },
        {
          no: 3,
          payment_code: 'BMPaymentCode_3',
          status: 'Terpakai',
          patient_name: 'Budi',
          used_date: '29-09-2022'
        },
        {
          no: 4,
          payment_code: 'BMPaymentCode_4',
          status: 'Terpakai',
          patient_name: 'Budi',
          used_date: '29-09-2022'
        },
        {
          no: 5,
          payment_code: 'BMPaymentCode_5',
          status: 'Terpakai',
          patient_name: 'Budi',
          used_date: '29-09-2022'
        }
      ],
      transaction_date: '22/09/2022',
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
    detail: transaction.inHouseDetail,
    isOpenSavedConfirmationDialog: false,
    isOpenDeleteDialog: false,
    isReadonly: true,
    uploadData: [{ index: 1, file: '', note: '' }]
  });

  const setIsOpenSavedConfirmationDialog = value => {
    setState({
      ...state,
      isOpenSavedConfirmationDialog: value
    });
  };

  const setIsOpenDeleteDialog = value => {
    setState({
      ...state,
      isOpenDeleteDialog: value
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
      key: 'status',
      name: 'Status'
    },
    {
      key: 'patient_name',
      name: 'Nama Pasien',
      className: 'text-left'
    },
    {
      key: 'used_date',
      name: 'Tanggal pemakaian'
    }
  ];

  const suppDataHeadColumns = [
    { key: 'no', name: 'No', className: 'w-[3rem] py-[15px] px-[0px]' },
    { key: 'file', name: 'File', className: 'text-left py-[15px] px-[0px]' },
    { key: 'note', name: 'Note', className: 'text-left py-[15px] px-[0px]' }
  ];

  if (transaction.inHouseDetail?.statusDesc == 'Booked') {
    headColumns.push({
      key: 'action',
      name: 'Action'
    });
  }

  useEffect(() => {
    if (id) {
      dispatch(fetchCorporateTrxDetail(id));
      dispatch(fetchTransactionItems(id));
      dispatch(fetchTransactionDocumentList(id));
    }
  }, [dispatch, id]);

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

  const uploadDocument = () => {
    state.uploadData.forEach(async (item, index) => {
      const formData = new FormData();
      formData.append('TransactonId', id);
      formData.append('Type', 'supporting-data');
      formData.append('file', item.file);
      formData.append('notes', item.note);
      const res = await dispatch(uploadDocumentApi(formData));

      if (res.statusCode === 200 && index === state.uploadData.length - 1) {
        router.reload();
      }
    });
  };

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
        <form ref={form}>
          {/* Upper Section Form */}
          <Card
            rounded={`rounded-lg`}
            shadow={`shadow-lg`}
            padding={`p-7`}
            className={`mb-5`}
          >
            {/* First Row */}
            <div className={`grid gap-16 mb-5 md:grid-cols-3`}>
              <div>
                <Label htmlFor={`transaction_id`}>Transaction Id</Label>
                <Input
                  type={`text`}
                  id={`transaction_id`}
                  placeholder={`Transaction ID`}
                  value={transaction.inHouseDetail?.id}
                  name={`transaction_id`}
                  readonly={state.isReadonly}
                />
              </div>
              <div>
                <Label htmlFor={`product`}>Product</Label>
                <Input
                  type={`text`}
                  id={`product`}
                  placeholder={`Product`}
                  value={`${
                    transaction.inHouseDetail?.productName
                  } - ${currencyFormatter(
                    transaction.inHouseDetail?.productPrice
                  )}`}
                  name={`product`}
                  readonly={state.isReadonly}
                />
              </div>
              <div className={`grid gap-4 md:grid-cols-2`}>
                <div>
                  <Label className={`pb-2`}>Status</Label>
                  <Pill
                    type={transaction.inHouseDetail?.statusValue
                      ?.toLowerCase()
                      .replace(' ', '_')}
                  />
                </div>
                <div></div>
              </div>
            </div>
            {/* Second Row */}
            <div className={`grid gap-16 mb-5 md:grid-cols-3`}>
              <div>
                <Label htmlFor={`corporate_name`}>Name Corporate</Label>
                <Input
                  type={`text`}
                  id={`corporate_name`}
                  placeholder={`Name Corporate`}
                  value={transaction.inHouseDetail?.corporateName}
                  name={`corporate_name`}
                  readonly={state.isReadonly}
                />
              </div>
              <div>
                <Label htmlFor={`discount`}>Diskon</Label>
                <Input
                  type={`text`}
                  id={`discount`}
                  placeholder={`Diskon`}
                  value={transaction.inHouseDetail?.discount + '%'}
                  name={`discount`}
                  readonly={state.isReadonly}
                />
              </div>
            </div>
            {/* Third Row */}
            <div className={`grid gap-16 mb-5 md:grid-cols-3`}>
              <div>
                <Label htmlFor={`total_payment_code`}>Total Payment Code</Label>
                <Input
                  type={`text`}
                  id={`total_payment_code`}
                  placeholder={`Total Payment Code`}
                  value={transaction.inHouseDetail?.qty}
                  name={`total_payment_code`}
                  readonly={state.isReadonly}
                />
              </div>
              <div>
                <Label htmlFor={`service_method`}>Service Method</Label>
                <Input
                  type={`text`}
                  id={`service_method`}
                  placeholder={`Service Method`}
                  value={transaction.inHouseDetail?.serviceMethod}
                  name={`service_method`}
                  readonly={state.isReadonly}
                />
              </div>
            </div>
            {/* Forth Row */}
            <div className={`grid gap-16 mb-5 md:grid-cols-3`}>
              <div>
                <Label htmlFor={`type_service`}>Type Service</Label>
                <Input
                  type={`text`}
                  id={`type_service`}
                  placeholder={`Type Service`}
                  value='In House'
                  name={`type_service`}
                  readonly={state.isReadonly}
                />
              </div>
              <div className='flex gap-6'>
                <div>
                  <Label htmlFor={`startDate`}>Start Date</Label>
                  <Input
                    type={`text`}
                    id={`startDate`}
                    placeholder={`Start Date`}
                    value={ymdToDmy(transaction.inHouseDetail?.startDate)}
                    name={`Start Date`}
                    readonly={state.isReadonly}
                  />
                </div>
                <div>
                  <Label htmlFor={`endDate`}>End Date</Label>
                  <Input
                    type={`text`}
                    id={`endDate`}
                    placeholder={`End Date`}
                    value={ymdToDmy(transaction.inHouseDetail?.endDate)}
                    name={`End Date`}
                    readonly={state.isReadonly}
                  />
                </div>
              </div>
            </div>
          </Card>
          {/* Lower Section Form */}
          <Card
            rounded={`rounded-lg`}
            shadow={`shadow-lg`}
            padding={`p-7`}
            className={`mb-5`}
          >
            <div
              className={`w-full h-full overflow-x-auto space-y-[16px] flex flex-col rounded border border-[#E6E6E6]`}
            >
              <Table headColumns={headColumns}>
                {transaction?.items?.length > 0 ? (
                  transaction.items
                    ?.slice(state.pagination.offset, state.pagination.limit)
                    .map((item, key) => {
                      return (
                        <tr
                          key={key}
                          className={`text-center odd:bg-[#FCFCFC] even:bg-white`}
                        >
                          <td className={`py-6 px-6`}>
                            <Typography>
                              {state.pagination.s < 10
                                ? state.pagination.s
                                : state.pagination.s - 1 > 0
                                ? state.pagination.s *
                                    (state.pagination.p - 1) +
                                  ++key
                                : ++key}
                            </Typography>
                          </td>
                          <td className={`text-left`}>
                            <Typography>{item.paymentCode}</Typography>
                          </td>
                          <td>
                            <Typography>
                              {(item.identityName && item.identityNumber) ||
                              item.issuedDate
                                ? 'Terpakai'
                                : 'Belum Terpakai'}
                            </Typography>
                          </td>
                          <td className={`pr-7`}>
                            <Input
                              className={`${
                                state.isReadonly &&
                                'border-none hover:cursor-default'
                              }`}
                              value={item.identityName}
                              name={item.payment_code}
                              readonly={state.isReadonly}
                              isFixedValue
                            />
                          </td>
                          <td>
                            <Typography>
                              {item.issuedDate &&
                                ymdToDmy(item.issuedDate, '-')}
                            </Typography>
                          </td>
                          {transaction.inHouseDetail?.statusDesc == 'Booked' &&
                            (item.identityName == '' ||
                              item.identityName == null) &&
                            (item.identityNumber == '' ||
                              item.identityNumber == null) &&
                            !item.issuedDate && (
                              <td className={`pr-7`}>
                                {item.status != 'Terpakai' && (
                                  <div className='flex justify-center'>
                                    <Radio
                                      label={'Active'}
                                      id={`type-1-${key}`}
                                      name={`type[${key}]`}
                                      onClick={() => {
                                        item.issuedStatus = 'Active';
                                        dispatch(
                                          setStatus({
                                            transactionItemId: item.id,
                                            status: true
                                          })
                                        ).then(res => {
                                          if (res) {
                                            dispatch(fetchTransactionItems(id));
                                          }
                                        });
                                      }}
                                      checked={item.issuedStatus == 'Active'}
                                      value={'Active'}
                                      className={'mr-4'}
                                    />
                                    <Radio
                                      label={'Inactive'}
                                      id={`type-2-${key}`}
                                      name={`type[${key}]`}
                                      onClick={() => {
                                        item.issuedStatus = 'InActive';
                                        dispatch(
                                          setStatus({
                                            transactionItemId: item.id,
                                            status: false
                                          })
                                        ).then(res => {
                                          if (res) {
                                            dispatch(fetchTransactionItems(id));
                                          }
                                        });
                                      }}
                                      checked={item.issuedStatus == 'InActive'}
                                      value={'Inactive'}
                                    />
                                  </div>
                                )}
                              </td>
                            )}
                        </tr>
                      );
                    })
                ) : (
                  <EmptyTable
                    colSpan={headColumns.length}
                    title={`List In House Items Empty`}
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
                  total={transaction.items ? transaction.items.length : 0}
                  onClick={value => onClickPagination(value)}
                  currentPage={state.pagination.p}
                />
              </div>
            </div>
            <div
              className={`grid gap-y-8 gap-x-16 mt-6 mb-6 grid-cols-1 lg:grid-cols-3`}
            >
              <div>
                <Label htmlFor={'transaction_date'}>Transaction Date</Label>
                <Input
                  type={`text`}
                  id={`transaction_date`}
                  placeholder={`Transaction Date`}
                  name={`transaction_date`}
                  value={ymdToDmy(transaction.inHouseDetail?.transactionDate)}
                  readonly={state.isReadonly}
                />
              </div>
              <span className={`hidden lg:block`}></span>
              <span className={`hidden lg:block`}></span>
              <div>
                <Label htmlFor={'description'}>Description</Label>
                <Input
                  type={`text`}
                  id={`description`}
                  placeholder={`Description`}
                  name={`description`}
                  value={transaction.inHouseDetail?.notes}
                  readonly={state.isReadonly}
                />
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
              <Table headColumns={suppDataHeadColumns}>
                {transaction.documents?.length > 0 &&
                  transaction.documents?.map((item, key) => {
                    return (
                      <tr
                        key={key}
                        className={`text-center odd:bg-[#FCFCFC] even:bg-white`}
                      >
                        <td className={`py-4 w-1/12`}>
                          <Typography>{key + 1}</Typography>
                        </td>
                        <td className={`text-left w-5/12`}>
                          <Typography>{item.fileName}</Typography>
                        </td>
                        <td className={`text-left w-6/12`}>
                          <Typography>{item.notes}</Typography>
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
            <div className={`grid gap-16 mt-14 mb-7 md:grid-cols-3`}>
              <div></div>
              <div>
                {slug === 'edit' && (
                  <Button
                    className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white mr-6`}
                    onClick={() => {
                      setIsOpenSavedConfirmationDialog(true);
                    }}
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
        </form>
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
                setTimeout(() => {
                  router.push('/transaction-payment-code');
                }, 1000);
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
                setTimeout(() => {
                  router.push('/transaction-payment-code');
                }, 1000);
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
          isOpen={isOpenUploadSupportingData}
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
                onClick={() => uploadDocument()}
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
      </MainLayout>
    </>
  );
};

export default WebRegSlug;
