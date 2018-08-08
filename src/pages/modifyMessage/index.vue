<template>
	<div class="containers">
		<div class="avatar-box common-box" @click="changeAvatar">
			<span class="left">头像</span>
			<div class="right">
				<img class="pic" :src="tempFilePaths||userInfo.headIcon || '/static/images/avatar.png'">
				<i class="icon-arrow"></i>
			</div>
		</div>
		<div class="nick-box common-box" style="border:2rpx solid #F3F5F7" @click="goUrl">
			<span class="left">昵称</span>
			<div class="right">
				<span class="nick">{{modifyName||userInfo.userName}}</span>
				<i class="icon-arrow"></i>
			</div>
		</div>
		<div class="nick-box common-box">
			<span class="left">账号</span>
			<div class="right">
				<span class="nick">{{userInfo.account}}</span>
				<!-- <i class="icon-arrow"></i> -->
			</div>
		</div>
	</div>
</template>
<script>
import store from '@/store';
import navigateTo from '@/utils/navigator';
import api from '../../services/api.js';
import env from '../../utils/env.js';
import { postModifyMsg } from '@/services/user';
const { uploadAvtar } = api;
let base_url = env[EXEC_ENV || 'dev'].base;
export default {
	data() {
		return {
			nickName: '',
			tempFilePaths: '',
		};
	},
	methods: {
		formSubmit(e) {
			console.log(4678484);
			console.log(e.detail.value);
		},
		goUrl() {
			navigateTo('modifyNickName');
		},
		changeAvatar() {
			let that = this;
			wx.chooseImage({
				count: 1, // 默认9
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				success: function(res) {
					// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
					that.tempFilePaths = res.tempFilePaths;
					console.log(that.tempFilePaths);
					console.log(res);
					wx.uploadFile({
						url: `${base_url}${uploadAvtar}`, //仅为示例，非真实的接口地址
						filePath: that.tempFilePaths[0],
						name: 'file',
						header: {
							'Content-Type': 'multipart/form-data',
							token: store.getters.auth,
						},
						formData: {
							user: 'test',
						},
						success: function(res) {
							let data = JSON.parse(res.data);
							console.log(res.data);
							console.log(JSON.parse(res.data));
							//do something
							postModifyMsg({
								image: data.data,
								nick: '',
							})
								.then(res => {
									wx.showToast({
										title: res.msg || '操作成功',
										icon: 'none',
									});
								})
								.catch(res => {
									wx.showToast({
										title: res.msg || '操作失败',
										icon: 'none',
									});
								});
						},
					});
				},
				fail: function(res) {
					wx.showToast({
						title: res.msg,
						icon: 'none',
					});
				},
			});
		},
	},
	onShow() {
		wx.hideShareMenu({});
	},
	computed: {
		userInfo() {
			return store.getters.userInfo;
		},
		modifyName() {
			return store.getters.modifyName;
		},
		// account() {
		// 	return store.getters.phone;
		// },
	},
};
</script>
<style>
.containers {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: #f3f5f7;
}
.common-box {
	display: flex;
	width: 100%;
	background-color: #fff;
	justify-content: space-between;
	align-items: center;
}
.avatar-box {
	margin: 30rpx 0;
	height: 144rpx;
	line-height: 144rpx;
}
.nick-box {
	height: 89rpx;
	line-height: 89rpx;
}
.left {
	margin-left: 30rpx;
	font-size: 34rpx;
	/* font-weight: bold; */
	font-family: PingFangSC-Regular;
	color: rgba(48, 57, 67, 1);
}
.right {
	display: flex;
	margin-right: 30rpx;
	align-items: center;
}
.pic {
	margin-right: 15rpx;
	width: 86rpx;
	height: 86rpx;
	border-radius: 50%;
	overflow: hidden;
}
.icon-arrow {
	display: inline-block;
	width: 16rpx;
	height: 27rpx;
	background: url('../../../static/images/right.png') no-repeat center;
	background-size: 16rpx 27rpx;
}
.nick {
	margin-right: 15rpx;
	/* width: 150rpx; */
	height: 89rpx;
	font-size: 28rpx;
	font-family: SFProText-Regular;
	color: rgba(161, 161, 163, 1);
	text-align: right;
}
</style>
