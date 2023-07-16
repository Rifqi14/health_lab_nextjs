import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { EmptyTable, Pagination, SideBar } from 'components/molecules';
import { MainLayout, Table } from 'components/organisms';
import {
  Button,
  LengthChange,
  Pill,
  Typography,
  Card,
  Label,
  ReactSelect
} from 'components/atoms';
import { fetchCorporateDetail } from 'components/store/actions/corporate';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import assets from 'public';
import axios from 'axios';
import { getItemLocalStorage } from 'components/utils/localstorage';

const MasterCorporate = () => {
  const [userdata, setuserdata] = useState([]);
  const [search, setSearch] = useState('');
  const [state, setState] = useState({
    corporateType: '',
    totalData: '',
    dataPage: 10,
    page: 1
  });
  const [dataPerPage, setDataPerPage] = useState(state.dataPage);
  const dispatch = useDispatch();
  const handleFilterSelect = value => {
    setState({ ...state, corporateType: value });
  };
  const handleSearch = value => {
    setState({ ...state, search: value });
  };
  // const URL = process.env.NEXT_PUBLIC_API_URL;
  // const ls = JSON.parse(getItemLocalStorage('AUTH'));

  const getMasterCorporate = async () => {
    try {
      const res = await axios.get(
        `${URL}/api/v1/corporates/datatable?p=${state.page}&s=${state.dataPage}&CorporateType=${state.corporateType}&q=${search}`,
        {
          headers: {
            Authorization: `${ls.scheme} ${ls.token}`
          }
        }
      );
      setuserdata(res.data.payload.items);
      setState({
        ...state,
        totalData: res.data.payload.totalItem
      });
    } catch (err) {
      return err;
    }
  };

  useEffect(() => {
    getMasterCorporate();
  }, [state.corporateType, search, state.dataPage, state.page]);

  const router = useRouter();

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
      key: 'corporate_name',
      name: 'Nama Corporate',
      icon: false
    },
    {
      key: 'type',
      name: 'Type',
      icon: false
    },
    {
      key: 'address',
      name: 'Address',
      icon: false
    },
    {
      key: 'phone',
      name: 'Phone',
      icon: false
    },
    {
      key: 'docstatus',
      name: 'Document Status',
      icon: false
    },
    {
      key: 'status',
      name: 'Status',
      icon: false
    }
  ];

  const onClickPagination = value => {
    setState({
      ...state,
      page: value
    });
  };

  const onClickCreate = e => {
    e.preventDefault();
    router.push('/master-corporate/create');
  };

  const handleEdit = (id, type) => {
    router.push(`/master-corporate/${id}/${type}/edit`);
  };

  const handleViewDetail = (id, type) => {
    router.push(`/master-corporate/${id}/${type}/detail`);
  };

  return (
    <>
      <Head>
        <title>Health Lab CMS</title>
        <link
          rel='icon'
          href={`${
            process.env.NEXT_PUBLIC_PREFIX_URL || '/housecall'
          }/favicon.ico`}
        />
      </Head>
      <MainLayout
        height={'h-full'}
        headline={'Master Corporate List'}
        breadcrumb={[
          {
            link: '/master-corporate',
            name: 'List Master Corporate'
          }
        ]}
      >
        <Card>
          <div className='flex justify-between pb-7'>
            <Typography className={`font-medium text-lg`}>
              List Master Corporate
            </Typography>
            <Button
              paddingVertical={`py-2`}
              paddingHorizontal={`px-4`}
              background={`bg-btnBlue`}
              className={'flex items-center justify-center'}
              onClick={onClickCreate}
            >
              <Image src={assets.IconPlus} alt='create' />
              <Typography className={`text-white font-normal text-sm pl-2`}>
                Create
              </Typography>
            </Button>
          </div>

          <div className='flex justify-between pb-4'>
            <ReactSelect
              name='corporateType'
              placeholder='Corporate Type'
              options={[
                { value: 'Corporate', label: 'Corporate' },
                { value: 'Individual', label: 'Individual' }
              ]}
              defaultValue={
                state.corporateType
                  ? {
                      value: state.corporateType,
                      label:
                        state.corporateType === 'Corporate'
                          ? 'Corporate'
                          : 'Individual'
                    }
                  : ''
              }
              onChange={val => {
                setState({
                  ...state,
                  corporateType: val?.value ? val?.value : ''
                });
              }}
            />
            <div>
              <div className='border flex rounded-lg items-center px-2'>
                <Image src={assets.IconSearch} alt='search' />
                <input
                  onChange={e => setSearch(e.target.value)}
                  value={search}
                  placeholder='Search by nama/phone'
                  className='bg-white py-2 pl-2 w-64 focus:outline-none'
                  type='search'
                />
              </div>
            </div>
          </div>
          <Table headColumns={headColumns}>
            {userdata.length > 0 ? (
              userdata.map((item, key) => {
                return (
                  <tr
                    key={key}
                    className={`text-center ${
                      key % 2 != 0 ? 'bg-[#FCFCFC]' : 'bg-[#FFFFFF]'
                    }`}
                  >
                    <td className={`px-[8px] py-[5px] `}>
                      <Typography className={`font-normal text-sm`}>
                        {dataPerPage < 10
                          ? state.page
                          : state.page - 1 > 0
                          ? dataPerPage * (state.page - 1) + key
                          : ++key}
                      </Typography>
                    </td>
                    <td className='px-[8px] py-[5px] flex justify-center items-center'>
                      <Button
                        background={`bg-label-completed-text`}
                        className={`rounded-md w-8 h-8 flex items-center bg-label-completed-text-1 mx-1 shadow`}
                        paddingHorizontal={''}
                        paddingVertical={''}
                        onClick={() => {
                          handleViewDetail(
                            item.code,
                            item.corporateType.toLowerCase()
                          );
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
                          handleEdit(
                            item.code,
                            item.corporateType.toLowerCase()
                          );
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
                    <td className={`px-[8px] w-60  py-[5px]`}>
                      <Typography className={`font-normal text-sm`}>
                        {item.name}
                      </Typography>
                    </td>
                    <td className={`px-[8px] py-[5px]`}>
                      <Typography className={`font-normal text-sm`}>
                        {item.corporateType}
                      </Typography>
                    </td>
                    <td className={`px-[8px] py-[5px] `}>
                      <Typography className={`font-normal text-sm`}>
                        {item.address}
                      </Typography>
                    </td>
                    <td className={`px-[8px] py-[5px] `}>
                      <Typography className={`font-normal text-sm`}>
                        {item.phoneNumber}
                      </Typography>
                    </td>
                    <td className={`px-[8px] py-[5px]`}>
                      <Pill type={item.statusDocument} />
                    </td>
                    <td className='px-[8px] py-[5px] flex flex-col items-center'>
                      <Pill type={item.statusData} />
                    </td>
                  </tr>
                );
              })
            ) : (
              <EmptyTable colSpan={7} title='List Master Corporate Empty' />
            )}
          </Table>
          <div className={`py-4 pl-3 flex`}>
            <div className={`flex flex-row items-center`}>
              <Typography>Showing</Typography>
              <select
                value={state.dataPage}
                onChange={e => setState({ ...state, dataPage: e.target.value })}
                className='bg-white mx-2 border border-[#E6E6E6] rounded-md p-1 focus:outline-none'
                name=''
                id=''
              >
                <option value='10'>10</option>
                <option value='15'>15</option>
                <option value='20'>20</option>
                <option value='25'>25</option>
                <option value='50'>50</option>
              </select>
              <Typography>Entries</Typography>
            </div>
            <Pagination
              itemsPerPage={dataPerPage || 10}
              total={state.totalData || 0}
              onClick={value => onClickPagination(value)}
              currentPage={state.page || 1}
            />
          </div>
        </Card>
      </MainLayout>
    </>
  );
};

export default MasterCorporate;
