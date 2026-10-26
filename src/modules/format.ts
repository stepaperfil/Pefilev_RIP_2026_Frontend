export function formatPrice(price: number | null): string {
  if (price === null) {
    return ''
  }
  return `${String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₽`
}
