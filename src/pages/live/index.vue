<template>
	<div class="live-container" :style="{height: availHeight+'px'}">
		<div class="live-top" :class="isOpen?'inline-block':'block'">
			<MyPlayer ref="player" :total="total" :showFlowerTip="showFlowerTip" :danmuSwitch.sync="danmuSwitch" :error="isKicked ? '您的账号在其他端登录' : livingPrompts[livingStatus]" :playUrl="liveUrl" :postImg="course.fullCover" @loginSuccess="init" @sendFlower="interact('sendFlower')" @addOne="interact('followOne')" :mute="classMute || gaged"></MyPlayer>
		</div>
		<!-- 获取盒子高度 不可见 -->
		<view class="tips announce1" id='the'>
			<view class="textarea">{{announcement}}</view>

			<view class="copy-btn btn-common">复制公告</view>
			<view class="close-btn btn-common">关闭公告</view>

		</view>
		<!-- 公告 -->
		<view class="tips announce" :style="{height:tipHeight}" :class="flag?'long':'short'" v-if="showPublic && announcement && tab ==1">
			<view class="textarea">{{announcement}}</view>
			<view class="close " @click.stop="slider">
				<img src="/static/images/icon_1@2x.png" alt=" " :class="flag?'rotate':''">
				<!-- <img src="/static/images/icon_2@2x.png" alt=" " v-else> -->
			</view>

			<view class="copy-btn btn-common" v-if="flag" @click.stop='copyTip'>复制公告</view>
			<view class="close-btn btn-common" v-if="flag" @click.stop="showPublic=!showPublic">关闭公告</view>

		</view>
		<div class="live-bottom ">
			<div class="live-bar ">
				<div class="teacher-bar " v-show="tab==2 ">
					老师列表
					<a class="back " @click="tab=1 ">返回</a>
				</div>
				<div class="teacher-bar " v-show="tab==3 ">
					{{chatWith ? teachers[chatWith].nick : ''}}
					<a class="back " @click="endChat ">返回</a>
				</div>
			</div>
			<!--阴影-->
			<div class="bgGradient" v-if="!(showPublic && announcement) && tab ==1"></div>
			<scroll-view id="msgContainer" :scrollY="true" :scrollIntoView="roomTopId " class="live-room" v-show="tab==1 " @scroll="onScroll($event, 1) ">
				<div v-if="auth" v-for="msg in roomMsgList" :key="msg.msgId || msg.time " :id=" 'msg'+msg.msgId ">
					<div class="room-message " :class="[msg.role==10 || msg.flow=='out' ? '' : msg.role==5702 ? 'tutor' : 'teacher', msg.flow=='out' ? 'me' : ''] ">
						<span class="notify flower " v-if="msg.msgType==3 ">
							<span class="nick ">{{msg.fromNick}}</span>送了老师一朵<img src="/static/images/icon-flower.png " class="img-flower "></span>
						<span class="notify welcome " v-else-if="msg.msgType==4 ">
							欢迎
							<span class="nick ">{{msg.fromNick}}</span> 进入教室
						</span>
						<span class="notify mute " v-else-if="msg.msgType==5 ">您已被老师{{msg.gaged ? '' : '解除'}}禁言</span>
						<span class="notify mute " v-else-if="msg.msgType==6 ">老师已{{msg.mute ? '开启' : '关闭'}}全屏禁言</span>
						<span class="notify mute " v-else-if="msg.msgType==888">{{msg.text}}</span>
						<template v-else-if="~[1, 2].indexOf(msg.msgType) ">
							<div class="room-content ">
								<span>
									<span class="badge">{{msg.role == 10 || msg.flow=='out' ? '学生' : msg.role == 5702 ? '助教' : '老师'}}</span>{{msg.fromNick}}
								</span>
								<span class="text " v-if="msg.msgType==2 ">
									<img :src="msg.file.url " :style="{width: msg.file.w+ 'px', height: (msg.file.w> maxRoomWidth ? maxRoomWidth * msg.file.h / msg.file.w : msg.file.h)+'px'}">
								</span>
								<rich-text class="text" :class="{green: msg.at}" :nodes="msg.text" v-else></rich-text>
								<img src="/static/images/live-loading.gif" class="live-status live-loading" v-if="msg.status=='sending'">
								<img src="/static/images/live-error.png" class="live-status" v-else-if="msg.status=='fail'">
								<!--  @click="sendText(msg)" -->
							</div>
						</template>
					</div>
				</div>
				<div class="empty room" v-if="!auth">
					<div class="img"><img src="/static/images/icon-nologin.png" alt=""></div>
					<p>您还没有登录，登录之后才能和老师同学互动哦。</p>
				</div>
			</scroll-view>
			<view class="tips at-tips" v-show="tab == 1 && atFrom">
				{{atFrom}}@了你
				<view class="close" @click="atFrom=''">
					<img src="/static/images/icon-close-green.png" alt="">
				</view>
			</view>
			<div class="live-teachers" v-show="tab == 2">
				<div class="empty" v-if="teacherList.length === 0">
					<img src="/static/images/icon-empty.png" alt="">
					<p>童鞋，老师不在线，返回聊天室和大家互动吧</p>
				</div>
				<div v-for="teacher in teacherList" class="teacher" :key="teacher.account" @click="toChat(teacher.account)">
					<img :src="teacher.avatar || '/static/images/avatar.png'" class="teacher-avatar lf ">
					<div class="content ">
						<view>
							<span class="name max lf ">{{teacher.nick}}</span>
							<span class="time rf ">{{teacher.last.time || ''}}</span>
						</view>
						<view>
							<span class="text max lf ">{{teacher.last.text || ''}}</span>
							<i class="unread rf" v-show="teacher.unread > 0">
								<span>{{teacher.unread > 99 ? 99 : teacher.unread}}</span>
								<span class="super" v-show="teacher.unread > 99">+</span>
							</i>
						</view>
					</div>
				</div>
			</div>
			<scroll-view :scrollY="true" :scrollIntoView="chatTopId" class="live-chat" v-show="tab == 3" @scroll="onScroll($event, 2)">
				<div v-for="msg in chatMsgList" :key="msg.msgId || msg.time">
					<div class="chat-message time" v-if="msg.showTime">{{msg.showTime}}</div>
					<div class="chat-message" :class="{me: msg.flow === 'out'}" :id="'msg'+msg.msgId">
						<img :src="(msg.flow === 'in' && users[msg.from] ? users[msg.from].avatar : msg.fromAvatar) || '/static/images/avatar.png'" class="msg-avatar">
						<div class="chat-content">
							<span class="text" v-if="msg.type == 'image'">
								<img :src="msg.file.url" :style="{width: msg.file.w+'px', height: (msg.file.w > maxChatWidth ? maxChatWidth * msg.file.h / msg.file.w : msg.file.h)+'px'}">
							</span>
							<rich-text :nodes="msg.text" v-else></rich-text>
							<img src="/static/images/live-loading.gif" class="live-status live-loading" v-if="msg.status=='sending'">
							<img src="/static/images/live-error.png" class="live-status" v-else-if="msg.status=='fail'">
							<!--  @click="sendText(msg)" -->
						</div>
					</div>
				</div>
			</scroll-view>
			<div class="live-box" :class="{room: tab==1}" v-show="tab == 1 || tab == 3">
				<img src="/static/images/icon_xiaohua.png" alt="刷花" class="lf iconFlower" @click="interact('sendFlower')" v-show="tab==1">
				<img src="/static/images/icon_one.png" alt="+1" class="lf iconOne" @click="interact('followOne')" v-show="tab==1">
				<input type="text" v-model.lazy="input" :placeholder="auth ? '一起参与互动吧~' :'您暂未登录哦~'" class="lf" :adjust-position="false" @focus="focus" @blur="blur" maxlength="300" :cursor-spacing="6">
				<button plain class="send rf" :class="{active: auth}" @click="sendText">发送</button>
			</div>
		</div>
		<div class="msg-tip" @click="checkMsg" :style="{visibility: tab==1 ? 'visible' : 'hidden'}">
			<img src="/static/images/live-chat.png" class="chat-image">
			<span class="text">点击这里与老师私聊吧！</span>
			<i class="unread" v-show="unread > 0"></i>
		</div>
		<!-- 挤下线弹窗 -->
		<div class="kicked" v-show="isKicked">
			<div class="content">
				<div class="body">您的账号在其他端登录，已被迫下线。</div>
				<div class="footer">
					<label class="cancel" @click="navigateTo('courseDetail', {courseId}, true)">取消登录</label>
					<label @click="reconnect">重新登录</label>
				</div>
			</div>
		</div>
		<div class="no-login-shade" v-if="!auth" @click="showTip('您还未登录哦~')"></div>
	</div>
