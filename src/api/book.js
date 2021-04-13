import base from './base.js'
import axios from '../axios/axios.js'

const book = {
  homeList(params) {
    return axios.get(`${base.sq}/book`, params)
  }
}

export default book
