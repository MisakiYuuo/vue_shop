// 定义时间过滤器，
import Vue from 'vue'
Vue.filter('dateFormat', function (originDate, pattern = '') {
  // 根据给定的时间字符串，得到特定的时间
  const dt = new Date(originDate)
  //   yyyy-mm-dd
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1).toString().padStart(2, '0')
  const d = dt.getDate().toString().padStart(2, '0')
  if (pattern.toLowerCase() === 'yyyy-mm-dd') {
    return `${y}-${m}-${d}`
  } else {
    const hh = dt.getHours().toString().padStart(2, '0')
    const mm = dt.getMinutes().toString().padStart(2, '0')
    const ss = dt.getSeconds().toString().padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }
})
