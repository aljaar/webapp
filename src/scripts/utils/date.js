import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';

dayjs.locale('id');
dayjs.extend(relativeTime);

export const fromNow = (date) => dayjs(date).fromNow(true);
export const format = (date, template = 'DD MMMM YYYY hh:mm:ss') => dayjs(date).format(template);
