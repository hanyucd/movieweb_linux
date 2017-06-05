// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
Vue.config.productionTip = false;

// import router from './router';
// ------------- start --------------------------------------------------------
// 导入 vue 插件
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
// 使用插件 | 注册
Vue.use(VueRouter);
Vue.use(VueResource);
// 导入样式文件
import './assets/fonts/iconfont.css';
// 导入路由组件
import goods from './components/body/goods/goods';
import ratings from './components/body/ratings/ratings';
import seller from './components/body/seller/seller';
// 定义路由
const routes = [
  { path: '/', redirect: '/goods' }, // url 重定向到 '/goods'
  { path: '/goods', component: goods },
  { path: '/ratings', component: ratings },
  { path: '/seller', component: seller }
];
/* eslint-disable no-new */
// 创建路由实例
const router = new VueRouter({
  // 对象 简写
  routes,
  // 设置 router 中链接激活时,添加的css类名，修改为 item_activate
  linkActiveClass: 'item_active'
});

new Vue({
  el: '#app',
  data: {
    // 集中的事件处理器 | 组件间事件派发与接收 | 该事件中心,组件通过它来通信
    eventHub: new Vue()
  },
  router,
  template: '<App/>',
  components: { App }
});
