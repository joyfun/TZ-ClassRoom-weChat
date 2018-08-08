import request from '@/utils/request';
import api from './api';
const {
	courseRecommend,
	courseList,
	courseDetail,
	courseApply,
	courseRoomInfo,
	getSign,
	wechatFormId,
	flower,
	checkToken,
	videoHeart,
	roomFilterConfig,
} = api;

/**
 * 获取精品推荐课程列表
 * @param {object} query {pageSize,pageNo}
 * @param {object} mock 模拟数据
 */
export function getRecommendCourseList(query = {}, mock = {}) {
	return request(
		{
			url: courseRecommend,
			method: 'get',
			data: query,
		},
		mock
	);
}

/**
 * 根据类目获取课程列表
 * @param {object} query {categoryId: 类目ID, level: 类目级别, pageSize,pageNo}
 * @param {object} mock 模拟数据
 */
export function getCourseList(query = {}, mock = {}) {
	return request(
		{
			url: courseList,
			method: 'get',
			data: query,
		},
		mock
	);
}

/**
 * 获取课程详情
 * @param {*} query {courseId: 课程ID}
 * @param {*} mock
 */
export function getCourseDetail(query = {}, mock = {}) {
	return request(
		{
			url: courseDetail,
			method: 'get',
			data: query,
		},
		mock
	);
}

/**
 * 报名课程
 * @param {*} query {courseId: 课程ID}
 * @param {*} mock
 */
export function applyCourse(query = {}, mock = {}) {
	return request(
		{
			url: courseApply,
			method: 'post',
			data: query,
		},
		mock
	);
}

/**
 * 获取直播教室配置
 * @param {*} query {courseId: 课程ID}
 * @param {*} mock
 */
export function getRoomInfo(query = {}, mock = {}) {
	return request(
		{
			url: courseRoomInfo,
			method: 'get',
			data: query,
		},
		mock
	);
}

export function getWechatFormId(query = {}, mock = {}) {
	return request(
		{
			url: wechatFormId,
			method: 'post',
			data: query,
		},
		mock
	);
}
/**
 * 获取视频签名
 * @param {*} query
 * @param {*} mock
 */
export function getVideoSign(query = {}, mock = {}) {
	return request({
		url: getSign,
		method: 'get',
		data: query,
	});
}

/**
 * 教室内送花
 */
export function sendFlower(data = {}) {
	return request({
		url: flower,
		method: 'post',
		data,
	});
}
export function getCheckToken(query = {}) {
	return request({
		url: checkToken,
		method: 'get',
		data: query,
	});
}

/**
 * 录播埋点
 */
export function postVideoHeart(data = {}) {
	return request({
		url: videoHeart,
		method: 'post',
		data,
	});
}

/**
 * 获取直播教室消息过滤配置
 */
export function getFilterConfig(data = {}) {
	return request({
		url: roomFilterConfig,
		method: 'get',
		data,
	});
}
