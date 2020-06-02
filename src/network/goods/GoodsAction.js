import axios from '../axios'

export function goodsList (params) {
  return axios({
    url: '/goods',
    method: 'get',
    params: params
  })
}

export function addGoods (params) {
  return axios({
    url: '/goods',
    method: 'post',
    data: params
  })
}

export function queryById (gid) {
  return axios({
    url: `/goods/${gid}`,
    method: 'get'
  })
}

export function editGoods (gid, params) {
  return axios({
    url: `/goods/${gid}`,
    method: 'put',
    data: params
  })
}

export function deleteGoods (gid) {
  return axios({
    url: `/goods/${gid}`,
    method: 'delete'
  })
}

export function uploadUrl () {
  return axios({})
}
