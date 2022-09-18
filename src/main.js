import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import { Message } from 'element-ui'
// axios
import axios from 'axios'
// css
import '@/assets/css/global.css'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$message = Message

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
