import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import Vue2Filters from 'vue2-filters';
import VueMoment from 'vue-moment';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import '../static/css/icon.css';
import "babel-polyfill";
import * as filters from '@/utils/filter';
Vue.use(ElementUI, {size: 'small'});

Vue.use(Vue2Filters);
Vue.use(VueMoment);
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]));
//使用钩子函数对路由进行权限跳转
// router.beforeEach((to, from, next) => {
//     const role = localStorage.getItem('ms_username');
//     console.log(role);
//     if (!role) {
//         next('/login');
//     } else {
//         next();
//     }
// });

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
