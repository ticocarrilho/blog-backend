import { DateTime } from 'luxon';

export default (date) =>
  DateTime.fromISO(date).toLocaleString({
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
