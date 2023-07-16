import {
  Button,
  Input,
  LengthChange,
  Pill,
  ReactSelect,
  Typography
} from 'components/atoms';
import { CORPORATE_TRX_FETCH_DETAIL } from 'components/constants/CorporateTransaction';
import LengthChangeValue from 'components/constants/LengthChange';
import {
  PAYMENT_CODE_STATUS,
  SERVICE_TYPE
} from 'components/constants/ServiceMethod';
import { SORTING_ORDER } from 'components/constants/SortingOrder';
import {
  TRANSACTION_FETCH_DOCUMENT_LIST,
  TRANSACTION_FETCH_IN_HOUSE_DETAIL,
  TRANSACTION_FETCH_ITEMS
} from 'components/constants/Transaction';
import { EmptyTable, Pagination } from 'components/molecules';
import { MainLayout, Table } from 'components/organisms';
import { currencyFormatter } from 'components/utils/number';
import { fetchCorporateTrxDetail } from 'components/store/actions/corporateTrx/corporateTrx';
import { fetchHouseCallDetail } from 'components/store/actions/housecall';
import { fetchProductSelectList } from 'components/store/actions/product';
import { fetchStatusData } from 'components/store/actions/role';
import { fetchTransactionDataTable } from 'components/store/actions/transaction';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import assets from 'public';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const TransactionPaymentCode = props => {
  const router = useRouter();
  const dispatch = useDispatch();
  const selector = useSelector(state => state);
  const { transaction, product, role } = selector;
  const [productData, setProductData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [state, setState] = useState({
    headline: 'List Transaction Payment Code',
    breadcrumbs: [
      { link: '/transaction-payment-code', name: 'Transaction Payment Code' }
    ],
    params: {
      SortBy: '',
      OrderType: '',
      Status: '',
      StatusLabel: '',
      productId: '',
      productName: '',
      ServiceType: '',
      ServiceTypeLabel: '',
      p: 1,
      s: LengthChangeValue[0],
      q: ''
    },
    page: 1,
    itemsPerPage: LengthChangeValue[0],
    sortCount: 0
  });
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
      key: 'id',
      name: 'Transaction Id',
      className: 'text-left',
      sortable: true
    },
    {
      key: 'corporateName',
      name: 'Name Corporate',
      className: 'text-left',
      sortable: true
    },
    {
      key: 'serviceType',
      name: 'Type Service',
      sortable: true
    },
    {
      key: 'productName',
      name: 'Product',
      sortable: true
    },
    {
      key: 'qty',
      name: 'Total Payment',
      sortable: true
    },
    {
      key: 'qty',
      name: 'Total Payment Code Terpakai',
      sortable: true
    },
    {
      key: 'status',
      name: 'Status',
      icon: false
    }
  ];

  const sortableHeader = (accessor, column) => {
    state.sortCount = state.sortCount + 1 > 2 ? 0 : state.sortCount + 1;
    const sortDir = SORTING_ORDER[state.sortCount];
    setState({
      ...state,
      params: {
        ...state.params,
        SortBy: column.key,
        OrderType: SORTING_ORDER[state.sortCount]
      }
    });
  };

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

  const onChangeSearch = e => {
    if (e.target.value.length >= 3) {
      setState({
        ...state,
        params: {
          ...state.params,
          q: e.target.value
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

  const onClickCreate = e => {
    e.preventDefault();
    router.push('/transaction-payment-code/create');
  };

  const navigateToDetail = value => {
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
    const slug =
      value.serviceType.toLowerCase().replace(' ', '-') === 'housecall' ||
      value.serviceType.toLowerCase().replace(' ', '-') === 'individual'
        ? 'house-call'
        : 'in-house';
    if (slug === 'house-call') {
      dispatch(fetchHouseCallDetail(value.id)).then(res => {
        if (res.isSuccess && res.statusCode === 200) {
          router.push(`/transaction-payment-code/${value.id}/${slug}/detail`);
        }
      });
    }
    if (slug === 'in-house') {
      dispatch(fetchCorporateTrxDetail(value.id)).then(res => {
        if (res.isSuccess && res.statusCode === 200) {
          router.push(`/transaction-payment-code/${value.id}/${slug}/detail`);
        }
      });
    }
  };

  const navigateToEdit = value => {
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
    const slug =
      value.serviceType.toLowerCase().replace(' ', '-') === 'housecall' ||
      value.serviceType.toLowerCase().replace(' ', '-') === 'individual'
        ? 'house-call'
        : 'in-house';

    if (slug === 'house-call') {
      dispatch(fetchHouseCallDetail(value.id)).then(res => {
        if (res.isSuccess && res.statusCode === 200) {
          router.push(`/transaction-payment-code/${value.id}/${slug}/edit`);
        }
      });
    }
    if (slug === 'in-house') {
      dispatch(fetchCorporateTrxDetail(value.id)).then(res => {
        if (res.isSuccess && res.statusCode === 200) {
          router.push(`/transaction-payment-code/${value.id}/${slug}/edit`);
        }
      });
    }
  };

  useEffect(() => {
    dispatch(fetchTransactionDataTable(state.params));
    if (product.selectList.length <= 0) {
      dispatch(fetchProductSelectList());
    } else {
      setProductData(
        product.selectList.map(item => {
          return {
            ...item,
            value: item.productId,
            label: item.productName
          };
        })
      );
    }
    dispatch(fetchStatusData());
    setStatusData(
      role.extension.map(item => {
        return {
          ...item,
          value: item.statusData,
          label: item.statusData
        };
      })
    );
  }, [state.params, dispatch]);

  return (
    <>
      <Head>
        <title>Bumame CMS</title>
        <link
          rel='icon'
          href={`${process.env.NEXT_PUBLIC_PREFIX_URL || ''}/favicon.ico`}
        />
      </Head>
      <MainLayout
        headline={'Transaction Payment Code'}
        breadcrumb={[
          {
            link: '/transaction-payment-code',
            name: 'List Transaction Payment Code'
          }
        ]}
      >
        <main className={'flex flex-col bg-white rounded-lg shadow-lg p-7'}>
          <div className='flex justify-between pb-6'>
            <Typography className={`font-medium text-lg`}>
              List Transaction Payment Code
            </Typography>
            <Button
              paddingVertical={`py-2`}
              paddingHorizontal={`px-5`}
              background={`bg-btnBlue`}
              className={`flex justify-between items-center`}
              onClick={onClickCreate}
            >
              <Image src={assets.IconPlus} alt={`Create button`} />
              <Typography className={`text-white pl-1 font-normal text-sm`}>
                Create
              </Typography>
            </Button>
          </div>
          <div className='flex justify-between pb-5'>
            <div className={`flex flex-col gap-3 lg:flex-row pr-32`}>
              <ReactSelect
                name={`filterProduct`}
                placeholder={`Choose a product...`}
                options={productData}
                defaultValue={
                  state.params.productId
                    ? {
                        value: state.params.productId,
                        label: state.params.productName
                      }
                    : ''
                }
                onChange={val => {
                  setState({
                    ...state,
                    params: {
                      ...state.params,
                      p: 1,
                      productId: val?.value ? val?.value : '',
                      productName: val?.label ? val?.label : ''
                    }
                  });
                }}
              />
              <ReactSelect
                name={`filterTypeService`}
                placeholder={`Choose a service...`}
                options={SERVICE_TYPE}
                defaultValue={
                  state.params.ServiceType
                    ? {
                        value: state.params.ServiceType,
                        label: state.params.ServiceTypeLabel
                      }
                    : ''
                }
                onChange={val => {
                  setState({
                    ...state,
                    params: {
                      ...state.params,
                      p: 1,
                      ServiceType: val?.value ? val?.value : '',
                      ServiceTypeLabel: val?.label ? val?.label : ''
                    }
                  });
                }}
              />
              <ReactSelect
                name={`filterStatus`}
                placeholder={`Choose a status...`}
                options={PAYMENT_CODE_STATUS}
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
            </div>
            <div>
              <Input
                prefixIcon={assets.IconSearch}
                className={`w-[20rem]`}
                type={`search`}
                onChange={onChangeSearch}
                placeholder={`Search by kode/nama`}
              />
            </div>
          </div>
          <div className='w-full h-full overflow-x-auto space-y-[16px] flex flex-col rounded border border-[#E6E6E6]'>
            <Table
              headColumns={headColumns}
              sortableHeader={sortableHeader}
              sortDirection={state.params.OrderType}
              sortColumn={state.params.SortBy}
            >
              {transaction.dataTable.items.length > 0 ? (
                transaction.dataTable.items.map((item, key) => {
                  return (
                    <tr
                      key={key}
                      className={`text-center odd:bg-[#FCFCFC] even:bg-[#FFFFFF]`}
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
                      <td className={`px-[8px] py-[2px] flex justify-center`}>
                        <Button
                          background={`bg-btnBlue`}
                          className={`rounded-md w-8 h-8 flex items-center bg-label-completed-text mx-1 shadow`}
                          paddingHorizontal={''}
                          paddingVertical={''}
                          onClick={() => {
                            navigateToDetail(item);
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
                          className={`rounded-md w-8 h-8 flex items-center bg-btnBlue mx-1 shadow disabled:bg-[#D8DFE5]`}
                          paddingHorizontal={''}
                          paddingVertical={''}
                          disabled={
                            item.status.toLowerCase().replace(' ', '_') !=
                              'booked' ||
                            (item.serviceType != 'HouseCall' &&
                              item.serviceType != 'Individual')
                          }
                          onClick={() => {
                            navigateToEdit(item);
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
                          {item.corporateName} {' - '} {item.serviceType}
                        </Typography>
                      </td>
                      <td className={`px-[8px] py-[2px] `}>
                        <Typography className={`font-normal text-sm`}>
                          {item.serviceType === 'HouseCall' ||
                          item.serviceType === 'Individual'
                            ? 'House Call'
                            : 'In House'}
                        </Typography>
                      </td>
                      <td className={`px-[8px] py-[2px] `}>
                        <Typography className={`font-normal text-sm`}>
                          {item.productName} {' - '}{' '}
                          {currencyFormatter(item.productPrice)}
                        </Typography>
                      </td>
                      <td className={`px-[8px] py-[2px] `}>
                        <Typography className={`font-normal text-sm`}>
                          {item.qty}
                        </Typography>
                      </td>
                      <td className={`px-[8px] py-[2px] `}>
                        <Typography className={`font-normal text-sm`}>
                          {item.qtyRemaining}
                        </Typography>
                      </td>
                      <td className={`px-[8px] py-[2px] flex justify-center`}>
                        <Pill
                          type={(item.status || '')
                            .toLowerCase()
                            .replace(' ', '_')}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <EmptyTable
                  colSpan={headColumns.length}
                  title={`List Transaction Payment Code empty`}
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
                itemsPerPage={state.params.s || 10}
                total={
                  transaction.dataTable?.totalFilteredItem
                    ? transaction.dataTable?.totalFilteredItem
                    : 0
                }
                onClick={value => onClickPagination(value)}
                currentPage={state.params.p}
              />
            </div>
          </div>
        </main>
      </MainLayout>
    </>
  );
};

export default TransactionPaymentCode;
