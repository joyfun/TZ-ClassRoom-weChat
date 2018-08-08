<template>
	<view class="chat-main">
		<scroll-view id="msgContainer" :scrollY="true" class="chat-list" :scrollIntoView="lastId" @scroll="onScroll">
			<div v-for="msg in chatList" :key="msg.msgId || msg.time">
				<div class="chat-message time" v-if="msg.showTime">
					<span>{{msg.showTime}}</span>
				</div>
				<div class="chat-message" :class="{me: msg.flow === 'out'}" :id="'msg_'+msg.msgId">
					<img :src="(msg.flow === 'out' ? msg.fromAvatar : teacher.avatar) || '/static/images/avatar.png'" class="msg-avatar">
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
		<div class="live-box">
			<form>
				<input type="text" placeholder="说点什么呐" maxlength="300" @input="changeInput" :cursor-spacing="6">
				<button :plain="true" form-type="reset" class="send active" @click="sendText">发送</button>
			</form>
		</div>
	</view>
</template>
<script>
import { transWxToPromise, debounce } from '@/utils';
import store from '@/store';
import types from '@/store/types';
export default {
	data() {
		return {
			chatId: '',
			input: '',
			lastId: '',
			msgLimit: 50,
			containerHeight: 0,
			needScrollToBottom: true,
			maxChatWidth: 520 / store.getters.ratio,
			sendText: debounce(async msg => {
				let resend = msg.status === 'fail';
				let text = this.input;
				if (!(resend || text)) {
					wx.showToast({
						title: '不能发送空消息',
						icon: 'none',
					});
					return;
				}
				let options = msg;
				if (!resend)
					options = {
						to: this.chatId,
						text: this.input,
						custom: JSON.stringify({ icon: this.userInfo ? this.userInfo.headIcon : '' }),
					};
				await store.dispatch('SendText', options).finally(res => !resend && (this.input = ''));
			}, 2000),
		};
	},
	computed: {
		chatList() {
			return (store.getters.chatMessages[this.chatId] || []).slice(-this.msgLimit);
		},
		userInfo() {
			return store.getters.userInfo;
		},
		teacher() {
			return store.getters.users[this.chatId] || {};
		},
	},
	watch: {
		chatList(list) {
			if (list.length && this.needScrollToBottom) {
				this.$nextTick(() => {
					this.lastId = 'msg_' + list[list.length - 1].msgId;
					setTimeout(() => {
						this.lastId = 'msg_notexist';
					}, 1000);
				});
			}
		},
	},
	methods: {
		getContainerHeight() {
			wx
				.createSelectorQuery()
				.select('#msgContainer')
				.boundingClientRect(rect => {
					this.containerHeight = rect.height;
				})
				.exec();
		},
		onScroll(e) {
			let { detail: { scrollHeight, scrollTop } } = e.mp;
			this.needScrollToBottom = (scrollTop + this.containerHeight) / scrollHeight > 0.9;
		},
		changeInput(e) {
			let { detail } = e.mp || {};
			this.input = (detail.value || '').trim();
		},
	},
	mounted() {
		this.chatId = this.$root.$mp.query.id;
		//聊天页面不允许分享
		wx.hideShareMenu();
		let teacher = this.teacher;
		teacher.nick &&
			transWxToPromise('setNavigationBarTitle', {
				title: teacher.nick,
			});
		// if (!teacher.history) {
		wx.showLoading({
			title: '加载中',
			mask: true,
		});
		store.dispatch('GetHistory', { account: this.chatId }).finally(res => wx.hideLoading());
		// }
		this.getContainerHeight();
	},
	onUnload() {
		store.commit(types.setCurrent, '');
		store.commit(types.setChatMessages, {
			[this.chatId]: [],
		});
		this.chatId = '';
	},
};
</script>
<style>
@import url('../../styles/chat.css');
.chat-main {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
	flex-direction: column;
}
.chat-list {
	flex: 1;
	overflow: auto;
	padding: 50rpx 30rpx 0;
	border-top: 1px solid #eaebec;
	background: #f3f5f7;
	box-sizing: border-box;
}
.chat-list .time span {
	display: inline-block;
	padding: 0 12rpx;
	height: 40rpx;
	line-height: 40rpx;
	background: #d8d8d8;
	font-size: 24rpx;
	color: #ffffff;
	border-radius: 4rpx;
}
.chat-message {
	margin-bottom: 40rpx;
}
.chat-message .msg-avatar {
	width: 70rpx;
	height: 70rpx;
}
.chat-content {
	background: #fff;
}
.chat-content:before {
	border-top-color: #fff;
}
.chat-content:after {
	background: #f3f5f7;
}
</style>

