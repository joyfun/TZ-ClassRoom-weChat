import Vue from 'vue';
const TAB = ['index', 'allCategory'];
Vue.mixin({
	beforeCreate() {
		this.$options.onShareAppMessage = [
			function(opts) {
				let routers = getCurrentPages();
				let current = routers.slice(-1)[0];
				let { options, route } = current;
				let arr = route.split('/');
				let page = arr[1];
				return {
					path: ~TAB.indexOf(page) ? route : `/pages/index/main?page=${arr[1]}&params=${JSON.stringify(options)}`,
				};
			},
		];
	},
});