</template>
<script>
import { getCourseDetail, getRoomInfo, applyCourse, sendFlower, getFilterConfig } from '@/services/course';
import { transWxToPromise, timeControl } from '@/utils';
import store from '@/store';
import types from '@/store/types';
import navigateTo from '@/utils/navigator';
import MyPlayer from '@/components/player';
import config from '@/utils/env';
let RoomInstance;
let ERROR_MSG = {
	13004: '您已经被禁言',
	13006: '老师已开启全屏禁言',
};
//0：加载中 1：未开始 2：老师不在教室 3：下课了 4：可以听课
let State_Prompt = {
	0: '加载中...',
	1: '课程未开始',
	2: '老师不在教室，请稍侯',
	3: '课程已结束',
	10: '加载错误，请检查网络是否设置正确',
};
let State = {
	0: {
		noStart: 1,
		noTeacher: 2,
		study: 4,
		error: 10,
	},
	1: {
		study: 4,
	},
	2: {
		study: 4,
	},
	4: {
		noTeacher: 2,
		over: 3,
	},
};
const createInitData = () => {
	return {
		flowerShowTime: false,
		tab: 1,
		course: {},
		livingStatus: 0,
		input: '',
		oldInput: '',
		liveUrl: '',
		total: 0,
		roomMsgList: [],
		teachers: {},
		chatWith: '',
		roomTopId: '',
		chatTopId: '',
		todayMaxTime: 0,
		showMsgTip: true,
		containerHeight: 0,
		roomNeedScroll: true,
		chatNeedScroll: true,
		isOpen: false,
		showPublic: true,
		isKicked: false,
		announcement: '',
		atFrom: '',
		publishUser: 0,
		isConnected: false,
		danmuSwitch: false,
		tipHeight: '80rpx', //公告高度
		flag: false, //公告展开 搜索
		classMute: false, //聊天室禁言状态
		gaged: false, //个人禁言状态
		/**
		 * 过滤消息的配置参数
		 * openGlobalFilter: 是否开启全局消息频率限制和本地验证功能
		 * openVipFilter: VIP教室是否开启消息频率限制和本地验证功能
		 * msgFrequency: 消息发送频率，数字10表示每10秒发送一次
		 * minMsgLength: 需本地验证的最小消息长度
		 * isWhitelist: 是否是白名单用户，包括老师账号、白名单用户和白名单ip的检测结果
		 * accids: 用于活跃气氛的内部人员账号
		 */
		filterConfig: {
			openGlobalFilter: false,
			openVipFilter: false,
			openLocalFilter: false,
			msgFrequency: 10,
			minMsgLength: 5,
			isWhitelist: false,
			accids: [],
		},
	};
};
const BLACK_TIPS = '您已被当前教室拉黑';
// const DANMU_CONFIG = {
// 	duration: 20000, //一条弹幕的时间是20s
// 	maxNum: 10,
// };
// let DANMU_NUM = 0;
// let DANMU_LAST = 0;

