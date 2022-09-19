import Vue from 'vue'
import App from './App.vue'
// 路由
import router from './router'
// element ui
import './plugins/element.js'
// axios
import axios from 'axios'
// css
import '@/assets/css/global.css'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
Vue.config.productionTip = false
Vue.prototype.$axios = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
