import axios from "axios";
import router from "@/router";

// axios.defaults.baseURL = 'http://api-cowa.1000phone.com/api/'; // 测试
// axios.defaults.baseURL = 'http://api-pyadmin.1000phone.com/api/'; // 生产
// axios.defaults.baseURL = 'http://10.0.11.69:8686/api/' // 本地
// axios.defaults.baseURL = 'http://10.0.11.17:8686/api/' // 测试
axios.defaults.baseURL = "http://47.105.79.251:9321/api/"; // 测试
// axios.defaults.baseURL = 'api/' // 测试
axios.defaults.withCredentials = false;

axios.interceptors.request.use((config) => {
  if (localStorage.getItem("token")) {
    config.headers.Authorization = localStorage.getItem("token");
  }
  return config;
});
axios.interceptors.response.use((response) => {
  // if (response.data.code && response.data.code !== "200") {
  //   if (response.data.code === "901") {
  //     localStorage.removeItem("token");
  //     // router.push("/login");
  //   } else if (response.data.code === "902" || response.data.code === "900") {
  //     localStorage.removeItem("token");
  //     router.push("/login");
  //   } else {
  //     return Promise.reject(response.msg || response.data.msg || "Error");
  //   }
  // } else {
  //   return response.data;
  // }

  return response.data;
});

export default axios
