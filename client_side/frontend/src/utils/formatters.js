export const formatPrice = (price) => {
  if (!price && price !== 0) return '0.00'
  return Number(price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
