import types from '../types';
import { parseTime } from '@/utils';
import { NIM } from '@/vendors/NIM_Web_SDK_v5.0.0';
import { Nim } from '@/lib/TZ-NIM-SDK';

let { setNim, setSessions, setCurrent, setChatMessages, setUsers } = types;

const MSG_DURATION = 3e5;
const SESSION_KEY = 'msg_session';
const state = {
	nimInstance: null,
	sessions: [], //wx.getStorageSync(SESSION_KEY) || [],
	current: '',
	chatMessages: {},
	users: {},
	unread: 0,
};

const mutations = {
	[setNim]: (state, nimInstance) => {
		state.nimInstance = nimInstance;
	},
	[setSessions]: (state, sessions) => {
		let { sessions: oldS, nimInstance } = state;
		let newS = sessions.length ? nimInstance.mergeSessions(oldS, sessions) : [];
		let unread = newS.reduce((prev, cur) => {
			return prev + cur.unread;
		}, 0);
		wx.setStorageSync(SESSION_KEY, newS);
		state.sessions = newS;
		state.unread = unread;
	},
	[setCurrent]: (state, current) => {
		state.current = current;
	},
	[setChatMessages]: (state, obj) => {
		state.chatMessages = {
			...state.chatMessages,
			...obj,
		};
	},
	[setUsers]: (state, users) => {
		state.users = {
			...state.users,
			...users,
		};
	},
};
const getTimeMsgs = msgs => {
	return msgs.map((msg, index) => {
		let showTime;
		let { time } = msg;
		let t = new Date(time);
		let now = new Date();
		let base = parseTime(time, '{h}:{i}');
		if (t.toDateString() === now.toDateString()) {
			if (index === 0 || time - msgs[index - 1].time > MSG_DURATION) showTime = base;
		} else {
			now.setDate(now.getDate() - 1);
			if (t.toDateString() === now.toDateString()) showTime = '昨天 ' + base;
			else showTime = parseTime(time, '{y}-{m}-{d} {h}:{i}');
		}
		return Object.assign(msg, { showTime });
	});
};
const GetLastMsg = time => {
	let t = new Date(time);
	let now = new Date();
	let format = parseTime(time, '{h}:{i}');
	if (t.toDateString() === now.toDateString()) return format;
	now.setDate(now.getDate() - 1);
	if (t.toDateString() === now.toDateString()) return '昨天 ' + format;
	return parseTime(time, '{y}-{m}-{d} {h}:{i}');
};
const actions = {
	InitIm({ state, commit, dispatch, getters }, options = {}) {
		let { nimInstance } = state;
		let { sdkConfig } = getters;
		if (nimInstance) return Promise.resolve();
		console.log('没有初始化，要初始化IM');
		nimInstance = new Nim(NIM, {
			onSession: sessions => dispatch('ParseSessions', sessions),
			onMsg(msg) {
				let { chatMessages, current, users } = state;
				let { from, to, flow, time } = msg;
				let account = flow === 'out' ? to : from;
				let teacher = users[account];
				let olds = chatMessages[account] || [];
				account == current && dispatch('ResetUnread', 'p2p-' + account);
				if (teacher.history && (olds.length === 0 || time - olds[olds.length - 1].time) > MSG_DURATION)
					msg.showTime = parseTime(time, '{h}:{i}');
				commit(setChatMessages, {
					[account]: olds.concat(msg),
				});
			},
		});
		commit(setNim, nimInstance);
		return nimInstance.init({ ...sdkConfig, ...options });
	},
	ParseSessions({ state, commit, dispatch, getters }, sessions) {
		let accounts = [];
		let { users } = state;
		sessions.forEach(session => {
			let {
				to,
				lastMsg: { time, type, text },
			} = session;
			Object.assign(session, {
				last: {
					text: type === 'image' ? '[图片]' : text,
					time: GetLastMsg(time),
				},
			});
			!users[to] && accounts.push(to);
		});
		commit(setSessions, sessions);
		dispatch('GetUsers', accounts);
	},
	ResetUnread({ state }, id) {
		state.nimInstance.resetSessionUnread(id);
	},
	GetHistory({ state, commit, dispatch, getters }, { account, needAuto }) {
		console.log('laile', needAuto);
		let { nimInstance, chatMessages, users } = state;
		return nimInstance
			.getHistory(account)
			.then(res => {
				let { msgs, to } = res;
				let user = state.users[to];
				commit(setUsers, { [to]: { ...user, history: false } });
				if (msgs.length === 0) {
					msgs = [
						{
							type: 'text',
							flow: 'in',
							from: account,
							fromNick: users[to].nick,
							text: '童鞋你好~',
							time: +new Date(),
						},
					];
				}
				let news = nimInstance.mergeMsgs(chatMessages[account] || [], msgs);
				commit(setChatMessages, { [account]: [] });
				getTimeMsgs(news.sort((a, b) => a.time - b.time)).forEach(nimInstance.parseMsg.bind(nimInstance));
				commit(setUsers, {
					[to]: { ...user, history: true },
				});
			})
			.catch(e => {
				throw e;
			});
	},
	SendText({ state, getters, commit, dispatch }, options) {
		let { nimInstance } = state;
		let {
			userInfo: { userName, headIcon },
			sdkConfig: { account },
		} = getters;
		let msg = {
			...options,
			flow: 'out',
			oldText: options.text,
			from: account,
			fromNick: userName,
			fromAvatar: headIcon,
			status: 'sending',
			time: +new Date(),
			type: 'text',
		};
		nimInstance.parseMsg(msg);
		return nimInstance
			.sendText(options)
			.then(res => {
				let { time, status } = res;
				Object.assign(msg, { time, status });
			})
			.catch(e => {
				console.log('发送消息失败', e);
				msg.status = 'fail';
			});
	},
	GetUsers({ state, commit, dispatch }, accounts) {
		let { nimInstance } = state;
		let map = {};
		nimInstance.getUsersInfo(accounts).then(users => {
			users.forEach(user => {
				map[user.account] = Object.assign({ history: false }, user);
			});
			commit(setUsers, map);
		});
	},
	AutoDisconnectIm({ dispatch }) {
		setTimeout(() => {
			let routers = getCurrentPages();
			let current = routers.slice(-1)[0];
			let { route } = current;
			let arr = route.split('/');
			if (!~['message', 'chat', 'live'].indexOf(arr[1])) {
				dispatch('DisconnectIm');
			} else {
				dispatch('AutoDisconnectIm');
			}
		}, 1.08e7);
	},
	DisconnectIm({ state, commit }) {
		if (state.nimInstance) {
			state.nimInstance.disconnect();
			commit(setNim, null);
			commit(setSessions, []);
		}
	},
	HandleUnread({ state }) {
		let { unread } = state;
		if (unread) {
			wx.setTabBarBadge({
				index: 1,
				text: unread > 99 ? '99+' : unread + '',
			});
		} else {
			wx.removeTabBarBadge({ index: 1 });
		}
	},
};

export default {
	state,
	mutations,
	actions,
};
