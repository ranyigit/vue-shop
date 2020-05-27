import axios from '../axios'

export function rightsList (type) {
  return axios({
    url: `/rights/${type}`,
    method: 'get'
  })
}

export function rolesList () {
  return axios({
    url: '/roles',
    method: 'get'
  })
}

export function deleteRights (params) {
  return axios({
    url: `/roles/${params.roleId}/rights/${params.rightId}`,
    method: 'delete'
  })
}

export function addRolesRights (params) {
  return axios({
    url: `roles/${params.roleId}/rights`,
    method: 'post',
    data: {
      rids: params.rids
    }
  })
}
