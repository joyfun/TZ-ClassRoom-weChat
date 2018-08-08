/**
 * 根据云信的SDK封装的与业务分离的库文件
 * 导出两个类，ChatRoom和Nim
 */
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
			let url = `${RES_URL}/res/live/emoji/${name}.png`;
			return `<img src="${url}" width="25px" class="chat-emoji">`;
		});
	},
	parseJSON(str = '{}', replace = true) {
		try {
			if (replace) str = str.replace(/'/g, '"');
			return JSON.parse(str);
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
// msgType: 1、文本 2、图片 3、送花 4、人员进出 5、个人禁言 6、聊天室禁言 7、上课 8、下课 9、更新公告
const msgsHandle = {
	custom(msg, mine, { filter, filterConfig: { minLength, whiteList } = {} }) {
		let { content: msgContent, from } = msg;
		let { msgType, nickname, outRoom, announcement, publishUser, content = '', messageId } = utils.parseJSON(
			msgContent,
			false
		);
		if (~['normalText', 'followOne'].indexOf(msgType)) {
			if (!filter) return;
			let isOne = msgType === 'followOne';
			isOne && (content = '1');
			if (content.length <= minLength || ~whiteList.indexOf(from))
				content = utils.transEmoji((content + '').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
			return {
				method: 'onMsg',
				param: Object.assign(msg, { msgType: 1, text: content }),
			};
		}
		if (msgType === 'sendFlower')
			return {
				method: 'onMsg',
				param: { fromNick: nickname, msgType: 3 },
			};
		if (msgType === 'classStart') return { method: 'onClassStart', param: publishUser };
		if (msgType === 'classOver') return { method: 'onClassOver', param: outRoom };
		if (msgType === 'updateAnnouncement')
			return {
				method: 'onUpdateAnnouncement',
				param: announcement,
			};
		if (msgType === 'recallMessage')
			return {
				method: 'onRevertMsg',
				param: messageId,
			};
	},
	notification(
		{
			attach: { type, from, fromNick, to, custom = '{}' },
		},
		mine
	) {
		if (type === 'memberEnter' && from !== mine) {
			let { roleType } = utils.parseJSON(custom);
			return {
				method: 'onMember',
				param: { from, fromNick, msgType: 4, enter: true, roleType },
			};
		}
		if (type === 'memberExit')
			return {
				method: 'onMember',
				param: { from, fromNick },
			};
		if (~['gagMember', 'ungagMember', 'blackMember', 'kickMember'].indexOf(type) && ~to.indexOf(mine))
			return {
				method: ~type.indexOf('gagMember') ? 'onGage' : 'onKicked',
				param: { msgType: 5, to, gaged: type === 'gagMember' },
			};
		if (~['muteRoom', 'unmuteRoom'].indexOf(type))
			return {
				method: 'onMute',
				param: { msgType: 6, mute: type === 'muteRoom' },
			};
		// if (type === 'blackMember') console.log('被拉黑了', arguments[0]);
		// if (type === 'kickMember') console.log('踢出去了', arguments[0]);
	},
	text(msg, mine) {
		let { text, custom } = msg;
		let { AtaMsg = [] } = utils.parseJSON(custom);
		return {
			method: 'onMsg',
			param: Object.assign(msg, {
				msgType: 1,
				at: AtaMsg.some(obj => obj.id == mine),
				oldText: text,
				text: utils.transEmoji((text + '').replace(/</g, '&lt;').replace(/>/g, '&gt;')),
			}),
		};
	},
	image(msg) {
		return {
			method: 'onMsg',
			param: Object.assign(msg, {
				msgType: 2,
			}),
		};
	},
};
class Common {
	constructor(yxObj) {
		this._YX_OBJ = yxObj;
	}
	getInstance(config) {
		return new Promise((resolve, reject) => {
			this._YX_INSTANCE = this._YX_OBJ.getInstance({
				...config,
				onconnect: resolve,
				onerror: reject,
			});
		});
	}
	callApi(method, options) {
		let func = this._YX_INSTANCE[method];
		if (!func) return Promise.reject('实例不存在' + method + '方法');
		return new Promise((resolve, reject) => {
			this._YX_INSTANCE[method]({
				...options,
				done(error, res) {
					if (error) reject(error);
					else resolve(res);
				},
			});
		});
	}
	disconnect() {
		this._YX_INSTANCE && this._YX_INSTANCE.disconnect();
	}
}
/**
 * ChatRoom
 * 实例有四个属性：
 * @param _YX_OBJ: 对应的云信对象
 * @param _YX_INSTANCE: 对应的云信实例
 * @param CALLBACKS: 回调函数对象
 * @param MINE: 连接云信的账号
 */
class ChatRoom extends Common {
	constructor(yxObj, options) {
		if (!yxObj) throw '聊天室实例创建失败，没有传入云信的Chatroom';
		super(yxObj);
		this.CALLBACKS = {
			...ChatRoom.defaults,
			...options,
		};
	}
}
ChatRoom.defaults = {
	onMsg(msg) {}, //收到消息回调
	onMember(member) {}, //人员进出回调
	onGage(gage) {}, //禁言回调
	onMute(mute) {}, //聊天室全频禁言回调
	onClassStart(publishUser) {}, //上课
	onClassOver(mute) {}, //下课还是老师出教室了
	onUpdateAnnounce(announcement) {}, //更新聊天室信息
	onKicked() {}, //拉黑或者被踢
	onDisconnect() {}, //断开连接
	onReconnect() {}, //重连
};
ChatRoom.prototype.parseMsg = function(msg) {
	const msgHandleFunc = msgsHandle[msg.type];
	let { method, param } = msgHandleFunc(msg, this.MINE, this.CALLBACKS) || {};
	typeof param === 'object' && Object.assign(param, { msgId: utils._ID() });
	method && this.CALLBACKS[method](param);
};
ChatRoom.prototype.init = function(config = {}) {
	this.MINE = config.account;
	return this.getInstance({
		...config,
		ondisconnect: this.CALLBACKS['onDisconnect'],
		onwillreconnect: this.CALLBACKS['onReconnect'],
		onmsgs: msgs => {
			msgs.forEach(this.parseMsg.bind(this));
		},
	});
};

ChatRoom.prototype.sendMsg = function(text) {
	const {
		filter,
		poriorType,
		filterConfig: { minLength, whiteList, localFilter },
	} = this.CALLBACKS;

	if (filter) {
		if (typeof localFilter === 'function' && !localFilter(text)) return Promise.resolve({ status: 'success' }); //只在本地展示
		if (text.length <= minLength || ~whiteList.indexOf(this.MINE) || poriorType === 'custom')
			return this.callApi('sendCustomMsg', {
				content: JSON.stringify({
					msgType: 'normalText',
					content: text,
				}),
			});
	}
	return this.callApi('sendText', { text });
};
ChatRoom.prototype.followOne = function() {
	const { filter } = this.CALLBACKS;
	if (filter)
		return this.callApi('sendCustomMsg', {
			content: JSON.stringify({
				msgType: 'followOne',
				content: '1',
			}),
		});
	return this.callApi('sendText', {
		text: '1',
	});
};
ChatRoom.prototype.getMembers = function(guest, time) {
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
};

ChatRoom.prototype.getHistory = function(options) {
	return this.callApi('getHistoryMsgs', options);
};

class Nim extends Common {
	constructor(yxObj, options) {
		if (!yxObj) throw 'IM实例创建失败，没有传入云信的NIM';
		super(yxObj);
		this.CALLBACKS = {
			...Nim.defaults,
			...options,
		};
	}
}
Nim.defaults = {
	onSession(sessions) {},
};
Nim.prototype.init = function(config = {}) {
	this.MINE = config.account;
	return this.getInstance({
		...config,
		ondisconnect(res) {},
		onsessions: this.CALLBACKS['onSession'],
		onupdatesession: session => {
			let { lastMsg } = session;
			lastMsg.status === 'success' && this.CALLBACKS['onSession']([session]);
		},
		onmsg: this.parseMsg.bind(this),
	});
};
Nim.prototype.parseMsg = function(msg) {
	let { param } = msgsHandle[msg.type](msg);
	this.CALLBACKS['onMsg'](Object.assign(param, { msgId: utils._ID() }));
};
Nim.prototype.getAntiWords = function() {
	this.callApi('getClientAntispamLexicon');
};
Nim.prototype.filterAntiWords = function(content) {
	return this._YX_INSTANCE.filterClientAntispam({ content });
};
Nim.prototype.getHistory = function(opts) {
	if (typeof opts === 'string') opts = { to: opts };
	return this.callApi('getHistoryMsgs', {
		asc: true,
		scene: 'p2p',
		msgTypes: ['text', 'image'],
		...opts,
	});
};
Nim.prototype.sendText = function(to, text) {
	let opts = typeof to === 'object' ? to : { to, text };
	return this.callApi('sendText', {
		scene: 'p2p',
		...opts,
	});
};
Nim.prototype.resetSessionUnread = function(sessionId) {
	this._YX_INSTANCE.resetSessionUnread(sessionId);
};
Nim.prototype.mergeMsgs = function(oldArr, newArr) {
	return this._YX_INSTANCE.mergeMsgs(oldArr, newArr);
};
Nim.prototype.mergeSessions = function(oldArr, newArr) {
	return this._YX_INSTANCE.mergeSessions(oldArr, newArr);
};
Nim.prototype.getUsersInfo = function(accounts) {
	return this.callApi('getUsers', { accounts });
};

export { ChatRoom, Nim };
