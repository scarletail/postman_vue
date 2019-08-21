import Vue from 'vue'
import axios from 'axios'
import store from './store'
import AntDesignVue from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'


// eslint-disable-next-line no-unused-vars
import MainLayout from './components/MainLayout.vue'
// eslint-disable-next-line no-unused-vars
import InCoder from './components/InCoder'

Vue.use(AntDesignVue);
Vue.prototype.$axios = axios;
Vue.prototype.$store = store;
axios.defaults.baseURL = 'http://localhost:8088';
Vue.config.productionTip = false;

new Vue({
    render: h => h(MainLayout),
}).$mount('#app');


// new Vue({
//     render: h => h(InCoder),
// }).$mount('#app');

//TODO 本周重点：
//1. textarea代码的格式化 OK
//2. 增添右键菜单
//3. 发布的编辑
