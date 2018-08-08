let data = {
	'post /user/login': {
		token: '@str(10)',
		imAccount: '9111160',
		appKey: 'dfd5768c21dff9c8f82ba7be90cb5b82',
		imToken: '123456',
		nick: '@cstr(2, 10)',
		headIcon: '@img',
	},
	'/user/auth': {
		authKey: '20dc568f-3a14-423e-8e80-6ad9c07118db',
	},
	'/user/my-course': {
		total: 100,
		'data|6': [
			{
				courseId: '@inc',
				courseName: '@cstr(1, 10)', // 课程名称
				mainTeacher: '@cstr(2, 5)', // 主讲老师
				cover: '@img',
				'appyNum|1-100': 1, // 报名人数
				'classNum|1-100': 1, // 上课人数
				liveStartTime: '@time',
				'backChapterNum|1-10': 1,
				'status|0-3': 1,
			},
		],
	},
	'/course/myLive': {
		total: 100,
		'data|1-10': [
			{
				courseId: '@inc',
				courseName: '@cstr(10, 30)', // 课程名称
				mainTeacher: '@cstr(2, 5)', // 主讲老师
				cover: '@img',
				'appyNum|1-100': 1, // 报名人数
				'classNum|1-100': 1, // 上课人数
				liveStartTime: '@time',
				'backChapterNum|1-10': 1,
				'status|1-3': 1,
			},
			{
				courseId: '@inc',
				courseName: '@cstr(1, 10)', // 课程名称
				mainTeacher: '@cstr(2, 5)', // 主讲老师
				cover: '@img',
				'appyNum|1-100': 1, // 报名人数
				'classNum|1-100': 1, // 上课人数
				liveStartTime: '@time',
				'backChapterNum|1-10': 1,
				'status|0-3': 1,
			},
		],
	},
	'post /user/loginByPhone': {
		phone: 18229733401,
		'users|3': [
			{
				account: 'm@inc(10000)', //账号
				nickname: '@cstr(2,4)', //昵称
				gmtCreate: '@inc(10000)', //注册时间
				'loginType|0-3': 1, //注册类型
			},
		],
		count: 3,
	},
	// 'post /user/loginByPhone': {
	// 	token: 'm@inc(10000)', //账号
	// 	nick: '@cstr(2,4)', //昵称
	// 	headIcon: '@img', //注册时间
	// 	'loginType|0-3': 1, //注册类型
	// },
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
