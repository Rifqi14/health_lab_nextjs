import assets from "@/public/index";
import { Button, Card, Input, Label, Modal, Select, Typography } from "@atoms";
import Messages from "@constants/PopUpMessage";
import {
  SIDEBAR,
  SideBarList,
  SIDEBAR_UNALLOWED_MODULE,
} from "@constants/Sidebar";
import { MainLayout } from "@organisms";
import Checkbox from "components/atoms/Checkbox/Checkbox";
import {
  deleteRole,
  fetchRoleModuleAccess,
  fetchRoleTypes,
  updateRole,
} from "components/store/actions/role";
import { fetchSidebar } from "components/store/actions/sidebar";
import { Field, Form, Formik } from "formik";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import ModalConfirmation from "../../../components/Modals/ModalConfirmation";

const { useRouter } = require("next/router");
const { useSelector, useDispatch } = require("react-redux");

const RoleManagementSlug = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const ref = useRef();
  const { slug, code } = router.query;
  const selector = useSelector((state) => state);
  const { role, sidebar, auth } = selector;
  const [showSuccessEditModal, setShowSuccessEditModal] = useState(false);
  const [onEditRole, setOnEditRole] = useState(false);
  const [onDeleteRole, setOnDeleteRole] = useState(false);
  const [isOpenErrorDialog, setIsOpenErrorDialog] = useState(false);
  const [state, setState] = useState({
    headline: "Role Management",
    breadcrumbs: [
      { link: "/role-management", name: "List Role Management" },
      { link: `/role-management/${code}/${slug}`, name: "Edit" },
    ],
    formInitialValue: role.initialValues,
    formEdit: {},
    isReadOnly: false,
    isOpenDeleteDialog: false,
    isOpenConfirmationDialog: false,
    isAll: false,
    showSuccessDeleteModal: false,
  });

  const setIsOpenDeleteDialog = (value, ...props) => {
    if (props[0] && props[0] === "submit") {
      setOnDeleteRole(true);
      dispatch(deleteRole(code)).then((res) => {
        if (res.isSuccess && res.statusCode === 200) {
          setState({
            ...state,
            isOpenDeleteDialog: false,
            showSuccessDeleteModal: true,
          });
          setOnDeleteRole(false);
        }
      });
    }
    setState({
      ...state,
      isOpenDeleteDialog: value,
    });
  };

  const setIsOpenConfirmationDialog = (value, ...props) => {
    if (props[0] && props[0] === "submit") {
      setOnEditRole(true);
      dispatch(updateRole(state.formEdit, code)).then((res) => {
        if (res?.isSuccess && res?.statusCode === 200) {
          if (auth.currentLoginUser?.roleCode === code) {
            dispatch(fetchRoleModuleAccess(auth.currentLoginUser?.roleCode))
              .then((res) => {
                if (res?.isSuccess && res?.statusCode === 200) {
                  setState({ ...state, isOpenConfirmationDialog: value });
                  const roleModules = res?.payload?.roleModules.map((item) => {
                    if (item.statusData === "Active") {
                      return item.moduleCode;
                    }
                  });
                  dispatch({
                    type: SIDEBAR_UNALLOWED_MODULE,
                    payload: res?.payload?.roleModules.map((item) => {
                      if (item.statusData === "Active") {
                        return item.moduleCode;
                      }
                    }),
                  });
                  dispatch({
                    type: SIDEBAR,
                    payload: SideBarList.filter((item) => {
                      if (roleModules?.includes(item.moduleCode)) {
                        return item;
                      }
                    }),
                  });
                }
              })
              .catch((err) => {
                alert("Error setup module access! Please refresh");
                console.log(err);
              });
            setOnEditRole(false);
          }
        } else {
          setState({ ...state, isOpenConfirmationDialog: value });
          setIsOpenErrorDialog(true);
          setOnEditRole(false);
        }
      });
    } else {
      setState({ ...state, isOpenConfirmationDialog: value });
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("This field is required"),
    roleType: Yup.string().required("This field is required"),
  });

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

  const checkAllPermission = () => {
    if (ref.current.values.listModules.length === sidebar.modules.length) {
      setState({ isAll: true });
    }
  };

  useEffect(() => {
    dispatch(fetchSidebar());
    if (slug === "detail") {
      setState({
        ...state,
        formInitialValue: role.roleDetail,
        isReadonly: true,
        breadcrumbs: [
          {
            link: "/role-management",
            name: "List Role Management",
          },
          {
            link: `/role-management/${code}/${slug}`,
            name: "Detail",
          },
        ],
      });
    }
    if (slug === "edit") {
      const listModuleCode = role.roleDetail.roleModules.map(
        (module) => module.moduleCode
      );
      setState({
        ...state,
        formInitialValue: {
          code: role.roleDetail.roleCode,
          name: role.roleDetail.roleName,
          roleType: role.roleDetail.roleType.replace(" ", ""),
          listModuleCode: listModuleCode,
        },
      });
      if (!role.selectListRoleType || role.selectListRoleType.length === 0) {
        dispatch(fetchRoleTypes());
      }
    }
  }, [slug, code]);

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
                formEdit: {
                  name: values.name,
                  roleType: values.roleType,
                  listModuleCode: values.listModuleCode,
                },
                isOpenConfirmationDialog: true,
              });
            }}
            innerRef={ref}
            enableReinitialize={true}
            validationSchema={validationSchema}
          >
            <Form>
              <div
                className={`grid gap-x-16 gap-y-6 mb-2 grid-cols-1 lg:grid-cols-3`}
              >
                <div>
                  <Label htmlFor={`${slug === "detail" ? "roleName" : "name"}`}>
                    Nama Role
                  </Label>
                  <Field
                    component={Input}
                    placeholder={`Role Name`}
                    name={`${slug === "detail" ? "roleName" : "name"}`}
                    readonly={slug === "detail"}
                  />
                </div>
                <div className={`hidden lg:block`}></div>
                <div className={`hidden lg:block place-self-end self-start`}>
                  {slug == "detail" && (
                    <Button
                      className={`bg-[#F64E60] flex items-center px-5`}
                      onClick={() => setIsOpenDeleteDialog(true)}
                    >
                      <div className={`mr-2 flex items-center`}>
                        <Image src={assets.IconTrash} alt={`Delete icon`} />
                      </div>
                      <Typography className={`text-white`}>Delete</Typography>
                    </Button>
                  )}
                </div>
                <div>
                  <Label htmlFor={"roleType"}>Type Role</Label>
                  {slug === "edit" && (
                    <Field
                      name="roleType"
                      placeholder={`Role Type`}
                      component={Select}
                      defaultValue={role.roleDetail.roleType.replace(" ", "")}
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
                  )}
                  {slug === "detail" && (
                    <Field
                      component={Input}
                      placeholder={`Role Type`}
                      name={`roleType`}
                      readonly={slug === "detail"}
                    />
                  )}
                </div>
                <div className={`hidden lg:block`}></div>
                <div className={`hidden lg:block`}></div>
              </div>
              <div className={`grid grid-cols-1 lg:grid-cols-2`}>
                <div>
                  <Label
                    htmlFor={`${
                      slug === "detail" ? "roleModules" : "listModuleCode"
                    }`}
                  >
                    Hak Akses
                  </Label>
                  {slug == "edit" ? (
                    <div className={`grid grid-cols-1 lg:grid-cols-2`}>
                      <Checkbox
                        name={`all`}
                        value={`all`}
                        label={`All`}
                        onChange={setAllPermission}
                        checked={
                          role.roleDetail.roleModules.length ===
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
                  ) : sidebar.modules.length ===
                    role.roleDetail.roleModules.length ? (
                    <ul className="space-y-1 max-w-md list-disc list-inside">
                      <li>
                        <Typography className={`font-normal text-sm`}>
                          All
                        </Typography>
                      </li>
                    </ul>
                  ) : (
                    <ul className="space-y-1 max-w-md list-disc list-inside">
                      {role.roleDetail.roleModules.map((item, key) => {
                        return (
                          <li key={key}>
                            <Typography className={`font-normal text-sm`}>
                              {item.moduleName}
                            </Typography>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
                <div className={`hidden lg:block`}></div>
              </div>
              <div className="grid gap-x-16 gap-y-6 mb-2 grid-cols-1 lg:grid-cols-1 mt-4">
                <div className="m-auto">
                  {slug === "edit" && (
                    <Button
                      className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white mr-6`}
                      type={`submit`}
                    >
                      <Typography className={`font-normal text-sm`}>
                        Save
                      </Typography>
                    </Button>
                  )}
                  <Button
                    className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black`}
                    onClick={() => {
                      router.back();
                    }}
                  >
                    <Typography>
                      {slug === "detail" ? "Back" : "Cancel"}
                    </Typography>
                  </Button>
                </div>
              </div>
            </Form>
          </Formik>
        </Card>
        {slug == "detail" && (
          <>
            <ModalConfirmation
              show={state.isOpenDeleteDialog}
              confirmDelete={true}
              onHide={() => setIsOpenDeleteDialog(false)}
              handleYes={() => {
                setIsOpenDeleteDialog(false, "submit");
              }}
              desc1={Messages.confirmationDeleteData}
              isLoading={onDeleteRole}
            />
            <Modal
              setIsOpen={(val) =>
                setState({ ...state, showSuccessDeleteModal: val })
              }
              width={`w-[27rem]`}
              title={`Success`}
              headless
              isOpen={state.showSuccessDeleteModal}
            >
              <div>
                <Image
                  src={assets.ImageCheckedGreen}
                  alt={`Success dialog image`}
                />
              </div>
              <Typography className={`pt-8`}>Data berhasil dihapus</Typography>
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
          </>
        )}
        {slug == "edit" && (
          <>
            <ModalConfirmation
              show={state.isOpenConfirmationDialog}
              confirmation={`Confirmation`}
              onHide={() => setIsOpenConfirmationDialog(false)}
              handleYes={() => {
                setIsOpenConfirmationDialog(false, "submit");
              }}
              desc1={Messages.confirmationSavedData}
              isLoading={onEditRole}
            />
            <Modal
              setIsOpen={(val) => showSuccessEditModal(val)}
              width={`w-[27rem]`}
              title={`Success`}
              headless
              isOpen={showSuccessEditModal}
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
          </>
        )}
        {isOpenErrorDialog && (
          <Modal
            setIsOpen={(val) => {
              setIsOpenErrorDialog(val);
            }}
            width="w-[27rem]"
            title={`Error`}
            headless
            isOpen={isOpenErrorDialog}
          >
            <div>
              <Image src={assets.IconCross} alt={`Success dialog image`} />
            </div>
            <Typography className="pt-8 text-center">
              {
                "Simpan data Gagal. \nData tidak berhasil disimpan, silahkan coba lagi"
              }
            </Typography>
            <div className="pt-10">
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
      </MainLayout>
    </>
  );
};

export default RoleManagementSlug;
