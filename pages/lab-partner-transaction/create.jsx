import assets from 'public/index';
import {
  Button,
  Card,
  DateInput,
  Input,
  Label,
  Modal,
  ReactSelect,
  Select,
  Textarea,
  Typography
} from 'components/atoms';
import Messages from 'components/constants/PopUpMessage';
import { EmptyTable } from 'components/molecules';
import { MainLayout, Table } from 'components/organisms';
import { ymdToDmy } from 'components/utils/datetime';
import { currencyFormatter } from 'components/utils/number';
import { fetchCooperationTermSelectList } from 'components/store/actions/cooperationTerm';
import { fetchCorporateSelectList } from 'components/store/actions/corporate';
import {
  fetchDataTable,
  fetchLabSelectList
} from 'components/store/actions/labPartner';
import {
  createLabTransaction,
  fetchLabPartnerSelectList
} from 'components/store/actions/labtransaction';
import { fetchCheckSampleCode } from 'components/store/actions/labresult';
import { fetchProductTierSelectList } from 'components/store/actions/product';
import { fetchTierSelectList } from 'components/store/actions/tier';
import { fetchBranchSelectList } from 'components/store/actions/branchs';
import { Field, FieldArray, Form, Formik, yupToFormErrors } from 'formik';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import {
  sampleCodeValidationSpesialChar,
  sampleCodeValidationSpace
} from 'components/constants/SamplecodeValidation';

