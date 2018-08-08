import api from './env';
import { transWxToPromise, createUid } from '@/utils';
let base_url = api[EXEC_ENV || 'dev'].base;
import store from '@/store';
const BUSSINESS_ID = 100001;
let requestHandel = [];
const UID_KEY = 'uid';
let UID = wx.getStorageSync(UID_KEY);
if (!UID) {
	UID = createUid();
	wx.setStorageSync(UID_KEY, UID);
}

export default function request(option = {}, mock) {
	requestHandel = [];
	requestHandel.push(option);
	let { url, method = 'post', data = {}, header = {} } = option;
	if (!url) return Promise.reject({ msg: '请求地址有误' });
	let prefix = `${!url.match(/^https?:\/\//) ? base_url + '/api' : ''}`; ///web
	url = prefix + url;
	return transWxToPromise('request', {
		url,
		method,
		data: { ...data, terminalType: 6, imei: UID },
		header: {
			'content-type': 'application/x-www-form-urlencoded',
			token: store.getters.auth,
			business: BUSSINESS_ID,
			...header,
		},
		dataType: 'json',
	}).then(
		res => {
			let data = res.data;
			let { status } = data;
			if (status != 0) {
				if (status == 2) {
					// wx.clearStorageSync();
					store.dispatch('action_clearStorage');
				}
				return Promise.reject(data);
			}
			return data;
		},
		res => {
			// if (mock && Object.keys(mock).length > 0) return mock;
			wx.showToast({
				title: '您的网络好像出了点问题嗷',
				icon: 'none',
			});
			return Promise.reject({});
		}
	);
}
