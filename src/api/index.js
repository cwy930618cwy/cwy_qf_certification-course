import home from '@/api/home.js'
import book from '@/api/book.js'
import axios from "./axios";

export default {
  home,
  book,
  // 获取七牛上传token
  uploadurl: (params) => axios.post("/fileUpLoad/get7NiuYunUpToken", params),
}