const CreateLabPartnerTransaction = props => {
  const router = useRouter();
  const dispatch = useDispatch();
  const selector = useSelector(state => state);
  const { tier, product, labpartner } = selector;
  const [onSubmitData, setOnSubmitData] = useState(false);
  const [state, setState] = useState({
    headline: 'Lab Partner Transaction',
    breadcrumbs: [
      {
        link: '/lab-partner-transaction',
        name: 'List Lab Partner Transaction'
      },
      {
        link: '/lab-partner-transaction/create',
        name: 'Create'
      }
    ],
    tableData: [],
    formInitialValue: {
      labPartnerCode: '',
      tierId: 0,
      tierName: '',
      serviceMethod: '',
      serviceGroup: '',
      salesRepresentatif: '',
      transactionDate: new Date().toISOString(),
      siteCode: '',
      items: [
        {
          identityName: '',
          identityNumber: '',
          phoneNumber: '',
          idType: '',
          address: '',
          gender: '',
          nationality: '',
          birtOfDate: new Date().toISOString(),
          product: null,
          productId: 0,
          productName: '',
          productPrice: 0,
          serviceGroup: 'LAB PARTNER',
          sampleCode: '',
          productType: 'Covid',
          cekSampleCodeExist: false
        }
      ]
    },
    formPostInitialValue: {
      labPartnerCode: '',
      tierId: 0,
      tierName: '',
      serviceMethod: '',
      serviceGroup: '',
      salesRepresentatif: '',
      transactionDate: null,
      siteCode: '',
      items: [
        {
          identityName: '',
          identityNumber: '',
          phoneNumber: '',
          idType: '',
          address: '',
          gender: '',
          nationality: '',
          birtOfDate: '',
          productId: 0,
          productName: '',
          productPrice: 0,
          serviceGroup: 'LAB PARTNER',
          sampleCode: '',
          productType: 'Covid'
        }
      ]
    },
    totalOrder: 0,
    totalProduct: 0,
    totalPrice: 0,
    isOpenConfirmationDialog: false,
    isOpenError: false,
    cekSampleCodeExist: [
      {
        cek: false
      }
    ]
  });
  const [tierData, setTierData] = useState([{ value: '', label: '' }]);
  const [productData, setProductData] = useState([{ value: '', label: '' }]);
  const [branchData, setBranchData] = useState([]);
  const [cooperationTermData, setCooperationTermData] = useState([]);
  const [tierSelected, setTierSelected] = useState({});
  const [numberPatient, setNumberPatient] = useState(1);
  const [errorMsg, setErrorMsg] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  const headColumns = [
    {
      key: 'no',
      name: 'No',
      className: 'w-auto'
    },
    {
      key: 'identityName',
      name: 'Nama Pasien',
      className: 'text-left w-auto'
    },
    {
      key: 'sampleCode',
      name: 'Sample Code',
      className: 'text-left w-auto'
    },
    {
      key: 'idType',
      name: 'ID Type',
      className: 'text-left w-auto'
    },
    {
      key: 'identityNumber',
      name: 'ID Client (NIK KTP/Passport)',
      className: 'text-left w-auto'
    },
    {
      key: 'address',
      name: 'Address',
      className: 'text-left w-auto'
    },
    {
      key: 'gender',
      name: 'Gender',
      className: 'text-left w-auto'
    },
    {
      key: 'birtOfDate',
      name: 'Date Of Birth',
      className: 'text-left w-auto'
    },
    {
      key: 'nationality',
      name: 'Nationality',
      className: 'text-left w-auto'
    },
    {
      key: 'phoneNumber',
      name: 'Phone Number',
      className: 'text-left w-auto'
    },
    {
      key: 'product',
      name: 'Product',
      className: 'text-left w-auto'
    },
    {
      key: 'action',
      name: '',
      className: 'w-auto'
    }
  ];

  const idTypeData = [
    {
      label: 'NIK KTP',
      value: 'NIK KTP'
    },
    {
      label: 'Passport',
      value: 'Passport'
    }
  ];

  const genderData = [
    {
      label: 'Laki-laki',
      value: 'Laki-laki'
    },
    {
      label: 'Perempuan',
      value: 'Perempuan'
    }
  ];

  const setIsOpenConfirmationDialog = (value, ...props) => {
    if (props[0] && props[0] === 'submit') {
      setOnSubmitData(true);
      dispatch(createLabTransaction(state.formPostInitialValue)).then(res => {
        if (res.isSuccess && res.statusCode === 200) {
          setTimeout(() => {
            router.push('/lab-partner-transaction');
          }, 1000);
        } else {
          setOnSubmitData(false);
          setErrorMsg(res.response.data.message);
          setState({
            ...state,
            isOpenError: true,
            isOpenConfirmationDialog: false
          });
        }
      });
    } else {
      setState({ ...state, isOpenConfirmationDialog: value });
    }
  };

  const setIsOpenError = value => {
    setState({
      ...state,
      isOpenError: value
    });
  };

  const validationSchema = Yup.object().shape({
    labPartnerCode: Yup.object().required('Please fill out this field'),
    tierId: Yup.object().required('Please fill out this field').nullable(),
    siteCode: Yup.object().required('Please fill out this field'),
    items: Yup.array().of(
      Yup.object().shape({
        identityName: Yup.string().required('Please fill out this field'),
        gender: Yup.object().required('Please fill out this field'),
        address: Yup.string().required('Please fill out this field'),
        idType: Yup.object().required('Please fill out this field').nullable(),
        identityNumber: Yup.string().when('idType', idType => {
          if (idType?.value === 'NIK KTP') {
            return Yup.string()
              .required('Please fill out this field')
              .matches(/^\d+$/, 'Only numbers')
              .min(16, 'Too Short!');
          }
          return Yup.string()
            .min(16, 'Too Short!')
            .required('Please fill out this field');
        }),
        birtOfDate: Yup.string().required('Please fill out this field'),
        nationality: Yup.string().required('Please fill out this field'),
        product: Yup.object().required('Please fill out this field').nullable(),
        phoneNumber: Yup.string()
          .min(11, 'Too Short!')
          .required('This field is required'),
        sampleCode: Yup.string()
          .min(20, 'Too Short!')
          .required('This field is required')
          .matches(sampleCodeValidationSpesialChar, 'No special character')
          .matches(sampleCodeValidationSpace, 'Cant use blankspace')
      })
    )
  });

  const onSubmit = () => {};

  const checkListSampleCode = async () => {
    const sampelCode = state.formPostInitialValue.items.map((item, index) => {
      return item.sampleCode;
    });
    var data = {
      sampelCodes: sampelCode
    };
    var res = await dispatch(fetchCheckSampleCode(data));

    const newForm = state.formPostInitialValue.items.map((item, index) => {
      item.cekSampleCodeExist = res[index].isSampleCodeExist;
      item.gender = genderData.find(gender => gender.value === item.gender);
      item.idType = idTypeData.find(idType => idType.value === item.idType);
      item.product = productData.find(
        product => product.value.productId === item.productId
      );
      return item;
    });

    const { labPartnerCode, tierId, siteCode } = state.formPostInitialValue;

    const itemobject = {
      labPartnerCode: cooperationTermData.find(
        partner => partner.value === labPartnerCode
      ),
      tierId: tierData.find(tier => tier.value === tierId),
      siteCode: branchData.find(site => site.value === siteCode),
      items: newForm
    };

    setState({
      ...state,
      isOpenError: false,
      formInitialValue: {
        ...state.formPostInitialValue,
        ...itemobject
      }
    });
  };

  useEffect(() => {
    if (tier.selectList.length <= 0 || tier.selectList !== Array) {
      dispatch(fetchTierSelectList()).then(res => {
        if (res != undefined) {
          setTierData(
            res.payload.map(item => {
              return {
                value: item.id,
                label: item.name,
                totalProduct: item.totalProduct
              };
            })
          );
        }
      });
    }
    dispatch(fetchBranchSelectList()).then(res => {
      setBranchData(
        res.payload.map(item => {
          return {
            ...item,
            value: item.branchCode,
            label: `${item.branchName}`
          };
        })
      );
    });
    if (tierSelected && tierSelected?.value !== undefined) {
      dispatch(fetchProductTierSelectList(tierSelected.value)).then(res => {
        if (res != undefined) {
          setProductData(
            product.tierSelectList.map(item => {
              return {
                ...item,
                value: item,
                label: `${item.productName} - ${currencyFormatter(
                  item.productPrice
                )}`
              };
            })
          );
        }
      });
    } else {
      setProductData([]);
    }
    if (labpartner.selectList !== Array || labpartner.selectList.length <= 0) {
      dispatch(fetchLabPartnerSelectList());
      setCooperationTermData(
        labpartner.selectList?.map(item => {
          return {
            ...item,
            value: item.labPartnerCode,
            label: item.labPartnerName
          };
        })
      );
    } else {
      setCooperationTermData([]);
    }
  }, [dispatch, tierSelected]);

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
          <Formik
            initialValues={state.formInitialValue}
            onSubmit={values => {
              values.transactionDate =
                values.transactionDate == ''
                  ? new Date().toISOString()
                  : values.transactionDate;
              setState({
                ...state,
                formPostInitialValue: {
                  labPartnerCode: values.labPartnerCode?.value,
                  tierId: values.tierId?.value,
                  tierName: values.tierId?.label,
                  serviceMethod: 'LAB PARTNER',
                  serviceGroup: 'LAB PARTNER',
                  salesRepresentatif: values.salesRepresentatif,
                  transactionDate: values.transactionDate,
                  siteCode: String(values.siteCode?.value),
                  items: values.items.map((item, index) => {
                    return {
                      identityName: item.identityName,
                      identityNumber: item.identityNumber,
                      phoneNumber: item.phoneNumber,
                      idType: item.idType.value,
                      address: item.address,
                      gender: item.gender.value,
                      nationality: item.nationality,
                      birtOfDate: item.birtOfDate,
                      productId: item.product?.productId,
                      productName: item.product?.productName,
                      productPrice: item.product?.productPrice,
                      serviceGroup: '1',
                      sampleCode: item.sampleCode.toUpperCase(),
                      productType: 'Covid',
                      cekSampleCodeExist: false
                    };
                  })
                },
                isOpenConfirmationDialog: true
              });
            }}
            enableReinitialize
            validationSchema={validationSchema}
          >
            {({ values, errors, touched, setFieldValue }) => (
              <Form>
                <div
                  className={`grid gap-x-16 gap-y-6 mb-2 grid-cols-2 lg:grid-cols-3 pb-6`}
                >
                  {/* First Row */}
                  <div>
                    <Label htmlFor={'labPartnerCode'}>Nama Partner</Label>
                    <Field
                      name={`labPartnerCode`}
                      component={ReactSelect}
                      options={cooperationTermData}
                      placeholder={`Choose a partner...`}
                    />
                    {errors &&
                      errors.labPartnerCode &&
                      touched &&
                      touched.labPartnerCode && (
                        <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                          {errors.labPartnerCode}
                        </p>
                      )}
                  </div>
                  <div>
                    <Label htmlFor={'tierId'}>Tier Pricing</Label>
                    <Field
                      name={`tierId`}
                      component={ReactSelect}
                      options={tierData}
                      placeholder={`Choose a tier...`}
                      onChange={option => {
                        setTierSelected(option);
                        values.items = values.items.map((value, index) => {
                          return { ...value, product: '' };
                        });
                      }}
                    />
                    {errors && errors.tierId && touched && touched.tierId && (
                      <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                        {errors.tierId}
                      </p>
                    )}
                  </div>
                  <div></div>
                  {/* Second Row */}
                  <div>
                    <Label htmlFor={'siteCode'}>Assign Site</Label>
                    <Field
                      name={`siteCode`}
                      placeholder={`Choose a site...`}
                      component={ReactSelect}
                      options={branchData}
                      type='text'
                    />
                    {errors &&
                      errors.siteCode &&
                      touched &&
                      touched.siteCode && (
                        <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                          {errors.siteCode}
                        </p>
                      )}
                  </div>
                  <div>
                    <Label htmlFor={'salesRepresentatif'}>
                      Sales Representative
                    </Label>
                    <Field
                      name={`salesRepresentatif`}
                      placeholder={`Sales Representative`}
                      component={Input}
                      type='text'
                    />
                  </div>
                  <div></div>
                  {/* Third Row */}
                  <div>
                    <Label htmlFor={'transactionDate'}>Tanggal Transaksi</Label>
                    <Field
                      id={`transactionDate`}
                      name={`transactionDate`}
                      component={DateInput}
                      icon={true}
                    />
                  </div>
                </div>
                <div></div>
                <div className={`grid gap-x-16 gap-y-6 mb-2 md:grid-cols-1`}>
                  <div className={`pb-3`}>
                    <Typography className={`font-medium text-base`}>
                      Masukan Data Pasien
                    </Typography>
                  </div>
                  <FieldArray name={`items`} className={``}>
                    {arrayHelpers => (
                      <div
                        className={`overflow-x-auto w-full h-full space-y-[16px] rounded border border-[#E6E6E6] `}
                      >
                        <div className={`overflow-x-scroll`}>
                          <Table headColumns={headColumns} className={``}>
                            {values.items.length > 0 ? (
                              values.items.map((item, key) => {
                                return (
                                  <tr
                                    key={key}
                                    className={`text-center odd:bg-[#FCFCFC] even:bg-white`}
                                  >
                                    <td className={`py-4 `}>
                                      <Typography>{key + 1}</Typography>
                                    </td>
                                    <td className={`py-4 pr-6 text-left `}>
                                      <Field
                                        component={Input}
                                        name={`items[${key}].identityName`}
                                        type={`text`}
                                        className={`w-[280px]`}
                                      />
                                      {errors &&
                                        errors.items &&
                                        errors.items[key] &&
                                        errors.items[key].identityName &&
                                        touched &&
                                        touched.items &&
                                        touched.items[key] &&
                                        touched.items[key].identityName && (
                                          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                            {errors.items[key].identityName}
                                          </p>
                                        )}
                                    </td>
                                    <td className={`py-4 pr-6 text-left `}>
                                      <Field
                                        component={Input}
                                        name={`items[${key}].sampleCode`}
                                        type={`text`}
                                        className={`w-[200px]`}
                                      />
                                      {errors &&
                                        errors.items &&
                                        errors.items[key] &&
                                        errors.items[key].sampleCode &&
                                        touched &&
                                        touched.items &&
                                        touched.items[key] &&
                                        touched.items[key].sampleCode && (
                                          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                            {errors.items[key].sampleCode}
                                          </p>
                                        )}
                                      {item.cekSampleCodeExist && (
                                        <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                          Sample Code Exist
                                        </p>
                                      )}
                                    </td>
                                    <td className={`py-4 pr-6 text-left `}>
                                      <Field
                                        component={ReactSelect}
                                        name={`items[${key}].idType`}
                                        type={`text`}
                                        className={``}
                                        options={idTypeData}
                                        onChange={option => {
                                          if (option) {
                                            values.items[key].idType =
                                              option.value;
                                          }
                                        }}
                                      />
                                      {errors &&
                                        errors.items &&
                                        errors.items[key] &&
                                        errors.items[key].idType &&
                                        touched &&
                                        touched.items &&
                                        touched.items[key] &&
                                        touched.items[key].idType && (
                                          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                            {errors.items[key].idType}
                                          </p>
                                        )}
                                    </td>
                                    <td className={`py-4 pr-6 text-left `}>
                                      <Field
                                        component={Input}
                                        name={`items[${key}].identityNumber`}
                                        className={`w-[280px]`}
                                        type={`text`}
                                      />
                                      {errors &&
                                        errors.items &&
                                        errors.items[key] &&
                                        errors.items[key].identityNumber &&
                                        touched &&
                                        touched.items &&
                                        touched.items[key] &&
                                        touched.items[key].identityNumber && (
                                          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                            {errors.items[key].identityNumber}
                                          </p>
                                        )}
                                    </td>
                                    <td className={`py-4 pr-6 text-left `}>
                                      <Field
                                        component={Textarea}
                                        name={`items[${key}].address`}
                                        type='text'
                                        className='w-[280px]'
                                      />
                                      {errors &&
                                        errors.items &&
                                        errors.items[key] &&
                                        errors.items[key].address &&
                                        touched &&
                                        touched.items &&
                                        touched.items[key] &&
                                        touched.items[key].address && (
                                          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                            {errors.items[key].address}
                                          </p>
                                        )}
                                    </td>
                                    <td className={`py-4 pr-6 text-left `}>
                                      <Field
                                        component={ReactSelect}
                                        name={`items[${key}].gender`}
                                        type={`text`}
                                        options={genderData}
                                      ></Field>
                                      {errors &&
                                        errors.items &&
                                        errors.items[key] &&
                                        errors.items[key].gender &&
                                        touched &&
                                        touched.items &&
                                        touched.items[key] &&
                                        touched.items[key].gender && (
                                          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                            {errors.items[key].gender}
                                          </p>
                                        )}
                                    </td>
                                    <td className={`py-4 pr-6 text-left `}>
                                      <div className={`w-[280px]`}>
                                        <Field
                                          id={`items[${key}].birtOfDate`}
                                          name={`items[${key}].birtOfDate`}
                                          component={DateInput}
                                          icon={true}
                                        />
                                        {errors &&
                                          errors.items &&
                                          errors.items[key] &&
                                          errors.items[key].birtOfDate &&
                                          touched &&
                                          touched.items &&
                                          touched.items[key] &&
                                          touched.items[key].birtOfDate && (
                                            <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                              {errors.items[key].birtOfDate}
                                            </p>
                                          )}
                                      </div>
                                    </td>
                                    <td className={`py-4 pr-6 text-left `}>
                                      <Field
                                        component={Input}
                                        name={`items[${key}].nationality`}
                                        type={`text`}
                                        className={`w-[200px]`}
                                      />
                                      {errors &&
                                        errors.items &&
                                        errors.items[key] &&
                                        errors.items[key].nationality &&
                                        touched &&
                                        touched.items &&
                                        touched.items[key] &&
                                        touched.items[key].nationality && (
                                          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                            {errors.items[key].nationality}
                                          </p>
                                        )}
                                    </td>
                                    <td className={`py-4 pr-6 text-left `}>
                                      <Field
                                        component={Input}
                                        name={`items[${key}].phoneNumber`}
                                        type={`text`}
                                        className={`w-[200px]`}
                                      />
                                      {errors &&
                                        errors.items &&
                                        errors.items[key] &&
                                        errors.items[key].phoneNumber &&
                                        touched &&
                                        touched.items &&
                                        touched.items[key] &&
                                        touched.items[key].phoneNumber && (
                                          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                            {errors.items[key].phoneNumber}
                                          </p>
                                        )}
                                    </td>
                                    <td className={`py-4 pr-6 text-left `}>
                                      <Field
                                        component={ReactSelect}
                                        name={`items[${key}].product`}
                                        type={`text`}
                                        className={`w-[200px]`}
                                        options={productData}
                                      />
                                      {errors &&
                                        errors.items &&
                                        errors.items[key] &&
                                        errors.items[key].product &&
                                        touched &&
                                        touched.items &&
                                        touched.items[key] &&
                                        touched.items[key].product && (
                                          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                            {errors.items[key].product}
                                          </p>
                                        )}
                                    </td>
                                    <td className='py-4 pr-4'>
                                      {key > 0 && (
                                        <Button
                                          className={`bg-[#F64E60] flex items-center px-5`}
                                          onClick={() => {
                                            arrayHelpers.remove(key);
                                            setNumberPatient(numberPatient - 1);
                                          }}
                                        >
                                          <div
                                            className={`mr-2 flex items-center`}
                                          >
                                            <Image
                                              src={assets.IconTrash}
                                              alt={`Delete icon`}
                                            />
                                          </div>
                                          <Typography className={`text-white`}>
                                            Delete
                                          </Typography>
                                        </Button>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <EmptyTable
                                colSpan={3}
                                title={`List pasien kosong`}
                              />
                            )}
                          </Table>
                        </div>
                        <div className={`p-6`}>
                          <Button
                            paddingVertical={`py-2`}
                            paddingHorizontal={`px-5`}
                            background={`bg-btnBlue/30`}
                            className={`flex justify-between items-center`}
                            onClick={() => {
                              arrayHelpers.push({
                                identityName: '',
                                identityNumber: '',
                                phoneNumber: '',
                                idType: '',
                                address: '',
                                gender: '',
                                nationality: '',
                                birtOfDate: new Date().toISOString(),
                                product: null,
                                productId: 0,
                                productName: '',
                                productPrice: 0,
                                serviceGroup: 'LAB PARTNER',
                                sampleCode: '',
                                productType: 'Covid',
                                cekSampleCodeExist: false
                              });

                              setNumberPatient(numberPatient + 1);
                            }}
                          >
                            <Image
                              src={assets.IconPlusBlue}
                              alt={`Create button`}
                            />
                            <Typography
                              className={`text-btnBlue pl-1 font-normal text-sm`}
                            >
                              Tambah Pasien
                            </Typography>
                          </Button>
                        </div>
                      </div>
                    )}
                  </FieldArray>
                </div>
                <div className={`grid gap-x-16 gap-y-6 mb-2 md:grid-cols-3`}>
                  <div></div>
                  <div>
                    <Button
                      className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white mr-6`}
                      type={`submit`}
                      onClick={() => {}}
                    >
                      <Typography className={`font-normal text-sm`}>
                        Save
                      </Typography>
                    </Button>
                    <Button
                      onClick={() => {
                        router.back();
                      }}
                      className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black`}
                    >
                      <Typography>Cancel</Typography>
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      </MainLayout>
      <Modal
        setIsOpen={val => setIsOpenConfirmationDialog(val)}
        width={`w-[27rem]`}
        title={`Confirmation`}
        isOpen={state.isOpenConfirmationDialog}
      >
        <Typography>{Messages.confirmationSavedData}</Typography>
        <div className={`pt-12`}>
          <Button
            onClick={() => {
              setIsOpenConfirmationDialog(false, 'submit');
            }}
            className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white mr-5`}
            disabled={onSubmitData}
          >
            <span
              className={`font-normal text-sm flex justify-center items-center`}
            >
              {onSubmitData ? (
                <svg
                  class='inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-[#FFF] dark:fill-gray-300'
                  viewBox='0 0 100 101'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                    fill='currentColor'
                  />
                  <path
                    d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                    fill='currentFill'
                  />
                </svg>
              ) : null}
              <p className='text-white'>Yes</p>
            </span>
          </Button>
          <Button
            onClick={() => setIsOpenConfirmationDialog(false)}
            className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black`}
          >
            <Typography>No</Typography>
          </Button>
        </div>
      </Modal>
      <Modal
        setIsOpen={val => setIsOpenError(val)}
        width={`w-[27rem]`}
        title={``}
        headless
        isOpen={state.isOpenError}
      >
        <div>
          <Image src={assets.IconError} alt={`Success dialog image`} />
        </div>
        <Typography className={`pt-8 font-normal text-sm`}>
          {errorMsg}
        </Typography>
        <div className={`pt-10`}>
          <Button
            onClick={() => {
              checkListSampleCode();
            }}
            className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white`}
          >
            <Typography>OK</Typography>
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default CreateLabPartnerTransaction;
