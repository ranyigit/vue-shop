import axios from '../axios'

export function paramsList (catId, params) {
  return axios({
    url: `/categories/${catId}/attributes`,
    method: 'get',
    params: params
  })
}

export function addParams (catId, params) {
  return axios({
    url: `/categories/${catId}/attributes`,
    method: 'post',
    data: params
  })
}

export function deleteParams (catId, attrId) {
  return axios({
    url: `/categories/${catId}/attributes/${attrId}`,
    method: 'delete'
  })
}

export function queryParams (catId, attrId, params) {
  return axios({
    url: `/categories/${catId}/attributes/${attrId}`,
    method: 'get',
    params: params
  })
}

export function updateParams (catId, attrId, params) {
  return axios({
    url: `/categories/${catId}/attributes/${attrId}`,
    method: 'put',
    data: params
  })
}
