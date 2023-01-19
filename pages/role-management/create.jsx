import assets from "@/public/index";
import { Button, Card, Input, Label, Modal, Select, Typography } from "@atoms";
import Messages from "@constants/PopUpMessage";
import { MainLayout } from "@organisms";
import {
  createRole,
  deleteRole,
  fetchRoleTypes,
} from "components/store/actions/role";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Formik, Field, Form } from "formik";
import Checkbox from "components/atoms/Checkbox/Checkbox";
import * as Yup from "yup";
import { fetchSidebar } from "components/store/actions/sidebar";
import ModalConfirmation from "../../components/Modals/ModalConfirmation";

const { useRouter } = require("next/router");
const { useSelector, useDispatch } = require("react-redux");

const RoleManagementCreate = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const ref = useRef();
  const selector = useSelector((state) => state);
  const { role, sidebar } = selector;
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);
  const [isOpenErrorDialog, setIsOpenErrorDialog] = useState(false);
  const [state, setState] = useState({
    headline: "Role Management",
    breadcrumbs: [
      { link: "/role-management", name: "List Role Management" },
      { link: `/role-management/create`, name: "Create" },
    ],
    formInitialValue: role.initialValue,
    isOpenConfirmationDialog: false,
  });

  const setIsOpenConfirmationDialog = (value, ...props) => {
    if (props[0] && props[0] === "submit") {
      setOnSubmit(true);
      dispatch(createRole(ref.current.values))
        .then((res) => {
          if (res?.isSuccess && res?.statusCode === 200) {
            setShowSuccessModal(true);
          } else {
            setOnSubmit(false);
            setIsOpenErrorDialog(true);
            setState({
              ...state,
              isOpenConfirmationDialog: value,
            });
          }
        })
        .catch((err) => {
          setOnSubmit(false);
          alert(role.alert.message);
          setState({ ...state, isOpenConfirmationDialog: value });
        });
    } else {
      setState({ ...state, isOpenConfirmationDialog: value });
    }
  };

  const setAllPermission = (e) => {
    if (e.target.checked) {
      ref.current.setFieldValue(
        "listModuleCode",
        sidebar.modules.map((item) => item.moduleCode)
      );
    } else {
      ref.current.setFieldValue("listModuleCode", []);
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("This field is required"),
    roleType: Yup.string().required("This field is required"),
  });

  useEffect(() => {
    if (!role.selectListRoleType || role.selectListRoleType.length === 0) {
      dispatch(fetchRoleTypes());
    }
    dispatch(fetchSidebar());
  }, [dispatch, role.selectListRoleType, sidebar.modules.length]);

  return (
    <>
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
            initialValues={state.formInitialValue}
            onSubmit={(values) => {
              // same shape as initial values
              setState({
                ...state,
                formInitialValue: values,
                isOpenConfirmationDialog: true,
              });
            }}
            enableReinitialize
            innerRef={ref}
            validationSchema={validationSchema}
          >
            <Form>
              <div
                className="grid gap-x-16 gap-y-6 mb-2 grid-cols-1 lg:grid-cols-3"
              >
                <div>
                  <Label htmlFor={"name"}>Nama Role</Label>
                  <Field
                    name="name"
                    placeholder={`Role Name`}
                    component={Input}
                  />
                </div>
                <div className={`hidden lg:block`}></div>
                <div className={`hidden lg:block`}></div>
                <div>
                  <Label htmlFor={"roleType"}>Type Role</Label>
                  <Field
                    name="roleType"
                    placeholder={`Role Type`}
                    component={Select}
                  >
                    <option value={``}>Select Role Type</option>
                    {role.selectListRoleType.length > 0 &&
                      role.selectListRoleType.map((item, key) => {
                        return (
                          <option key={key} value={`${item.roleType}`}>
                            {item.roleTypeDescription}
                          </option>
                        );
                      })}
                  </Field>
                </div>
                <div className={`hidden lg:block`}></div>
                <div className={`hidden lg:block`}></div>
              </div>
              <div className={`grid grid-cols-1 lg:grid-cols-2`}>
                <div>
                  <Label htmlFor={"permission"}>Hak Akses</Label>
                  <div className={`grid grid-cols-1 lg:grid-cols-2`}>
                    <Checkbox
                      name={`all`}
                      value={`all`}
                      label={`All`}
                      onChange={setAllPermission}
                      checked={
                        ref.current?.values.listModuleCode.length ===
                        sidebar.modules.length
                      }
                    />
                    {sidebar.modules.length > 0 &&
                      sidebar.modules.map((item, key) => {
                        return (
                          <Field
                            name={`listModuleCode`}
                            value={item.moduleCode}
                            component={Checkbox}
                            label={`${item.moduleName}`}
                            key={key}
                            isGroup
                          />
                        );
                      })}
                  </div>
                </div>
                <div className={`hidden lg:block`}></div>
              </div>
              <div className="grid gap-x-16 gap-y-6 mb-2 grid-cols-1 lg:grid-cols-1 mt-4">
                <div className="m-auto">
                  <Button
                    className="bg-btnBlue rounded-lg hover:bg-hover-btnBlue text-white mr-6"
                    type={`submit`}
                  >
                    <Typography className="font-normal text-sm">
                      Save
                    </Typography>
                  </Button>
                  <Button
                    className="bg-btn-cancel rounded-lg hover:bg-hover-btnCancel text-black"
                    onClick={() => {
                      router.back();
                    }}
                  >
                    <Typography>Cancel</Typography>
                  </Button>
                </div>
              </div>
            </Form>
          </Formik>
        </Card>
        {isOpenErrorDialog && (
          <Modal
            setIsOpen={(val) => {
              setIsOpenErrorDialog(val);
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
              {
                "Simpan data Gagal. \nData tidak berhasil disimpan, silahkan coba lagi"
              }
            </Typography>
            <div className={`pt-10`}>
              <Button
                onClick={() => {
                  setIsOpenErrorDialog(false);
                }}
                className="bg-btnBlue rounded-lg hover:bg-hover-btnBlue text-white"
              >
                <Typography>OK</Typography>
              </Button>
            </div>
          </Modal>
        )}
        <ModalConfirmation
          show={state.isOpenConfirmationDialog}
          confirmation={`Confirmation`}
          onHide={() => setIsOpenConfirmationDialog(false)}
          handleYes={() => {
            setIsOpenConfirmationDialog(false, "submit");
          }}
          desc1={Messages.confirmationSavedData}
          isLoading={onSubmit}
        />
        <Modal
          setIsOpen={(val) => setShowSuccessModal(val)}
          width={`w-[27rem]`}
          title={`Success`}
          isOpen={showSuccessModal}
          headless
        >
          <div>
            <Image
              src={assets.ImageCheckedGreen}
              alt={`Success dialog image`}
            />
          </div>
          <Typography className={`pt-8`}>Data Berhasil disimpan</Typography>
          <div className="flex justify-center pt-8">
            <Button
              onClick={() => router.push("/role-management")}
              color={`white`}
              background={`bg-btnBlue`}
            >
              <Typography className={`text-white font-normal text-sm`}>
                OK
              </Typography>
            </Button>
          </div>
        </Modal>
      </MainLayout>
    </>
  );
};

export default RoleManagementCreate;
