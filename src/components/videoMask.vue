<template>
	<block>
		<button class="pause" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" v-if="showButton">
			<view class="tip">点击登录观看课程</view>
			<img src="/static/images/live.png" class="btn" />
		</button>
		<view class="covervideo" v-else-if="videoError">
			<view class="videoError">{{videoError}}</view>
		</view>
	</block>
</template>

<script>
import store from '@/store';
import navigateTo from '@/utils/navigator';
export default {
	props: ['showButton', 'videoError'],
	methods: {
		async getPhoneNumber(e) {
			let payload = e.mp.detail;
			let { encryptedData, iv } = payload;
			wx.showLoading({ title: '登录中', mask: true });
			try {
				let res = await store.dispatch('WxLogin', { encryptedData, iv }).finally(res => wx.hideLoading());
				let { status } = res;
				if (status == 1010) navigateTo('selectAccountLogin');
				else this.$emit('success');
			} catch (res) {
				res &&
					!res.noTip &&
					wx.showToast({
						title: res.status == 6105 ? res.msg : '登录失败',
						icon: 'none',
					});
				console.log('登录失败', res);
			}
		},
	},
};
</script>

<style>
.pause {
	/* position: relative; */
	width: 100%;
	/* height: 420rpx; */
	height: 100%;
	background: rgba(21, 23, 25, 0.8);
	border: none;
	border-radius: 0;
}
.covervideo {
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	/* height: 420rpx; */
	line-height: normal;
	background: #030c1d;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9999999;
	flex-direction: column;
}

.videoError {
	color: #fff;
	font-size: 28rpx;
	padding: 23rpx 32rpx;
	border-radius: 38rpx;
	border: 1px solid #fff;
	height: 29rpx;
	line-height: 29rpx;
}
</style>
