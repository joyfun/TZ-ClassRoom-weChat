import request from '@/utils/request';
import api from './api';
const { cateList } = api;

/**
 * 获取所有类目
 * @param {object} query {pageSize,pageNo}
 * @param {object} mock 模拟数据
 */
export function getCateList(query = {}, mock = {}) {
	return request(
		{
			url: cateList,
			method: 'get',
			data: query,
		},
		mock
	);
}
