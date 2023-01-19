import { Button, Typography, UserDetail } from '@atoms';
import { MainLayout } from '@organisms';
import ModalDelete from 'components/Modals/ModalDelete';
import ModalSucess from 'components/Modals/ModalsSendLink';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const Detail = props => {
  const router = useRouter();
  const { id } = props;
  const [showModals, setShowModals] = useState(false);


  return (
    <>
      <Head>
        <title>Bumame CMS</title>
        <link
          rel='icon'
          href={`${process.env.NEXT_PUBLIC_PREFIX_URL || ''}/favicon.ico`}
        />
      </Head>

      {showModals ? (
        <div className='h-[83rem] w-full bg-gray-50 opacity-95 absolute z-10'></div>
      ) : null}

      <MainLayout
        height={'h-full'}
        pBottom={'pb-16'}
        headline={'Master Corporate List'}
        breadcrumb={[
          {
            link: '/master-corporate',
            name: 'List Master Corporate'
          },
          {
            link: `/master-corporate/edit/${id}`,
            name: 'Detail'
          }
        ]}
      >
        <main className={'flex flex-col bg-white rounded-lg shadow-lg p-7'}>
          <div className='flex flex-grow-1 justify-between'>
            <div className=''>
              <UserDetail
                label='Nama Corporate'
                title='PT. Supra Boga Lestari'
              />
              <UserDetail
                className={'py-2'}
                label='Brand Corporate'
                title='Ranchmarket'
              />
              <UserDetail
                className={'py-2'}
                label='Code Corporate'
                title='CRP001'
              />
              <UserDetail className={'py-2'} label='Type' title='Corporate' />
              <UserDetail
                className={'py-2'}
                label='Adress'
                title='Jl. Setiabudi'
              />
              <UserDetail
                className={'py-2'}
                label='Phone'
                title='021-11223344'
              />
              <UserDetail
                className={'py-2'}
                label='Categories'
                title='Suplier'
              />
              <UserDetail className={'py-2'} label='Total User' title='3000' />
              <UserDetail
                className={'py-2'}
                label='Province'
                title='DI Jakarta'
              />
              <UserDetail
                className={'py-2'}
                label='District'
                title='Kemanggisan'
              />
              <UserDetail
                className={'py-2'}
                label='City'
                title='Jakarta Barat'
              />
              <UserDetail
                className={'py-2'}
                label='Subdistrict'
                title='Jakarta Barat'
              />
              <UserDetail className={'py-2'} label='RT' title='1' />
            </div>
            <div className=''>
              <UserDetail label='RW' title='1' />
              <UserDetail
                className={'py-2'}
                label='Tax ID'
                title='111.222.333.444.'
              />
              <UserDetail className={'py-2'} label='Pic Name 1' title='Ahmad' />
              <UserDetail
                className={'py-2'}
                label='Title Pic 1'
                title='HRD Supervisor'
              />
              <UserDetail
                className={'py-2'}
                label='Contact Pic 1'
                title='+62 81234512464'
              />
              <UserDetail
                className={'py-2'}
                label='Email Pic 1'
                title='andi@ranchmarket.com'
              />
              <UserDetail className={'py-2'} label='Pic Name 2' title='Budi' />
              <UserDetail
                className={'py-2'}
                label='Title Pic 2'
                title='Finance Manager'
              />
              <UserDetail
                className={'py-2'}
                label='Contact Pic 2'
                title='+62 81234512464'
              />
              <UserDetail
                className={'py-2'}
                label='Email Pic 2'
                title='budi@ranchmarket.com'
              />
              <UserDetail className={'py-2'} label='AR Due Days' title='14' />
              <UserDetail
                className={'py-2'}
                label='Assign Site'
                title='TB Simatupang, SCBD'
              />
            </div>
            <div>
              <Button
                paddingVertical={`py-2`}
                paddingHorizontal={`px-7`}
                background={`bg-inActive`}
                onClick={() => setShowModals(true)}
              >
                <Typography className={`text-white font-normal text-sm`}>
                  Delete
                </Typography>
              </Button>
            </div>
          </div>
          <ModalDelete
            show={showModals}
            onHide={() => setShowModals(false)}
            handleButton={() => {
              setShowModals(false);
              router.push(`/master-corporate`);
            }}
            desc='Apakah anda yakin akan menghapus data ini?'
          />
        </main>
      </MainLayout>
    </>
  );
};

export default Detail;
