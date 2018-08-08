<template>
	<view class="courseDown">
		<view class="courseDown-main">
			<view class="courseDown-img">
				<img src="/static/images/doawn.png" alt="">
			</view>
			<p>课程已下架</p>
			<a @click="toIndex">去逛逛</a>
		</view>
	</view>
</template>
<script>
import navigateTo from '@/utils/navigator';
export default {
	methods: {
		toIndex() {
			navigateTo('index', {}, 2);
		},
	},
	mounted() {
		let title = this.$root.$mp.query.title;
		title && wx.setNavigationBarTitle({ title });
	},
};
</script>
<style scoped>
.courseDown {
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	text-align: center;
	background: #ffffff;
	z-index: 100;
	padding-top: 250rpx;
}
/* .courseDown .courseDown-img {
	width: 150rpx;
	height: 150rpx;
	margin: 0 auto;
} */
.courseDown img {
	width: 150rpx;
	height: 150rpx;
}
.courseDown p {
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
	display: block;
	border-radius: 10rpx;
	background: #436bfd;
	margin: 0 auto;
}
</style>
