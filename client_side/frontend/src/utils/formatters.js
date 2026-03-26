export const formatPrice = (price) => {
  // Handle null, undefined, empty string, or NaN
  if (price === null || price === undefined || price === '' || isNaN(price)) return '0.00'
  const numPrice = Number(price)
  if (isNaN(numPrice)) return '0.00'
  return numPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatDateTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('en-KE')
}

export const truncate = (str, length = 100) => {
  if (!str) return ''
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}
