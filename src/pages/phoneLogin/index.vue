<template>
	<view class="container_wrapper">
		<form formType="reset">
			<view class="phoneNumber_wrapper">
				<view class='area_num' @click="areaIsShow=true">+{{initSateCode}}</view>
				<input type="number" class="phoneNumber" placeholder-style="color:#D3D3D3;font-size:34rpx;" placeholder="请输入手机号" @input="phoneNumber">
				<!-- <i class="clear_btn" @click="clearPhoneNun"></i> -->
				<button form-type="reset" class="clear_btn" v-show="phoneNumb" @click="clearPhoneNun"></button>
			</view>
		</form>
		<form formType="reset">
			<view class="verify_wrapper">
				<!-- <view class='verify_text'>短信码验证</view> -->
				<input type="number" placeholder="短信码验证" class="verify_num" maxlength="4" @input="verify_num">
				<!-- <i class="clear_btn" @click='clearVerifyNun' v-show="messageNum"></i> -->
				<button form-type="reset" class="clear_btn" v-show="messageNum" @click='clearVerifyNun'></button>
				<view class='verify_message' @click="getVerifyNum" v-show="verifyBtnIsShow">获取验证码</view>
				<view class='verify_message verify_message_actiive' v-show="!verifyBtnIsShow">重新获取{{countDown}}s</view>
			</view>
		</form>
		<view class="login_btn" @click="login" :class="{ login_btn_active: phoneNumb && messageNum }">登录</view>
		<view class="area_mask" v-show="areaIsShow" @click="areaIsShow=false">
			<scroll-view class="area_select_box" :scroll-y="true">
				<view class="area_select_title">选择国家/区号</view>
				<block v-for="(item,index) in StateCodeList" :key='index'>
					<view class="area_select_item" :class="{area_select_item_active:areaindex == index}" @click="selectArea($event,item.code,index)" :data-areaindex='index'>{{item.name}}（{{item.code}}）</view>
				</block>
			</scroll-view>
		</view>
	</view>

