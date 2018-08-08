module.exports = {
	'/api/web/category/list': {
		status: 0,
		msg: '',
		'data|1-8': [
			{
				name: '@cstr(2, 5)',
				id: '@inc',
				'children|1-10': [
					{
						name: '@cstr(2, 5)',
						id: '@inc',
						'children|10-20': [
							{
								name: '@cstr(2, 5)',
								id: '@inc',
							},
						],
					},
				],
			},
		],
	},
};
