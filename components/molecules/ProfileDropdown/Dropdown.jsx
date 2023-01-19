import assets from "@/public/index";
import { authCurrentUser, authlogout } from "@actions";
import { Avatar, Typography } from "@atoms";
import { removeItemLocalStorage } from "@utils/localstorage";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Dropdown = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const router = useRouter();
  const [userInitial,setUserInitial] = useState(undefined)

  const { auth } = state;

  const logoutHandler = () => {
    removeItemLocalStorage("AUTH");
    const logout = dispatch(authlogout());
    router.push("/login");
  };

  const changeHandler = () => {
    router.push('/changePassword')
  }

  const getUserInitial = (userName) => {
    var names = userName.split(' '),
    initials = ""

    for(var i in names){
      initials += names[i].substring(0, 1).toUpperCase();
      console.log(names[i]);
    }

    setUserInitial(initials);
  }

  useEffect(() => {
    if (!auth.currentLoginUser) {
      dispatch(authCurrentUser());
    }
    if(userInitial === undefined){
      getUserInitial(auth.currentLoginUser?.name);
    }
    
  }, [auth]);

  return (
    <div
      className={`w-fit h-fit items-center absolute right-4 rounded-md overflow-hidden drop-shadow-md z-50`}>
      <div className="bg-[#F77712] w-[60px] h-[60px] rounded relative top-16 -right-44 rotate-45 -mt-12"></div>
      <div
        className={`flex bg-[#F77712] w-full h-fit items-center drop-shadow-sm rounded-t-md`}>
        <Avatar
          size={"60px"}
          text={userInitial}
          textColor={"text-[#F77712]"}
          bgColor={"bg-white"}
          className={"m-4"}
          textClassName={`font-semibold text-2xl`}></Avatar>
        <Typography
          color={"text-white"}
          weight={"font-medium"}
          size={"text-sm"}
          className={"pr-4"}>
          {auth.currentLoginUser?.name}
        </Typography>
      </div>
      <div
        className={`flex bg-white px-4 pt-5 pb-2 w-full h-fit items-center cursor-pointer`}>
        <Avatar
          size={"40px"}
          isImage
          img={assets.IconChangePassword}
          textColor={"text-[#F77712]"}
          bgColor={"bg-[#EBEDF2]"}></Avatar>
        <Link
          href={`/change-password`}
          className="">
          <span className="text-[#434349] font-medium text-sm px-4">Change Password</span> 
        </Link>
        {/* <Link href={`/change-password`}>
          <Typography
            color={"text-[#434349]"}
            weight={"font-medium"}
            size={"text-sm"}
            className={"px-4"}>
            Change Password
          </Typography>
        </Link> */}
      </div>
      <div
        className={`flex bg-white px-4 pt-2 pb-5 w-full h-fit items-center cursor-pointer`}
        onClick={logoutHandler}>
        <Avatar
          size={"40px"}
          isImage
          img={assets.IconLogout}
          textColor={"text-[#F77712]"}
          bgColor={"bg-[#EBEDF2]"}></Avatar>
        <Typography
          color={"text-[#434349]"}
          weight={"font-medium"}
          size={"text-sm"}
          className={"px-4"}>
          Logout
        </Typography>
      </div>
    </div>
  );
};

export default Dropdown;
