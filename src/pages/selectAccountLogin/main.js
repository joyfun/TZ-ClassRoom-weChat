import Vue from 'vue';
import App from './index';

const app = new Vue(App);
app.$mount();
export default {
	config: {
		navigationBarTitleText: '选择账号登录',
	},
};
