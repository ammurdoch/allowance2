export default function formatMoney(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
