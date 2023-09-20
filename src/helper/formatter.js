import moment from 'moment'

function formatDate (date, format = 'L') {
  if (date) {
    if (moment(date).format(format) === 'Data inválida') return false
    return moment(date).format(format)
  } else {
    return 'Data inválida'
  }
}

function floatToMoney (float) {
  var formatter = new Intl.NumberFormat('pt-BR',
    {
      style: 'currency',
      currency: 'brl',
      maximumFractionDigits: 2
    }
  )
  let formattedNumber = formatter.format(Number(float))
  return !isNaN(Number(float)) ? formattedNumber : 'R$ -'
}

function floatToDouble (float) {
  var formatter = new Intl.NumberFormat('pt-BR',
    {
      currency: 'brl',
      maximumFractionDigits: 2
    }
  )
  let formattedNumber = formatter.format(Number(float))
  return !isNaN(Number(float)) ? formattedNumber : ''
}

function parseDate (date) {
  if (!date || !date[9]) return null
  const [day, month, year] = date.split('/')
  if (moment(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`).isValid()) {
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }
}

export default {
  formatDate,
  parseDate,
  floatToMoney,
  floatToDouble
}
