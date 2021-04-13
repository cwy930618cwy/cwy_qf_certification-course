import base from './base.js'
import axios from '../axios/axios.js'

const home = {
  homeList(params) {
    return axios.get(`${base.sq}/topics`, params)
  }
}

export default home
