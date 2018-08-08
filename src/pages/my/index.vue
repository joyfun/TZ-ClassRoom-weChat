<template>
	<div>
		<div class="containers" v-if="auth">
			<div class="hederBox" @click="goUrl('modifyMessage')">
				<div class="img">
					<img class="img" :src="userInfo.headIcon || '/static/images/avatar.png'" alt="">
				</div>
				<span class="name">{{userInfo.userName}}</span>
				<div class="right-arrow">

				</div>
			</div>
			<div class="linkBox">
				<div class="my" @click="goUrl('myCourse')">
					<span><img src="/static/images/my-course.png" alt=""></span> 我报名的课程
					<i><img src="/static/images/right.png" alt=""></i>
				</div>
				<div class="my" @click="goUrl('message')">
					<span><img src="/static/images/my-msg.png" alt=""></span> 消息列表
					<i><img src="/static/images/right.png" alt=""></i>
					<i class="unread" v-show="unread > 0">
						<span>{{unread > 99 ? 99 : unread}}</span>
						<span class="super" v-show="unread > 99">+</span>
					</i>
				</div>
			</div>
			<div class="accountBox linkBox">
				<div class="my" @click="readyToChange">
					<span><img src="/static/images/icon_qh@2x.png" alt=""></span> 切换账号
					<i><img src="/static/images/right.png" alt=""></i>
				</div>
			</div>
			<p class="version">v {{version}}</p>
		</div>
		<div class="fixed login-container" v-else>
			<img src="/static/images/icon-nologin.png" alt="">
			<p>你还未登录，登录后可享受更优质的服务质量~</p>
			<button :plain="true" class="login-btn origin" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信快捷登录</button>
			<button :plain="true" class="login-btn" @click="goUrl('phoneLogin')">手机验证登录</button>
		</div>
		<div class="fixed login-pop" v-show="showLoginPop">
			<div class="bg"></div>
			<div class="content">
				<div class="buttons">
					<button :plain="true" class="login-btn origin" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信快捷登录</button>
					<button :plain="true" class="login-btn" @click="goUrl('phoneLogin')">手机验证登录</button>
				</div>
				<icon type="cancel" color="#fff" :size="iconSize" @click="showLoginPop=false"></icon>
			</div>
		</div>
	</div>
</template>

<script>
import navigateTo from '@/utils/navigator';
import store from '@/store';
import { version } from '../../../package.json';
export default {
	data() {
		return {
			showButton: false,
			version,
			showLoginPop: false,
			iconSize: 82 * (wx.getSystemInfoSync().screenWidth / 750),
		};
	},
	computed: {
		auth() {
			this.showLoginPop = false;
			return store.getters.auth;
		},
		userInfo() {
			return store.getters.userInfo;
		},
		unread() {
			return store.getters.unread;
		},
	},
	methods: {
		goUrl(url, isRedirect) {
			navigateTo(url, {}, isRedirect);
		},
		async getPhoneNumber(e) {
			let payload = e.mp.detail;
			console.log(e.mp);
			let { encryptedData, iv } = payload;
			wx.showLoading({ title: '登录中', mask: true });
			try {
				let res = await store.dispatch('WxLogin', { encryptedData, iv }).finally(res => wx.hideLoading());
				let { status } = res;
				if (status == 1010) navigateTo('selectAccountLogin');
			} catch (res) {
				res &&
					!res.noTip &&
					wx.showToast({
						title: res.status == 6105 ? res.msg : '登录失败',
						icon: 'none',
					});
				console.log('登录失败，请重试', res);
			}
		},
		readyToChange() {
			wx.showLoading({
				title: '加载中',
			});
			store.dispatch('GetAuthKey').finally(res => {
				wx.hideLoading();
				this.showLoginPop = true;
			});
		},
	},
	onHide() {
		this.showLoginPop = false;
	},
	onShow() {
		wx.showLoading({ title: '加载中' });
		// 次页面禁止分享
		wx.hideShareMenu({});
		let pro = this.auth ? store.dispatch('GetMine') : store.dispatch('GetAuthKey');
		pro.finally(res => wx.hideLoading());
	},
};
</script>

