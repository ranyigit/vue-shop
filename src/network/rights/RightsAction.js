import axios from '../axios'

export function rightsList (type) {
  return axios({
    url: `/rights/${type}`,
    method: 'get'
  })
}
