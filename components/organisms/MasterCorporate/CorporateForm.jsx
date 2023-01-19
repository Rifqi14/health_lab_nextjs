import { Transition } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Input,
  InputFile,
  Label,
  Modal,
  ReactSelect,
  Select,
  Textarea,
  Typography,
} from "@atoms";
import Image from "next/image";
import assets from "@/public/index";
import { useRouter } from "next/router";
import axios from "axios";
import ModalConfirmation from "components/Modals/ModalConfirmation";
import ModalSuccess from "components/Modals/ModalsSendLink";
import ModalUploadFile from "components/Modals/ModalUploadFile";
import { getItemLocalStorage } from "@utils/localstorage";
import Table from "../Tables/Table";
import { EmptyTable } from "@molecules";
import { useDispatch } from "react-redux";
import {
  createMasterCorporate,
  getSiteOption,
  uploadDocument,
} from "components/store/actions/corporate";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import Head from "next/head";
import {
  numberOnly,
} from "components/constants/NumberValidation";

const CorporateForm = (props) => {
  const {
    isCorporateFormOpen,
    handleModals,
    handleModalsConfirm,
    siteOptions,
  } = props;

  const router = useRouter();
  const dispatch = useDispatch();

  const [show, setshow] = useState(false);
  const [selectSite, setSelectSite] = useState();
  const [sendSite, setSendSite] = useState();
  const [showModals, setShowModals] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [typeDoc, setTypeDoc] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [onSubmit, setOnSubmit] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);
  const [selectTitle, setSelectTitle] = useState();
  const [isSupportingDataValid, setIsSupportingDataValid] = useState(false);
  const [currentDocument, setCurrentDocument] = useState()

  const [state, setState] = useState({
    name: "",
    identityType: "",
    brand: "",
    catagories: "",
    totalUser: "",
    email: "",
    gender: "",
    code: "",
    dateOfBirth: new Date(),
    citizenship: "",
    taxId: "",
    arDueDate: 0,
    phone: "",
    address: "",
    city: "",
    province: "",
    rt: "",
    rw: "",
    selectedSite: [],
    district: "",
    subDistinct: "",
    domicileAddress: "",
    domicileCity: "",
    domicileProvince: "",
    domicileRt: "",
    domicileRw: "",
    domicileDistrict: "",
    domicileSubDistinct: "",
    selectType: "",
    sites: [
      {
        siteId: null,
        siteName: "",
      },
    ],
    pics: [
      {
        index: 0,
        name: "",
        title: "Corporate",
        contact: "",
        email: "",
      },
      {
        index: 1,
        name: "",
        title: "Operasional",
        contact: "",
        email: "",
      },
      {
        index: 2,
        name: "",
        title: "Finance",
        contact: "",
        email: "",
      },
    ],
    corporateType: "",
    spkDocument: [],
    sphDocument: [],
    npwpDocument: [],
    dataIdDocument: [],
    suratVendorDocument: [],
    isOpenUploadSupportingData: false,
    isOpenUploadSphData: false,
    isOpenUploadNpwpData: false,
    isOpenUploadDataIdData: false,
    isOpenUploadSuratVendorData: false,
  });

  const headColumns = [
    {
      key: "no",
      name: "No",
      className: "w-3 px-4 text-center",
      icon: false,
    },
    {
      key: "file",
      name: "File",
      className: "text-left",
      icon: false,
    },
    {
      key: "note",
      name: "Note",
      className: "text-left pl-6",
      icon: false,
    },
    {
      key: "deletbtn",
      name: "",
      className: "w-12 px-2",
      icon: false,
    },
  ];

  const addPic = () => {
    setState({
      ...state,
      pics: [
        ...state.pics,
        {
          index: state.pics[state.pics.length - 1].index + 1,
          name: "",
          title: [{ value: "", label: "" }],
          contact: "",
          email: "",
        },
      ],
    });
  };

  const addSpkDocument = () => {
    setState({
      ...state,
      spkDocument: [
        ...state.spkDocument,
        {
          index: state.spkDocument.length + 1,
          file: "",
          note: "",
        },
      ],
    });
  };

  const addSphDocument = () => {
    setState({
      ...state,
      sphDocument: [
        ...state.sphDocument,
        {
          index: state.sphDocument.length + 1,
          file: "",
          note: "",
        },
      ],
    });
  };

  const addNpwpDocument = () => {
    setState({
      ...state,
      npwpDocument: [
        ...state.npwpDocument,
        {
          index: state.npwpDocument.length + 1,
          file: "",
          note: "",
        },
      ],
    });
  };

  const adddataIdDocument = () => {
    setState({
      ...state,
      dataIdDocument: [
        ...state.dataIdDocument,
        {
          index: state.dataIdDocument.length + 1,
          file: "",
          note: "",
        },
      ],
    });
  };

  const addSuratVendor = () => {
    setState({
      ...state,
      suratVendorDocument: [
        ...state.suratVendorDocument,
        {
          index: state.suratVendorDocument.length + 1,
          file: "",
          note: "",
        },
      ],
    });
  };

  const setIsOpenUploadSupportingData = (value) => {
    if (value) {
      setCurrentDocument("spk")
    } else {
      setCurrentDocument("")
    }
    setState({ ...state, isOpenUploadSupportingData: value });
  };

  const setIsOpenUploadSphData = (value) => {
    if (value) {
      setCurrentDocument("sph")
    } else {
      setCurrentDocument("")
    }
    setState({ ...state, isOpenUploadSphData: value });
  };

  const setIsOpenUploadNpwpData = (value) => {
    if (value) {
      setCurrentDocument("npwp")
    } else {
      setCurrentDocument("")
    }
    setState({ ...state, isOpenUploadNpwpData: value });
  };

  const setIsOpenUploaddDataIdData = (value) => {
    if (value) {
      setCurrentDocument("dataId")
    } else {
      setCurrentDocument("")
    }
    setState({ ...state, isOpenUploadDataIdData: value });
  };

  const setIsOpenUploaddSuratVendorData = (value) => {
    if (value) {
      setCurrentDocument("suratVendor")
    } else {
      setCurrentDocument("")
    }
    setState({ ...state, isOpenUploadSuratVendorData: value });
  };

  const onChangeBrowseFile = (e, index) => {
    const upload = state.spkDocument.map((item, i) => {
      if (item.index === index) {
        item.file = e.target.files[0];
      }

      return item;
    });
    setState({
      ...state,
      spkDocument: upload,
    });
  };

  const onChangeBrowseSphFile = (e, index) => {
    const upload = state.sphDocument.map((item, i) => {
      if (item.index === index) {
        item.file = e.target.files[0];
      }

      return item;
    });
    setState({
      ...state,
      sphDocument: upload,
    });
  };

  const onChangeBrowseNpwpFile = (e, index) => {
    const upload = state.npwpDocument.map((item, i) => {
      if (item.index === index) {
        item.file = e.target.files[0];
      }

      return item;
    });
    setState({
      ...state,
      npwpDocument: upload,
    });
  };

  const onChangeBrowseDataIdFile = (e, index) => {
    const upload = state.dataIdDocument.map((item, i) => {
      if (item.index === index) {
        item.file = e.target.files[0];
      }

      return item;
    });
    setState({
      ...state,
      dataIdDocument: upload,
    });
  };

  const onChangeBrowseSuratVendorFile = (e, index) => {
    const upload = state.suratVendorDocument.map((item, i) => {
      if (item.index === index) {
        item.file = e.target.files[0];
      }

      return item;
    });
    setState({
      ...state,
      suratVendorDocument: upload,
    });
  };

  const onChangeSpkNote = (e, index) => {
    const upload = state.spkDocument.map((item, i) => {
      if (item.index === index) {
        item.notes = e.target.value;
      }

      return item;
    });
    setState({
      ...state,
      spkDocument: upload,
    });
  };

  const onChangeNpwpNote = (e, index) => {
    const upload = state.npwpDocument.map((item, i) => {
      if (item.index === index) {
        item.notes = e.target.value;
      }

      return item;
    });
    setState({
      ...state,
      npwpDocument: upload,
    });
  };

  const onChangeSphNote = (e, index) => {
    const upload = state.sphDocument.map((item, i) => {
      if (item.index === index) {
        item.notes = e.target.value;
      }

      return item;
    });
    setState({
      ...state,
      sphDocument: upload,
    });
  };

  const onChangeDataIdNote = (e, index) => {
    const upload = state.dataIdDocument.map((item, i) => {
      if (item.index === index) {
        item.notes = e.target.value;
      }

      return item;
    });
    setState({
      ...state,
      dataIdDocument: upload,
    });
  };

  const onChangeSuratVendorNote = (e, index) => {
    const upload = state.suratVendorDocument.map((item, i) => {
      if (item.index === index) {
        item.notes = e.target.value;
      }

      return item;
    });
    setState({
      ...state,
      suratVendorDocument: upload,
    });
  };

  const deleteSpkFile = (index) => {
    const upload = state.spkDocument.filter((item, i) => {
      return item.index !== index;
    });
    setState({
      ...state,
      spkDocument: upload,
    });
  };

  const deleteSphFile = (index) => {
    const upload = state.sphDocument.filter((item, i) => {
      return item.index !== index;
    });
    setState({
      ...state,
      sphDocument: upload,
    });
  };

  const deleteNpwpFile = (index) => {
    const upload = state.npwpDocument.filter((item, i) => {
      return item.index !== index;
    });
    setState({
      ...state,
      npwpDocument: upload,
    });
  };

  const deleteDataIdFile = (index) => {
    const upload = state.dataIdDocument.filter((item, i) => {
      return item.index !== index;
    });
    setState({
      ...state,
      dataIdDocument: upload,
    });
  };

  const deleteSuratVendorFile = (index) => {
    const upload = state.suratVendorDocument.filter((item, i) => {
      return item.index !== index;
    });
    setState({
      ...state,
      suratVendorDocument: upload,
    });
  };

  const onChangeData = (e, index, type) => {
    const upload = state.pics.map((item, i) => {
      if (item.index === index) {
        if (type == "name") {
          item.name = e.target.value;
        } else if (type == "contact") {
          item.contact = e.target.value;
        } else if (type == "title") {
          item.title = e;
        } else if (type == "email") {
          item.email = e.target.value;
        }
      }
      return item;
    });
    setState({
      ...state,
      pics: upload,
    });
  };

  const handleSelectSite = (val) => {
    setSelectSite(val);
    let obj = props.siteOptions.find((o) => o.siteId == val?.siteId);
    setSendSite(obj);
  };

  // Post datat create master corporate
  const submitDataCorporateForm = () => {
    const data = {
      name: state.name,
      totalUser: +state.totalUser,
      brand: state.brand,
      phoneNumber: state.phone,
      CorporateType: "corporate",
      code: state.code,
      taxId: state.taxId,
      catagories: state.catagories,
      arDueDate: +state.arDueDate,
      address: state.address,
      subDistinct: state.subDistinct,
      province: state.province,
      rt: state.rt,
      city: state.city,
      rw: state.rw,
      district: state.district,
      pics: state.pics.map((item, index) => {
        return {
          name: item.name,
          contact: item.contact,
          title: item.title,
          email: item.email,
        };
      }),
      sites: [sendSite],
    };
    setOnSubmit(true);
    dispatch(createMasterCorporate(data)).then((res) => {
      if (res?.statusCode === 200) {
        let uploadDocumentStatus = true;

        state.spkDocument.forEach((item, index) => {
          const newFormData = new FormData();
          newFormData.append("CorporateCode", state.code);
          newFormData.append("File", item.file);
          newFormData.append("Type", "SPK");
          newFormData.append("Notes", item.notes);

          dispatch(uploadDocument(newFormData)).then((res) => {
            if (res.statusCode !== 200) {
              uploadDocumentStatus = false;
            }
          });
        });

        state.sphDocument.forEach((item, index) => {
          const newFormData = new FormData();
          newFormData.append("CorporateCode", state.code);
          newFormData.append("File", item.file);
          newFormData.append("Type", "SPH");
          newFormData.append("Notes", item.notes);

          dispatch(uploadDocument(newFormData)).then((res) => {
            if (res.statusCode !== 200) {
              uploadDocumentStatus = false;
            }
          });
        });

        state.npwpDocument.forEach((item, index) => {
          const newFormData = new FormData();
          newFormData.append("CorporateCode", state.code);
          newFormData.append("File", item.file);
          newFormData.append("Type", "NPWP");
          newFormData.append("Notes", item.notes);

          dispatch(uploadDocument(newFormData)).then((res) => {
            if (res.statusCode !== 200) {
              uploadDocumentStatus = false;
            }
          });
        });

        state.dataIdDocument.forEach((item, index) => {
          const newFormData = new FormData();
          newFormData.append("CorporateCode", state.code);
          newFormData.append("File", item.file);
          newFormData.append("Type", "IDENTITY");
          newFormData.append("Notes", item.notes);

          dispatch(uploadDocument(newFormData)).then((res) => {
            if (res.statusCode !== 200) {
              uploadDocumentStatus = false;
            }
          });
        });

        state.suratVendorDocument.forEach((item, index) => {
          const newFormData = new FormData();
          newFormData.append("CorporateCode", state.code);
          newFormData.append("File", item.file);
          newFormData.append("Type", "VENDOR_DOCUMENT");
          newFormData.append("Notes", item.notes);

          dispatch(uploadDocument(newFormData)).then((res) => {
            if (res.statusCode !== 200) {
              uploadDocumentStatus = false;
            }
          });
        });
        setShowModals(false);
        setSuccessModal(true);
      } else {
        setErrorMessage(res?.response?.data?.message);
        setShowModals(false);
        setErrorModal(true);
      }
      setOnSubmit(false);
    });
  };

  const HandleCencel = () => {
    router.back();
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required("This field is required"),
    totalUser: yup.number().integer().min(1).required("This field is required"),
    brand: yup.string().required("This field is required"),
    phone: yup.number().integer().required("This field is required"),
    code: yup.string().required("This field is required"),
    taxId: yup.string().required("This field is required"),
    catagories: yup.string().required("This field is required"),
    ArDueDate: yup.string().required("This field is required"),
    address: yup.string().required("This field is required"),
    city: yup.string().required("This field is required"),
    province: yup.string().required("This field is required"),
    rt: yup.string().required("This field is required"),
    district: yup.string().required("This field is required"),
    rw: yup.string().required("This field is required"),
    subdistrict: yup.string().required("This field is required"),
    site: yup.string().required("This field is required"),
    picName1: yup.string().required("This field is required"),
    picContact1: yup.string().required("This field is required").matches(numberOnly, 'Only numbers').min(10, "Too Short!"),
    picEmail1: yup.string().email().required("This field is required"),
    picName2: yup.string().required("This field is required"),
    picContact2: yup.string().required("This field is required").matches(numberOnly, 'Only numbers').min(10, "Too Short!"),
    picEmail2: yup.string().email().required("This field is required"),
    // picOtherEmail: yup.string().email("Invalid email format"),
  });

  const checkPicsEmailIsValid = () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    let output = true;
    state.pics.forEach((item, index) => {
      if (!emailRegex.test(item.email)) {
        output = false;
      }
    });
    return output;
  };

  const isEmptyObject = (data) => {
    const formCek = [
      "name",
      "totalUser",
      "brand",
      "phoneNumber",
      "taxId",
      "catagories",
      "address",
      "city",
      "province",
      "rt",
      "rw",
      "district",
      "subDistinct",
      "pics",
      "arDueDate",
    ];

    for (const key in data) {
      if (formCek.includes(key)) {
        const keyData = data[key];
        if (key === "totalUser" || key === "arDueDate") {
          if (typeof keyData === "number" && keyData <= 0) {
            return true;
          }
        } else if (key === "pics") {
          for (const pic in keyData) {
            if (keyData[pic].title !== "Finance") {
              for (const data in keyData[pic]) {
                if (data !== "index") {
                  if (data === "email") {
                    if (!checkPICEmailIsValid(keyData[pic][data])) {
                      return true;
                    }
                  } else if (data === "contact") {
                    if (keyData[pic][data].length < 10 || !numberOnly.test(keyData[pic][data])) {
                      return true;
                    }
                  } else if (
                    keyData[pic][data] === null ||
                    (typeof keyData[pic][data] === "string" &&
                      keyData[pic][data] === "") ||
                    !keyData[pic][data] ||
                    !keyData[pic][data].length
                  ) {
                    return true;
                  }
                }
              }
            }
          }
        } else if (
          keyData === null ||
          (typeof keyData === "string" && keyData === "") ||
          !keyData ||
          !keyData.length
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const checkIsFormValid = () => {
    const isPicsEmailValid = checkPicsEmailIsValid();
    if (
      !isEmptyObject(state)
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  useEffect(() => {
    checkIsFormValid();
  }, [state]);

  useEffect(() => {
    let isDocumentValid = true
    switch (currentDocument) {
      case "spk":
        state.spkDocument.forEach((item, index) => {
          if (!item.file || !item.notes) {
            isDocumentValid = false;
          }
        });
      case "sph":
        state.sphDocument.forEach((item, index) => {
          if (!item.file || !item.notes) {
            isDocumentValid = false;
          }
        });
      case "npwp":
        state.npwpDocument.forEach((item, index) => {
          if (!item.file || !item.notes) {
            isDocumentValid = false;
          }
        });
      case "dataId":
        state.dataIdDocument.forEach((item, index) => {
          if (!item.file || !item.notes) {
            isDocumentValid = false;
          }
        });
      case "suratVendor":
        state.suratVendorDocument.forEach((item, index) => {
          if (!item.file || !item.notes) {
            isDocumentValid = false;
          }
        });
    }
    setIsSupportingDataValid(isDocumentValid)

  }, [state.spkDocument, state.sphDocument, state.npwpDocument, state.dataIdDocument, state.suratVendorDocument])

  const checkPICEmailIsValid = (data) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(data);
  };

  return (
    <>
      <Head>
        <title>Bumame CMS</title>
        <link
          rel="icon"
          href={`${
            process.env.NEXT_PUBLIC_PREFIX_URL || "/housecall"
          }/favicon.ico`}
        />
      </Head>
      <Transition appear show={isCorporateFormOpen}>
        <Card
          rounded={`rounded-lg`}
          shadow={`shadow-lg`}
          padding={`p-7`}
          className={`mb-5`}
        >
          <Formik
            validationSchema={validationSchema}
            // enableReinitialize
            initialValues={state}
            onSubmit={() => setShowModals(true)}
          >
            {(formik) => {
              return (
                <Form>
                  <div>
                    <Typography
                      className={`font-medium text-lg text-[#212121]`}
                    >
                      Corporate Identity
                    </Typography>
                  </div>
                  <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                    <div>
                      <Label>Name Corporate</Label>
                      <Field
                        component={Input}
                        name="name"
                        type={`text`}
                        onChange={(e) =>
                          setState({ ...state, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Total User</Label>
                      <Field
                        component={Input}
                        name="totalUser"
                        type={`number`}
                        onChange={(e) =>
                          setState({ ...state, totalUser: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                    <div>
                      <Label>Brand Corporate</Label>
                      <Field
                        component={Input}
                        name="brand"
                        type={`text`}
                        onChange={(e) =>
                          setState({ ...state, brand: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Field
                        component={Input}
                        name="phone"
                        type={`text`}
                        onChange={(e) =>
                          setState({ ...state, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                    <div>
                      <Label>Code Corporate</Label>
                      <Field
                        component={Input}
                        name="code"
                        type={`text`}
                        onChange={(e) =>
                          setState({ ...state, code: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Tax ID</Label>
                      <Field
                        component={Input}
                        name="taxId"
                        type={`text`}
                        onChange={(e) =>
                          setState({ ...state, taxId: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                    <div>
                      <Label>Categories</Label>
                      <Field
                        component={Input}
                        name="catagories"
                        type={`text`}
                        onChange={(e) =>
                          setState({ ...state, catagories: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>AR Due Days</Label>
                      <Field
                        component={Input}
                        name="ArDueDate"
                        type={`number`}
                        onChange={(e) =>
                          setState({ ...state, arDueDate: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <Typography className={`font-medium text-lg text-[#212121]`}>
                    Address
                  </Typography>
                  <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                    <div>
                      <Label>Address</Label>
                      <Field
                        component={Input}
                        name="address"
                        type={`text`}
                        onChange={(e) =>
                          setState({ ...state, address: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Subdistrict</Label>
                      <Field
                        component={Input}
                        name="subdistrict"
                        type={`text`}
                        onChange={(e) =>
                          setState({ ...state, subDistinct: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                    <div>
                      <Label>Province</Label>
                      <Field
                        component={Input}
                        name="province"
                        type={`text`}
                        onChange={(e) =>
                          setState({ ...state, province: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>RT</Label>
                      <Field
                        component={Input}
                        name="rt"
                        type={`text`}
                        onChange={(e) =>
                          setState({ ...state, rt: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                    <div>
                      <Label>City</Label>
                      <Field
                        component={Input}
                        name="city"
                        type={`text`}
                        onChange={(e) =>
                          setState({ ...state, city: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>RW</Label>
                      <Field
                        component={Input}
                        name="rw"
                        type={`text`}
                        onChange={(e) =>
                          setState({ ...state, rw: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                    <div>
                      <Label>District</Label>
                      <Field
                        component={Input}
                        name="district"
                        type={`text`}
                        onChange={(e) =>
                          setState({ ...state, district: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <Typography className="font-medium text-lg">
                    PIC
                  </Typography>
                  {state.pics.map((data, key) => {
                    return (
                      <div key={key}>
                        <div className="grid gap-16 mb-6 md:grid-cols-3">
                          <div>
                            <Label>PIC Name </Label>
                            <Field
                              component={Input}
                              type={"text"}
                              name={key != 2 ? `picName${key + 1}` : "picname"}
                              onChange={(e) =>
                                onChangeData(e, data.index, "name")
                              }
                            />
                          </div>
                          <div>
                            <Label>Contact PIC </Label>
                            <Field
                              component={Input}
                              type={"text"}
                              name={
                                key != 2 ? `picContact${key + 1}` : "piccontact"
                              }
                              onChange={(e) =>
                                onChangeData(e, data.index, "contact")
                              }
                            />
                          </div>
                        </div>
                        <div className="grid gap-16 mb-6 md:grid-cols-3">
                          <div>
                            <Label>Title PIC </Label>
                            <Field
                              component={Input}
                              className="bg-disabledItem !rounded-lg"
                              readonly
                              value={data.title}
                              name={
                                key != 2 ? `picTitle${key + 1}` : "pictitle"
                              }
                              type={"text"}
                            />
                          </div>
                          <div>
                            <Label>Email PIC </Label>
                            <Field
                              component={Input}
                              name={
                                key != 2
                                  ? `picEmail${key + 1}`
                                  : "picOtherEmail"
                              }
                              type={"email"}
                              onChange={(e) =>
                                onChangeData(e, data.index, "email")
                              }
                            />
                          </div>
                        </div>
                        {key !== 2 ? (
                          <div className='grid mb-6 md:grid-cols-3'>
                            <div className='w-100 bg-disabled-btn h-[3px] grid md:grid-cols-2'></div>
                            <div className='w-100 bg-disabled-btn h-[3px] grid md:grid-cols-2'></div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                  <Typography className={`font-medium text-lg text-[#212121]`}>
                    Site
                  </Typography>
                  <div className={`grid gap-16 mb-6 md:grid-cols-3`}>
                    <div>
                      <Label>Assign site</Label>
                      <ReactSelect
                        name="site"
                        placeholder="Select a site"
                        options={siteOptions}
                        defaultValue={
                          selectSite
                            ? {
                                value: selectSite.siteId,
                                label: selectSite.siteName,
                              }
                            : ""
                        }
                        onChange={(val) => handleSelectSite(val)}
                      />
                    </div>
                  </div>
                  <Typography className={`font-medium text-lg text-[#212121]`}>
                    Supporting Data
                  </Typography>
                  <div className={`grid gap-16 mb-6 md:grid-cols-2`}>
                    <div>
                      <Label>
                        <Typography>SPK</Typography>
                      </Label>
                      <Table headColumns={headColumns}>
                        {state.spkDocument.length > 0 ? (
                          state.spkDocument.map((data, key) => {
                            return (
                              <>
                                <tr
                                  key={key}
                                  className={`text-center ${
                                    key % 2 != 0
                                      ? "bg-[#FCFCFC]"
                                      : "bg-[#FFFFFF]"
                                  }`}
                                >
                                  <td className={`py-[24px] text-center`}>
                                    <Typography>{key + 1}</Typography>
                                  </td>
                                  <td
                                    className={`py-[24px] text-start pl-2 w-52`}
                                  >
                                    {/* {data.file !== null ? (
                                <Typography>{data.file.name}</Typography>
                              ) : null} */}
                                    <Typography>{data.file.name}</Typography>
                                  </td>
                                  <td className={`py-[24px] text-start pl-6`}>
                                    <Typography>{data.notes}</Typography>
                                  </td>
                                  <td className={"px-2"}>
                                    <Button
                                      className={`bg-[#F64E60] flex items-center p-2`}
                                      onClick={() => deleteSpkFile(data.index)}
                                      emptyPadding
                                    >
                                      <Image
                                        src={assets.IconTrash}
                                        alt={`Delete icon`}
                                      />
                                    </Button>
                                  </td>
                                </tr>
                              </>
                            );
                          })
                        ) : (
                          <EmptyTable
                            colSpan={3}
                            title={`Supporting data empty`}
                          />
                        )}
                        <tr>
                          <td colSpan="3">
                            <div className="p-[15px]">
                              <Button
                                paddingVertical={`py-1`}
                                paddingHorizontal={`px-6`}
                                background={`bg-pattensBlue hover:bg-btnBlue`}
                                className={
                                  "flex items-center text-btnBlue hover:text-white justify-center"
                                }
                                onClick={() => {
                                  setIsOpenUploadSupportingData(true);
                                }}
                              >
                                <Typography
                                  className={`font-normal text-sm flex items-center justify-center`}
                                >
                                  <span className="font-bold text-2xl pb-1.5 pr-2">
                                    +
                                  </span>{" "}
                                  Add File
                                </Typography>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </Table>
                    </div>
                    <div>
                      <Label>
                        <Typography>Surat Penawaran Harga</Typography>
                      </Label>
                      <Table headColumns={headColumns}>
                        {state.sphDocument.length > 0 ? (
                          state.sphDocument.map((data, key) => {
                            return (
                              <>
                                <tr
                                  key={key}
                                  className={`text-center ${
                                    key % 2 != 0
                                      ? "bg-[#FCFCFC]"
                                      : "bg-[#FFFFFF]"
                                  }`}
                                >
                                  <td className={`py-[24px] text-center`}>
                                    <Typography>{key + 1}</Typography>
                                  </td>
                                  <td
                                    className={`py-[24px] text-start pl-2 w-52`}
                                  >
                                    {data.file.name !== null ? (
                                      <Typography>{data.file.name}</Typography>
                                    ) : null}
                                  </td>
                                  <td className={`py-[24px] text-start pl-6`}>
                                    <Typography>{data.notes}</Typography>
                                  </td>
                                  <td className={"px-2"}>
                                    <Button
                                      className={`bg-[#F64E60] flex items-center p-2`}
                                      onClick={() => deleteSphFile(data.index)}
                                      emptyPadding
                                    >
                                      <Image
                                        src={assets.IconTrash}
                                        alt={`Delete icon`}
                                      />
                                    </Button>
                                  </td>
                                </tr>
                              </>
                            );
                          })
                        ) : (
                          <EmptyTable
                            colSpan={3}
                            title={`Supporting data empty`}
                          />
                        )}
                        <tr>
                          <td colSpan="3">
                            <div className="p-[15px]">
                              <Button
                                paddingVertical={`py-1`}
                                paddingHorizontal={`px-6`}
                                background={`bg-pattensBlue hover:bg-btnBlue`}
                                className={
                                  "flex items-center text-btnBlue hover:text-white justify-center"
                                }
                                onClick={() => setIsOpenUploadSphData(true)}
                              >
                                <Typography
                                  className={`font-normal text-sm flex items-center justify-center`}
                                >
                                  <span className="font-bold text-2xl pb-1.5 pr-2">
                                    +
                                  </span>{" "}
                                  Add File
                                </Typography>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </Table>
                    </div>
                  </div>
                  <div className={`grid gap-16 mb-6 md:grid-cols-2`}>
                    <div>
                      <Label>
                        <Typography>NPWP</Typography>
                      </Label>
                      <Table headColumns={headColumns}>
                        {state.npwpDocument.length > 0 ? (
                          state.npwpDocument.map((data, key) => {
                            return (
                              <>
                                <tr
                                  key={key}
                                  className={`text-center ${
                                    key % 2 != 0
                                      ? "bg-[#FCFCFC]"
                                      : "bg-[#FFFFFF]"
                                  }`}
                                >
                                  <td className={`py-[24px] text-center`}>
                                    <Typography>{key + 1}</Typography>
                                  </td>
                                  <td
                                    className={`py-[24px] text-start pl-2 w-52`}
                                  >
                                    {data.file.name !== null ? (
                                      <Typography>{data.file.name}</Typography>
                                    ) : null}
                                  </td>
                                  <td className={`py-[24px] text-start pl-6`}>
                                    <Typography>{data.notes}</Typography>
                                  </td>
                                  <td className={"px-2"}>
                                    <Button
                                      className={`bg-[#F64E60] flex items-center p-2`}
                                      onClick={() => deleteNpwpFile(data.index)}
                                      emptyPadding
                                    >
                                      <Image
                                        src={assets.IconTrash}
                                        alt={`Delete icon`}
                                      />
                                    </Button>
                                  </td>
                                </tr>
                              </>
                            );
                          })
                        ) : (
                          <EmptyTable
                            colSpan={3}
                            title={`Supporting data empty`}
                          />
                        )}
                        <tr>
                          <td colSpan="3">
                            <div className="p-[15px]">
                              <Button
                                paddingVertical={`py-1`}
                                paddingHorizontal={`px-6`}
                                background={`bg-pattensBlue hover:bg-btnBlue`}
                                className={
                                  "flex items-center text-btnBlue hover:text-white justify-center"
                                }
                                onClick={() => setIsOpenUploadNpwpData(true)}
                              >
                                <Typography
                                  className={`font-normal text-sm flex items-center justify-center`}
                                >
                                  <span className="font-bold text-2xl pb-1.5 pr-2">
                                    +
                                  </span>{" "}
                                  Add File
                                </Typography>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </Table>
                    </div>
                    <div>
                      <Label>
                        <Typography>
                          Data ID (KTP/Passport) karyawaan yang di swab
                        </Typography>
                      </Label>
                      <Table headColumns={headColumns}>
                        {state.dataIdDocument.length > 0 ? (
                          state.dataIdDocument.map((data, key) => {
                            return (
                              <>
                                <tr
                                  key={key}
                                  className={`text-center ${
                                    key % 2 != 0
                                      ? "bg-[#FCFCFC]"
                                      : "bg-[#FFFFFF]"
                                  }`}
                                >
                                  <td className={`py-[24px] text-center`}>
                                    <Typography>{key + 1}</Typography>
                                  </td>
                                  <td
                                    className={`py-[24px] text-start pl-2 w-52`}
                                  >
                                    {data.file.name !== null ? (
                                      <Typography>{data.file.name}</Typography>
                                    ) : null}
                                  </td>
                                  <td className={`py-[24px] text-start pl-6`}>
                                    <Typography>{data.notes}</Typography>
                                  </td>
                                  <td className={"px-2"}>
                                    <Button
                                      className={`bg-[#F64E60] flex items-center p-2`}
                                      onClick={() =>
                                        deleteDataIdFile(data.index)
                                      }
                                      emptyPadding
                                    >
                                      <Image
                                        src={assets.IconTrash}
                                        alt={`Delete icon`}
                                      />
                                    </Button>
                                  </td>
                                </tr>
                              </>
                            );
                          })
                        ) : (
                          <EmptyTable
                            colSpan={3}
                            title={`Supporting data empty`}
                          />
                        )}
                        <tr>
                          <td colSpan="3">
                            <div className="p-[15px]">
                              <Button
                                paddingVertical={`py-1`}
                                paddingHorizontal={`px-6`}
                                background={`bg-pattensBlue hover:bg-btnBlue`}
                                className={
                                  "flex items-center text-btnBlue hover:text-white justify-center"
                                }
                                onClick={() => setIsOpenUploaddDataIdData(true)}
                              >
                                <Typography
                                  className={`font-normal text-sm flex items-center justify-center`}
                                >
                                  <span className="font-bold text-2xl pb-1.5 pr-2">
                                    +
                                  </span>{" "}
                                  Add File
                                </Typography>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </Table>
                    </div>
                  </div>
                  <div className={`grid gap-16 mb-6 md:grid-cols-2`}>
                    <div>
                      <Label>
                        <Typography>Surat Vendor</Typography>
                      </Label>
                      <Table headColumns={headColumns}>
                        {state.suratVendorDocument.length > 0 ? (
                          state.suratVendorDocument.map((data, key) => {
                            return (
                              <>
                                <tr
                                  key={key}
                                  className={`text-center ${
                                    key % 2 != 0
                                      ? "bg-[#FCFCFC]"
                                      : "bg-[#FFFFFF]"
                                  }`}
                                >
                                  <td className={`py-[24px] text-center`}>
                                    <Typography>{key + 1}</Typography>
                                  </td>
                                  <td
                                    className={`py-[24px] text-start pl-2 w-52`}
                                  >
                                    {data.file.name !== null ? (
                                      <Typography>{data.file.name}</Typography>
                                    ) : null}
                                  </td>
                                  <td className={`py-[24px] text-start pl-6`}>
                                    <Typography>{data.notes}</Typography>
                                  </td>
                                  <td className={"px-2"}>
                                    <Button
                                      className={`bg-[#F64E60] flex items-center p-2`}
                                      onClick={() =>
                                        deleteSuratVendorFile(data.index)
                                      }
                                      emptyPadding
                                    >
                                      <Image
                                        src={assets.IconTrash}
                                        alt={`Delete icon`}
                                      />
                                    </Button>
                                  </td>
                                </tr>
                              </>
                            );
                          })
                        ) : (
                          <EmptyTable
                            colSpan={3}
                            title={`Supporting data empty`}
                          />
                        )}
                        <tr>
                          <td colSpan="3">
                            <div className="p-[15px]">
                              <Button
                                paddingVertical={`py-1`}
                                paddingHorizontal={`px-6`}
                                background={`bg-pattensBlue hover:bg-btnBlue`}
                                className={
                                  "flex items-center text-btnBlue hover:text-white justify-center"
                                }
                                onClick={() =>
                                  setIsOpenUploaddSuratVendorData(true)
                                }
                              >
                                <Typography
                                  className={`font-normal text-sm flex items-center justify-center`}
                                >
                                  <span className="font-bold text-2xl pb-1.5 pr-2">
                                    +
                                  </span>{" "}
                                  Add File
                                </Typography>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </Table>
                    </div>
                  </div>
                  <div className="flex justify-center mt-6">
                    <Button
                      paddingVertical={`py-2`}
                      paddingHorizontal={`px-7`}
                      background={`bg-btnBlue`}
                      className={`disabled:bg-btn-cancel disabled:text-black`}
                      type={`submit`}
                      disabled={!isFormValid || !sendSite}
                      onClick={() => setShowModals(true)}
                    >
                      <Typography className={`text-white font-normal text-sm`}>
                        Save
                      </Typography>
                    </Button>
                    <Button
                      paddingVertical={`py-2`}
                      paddingHorizontal={`px-7`}
                      background={`bg-btn-cancel`}
                      className={`ml-2`}
                      onClick={() => HandleCencel()}
                    >
                      <Typography className={` font-normal text-sm`}>
                        Cancel
                      </Typography>
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Card>

        <Modal
          setIsOpen={(val) => setIsOpenUploadSupportingData(val)}
          width={`w-[50rem]`}
          title={`Supporting Data`}
          isOpen={state.isOpenUploadSupportingData}
        >
          <form className={`flex flex-col w-full items-center`}>
            <div className={`flex flex-col w-full items-center justify-start`}>
              <div className={`flex flex-row w-full`}>
                <div className={`w-6/12 mr-2`}>
                  <Typography className={`pl-1 font-normal text-sm`}>
                    File
                  </Typography>
                </div>
                <div className={`w-5/12`}>
                  <Typography className={`pl-1 font-normal text-sm`}>
                    Note
                  </Typography>
                </div>
                <div className={`w-1/12 ml-2`}></div>
              </div>
              {state.spkDocument.length > 0 &&
                state.spkDocument.map((item, key) => {
                  return (
                    <div
                      className={`flex flex-row w-full items-center pb-3`}
                      key={key}
                    >
                      <div className={`w-6/12 mr-2`}>
                        <div className={`border p-3 rounded-md`}>
                          <InputFile
                            onChange={(e) => onChangeBrowseFile(e, item.index)}
                            name={`file[${item.index}]`}
                            fileName={
                              item.file?.name &&
                              item.file?.name.substring(0, 12) + "..."
                            }
                            className={`bg-[#1BC5BD] text-[#FFF]`}
                            isWhite
                          />
                        </div>
                      </div>
                      <div className={`w-5/12 mx-2`}>
                        <Textarea
                          cols={4}
                          name={`note[${item.index}]`}
                          className={"resize-none"}
                          onChange={(e) => onChangeSpkNote(e, item.index)}
                        />
                      </div>
                      <div className={`w-1/12 ml-2 justify-self-end`}>
                        {key > 0 && (
                          <Button
                            className={`bg-[#F64E60] flex items-center p-2`}
                            onClick={() => deleteSpkFile(item.index)}
                            emptyPadding
                          >
                            <Image src={assets.IconTrash} alt={`Delete icon`} />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              <div className={`py-4 w-full`}>
                <Button
                  // disabled={disabled}
                  paddingVertical={`py-2`}
                  paddingHorizontal={`px-5`}
                  background={`bg-pattensBlue`}
                  className={`flex justify-between items-center text-btnBlue`}
                  onClick={() => addSpkDocument()}
                >
                  <Image src={assets.IconPlusBlue} alt={`Create button`} />
                  <Typography className={`pl-1 font-normal text-sm`}>
                    Add File
                  </Typography>
                </Button>
              </div>
            </div>
            <div className={`pt-6`}>
              <Button
                className={
                  isSupportingDataValid
                    ? `bg-btnBlue text-white mr-5`
                    : `bg-gray-300 text-white mr-5`
                }
                onClick={() => setIsOpenUploadSupportingData(false)}
                disabled={!isSupportingDataValid}
              >
                {/* onClick={() => handleUploadDocument()}> */}
                <Typography>Upload</Typography>
              </Button>
              <Button
                onClick={() => {
                  state.spkDocument.splice(0, state.spkDocument.length)
                  setIsOpenUploadSupportingData(false)
                }}
                className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black`}
              >
                <Typography>No</Typography>
              </Button>
            </div>
          </form>
        </Modal>

        <Modal
          setIsOpen={(val) => setIsOpenUploadSphData(val)}
          width={`w-[50rem]`}
          title={`Supporting Data`}
          isOpen={state.isOpenUploadSphData}
        >
          <form className={`flex flex-col w-full items-center`}>
            <div className={`flex flex-col w-full items-center justify-start`}>
              <div className={`flex flex-row w-full`}>
                <div className={`w-6/12 mr-2`}>
                  <Typography className={`pl-1 font-normal text-sm`}>
                    File
                  </Typography>
                </div>
                <div className={`w-5/12`}>
                  <Typography className={`pl-1 font-normal text-sm`}>
                    Note
                  </Typography>
                </div>
                <div className={`w-1/12 ml-2`}></div>
              </div>
              {state.sphDocument.length >= 0 &&
                state.sphDocument.map((item, key) => {
                  return (
                    <div
                      className={`flex flex-row w-full items-center pb-3`}
                      key={key}
                    >
                      <div className={`w-6/12 mr-2`}>
                        <div className={`border p-3 rounded-md`}>
                          <InputFile
                            onChange={(e) =>
                              onChangeBrowseSphFile(e, item.index)
                            }
                            name={`file[${item.index}]`}
                            fileName={
                              item.file?.name &&
                              item.file?.name.substring(0, 12) + "..."
                            }
                            className={`bg-[#1BC5BD] text-[#FFF]`}
                            isWhite
                          />
                        </div>
                      </div>
                      <div className={`w-5/12 mx-2`}>
                        <Textarea
                          cols={4}
                          name={`note[${item.index}]`}
                          className={"resize-none"}
                          onChange={(e) => onChangeSphNote(e, item.index)}
                        />
                      </div>
                      <div className={`w-1/12 ml-2 justify-self-end`}>
                        {key > 0 && (
                          <Button
                            className={`bg-[#F64E60] flex items-center p-2`}
                            onClick={() => deleteSphFile(item.index)}
                            emptyPadding
                          >
                            <Image src={assets.IconTrash} alt={`Delete icon`} />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              <div className={`py-4 w-full`}>
                <Button
                  paddingVertical={`py-2`}
                  paddingHorizontal={`px-5`}
                  background={`bg-pattensBlue`}
                  className={`flex justify-between items-center text-btnBlue`}
                  onClick={() => addSphDocument()}
                >
                  <Image src={assets.IconPlusBlue} alt={`Create button`} />
                  <Typography className={`pl-1 font-normal text-sm`}>
                    Add File
                  </Typography>
                </Button>
              </div>
            </div>
            <div className={`pt-6`}>
              <Button
                className={
                  isSupportingDataValid
                    ? `bg-btnBlue text-white mr-5`
                    : `bg-gray-300 text-white mr-5`
                }
                onClick={() => setIsOpenUploadSphData(false)}
                disabled={!isSupportingDataValid}
              >
                <Typography>Upload</Typography>
              </Button>
              <Button
                onClick={() => {
                  state.sphDocument.splice(0, state.sphDocument.length)
                  setIsOpenUploadSphData(false)
                }}
                className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black`}
              >
                <Typography>No</Typography>
              </Button>
            </div>
          </form>
        </Modal>

        {/* NPWP */}
        <Modal
          setIsOpen={(val) => setIsOpenUploadNpwpData(val)}
          width={`w-[50rem]`}
          title={`Supporting Data`}
          isOpen={state.isOpenUploadNpwpData}
        >
          <form className={`flex flex-col w-full items-center`}>
            <div className={`flex flex-col w-full items-center justify-start`}>
              <div className={`flex flex-row w-full`}>
                <div className={`w-6/12 mr-2`}>
                  <Typography className={`pl-1 font-normal text-sm`}>
                    File
                  </Typography>
                </div>
                <div className={`w-5/12`}>
                  <Typography className={`pl-1 font-normal text-sm`}>
                    Note
                  </Typography>
                </div>
                <div className={`w-1/12 ml-2`}></div>
              </div>
              {state.npwpDocument.length > 0 &&
                state.npwpDocument.map((item, key) => {
                  return (
                    <div
                      className={`flex flex-row w-full items-center pb-3`}
                      key={key}
                    >
                      <div className={`w-6/12 mr-2`}>
                        <div className={`border p-3 rounded-md`}>
                          <InputFile
                            onChange={(e) =>
                              onChangeBrowseNpwpFile(e, item.index)
                            }
                            name={`file[${item.index}]`}
                            fileName={
                              item.file?.name &&
                              item.file?.name.substring(0, 12) + "..."
                            }
                            className={`bg-[#1BC5BD] text-[#FFF]`}
                            isWhite
                          />
                        </div>
                      </div>
                      <div className={`w-5/12 mx-2`}>
                        <Textarea
                          cols={4}
                          name={`note[${item.index}]`}
                          className={"resize-none"}
                          onChange={(e) => onChangeNpwpNote(e, item.index)}
                        />
                      </div>
                      <div className={`w-1/12 ml-2 justify-self-end`}>
                        {key > 0 && (
                          <Button
                            className={`bg-[#F64E60] flex items-center p-2`}
                            onClick={() => deleteNpwpFile(item.index)}
                            emptyPadding
                          >
                            <Image src={assets.IconTrash} alt={`Delete icon`} />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              <div className={`py-4 w-full`}>
                <Button
                  paddingVertical={`py-2`}
                  paddingHorizontal={`px-5`}
                  background={`bg-pattensBlue`}
                  className={`flex justify-between items-center text-btnBlue`}
                  onClick={() => addNpwpDocument()}
                >
                  <Image src={assets.IconPlusBlue} alt={`Create button`} />
                  <Typography className={`pl-1 font-normal text-sm`}>
                    Add File
                  </Typography>
                </Button>
              </div>
            </div>
            <div className={`pt-6`}>
              <Button
                className={
                  isSupportingDataValid
                    ? `bg-btnBlue text-white mr-5`
                    : `bg-gray-300 text-white mr-5`
                }
                onClick={() => setIsOpenUploadNpwpData(false)}
                disabled={!isSupportingDataValid}
              >
                <Typography>Upload</Typography>
              </Button>
              <Button
                onClick={() => {
                  state.npwpDocument.splice(0, state.npwpDocument.length)
                  setIsOpenUploadNpwpData(false)
                }}
                className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black`}
              >
                <Typography>No</Typography>
              </Button>
            </div>
          </form>
        </Modal>

        {/* Data Id */}
        <Modal
          setIsOpen={(val) => setIsOpenUploaddDataIdData(val)}
          width={`w-[50rem]`}
          title={`Supporting Data`}
          isOpen={state.isOpenUploadDataIdData}
        >
          <form className={`flex flex-col w-full items-center`}>
            <div className={`flex flex-col w-full items-center justify-start`}>
              <div className={`flex flex-row w-full`}>
                <div className={`w-6/12 mr-2`}>
                  <Typography className={`pl-1 font-normal text-sm`}>
                    File
                  </Typography>
                </div>
                <div className={`w-5/12`}>
                  <Typography className={`pl-1 font-normal text-sm`}>
                    Note
                  </Typography>
                </div>
                <div className={`w-1/12 ml-2`}></div>
              </div>
              {state.dataIdDocument.length > 0 &&
                state.dataIdDocument.map((item, key) => {
                  return (
                    <div
                      className={`flex flex-row w-full items-center pb-3`}
                      key={key}
                    >
                      <div className={`w-6/12 mr-2`}>
                        <div className={`border p-3 rounded-md`}>
                          <InputFile
                            onChange={(e) =>
                              onChangeBrowseDataIdFile(e, item.index)
                            }
                            name={`file[${item.index}]`}
                            fileName={
                              item.file?.name &&
                              item.file?.name.substring(0, 12) + "..."
                            }
                            className={`bg-[#1BC5BD] text-[#FFF]`}
                            isWhite
                          />
                        </div>
                      </div>
                      <div className={`w-5/12 mx-2`}>
                        <Textarea
                          cols={4}
                          name={`note[${item.index}]`}
                          className={"resize-none"}
                          onChange={(e) => onChangeDataIdNote(e, item.index)}
                        />
                      </div>
                      <div className={`w-1/12 ml-2 justify-self-end`}>
                        {key > 0 && (
                          <Button
                            className={`bg-[#F64E60] flex items-center p-2`}
                            onClick={() => deleteDataIdFile(item.index)}
                            emptyPadding
                          >
                            <Image src={assets.IconTrash} alt={`Delete icon`} />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              <div className={`py-4 w-full`}>
                <Button
                  paddingVertical={`py-2`}
                  paddingHorizontal={`px-5`}
                  background={`bg-pattensBlue`}
                  className={`flex justify-between items-center text-btnBlue`}
                  onClick={() => adddataIdDocument()}
                >
                  <Image src={assets.IconPlusBlue} alt={`Create button`} />
                  <Typography className={`pl-1 font-normal text-sm`}>
                    Add File
                  </Typography>
                </Button>
              </div>
            </div>
            <div className={`pt-6`}>
              <Button
                className={
                  isSupportingDataValid
                    ? `bg-btnBlue text-white mr-5`
                    : `bg-gray-300 text-white mr-5`
                }
                onClick={() => setIsOpenUploaddDataIdData(false)}
                disabled={!isSupportingDataValid}
              >
                <Typography>Upload</Typography>
              </Button>
              <Button
                onClick={() => {
                  state.dataIdDocument.splice(0, state.dataIdDocument.length)
                  setIsOpenUploaddDataIdData(false)
                }}
                className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black`}
              >
                <Typography>No</Typography>
              </Button>
            </div>
          </form>
        </Modal>

        {/* Surat Vendor */}
        <Modal
          setIsOpen={(val) => setIsOpenUploaddSuratVendorData(val)}
          width={`w-[50rem]`}
          title={`Supporting Data`}
          isOpen={state.isOpenUploadSuratVendorData}
        >
          <form className={`flex flex-col w-full items-center`}>
            <div className={`flex flex-col w-full items-center justify-start`}>
              <div className={`flex flex-row w-full`}>
                <div className={`w-6/12 mr-2`}>
                  <Typography className={`pl-1 font-normal text-sm`}>
                    File
                  </Typography>
                </div>
                <div className={`w-5/12`}>
                  <Typography className={`pl-1 font-normal text-sm`}>
                    Note
                  </Typography>
                </div>
                <div className={`w-1/12 ml-2`}></div>
              </div>
              {state.suratVendorDocument.length > 0 &&
                state.suratVendorDocument.map((item, key) => {
                  return (
                    <div
                      className={`flex flex-row w-full items-center pb-3`}
                      key={key}
                    >
                      <div className={`w-6/12 mr-2`}>
                        <div className={`border p-3 rounded-md`}>
                          <InputFile
                            onChange={(e) =>
                              onChangeBrowseSuratVendorFile(e, item.index)
                            }
                            name={`file[${item.index}]`}
                            fileName={
                              item.file?.name &&
                              item.file?.name.substring(0, 12) + "..."
                            }
                            className={`bg-[#1BC5BD] text-[#FFF]`}
                            isWhite
                          />
                        </div>
                      </div>
                      <div className={`w-5/12 mx-2`}>
                        <Textarea
                          cols={4}
                          name={`note[${item.index}]`}
                          className={"resize-none"}
                          onChange={(e) =>
                            onChangeSuratVendorNote(e, item.index)
                          }
                        />
                      </div>
                      <div className={`w-1/12 ml-2 justify-self-end`}>
                        {key > 0 && (
                          <Button
                            className={`bg-[#F64E60] flex items-center p-2`}
                            onClick={() => deleteSuratVendorFile(item.index)}
                            emptyPadding
                          >
                            <Image src={assets.IconTrash} alt={`Delete icon`} />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              <div className={`py-4 w-full`}>
                <Button
                  paddingVertical={`py-2`}
                  paddingHorizontal={`px-5`}
                  background={`bg-pattensBlue`}
                  className={`flex justify-between items-center text-btnBlue`}
                  onClick={() => addSuratVendor()}
                >
                  <Image src={assets.IconPlusBlue} alt={`Create button`} />
                  <Typography className={`pl-1 font-normal text-sm`}>
                    Add File
                  </Typography>
                </Button>
              </div>
            </div>
            <div className={`pt-6`}>
              <Button
                className={
                  isSupportingDataValid
                    ? `bg-btnBlue text-white mr-5`
                    : `bg-gray-300 text-white mr-5`
                }
                onClick={() => setIsOpenUploaddSuratVendorData(false)}
                disabled={!isSupportingDataValid}
              >
                <Typography>Upload</Typography>
              </Button>
              <Button
                onClick={() => {
                  state.suratVendorDocument.splice(0,state.suratVendorDocument.length)
                  setIsOpenUploaddSuratVendorData(false)
                }}
                className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black`}
              >
                <Typography>No</Typography>
              </Button>
            </div>
          </form>
        </Modal>
        <ModalConfirmation
          isLoading={onSubmit}
          show={showModals}
          confirmation={"Confirmation"}
          handleYes={() => {
            submitDataCorporateForm();
          }}
          onHide={() => setShowModals(false)}
          desc1={`No OTP dan Link URL akan dikirim ke PIC Operasional dengan no handphone berikut ${state.pics[1].contact}`}
        />
        <ModalSuccess
          show={successModal}
          onHide={() => {
            setSuccessModal(false);
            router.push("/master-corporate");
          }}
          desc1={`No OTP dan link URL berhasil dikirim ke PIC Operasional dengan no handphone berikut ${state.pics[1].contact}`}
        />
        <Modal
          setIsOpen={(val) => setErrorModal(val)}
          width={`w-[27rem]`}
          title={`Error`}
          headless
          isOpen={errorModal}
        >
          <div>
            <Image src={assets.IconCross} alt={`Error dialog image`} />
          </div>
          <div className={`pt-10`}>
            <Typography>{errorMessage}</Typography>
          </div>
          <div className={`pt-10`}>
            <Button
              onClick={() => {
                setErrorModal(false);
              }}
              className={`bg-[#349EFF] rounded-lg hover:bg-[#349EFF] text-white`}
            >
              <Typography>OK</Typography>
            </Button>
          </div>
        </Modal>
      </Transition>
    </>
  );
};

export default CorporateForm;