<style scoped>
/* ssss */
.containers {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: #f3f5f7;
}
/* 头像部分 */
.hederBox {
	padding-top: 70rpx;
	padding-left: 30rpx;
	padding-right: 30rpx;
	width: 100%;
	height: 234rpx;
	background: #fff;
	box-sizing: border-box;
}
.hederBox .img {
	margin-right: 33rpx;
}
.hederBox > div {
	display: inline-block;
	vertical-align: top;
}
.hederBox .img {
	width: 146rpx;
	height: 146rpx;
	border-radius: 50%;
	overflow: hidden;
}
.hederBox .name {
	font-size: 42rpx;
	color: #303943;
	max-width: 492rpx;
	line-height: 146rpx;
	display: inline-block;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}
.right-arrow {
	float: right;
	margin-top: 64rpx;
	width: 15rpx;
	height: 30rpx;
	background: url('../../../static/images/right.png') no-repeat center;
	background-size: 15rpx 30rpx;
}
/* 菜单部分 */
.linkBox {
	margin-top: 31rpx;
	width: 750rpx;
	padding: 0 30rpx;
	box-sizing: border-box;
	background-color: #fff;
}
.accountBox {
	margin-top: 30rpx;
}
button.linkBox {
	display: block;
	margin-left: auto;
	margin-right: auto;
	padding-left: auto;
	padding-right: auto;
	box-sizing: border-box;
	font-size: 18px;
	text-align: left;
	text-decoration: none;
	line-height: 2.55555556;
	border-radius: 0;
	-webkit-tap-highlight-color: transparent;
	overflow: hidden;
	color: #303943;
	background-color: #ffffff;
	border: none;
}
.linkBox > .my {
	position: relative;
}
.linkBox > div,
.linkBox > button {
	font-size: 34rpx;
	color: #303943;
	line-height: 120rpx;
	/* border-bottom: 1px solid #e5e5e5; */
	overflow: hidden;
}

.linkBox > div:last-child,
.linkBox > button:last-child {
	border-bottom: none;
}

.linkBox span {
	max-width: 674rpx;
	float: left;
}
.linkBox span > img {
	width: 40rpx;
	height: 40rpx;
	margin-right: 26rpx;
	vertical-align: middle;
}
.linkBox:nth-child(2) span > img {
	height: 37rpx;
}
.linkBox:nth-child(3) span > img {
	height: 43rpx;
}
.linkBox i {
	float: right;
}
.linkBox i > img {
	width: 16rpx;
	height: 27rpx;
}
.linkBox .unread {
	position: absolute;
	right: 27rpx;
	top: 50%;
	float: none;
	margin-top: -15rpx;
}
.version {
	width: 100%;
	position: fixed;
	bottom: 15rpx;
	font-size: 24rpx;
	color: #a1a1a3;
	text-align: center;
}
.fixed {
	position: fixed;
	top: 0;
	bottom: 0;
	width: 100%;
}
/* 登录页面部分 */
.login-container {
	text-align: center;
	padding-top: 30rpx;
	background: #f3f5f7;
	border-top: 1px solid #e5e5e5;
}
.login-container img {
	width: 191rpx;
	height: 191rpx;
}
.login-container p {
	font-size: 24rpx;
	color: #d8d8d8;
	margin-top: 27rpx;
}
/* 登录按钮 */
button.login-btn[plain] {
	font-size: 28rpx;
	width: 400rpx;
	color: #4786ff;
	text-align: center;
	line-height: 68rpx;
	margin-top: 30rpx;
	background: #fff;
	border: 1px solid #4786ff;
	border-radius: 10rpx;
}
button.login-btn.origin {
	color: #fff;
	background: #4786ff;
}
.login-pop button.login-btn[plain] {
	font-size: 34rpx;
}
.login-pop .bg {
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
}
.login-pop .content {
	position: absolute;
	top: 50%;
	left: 50%;
	text-align: center;
	transform: translate(-50%, -50%);
}
.login-pop .buttons {
	padding: 55rpx 80rpx 95rpx;
	background: #fff;
}
.login-pop button.login-btn {
	width: 440rpx;
	line-height: 76rpx;
	margin-top: 40rpx;
}
.login-pop icon {
	/* width: 82rpx;
	height: 82rpx; */
	margin-top: 50rpx;
}
</style>
