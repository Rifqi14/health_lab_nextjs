import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Typography from '../Typography/Typography';
import Image from 'next/image';
import assets from 'public/index';
import Button from '../Button/Button';

const Modal = props => {
  const {
    refDialog,
    isOpen,
    setIsOpen,
    title,
    children,
    width,
    headless = false
  } = props;

  return (
    <>
      {isOpen && (
        <Transition show={isOpen} as={Fragment}>
          <Dialog
            initialFocus={refDialog && refDialog}
            as={'div'}
            className={`fixed inset-0 rounded-0 z-50 overflow-y-auto bg-gray-500/50`}
            onClose={() => setIsOpen(false)}
          >
            <div
              className={`min-h-screen px-4 bg-[#000000]/[.4] text-center`}
              ref={refDialog}
            >
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <Dialog.Overlay className='fixed inset-0' />
              </Transition.Child>

              <span
                className='inline-block h-screen align-middle'
                aria-hidden='true'
              >
                &#8203;
              </span>

              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <div
                  className={`inline-block align-middle transition-all transform bg-white shadow-xl rounded-[5px] ${width} m-10`}
                >
                  <div
                    className={`${
                      headless && 'hidden'
                    } flex bg-white px-[30px] py-[20px] rounded-[5px] items-center justify-between`}
                  >
                    <Typography
                      size={18}
                      weight={'font-[500]'}
                      color={`text-black`}
                    >
                      {title}
                    </Typography>
                    <Button
                      emptyPadding
                      className={`p-0 m-0`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Image src={assets.IconClose} alt={`Close Icon`} />
                    </Button>
                  </div>
                  <div
                    className={`flex flex-col items-center px-[30px] py-[20px] text-left`}
                  >
                    {children}
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      )}
    </>
  );
};

export default Modal;
