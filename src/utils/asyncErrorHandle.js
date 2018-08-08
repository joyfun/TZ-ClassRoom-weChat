import Vue from 'vue';

Vue.config.asyncErrorHandler = err => {
	//  在这里根据服务端返回的各种状态码处理通用错
	let { msg, errMsg } = err;
	let message = msg || errMsg;
	console.log('错误了', err);
	message &&
		wx.showToast({
			title: message,
			icon: 'none',
		});
	// console.log('catch async error:', err);
};

Vue.mixin({
	beforeCreate() {
		const methods = this.$options.methods || {};
		Object.keys(methods).forEach(key => {
			let fn = methods[key];
			this.$options.methods[key] = function(...args) {
				let ret = fn.apply(this, args);
				if (ret && typeof ret.catch === 'function') {
					return ret.catch(Vue.config.asyncErrorHandler);
				} else {
					return ret;
				}
			};
		});
	},
});
