import Vue from 'vue';
import App from './index';

const app = new Vue(App);
app.$mount();
export default {
	config: {
		navigationBarTitleText: '手机验证码登录',
		enablePullDownRefresh: false,
	},
};
