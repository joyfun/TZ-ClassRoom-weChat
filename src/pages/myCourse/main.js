import Vue from 'vue';
import App from './index';

const app = new Vue(App);
app.$mount();

export default {
	config: {
		navigationBarTitleText: '我报名的课程',
	},
};
