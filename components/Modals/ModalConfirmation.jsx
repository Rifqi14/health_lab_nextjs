import React, { Fragment } from "react";
import Image from "next/image";
import assets from "@/public/index";
import { Button, Typography } from "@atoms";
import { Transition } from "@headlessui/react";

const ModalConfirmation = (props) => {
  const {
    show,
    onHide,
    desc1,
    desc2,
    handleYes,
    confirmation,
    isLoading = false,
    confirmDelete = false,
  } = props;

  return (
    <>
      <Transition show={show}>
        <div
          className={`flex bg-gray-500 bg-opacity-50 w-full h-screen justify-center items-center top-0 left-0 fixed`}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="bg-white px-[30px] py-[20px] w-[480px] h-auto rounded flex flex-col items-center">
              <div className="flex justify-between">
                <Typography className="text-black mr-[291px] font-medium">
                  {confirmation}
                </Typography>
                  <Image
                    className="hover: cursor-pointer"
                    alt=""
                    src={assets.close}
                    onClick={onHide}
                  />
              </div>
              {confirmDelete === true && (
                <div>
                  <Image src={assets.IconInfo} alt={`Success dialog image`} />
                </div>
              )}
              <div
                className={`flex flex-col justify-center items-center ${
                  confirmDelete === true ? "mt-8" : "mt-16"
                } px-8`}
              >
                <Typography className="text-center">{desc1}</Typography>
                <p className="">{desc2}</p>
              </div>
              <div className={`${confirmDelete === true ? "mt-8" : "mt-16"} `}>
                <Button
                  paddingVertical={`py-2`}
                  paddingHorizontal={`px-7`}
                  background={`bg-btnBlue hover:bg-[#008AEC] ${
                    confirmDelete === true && "bg-inActive hover:bg-inActive"
                  }`}
                  onClick={() => handleYes()}
                  disabled={isLoading}
                >
                  {isLoading && (
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
                  )}
                  <Typography className={`text-white font-normal text-sm`}>
                    Yes
                  </Typography>
                </Button>
                <Button
                  paddingVertical={`py-2`}
                  paddingHorizontal={`px-7`}
                  background={`bg-[#DDDDDD]`}
                  className={"ml-4"}
                  onClick={onHide}
                >
                  <Typography className={`text-black font-normal text-sm`}>
                    No
                  </Typography>
                </Button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Transition>
    </>
  );
};

export default ModalConfirmation;
