import React, { useState, useEffect } from "react";
import assets from "../public";
import Image from "next/image";
import Modals from "components/Modals/ModalConfirmation";
import ModalRedirect from "components/Modals/ModalRedirect";
import axios from "axios";
import SuccsessModals from "components/Modals/ModalsSendLink";
import { interceptorResponseErr } from "@utils/interceptor";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { resetPassword } from "components/store/actions/resetPassword";
import { Modal } from "@atoms";
import ModalSuccess from "components/Modals/ModalsSendLink";
import ModalConfirmation from "components/Modals/ModalConfirmation";

const PageForgotPassword = () => {
  const [showModals, setShowModals] = useState(false);
  const [showModalsRedirect, setShowModalsRedirect] = useState(true);
  const [ShowNewPass, setShowNewPass] = useState(false);
  const [Showconfim, setShowConfirm] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [NewPassword, setNewPassword] = useState("");
  const [confirmPass, setconfirmPass] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  const userId = router.query.userId;
  const token = router.query.tokenResetPassword;

  const showPassNewPass = () => {
    setShowNewPass(!ShowNewPass);
  };

  const showConfirmPass = () => {
    setShowConfirm(!Showconfim);
  };

  const showSucces = () => {
    setSuccessModal(!SuccessModal);
  };

  const URL = process.env.NEXT_PUBLIC_API_URL;

  const submitForm = () => {
    const data = {
      userId: userId,
      tokenResetPassword: token,
      password: NewPassword,
      rePassword: confirmPass,
    };

    try {
      axios.interceptors.response.use(
        (res) => res,
        (error) => interceptorResponseErr(error)
      );
      const res = axios.post(`${URL}/api/v1/users/forgot-password`, data);
      setShowModals(false);
      setTimeout(() => {
        setSuccessModal(true);
      }, 500);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setShowModalsRedirect(false);
    }, 2000);
  }, []);

  return (
    <>
      <Head>
        <title>Bumame CMS | resetPassword</title>
        <link
          rel="icon"
          href={`${
            process.env.NEXT_PUBLIC_PREFIX_URL || "/housecall"
          }/favicon.ico`}
        />
      </Head>
      <div className="flex flex-col w-full justify-around items-center h-screen ">
        <div className="flex flex-col justify-center">
          <Image alt="" src={assets.Logo} />
          <div className="font-bold font-md text-center flex ">
            <p>Corporate </p>
            <div className=" mx-1">
              <Image alt="" src={assets.Ellipse} />
            </div>
            <p> House Call</p>
            <div className=" mx-1">
              <Image alt="" src={assets.Ellipse} />
            </div>
            <p>Lab Partner</p>
          </div>
        </div>
        <div className="">
          <p className="text-[#959CB6] text-center">
            Please enter your new password
          </p>
          <div className="flex flex-col mt-8 w-[350px]">
            <label className="text-[#575962] mb-[5px]">New Password</label>
            <div className="flex p-2 rounded-[5px] mb-[15px] border-[1px] border-[#C9CFD6]">
              <input
                name="NewPass"
                value={NewPassword}
                type={ShowNewPass ? "text" : "password"}
                className="w-full outline-none bg-transparent"
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
              />
              {ShowNewPass ? (
                <Image alt="" src={assets.EyeOpen} onClick={showPassNewPass} />
              ) : (
                <Image alt="" src={assets.EyeClose} onClick={showPassNewPass} />
              )}
            </div>
            <label className="text-[#575962] mb-[5px]">
              Confirmation New Password
            </label>
            <div className="flex p-2 rounded-[5px] mb-[15px] border-[1px] border-[#C9CFD6]">
              <input
                name="ConfirmPass"
                value={confirmPass}
                type={Showconfim ? "text" : "password"}
                className="w-full outline-none bg-transparent"
                onChange={(e) => {
                  setconfirmPass(e.target.value);
                }}
              />
              {Showconfim ? (
                <Image alt="" src={assets.EyeOpen} onClick={showConfirmPass} />
              ) : (
                <Image alt="" src={assets.EyeClose} onClick={showConfirmPass} />
              )}
            </div>
            {NewPassword !== confirmPass ? (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                Password Must be Same
              </p>
            ) : null}
            <div className="flex justify-center mt-[50px]">
              <button
                className="mr-[25px] py-2 px-8 rounded-[5px] bg-[#349EFF] text-white"
                onClick={() => setShowModals(true)}
                disabled={NewPassword !== confirmPass}>
                Submit
              </button>
              <Link href="/login">
                <button className="py-2 px-8 rounded-[5px] bg-[#DDDDDD] text-black">
                  Cencel
                </button>
              </Link>
            </div>
          </div>
        </div>
        <p className="text-[#959CB6]">
          ©️ 2022 PT. Budimanmaju Megah Farmasi.{" "}
        </p>
      </div>
      <ModalRedirect
        show={showModalsRedirect}
        onHide={() => setShowModalsRedirect(false)}
      />
      <ModalConfirmation
        show={showModals}
        confirmation={`Confirmation`}
        onHide={() => setShowModals(false)}
        handleYes={() => submitForm()}
        desc1={`Apakah anda yakin akan menyimpan data ini?`}
      />
      <ModalSuccess
        show={successModal}
        onHide={() => router.push("/login")}
        desc1={`Password berhasil diubah silahkan login`}
      />
    </>
  );
};

export default PageForgotPassword;
