import assets from 'public/index';
import { Button, Typography } from 'components/atoms';
import { getItemLocalStorage } from 'components/utils/localstorage';
import axios from 'axios';
import Image from 'next/image';
import React, { useState, useRef } from 'react';

const UploadFile = props => {
  const { index, deleteBtn } = props;
  const fileInput = useRef(null);

  const [fileName, setFileName] = useState(null);

  const handleClick = () => {
    fileInput.current.click();
  };

  const handleOpenInputFile = val => {
    const fileUploaded = val.target.files[0];
    setFileName(fileUploaded.name);
  };

  return (
    <>
      <div className='my-[22px] flex'>
        <div className='file w-full mr-5'>
          <Typography className={`text-sm font-medium text-[#575962]`}>
            File
          </Typography>
          <div className='flex border-[1px] border-[#C9CFD6] rounded-[5px] py-[15px] justify-center'>
            <div className='mr-5'>
              <Button
                paddingVertical={`py-2`}
                paddingHorizontal={`px-4`}
                background={`bg-[#1BC5BD]`}
                className={
                  'flex items-center justify-center hover:bg-btnBlue hover:text-white '
                }
                onClick={() => handleClick()}
              >
                <Image alt='' src={assets.upload} />
                <Typography className='ml-[7px] text-white'>
                  Choose File
                </Typography>
              </Button>
              <input
                ref={fileInput}
                type='file'
                placeholder='Ganti Foto'
                className='mt-6 hidden'
                onChange={e => handleOpenInputFile(e)}
              />
            </div>
            <div className='flex justify-center items-center'>
              <Typography className={`text-sm font-normal text-[#868686]`}>
                {fileName !== null ? fileName : 'no file selected'}
              </Typography>
            </div>
          </div>
        </div>
        <div className='note flex-col flex w-full'>
          <Typography className={`text-sm font-medium text-[#575962]`}>
            Note
          </Typography>
          <div className='mt-1 h-full'>
            <textarea
              type='text'
              className='w-[350px] h-full p-1 border-[#C9CFD6] border-[1px] rounded-[5px] resize-none'
            />
          </div>
        </div>
        {index > 1 ? (
          <div
            onClick={() => {
              deleteBtn(index);
            }}
            className='bg-[#F64E60] h-10 w-20 ml-4 mt-10 hover:cursor-pointer rounded-md flex items-center justify-center'
          >
            <Image alt='' src={assets.IconTrash} />
          </div>
        ) : (
          <div className='w-20 ml-4'></div>
        )}
      </div>
    </>
  );
};

export default UploadFile;
