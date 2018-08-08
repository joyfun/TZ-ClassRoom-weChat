let data = {
	'/course/listRecommend': {
		total: 100,
		'data|1-10': [
			{
				courseId: '@inc',
				courseName: '@cstr(5, 20)', // 课程名称
				mainTeacher: '@cstr(2, 5)', // 主讲老师
				cover: '@img',
				'applyNum|1-100': 1, // 报名人数
				'classNum|1-100': 1, // 上课人数
				liveStartTime: '@time',
				'backChapterNum|1-10': 1, //课程章节数
				'status|0-3': 0,
			},
		],
	},
	'/course/list': {
		total: 100,
		'data|6': [
			{
				courseId: '@inc',
				courseName: '@cstr(1, 10)', // 课程名称
				mainTeacher: '@cstr(2, 5)', // 主讲老师
				cover: '@img',
				'applyNum|1-100': 1, // 报名人数
				'classNum|1-100': 1, // 上课人数
				liveStartTime: '@time',
				'backChapterNum|1-10': 1,
				'status|1-3': 1,
				coursePrice: '@num(0,100)',
			},
		],
	},
	'/course/details': {
		courseName: '@cstr(1, 10)',
		courseApplyNum: 55,
		description: '@cparagraph',
		mainTeacher: '@cstr(2, 5)', // 主讲老师
		unshelve: 0,
		cover: '@img',
		courseDesc: '<p>哈哈哈</p> <img src="https://www-cdn-res.shiguangkey.com/res/images/66.png" alt=""/>',
		nextLiveTime: 1526438179527,
		'isApply|1-2': false,
		'status|1-3': 1,
		teachingMethod: 0,
		endChapterNum: 3,
		'chapters|10': [
			{
				chapterId: '@inc',
				chapterName: '@cstr(1, 10)',
				liveStartTime: '@time',
				playUrl: [
					{
						seconds: 1414,
						name: 'yaoayo3333333',
						polyVid: 'f8f97d17d0c10abd1b183ab02387aade_f',
					},
					{
						seconds: 1414,
						name: 'yaoayo3333333',
						polyVid: 'f8f97d17d0c10abd1b183ab02387aade_f',
					},
				],
				'status|0-2': 1,
				nextLiveTime: '@time',
				poster: 'https://www-cdn-res.shiguangkey.com/res/images/66.png',
			},
		],
	},
	'post /course/applyCourse': {},
	'post /wechat/saveFormId': {},
	'post /course/getWebEncryptSign': {
		signature: '',
		timestamp: '',
		vid: '',
	},
	'/course/getCourseBrief': {
		nimRoomid: 22875758,
		chatroomAddr: ['weblink03.netease.im:443'],
		nimAppKey: 'dfd5768c21dff9c8f82ba7be90cb5b82',
		nimToken: '123456',
		liveAddress: 'rtmp://10566.liveplay.myqcloud.com/live/10566_c31375532712377b71869bd62db8624c',
		publishUser: '0',
		wechatAppAccount: 'wechatvIInle0c',
		managers: [
			{
				role: 5703,
				accid: 9112186,
			},
			{
				role: 5702,
				accid: 9112184,
			},
			{
				role: 5701,
				accid: 9112467,
			},
			{
				role: 5701,
				accid: 9112185,
			},
		],
	},
};

let mock = {};
Object.keys(data).forEach(key => {
	let arr = key.split(/\s+/);
	let len = arr.length;
	arr.splice(len - 1, 1, '/api' + arr[len - 1]);
	mock[arr.join(' ')] = {
		status: 0,
		msg: '',
		data: data[key],
	};
});

module.exports = mock;
