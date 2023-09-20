import Api from '@API'

async function listagem (url) {
  var items = await Api.get(url)
    .then(res => {
      return res.data
    })
    .catch(err => {
      console.log(err)
      return err
    })
  return items
}

function select (url, text, value) {
  var items = []
  Api.get(url)
    .then(res => {
      res.data.map(item => {
        items.push({
          text: item[text],
          value: item[value]
        })
      })
    })
    .catch(err => {
      console.log(err.response.data.msg)
      return err
    })
  return items
}

async function asyncSelect (url, text, value) {
  var items = []
  let retorno = await Api.get(url)
    .then(res => {
      res.data.map(item => {
        items.push({
          text: item[text],
          value: item[value]
        })
      })
      return items
    })
    .catch(err => {
      console.log(err.response.data.msg)
      return err
    })
  return retorno
}

export default {
  listagem,
  select,
  asyncSelect
}
