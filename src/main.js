import Vue from 'vue'
import axios from 'axios'
import store from './store'
import AntDesignVue from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

import MainLayout from './components/MainLayout.vue'

Vue.use(AntDesignVue);
Vue.prototype.$axios = axios;
Vue.prototype.$store = store;
axios.defaults.baseURL = 'http://localhost:8088';
Vue.config.productionTip = false;

new Vue({
    render: h => h(MainLayout),
}).$mount('#app');
