/* eslint-disable react-hooks/exhaustive-deps */
import { Radio, Typography } from 'components/atoms';
import { MainLayout } from 'components/organisms';
import CorporateForm from 'components/organisms/MasterCorporate/CorporateForm';
import IndividualForm from 'components/organisms/MasterCorporate/IndividualForm';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getSiteOption } from '../../components/store/actions/corporate';

const Create = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [master_corporate, setMasterCorporate] = useState('');
  const [showModals, setShowModals] = useState();
  const [success, setSuccess] = useState(false);
  const [successModal, setSuccessModal] = useState();
  const [testCorporate, setTestCorporate] = useState('');
  const [siteOption, setSiteOption] = useState([]);

  const [state, setstate] = useState({
    code: '',
    name: '',
    brand: '',
    phoneNumber: '',
    arDueDate: 0,
    email: '',
    taxId: '',
    taxName: '',
    catagories: '',
    totalUser: 0,
    dateOfBirth: '',
    identityType: '',
    identityId: '',
    gender: '',
    citizenship: '',
    address: '',
    province: '',
    district: '',
    city: '',
    subDistrict: '',
    rt: '',
    rw: '',
    domicileAddress: '',
    domicileProvince: '',
    domicileDistrict: '',
    domicileCity: '',
    domicileSubDistinct: '',
    domicileRt: '',
    domicileRw: '',
    sites: [
      {
        siteId: 0,
        siteName: ''
      }
    ],
    pics: [],
    selectType: '',
    isCorporateFormOpen: false,
    isIndividualFormOpen: false,
    fileUploaded: null,
    uploadData: [{ index: 1, file: null, notes: '' }],
    isOpenSupportingData: false,
    isOpenSavedConfirmationDialog: false,
    isOpenUploadSupportingData: false,
    docType: ''
  });

  const onClickRadio = e => {
    setMasterCorporate(e.target.value);
    state.selectType = e.target.value;
    let corporate = state.isCorporateFormOpen;
    let individual = state.isIndividualFormOpen;
    if (state.selectType == '') {
      corporate = false;
      individual = false;
    } else if (e.target.value === 'corporate') {
      corporate = true;
      individual = false;
    } else if (e.target.value == 'individual') {
      corporate = false;
      individual = true;
    } else {
      corporate = false;
      individual = false;
    }
    setstate({
      ...state,
      isIndividualFormOpen: individual,
      isCorporateFormOpen: corporate
    });
  };

  useEffect(() => {
    dispatch(getSiteOption()).then(res => {
      setSiteOption(
        res?.payload.map(item => {
          return {
            ...item,
            value: item.siteId,
            label: item.siteName
          };
        })
      );
    });
  }, []);

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
        pBottom={''}
        headline={'Master Corporate List'}
        breadcrumb={[
          {
            link: '/master-corporate',
            name: 'List Master Corporate'
          },
          {
            link: '/master-corporate',
            name: 'Create'
          }
        ]}
      >
        <main
          className={'flex flex-col bg-white rounded-lg shadow-lg p-7 mb-5'}
        >
          <div className='flex justify-between pb-5'>
            <Typography className={`font-medium text-lg`}>
              Select Type
            </Typography>
          </div>
          <div className='w-full h-full overflow-x-auto space-y-[16px] flex flex-col rounded'>
            <div className='flex'>
              <Radio
                label={'Corporate'}
                id={'type-1'}
                name={'type'}
                onClick={e => {
                  onClickRadio(e);
                }}
                value={'corporate'}
                className={'mr-4'}
              />
              <Radio
                label={'Individual'}
                id={'type-2'}
                name={'type'}
                onClick={e => {
                  onClickRadio(e);
                }}
                value={'individual'}
              />
            </div>
          </div>
        </main>
        <CorporateForm
          isCorporateFormOpen={state.isCorporateFormOpen}
          siteOptions={siteOption}
        />
        <IndividualForm
          isIndividualFormOpen={state.isIndividualFormOpen}
          siteOptions={siteOption}
        />
      </MainLayout>
    </>
  );
};

export default Create;
