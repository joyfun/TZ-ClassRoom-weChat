<template>
	<cover-view class="live-pause" v-show="visible" @click="play">
		<cover-image src="/static/images/live.png" />
		<cover-view>您正在使用移动网络，建议使用WIFI</cover-view>
	</cover-view>
</template>
<script>
export default {
	props: ['visible'],
	methods: {
		play() {
			this.$emit('play');
		},
	},
};
</script>
<style scoped>
cover-view,
cover-image {
	visibility: visible;
}
.live-pause {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	text-align: center;
	padding-top: 18%;
	box-sizing: border-box;
	background: rgba(3, 12, 29, 0.4);
	z-index: 2;
}
.live-pause cover-image {
	width: 95rpx;
	height: 95rpx;
	margin: 0 auto;
}
.live-pause cover-view {
	font-size: 32rpx;
	color: #fff;
	margin-top: 50rpx;
}
</style>
