import React from 'react'

const UserDetail = (props) => {
  const { label, className, title } = props

  return (
    <div  className={`name w-[380px] ${className}`}>
      <p>{ label }</p>
      <div className="border-b border-[#C9CFD6]">
        <p className='py-1 px-2'>{ title }</p>
      </div>
    </div>
  )
}

export default UserDetail