import assets from 'public/index';
import {
  Button,
  Card,
  Input,
  LengthChange,
  Pill,
  ReactSelect,
  Typography
} from 'components/atoms';
import LengthChangeValue from 'components/constants/LengthChange';
import { LAB_PARTNER_STATUS } from 'components/constants/ServiceMethod';
import { SORTING_ORDER } from 'components/constants/SortingOrder';
import { EmptyTable, Pagination } from 'components/molecules';
import { MainLayout, Table } from 'components/organisms';
import { ymdToDmy } from 'components/utils/datetime';
import {
  fetchLabTransactionDataTable,
  fetchLabTransactionDetail
} from 'components/store/actions/labtransaction';
import { fetchStatusData } from 'components/store/actions/role';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const LabPartnerTransaction = props => {
  const router = useRouter();
  const [state, setState] = useState({
    headline: 'List Lab Partner Transaction',
    breadcrumbs: [
      {
        link: '/lab-partner-transaction',
        name: 'List Lab Partner Transaction'
      }
    ],
    initialTable: [
      {
        no: 1,
        id: 1,
        partnerName: 'Radya Digital',
        totalPatient: 5,
        transactionDate: '22/09/2022',
        status: 'collected'
      },
      {
        no: 2,
        id: 2,
        partnerName: 'Alkademi',
        totalPatient: 5,
        transactionDate: '22/09/2022',
        status: 'completed'
      },
      {
        no: 3,
        id: 3,
        partnerName: 'Tosanarka',
        totalPatient: 5,
        transactionDate: '22/09/2022',
        status: 'completed'
      },
      {
        no: 4,
        id: 4,
        partnerName: 'Radya Labs',
        totalPatient: 5,
        transactionDate: '22/09/2022',
        status: 'completed'
      },
      {
        no: 5,
        id: 5,
        partnerName: 'Radya Labs',
        totalPatient: 5,
        transactionDate: '22/09/2022',
        status: 'completed'
      }
    ],
    params: {
      Status: '',
      StatusLabel: '',
      SortBy: '',
      OrderType: '',
      p: 1,
      s: LengthChangeValue[0],
      q: ''
    },
    page: 1,
    itemsPerPage: LengthChangeValue[0],
    sortCount: 0
  });
  const dispatch = useDispatch();
  const selector = useSelector(state => state);
  const { role, labtransaction } = selector;

  const headColumns = [
    {
      key: 'no',
      name: 'No',
      className: 'w-3',
      icon: false
    },
    {
      key: 'action',
      name: 'Action',
      className: 'w-3',
      icon: false
    },
    {
      key: 'labPartnerId',
      name: 'Transaction Id',
      className: 'text-left',
      sortable: true
    },
    {
      key: 'labPartnerName',
      name: 'Nama Partner',
      className: 'text-left',
      sortable: true
    },
    {
      key: 'qty',
      name: 'Total Pasien',
      className: 'text-left',
      sortable: true
    },
    {
      key: 'transactionDate',
      name: 'Tanggal Transaksi',
      sortable: true
    },
    {
      key: 'status',
      name: 'Status',
      icon: false
    }
  ];

  const onChangeLength = val => {
    setState({
      ...state,
      itemsPerPage: val,
      params: {
        ...state.params,
        s: val
      }
    });
  };

  const sortableHeader = (accessor, column) => {
    state.sortCount = state.sortCount + 1 > 2 ? 0 : state.sortCount + 1;
    setState({
      ...state,
      params: {
        ...state.params,
        SortBy: column.key,
        OrderType: SORTING_ORDER[state.sortCount]
      }
    });
  };

  const onChangeStatus = e => {
    setState({
      ...state,
      params: {
        ...state.params,
        StatusData: e.target.value
      }
    });
  };

  const onChangeSearch = e => {
    if (e.target.value.length >= 3) {
      const search = e.target.value;
      setState({
        ...state,
        params: {
          ...state.params,
          q: search
        }
      });
    } else {
      setState({
        ...state,
        params: {
          ...state.params,
          q: ''
        }
      });
    }
  };

  const onClickPagination = val => {
    setState({ ...state, page: val, params: { ...state.params, p: val } });
  };

  const navigateToCreate = () => {
    router.push(`/lab-partner-transaction/create`);
  };

  const navigateToSlug = value => {
    dispatch(fetchLabTransactionDetail(value.id))
      .then(res => {
        if (res.isSuccess && res.statusCode === 200) {
          setTimeout(() => {
            router.push(`/lab-partner-transaction/${value.id}/${value.slug}`);
          }, 2000);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    dispatch(fetchLabTransactionDataTable(state.params));
  }, [state.params, dispatch, state.page, state.itemsPerPage]);

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
          <div className={`flex justify-between pb-6`}>
            <Typography className={`font-medium text-lg`}>
              List Lab Partner Transaction
            </Typography>
            <Button
              paddingVertical={`py-2`}
              paddingHorizontal={`px-5`}
              background={`bg-btnBlue`}
              className={`flex justify-between items-center`}
              onClick={navigateToCreate}
            >
              <Image src={assets.IconPlus} alt={`Create button`} />
              <Typography className={`text-white pl-1 font-normal text-sm`}>
                Create
              </Typography>
            </Button>
          </div>
          <div className={`flex justify-between items-center pb-5`}>
            <ReactSelect
              name={`filterStatus`}
              placeholder={`Choose a status...`}
              options={LAB_PARTNER_STATUS}
              defaultValue={
                state.params.Status
                  ? {
                      value: state.params.Status,
                      label: state.params.StatusLabel
                    }
                  : ''
              }
              onChange={val => {
                setState({
                  ...state,
                  params: {
                    ...state.params,
                    p: 1,
                    Status: val?.value ? val?.value : '',
                    StatusLabel: val?.label ? val?.label : ''
                  }
                });
              }}
            />
            <Input
              prefixIcon={assets.IconSearch}
              className={`w-[20rem]`}
              placeholder={`Search`}
              onChange={e => onChangeSearch(e)}
            />
          </div>
          <div className='w-full h-full overflow-x-auto space-y-[16px] flex flex-col rounded border border-[#E6E6E6]'>
            <Table
              headColumns={headColumns}
              sortableHeader={sortableHeader}
              sortDirection={state.params.OrderType}
              sortColumn={state.params.SortBy}
            >
              {labtransaction.dataTable.items.length > 0 ? (
                labtransaction.dataTable.items.map((item, key) => {
                  return (
                    <tr
                      key={key}
                      className={`text-center odd:bg-[#FCFCFC] even:bg-[#FFFFFF] `}
                    >
                      <td className={`px-[8px] py-[2px] `}>
                        <Typography className={`font-normal text-sm`}>
                          {state.itemsPerPage < 10
                            ? state.page
                            : state.page - 1 > 0
                            ? state.itemsPerPage * (state.page - 1) + ++key
                            : ++key}
                        </Typography>
                      </td>
                      <td className={`px-[8px] py-[10px] flex justify-center`}>
                        <Button
                          background={`bg-btnBlue`}
                          className={`rounded-md w-8 h-8 flex items-center bg-label-completed-text mx-1 shadow`}
                          paddingHorizontal={''}
                          paddingVertical={''}
                          onClick={() => {
                            navigateToSlug({ id: item.id, slug: 'detail' });
                          }}
                        >
                          <Image
                            width={18}
                            height={18}
                            src={assets.IconEyeOpenWhite}
                            alt={'Icon detail'}
                          />
                        </Button>
                        <Button
                          background='bg-btnBlue'
                          className='rounded-md w-8 h-8 flex items-center disabled:bg-disabled-btn bg-btnBlue mx-1 shadow'
                          paddingHorizontal={''}
                          paddingVertical={''}
                          disabled={item.status.toLowerCase() !== 'completed'}
                          onClick={() => {
                            navigateToSlug({ id: item.id, slug: 'edit' });
                          }}
                        >
                          <Image
                            width={18}
                            height={18}
                            src={assets.IconEditWhite}
                            alt={'Icon detail'}
                          />
                        </Button>
                      </td>
                      <td className={`px-[8px] py-[2px] text-left`}>
                        <Typography className={`font-normal text-sm`}>
                          {item.id}
                        </Typography>
                      </td>
                      <td className={`px-[8px] py-[2px] text-left`}>
                        <Typography className={`font-normal text-sm`}>
                          {item.labPartnerName}
                        </Typography>
                      </td>
                      <td className={`px-[8px] py-[2px] text-left`}>
                        <Typography className={`font-normal text-sm`}>
                          {item.qty}
                        </Typography>
                      </td>
                      <td className={`px-[8px] py-[2px]`}>
                        <Typography className={`font-normal text-sm`}>
                          {ymdToDmy(item.transactionDate)}
                        </Typography>
                      </td>
                      <td className={`px-[8px] py-[2px] flex justify-center`}>
                        <Pill type={item.status.toLowerCase()} />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <EmptyTable
                  colSpan={headColumns.length}
                  title={`List Lab Partner Transaction Empty`}
                />
              )}
              <tr></tr>
            </Table>
            <div className={`py-4 pl-3 flex`}>
              <div className={`flex flex-row items-center`}>
                <Typography>Showing</Typography>
                <LengthChange length={onChangeLength} />
                <Typography>Entries</Typography>
              </div>
              <Pagination
                itemsPerPage={state.itemsPerPage || 10}
                total={
                  labtransaction.dataTable?.totalFilteredItem > state.params.s
                    ? labtransaction.dataTable?.totalItem
                    : labtransaction.dataTable?.totalFilteredItem
                    ? labtransaction.dataTable?.totalFilteredItem
                    : 0
                }
                onClick={value => onClickPagination(value)}
                currentPage={state.page || 1}
              />
            </div>
          </div>
        </Card>
      </MainLayout>
    </>
  );
};

export default LabPartnerTransaction;
