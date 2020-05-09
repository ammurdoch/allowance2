export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function formatDateTime(isoDate: string): string {
  const date = new Date(isoDate);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
}
