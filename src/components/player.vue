<template>
	<div class="player-container">
		<img class="block" :src="postImg" v-if="postImg">
		<VideoMask :showButton="!auth" @success="loginSuccess"></VideoMask>
		<template v-if="auth">
			<div class="pause" v-if="needReload" @click="reloadVideo">
				<div class="tip">您的网络不好，是否需要重新加载视频？</div>
				<img class="btn" src="/static/images/live.png" />
			</div>
			<div class="pause prompt" v-else-if="error">
				<div class="tip">{{error}}</div>
			</div>
			<live-player id="player" :autoplay="autoPlay" :src="playUrl" @statechange="stateChange" @fullscreenchange="fullScreenChange" v-else>
				<cover-image class="cover-inner" :src="postImg" v-if="postImg" v-show="!playStatus"></cover-image>
				<cover-view class="pause loading" v-show="playStatus && loading">视频加载中...</cover-view>
				<cover-view class="showFlower" v-if="showFlowerTip">鲜花冷却中</cover-view>
				<cover-view class="controls" @click.stop="toggleControl">
					<cover-view class="play-controls" :class="{'full-screen': fullScreenStatus, show: showControl}">
						<cover-view class="control-left control-left1" v-if="!fullScreenStatus">
							<cover-image class="watch" src="/static/images/icon_gk.png"></cover-image>
							<cover-view class="watchNum">{{total}}人观看</cover-view>
						</cover-view>
						<cover-view class="control-left" v-else>
							<template v-if="mute">
								<cover-image class="flower mute" src="/static/images/icon-flower-mute.png"></cover-image>
								<cover-image class="add" src="/static/images/icon-add-mute.png"></cover-image>
							</template>
							<template v-else>
								<cover-image class="flower" src="/static/images/icon-flower-white.png" @click.stop="sendFlower"></cover-image>
								<cover-image class="add" src="/static/images/icon-add-white.png" @click.stop="addOne"></cover-image>
							</template>
							<!-- <cover-view class="danmu" @click.stop="switchDanmu(!danmuSwitch)">
								<cover-image src="/static/images/icon-danmu-on.png" v-if="danmuSwitch"></cover-image>
								<cover-image src="/static/images/icon-danmu-off.png" v-else></cover-image>
							</cover-view> -->
						</cover-view>
						<cover-view class="full" @click.stop="toggleFullScreen">
							<cover-image src="/static/images/exit-fullscreen.png" v-if="fullScreenStatus"></cover-image>
							<cover-image src="/static/images/fullscreen.png" v-else></cover-image>
						</cover-view>
					</cover-view>
				</cover-view>
				<!-- 视频暂停时中间区域按钮 -->
				<cover-view class="pause" v-show="!playStatus" @click.stop="togglePlay">
					<cover-view class="tip">{{isFlow ? '当前未连接WIFI' : '点击继续观看课程'}}</cover-view>
					<cover-image class="btn" src="/static/images/live.png"></cover-image>
				</cover-view>
				<!-- 弹幕 -->
				<cover-view class="danmu-container" v-if="playStatus && danmuSwitch" @click.stop="toggleControl">
					<cover-view v-for="(item, index) in danmuList" class="danmu-animate" :key="item.id" :style="{bottom: (positions[index%lines])+'rpx', color: item.color}">
						<cover-image src="/static/images/icon-flower.png" class="flower" v-if="item.type == 3"></cover-image>
						<template v-else>
							<cover-view class="badge" v-if="item.role != 10">老师</cover-view>
							<cover-view class="text" v-for="(t, i) in item.text" :key="i">{{t}}</cover-view>
							<!-- <cover-view class="text">{{item.text}}</cover-view> -->
						</template>
					</cover-view>
				</cover-view>
			</live-player>
		</template>
	</div>
</template>
<script>
import VideoMask from './videoMask';
import store from '@/store';
let danmuId = 0;
const line = 3;

