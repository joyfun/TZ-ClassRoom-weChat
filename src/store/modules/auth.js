import types from '../types';
import { transWxToPromise } from '@/utils';
import { wxLogin, getAuth, getMine, loginOut } from '@/services/user';
let {
	login,
	logout,
	setUserInfo,
	setAuthKey,
	setExpire,
	setConfig,
	setUserAccount,
	setVerifyCode,
	setPhone,
	setPhoneLoginTag,
	setModifyName,
} = types;

const TOKEN_KEY = 'token';
const AUTH_KEY = 'authKey';
const CONFIG_KEY = 'sdk_config';
const USERINFO_KEY = 'user_info';
const PHONE_KEY = 'phoneNum';
const AUTHTOKEN_KEY = 'authToken';
const state = {
	token: (() => {
		let token = wx.getStorageSync(TOKEN_KEY) || '';
		let expire = wx.getStorageSync('expire') || '';
		let now = +new Date();
		if (expire && now > expire) {
			wx.setStorageSync(TOKEN_KEY, '');
			wx.setStorageSync('expire', 0);
			wx.setStorageSync(AUTH_KEY, '');
			wx.setStorageSync(AUTHTOKEN_KEY, '');
			return '';
		}
		return token;
	})(),
	authToken: wx.getStorageSync(AUTHTOKEN_KEY) || '',
	expire: wx.getStorageSync('expire') || '',
	authKey: wx.getStorageSync(AUTH_KEY) || '',
	userInfo: wx.getStorageSync(USERINFO_KEY) || {},
	config: wx.getStorageSync(CONFIG_KEY) || {},
	userAccount: [],
	verifyCode: '',
	phone: wx.getStorageSync(PHONE_KEY) || '',
	phoneLoginTag: '',
	modifyName: '',
};

const mutations = {
	[login]: (state, { data }) => {
		state.token = data.token;
		state.authToken = data.authToken;
		wx.setStorageSync(TOKEN_KEY, data.token);
		wx.setStorageSync(AUTHTOKEN_KEY, data.authToken);
	},
	[logout]: state => {
		state.token = '';
		state.authToken = '';
		state.expire = 0;
		state.userInfo = {};
		state.authKey = '';
		state.config = {};
		wx.clearStorageSync();
	},
	[setUserInfo]: (state, userInfo) => {
		state.userInfo = userInfo;
		wx.setStorageSync(USERINFO_KEY, userInfo);
	},
	[setAuthKey]: (state, { authKey }) => {
		state.authKey = authKey;
		wx.setStorageSync(AUTH_KEY, authKey);
	},
	[setExpire]: (state, payload = {}) => {
		let actualExpire;
		let { expire } = payload;
		if (expire !== undefined) {
			actualExpire = expire;
		} else {
			actualExpire = +new Date() + (6 * 24 - 1) * 60 * 60 * 1000;
		}
		wx.setStorageSync('expire', actualExpire);
		state.expire = actualExpire;
	},
	[setConfig]: (state, config) => {
		state.config = config;
		wx.setStorageSync(CONFIG_KEY, config);
	},
	[setUserAccount]: (state, { userAccount }) => {
		state.userAccount = userAccount;
	},
	[setVerifyCode]: (state, verifyCode) => {
		state.verifyCode = verifyCode;
	},
	[setPhone]: (state, phone) => {
		state.phone = phone;
		wx.setStorageSync(PHONE_KEY, phone);
	},
	[setModifyName]: (state, modifyName) => {
		state.modifyName = modifyName;
	},
	[setPhoneLoginTag]: (state, phoneLoginTag) => {
		state.phoneLoginTag = phoneLoginTag;
	},
};

const actions = {
	WxLogin({ state, commit, dispatch }, payload = {}) {
		let { encryptedData, iv } = payload;
		if (!(encryptedData || iv)) {
			wx.showToast({
				title: '系统无法获取到您的手机号码，登录失败',
				icon: 'none',
			});
			return Promise.reject({ noTip: true });
		}
		let key = state.authKey;
		return wxLogin(Object.assign({ key }, payload))
			.then(res => {
				return dispatch('SetLoginData', res.data);
			})
			.catch(res => {
				let { status } = res || {};
				if (status == 1010) {
					commit(setUserAccount, { userAccount: res.data.users });
					return res;
				}
				if (status == 2 || status == 3) {
					commit(setAuthKey, { authKey: '' });
					dispatch('GetAuthKey');
				}
				throw res;
			});
	},
	GetAuthKey({ state, commit }, payload) {
		let { authKey } = state;
		let pro = authKey ? transWxToPromise('checkSession') : Promise.reject();
		return pro.catch(res => {
			return transWxToPromise('login')
				.then(res => {
					let { code } = res;
					return getAuth({ code });
				})
				.then(res => {
					commit(setAuthKey, { authKey: res.data.key });
				});
		});
	},
	GetMine({ commit }) {
		// debugger;
		return getMine()
			.then(res => {
				let detail = res.data.userDetail;
				commit(setPhone, detail.phone);
				commit(
					setUserInfo,
					Object.assign(detail, {
						userName: detail.nickname,
						headIcon: detail.headImg,
						account: detail.account,
					})
				);
				return res;
			})
			.catch(res => {
				throw res;
			});
	},
	SetLoginData({ commit, dispatch, getters }, data = {}) {
		let { imAccount = '', appKey, imToken } = data;
		commit(login, { data });
		commit(setExpire);
		//换了个帐号
		if (imAccount != getters.sdkConfig.account) {
			dispatch('DisconnectIm');
			commit(setConfig, { appKey, account: imAccount.toLowerCase(), token: imToken });
			return dispatch('GetMine');
		}
		return data;
	},
	PhoneLogin() {},
	GetCode() {},
	LoginOut({ commit }) {
		return loginOut()
			.then(res => {
				commit(logout);
			})
			.catch(res => {
				throw res;
			});
	},
};

export default {
	state,
	mutations,
	actions,
};
