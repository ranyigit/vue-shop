import axios from '../axios'

export function getEchartsData () {
  return axios({
    url: 'reports/type/1',
    method: 'get'
  })
}
