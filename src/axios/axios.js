import axios from 'axios'
import router from '../router'
import { Message } from 'element-ui'
const instance = axios.create({
  timeout: 3000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  },
  baseURL: process.env.baseURL
})
const toLogin = () => {
  router.replace({
    path: '/login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

const errorHandle = (status, other) => {
  switch (status) {
    case 401:
      toLogin()
      break
    case 403:
      this.$cookies.remove('u-token')
      setTimeout(() => {
        toLogin()
      }, 1000)
      break
    default:
      Message.error(other)
  }
}

instance.interceptors.request.use(
  config => {
    const token = this.$cookies.get('u-token')
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
instance.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    let { response } = error
    if (response) {
      errorHandle(response.status, response.data.msg)
    }
    return Promise.reject(response)
  }
)

export default instance
