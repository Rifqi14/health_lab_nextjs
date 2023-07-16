import { parseTime, ymdToDmy } from 'components/utils/datetime';
import Image from 'next/image';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import assets from 'public/index';
import { Portal } from 'react-overlays';

const CalendarContainer = ({ children }) => {
  const el = document.getElementById('calendar-portal');

  return <Portal container={el}>{children}</Portal>;
};

const DateInput = props => {
  const {
    withTimeStamp = false,
    selectedDate,
    name,
    icon,
    readOnly,
    placeholder,
    defaultValue,
    disabled
  } = props;
  const [startDate, setStartDate] = useState(new Date());
  const onChange = dates => {
    setStartDate(dates);
  };
  return (
    <>
      {readOnly ? (
        <input
          type={`text`}
          id={name}
          className={`read-only:border-b read-only:outline-none read-only:ring-0 read-only:rounded-none disabled:rounded-lg disabled:bg-[#E6E6E6] disabled:border-[#C9CFD6] border-[#C9CFD6] text-black read-only:cursor-default text-sm block w-full p-2`}
          placeholder={placeholder}
          defaultValue={defaultValue || props.field?.value}
          disabled={disabled}
          readOnly={readOnly}
          name={name || props.field?.name}
        />
      ) : (
        <label htmlFor={name}>
          <div className={`relative`}>
            <DatePicker
              selected={selectedDate ? new Date(selectedDate) : startDate}
              startDate={startDate}
              onChange={date => {
                props.form?.setFieldValue(
                  props.field?.name,
                  date.toISOString()
                );
                onChange(date);
              }}
              dateFormat={withTimeStamp ? `dd/MM/yyyy HH:mm` : 'dd/MM/yyyy'}
              timeInputLabel={withTimeStamp ? 'Time: ' : null}
              showTimeInput={withTimeStamp}
              className={`border border-[#C9CFD6] focus:outline-none w-full p-2 rounded-lg text-sm block`}
              id={name}
              name={name}
              popperContainer={CalendarContainer}
              showMonthDropdown
              showYearDropdown
              dropdownMode='select'
              disabled={disabled}
            />
            {icon && (
              <div
                className={`px-2 flex absolute inset-y-0 right-0 items-center`}
              >
                <Image src={assets.IconCalendar} alt={`Create button`} />
              </div>
            )}
          </div>
        </label>
      )}
    </>
  );
};

export default DateInput;
