import { parseISO, parse } from 'date-fns';

export const parseTime = date => {
  const parts = date.split('/');
  return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
};

export const parseHour = time => {
  return parse(parseISO(time), 'HH:mm', new Date());
};

export const ymdToDmy = (date, separator = '/') => {
  let tgl = new Date(date);
  return `${tgl.getDate()}${separator}${
    tgl.getMonth() + 1
  }${separator}${tgl.getFullYear()}`;
};
