function formatNumber(n) {
	const str = n.toString();
	return str[1] ? str : `0${str}`;
}

export function formatTime(date) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();

	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();

	const t1 = [year, month, day].map(formatNumber).join('/');
	const t2 = [hour, minute, second].map(formatNumber).join(':');

	return `${t1} ${t2}`;
}

export function parseTime(time, cFormat) {
	if (arguments.length === 0) {
		return null;
	}
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
	let date;
	if (typeof time === 'object') {
		date = time;
	} else {
		if (('' + time).length === 10) time = parseInt(time) * 1000;
		date = new Date(time);
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay(),
	};
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key];
		if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
		if (result.length > 0 && value < 10) {
			value = '0' + value;
		}
		return value || 0;
	});
	return time_str;
}

export function transWxToPromise(method, option) {
	return new Promise((resolve, reject) => {
		if (method && wx[method]) {
			wx[method]({
				...option,
				success: resolve,
				fail: reject,
			});
		} else {
			reject(method + '方法不存在');
		}
	});
}

export function debounce(func, time) {
	let last = 0;
	return (...args) => {
		let now = +new Date();
		if (now - last < time) return;
		last = now;
		func.apply(this, args);
	};
}

export function insertBefore(callback, thisArg) {
	var T;
	var k = 0;
	var c = 0;
	if (!(this instanceof Array)) {
		throw new TypeError('该方法只能作用于数组');
	}
	if (typeof callback !== 'function') {
		throw new TypeError(callback + ' is not a function');
	}
	var B = this.slice();
	var len = this.length;
	if (arguments.length > 1) {
		T = thisArg;
	}
	while (k < len) {
		var kValue;
		if (k in this) {
			kValue = this[k];
			var R;
			if ((R = callback.call(T, kValue, k, this))) {
				if (R !== undefined) {
					B.splice(k + c++, 0, R);
				}
			}
		}
		k++;
	}
	return B;
}

export const timeControl = (() => {
	let __TIME_CONTROL_MAP = {};
	return (name, time) => {
		let now = +new Date();
		let last = __TIME_CONTROL_MAP[name] || 0;
		if (name === 'RESET') {
			__TIME_CONTROL_MAP = {};
			return;
		}
		if (now - last > time) return (__TIME_CONTROL_MAP[name] = now);
	};
})();

function S4() {
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
export const createUid = () => {
	return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
};