const createInitData = () => {
	return {
		player: null,
		needReload: false,
		playStatus: true,
		loading: true,
		showControl: false,
		controlTimer: null,
		fullScreenStatus: false,
		/**
		 * type: 1：文本 3：花,
		 * role: 10：学生 5703...,
		 * text: 文本内容,
		 */
		danmuList: [],
		lines: line,
		positions: Array.from({ length: line }).map((item, index) => index * (210 / line)),
	};
};
export default {
	props: {
		playUrl: String,
		postImg: String,
		error: String,
		total: Number,
		danmuSwitch: Boolean,
		mute: Boolean,
		showFlowerTip: Boolean,
	},
	data() {
		return createInitData();
	},
	components: { VideoMask },
	computed: {
		auth() {
			return store.getters.auth;
		},
		networkType() {
			console.log('网络类型修改', store.getters.networkType);
			return store.getters.networkType;
		},
		isFlow() {
			let networkType = this.networkType;
			console.log('是不是流量', !!~['4g', '3g', '2g'].indexOf(networkType));
			return !!~['4g', '3g', '2g'].indexOf(networkType);
		},
		autoPlay() {
			let autoPlay = this.auth && !this.isFlow;
			console.log('自动播放', autoPlay);
			this.playStatus = autoPlay;
			return autoPlay;
		},
	},
	watch: {
		isFlow(isFlow) {
			console.log('是否流量修改', this.playStatus, isFlow);
			if (this.player && this.playStatus && isFlow) {
				this.togglePlay();
			}
		},
		error(error) {
			if (error) {
				this.fullScreenStatus && this.exitFullScreen();
			} else {
				this.playStatus = !this.isFlow;
				this.loading = true;
			}
		},
	},
	methods: {
		loginSuccess() {
			this.$emit('loginSuccess');
		},
		toggleControl() {
			this.showControl = true;
			this.controlTimer = setTimeout(() => {
				this.showControl = false;
				clearTimeout(this.controlTimer);
			}, 5000);
		},
		reloadVideo() {
			this.needReload = false;
			this.loading = true;
		},
		toggleFullScreen() {
			let status = this.fullScreenStatus;
			let methods = status ? 'exitFullScreen' : 'requestFullScreen';
			console.log('来全屏', status);
			this.player[methods]({
				direction: 90,
				fail(e) {
					console.log(e);
				},
			});
		},
		exitFullScreen() {
			this.toggleFullScreen();
			this.fullScreenStatus = false;
			this.danmuList = [];
		},
		fullScreenChange(e) {
			console.log(e);
			let status = e.mp.detail.fullScreen;
			console.log((status = '1212121'));
			this.fullScreenStatus = status;
			// this.switchDanmu(status);
		},
		togglePlay() {
			let status = this.playStatus;
			let methods = status ? 'pause' : 'play';
			//要播放视频了
			if (!status) this.loading = true;
			else if (this.fullScreenStatus)
				//要暂停然后现在是全屏，先退出全屏
				this.exitFullScreen();
			this.player[methods]({
				success: () => {
					this.playStatus = !status;
				},
			});
		},
		stateChange(e) {
			let { code } = e.mp.detail;
			console.log('播放状态改变', e.mp.detail);
			if (code === -2301) {
				//网络不好放弃连接了
				if (this.fullScreenStatus) {
					this.exitFullScreen();
				}
				this.needReload = true;
			}
			if (~[2007, 2103].indexOf(code)) {
				this.loading = true;
			} else if (~[2003, 2004, -2301, -2302, 2105].indexOf(code)) {
				// || code > 3000
				this.loading = false;
			}
		},
		sendFlower() {
			this.$emit('sendFlower');
		},
		addOne() {
			this.$emit('addOne');
		},
		switchDanmu(status) {
			!status && (this.danmuList = []);
			this.$emit('update:danmuSwitch', status);
		},
		sendDanmu(opts = {}) {
			let random = Math.random();
			let time = Math.round(random * 7) + 3;
			let { text } = opts;
			text && (opts.text = (text + '').replace(/(.{7})/g, '$1&@*%').split('&@*%'));
			let item = {
				id: danmuId++,
				time,
				color: this.generateColor(),
				...opts,
			};
			this.danmuList.push(item);
		},
		generateColor() {
			return (
				'#' +
				Array.from({ length: 3 })
					.map(() => Math.round(Math.random() * 255).toString(16))
					.join('')
			);
		},
	},
	onLoad() {
		this.player = wx.createLivePlayerContext('player', this);
	},
	onHide() {
		this.playStatus && (this.loading = true);
	},
	onUnload() {
		Object.assign(this.$data, createInitData());
	},
};
</script>
<style scoped>
.player-container {
	position: relative;
	width: 100%;
	height: 100%;
}
.block {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width: auto;
	height: auto;
}
.cover-inner {
	z-index: 1;
}
/* loading */
.loading {
	line-height: 450rpx;
	/* background: #000; */
}

