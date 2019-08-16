import Vue from 'vue'
import axios from 'axios'
import qs from 'qs.js'
import AntDesignVue from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'


// eslint-disable-next-line no-unused-vars
import MainLayout from './components/MainLayout.vue'
// eslint-disable-next-line no-unused-vars
import test from './test/test'


Vue.use(AntDesignVue);
Vue.prototype.$axios = axios;
axios.defaults.baseURL = 'http://localhost:8088';
Vue.prototype.qs = qs;
Vue.config.productionTip = false;


new Vue({
    render: h => h(MainLayout),
    axios
}).$mount('#app');

// new Vue({
//     render: h => h(test)
// }).$mount('#app');