</template>
<script>
import { postVerifyCode, getStateCode, postLoginByPhone, postVerifyMessageCode } from '@/services/user';
import navigateTo from '@/utils/navigator';
import store from '../../store';
import types from '../../store/types';
export default {
	data() {
		return {
			phoneNumb: '', //手机号码
			phoneNumb1: '', //手机号码
			messageNum: '', //短信验证码
			messageNum1: '', //短信验证码
			verifyBtnIsShow: true, //获取验证码按钮样式控制
			countDown: 60, //倒计时秒数
			loginBtnActive: false, //登录样式控制
			areaIsShow: false, //国家区号弹框控制
			StateCodeList: [],
			areaindex: -1,
			initSateCode: 86,
			verifyCodeTag: true, //发送验证码控制器
			timer1: '', //清楚定时任务
		};
	},
	onUnload() {
		console.log('onUnload');
		console.log(this.timer1);
		if (this.timer1) {
			clearInterval(this.timer1);
		}
		this.phoneNumb = '';
		this.messageNum = '';
		this.verifyBtnIsShow = true;
		this.verifyCodeTag = true;
		this.countDown = 60;
	},
	methods: {
		phoneNumber(e) {
			console.log(22222);
			this.phoneNumb = e.mp.detail.value;
		},
		verify_num(e) {
			this.messageNum = e.mp.detail.value;
		},
		// 选择国家
		selectArea(e, code, index) {
			let areaindex = e.mp.target.dataset.areaindex;
			if (index == areaindex) {
				this.areaindex = index;
			}
			this.initSateCode = code;
			this.areaIsShow = false;
		},
		clearPhoneNun() {
			this.phoneNumb = '';
		},
		clearVerifyNun() {
			this.messageNum = '';
		},
		// 登录
		async login() {
			var that = this;
			if (this.phoneNumb && this.messageNum) {
				if (
					// /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(this.phoneNumb.trim())
					/^\d+$/.test(this.phoneNumb.trim())
				) {
					wx.showToast({
						title: '正在登录',
						icon: 'none',
					});
					postVerifyMessageCode({
						phone: `${this.initSateCode}-${this.phoneNumb}`,
						code: this.messageNum,
						terminalType: 5,
					})
						.then(res => {
							postLoginByPhone({
								phone: `${this.phoneNumb}`,
								code: this.messageNum,
							})
								.then(res => {
									console.log(res.data);
									// 单个账号
									// let { token, imAccount = '', appKey, imToken, userName, headIcon } = res.data || {};
									// store.commit(types.login, { token });
									// store.commit(types.setExpire);
									// store.commit(types.setConfig, { appKey, account: imAccount.toLowerCase(), token: imToken });
									store.commit(types.setPhone, res.messageId);
									// store.dispatch('DisconnectIm');
									store.dispatch('SetLoginData', res.data);
									wx.switchTab({
										url: `/pages/my/main`,
									});
								})
								.catch(res => {
									// 多账号
									if (res.status == 1010) {
										// debugger;
										store.commit(types.setUserAccount, { userAccount: res.data.users });
										store.commit(types.setVerifyCode, that.messageNum);
										store.commit(types.setPhoneLoginTag, 1);
										store.commit(types.setPhone, res.data.phone);
										navigateTo('selectAccountLogin');
									} else {
										wx.showToast({
											title: res.msg || '登录失败',
											icon: 'none',
										});
									}
								});
						})
						.catch(res => {
							wx.showToast({
								title: '验证码错误',
								icon: 'none',
							});
						});
				} else {
					wx.showToast({
						title: '请填写正确手机号码',
						icon: 'none',
					});
				}
			}
		},
		// 获取手机验证码
		async getVerifyNum() {
			// console.log(/^\d{1,11}$/.test(this.phoneNumb.trim()));
			if (
				this.verifyCodeTag &&
				this.phoneNumb &&
				// /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(this.phoneNumb.trim())
				/^\d+$/.test(this.phoneNumb.trim())
			) {
				console.log('ssss');
				this.verifyBtnIsShow = false;
				wx.showToast({
					title: '正在发送中...',
					icon: 'none',
				});
				await postVerifyCode({
					phone: `${this.initSateCode}-${this.phoneNumb}`,
					smsType: 1
				}).catch(res => {
					wx.showToast({
						title: res.msg || '发送短信失败',
						icon: 'none',
					});
				});
				this.verifyCodeTag = false;
				this.timer1 = setInterval(() => {
					console.log('11111111');
					if (this.countDown > 0) {
						this.countDown--;
					} else if (this.countDown == 0) {
						this.verifyBtnIsShow = true;
						this.countDown = 60;
						clearInterval(this.timer1);
						this.verifyCodeTag = true;
					}
				}, 1000);
			} else if (this.phoneNumb.length == 0) {
				wx.showToast({
					title: '请填写手机号码',
					icon: 'none',
				});
			} else {
				wx.showToast({
					title: '请填写正确手机号码',
					icon: 'none',
				});
			}
		},
	},
	mounted() {
		console.log('mouted');
		// 获取各个国家区号
		getStateCode().then(res => {
			this.StateCodeList = res.data.zoneList;
		});
	},
};
</script>
<style>
view {
	box-sizing: border-box;
	font-family: SFProText-Regular;
}
.container_wrapper {
	padding: 0 30rpx;
}
.phoneNumber_wrapper,
.verify_wrapper {
	display: flex;
	position: relative;
	padding: 98rpx 0 47rpx 0;
	width: 100%;
	height: 178rpx;
	border-bottom: 1rpx solid #eaebec;
	justify-content: space-between;
	align-items: center;
}
.area_num {
	margin-right: 31rpx;
	flex: 0 0 61rpx;
	font-size: 34rpx;
	color: rgba(48, 115, 244, 1);
}
.phoneNumber {
	flex: 1;
}
.clear_btn {
	margin-right: 24rpx;
	flex: 0 0 32rpx;
	height: 32rpx;
	/* background-color: red; */
	border-radius: 50%;
	background: url('../../../static/images/icon_x@2x.png') no-repeat center;
	background-size: 32rpx 32rpx;
}
.clear_btn::after {
	border: none;
}
.verify_text {
	margin-right: 41rpx;
	flex: 0 0 170rpx;
	font-size: 34rpx;
	color: rgba(48, 57, 67, 1);
}
.verify_num {
	font-size: 34rpx;
	flex: 1;
}
.verify_message {
	flex: 0 0 210rpx;
	height: 78rpx;
	line-height: 78rpx;
	border-radius: 10rpx;
	border: 1rpx solid #22ac38;
	text-align: center;
	font-size: 28rpx;
	color: rgba(34, 172, 56, 1);
}
.login_btn {
	margin-top: 72rpx;
	width: 100%;
	height: 100rpx;
	line-height: 100rpx;
	background: #d9dbde;
	border-radius: 10rpx;
	text-align: center;
	font-size: 38rpx;
	color: rgba(255, 255, 255, 1);
}
.login_btn_active {
	background-color: #3073f4;
}
.verify_message_actiive {
	border: 1rpx solid #a1a1a3;
	color: #a1a1a3;
}
.area_mask {
	position: fixed;
	z-index: 3;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: rgba(14, 17, 21, 0.5);
}
.area_select_box {
	position: absolute;
	width: 620rpx;
	max-height: 1050rpx;
	background-color: #fff;
	transform: translate(-50%, -50%);
	top: 50%;
	left: 50%;
}
.area_select_title {
	padding: 39rpx 0 20rpx 57rpx;
	width: 100%;
	font-size: 34rpx;
	font-weight: bold;
	color: rgba(48, 57, 67, 1);
	text-align: left;
}
.area_select_item {
	padding-left: 57rpx;
	width: 100%;
	height: 87rpx;
	line-height: 87rpx;
	font-size: 28rpx;
	color: #a1a1a3;
	text-align: left;
}
.area_select_item_active {
	background: rgba(234, 235, 236, 1);
}
</style>