.pause.prompt .tip {
	padding: 16rpx 32rpx;
	margin-bottom: 0;
	border: 1rpx solid #fff;
	border-radius: 38rpx;
	background: rgba(3, 12, 29, 0.4);
}
/* 控制按钮 */
.controls {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 1;
}
.controls .play-controls {
	height: 76rpx;
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	opacity: 0;
}
.controls .play-controls.show {
	opacity: 1;
}
.controls .play-controls.full-screen {
	height: 100rpx;
}
.play-controls .full {
	position: absolute;
	bottom: 15rpx;
	right: 20rpx;
	width: 46rpx;
	height: 46rpx;
}
.play-controls.full-screen .full {
	bottom: 27rpx;
}
.control-left {
	font-size: 28rpx;
	position: absolute;
	top: 27rpx;
	left: 20rpx;
}
.control-left1 {
	top: 10rpx;
}
.control-left cover-image,
.control-left cover-view {
	display: inline-block;
	line-height: 1;
	vertical-align: middle;
}
.control-left cover-image {
	margin-right: 30rpx;
}
.control-left .watch {
	width: 50rpx;
	height: 34rpx;
}
.control-left .watchNum {
	padding-top: 10rpx;
	line-height: 45rpx;
	height: 50rpx;
}
.control-left .flower {
	width: 42rpx;
	height: 56rpx;
	vertical-align: middle;
}
.control-left .flower.mute {
	width: 49rpx;
}
.control-left .add {
	width: 57rpx;
	height: 56rpx;
	vertical-align: middle;
}
.control-left .danmu {
	width: 82rpx;
	height: 52rpx;
	display: inline-block;
	vertical-align: middle;
}
.control-left .danmu cover-image {
	width: 100%;
	height: 100%;
}
/* 弹幕 */
.danmu-container {
	position: absolute;
	width: 100%;
	height: 210rpx;
	z-index: 5;
}
.danmu-animate {
	position: absolute;
	left: 0;
	font-size: 34rpx;
	color: #fff;
	line-height: normal;
	opacity: 0;
	transform: translateZ(0);
	animation: move 20s linear 1;
}
.danmu-animate .flower {
	width: 27rpx;
	height: 37rpx;
}
.danmu-animate .badge {
	width: 50rpx;
	height: 30rpx;
	font-size: 20rpx;
	color: #e3b618;
	text-align: center;
	line-height: 30rpx;
	display: inline-block;
	margin-right: 15rpx;
	background: #fef9cd;
	border: 1px solid #e6d64d;
	border-radius: 4rpx;
	box-sizing: content-box;
}
.danmu-animate .text {
	width: auto;
	display: inline-block;
	vertical-align: middle;
}
@keyframes move {
	0% {
		opacity: 1;
		/* transform: translateX(750rpx); */
		transform: translateX(100vmax);
		/* transform: translateX(0); */
	}
	100% {
		opacity: 1;
		transform: translateX(-100%);
		/* transform: translateX(-100vmax); */
	}
}
.showFlower {
	background: rgba(0, 0, 0, 0.6);
	border-radius: 5rpx;
	color: #fff;
	padding: 25rpx 30rpx;
	position: fixed;
	top: 35%;
	left: 50%;
	z-index: 5;
	margin-left: -85rpx;
	padding: 20rpx 20rpx;
	width: 150rpx;
	font-size: 30rpx;
}
</style>
