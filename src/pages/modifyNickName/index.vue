<template>
	<view class="contain-box">
		<form formType="reset">
			<view class="input-box">
				<input type="text" focus='true' maxlength='15' :placeholder="flag?setModifyName||userInfo.userName:''" @input='nameValue' class="name">
				<button form-type="reset" class="close-icon" @click="clear" v-if="name"></button>
			</view>

		</form>
		<view class="tip">好的名字可以让你的朋友更容易记住你</view>
		<view class="btn" @click="saveChange">保存</view>
	</view>
</template>
<script>
import store from '@/store';
// import navigateTo from '@/utils/navigator';
import { postModifyMsg } from '@/services/user';
import types from '../../store/types';
export default {
	data() {
		return {
			name: '',
			flag: true,
		};
	},
	methods: {
		saveChange() {
			if (this.name.length > 0) {
				if (this.name.length >= 2 && /^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(this.name)) {
					postModifyMsg({
						nick: this.name,
						image: '',
					})
						.then(res => {
							wx.showToast({
								title: res.msg || '操作成功',
								icon: 'none',
							});
							store.commit(types.setModifyName, this.name);
							setTimeout(() => {
								wx.navigateBack({
									delta: 1,
								});
							}, 1000);
						})
						.catch(res => {
							wx.showToast({
								title: res.msg || '操作失败',
								icon: 'none',
							});
						});
				} else {
					wx.showToast({
						title: '仅支持2-15位汉字/字母/数字',
						icon: 'none',
					});
				}
			} else {
				wx.showToast({
					title: '操作成功',
					icon: 'none',
				});
				setTimeout(() => {
					wx.navigateBack({
						delta: 1,
					});
				}, 1000);
			}
		},
		nameValue(e) {
			this.name = e.mp.detail.value;
		},
		clear() {
			this.flag = false;
			this.name = '';
		},
	},
	onShow() {
		wx.hideShareMenu({});
		this.name = '';
	},
	computed: {
		userInfo() {
			return store.getters.userInfo;
		},
		setModifyName() {
			return store.getters.modifyName;
		},
	},
};
</script>
<style>
.contain-box {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: #f3f5f7;
}
.input-box {
	position: relative;
	width: 100%;
	height: 100rpx;
}
.name {
	margin-top: 30rpx;
	padding-left: 30rpx;
	width: 100%;
	height: 100rpx;
	background-color: #fff;
}
.close-icon {
	position: absolute;
	z-index: 2;
	right: 30rpx;
	top: 50%;
	margin-top: -16rpx;
	width: 32rpx;
	height: 32rpx;
	border-radius: 50%;
	background: url('../../../static/images/icon_x@2x.png') no-repeat center;
	background-size: 32rpx 32rpx;
}
.close-icon::after {
	border: none;
}
.tip {
	padding: 18rpx 0 49rpx 30rpx;
	font-size: 28rpx;
	font-family: PingFangSC-Light;
	color: rgba(161, 161, 163, 1);
}
.btn {
	margin: 0 auto;
	width: 680rpx;
	height: 88rpx;
	line-height: 88rpx;
	background-color: #4786ff;
	font-size: 34rpx;
	font-family: PingFangSC-Regular;
	color: rgba(255, 255, 255, 1);
	text-align: center;
	border-radius: 10rpx;
}
</style>
