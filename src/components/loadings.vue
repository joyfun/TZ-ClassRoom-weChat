<template>
	<div style="text-align: center;margin-left:-30rpx;">
		<div class="mop-load-div">
			<div class="pulse"><img class="change" src="/static/images/live-loading.gif" alt=""></div>
			<div class="mop-load-text">正在加载</div>
		</div>
	</div>
</template>

<script>
export default {};
</script>

<style>
/*loading效果*/
.mop-load-div {
	box-pack: center;
	box-align: center;
	height: 60rpx;
	width: 100%;
	display: -moz-box;
	-moz-box-pack: center;
	-moz-box-align: center;
	display: -webkit-box;
	-webkit-box-pack: center;
	-webkit-box-align: center;
	-o-box-pack: center;
	-o-box-align: center;
	/* margin-top: 25rpx; */
	/* margin-left: -30rpx; */
}

.mop-load-text {
	color: #aaaaaa;
	font-size: 24rpx;
	height: 50rpx;
	line-height: 50rpx;
}

.pulse .change {
	width: 50rpx;
	height: 50rpx;
	margin-right: 10px;
	-webkit-animation: change 0.7s linear infinite;
}

@-webkit-keyframes change {
	0% {
		-webkit-transform: rotate(0deg);
	}
	50% {
		-webkit-transform: rotate(-180deg);
	}
	100% {
		-webkit-transform: rotate(-360deg);
	}
}
</style>
