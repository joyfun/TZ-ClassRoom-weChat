import request from '@/utils/request';
import api from './api';
const {
	userLogin,
	auth,
	myCourse,
	myLiveCourse,
	stateCode,
	verifyCode,
	loginByPhone,
	loginByAccount,
	verifyMessageCode,
	myInfo,
	modifyMsg,
	userLoginOut,
} = api;

/**
 * 登录
 * @param {object} query {encryptedData, iv, authKey}
 * @param {object} mock 模拟数据
 */
export function wxLogin(query = {}, mock = {}) {
	return request(
		{
			url: userLogin,
			method: 'post',
			data: query,
		},
		mock
	);
}

/**
 * 获取authKey
 * @param {object} query {code}
 * @param {object} mock 模拟数据
 */
export function getAuth(query = {}, mock = {}) {
	return request(
		{
			url: auth,
			method: 'post',
			data: query,
		},
		mock
	);
}

/**
 * 获取我报名的课程
 * @param {object} query {pageSize,pageNo}
 * @param {object} mock 模拟数据
 */
export function getMyCourse(query = {}, mock = {}) {
	return request(
		{
			url: myCourse,
			method: 'get',
			data: query,
		},
		mock
	);
}

/**
 * 获取我的直播预告
 * @param {object} query {pageSize,pageNo}
 * @param {object} mock 模拟数据
 */
export function getMyLiveCourse(query = {}, mock = {}) {
	return request(
		{
			url: myLiveCourse,
			method: 'get',
			data: query,
		},
		mock
	);
}
/**
 * 获取国家区号
 * @param {object} query {pageSize,pageNo}
 * @param {object} mock 模拟数据
 */
export function getStateCode(query = {}, mock = {}) {
	return new Promise((resolve, reject) => {
		wx.request({
			url: stateCode,
			data: query,
			header: {
				'content-type': 'application/json',
			},
			success: resolve,
			fail: reject,
		});
	});
}
/**
 * 获取手机验证码
 * @param {object} query {pageSize,pageNo}
 * @param {object} mock 模拟数据
 */
export function postVerifyCode(query = {}, mock = {}) {
	return request(
		{
			url: verifyCode,
			method: 'post',
			data: query,
		},
		mock
	);
}
/**
 * 验证手机验证码
 * @param {object} query {pageSize,pageNo}
 * @param {object} mock 模拟数据
 */
export function postVerifyMessageCode(query = {}, mock = {}) {
	return request(
		{
			url: verifyMessageCode,
			method: 'post',
			data: query,
		},
		mock
	);
}
/**
 * 手机验登录
 * @param {object} query {pageSize,pageNo}
 * @param {object} mock 模拟数据
 */
export function postLoginByPhone(query = {}, mock = {}) {
	return request(
		{
			url: loginByPhone,
			method: 'post',
			data: query,
		},
		mock
	);
}
/**
 * 手机验登录
 * @param {object} query {pageSize,pageNo}
 * @param {object} mock 模拟数据
 */
export function postLoginByAccount(query = {}, mock = {}) {
	return request(
		{
			url: loginByAccount,
			method: 'post',
			data: query,
		},
		mock
	);
}

/**
 * 获取个人信息
 */
export function getMine() {
	return request({
		url: myInfo,
		method: 'get',
	});
}

/**
 * 修改用户信息
 * @param {object} query {pageSize,pageNo}
 * @param {object} mock 模拟数据
 */
export function postModifyMsg(query = {}, mock = {}) {
	return request(
		{
			url: modifyMsg,
			method: 'post',
			data: query,
		},
		mock
	);
}

/**
 * 用户退出登录
 */
export function loginOut(query = {}, mock = {}) {
	return request(
		{
			url: userLoginOut,
			method: 'get',
			data: query,
		},
		mock
	);
}
