import React from 'react';
import { TimePicker } from 'components/atoms';

const TimeRangePicker = props => {
  return (
    <div className={`flex items-center border rounded-lg border-[#C9CFD6]`}>
      <div className={`w-14`}>
        <TimePicker />
      </div>
      <span className={`px-1`}>-</span>
      <div className={`w-14`}>
        <TimePicker />
      </div>
    </div>
  );
};
export default TimeRangePicker;
