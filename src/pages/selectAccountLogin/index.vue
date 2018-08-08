<template>
	<view class="container_wrapper">
		<view class="text_tip">该手机绑定了{{accountList.length}}个账号，请选择一个账号进行登录</view>
		<view class="account_item" :class="{account_item_active:accountid==item.account}" v-for="(item,index) in accountList" :key="index" @click="select_account($event,item.account)" :data-account='item.account'>
			<view class="account_name">账号：{{item.account}}</view>
			<view class="nick_name">昵称：{{item.nickname}}</view>
		</view>
		<view class="login_btn" @click="login">登录</view>
	</view>
</template>
<script>
import { postLoginByAccount } from '@/services/user';
import store from '../../store';
// import types from '../../store/types';
export default {
	data() {
		return {
			accountList: [],
			accountid: -1,
			selectTag: false,
		};
	},
	created() {},
	methods: {
		select_account(e, account) {
			this.accountid = account;
			this.selectTag = true;
		},
		login() {
			if (this.selectTag) {
				wx.showToast({
					title: '正在登录',
					icon: 'none',
				});
				postLoginByAccount({
					// phone: store.getters.phone,
					phone: this.accountList[0].phone,
					code: store.getters.verifyCode,
					account: this.accountid,
				})
					.then(res => {
						// let { token, imAccount = '', appKey, imToken, userName, headIcon } = res.data || {};
						// store.commit(types.login, { token });
						// store.commit(types.setExpire);
						// store.commit(types.setConfig, { appKey, account: imAccount.toLowerCase(), token: imToken });
						// store.commit(types.setUserInfo, { userName, headIcon });
						// store.dispatch('DisconnectIm');
						store.dispatch('SetLoginData', res.data);
						console.log(store.getters.userInfo);
						if (store.getters.phoneLoginTag == 1) {
							wx.navigateBack({
								delta: 2,
							});
						} else {
							wx.navigateBack({
								delta: 1,
							});
						}
					})
					.catch(res => {
						wx.showToast({
							title: res.msg || '登陆失败',
							icon: 'none',
						});
					});
			}
		},
	},
	mounted() {
		this.accountList = store.getters.userAccount;
		console.log(store.getters.phone);
	},
};
</script>
<style>
view {
	box-sizing: border-box;
	font-family: SFProText-Regular;
}
.container_wrapper {
	padding: 38rpx 30rpx 0 30rpx;
	width: 100%;
	height: 1205rpx;
	background-color: #f3f5f7;
}
.text_tip {
	margin-bottom: 29rpx;
	width: 100%;
	font-size: 24rpx;
	color: rgba(167, 167, 169, 1);
	text-align: center;
}
.account_item {
	display: flex;
	margin-bottom: 21rpx;
	width: 100%;
	height: 110rpx;
	background: rgba(255, 255, 255, 1);
	border-radius: 10rpx;
	border: 1rpx solid #e5e5e5;
	font-size: 28rpx;
	font-family: PingFangSC-Regular;
	color: rgba(48, 57, 67, 1);
	justify-content: space-between;
}
.account_item_active {
	color: #3073f4;
}
.account_name {
	margin-left: 19rpx;
	height: 110rpx;
	line-height: 100rpx;
}
.nick_name {
	width: 286rpx;
	height: 110rpx;
	line-height: 100rpx;
	text-align: left;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	-webkit-line-clamp: 1;
}
.login_btn {
	margin-top: 30rpx;
	width: 100%;
	height: 100rpx;
	line-height: 100rpx;
	background-color: #3073f4;
	border-radius: 10rpx;
	text-align: center;
	font-size: 38rpx;
	color: rgba(255, 255, 255, 1);
}
</style>