export default {
	name: 'live',
	data() {
		let ratio = store.getters.ratio;
		return {
			...createInitData(),
			courseId: '',
			livingPrompts: State_Prompt,
			roomMsgLimit: 50,
			chatMsgLimit: 50,
			isOut: false,
			maxRoomWidth: 560 / ratio,
			maxChatWidth: 520 / ratio,
			navigateTo,
			windowHeight: 0,
			availHeight: 0,
			classId: '',
			showFlowerTip: false,
		};
	},
	components: { MyPlayer },
	computed: {
		auth() {
			return store.getters.auth;
		},
		users() {
			return store.getters.users;
		},
		userInfo() {
			return store.getters.userInfo;
		},
		sessions() {
			let sessions = store.getters.sessions;
			let users = store.getters.users;
			sessions.forEach(session => {
				let to = session.to;
				let teacher = this.teachers[to];
				teacher && Object.assign(teacher, session, users[to]);
			});
			return sessions;
		},
		chatMsgList() {
			let account = this.chatWith;
			let list = store.getters.chatMessages[account] || [];
			return list.slice(-this.chatMsgLimit);
		},
		teacherList() {
			let teachers = this.teachers;
			let list = [];
			Object.keys(teachers).forEach(account => {
				let teacher = teachers[account];
				if (teacher.online) list.push(teacher);
			});
			return list;
		},
		unread() {
			let teachers = this.teachers;
			let num = Object.keys(teachers).reduce((prev, cur) => {
				let { unread, online } = teachers[cur];
				if (unread > 0) {
					let audioContext = wx.createInnerAudioContext();
					let message = '/static/audio/message.mp3';
					audioContext.autoplay = true;
					audioContext.volume = 1;
					audioContext.src = message;
				}
				return prev + (online ? unread : 0);
			}, 0);
			return num;
		},
	},
	watch: {
		tab(tab) {
			if (tab != 2) {
				let current = this.input;
				this.input = this.oldInput;
				this.oldInput = current;
			}
		},
		chatMsgList(list) {
			list.length && this.chatNeedScroll && this.scrollToTop('chatTopId', list[list.length - 1].msgId);
		},
	},
	methods: {
		// 展开 收缩
		slider() {
			let that = this;
			this.flag = !this.flag;
			if (this.flag) {
				wx
					.createSelectorQuery()
					.select('#the')
					.boundingClientRect(function(rect) {
						that.tipHeight = rect.height + 'px'; // 节点的高度
					})
					.exec();
			} else {
				that.tipHeight = '80rpx';
			}
		},
		// 点击复制公告内容
		async copyTip() {
			try {
				await transWxToPromise('setClipboardData', {
					data: this.announcement,
				});
				this.showTip('复制成功！');
			} catch (e) {
				this.showTip('复制失败，请重试！');
			}
		},
		changeState(action) {
			let current = this.livingStatus;
			let may = State[current];
			this.livingStatus = may[action] || current;
		},
		showTip(title, during = 1500) {
			wx.showToast({
				icon: 'none',
				title,
			});
		},
		showLoading(title) {
			wx.showLoading({
				mask: true,
				title,
			});
		},
		getRoomInfo(res) {
			/* let res = await getRoomInfo({
				courseId: this.courseId,
			}); */
			let { chatroomId, chatroomAddr: chatroomAddresses, managers = [], liveAddressList = {}, publishUser } = res.data;
			this.config = {
				chatroomId,
				chatroomAddresses,
			};
			this.liveUrl = liveAddressList.originalRtmp;
			this.publishUser = publishUser;
			this.changeState(publishUser == 0 ? 'noTeacher' : 'study');
			let teachers = {};
			managers.forEach(manager => {
				teachers[manager.accid] = {
					...manager,
					history: false,
					unread: 0,
					online: false,
					lastMsg: {},
					last: {},
				};
			});
			this.teachers = teachers;
		},
		async applyCourse() {
			await applyCourse({ courseId: this.courseId });
			wx.showToast({ title: '报名成功' });
		},
		connect() {
			if (!this.isOut) {
				let { chatroomId, chatroomAddresses } = this.config;
				if (!(chatroomId && chatroomAddresses)) {
					this.showTip('聊天室配置错误');
					return;
				}
				store.dispatch('InitIm').catch(res => {
					console.log('IM初始化失败', res);
					this.showTip('IM初始化失败');
				});
				this.connectRoom();
			}
		},
		onKicked() {
			let duration = 5e3;
			this.exitFullScreen();
			wx.showToast({
				title: BLACK_TIPS,
				duration,
				icon: 'none',
			});
			setTimeout(
				() =>
					wx.navigateBack({
						delta: 1,
					}),
				duration
			);
		},
		localFilter(text) {
			if (!NimInstance) return true;
			let { filterConfig: { openLocalFilter } } = localData;
			if (!openLocalFilter) return true;
			const { type } = NimInstance.filterAntiWords(text);
			if (!type || type < 2) return true;
			return;
		},
		getRoomCallbacks() {
			let { filterConfig: { openGlobalFilter, openLocalFilter, minMsgLength, accids } } = this;
			return {
				filter: openGlobalFilter,
				filterConfig: {
					minLength: minMsgLength,
					whiteList: accids.concat(Object.keys(this.teachers)),
					localFilter: openLocalFilter && this.localFilter,
				},
				onMsg: this.onRoomMsg,
				onReconnect: () => {
					this.isConnected && this.sendCustomSysMsg('正在尝试重新连接聊天室，请稍等...');
					this.isConnected = false;
				},
				onDisconnect: ({ code, reason }) => {
					code !== 'logout' && this.sendCustomSysMsg('抱歉，连接聊天室失败');
					if (code == 13003 || (code === 'kicked' && reason === 'managerKick')) {
						this.onKicked();
						return;
					}
					this.isKicked = code == 'kicked' && reason == 'samePlatformKick';
					this.total = 0;
					Object.keys(this.teachers || []).forEach(account => {
						this.teachers[account].online = false;
					});
				},
				onMember: msg => {
					let { from, enter } = msg;
					let teacher = this.teachers[from];
					teacher && (teacher.online = enter);
					if (enter) {
						this.total++;
						// this.onRoomMsg(msg);
					} else this.total--;
				},
				onClassOver: outRoom => this.changeState(outRoom ? 'noTeacher' : 'noStart'),
				onClassStart: publishUser => {
					this.publishUser = publishUser;
					this.changeState('study');
				},
				onMute: msg => {
					this.classMute = msg.mute;
					this.onRoomMsg(msg);
				},
				onGage: msg => {
					this.gaged = msg.gaged;
					this.onRoomMsg(msg);
				},
				onUpdateAnnouncement: announcement => {
					this.announcement = announcement;
					this.flag = false;
					this.tipHeight = '80rpx';
					this.showPublic = true;
				},
				onRevertMsg: id => {
					let list = this.roomMsgList;
					for (let index in list) {
						if (list[index].idClient == id) {
							list.splice(index, 1);
							break;
						}
					}
				},
				onKicked: this.onKicked,
			};
		},
		onRoomMsg(msg) {
			let { from, fromNick, at } = msg;
			let teacher = this.teachers[from] || {};
			at && (this.atFrom = fromNick);
			this.roomMsgList = this.roomMsgList
				.concat(Object.assign(msg, { role: teacher.role || 10 }))
				.slice(-this.roomMsgLimit);
			this.roomNeedScroll && this.$nextTick(() => this.scrollToTop('roomTopId', msg.msgId));
		},
		async connectRoom() {
			let room = store.getters.room;
			this.sendCustomSysMsg('正在连接聊天室，请稍等...');
			try {
				if (room) await store.dispatch('DisconnectRoom');
				let res = await store.dispatch('InitRoom', { config: { ...this.config }, callbacks: this.getRoomCallbacks() });
				this.sendCustomSysMsg('聊天室连接成功');
				this.isConnected = true;
				this.isKicked = false;
				RoomInstance = store.getters.room;
				if (!res) return;
				let { chatroom: { onlineMemberNum, announcement, mute }, member: { gaged } } = res;
				this.total = onlineMemberNum;
				this.announcement = announcement;
				this.classMute = mute;
				this.gaged = gaged;
				this.getAdmins();
				// this.getRoomHistory();
			} catch (e) {
				console.log('聊天室连接失败', e, store.getters.sdkConfig, this.config);
				wx.hideLoading();
				let msg = e && e.message ? e.message : '聊天室初始化失败，若一直连接不上，请退出小程序重新进入';
				this.showTip(msg, 5000);
			}
		},
		async getRoomHistory() {
			let { msgs } = await RoomInstance.getHistory({
				msgTypes: ['text', 'image'],
				limit: 20,
			});
			msgs.sort((a, b) => {
				return a.time - b.time;
			});
			RoomInstance.parseMsg(msgs, true);
		},
		async getAdmins(time = 0) {
			let { members, limit } = await RoomInstance.getMembers({
				guest: false,
				time,
				onlyOnline: false,
			});
			let lastTime;
			members.forEach(member => {
				let { account, type, updateTime } = member;
				if (type === 'manager') {
					Object.assign(this.teachers[account], member, { online: true });
					lastTime = updateTime;
				}
			});
			members.length === limit && this.getAdmins(lastTime);
		},
		scrollToTop(key, id) {
			this.$nextTick(() => {
				this[key] = `msg${id}`;
				setTimeout(() => {
					this[key] = '_id_noexist';
				}, 1000);
			});
		},
		sendCustomSysMsg(text) {
			let now = +new Date();
			this.onRoomMsg({
				text,
				msgType: 888,
				msgId: now,
				time: now,
				flow: 'out',
				status: 'success',
			});
		},
		async toChat(account) {
			let teacher = this.teachers[account];
			store.commit(types.setCurrent, account);
			this.chatWith = account;
			let pro = Promise.resolve();
			!this.users[account] &&
				store.commit(types.setUsers, {
					[account]: Object.assign(
						{},
						{
							nick: teacher.nick,
							avatar: teacher.avatar,
							account,
						}
					),
				});
			this.showLoading('获取历史消息中');
			pro = store.dispatch('GetHistory', { account, needAuto: true });
			await pro.finally(res => {
				this.tab = 3;
				wx.hideLoading();
			});
			store.dispatch('ResetUnread', 'p2p-' + account);
		},
		checkMsg() {
			let teachers = this.teachers;
			let matches = Object.keys(teachers).filter(account => {
				let { online, unread } = teachers[account];
				return online && unread > 0;
			});
			if (matches.length === 1) {
				this.toChat(matches[0]);
				return;
			}
			this.tab = 2;
		},
		endChat() {
			this.tab = 2;
			this.chatWith = '';
			store.commit(types.setCurrent, '');
		},
		getContainerHeight() {
			wx
				.createSelectorQuery()
				.select('#msgContainer')
				.boundingClientRect(rect => {
					console.log('获取容器高度', rect.height);
					this.containerHeight = rect.height;
				})
				.exec();
		},
		onScroll(e, tab) {
			let { detail: { scrollHeight, scrollTop } } = e.mp;
			let param = tab == 1 ? 'roomNeedScroll' : 'chatNeedScroll';
			this[param] = (scrollTop + this.containerHeight) / scrollHeight > 0.9;
		},
		/* changeInput(e) {
			let { detail } = e.mp || {};
			this.input = (detail.value || '').trim();
		}, */
		async init() {
			this.livingStatus = 0;
			this.showLoading('加载中');
			try {
				let res = await getCourseDetail({
					courseId: this.courseId,
				});
				let { data } = res;
				let { courseName, unshelve, status, isApply, chapters } = data;
				data.fullCover = config.res + data.cover + (store.getters.imgPostfix + 550);
				this.course = data;
				this.classId = chapters.length > 0 ? chapters[0].classId : '';
				transWxToPromise('setNavigationBarTitle', { title: courseName });
				if (unshelve == 1) {
					setTimeout(() => {
						wx.hideLoading();
						!this.isOut && navigateTo('unshelve', { title: courseName }, 1);
					}, 1000);
					return;
				}
				//没在直播
				if (status != 1) throw { status: 8888, msg: '课程暂无直播' };
				//没登录
				if (!this.auth) {
					wx.hideLoading();
					return;
				}
				if (!isApply) {
					await applyCourse({ courseId: this.courseId });
					wx.showToast({ title: '报名成功' });
				}
				let info = await getRoomInfo({
					courseId: this.courseId,
				});
				await this.getFilterConfig();
				this.getRoomInfo(info);
				this.getContainerHeight();
				this.connect();
				wx.hideLoading();
			} catch (e) {
				console.log('init失败', e);
				wx.hideLoading();
				if (e.status === 8888) {
					transWxToPromise('showModal', {
						title: '温馨提示',
						content: e.msg,
						showCancel: false,
					}).then(res => {
						navigateTo('courseDetail', { courseId: this.courseId }, 1);
					});
					return;
				}
				this.changeState('error');
			}
		},
		reconnect() {
			this.connectRoom();
		},
		focus(e) {
			this.availHeight = this.windowHeight - +e.mp.detail.height;
		},
		blur() {
			this.availHeight = this.windowHeight;
		},
		interact(method, ...params) {
			if (this.tab == 1) {
				if (this.guestCode) return;
				if (!this.isConnected) {
					this.showTip('当前未连接上聊天室，无法发送消息');
					return;
				}
				let { classMute, gaged } = this;
				if (classMute) {
					this.showTip(ERROR_MSG[13006]);
					return;
				}
				if (gaged) {
					this.showTip(ERROR_MSG[13004]);
					return;
				}
			}
			this[method](...params);
		},
		async sendFlower() {
			// let { msgFrequency } = this.filterConfig;
			if (!timeControl('SEND_FLOWER', 5e3)) {
				let player = this.$refs.player;
				// console.log(fullScreen + '----1111ch');
				if (!(player && player.fullScreenStatus)) {
					this.showTip('鲜花冷却中');
					this.showFlowerTip = false;
				} else {
					if (!this.flowerShowTime) {
						this.showFlowerTip = true;
						this.flowerShowTime = true;
						setTimeout(() => {
							this.showFlowerTip = false;
						}, 2000);
					}
				}
				return;
			}
			this.flowerShowTime = false;
			await sendFlower({
				courseId: this.courseId,
				classId: this.classId,
				nickName: this.userInfo.userName,
			});
		},
		buildTempMsg(text) {
			let { userName, headIcon } = this.userInfo;
			return {
				flow: 'out',
				text,
				// oldText: text,
				fromNick: userName,
				fromAvatar: headIcon,
				// msgType: 1,
				type: 'text',
				status: 'sending',
				time: +new Date(),
			};
		},
		async followOne() {
			/* let { filterConfig: { msgFrequency } } = this;
			if (!timeControl('FOLLOW_ONE', msgFrequency * 1e3)) {
				this.showTip('+1冷却中');
				return;
			} */
			let msg = this.buildTempMsg('1');
			RoomInstance.parseMsg(msg);
			try {
				const { time, status } = await RoomInstance.followOne();
				Object.assign(msg, { time, status });
			} catch (e) {
				console.log('加1', e);
				msg.status = 'fail';
			}
		},
		sendText() {
			if (!this.input) {
				this.showTip('不能发送空消息');
				return;
			}
			this.tab == 1 ? this.sendRoomText() : this.sendImtext();
		},
		async sendRoomText() {
			let { filterConfig: { msgFrequency } } = this;
			if (!timeControl('SEND_TEXT', msgFrequency * 1e3)) {
				this.showTip('两次发消息时间间隔不能少于' + msgFrequency + '秒哦');
				return;
			}
			let text = this.input;
			let msg = this.buildTempMsg(text);
			RoomInstance.parseMsg(msg);
			// this.onRoomMsg(msg);
			try {
				const { time, status } = await RoomInstance.sendMsg(text);
				Object.assign(msg, { time, status });
				this.input = '';
			} catch (e) {
				msg.status = 'fail';
			}
		},
		async sendImtext() {
			await store
				.dispatch('SendText', {
					to: this.chatWith,
					text: this.input,
					custom: JSON.stringify({ icon: this.userInfo.headIcon }),
				});
			this.input = '';
		},
		async getFilterConfig() {
			const res = await getFilterConfig({
				courseId: this.courseId,
				classId: this.classId,
				token: store.getters.authToken,
			});
			Object.assign(this.filterConfig, res.data, {
				accids: res.data.accids.map(account => account + ''),
			});
		},
		exitFullScreen() {
			let player = this.$refs.player;
			// console.log(player + '---chh');
			if (player && player.fullScreenStatus) {
				player.exitFullScreen();
			}
		},
	},
	mounted() {
		const info = wx.getSystemInfoSync();
		this.availHeight = this.windowHeight = info.windowHeight;
		this.isOut = false;
		setTimeout(() => (this.showMsgTip = false), 1e4);
		this.init();
	},
	onUnload() {
		wx.hideLoading();
		this.exitFullScreen();
		if (this.chatWith) {
			store.commit(types.setChatMessages, {
				[this.chatWith]: [],
			});
			store.commit(types.setCurrent, '');
		}
		Object.assign(this.$data, createInitData());
		this.isOut = true;
		RoomInstance && (store.dispatch('DisconnectRoom'), (RoomInstance = null));
	},
	onShow() {
		this.courseId = this.$root.$mp.query.courseId;
		!this.auth && store.dispatch('GetAuthKey');
	},
};
</script>
<style scoped>
@import url('../../styles/live.css');
@import url('../../styles/chat.css');
view.inline-block {
	display: inline-block;
}

view.block {
	display: block;
}
.bgGradient {
	width: 100%;
	height: 145rpx;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 999;
	background: linear-gradient(
		to top,
		RGBA(255, 255, 255, 0) 0%,
		RGBA(255, 255, 255, 0.25) 40%,
		RGBA(255, 255, 255, 0.5) 60%,
		RGBA(255, 255, 255, 0.8) 100%
	);
}
</style>
