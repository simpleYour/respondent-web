// 一些自定义的组件,过滤器,或引入的第三方的配置中心
import Vue from 'vue'
import timeFormat from "@/utils/timeFormat";
import timeFrom from "@/utils/timeFrom";


// 创建一个自定义的日期过滤器,并且进行全局配置
// Vue.mixin(vuexStore);
// 时间格式化，同时两个名称，date和timeFormat
Vue.filter('timeFormat', (timestamp, format) => {
  return timeFormat(timestamp, format)
})
Vue.filter('date', (timestamp, format) => {
  return timeFormat(timestamp, format)
})
// 将多久以前的方法，注入到全局过滤器
Vue.filter('timeFrom', (timestamp, format) => {
  return timeFrom(timestamp, format)
})

