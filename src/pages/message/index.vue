<template>
	<view>
		<div class="chat-conent" v-if="sessions.length > 0">
			<div class="list-main" v-for="session in sessions" :key="session.to" @click="toChat(session)" v-if="users[session.to]">
				<div class="pic lf">
					<img :src="users[session.to].avatar || '/static/images/avatar.png'" alt="">
				</div>
				<div class="title lf">
					<view class="name clear">
						<view class="lf teachter ell">{{users[session.to].nick}}</view>
						<span class="rf">{{session.last.time}}</span>
					</view>
					<view class="text clear">
						<view class="lf mes ell">{{session.last.text}}</view>
						<i class="unread rf" v-show="session.unread > 0">
							<span>{{session.unread > 99 ? 99 : session.unread}}</span>
							<span class="super" v-show="session.unread > 99">+</span>
						</i>
					</view>
				</div>
			</div>
		</div>
		<div class="empty" v-else-if="loadEnd">
			<img src="/static/images/icon-empty.png" alt="">
			<template v-if="!auth">
				<p>您还未登录，登录才能进行聊天哦~</p>
				<button :plain="true" class="loginButton" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">登录</button>
			</template>
			<p v-else>您还未跟老师进行聊天哦，去教室内联系老师吧</p>
		</div>
	</view>
</template>
<script>
import navigateTo from '@/utils/navigator';
import store from '@/store';
import types from '@/store/types';
export default {
	data() {
		return {
			loadEnd: false,
			unread: 0,
		};
	},
	computed: {
		auth() {
			return store.getters.auth;
		},
		sessions() {
			return store.getters.sessions || [];
		},
		users() {
			return store.getters.users;
		},
	},
	methods: {
		async getPhoneNumber(e) {
			wx.showLoading({
				title: '登录中',
				mask: true,
			});
			let payload = e.mp.detail;
			let { encryptedData, iv } = payload;
			let authKey = store.getters.authKey;
			if (encryptedData && iv) {
				let res = await store.dispatch('WxLogin', {
					encryptedData,
					iv,
					authKey,
				});
				let { status } = res;
				if (status == 1010) {
					navigateTo('selectAccountLogin');
					return;
				}
				this.initMessage();
			} else {
				wx.hideLoading();
				wx.showToast({
					title: '登录失败',
					icon: 'none',
				});
			}
		},
		async initMessage() {
			wx.showLoading({
				title: '正在连接',
				mask: true,
			});
			try {
				await store.dispatch('InitIm').finally(res => {
					wx.hideLoading();
					this.loadEnd = true;
				});
			} catch (res) {
				wx.showToast('连接失败');
				console.log('错误', res);
			}
		},
		toChat({ to, id }) {
			store.commit(types.setCurrent, to);
			store.dispatch('ResetUnread', id);
			navigateTo('chat', { id: to });
		},
	},
	mounted() {
		wx.hideShareMenu();
		if (!this.auth) {
			this.loadEnd = true;
			store.dispatch('GetAuthKey');
		} else {
			this.initMessage();
		}
	},
};
</script>
<style>
view {
	box-sizing: border-box;
}
.clear:before,
.clear:after {
	content: '';
	display: block;
	clear: both;
}
img {
	width: 100%;
	height: 100%;
}
.chat-conent {
	position: fixed;
	top: 0;
	bottom: 0;
	width: 100%;
	overflow: auto;
	font-size: 24rpx;
	border-top: 1rpx solid #eaebec;
}
.lf {
	float: left;
}
.rf {
	float: right;
}
.ell {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: block;
	width: 100%;
}
.list-main {
	height: 180rpx;
	border-bottom: 1rpx solid #eaebec;
	padding: 40rpx 30rpx;
}
.list-main .pic {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	overflow: hidden;
	margin-right: 44rpx;
}
.list-main .title {
	font-size: 34rpx;
	color: #303943;
	width: 540rpx;
	height: 100rpx;
}
.list-main .title .teachter {
	width: auto;
	max-width: 400rpx;
	/* font-weight: bold; */
}
.list-main .mes {
	width: 464rpx;
}
.list-main .name span {
	font-size: 24rpx;
	color: #a1a1a3;
}
.list-main .title .text {
	color: #a1a1a3;
	margin-top: 10rpx;
}

button.loginButton {
	/*  width: 500rpx;
  margin-top: 70rpx;
  color: #a1a1a1; */
	font-size: 28rpx;
	color: #3073f4;
	line-height: 60rpx;
	display: inline-block;
	margin-top: 43rpx;
	padding: 0 35rpx;
	border: 2rpx solid #3073f4;
}
.empty {
	border-top: 1px solid #e5e5e5;
}
</style>


