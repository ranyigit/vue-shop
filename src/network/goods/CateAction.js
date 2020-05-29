import axios from '../axios'

export function getCateList (params) {
  return axios({
    url: '/categories',
    method: 'get',
    params: params
  })
}

export function addCate (params) {
  return axios({
    url: '/categories',
    method: 'post',
    data: params
  })
}

export function queryCateById (cid) {
  return axios({
    url: `/categories/${cid}`,
    method: 'get'
  })
}

export function updateCate (cid, params) {
  return axios({
    url: `/categories/${cid}`,
    method: 'put',
    data: params
  })
}

export function deleteCate (cid) {
  return axios({
    url: `/categories/${cid}`,
    method: 'delete'
  })
}
