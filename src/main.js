import Vue from 'vue';
import App from './App';
import '@/utils/asyncErrorHandle';
import '@/utils/share';
Vue.config.productionTip = false;

App.mpType = 'app';

const app = new Vue(App);
app.$mount();

export default {
	config: {
		pages: ['^pages/index/main'],
		window: {
			navigationBarTitleText: '潭州课堂',
			enablePullDownRefresh: true,
			backgroundTextStyle: 'dark',
			navigationBarBackgroundColor: '#fff',
			navigationBarTextStyle: 'black',
		},
		networkTimeout: {
			request: 10000,
			connectSocket: 10000,
			uploadFile: 10000,
			downloadFile: 10000,
		},
		tabBar: {
			color: '#8a8a8c',
			selectedColor: '#3073f4',
			backgroundColor: '#ffffff',
			list: [
				{
					pagePath: 'pages/index/main',
					iconPath: '/static/images/icon_1_on.png',
					selectedIconPath: '/static/images/icon_1.png',
					text: '课程',
				},
				{
					pagePath: 'pages/allCategory/main',
					iconPath: '/static/images/icon_2_on.png',
					selectedIconPath: '/static/images/icon_2.png',
					text: '分类',
				},
				{
					pagePath: 'pages/my/main',
					iconPath: '/static/images/icon_3_on.png',
					selectedIconPath: '/static/images/icon_3.png',
					text: '我',
				},
			],
		},
	},
};
