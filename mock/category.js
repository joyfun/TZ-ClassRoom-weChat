module.exports = {
	// 默认get请求
	'/api/category/list': {
		status: 0,
		msg: '',
		'data|5': [
			{
				id: '@inc(10000)',
				// 'age|18-30': 0,
				name: '@cstr(2,4)',
				'children|2': [
					{
						id: '@inc(10000)',
						name: '@cstr(2,5)',
						'children|5': [
							{
								id: '@inc(10000)',
								name: '@cstr(2,4)',
							},
						],
					},
				],

				// desc: '@cparagraph', 'a|1': ['张三', '李四', '王五'],
			},
		],
	},
	'post /api/web/user/loginByAccount': {
		status: 0,
		messageId: 1524539668377,
		msg: '',
		data: {
			token: '@inc(10000)',
			nick: '@cstr(2,5)',
			headIcon: '@inc(10000)',
		},
	},
	'post /api/user/edit': {
		status: 0,
		messageId: 1524539668377,
		msg: '',
		data: {
			token: '@inc(10000)',
			nick: '@cstr(2,5)',
			headIcon: '@inc(10000)',
		},
	},
};
