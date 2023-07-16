import assets from 'public/index';
import {
  Button,
  Card,
  Input,
  LengthChange,
  ReactSelect,
  Select,
  Typography
} from 'components/atoms';
import LengthChangeValue from 'components/constants/LengthChange';
import { ROLE_CREATE } from 'components/constants/Role';
import { SORTING_ORDER } from 'components/constants/SortingOrder';
import { EmptyTable, Pagination } from 'components/molecules';
import { MainLayout, Table } from 'components/organisms';
import {
  fetchDataTable,
  fetchRoleDetail,
  fetchRoleTypes,
  fetchStatusData
} from 'components/store/actions/role';
import { fetchSidebar } from 'components/store/actions/sidebar';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const RoleManagement = props => {
  const router = useRouter();
  const [state, setState] = useState({
    headline: 'List Role Management',
    breadcrumbs: [{ link: '/role-management', name: 'List Role Management' }],
    params: {
      RoleName: '',
      RoleType: '',
      StatusData: '',
      RoleDescription: '',
      SortBy: '',
      OrderType: '',
      p: 1,
      s: LengthChangeValue[0],
      q: ''
    },
    page: 1,
    itemsPerPage: LengthChangeValue[0],
    sortCount: 0,
    roleTypeList: []
  });
  const dispatch = useDispatch();
  const selector = useSelector(state => state);
  const { role, sidebar } = selector;

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
      key: 'roleName',
      name: 'Nama Role',
      className: 'text-left',
      sortable: true
    },
    {
      key: 'roleType',
      name: 'Type Role',
      className: 'text-left',
      sortable: true
    },
    {
      key: 'permission',
      name: 'Hak Akses',
      className: 'text-left',
      icon: false
    }
  ];

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

  const onClickPagination = val => {
    setState({ ...state, page: val, params: { ...state.params, p: val } });
  };

  const navigateToCreate = () => {
    dispatch({ type: ROLE_CREATE });
    router.push(`/role-management/create`);
  };

  const navigateToSlug = value => {
    dispatch(fetchRoleDetail(value.code)).then(res => {
      if (res.isSuccess && res.statusCode === 200) {
        router.push(`/role-management/${value.code}/${value.slug}`);
      }
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
      setState({
        ...state,
        params: {
          ...state.params,
          RoleName: e.target.value,
          q: e.target.value
        }
      });
    } else {
      setState({
        ...state,
        params: {
          ...state.params,
          RoleName: '',
          q: ''
        }
      });
    }
  };

  useEffect(() => {
    dispatch(fetchDataTable(state.params));
    dispatch(fetchRoleTypes());
    setState({
      ...state,
      roleTypeList: role.selectListRoleType.map(item => {
        return { value: item.roleType, label: item.roleTypeDescription };
      })
    });

    dispatch(fetchSidebar());
  }, [state.params, dispatch]);

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
              List Role Management
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
              name='Role Type'
              placeholder='Select Role Type'
              options={state.roleTypeList}
              onChange={e => {
                setState({
                  ...state,
                  params: {
                    ...state.params,
                    p: 1,
                    RoleType: e?.value ? e.value : ''
                  }
                });
              }}
              defaultValue={
                state.params.RoleType
                  ? {
                      value: state.params.RoleType,
                      label: state.params.RoleType
                    }
                  : ''
              }
            />
            <Input
              prefixIcon={assets.IconSearch}
              className={`w-[20rem]`}
              placeholder={`Search`}
              onChange={onChangeSearch}
              type={`search`}
            />
          </div>
          <div className='w-full h-full overflow-x-auto space-y-[16px] flex flex-col rounded border border-[#E6E6E6]'>
            <Table
              headColumns={headColumns}
              sortableHeader={sortableHeader}
              sortDirection={state.params.OrderType}
              sortColumn={state.params.SortBy}
            >
              {role.dataTable.items.length > 0 ? (
                role.dataTable.items.map((item, key) => {
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
                            ? state.itemsPerPage * (state.page - 1) + key + 1
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
                                code: item.roleCode,
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
                              navigateToSlug({
                                code: item.roleCode,
                                slug: 'edit'
                              });
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
                          {item.roleName}
                        </Typography>
                      </td>
                      <td className={`px-[8px] py-[5px] text-left`}>
                        <Typography className={`font-normal text-sm`}>
                          {item.roleType}
                        </Typography>
                      </td>
                      <td className={`px-[8px] py-[5px] text-left`}>
                        {sidebar.modules.length === item.roleModules.length ? (
                          <Typography className={`font-normal text-sm`}>
                            All
                          </Typography>
                        ) : (
                          <ul className='space-y-1 max-w-md list-disc list-inside'>
                            {item.roleModules.map((item, key) => {
                              return (
                                <li key={key}>
                                  <Typography className={`font-normal text-sm`}>
                                    {item}
                                  </Typography>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <EmptyTable
                  colSpan={headColumns.length}
                  title={`${state.headline} empty`}
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
                total={role.dataTable.totalItem || 0}
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

export default RoleManagement;
