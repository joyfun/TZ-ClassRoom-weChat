<template>
    <view class="courseDown">
        <view class="courseDown-main">
            <view class="courseDown-img"><img src="/static/images/network.png" alt=""></view>
            <p>当前网络不给力，请检查网络设置</p>
            <a @click="page">刷新一下</a>
        </view>
    </view>
</template>
<script>
export default {
	methods: {
		page() {
			wx.navigateBack();
		},
	},
};
</script>
<style>
.courseDown {
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	background: #ffffff;
	z-index: 100;
	padding-top: 200rpx;
}
.courseDown .courseDown-img {
	width: 280rpx;
	height: 260rpx;
	margin: 0 auto;
}
.courseDown .courseDown-img img {
	display: block;
	width: 100%;
	height: 100%;
}
.courseDown p {
	text-align: center;
	color: #696969;
	font-size: 26rpx;
	padding: 24rpx 0;
}
.courseDown a {
	color: #fff;
	font-size: 32rpx;
	width: 300rpx;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	display: block;
	border-radius: 10rpx;
	background: -webkit-linear-gradient(left, #fb6424, #fa332b);
	margin: 0 auto;
}
</style>
