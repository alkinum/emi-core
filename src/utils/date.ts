import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const getFormattedTime = (date: Date) =>
  dayjs(date).format('YYYY-MM-DD HH:mm:ss');
