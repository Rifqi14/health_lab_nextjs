import LengthChangeValue from '@constants/LengthChange';
import React from 'react';

const LengthChange = props => {
  const onChangePaginationLength = value => {
    props.length(value.target.value);
  };

  return (
    <>
      <div className={`px-1 bg-white`}>
        <select
          id='length-change'
          onChange={value => onChangePaginationLength(value)}
          className={`bg-white border border-[#E6E6E6] rounded-md p-1 focus:outline-none`}
        >
          {LengthChangeValue.map((value, key) => {
            return (
              <option key={key} value={value}>
                {value}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
};

export default LengthChange;
