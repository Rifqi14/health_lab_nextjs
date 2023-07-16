import { Button, Typography } from 'components/atoms';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import assets from 'public/index';
import { useRouter } from 'next/router';
import { UploadFile } from 'components/molecules';

const ModalUploadFile = props => {
  const router = useRouter();
  const fileInput = useRef(null);

  const initialFields = {
    files: null,
    notes: ''
  };

  const { show, onHide, uploadFile, doctype } = props;
  const [components, setComponents] = useState([]);
  const [fileName, setFileName] = useState(null);
  const [componentUploadFile, setComponentUploadFile] = useState([
    initialFields
  ]);

  const handleTambahFile = () => {
    setComponentUploadFile(c => [...c, initialFields]);
  };

  const handleDeleteFile = index => {
    // const indexMin = index
    console.log('IndeProps', index);
    console.log('ComponentUploadFile', componentUploadFile);

    // const newComponentUploadFile = componentUploadFile.filter((item, indexItem) => indexItem !== index)
    // setComponentUploadFile(newComponentUploadFile)

    for (let i = 0; i < componentUploadFile.length; i++) {
      if (i === index) {
        componentUploadFile.splice(i, 1);
        console.log('After', componentUploadFile);
      }
    }
    setComponentUploadFile([...componentUploadFile]);
  };

  const data = {
    files: fileName,
    notes: '',
    CooperationTermCode: '',
    Type: doctype
  };

  const handleUploadDocument = () => {};

  useEffect(() => {}, [componentUploadFile]);

  return (
    <>
      {show ? (
        <>
          <div className='flex bg-gray-500/50 w-full h-full justify-center items-center top-0 overflow-y-scroll left-0 fixed'>
            <div className='bg-white rounded-[5px] my-20 py-5 px-[30px] w-[804px]'>
              <div className='flex justify-between mb-[30px]'>
                <div>
                  <Typography className='text-[#212121] font-medium text-lg'>
                    Supporting Data
                  </Typography>
                </div>
                <div className='hover: cursor-pointer'>
                  <Image alt='' src={assets.IconClose} onClick={onHide} />
                </div>
              </div>
              {componentUploadFile.map((field, index) => (
                <UploadFile
                  key={index}
                  index={index + 1}
                  deleteBtn={() => {
                    handleDeleteFile(index);
                  }}
                />
              ))}
              <Button
                paddingVertical={`py-1`}
                paddingHorizontal={`px-6`}
                background={`bg-pattensBlue hover:bg-btnBlue`}
                className={
                  'flex items-center text-btnBlue hover:text-white justify-center'
                }
                onClick={() => handleTambahFile()}
              >
                <Typography
                  className={`font-normal text-sm flex items-center justify-center`}
                >
                  <span className='font-bold text-2xl pb-1.5 pr-2'>+</span>{' '}
                  Tambah File
                </Typography>
              </Button>
              <div className='mt-8 flex justify-center items-center'>
                <Button
                  className={`bg-btnBlue rounded-lg hover:bg-[#008AEC] text-white mr-6`}
                  type={`submit`}
                  onClick={() => handleUploadDocument()}
                >
                  <Typography className={`font-normal text-sm`}>
                    Upload
                  </Typography>
                </Button>
                <Button
                  className={`bg-[#DDDDDD] rounded-lg hover:bg-[#C6C6C6] text-black`}
                  onClick={onHide}
                >
                  <Typography>Cancel</Typography>
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default ModalUploadFile;
