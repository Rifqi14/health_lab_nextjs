import React from 'react'
import assets from '@/public/index'
import Image from 'next/image'

const ModalRedirect = (props) => {
    const {show, onHide} = props
  return (
    <>
    {
        show ? (
            <>
            <div className='flex bg-gray-500 bg-opacity-50 w-full h-full justify-center items-center top-0 left-0 absolute'>
                <div className=' flex justify-center items-center m-auto'>
                    <div className='bg-white rounded-[5px] flex flex-col overflow-x-hidden overflow-y-auto right-[100px] top-[200px] left-[465px] absolute z-10 outline-none w-[480px] h-[280px] '>
                        <div className='flex justify-end p-[26px]'>
                            <Image alt="" src={assets.close} onClick={onHide} />
                        </div>
                        <div className='flex justify-center items-center h-full pb-5'>
                            <p>Redirect link from email   </p>
                        </div>
                    </div>
                </div>
            </div>

            </>
        ) : null
    }

 </>
  )
}

export default ModalRedirect