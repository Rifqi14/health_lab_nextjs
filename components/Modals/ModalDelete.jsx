import assets from "@/public/index";
import { Button, Typography } from "@atoms";
import Image from "next/image";
import React from "react";

const ModalDelete = (props) => {
  const { show, onHide, desc, handleButton } = props;

  return (
    <>
      {show ? (
        <>
          <div
            className={`flex bg-gray-500 bg-opacity-50 w-full h-screen justify-center items-center top-0 left-0 fixed`}>
            <div className="bg-white shadow-2xl px-10 py-6 rounded flex flex-col items-center justify-around w-[480px] h-[280px]">
              <div className="flex justify-between w-full -mt-4">
                <div></div>
                <div>
                  <Image
                    className="hover: cursor-pointer"
                    alt=""
                    src={assets.close}
                    onClick={onHide}
                  />
                </div>
              </div>
              <div className="flex justify-between">
                {/* <p className='text-black mr-[291px] font-medium'>Confirmation</p> */}
                <Image alt="" src={assets.IconInfo} />
              </div>
              <div className="flex flex-col justify-center items-center">
                <p className="">{desc}</p>
              </div>
              <div className="">
                <Button
                  paddingVertical={`py-2`}
                  paddingHorizontal={`px-7`}
                  background={`bg-btn-cancel`}
                  onClick={onHide}>
                  <Typography className={`text-black font-normal text-sm`}>
                    No
                  </Typography>
                </Button>
                <Button
                  paddingVertical={`py-2`}
                  paddingHorizontal={`px-7`}
                  background={`bg-inActive`}
                  className={"ml-4"}
                  onClick={handleButton}>
                  <Typography className={`text-white font-normal text-sm`}>
                    Yes
                  </Typography>
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default ModalDelete;
