import React from 'react'

const InputText = props => {

  const { label, type, value, className, onChange, readOnly } = props

  return (
    <div className='flex flex-col w-full py-2'>
      <label className={`text-black ${className}`} htmlFor="name">
        { label }
      </label>
      <input min={1} readOnly={readOnly} onChange={onChange} value={value} className='focus:outline-none border rounded p-2 bg-white' type={type} />
    </div>
  )
}

export default InputText