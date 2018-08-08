// msgType: 1、文本和 2、图片 3、送花 4、人员进出 5、个人禁言 6、聊天室禁言 7、上课 8、下课 9、更新公告
const RES_URL = 'https://res.shiguangkey.com';
const EMOJIS = {
	'[大笑]': 'emoji_0',
	'[可爱]': 'emoji_01',
	'[色]': 'emoji_02',
	'[嘘]': 'emoji_03',
	'[亲]': 'emoji_04',
	'[呆]': 'emoji_05',
	'[口水]': 'emoji_06',
	'[汗]': 'emoji_145',
	'[呲牙]': 'emoji_07',
	'[鬼脸]': 'emoji_08',
	'[害羞]': 'emoji_09',
	'[偷笑]': 'emoji_10',
	'[调皮]': 'emoji_11',
	'[可怜]': 'emoji_12',
	'[敲]': 'emoji_13',
	'[惊讶]': 'emoji_14',
	'[流感]': 'emoji_15',
	'[委屈]': 'emoji_16',
	'[流泪]': 'emoji_17',
	'[嚎哭]': 'emoji_18',
	'[惊恐]': 'emoji_19',
	'[怒]': 'emoji_20',
	'[酷]': 'emoji_21',
	'[不说]': 'emoji_22',
	'[鄙视]': 'emoji_23',
	'[阿弥陀佛]': 'emoji_24',
	'[奸笑]': 'emoji_25',
	'[睡着]': 'emoji_26',
	'[口罩]': 'emoji_27',
	'[努力]': 'emoji_28',
	'[抠鼻孔]': 'emoji_29',
	'[疑问]': 'emoji_30',
	'[怒骂]': 'emoji_31',
	'[晕]': 'emoji_32',
	'[呕吐]': 'emoji_33',
	'[拜一拜]': 'emoji_160',
	'[惊喜]': 'emoji_161',
	'[流汗]': 'emoji_162',
	'[卖萌]': 'emoji_163',
	'[默契眨眼]': 'emoji_164',
	'[烧香拜佛]': 'emoji_165',
	'[晚安]': 'emoji_166',
	'[强]': 'emoji_34',
	'[弱]': 'emoji_35',
	'[OK]': 'emoji_36',
	'[拳头]': 'emoji_37',
	'[胜利]': 'emoji_38',
	'[鼓掌]': 'emoji_39',
	'[握手]': 'emoji_200',
	'[发怒]': 'emoji_40',
	'[骷髅]': 'emoji_41',
	'[便便]': 'emoji_42',
	'[火]': 'emoji_43',
	'[溜]': 'emoji_44',
	'[爱心]': 'emoji_45',
	'[心碎]': 'emoji_46',
	'[钟情]': 'emoji_47',
	'[唇]': 'emoji_48',
	'[戒指]': 'emoji_49',
	'[钻石]': 'emoji_50',
	'[太阳]': 'emoji_51',
	'[有时晴]': 'emoji_52',
	'[多云]': 'emoji_53',
	'[雷]': 'emoji_54',
	'[雨]': 'emoji_55',
	'[雪花]': 'emoji_56',
	'[爱人]': 'emoji_57',
	'[帽子]': 'emoji_58',
	'[皇冠]': 'emoji_59',
	'[篮球]': 'emoji_60',
	'[足球]': 'emoji_61',
	'[垒球]': 'emoji_62',
	'[网球]': 'emoji_63',
	'[台球]': 'emoji_64',
	'[咖啡]': 'emoji_65',
	'[啤酒]': 'emoji_66',
	'[干杯]': 'emoji_67',
	'[柠檬汁]': 'emoji_68',
	'[餐具]': 'emoji_69',
	'[汉堡]': 'emoji_70',
	'[鸡腿]': 'emoji_71',
	'[面条]': 'emoji_72',
	'[冰淇淋]': 'emoji_73',
	'[沙冰]': 'emoji_74',
	'[生日蛋糕]': 'emoji_75',
	'[蛋糕]': 'emoji_76',
	'[糖果]': 'emoji_77',
	'[葡萄]': 'emoji_78',
	'[西瓜]': 'emoji_79',
	'[光碟]': 'emoji_80',
	'[手机]': 'emoji_81',
	'[电话]': 'emoji_82',
	'[电视]': 'emoji_83',
	'[声音开启]': 'emoji_84',
	'[声音关闭]': 'emoji_85',
	'[铃铛]': 'emoji_86',
	'[锁头]': 'emoji_87',
	'[放大镜]': 'emoji_88',
	'[灯泡]': 'emoji_89',
	'[锤头]': 'emoji_90',
	'[烟]': 'emoji_91',
	'[炸弹]': 'emoji_92',
	'[枪]': 'emoji_93',
	'[刀]': 'emoji_94',
	'[药]': 'emoji_95',
	'[打针]': 'emoji_96',
	'[钱袋]': 'emoji_97',
	'[钞票]': 'emoji_98',
	'[银行卡]': 'emoji_99',
	'[手柄]': 'emoji_100',
	'[麻将]': 'emoji_101',
	'[调色板]': 'emoji_102',
	'[电影]': 'emoji_103',
	'[麦克风]': 'emoji_104',
	'[耳机]': 'emoji_105',
	'[音乐]': 'emoji_106',
	'[吉他]': 'emoji_107',
	'[火箭]': 'emoji_108',
	'[飞机]': 'emoji_109',
	'[火车]': 'emoji_110',
	'[公交]': 'emoji_111',
	'[轿车]': 'emoji_112',
	'[出租车]': 'emoji_113',
	'[警车]': 'emoji_114',
	'[自行车]': 'emoji_115',
};
const utils = {
	transEmoji(text) {
		return text.replace(/\[[^\]]+\]/g, match => {
			let name = EMOJIS[match];
			if (!name) return match;
			let url = RES_URL + '/res/live/emoji/' + name + '.png';
			return '<img src="' + url + '" width="25px" class="msg-emoji">';
		});
	},
	parseCustom(str = '{}') {
		try {
			return JSON.parse(str.replace(/'/g, '"'));
		} catch (e) {
			return {};
		}
	},
	_ID: (() => {
		let i = 0;
		return () => {
			return i++;
		};
	})(),
};
const msgsHandle = {
	custom({ msgType, nickname, outRoom, announcement, publishUser }) {
		if (msgType === 'sendFlower') return { fromNick: nickname, msgType: 3 };
		if (msgType === 'classStart') return { msgType: 7, publishUser };
		if (msgType === 'classOver') return { msgType: 8, outRoom };
		if (msgType === 'updateAnnouncement') return { msgType: 9, announcement };
	},
	notification({ type, from, fromNick, to, custom }, mine) {
		if (type === 'memberEnter' && from !== mine) {
			let { roleType, headIcon } = utils.parseCustom(custom);
			return {
				from,
				fromAvatar: headIcon,
				fromNick,
				msgType: 4,
				enter: true,
				roleType,
			};
		}
		if (type === 'memberExit') return { from, fromNick, msgType: 4 };
		if (~['gagMember', 'ungagMember'].indexOf(type) && ~to.indexOf(mine))
			return { msgType: 5, to, gaged: type === 'gagMember' };
		if (~['muteRoom', 'unmuteRoom'].indexOf(type)) return { msgType: 6, mute: type === 'muteRoom' };
	},
	text(msg, mine) {
		let { AtaMsg = [] } = utils.parseCustom(msg.custom);
		return Object.assign(msg, {
			msgType: 1,
			at: AtaMsg.some(obj => obj.id == mine),
			oldText: msg.text,
			text: utils.transEmoji((msg.text + '').replace(/</g, '&lt;').replace(/>/g, '&gt;')),
		});
	},
	image(msg) {
		msg.msgType = 2;
		return msg;
	},
};

export function TZSDK({ NIM, Chatroom }) {
	class Common {
		instance = null;
		config = {};
		constructor(myClass) {
			this.class = myClass;
		}
		init(myClass) {
			this.class = myClass;
		}
		disconnect() {
			this.instance && this.instance.disconnect();
		}
		callApi(method, option = {}) {
			if (!this.instance) return Promise.reject();
			if (!(method && this.instance[method])) {
				return Promise.reject('方法调用有误');
			}
			return new Promise((resolve, reject) => {
				if (!this.instance) {
					reject('没有初始化');
					return;
				}
				this.instance[method](
					Object.assign(option, {
						done: (error, obj) => {
							if (error) reject(error);
							resolve(obj);
						},
					})
				);
			});
		}
		getInstance(option) {
			if (!this.class) {
				alert('请先调用init进行初始化');
				return;
			}
			this.config = option;
			this.instance = this.class.getInstance(this.config);
		}
	}

	class Nim extends Common {
		constructor() {
			super(NIM);
		}
		getInstance(opts) {
			super.getInstance({
				syncSessionUnread: true,
				...opts,
			});
		}
		getChatroomAddress(chatroomId) {
			return this.callApi('getChatroomAddress', {
				chatroomId,
			});
		}
		getHistory(opts) {
			if (~['string', 'number'].indexOf(typeof opts)) opts = { to: opts };
			return this.callApi('getHistoryMsgs', {
				asc: true,
				scene: 'p2p',
				limit: 100,
				...opts,
			});
		}
		sendText(to, text) {
			let opts = typeof to === 'object' ? to : { to, text };
			return this.callApi('sendText', {
				scene: 'p2p',
				...opts,
			});
		}
		parseMsg(msg) {
			let { type } = msg;
			if (~['text', 'image'].indexOf(type)) {
				let res = msgsHandle[type](msg, this.config.account);
				let custom = utils.parseCustom(msg.custom);
				res.fromAvatar = custom.icon;
				res.msgId = utils._ID();
				return res;
			}
		}
		getLocalSessions() {
			return this.callApi('getLocalSessions');
		}
		resetSessionUnread(sessionId) {
			this.instance.resetSessionUnread(sessionId);
		}
		mergeMsgs(oldArr, newArr) {
			return this.instance.mergeMsgs(oldArr, newArr);
		}
		mergeSessions(oldArr, newArr) {
			return this.instance.mergeSessions(oldArr, newArr);
		}
		getUsersInfo(accounts) {
			return this.callApi('getUsers', { accounts });
		}
	}

	class ChatRoom extends Common {
		constructor() {
			super(Chatroom);
		}
		getInstance(options) {
			super.getInstance({
				...options,
				onmsgs: this.parseMsg.bind(this),
			});
		}
		getHistory(options) {
			return this.callApi('getHistoryMsgs', options);
		}
		getMembers(guest, time) {
			let opts = {};
			let defaults = {
				onlyOnline: true,
				limit: 200,
			};
			if (typeof guest === 'object') {
				opts = { ...defaults, ...guest };
			} else {
				opts = { ...defaults, guest, time };
			}
			return this.callApi('getChatroomMembers', opts);
		}
		sendText(text) {
			return this.callApi('sendText', {
				text,
			});
		}
		sendTips(tip) {
			return this.callApi('sendTipMsg', {
				tip,
			});
		}
		parseMsg(msgs = [], history) {
			let { onMsg, account } = this.config;
			msgs.forEach(msg => {
				let { type, content, attach } = msg;
				let handle = msgsHandle[type];
				let param;
				if (type === 'custom') {
					content = utils.parseCustom(content);
					param = content;
				} else if (type === 'notification') {
					param = attach;
				} else if (~['text', 'image'].indexOf(type)) {
					param = msg;
				}
				if (handle) {
					let res = handle(param, account);
					res &&
						(Object.assign(res, {
							time: msg.time,
							msgId: utils._ID(),
						}),
						onMsg(res, history));
				}
			});
		}
	}
	return { Nim, ChatRoom };
}
