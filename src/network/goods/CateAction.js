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

export function updateCate (params) {
  return axios({
    url: `/categories/${params.cid}`,
    method: 'put',
    data: { cat_name: params.cat_name }
  })
}

export function deleteCate (cid) {
  return axios({
    url: `/categories/${cid}`,
    method: 'delete'
  })
}
