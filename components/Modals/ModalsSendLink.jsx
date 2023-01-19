import React from "react";
import { useState } from "react";
import Image from "next/image";
import assets from "@/public/index";
import Link from "next/link";
import {Button, Modal, Typography} from "@atoms";

function Modals(props) {
  const { show, onHide, desc1, desc2, className } = props;
  return (
    <>
      {show ? (
        <>
          <Modal
            isOpen={true}
            width={`w-[27rem]`}
            title={`Success`}
            headless
          >
            <div className={`flex flex-col justify-center items-center`}>
              <Image
                src={assets.ImageCheckedGreen}
                alt={`Success dialog image`}
              />
              <Typography className={`py-8 font-normal text-sm text-center`}>
                <p className="">{desc1}</p>
                <p className="">{desc2}</p>
              </Typography>
              <Button
                type="button"
                onClick={onHide}
                className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white`}>
                <Typography>OK</Typography>
              </Button>
            </div>
          </Modal>
        </>
      ) : null}
    </>
  );
}

export default Modals;