import axios from '../axios'

export function userList (params) {
  return axios({
    url: '/users',
    method: 'get',
    params: params
  })
}

export function queryUser (userId) {
  return axios({
    url: `/users/${userId}`,
    method: 'get'
  })
}

export function editState (userInfo) {
  return axios({
    url: `/users/${userInfo.id}/state/${userInfo.mg_state}`,
    method: 'put'
  })
}

export function userAdd (userInfo) {
  return axios({
    url: '/users',
    method: 'post',
    data: userInfo
  })
}

export function userEdit (userInfo) {
  return axios({
    url: `/users/${userInfo.id}`,
    method: 'put',
    data: {
      email: userInfo.email,
      mobile: userInfo.mobile
    }
  })
}

export function userDelete (userInfo) {
  return axios({
    url: `/users/${userInfo.id}`,
    method: 'delete'
  })
}
