import assets from "@/public/index";
import {
  Button,
  Card,
  Input,
  Label,
  Modal,
  Select,
  Typography,
  InputFile,
  Textarea,
} from "@atoms";
import { ERROR_DIALOG } from "@constants/ErrorConst";
import Messages from "@constants/PopUpMessage";
import { MainLayout } from "@organisms";
import ParseMessage from "@utils/string";
import { fetchCooperationTermSelectList } from "components/store/actions/cooperationTerm";
import { clearError, errorMessage } from "components/store/actions/error";
import {
  createLabPartner,
  fetchLabSelectList,
  uploadLogo,
} from "components/store/actions/labPartner";
import { Field, Form, Formik } from "formik";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

const CreateRegistrasiLabPartner = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const form = useRef();
  const selector = useSelector((state) => state);
  const { labpartner, cooperationterm, errorRedux } = selector;
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [errorMsg, setErrorMsg] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [onSubmitData, setOnSubmitData] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");

  const [state, setState] = useState({
    headline: "Registrasi Lab Partner",
    breadcrumbs: [
      {
        link: "/registrasi-lab-partner",
        name: "List Registrasi Lab Partner",
      },
      {
        link: "/registrasi-lab-partner/create",
        name: "Create",
      },
    ],
    formInitialvalue: labpartner.postInitialValue,
    isOpenOTPConfirmationDialog: false,
    isOpenOTPSuccessDialog: false,
  });

  const setIsOpenOTPConfirmationDialog = (value, type = "") => {
    if (type === "submit") {
      const file = new FormData();
      file.append("File", selectedFile, selectedFile?.name);
      file.append("LabPartnerCode", form?.current?.values?.code);
      setOnSubmitData(true);
      dispatch(createLabPartner(form.current.values)).then((res) => {
        if (res?.isSuccess && res?.statusCode === 200) {
          dispatch(uploadLogo(file));
          setTimeout(() => {
            setIsOpenOTPSuccessDialog(true);
          }, 1000);
        } else {
          setState({ ...state, isOpenOTPConfirmationDialog: false });
          setErrorModalMessage(res?.response?.data?.message);
          setIsOpenErrorDialog(true);
          setOnSubmitData(false);
        }
        setOnSubmitData(false);
      });
    } else {
      setState({ ...state, isOpenOTPConfirmationDialog: value });
    }
  };

  const validationSchema = Yup.object().shape({
    code: Yup.string().required("This field is required"),
    name: Yup.string().required("This field is required"),
    phoneNumber: Yup.string()
      .min(11, "Too Short!")
      .required("This field is required"),
    pic: Yup.string().required("This field is required"),
    npwp: Yup.string().required("This field is required"),
  });

  const setIsOpenOTPSuccessDialog = (value) => {
    setState({
      ...state,
      isOpenOTPSuccessDialog: value,
      isOpenOTPConfirmationDialog: false,
    });
  };

  const removeBrand = (e) => {
    setIsSuccess(false);
    setSelectedFile(undefined);
  };

  const onSelectFile = (e) => {
    const MAX_FILE_SIZE = 5000;

    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
    }
    const fileSizeKiloBytes = e.target.files[0].size / 1000;

    if (
      e.target.files[0].type === "image/jpeg" ||
      e.target.files[0].type === "image/jpg" ||
      e.target.files[0].type === "image/png"
    ) {
      if (fileSizeKiloBytes < MAX_FILE_SIZE) {
        setSelectedFile(e.target.files[0]);
        setIsSuccess(true);
      } else {
        setErrorMsg("File size is greater than maximum limit");
        setIsSuccess(false);
      }
    } else {
      setErrorMsg("File type must png/jpg/jpeg");
      setIsSuccess(false);
    }
  };

  const [isOpenErrorDialog, setIsOpenErrorDialog] = useState(false);

  useEffect(() => {
    if (!labpartner.labSelectList || labpartner.labSelectList.length === 0) {
      dispatch(fetchLabSelectList());
    }
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    if (
      errorRedux?.error?.module &&
      router.route.includes(errorRedux?.error?.module) &&
      errorRedux.error.isOpen
    ) {
      setIsOpenErrorDialog(true);
    } else {
      setIsOpenErrorDialog(false);
    }

    return () => URL.revokeObjectURL(objectUrl);
  }, [
    errorRedux,
    router,
    dispatch,
    labpartner.labSelectList,
    cooperationterm.cooperationTermSelectList,
    selectedFile,
  ]);
  useEffect(() => {
    dispatch(fetchCooperationTermSelectList());
  }, []);

  return (
    <>
      {isOpenErrorDialog && (
        <Modal
          setIsOpen={(val) => {
            setIsOpenErrorDialog(val);
            if (val == false) {
              dispatch(clearError());
            }
          }}
          width={`w-[27rem]`}
          title={`Error`}
          headless
          isOpen={isOpenErrorDialog}
        >
          <div>
            <Image src={assets.IconCross} alt={`Success dialog image`} />
          </div>
          <Typography className={`pt-8 text-center`}>
            {errorRedux?.errorMessage ?? `${errorModalMessage}`}
          </Typography>
          <div className={`pt-10`}>
            <Button
              onClick={() => {
                setIsOpenErrorDialog(false);
                dispatch(clearError());
              }}
              className={`bg-[#349EFF] rounded-lg hover:bg-[#349EFF] text-white`}
            >
              <Typography>OK</Typography>
            </Button>
          </div>
        </Modal>
      )}
      <Head>
        <title>Bumame CMS</title>
        <link
          rel="icon"
          href={`${process.env.NEXT_PUBLIC_PREFIX_URL || ""}/favicon.ico`}
        />
      </Head>
      <MainLayout headline={state.headline} breadcrumb={state.breadcrumbs}>
        <Card>
          <Formik
            initialValues={labpartner.postInitialValue}
            onSubmit={(values) => {
              setState({
                ...state,
                formInitialvalue: values,
                isOpenOTPConfirmationDialog: true,
                isOpenOTPSuccessDialog: false,
              });
            }}
            enableReinitialize
            innerRef={form}
            validationSchema={validationSchema}
          >
            {(formik) => {
              return (
                <Form>
                  <div
                    className={`grid gap-x-16 gap-y-6 mb-2 grid-cols-1 lg:grid-cols-3`}
                  >
                    {/* First Row */}
                    <div>
                      <Label htmlFor={"code"}>Kode Institusi</Label>
                      <Field
                        name="code"
                        placeholder={`Kode Institusi`}
                        component={Input}
                      />
                    </div>
                    <div>
                      <Label htmlFor={"cooperationTermCode"}>
                        Pilih Ketentuan Kerjasama
                      </Label>
                      <Field
                        name="cooperationTermCode"
                        placeholder={`Ketentuan Kerjasama`}
                        component={Select}
                      >
                        <option value={``}>Select Cooperation Term</option>
                        {cooperationterm.cooperationTermSelectList.length > 0 &&
                          cooperationterm.cooperationTermSelectList.map(
                            (item, key) => {
                              return (
                                <option
                                  key={key}
                                  value={`${item.cooperationTermCode}`}
                                >
                                  {item.cooperationTermCode +
                                    " - " +
                                    item.cooperationTermName}
                                </option>
                              );
                            }
                          )}
                      </Field>
                    </div>
                    <div className={`hidden lg:block`}></div>
                    {/* Second Row */}
                    <div>
                      <Label htmlFor={"name"}>Nama Institusi</Label>
                      <Field
                        name="name"
                        placeholder={`Nama Institusi`}
                        component={Input}
                      />
                    </div>
                    <div>
                      <Label htmlFor={"address"}>Alamat</Label>
                      <Field
                        name="address"
                        placeholder={`Alamat`}
                        component={Textarea}
                      />
                    </div>
                    <div className={`hidden lg:block`}></div>
                    {/* Third Row */}
                    <div>
                      <Label htmlFor={"priceQuoteList"}>
                        List Penawaran Harga
                      </Label>
                      <Field
                        name="priceQuoteList"
                        placeholder={`List Penawaran Harga`}
                        component={Input}
                      />
                    </div>
                    <div>
                      <Label htmlFor={"pic"}>PIC</Label>
                      <Field name="pic" placeholder={`PIC`} component={Input} />
                    </div>
                    <div className={`hidden lg:block`}></div>
                    {/* Forth Row */}
                    <div>
                      <Label htmlFor={"labInCharge"}>
                        Penanggung Jawab Lab
                      </Label>
                      <Field
                        name="labInCharge"
                        placeholder={`Penanggung Jawab Lab`}
                        component={Input}
                      />
                    </div>
                    <div>
                      <Label htmlFor={"phoneNumber"}>No Handphone</Label>
                      <Field
                        name="phoneNumber"
                        placeholder={`No Handphone`}
                        component={Input}
                      />
                    </div>
                    <div className={`hidden lg:block`}></div>
                    {/* Fifth Row */}
                    <div>
                      <Label htmlFor={"bumameInCharge"}>
                        Penanggung Jawab Bumame
                      </Label>
                      <Field
                        name="bumameInCharge"
                        placeholder={`Penanggung Jawab Bumame`}
                        component={Input}
                      />
                    </div>
                    <div>
                      <Label htmlFor={"npwp"}>NPWP</Label>
                      <Field
                        name="npwp"
                        placeholder={`NPWP`}
                        component={Input}
                      />
                    </div>
                    <div className={`hidden lg:block`}></div>
                    {/* Sixth Row */}
                    <div>
                      <Label>Upload Brand</Label>
                      <div className={`container`}>
                        <div className={`flex`}>
                          <li className={`pr-6`}> Max Height 922px </li>
                          <li> Max Size 5Mb </li>
                        </div>
                      </div>
                      <div className="container items-center flex my-6">
                        <div>
                          <InputFile
                            className="whitespace-nowrap"
                            onChange={onSelectFile}
                            fileName={
                              selectedFile?.name &&
                              selectedFile?.name.substring(0, 12) + "..."
                            }
                            accept="image/png, image/jpg, image/jpeg"
                            isWhite
                          />
                        </div>
                        {isSuccess ? (
                          <>
                            <div>
                              <div>
                                <Button
                                  className="bg-inActive items-center p-2 align-center"
                                  onClick={() => removeBrand()}
                                  emptyPadding
                                >
                                  <Image
                                    src={assets.IconTrash}
                                    alt={`Delete icon`}
                                  />
                                </Button>
                              </div>
                            </div>
                          </>
                        ) : null}
                      </div>
                      {!selectedFile ? (
                        <div className="-mt-4 text-sm text-red-600 dark:text-red-500">
                          Upload brand is required
                        </div>
                      ) : null}
                      {!isSuccess ? (
                        <>
                          <p className="error-message text-sm text-red-600 dark:text-red-500">
                            {errorMsg}
                          </p>
                        </>
                      ) : null}

                      {selectedFile && (
                        <div className="w-5/12">
                          <img src={preview} className="h-[150px] mt-5" />
                        </div>
                      )}
                    </div>
                    <div className={`hidden lg:block`}></div>
                    <div className={`hidden lg:block`}></div>
                    {/* Seventh Row */}
                    <div className={`hidden lg:block`}></div>
                    <div className={`pt-12`}>
                      <Button
                        className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white mr-6 disabled:bg-btn-cancel disabled:text-black`}
                        type={`submit`}
                        disabled={
                          !(formik.isValid && formik.dirty && selectedFile)
                        }
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
                    <div className={`hidden lg:block`}></div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Card>
        {state.isOpenOTPConfirmationDialog && (
          <Modal
            setIsOpen={(val) => setIsOpenOTPConfirmationDialog(val)}
            width={`w-[27rem]`}
            title={"Confirmation"}
            isOpen={state.isOpenOTPConfirmationDialog}
          >
            <Typography className={`font-normal text-sm text-center`}>
              {ParseMessage(
                Messages.confirmationOTP,
                state.formInitialvalue?.phoneNumber
              )}
            </Typography>
            <div className={`pt-10`}>
              <Button
                onClick={() => {
                  setIsOpenOTPConfirmationDialog(false, "submit");
                }}
                className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white mr-5`}
                disabled={onSubmitData === true ? true : false}
              >
                <span
                  className={`font-normal text-sm flex justify-center items-center`}
                >
                  {onSubmitData ? (
                    <svg
                      className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-[#FFF] dark:fill-gray-300"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
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
              <Button
                onClick={() => setIsOpenOTPConfirmationDialog(false)}
                className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black`}
              >
                <Typography>No</Typography>
              </Button>
            </div>
          </Modal>
        )}
        {state.isOpenOTPSuccessDialog && (
          <Modal
            setIsOpen={(val) => setIsOpenOTPSuccessDialog(val)}
            width={`w-[27rem]`}
            title={`Success`}
            headless
            isOpen={state.isOpenOTPSuccessDialog}
          >
            <div>
              <Image
                src={assets.ImageCheckedGreen}
                alt={`Success dialog image`}
              />
            </div>
            <Typography className={`pt-8 font-normal text-sm`}>
              {ParseMessage(
                Messages.successOTP,
                state.formInitialvalue?.phoneNumber
              )}
            </Typography>
            <div className={`pt-10`}>
              <Button
                onClick={() => {
                  setIsOpenOTPSuccessDialog(false);
                  setTimeout(() => {
                    router.push(`/registrasi-lab-partner`);
                  }, 1000);
                }}
                className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white`}
              >
                <Typography>OK</Typography>
              </Button>
            </div>
          </Modal>
        )}
      </MainLayout>
    </>
  );
};

export default CreateRegistrasiLabPartner;
