import moment from 'moment';

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return moment(date).format('D MMM YYYY');
}

export function formatDateTime(isoDate: string): string {
  const date = new Date(isoDate);
  return moment(date).format('D MMM YYYY HH:mm');
}
