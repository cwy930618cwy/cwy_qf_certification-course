import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import mixins from './mixins/index.js'
import '@/assets/css/base.less'
import * as VueCookies from 'vue-cookies'
import api from './api'
import { log } from '@/utils/public'
Vue.prototype.$api = api
Vue.prototype.$log = log
// import "@/assets/css/element_theme.scss";
Vue.config.productionTip = false
Vue.use(ElementUi)
Vue.mixin(mixins)
Vue.use(VueCookies)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
