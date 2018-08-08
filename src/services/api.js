import config from '@/utils/env';
let oss = config.oss;
// let study = config.study;
let { auth } = config[EXEC_ENV || 'dev'];
let { study } = config[EXEC_ENV || 'dev'];

export default {
	// 用户
	userLogin: '/user/loginByWeChat', //登录注册
	auth: '/user/auth', //授权
	loginByPhone: '/user/loginByPhone', //手机登录
	loginByAccount: '/user/loginByAccount', //多账号登录
	myInfo: '/user/userInfo', //我的个人资料
	myCourse: '/course/my', //我报名的课程
	myLiveCourse: '/course/myLive', //我的直播预告
	userLoginOut: '/user/logout', //退出登录
	//课程
	courseRecommend: '/course/listRecommend', //精品课程推荐
	courseList: '/course/list', //课程列表
	courseDetail: '/course/details', //课程详情
	courseApply: '/course/applyCourse', //报名课程
	courseRoomInfo: '/course/getCourseLiveInfo', //直播教室信息
	wechatFormId: '/course/saveFormId', //保存formId
	getSign: '/course/getWebEncryptSign', //回看视频
	flower: '/user/flower', //送花
	//类目
	cateList: '/category/list', //所有类目
	modifyMsg: '/user/edit', //修改用户信息
	stateCode: oss + '/res/code/state-region-code.json', //获取各个国家区号
	verifyCode: auth + '/api/verify/sms/send', //获取手机验证码
	verifyMessageCode: auth + '/api/verify/sms/verify', //验证手机验证码
	checkToken: '/user/checkTokenStatus', //检查token有效性
	uploadAvtar: '/api/user/uploadHeadImg',
	videoHeart: study + '/api/live/video-heart', //录播心跳埋点
	roomFilterConfig: study + '/api/interaction/getMsgFilterConfig', //直播间消息过滤配置
};
