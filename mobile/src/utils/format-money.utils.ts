export default function formatMoney(amount: number): string {
  return `${amount < 0 ? '-' : ''} $${Math.abs(amount).toFixed(2)}`.trim();
}
