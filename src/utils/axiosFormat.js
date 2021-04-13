import Vue from 'vue'
import axios from 'axios'
import base from '@/api/base.js'
Vue.prototype.$axiosServer = axios
axios.defaults.baseURL = base.cs
axios.defaults.headers.post['Content-Type'] = 'content-type:application/json;charset=utf-8'
axios.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
axios.interceptors.response.use(
  function (response) {
    if (response.data.code == 900 || response.data.code == 901 || response.data.code == 902) {
      console.log('登录过期，去登录页重新登录逻辑')
      return
    }
    if (response.data.code == 200) {
      return response
    } else {
      return response
    }
  },
  function (error) {
    return Promise.reject(error)
  }
)
var httpServer = function (method, url, params, data) {
  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: url,
      params: params || {},
      data: data || {},
      timeout: 3000,
      responseType: 'json',
      headers: {
        Authorization: ''
      }
    })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
export { httpServer }
