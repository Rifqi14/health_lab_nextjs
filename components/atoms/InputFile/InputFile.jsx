import assets from '@/public/index';
import Image from 'next/image';
import React, { useRef } from 'react';
import Typography from '../Typography/Typography';

const InputFile = props => {
  const {
    hiddenFileInput,
    onChange,
    accept = 'image/*,application/pdf,application/msword,.docx,.xls,.xlsx',
    fileName,
    name,
    readonly = false,
    className,
    isWhite = false
  } = props;
  return (
    <label htmlFor={name}>
      <div className={`flex items-center`}>
        {readonly ? (
          <Typography
            className={`font-light pt-5 text-sm ${
              props.field?.value?.name || fileName
                ? 'hover:cursor-pointer hover:text-blue-600'
                : 'text-gray-400'
            }`}
          >
            {props.field?.value?.name
              ? props.field?.value?.name.substring(0, 12) + '...'
              : fileName
              ? fileName
              : 'No file selected'}
          </Typography>
        ) : (
          <>
            <div
              className={`text-grey-500 py-2 px-4
            rounded-md border-0
            text-sm font-medium bg-[#1BC5BD] text-[#FFF]
            hover:cursor-pointer flex items-center w-fit ${className}`}
            >
              <div className={`flex items-center pr-1`}>
                <Image
                  src={isWhite ? assets.IconUploadWhite : assets.IconUpload}
                  alt={`Icon`}
                />
              </div>
              <Typography>Choose File</Typography>
            </div>
            <div
              className={`px-2 w-1/2 truncate ${
                (props.field?.value?.name || fileName) && 'text-[#868686]'
              }`}
            >
              <Typography>
                {props.field?.value?.name
                  ? props.field?.value?.name?.substring(0, 12) + '...'
                  : fileName
                  ? fileName
                  : 'No file selected'}
              </Typography>
            </div>
          </>
        )}
      </div>
      <input
        ref={hiddenFileInput}
        id={name}
        name={name}
        type={`file`}
        onChange={val => {
          props.form?.setFieldValue(props.field?.name, val.target?.files[0]);
          onChange && onChange(val);
        }}
        disabled={readonly}
        accept={accept}
        className={`hidden text-sm text-grey-500 file:mr-5 file:py-2 file:px-6
            file:rounded-md file:border-0
            file:text-sm file:font-medium
            file:bg-[#349EFF4D]/30 file:text-[#349EFF]
            hover:file:cursor-pointer hover:file:bg-amber-50
            hover:file:text-amber-700`}
      />
    </label>
  );
};

export default InputFile;
