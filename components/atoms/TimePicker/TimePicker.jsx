import { parseHour, parseTime } from 'components/utils/datetime';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

const TimePicker = props => {
  const { onChange, selectedTime, name, minTime, disabled } = props;
  const [startTime, setStartTime] = useState(new Date());
  return (
    <DatePicker
      name={name}
      selected={selectedTime ? new Date(selectedTime) : startTime}
      onChange={date => {
        const fullTime = date.getHours() * 100 + date.getMinutes();
        props.form?.setFieldValue(props.field?.name, fullTime);
        setStartTime(date);
        onChange && onChange(date);
      }}
      minTime={minTime && new Date(minTime)}
      showTimeSelectOnly
      showTimeInput
      className={`w-full rounded-lg p-2 text-sm focus:outline-none`}
      dateFormat={`HH:mm`}
      disabled={disabled}
    />
  );
};

export default TimePicker;
