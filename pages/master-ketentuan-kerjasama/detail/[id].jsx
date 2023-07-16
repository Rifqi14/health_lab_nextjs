import { Button, Modal, Typography, UserDetail } from 'components/atoms';
import { EmptyTable } from 'components/molecules';
import { MainLayout, Table } from 'components/organisms';
import { interceptorResponseErr } from 'components/utils/interceptor';
import { getItemLocalStorage } from 'components/utils/localstorage';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import assets from 'public/index';
import ModalDelete from '../../../components/Modals/ModalDelete';
import { useDispatch } from 'react-redux';
import { deleteCooperationTerm } from 'components/store/actions/cooperationTerm';
import ModalConfirmation from 'components/Modals/ModalConfirmation';

const Detail = () => {
  const router = useRouter();
  const id = router.query.id;
  const dispatch = useDispatch();

  const [cooperationTerms, setCooperationTerms] = useState([]);
  const [listDocument, setListDocument] = useState([]);
  const [showModals, setShowModals] = useState(false);
  const [showSuccessDeleteModal, setShowSuccessDeleteModal] = useState(false);
  const [onDelete, setOnDelete] = useState(false);

  const headColumns = [
    {
      key: 'no',
      name: 'No',
      className: 'w-3 px-4 text-center',
      icon: false
    },
    {
      key: 'file',
      name: 'File',
      className: 'text-left',
      icon: false
    },
    {
      key: 'note',
      name: 'Note',
      className: 'text-left pl-6',
      icon: false
    }
  ];

  const URL = process.env.NEXT_PUBLIC_API_URL;
  const ls = JSON.parse(getItemLocalStorage('AUTH'));

  const getCooperationTermsById = async () => {
    try {
      axios.interceptors.response.use(
        res => res,
        error => interceptorResponseErr(error)
      );
      const res = await axios.get(`${URL}/api/v1/cooperation-terms/${id}`, {
        headers: {
          Authorization: `${ls.scheme} ${ls.token}`
        }
      });
      const dataRes = res.data.payload;
      setCooperationTerms(dataRes);
      setListDocument(dataRes.listDocument);
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleDelete = async () => {
    setOnDelete(true);
    const res = await dispatch(deleteCooperationTerm(id));
    if (res) {
      setShowModals(false);
      setShowSuccessDeleteModal(true);
    }
    setOnDelete(false);
  };

  useEffect(() => {
    getCooperationTermsById();
  }, []);

  return (
    <>
      <Head>
        <title>CMS Bumame</title>
      </Head>

      <MainLayout
        headline={'Master Ketentuan Kerjasama'}
        breadcrumb={[
          {
            link: '/master-ketentuan-kerjasama',
            name: 'List Master Ketentuan Kerjasama'
          },
          {
            link: `/master-ketentuan-kerjasama/detail/${id}`,
            name: 'Detail'
          }
        ]}
      >
        <main className={' bg-white rounded-lg shadow-lg p-7 mb-5'}>
          <div className='mb-[15px] flex justify-between'>
            <Typography className={`font-medium text-lg text-[#212121]`}>
              Cooperation Term Detail
            </Typography>
            <Button
              paddingVertical={`py-2`}
              paddingHorizontal={`px-4`}
              background={`bg-inActive`}
              className={'flex items-center justify-center'}
              onClick={() => setShowModals(true)}
            >
              <Image src={assets.IconTrash} alt='create' />
              <Typography className={`text-white font-normal text-sm pl-2`}>
                Delete
              </Typography>
            </Button>
          </div>
          <div>
            <UserDetail
              title={cooperationTerms.code}
              label={'Kode Ketentuan'}
            />
            <UserDetail
              className='py-6'
              title={cooperationTerms.name}
              label={'Nama Ketentuan Kerjasama'}
            />
            <UserDetail
              title={cooperationTerms.description}
              label={'Deskripsi'}
            />
            <div className='w-[570px] pt-6'>
              <p className='mb-1'>Supporting Data</p>
              <Table headColumns={headColumns}>
                {listDocument.length > 0 ? (
                  listDocument.map((data, index) => (
                    <tr
                      key={index}
                      className={`text-center ${
                        index % 2 != 0 ? 'bg-[#FCFCFC]' : 'bg-[#FFFFFF]'
                      }`}
                    >
                      <td className={`py-[24px] text-center`}>
                        <Typography>{index + 1}</Typography>
                      </td>
                      <td className={`py-[24px] text-start pl-2 w-52`}>
                        <Typography>{data.filename}</Typography>
                      </td>
                      <td className={`py-[24px] text-left pl-6`}>
                        <Typography>
                          {data.notes === 'undefined' || undefined
                            ? '-'
                            : data.notes}
                        </Typography>
                      </td>
                    </tr>
                  ))
                ) : (
                  <EmptyTable colSpan={3} title={`Supporting data empty`} />
                )}
              </Table>
            </div>
          </div>
          <div className='flex justify-center mt-8'>
            <Button
              paddingVertical={`py-2`}
              paddingHorizontal={`px-7`}
              background={`bg-btn-cancel`}
              onClick={() => router.push('/master-ketentuan-kerjasama')}
            >
              <Typography className={`font-normal text-sm`}>Back</Typography>
            </Button>
          </div>
          {/* <Modal
            setIsOpen={(val) => setShowModals(val)}
            width={`w-[27rem]`}
            title={`Success`}
            headless
            isOpen={showModals}>
            <Image alt="" src={assets.IconInfo} />
            <Typography className={`mt-4`}>
              Apakah anda yakin akan menghapus data ini?
            </Typography>
            <div className={`pt-12`}>
              <Button
                onClick={() => setShowModals(false)}
                className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black mr-5`}>
                <Typography>No</Typography>
              </Button>
              <Button
                onClick={() => handleDelete()}
                className={`bg-inActive`}
                disabled={onDelete === true ? true : false}>
                <span
                  className={`font-normal text-sm flex justify-center items-center`}>
                  {onDelete ? (
                    <svg
                      class="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-[#FFF] dark:fill-gray-300"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  ) : null}
                  <p className="text-white">Yes</p>
                </span>
              </Button>
            </div>
          </Modal> */}
          <ModalConfirmation
            show={showModals}
            onHide={() => setShowModals(false)}
            handleYes={() => {
              handleDelete();
            }}
            desc1={'Apakah anda yakin akan menghapus data ini?'}
            isLoading={onDelete}
            confirmDelete={true}
          />
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
                onClick={() => router.push('/master-ketentuan-kerjasama')}
                color={`white`}
                background={`bg-btnBlue`}
              >
                <Typography className={`text-white font-normal text-sm`}>
                  OK
                </Typography>
              </Button>
            </div>
          </Modal>
        </main>
      </MainLayout>
    </>
  );
};

export default Detail;
