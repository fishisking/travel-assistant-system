// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/index.scss'
import axios from 'axios'
import http from '@/api/index'
import store from '@/vuex/index'
import { Calendar,Badge,Alert,List,Comment,Avatar,Tooltip,Icon,Card } from "ant-design-vue";
import 'ant-design-vue/lib/Tooltip/style/css'
import 'ant-design-vue/lib/Avatar/style/css'
import 'ant-design-vue/lib/Calendar/style/css'
import 'ant-design-vue/lib/badge/style/css'
import 'ant-design-vue/lib/alert/style/css'
import 'ant-design-vue/lib/list/style/css'
import 'ant-design-vue/lib/comment/style/css'
import 'ant-design-vue/lib/icon/style/css'
import 'ant-design-vue/lib/card/style/css'
import BaiduMap from 'vue-baidu-map'
import moment from 'moment';
import 'moment/locale/zh-cn';
import VueCookies from 'vue-cookies';
import common from '@/api/common'

moment.locale('zh-cn');
Vue.use(BaiduMap, {
  ak: 'LyYzakDwfjW6csEw300aEdFcnbU6kekf'  //这个地方是官方提供的ak密钥
})
Vue.prototype.http = http;
Vue.prototype.$axios = axios;
Vue.prototype.common = common
Vue.config.productionTip = false
Vue.component(Calendar.name, Calendar)
Vue.component(Badge.name, Badge)
Vue.component(Alert.name, Alert)
Vue.component(Comment.name, Comment)
Vue.component(Avatar.name, Avatar)
Vue.component(Tooltip.name, Tooltip)
Vue.component(Icon.name, Icon)
Vue.use(List)
Vue.use(Card)
Vue.use(ElementUI);
Vue.use(moment)
Vue.use(VueCookies)
Vue.filter('judgeNull',function (value) {
  if(!value||value=='null'){
    return '-'
  }else{
    return value;
  }
})
router.beforeEach((to, from, next) => {
  //允许进入的地址
  const permitRouters = ['/home','/']
  if(permitRouters.indexOf(to.path)>=0){
    next()
  }else{
    if(!store.state.user_id){
      router.replace('/home')
    }
    next()
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
})
