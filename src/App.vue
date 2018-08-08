<script>
import store from '@/store';
import { transWxToPromise } from './utils';
import { getCheckToken } from '@/services/course';
import types from '@/store/types';
export default {
	mounted() {
		console.log('启动');
		let token = store.getters.auth;
		if (token) {
			getCheckToken()
				.then(res => {
					store.commit(types.setExpire);
				})
				.catch(res => {
					store.commit(types.login, { data: {token: '', authToken: ''} });
					throw res;
				});
		}
		transWxToPromise('setKeepScreenOn', {
			keepScreenOn: true,
		});
		store.dispatch('GetNetworkType');
		store.dispatch('WatchNetworkChange');

		// 调用API从本地缓存中获取数据
		const logs = wx.getStorageSync('logs') || [];
		logs.unshift(Date.now());
		wx.setStorageSync('logs', logs);

		console.log('app created and cache logs by setStorageSync');
		//版本更新
		const updateManager = wx.getUpdateManager();
		updateManager.onCheckForUpdate(function(res) {
			// 请求完新版本信息的回调
			console.log(res.hasUpdate);
		});
		updateManager.onUpdateReady(function() {
			wx.showModal({
				title: '更新提示',
				content: '新版本已经准备好，是否重启应用？',
				success: function(res) {
					if (res.confirm) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate();
					}
				},
			});
		});

		updateManager.onUpdateFailed(function() {
			// 新的版本下载失败
			wx.showToast({
				title: '新的版本下载失败',
				icon: 'none',
				duration: 2000,
			});
		});
	},
	onError(a) {
		console.log('错误', a);
	},
};
</script>

<style>
page {
	height: 100%;
}
page > view {
	overflow-x: hidden;
	/* position: relative;
  top: 150rpx; */
}
.contain {
	position: relative;
}
.container {
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	padding: 200rpx 0;
	box-sizing: border-box;
}
/* this rule will be remove */
* {
	transition: width 2s;
	-moz-transition: width 2s;
	-webkit-transition: width 2s;
	-o-transition: width 2s;
}

/* 模态 */

page > view.hiddenScroll {
	overflow-y: hidden;
	position: fixed;
	top: 0;
	background: 0;
}

@keyframes slideUp {
	from {
		transform: translate3d(0, 100%, 0);
	}

	to {
		transform: translate3d(0, 0, 0);
	}
}

.weui-animate-slide-up {
	animation: slideUp ease 0.3s forwards;
}

@keyframes slideDown {
	from {
		transform: translate3d(0, 0, 0);
	}

	to {
		transform: translate3d(0, 100%, 0);
	}
}

.weui-animate-slide-down {
	animation: slideDown ease 0.3s forwards;
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

.weui-animate-fade-in {
	animation: fadeIn ease 0.3s forwards;
}

@keyframes fadeOut {
	from {
		opacity: 1;
	}
	to {
		opacity: 0;
	}
}

.weui-animate-fade-out {
	animation: fadeOut ease 0.3s forwards;
}
.weui-mask {
	position: fixed;
	z-index: 9999999;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.6);
}

.weui-animate-fade-in {
	-webkit-animation: fadeIn ease 0.3s forwards;
	animation: fadeIn ease 0.3s forwards;
}

.flex-wrp {
	-webkit-backface-visibility: hidden;
	backface-visibility: hidden;
	-webkit-transform: translate(0, 0);
	transform: translate(0, 0);
	-webkit-transition: -webkit-transform 0.3s;
	transition: -webkit-transform 0.3s;
	transition: transform 0.3s;
	transition: transform 0.3s, -webkit-transform 0.3s;
	display: flex;
	flex-direction: row;
	background-color: #fff;
	flex-wrap: wrap;
	padding: 25rpx 30rpx;
	max-height: 758rpx;
	overflow-y: scroll;
	width: 100%;
}

.wrpFixed {
	position: fixed;
	left: 0;
	top: 0;
	z-index: 99999999;
}

.flex-wrp.center {
	width: 499rpx;
	/* height: 360rpx; */
	top: 430rpx;
	left: 50%;
	/* margin-top: -180rpx; */
	margin-left: -250rpx;
	overflow: hidden;
	flex-direction: column;
	padding: 0;
	border-radius: 10rpx;
}

.flex-wrp.center .modalTitle {
	height: 40rpx;
	/* width: 469rpx; */
	padding-left: 31rpx;
	padding-top: 24rpx;
	padding-bottom: 25rpx;
	line-height: 40rpx;
	color: #ffffff;
	font-size: 34rpx;
	background-color: #3073f4;
	display: flex;
}

.flex-wrp.center .modalTitle ._cover-image {
	height: 40rpx;
	width: 49rpx;
	margin-right: 23rpx;
}

.flex-wrp.center .modalContent {
	font-size: 28rpx;
	color: #1f2328;
	line-height: 38rpx;
	/* height: 72rpx; */
	padding: 54rpx 65rpx;
	text-align: center;
	white-space: normal;
}

.flex-wrp.center .modalButtonbox {
	/* border-top: 1rpx solid #eeeeee; */
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-content: center;
	padding-left: 50rpx;
	padding-right: 50rpx;
}

.flex-wrp.center .modalButtonbox cover-view {
	flex: 1;
	font-size: 28rpx;
	line-height: 30rpx;
	height: 26rpx;
	text-align: center;
	padding-top: 32rpx;
	padding-bottom: 32rpx;
}

.flex-wrp.center .modalButtonbox cover-view:nth-child(1) {
	color: #a1a1a3;
	/* border-right: 1px solid #eeeeee; */
	padding-right: 49rpx;
	position: relative;
}

.flex-wrp.center .modalButtonbox cover-view:nth-child(1)::after {
	content: '';
	width: 1.2px;
	height: 32rpx;
	background: #eeeeee;
	position: absolute;
	right: 0;
	top: 32rpx;
}

.flex-wrp.center .modalButtonbox cover-view:nth-child(2) {
	color: #3073f4;
	margin-left: 49rpx;
}
.unread {
	font-size: 28rpx;
	color: #fff;
	line-height: 24rpx;
	padding: 5rpx 10rpx;
	margin-top: 10rpx;
	background: #f22e29;
	border-radius: 15rpx;
}
.unread .super {
	font-size: 20rpx;
	vertical-align: super;
	line-height: 10rpx;
}

.empty {
	width: 100%;
	height: 100%;
	text-align: center;
	padding-top: 90rpx;
	background: #fff;
	box-sizing: border-box;
}
.empty img {
	width: 288rpx;
	height: 259rpx;
	margin-bottom: 52rpx;
}
.empty p {
	font-size: 24rpx;
	color: #a1a1a1;
}

.navBar {
	position: fixed;
	top: 60rpx;
	width: 100%;
	background: #fff;
	height: 80rpx;
	padding-left: 50rpx;
	line-height: 80rpx;
}

.pause {
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	font-size: 28rpx;
	text-align: center;
	line-height: normal;
	flex-direction: column;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 2;
	background: rgba(21, 23, 25, 0.8);
}
.pause .tip {
	color: #fff;
	margin-bottom: 38rpx;
}
.pause .btn {
	width: 100rpx;
	height: 100rpx;
}
</style>
