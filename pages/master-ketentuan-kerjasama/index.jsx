import {
  Button,
  Card,
  Typography,
  Input,
  Select,
  Pill,
  ReactSelect
} from 'components/atoms';
import { MainLayout, Table } from 'components/organisms';
import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import assets from 'public/index';
import { EmptyTable, Pagination } from 'components/molecules';
import axios from 'axios';
import { getItemLocalStorage } from 'components/utils/localstorage';
import { interceptorResponseErr } from 'components/utils/interceptor';
import { useDispatch } from 'react-redux';

const MasterKetentuanKerjasama = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [state, setState] = useState({
    headline: 'List Master ketentuan kerjasama',
    breadcrumbs: [
      {
        link: '/master-ketentuan-kerjasama',
        name: 'List Master ketentuan kerjasama'
      }
    ]
  });
  const [cooperationTermsList, setCooperationTermsList] = useState('');
  const [status, setStatus] = useState('');
  const [dataPage, setDataPage] = useState(10);
  const [dataPerPage] = useState(dataPage);
  const [totalData, setTotalData] = useState();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectOption, setSelectOption] = useState([
    {
      value: 'Active',
      label: 'Active'
    },
    {
      value: 'InActive',
      label: 'InActive'
    }
  ]);

  const navigateToCreate = () => {
    router.push(`/master-ketentuan-kerjasama/create`);
  };

  const headColumns = [
    {
      key: 'no',
      name: 'No',
      className: 'w-3 text-center',
      icon: false
    },
    {
      key: 'action',
      name: 'Action',
      className: 'w-3 text-center',
      icon: false
    },
    {
      key: 'kode_ketentuan',
      name: 'Kode Ketentuan',
      className: 'text-left',
      sortable: true
    },
    {
      key: 'nama_ketentuan_kerjasama',
      name: 'Nama Ketentuan Kerjasama',
      className: 'text-left',
      sortable: true
    },
    {
      key: 'deskripsi',
      name: 'Deskripsi',
      className: 'text-left',
      icon: false
    },
    {
      key: 'status',
      name: 'Status',
      icon: false
    }
  ];

  const handleViewDetail = id => {
    router.push(`/master-ketentuan-kerjasama/detail/${id}`);
  };

  const handleEdit = id => {
    router.push(`/master-ketentuan-kerjasama/edit/${id}`);
  };

  const onClickPagination = value => {
    // props.pagination(value);
    setPage(value);
  };

  // const ls = JSON.parse(getItemLocalStorage('AUTH'));
  // const URL = process.env.NEXT_PUBLIC_API_URL

  const URL = process.env.NEXT_PUBLIC_API_URL;

  const getCooperationTerms = async () => {
    try {
      axios.interceptors.response.use(
        res => res,
        error => interceptorResponseErr(error)
      );
      const res = await axios.get(
        `${URL}/api/v1/cooperation-terms/datatable?StatusData=${status}&q=${search}&p=${page}&s=${dataPage}`,
        {
          headers: {
            Authorization: `${ls.scheme} ${ls.token}`
          }
        }
      );
      const dataRes = res.data.payload;
      setCooperationTermsList(dataRes.items);
      setTotalData(dataRes.totalItem);
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  useEffect(() => {
    getCooperationTerms();
  }, [status, dataPage, page, search]);

  return (
    <>
      <Head>
        <title>Health Lab CMS</title>
        <link
          rel='icon'
          href={`${process.env.NEXT_PUBLIC_PREFIX_URL || ''}/favicon.ico`}
        />
      </Head>
      <MainLayout
        p-bottom={'pb-52'}
        headline={state.headline}
        breadcrumbs={state.breadcrumbs}
      >
        <Card>
          <div className={`flex justify-between pb-6`}>
            <Typography className={`font-medium text-lg`}>
              List Master ketentuan kerjasama
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
          <div
            className={`flex justify-between items-center pb-5 bg-transparent`}
          >
            {/* <ReactSelect 
              placeholder={`Corporate Type`}
              defaultValue={``}
              options={selectOption}
              onChange={(e) => setStatus(e.target.value)}
            /> */}
            <select
              className='p-2 w-60 focus:outline-none rounded bg-white border active:outline-none'
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option value={``}>Select Status</option>
              <option value='Active'>Active</option>
              <option value='InActive'>InActive</option>
            </select>
            <div className=''>
              <div className='border rounded-lg flex items-center px-2'>
                <Image src={assets.IconSearch} alt='search' />
                <input
                  onChange={e => setSearch(e.target.value)}
                  value={search}
                  placeholder='Search by kode/nama/deskripsi'
                  className='bg-white py-2 w-64 pl-2 focus:outline-none'
                  type='search'
                />
              </div>
            </div>
          </div>
          <Table headColumns={headColumns}>
            {cooperationTermsList.length > 0 ? (
              cooperationTermsList.map((item, key) => {
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
                          ? page
                          : page - 1 > 0
                          ? dataPerPage * (page - 1) + ++key
                          : ++key}
                      </Typography>
                    </td>
                    <td className={`px-[8px] py-[5px] flex justify-center`}>
                      <Button
                        background={`bg-label-completed-text`}
                        className={`rounded-md w-8 h-8 flex items-center bg-label-completed-text-1 mx-1 shadow`}
                        paddingHorizontal={''}
                        paddingVertical={''}
                        onClick={() => {
                          handleViewDetail(item.code);
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
                        onClick={() => handleEdit(item.code)}
                      >
                        <Image
                          width={18}
                          height={18}
                          src={assets.IconEditWhite}
                          alt={'Icon detail'}
                        />
                      </Button>
                    </td>
                    <td className={`w-44 py-[5px] text-left pl-2`}>
                      <Typography className={`font-normal text-sm`}>
                        {item.code}
                      </Typography>
                    </td>
                    <td className={`py-[5px] pl-2 w-60 text-left`}>
                      <Typography className={`font-normal text-sm`}>
                        {item.name}
                      </Typography>
                    </td>
                    <td className={`py-[5px] pl-2 text-start`}>
                      <Typography className={`font-normal text-sm`}>
                        {item.description}
                      </Typography>
                    </td>
                    <td className={`py-[5px] flex justify-center`}>
                      <Pill type={item.statusData} />
                    </td>
                  </tr>
                );
              })
            ) : (
              <EmptyTable
                colSpan={7}
                title='List Master Ketentuan Kerjasama Empty'
              />
            )}
          </Table>
          <div className='py-4 pl-3 flex'>
            <div className='flex items-center'>
              <Typography>Showing</Typography>
              <select
                value={dataPage}
                onChange={e => setDataPage(e.target.value)}
                name=''
                id=''
                className='bg-white mx-2 border border-[#E6E6E6] rounded-md p-1 focus:outline-none'
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
              total={totalData || 0}
              onClick={value => onClickPagination(value)}
              currentPage={page || 1}
            />
          </div>
        </Card>
      </MainLayout>
    </>
  );
};

export default MasterKetentuanKerjasama;
