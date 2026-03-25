export const isEmail = (email) => {
  const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/
  return re.test(email)
}

export const isPhone = (phone) => {
  const re = /^(254|0)?[0-9]{9}$/
  return re.test(phone)
}

export const isRequired = (value) => {
  return value !== null && value !== undefined && value !== ''
}

export const minLength = (value, min) => {
  return value && value.length >= min
}

export const maxLength = (value, max) => {
  return !value || value.length <= max
}

export const isNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value)
}

export const isPositive = (value) => {
  return isNumber(value) && parseFloat(value) > 0
}
