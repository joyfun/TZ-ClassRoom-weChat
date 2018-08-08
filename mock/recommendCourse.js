module.exports = {
	// 默认get请求
	'/api/course/listRecommend': {
		status: 0,
		msg: '',
		'data|1-10': [
			{
				courseId: '@inc(10000)',
				courseName: '@cstr(2,4)',
				// mainTeacher: '@cstr(2,4)',
				applyNum: 121,
				classNum: '@num(0,3)',
				liveStartTime: '@num(10,13)',
				status: '@num(1,3)',
				cover: '@img',
				backChapterNum: '@num(0,3)',
				coursePrice: '@num(0,10)', // 课程价格
				teachingMethod: 0, // 直播or录播：0直播，1录播
			},
		],
	},
};
