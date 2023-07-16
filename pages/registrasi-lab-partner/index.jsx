import assets from 'public/index';
import {
  Button,
  Card,
  Input,
  LengthChange,
  Pill,
  ReactSelect,
  Select,
  Typography
} from 'components/atoms';
import { LAB_PARTNER_CREATE } from 'components/constants/LapPartner';
import LengthChangeValue from 'components/constants/LengthChange';
import { SORTING_ORDER } from 'components/constants/SortingOrder';
import { EmptyTable, Pagination } from 'components/molecules';
import { MainLayout, Table } from 'components/organisms';
import {
  fetchDataTable,
  fetchLabPartnerDetail
} from 'components/store/actions/labPartner';
import { fetchStatusData } from 'components/store/actions/role';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const RegistrasiLabPartner = props => {
  const router = useRouter();
  const [state, setState] = useState({
    headline: 'List Registrasi Lab Partner',
    breadcrumbs: [
      { link: '/registrasi-lab-partner', name: 'Registrasi Lab Partner' }
    ],
    params: {
      Code: '',
      Name: '',
      Address: '',
      PhoneNumber: '',
      Pic: '',
      StatusData: '',
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
  const { labpartner, role } = selector;

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
      key: 'code',
      name: 'Kode Institusi',
      className: 'text-left',
      sortable: true
    },
    {
      key: 'name',
      name: 'Nama Institusi',
      className: 'text-left',
      sortable: true
    },
    {
      key: 'address',
      name: 'Alamat',
      className: 'text-left',
      sortable: true
    },
    {
      key: 'pic',
      name: 'PIC',
      className: 'text-left',
      sortable: true
    },
    {
      key: 'phone',
      name: 'No Handphone',
      className: 'text-left',
      icon: false
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
      page: 1,
      params: {
        ...state.params,
        p: 1,
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

  const onClickPagination = val => {
    setState({ ...state, page: val, params: { ...state.params, p: val } });
  };

  const navigateToCreate = () => {
    dispatch({ type: LAB_PARTNER_CREATE });
    router.push(`/registrasi-lab-partner/create`);
  };

  const navigateToSlug = value => {
    dispatch(fetchLabPartnerDetail(value.code))
      .then(res => {
        if (res.isSuccess && res.statusCode === 200) {
          router.push(`/registrasi-lab-partner/${value.code}/${value.slug}`);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onClickStatus = () => {
    dispatch(fetchStatusData());
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

  useEffect(() => {
    dispatch(fetchDataTable(state.params));
  }, [state.params, dispatch, state.page, state.itemsPerPage]);

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
          <div className={`flex justify-between pb-6`}>
            <Typography className={`font-medium text-lg`}>
              List Registrasi Lab Partner
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
              options={[
                { value: 'InActive', label: 'InActive' },
                { value: 'Active', label: 'Active' }
              ]}
              defaultValue={
                state.params.StatusData
                  ? {
                      value: state.params.StatusData,
                      label:
                        state.params.StatusData === 'Active'
                          ? 'Active'
                          : 'InActive'
                    }
                  : ''
              }
              onChange={val => {
                setState({
                  ...state,
                  params: {
                    ...state.params,
                    p: 1,
                    StatusData: val?.value ? val?.value : ''
                  }
                });
              }}
            />
            <Input
              prefixIcon={assets.IconSearch}
              className={`w-[20rem]`}
              placeholder={`Search by kode/nama`}
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
              {labpartner.dataTable.items.length > 0 ? (
                labpartner.dataTable.items.map((item, key) => {
                  return (
                    <tr
                      key={key}
                      className={`text-center odd:bg-[#FCFCFC] even:bg-[#FFFFFF]`}
                    >
                      <td className={`px-[8px] py-[5px]`}>
                        <Typography className={`font-normal text-sm`}>
                          {state.itemsPerPage < 10
                            ? state.page
                            : state.page - 1 > 0
                            ? state.itemsPerPage * (state.page - 1) + ++key
                            : ++key}
                        </Typography>
                      </td>
                      <td className={`px-[8px] py-[5px]`}>
                        <div
                          className={`flex h-full justify-center items-center`}
                        >
                          <Button
                            background={`bg-btnBlue`}
                            className={`rounded-md w-8 h-8 flex items-center bg-label-completed-text mx-1 shadow`}
                            paddingHorizontal={''}
                            paddingVertical={''}
                            onClick={() => {
                              navigateToSlug({
                                code: item.code,
                                slug: 'detail'
                              });
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
                            background={`bg-btnBlue`}
                            className={`rounded-md w-8 h-8 flex items-center bg-btnBlue mx-1 shadow`}
                            paddingHorizontal={''}
                            paddingVertical={''}
                            onClick={() => {
                              navigateToSlug({ code: item.code, slug: 'edit' });
                            }}
                          >
                            <Image
                              width={18}
                              height={18}
                              src={assets.IconEditWhite}
                              alt={'Icon detail'}
                            />
                          </Button>
                        </div>
                      </td>
                      <td className={`px-[8px] py-[5px] text-left`}>
                        <Typography className={`font-normal text-sm`}>
                          {item.code}
                        </Typography>
                      </td>
                      <td className={`px-[8px] py-[5px] text-left`}>
                        <Typography className={`font-normal text-sm`}>
                          {item.name}
                        </Typography>
                      </td>
                      <td className={`px-[8px] py-[5px] text-left`}>
                        <Typography className={`font-normal text-sm`}>
                          {item.address}
                        </Typography>
                      </td>
                      <td className={`px-[8px] py-[5px] text-left`}>
                        <Typography className={`font-normal text-sm`}>
                          {item.pic}
                        </Typography>
                      </td>
                      <td className={`px-[8px] py-[5px] text-left`}>
                        <Typography className={`font-normal text-sm`}>
                          {item.phoneNumber}
                        </Typography>
                      </td>
                      <td className={`px-[8px] py-[5px]`}>
                        <div className={`flex justify-center`}>
                          <Pill type={item.statusData} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <EmptyTable
                  colSpan={headColumns.length}
                  title='List Registrasi Lab Partner Empty'
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
                  labpartner.dataTable?.totalFilteredItem > state.params.s
                    ? labpartner.dataTable?.totalItem
                    : labpartner.dataTable?.totalFilteredItem
                    ? labpartner.dataTable?.totalFilteredItem
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

export default RegistrasiLabPartner;
