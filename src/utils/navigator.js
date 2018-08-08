import Vue from 'vue';
// import store from '@/store';
import { transWxToPromise } from '@/utils';

// let AuthRouters = ['message', 'courseDetail', 'live', 'video', 'my', 'myCourse', 'myLiveCourse'];
var last = 0;
let type = {
	0: 'navigateTo',
	1: 'redirectTo',
	2: 'reLaunch',
};
export default function navigateTo(page, params = {}, isRedirect = 0) {
	function navFn() {
		wx.showLoading({
			title: '页面跳转中',
			mask: true,
		});

		let paramArr = Object.keys(params).map(key => {
			return `${key}=${params[key]}`;
		});

		transWxToPromise(type[+isRedirect], {
			url: '/pages/' + page + '/main?' + paramArr.join('&'),
		})
			.finally(res => {
				wx.hideLoading();
			})
			.catch(res => {
				Vue.config.asyncErrorHandler(res);
			});
	}

	var now = +new Date();
	if (now > last + 1500) {
		last = now;
		navFn();
	}
}
