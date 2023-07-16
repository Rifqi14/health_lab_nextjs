import assets from 'public/index';
import {
  Button,
  Card,
  DateInput,
  Input,
  Label,
  ReactSelect,
  Select,
  Typography
} from 'components/atoms';
import { SERVICE_METHOD } from 'components/constants/ServiceMethod';
import { Transition } from '@headlessui/react';
import { fetchBranchSelectList } from 'components/store/actions/branchs';
import {
  fetchCorporateDetail,
  fetchCorporateSelectList
} from 'components/store/actions/corporate';
import { fetchProductSelectList } from 'components/store/actions/product';
import { Field, Form, Formik } from 'formik';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import HouseCall from './HouseCall';
import WebReg from './WebReg';

const GenerateForm = props => {
  const dispatch = useDispatch();
  const selector = useSelector(state => state);
  const [qty, setQty] = useState(0);
  const { corporate, product, site } = selector;
  const [isFormValid, setIsFormValid] = useState(false);
  const {
    generateFormRef,
    payment_code_type,
    setIsOpenConfirmationDialog,
    isGenerateFormOpen,
    isHouseCallFormOpen,
    isWebRegFormOpen,
    setGenerateForm,
    onChangeCorporate,
    onSubmitGenerate,
    onSubmitWebReg,
    onUploadDocument,
    uploadDocumentFormRef,
    webRegFormRef,
    setUploadData,
    houseCallFormRef,
    selectedDate,
    selectedEndDate,
    withTimeStamp = false,
    name
  } = props;
  const [inputtedData, setInputtedData] = useState({
    corporateName: '',
    product: '',
    serviceMethod: '',
    totalPaymentCode: '',
    site: '',
    discount: '',
    startDate: '',
    endDate: '',
    site: ''
  });
  const [state, setState] = useState({
    formInitialValue: {
      corporateCode: '',
      productId: 0,
      productName: '',
      productPrice: 0,
      qty: 0,
      discount: 0,
      serviceMethod: '',
      transactionDate: new Date(),
      description: '',
      groupType: '',
      startDate: new Date(),
      endDate: new Date()
    },
    corporate_name: props.corporate_name,
    product_name: '',
    total_payment_amount: '',
    discount: '',
    corporate_type: props.corporate_type,
    master_corporate: [
      {
        corporate_id: 1,
        corporate_name: 'PT. Supra Boga Lestari',
        corporate_type: 'Corporate'
      },
      {
        corporate_id: 2,
        corporate_name: 'Alkademi',
        corporate_type: 'Individual'
      },
      {
        corporate_id: 3,
        corporate_name: 'Tosanarka',
        corporate_type: 'Corporate'
      },
      {
        corporate_id: 4,
        corporate_name: 'Radya Labs',
        corporate_type: 'Individual'
      },
      {
        corporate_id: 5,
        corporate_name: 'Radya Labs',
        corporate_type: 'Corporate'
      }
    ]
  });
  const [productData, setProductData] = useState([]);
  const [corporateData, setCorporateData] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [Name, setName] = useState('');
  const [corporatePhoneNumber, setCorporatePhoneNumber] = useState(undefined);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const onChange = dates => {
    const iso = dates.toISOString();
    setInputtedData({
      ...inputtedData,
      startDate: iso
    });
  };

  const onChangeEndDate = dates => {
    const iso = dates.toISOString();
    setInputtedData({
      ...inputtedData,
      endDate: iso
    });
  };

  const generateForm = useRef(null);

  const onClickGenerate = () => {
    setGenerateForm(payment_code_type, state.corporate_type);
  };

  const handleOnchangeInput = e => {
    setName(e);
  };

  const checkIsFormValid = () => {
    if (
      inputtedData.corporateName &&
      inputtedData.product &&
      inputtedData.totalPaymentCode > 0 &&
      (payment_code_type === 'house-call' || inputtedData.serviceMethod) &&
      (payment_code_type === 'inhouse' || inputtedData.site) &&
      (corporatePhoneNumber || corporatePhoneNumber === undefined)
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  useEffect(() => {
    setState({
      ...state,
      corporate_name: props.corporate_name,
      corporate_type: props.corporate_type
    });

    if (isGenerateFormOpen) {
      dispatch(fetchProductSelectList()).then();
      setProductData(
        product.selectList.map(item => {
          return {
            ...item,
            value: item.productId,
            label: `${item.productName} - ${item.type}`
          };
        })
      );
      dispatch(
        fetchCorporateSelectList({ Name: Name, p: 1, s: 10, IsForList: true })
      );
      setCorporateData(
        corporate.selectList.map(item => {
          return {
            ...item,
            value: item.code,
            label: `${item.name} - ${item.corporateType}`
          };
        })
      );
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
    }
  }, [
    props.corporate_name,
    props.corporate_type,
    dispatch,
    Name,
    isGenerateFormOpen
  ]);
  useEffect(() => {
    checkIsFormValid();
  }, [inputtedData, payment_code_type, startDate, endDate]);

  return (
    <Transition appear show={isGenerateFormOpen}>
      <Card
        rounded={`rounded-lg`}
        shadow={`shadow-lg`}
        padding={`p-7`}
        className={`mb-5`}
      >
        <Formik
          initialValues={state.formInitialValue}
          onSubmit={values => {
            setState({ ...state, formInitialValue: values });
            onClickGenerate();
          }}
          innerRef={generateFormRef}
          enableReinitialize
        >
          <Form>
            <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
              <div>
                <Label htmlFor={'corporateName'}>Name Corporate</Label>
                <Field
                  name={`corporateName`}
                  placeholder={`Choose a corporate...`}
                  component={ReactSelect}
                  options={corporateData}
                  onChangeInput={e => {
                    dispatch(
                      fetchCorporateSelectList({ Name: e, p: 1, s: 10 })
                    );
                    setCorporateData(
                      corporate.selectList.map(item => {
                        return {
                          ...item,
                          value: item.code,
                          label: `${item.name} - ${item.corporateType}`
                        };
                      })
                    );
                  }}
                  onChange={val => {
                    dispatch(fetchCorporateDetail(val?.code)).then(res => {
                      if (!val) {
                        setCorporatePhoneNumber(undefined);
                      } else {
                        const indexOperational = res?.payload?.pics.findIndex(
                          x => x?.title === 'Operasional'
                        );
                        const phoneNumber =
                          res?.payload?.corporateType === 'Corporate'
                            ? res?.payload?.pics[indexOperational]?.contact
                            : res?.payload?.phoneNumber
                            ? res?.payload?.phoneNumber
                            : null;
                        setCorporatePhoneNumber(
                          phoneNumber === undefined ? null : phoneNumber
                        );
                      }
                    });
                    onChangeCorporate(val);
                    setInputtedData({
                      ...inputtedData,
                      corporateName: val
                    });
                  }}
                />
                {(corporatePhoneNumber === null ||
                  corporatePhoneNumber === '') && (
                  <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                    Operasional Contact Not Available
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor={'product'}>Select Product</Label>
                <Field
                  name={`product`}
                  component={ReactSelect}
                  options={productData}
                  placeholder={`Choose a product...`}
                  onChange={val => {
                    setInputtedData({
                      ...inputtedData,
                      product: val
                    });
                  }}
                />
              </div>
              {payment_code_type == 'inhouse' && (
                <div>
                  <Label htmlFor={'serviceMethod'}>Payment Code Type</Label>
                  <Field
                    name={`serviceMethod`}
                    component={ReactSelect}
                    options={SERVICE_METHOD}
                    placeholder={`Choose a method...`}
                    onChange={val => {
                      setInputtedData({
                        ...inputtedData,
                        serviceMethod: val
                      });
                    }}
                  />
                </div>
              )}
              {payment_code_type == 'house-call' && (
                <div>
                  <Label>Assign Site</Label>
                  <Field
                    name={`site`}
                    component={ReactSelect}
                    options={branchData}
                    placeholder={`Choose a site...`}
                    onChange={val => {
                      setInputtedData({
                        ...inputtedData,
                        site: val
                      });
                    }}
                  />
                </div>
              )}
            </div>
            <div className={`grid gap-16 mb-5 md:grid-cols-3`}>
              <div>
                <Label htmlFor={'qty'}>Total Payment Code</Label>
                <Field
                  type={`number`}
                  name={`qty`}
                  id='qty'
                  placeholder='Total Payment Code'
                  onChange={val => {
                    if (val.target?.value) {
                      setQty(val.target.value);
                    }
                    setInputtedData({
                      ...inputtedData,
                      totalPaymentCode: val.target.value
                    });
                  }}
                  component={Input}
                />
              </div>
              <div>
                <Label htmlFor={'discount'}>Discount</Label>
                <Field
                  type={`number`}
                  name={`discount`}
                  id='discount'
                  placeholder='Discount'
                  component={Input}
                  onChange={val => {
                    setInputtedData({
                      ...inputtedData,
                      discount: val.target.value
                    });
                  }}
                />
              </div>
              {payment_code_type == 'inhouse' && (
                <div className='flex justify-between gap-4'>
                  <div>
                    <Label htmlFor={'startDate'}>Start Date</Label>
                    <div className='relative'>
                      <Field
                        name={`startDate`}
                        component={DateInput}
                        icon={assets.IconCalendar}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={'endDate'}>End Date</Label>
                    <div className='relative'>
                      <Field
                        name={`endDate`}
                        component={DateInput}
                        icon={assets.IconCalendar}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className={`grid gap-16 md:grid-cols-2`}>
              <div>
                <Input
                  type={`text`}
                  id={`total_payment_code_hidden`}
                  placeholder={`Total Payment Code`}
                  name={`total_payment_code_hidden`}
                  value={payment_code_type}
                  readonly={true}
                  className={`hidden`}
                />
              </div>
            </div>
            <Button
              background={isFormValid ? `bg-pattensBlue` : `bg-gray-400`}
              rounded={`rounded-[5px]`}
              type='submit'
              paddingHorizontal={`px-8`}
              paddingVertical={`py-2`}
              className={
                isFormValid
                  ? `hover:bg-btnBlue hover:text-white text-btnBlue`
                  : `text-white`
              }
              disabled={!isFormValid}
            >
              <Typography className={`font-normal text-sm m-50`}>
                Submit
              </Typography>
            </Button>
          </Form>
        </Formik>
      </Card>
      <HouseCall
        setIsOpenConfirmationDialog={setIsOpenConfirmationDialog}
        isHouseCallFormOpen={isHouseCallFormOpen}
        houseCallFormRef={houseCallFormRef}
        uploadDocumentFormRef={uploadDocumentFormRef}
        qty={qty}
      />
      <WebReg
        setIsOpenConfirmationDialog={setIsOpenConfirmationDialog}
        isWebRegFormOpen={isWebRegFormOpen}
        onSubmitWebReg={onSubmitWebReg}
        onUploadDocument={onUploadDocument}
        uploadDocumentFormRef={uploadDocumentFormRef}
        webRegFormRef={webRegFormRef}
        setUploadData={setUploadData}
        {...props}
      />
    </Transition>
  );
};

export default GenerateForm;
