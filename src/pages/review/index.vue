<template>
	<view class="contain">
		<!-- 录播视频播放区域 -->
		<!-- 不在加载中 已登录 有WIFI-->
		<video v-if="!loading&& Auth &&!flagWifi" class="video" id="myVideo" @timeupdate='timeupdate' :initial-time='time22' :autoplay="playStatus" :src="videoData.playUrl" objectFit="fill" controls :poster="videoData.poster" @ended="bindended" @error="errorhandle" @play="playControl" @pause="pauseControl" :show-center-play-btn='false'>
			<!-- 有WIFI 播放停止 -->
			<cover-view class="live-pause" v-if="!playStatus && !notWifi" @click="togglePlay">
				<cover-image src="/static/images/icon-nologin-pause.png" />
				<cover-view>点击继续观看课程</cover-view>
			</cover-view>
			<!-- 在4G情况下已播放情况下 无wifi 播放停止 -->
			<NetworkMask :visible="notWifi && !playStatus" @play="togglePlay"></NetworkMask>
		</video>
		<!-- 4G情况下 解决IOS自动播放BUG 提示框 -->
		<block v-if="Auth">
			<cover-view class="live-pause loading-pause" v-if="notWifi && flagWifi" @click="noWifiPlay">
				<cover-image src="/static/images/live.png" />
				<cover-view>您正在使用移动网络，建议使用WIFI</cover-view>
			</cover-view>
		</block>

		<!-- 加载时间过长 提示框-->
		<block v-if="!flagWifi">
			<cover-view class="live-pause loading-pause" v-if="loading" @click="loadingPlay">
				<cover-image src="/static/images/icon-nologin-pause.png" />
				<cover-view>您的网络不好，是否需要重新加载视频？</cover-view>
			</cover-view>
		</block>
		<!-- 未登录 -->
		<view v-if="!Auth" style="height:420rpx;position: relative;">
			<VideoMask @success='initPage' :showButton="!Auth" :videoError="videoError"></VideoMask>
		</view>
		<!-- <div class="empty room" v-if="!Auth">
			<div class="img"><img src="/static/images/icon-nologin.png" alt=""></div>
			<p>你还没有登录，登录之后才能观看视频哦。</p>
		</div> -->
		<!-- 课程标题 -->
		<view class='classIntroduce clear' v-if="Auth">
			<view class='classIntroduceTitle'>
				<view class="title">{{description}}</view>
			</view>
		</view>
		<!-- 章节内容 -->
		<scroll-view class='liveList clear' :scroll-y="true">
			<div class="empty" v-if="!Auth">
				<div class="img"><img src="/static/images/icon-nologin.png" alt=""></div>
				<p>你还没有登录，登录之后才能观看视频哦。</p>
			</div>
			<view class='liveListView' v-if='chapterList.lenght!=0 && Auth'>
				<ul>
					<li v-for="(item,index) in chapterList" :key="item.chapterId " class="chapterli">
						<view class='liveOverYes clear' @click="clickChapter(index)">

							<view class="title1 ">{{index+1}} {{item.chapterName}}</view>

							<!-- <view class="live-right" v-if="item.playUrl.length==1 && living!=item.playUrl[0].polyVid">
								<i class="icon-play"></i>
								<i class="text">{{item.playUrl[0].seconds}}</i>
							</view>

							<view class='live-right aa' v-if="item.playUrl.length==1 && living==item.playUrl[0].polyVid">
								<view style="display:inline-block">正在观看 </view>
							</view> -->

							<view class='live-right' v-if="item.playUrl.length >0">
								<span class="up" :class="item.open ?'sclce' :''"><img src="/static/images/ups.png" alt=""></span>
							</view>

						</view>
						<view class="selectDiv" v-if="item.playUrl.length >0 && item.open">
							<ul>
								<li @click="playVedio(items.polyVid,1,index)" v-for="(items,i) in item.playUrl" :key="i" :class="living==items.polyVid?'color':''" class="clear">
									<view class="title3 title2" :class="living==items.polyVid?'color':''">0{{i+1}} {{items.name}}</view>
									<view class='live-right aa' v-if="living ==items.polyVid">
										<view style="display:inline-block">正在观看 </view>
									</view>
									<span v-else class='noPlay'>
										<i class="icon-play"></i>
										<i class="text">{{items.seconds}}</i>
									</span>
								</li>
							</ul>
						</view>
					</li>

				</ul>
			</view>
		</scroll-view>
	</view>
</template>
<script>
import { getCourseDetail, getVideoSign, applyCourse, postVideoHeart } from '@/services/course.js';
import store from '@/store';
const polyv = require('@/vendors/polyv.js');
import VideoMask from '@/components/videoMask';
import NetworkMask from '@/components/networkMask';
import navigateTo from '@/utils/navigator';
export default {
	data() {
		return {
			chapterList: [], //处理数据
			chapterList1: [], //接口初始数据
			description: '',
			mainTeacher: '',
			people: '',
			courseId: '',
			chapterId: '',
			videoError: '',
			videoData: {
				playUrl: [],
				poster: '',
			},
			showButton: false, //控制未登录显示状态
			videoContext: null,
			living: '',
			chapters: {},
			playId: '',
			notWifi: false,
			playStatus: true, //播放状态
			isEnd: false,
			loading: false, //控制加载时间过长显示遮罩
			time11: 0, //中转保存时间
			time22: 0, //设置视频初始时间
			flagWifi: false,
			options: {
				token: '',
				courseId: '',
				classId: '',
				chapterId: '',
				videoId: '',
				playDuration: '',
				terminalType: 6,
			},
		};
	},
	components: {
		VideoMask,
		NetworkMask,
	},
	methods: {
		initPage() {
			this.showButton = false;
			this.getCourse();
		},
		//小程序video组件 函数事件
		timeupdate(e) {
			this.time11 = e.mp.detail.currentTime;
			this.options.playDuration = parseInt(this.time11);
		},
		errorhandle() {
			console.log('errorhandle');
			wx.showToast({ title: '视频播放出错', icon: 'none' });
			this.videoError = '视频播放出错';
			this.loading = true;
		},
		bindended() {
			this.isEnd = true;
			this.playStatus = false;
			this.videoContext.exitFullScreen();
		},
		playControl() {
			this.setIntervalTag = setInterval(() => {
				postVideoHeart(this.options).catch(res => {
					console.log('error:' + res.msg);
				});
				console.log('play');
			}, 60000);
			this.playStatus = true;
			this.isEnd = false;
		},
		pauseControl() {
			if (this.setIntervalTag) {
				clearInterval(this.setIntervalTag);
			}
			console.log('pause');
			this.playStatus = false;
		},
		//小程序video组件 函数事件 结束
		//控制WIFI提示框
		noWifiPlay() {
			this.flagWifi = false;
			// if(this.loading){

			// }
			this.loading = false;
			this.time22 = this.time11;
			this.videoContext.play();
		},
		// 控制加载提示框
		loadingPlay() {
			this.loading = false;
		},
		togglePlay() {
			let methods = this.playStatus ? 'pause' : 'play';
			this.videoContext[methods]();
		},
		async getCourse() {
			try {
				wx.showLoading({ title: '加载中', mask: true });

				let res = await getCourseDetail({
					courseId: this.courseId,
				});

				wx.hideLoading();
				if (!res.data.unshelve == 0) {
					setTimeout(() => {
						navigateTo('unshelve', { title: res.data.courseName });
					}, 1500);
					return;
				}

				let { courseName, mainTeacher, applyNum, isApply } = res.data;
				this.description = courseName;
				this.mainTeacher = mainTeacher;
				this.chapterList1 = res.data.chapters.map(i => {
					return Object.assign(
						{
							// open: i.playUrl.some(item => item.polyVid == self.playId),
							// 给每个章节打上标签 控制显示与隐藏
							open: i.playUrl.some(item => true),
						},
						i
					);
				});

				this.people = applyNum;
				let appy = isApply;
				if (!appy) {
					this.applyUser();
				}
				//有回看的章节
				// this.chapterList = this.chapterList1.filter(item => {
				// 	return item.status == 2 && item.playUrl.length > 0;
				// });

				this.chapterList1.forEach(i => {
					i.playUrl.forEach(e => {
						e.seconds = this.time(e.seconds);
					});
				});
				this.chapterList = this.chapterList1;
				// 首次播放那个视频
				this.playVedio(this.playId, 0, 0);
				wx.setNavigationBarTitle({
					title: res.data.courseName,
				});
			} catch (e) {
				wx.hideLoading();
				throw e;
			}
		},
		//自动报名
		async applyUser() {
			try {
				await applyCourse({ courseId: this.courseId });
				wx.showToast({ title: '报名成功' });
			} catch (res) {
				if (res.status == 3) {
					wx.showToast({ title: applys.msg });
				}
			}
		},
		async playVedio(id, index, index1) {
			if (this.setIntervalTag) {
				clearInterval(this.setIntervalTag);
			}
			let item = this.chapterList[index1];
			this.getWifiStatus();
			this.time11 = 0;
			if (index && id == this.living) return;
			// living排他
			if (index) this.living = id;
			// this.loading = false;
			let res = await getVideoSign({
				vid: id,
			});
			let { signature, timestamp, vid } = res.data;
			this.options.courseId = this.courseId;
			this.options.classId = this.chapterList[0].classId;
			this.options.chapterId = item.chapterId;
			this.options.videoId = vid;
			this.options.token = this.authToken;
			polyv.getVideo(
				vid,
				videoInfo => {
					if (videoInfo.error) {
						this.videoError = error;
					} else {
						this.videoError = '';
						this.videoData.poster = videoInfo.poster;
						this.videoData.playUrl = videoInfo.src[0] || '';
					}
				},
				timestamp,
				signature
			);
		},
		// 点击控制章节展开
		clickChapter(index) {
			let item = this.chapterList[index];
			// 无章节 题目即使章节
			// if (item.playUrl.length === 1) {
			// 	this.playVedio(item.playUrl[0].polyVid, 1);
			// } else {
			item.open = !item.open;
			// }
			if (item.playUrl.length == 0) {
				wx.showToast({
					title: '暂无可观看的视频',
					icon: 'none',
				});
			}
		},
		getWifiStatus() {
			let notWifi = ['wifi', 'none', 'unknown'].indexOf(this.networkType) == -1;
			this.notWifi = notWifi;
		},
		// 格式化视频时间
		time(time) {
			let res = +time;
			let i = 0;
			let arr = [];
			while (i < 3) {
				let num = 3600 / Math.pow(60, i); //60的i次方幂
				arr.push(('0' + parseInt(res / num)).slice(-2));
				res = res % num;
				i++;
			}
			return arr.join(':');
		},
	},
	computed: {
		//已登录
		Auth() {
			return store.getters.auth;
		},
		//章节时间
		tFilter1() {
			let time = this.chapterList.liveStartTime;
			return time ? parseTime(+time, '{m}.{d}  {h}:{i}') : '';
		},
		//网络状态
		networkType() {
			return store.getters.networkType;
		},
		authToken() {
			return store.getters.authToken;
		}
	},
	watch: {
		networkType(type) {
			//是用流量的
			let flag = ['wifi', 'none', 'unknown'].indexOf(type) == -1;
			if (this.videoContext && !this.isEnd && !this.notWifi && flag) {
				//  4g
				this.togglePlay();
			}
			//  wifi
			this.notWifi = flag;
			if (this.notWifi) {
				console.log('121');
				this.flagWifi = true;
			} else {
				console.log('else');
				this.flagWifi = false;
			}
		},
	},
	onShow() {
		this.playStatus = true;
		// ios切换出应用后 播放停止BUG
		if (this.videoContext) {
			this.videoContext.play({});
		}
	},
	mounted() {
		console.log('mounted');
		if (this.Auth) {
			this.showButton = false;
		} else {
			this.showButton = true;
		}
		this.videoContext = wx.createVideoContext('myVideo', this);
		this.getWifiStatus();
		!this.Auth && store.dispatch('GetAuthKey');
		// 获取进去页面播放视频ID
		this.playId = JSON.parse(this.$root.$mp.query.playId);
		this.living = this.playId;
		this.courseId = this.$root.$mp.query.courseId;
		// 获取课程详情
		this.getCourse();
	},
};
</script>
<style>
ul,
li {
	margin: 0;
	padding: 0;
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
.loading-pause {
	position: relative;
	top: 0;
	left: 0;
	height: 420rpx;
	background-color: #030c1d;
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
.sclce {
	transition: all 0.3s;
	transform: rotateX(-180deg);
}
.title2 {
	width: 450rpx;
}
.pointNum {
	display: inline-block;
	float: left;
	height: 85rpx;
	line-height: 85rpx;
}
.up {
	display: block;
	width: 27rpx;
	height: 16rpx;
	margin-top: 36rpx;
	vertical-align: middle;
	float: right;
}
.up img {
	display: block;
	width: 100%;
	height: 100%;
}
.covervideo {
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	line-height: normal;
	background: #030c1d;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9999999;
	flex-direction: column;
}
button.covervideo {
	background: rgba(0, 0, 0, 0.5);
	border: none;
	border-radius: 0;
}

.covervideo ._cover-view {
	width: 100rpx;
	height: 100rpx;
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
.selectDiv {
	padding: 0 30rpx;
	width: 100%;
	height: 100%;
}
.selectDiv ul li {
	height: 92rpx;
	line-height: 92rpx;
	color: #303943;
}
.selectDiv ul li span {
	float: right;
	box-sizing: border-box;
	padding-left: 40rpx;
	padding-right: 50rpx;
	color: #a1a1a3;
}
.selectDiv ul li .noPlay {
	position: relative;
	height: 92rpx;
	line-height: 92rpx;
}
.aa {
	display: inline-block;
	float: right;
	padding-right: 50rpx;
}
.selectDiv ul li span .icon-play {
	position: absolute;
	left: 0;
	top: 50%;
	margin-top: -15rpx;
	width: 30rpx;
	height: 30rpx;
	border-radius: 50%;
	background: url('../../../static/images/icon_bf@2x.png') no-repeat center;
	background-size: 30rpx 30rpx;
}
.text {
	font-size: 28rpx;
}
.selectDiv ul li .point {
	display: inline-block;
	float: initial;
	width: 12rpx;
	height: 12rpx;
	background-color: #303943;
	padding-right: 0;
	margin-right: 15rpx;
	margin-top: -5rpx;
	vertical-align: middle;
}
.contain {
	height: 100%;
	display: flex;
	flex-direction: column;
}
.liveTeacher {
	color: #a1a1a3;
}
.people {
	display: inline-block;
	border-left: 1px solid #a1a1a3;
	color: #a1a1a3;
	font-size: 28rpx;
	padding-left: 25rpx;
	margin-left: 25rpx;
}
.people img {
	width: 28rpx;
	height: 28rpx;
	padding-right: 25rpx;
}
/* .clear:before,
.clear:after {
	content: '';
	display: block;
	clear: both;
} */
.video {
	width: 750rpx;
	height: 420rpx;
}
.liveList {
	flex: 1;
	width: 750rpx;
	background: #fff;
	border-top: 1px solid #f1f1f1;
	overflow: auto;
}
.courseDetail {
	padding-bottom: 30rpx;
}
.title {
	width: 660rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	font-weight: 500;
	word-break: break-all;
	margin-bottom: 30rpx;
}
.classIntroduce {
	box-sizing: border-box;
	width: 750rpx;
	height: 100rpx;
	line-height: 100rpx;
	padding: 0 30rpx;
	background: #fff;
}
.classIntroduceTitle {
	font-weight: bolder;
	font-size: 36rpx;
	color: #303943;
	width: 100%;
}
.liveListView {
	width: 750rpx;
	height: 100%;
	float: left;
}
.liveListTitle,
.courseDetailTitle {
	font-size: 40rpx;
	font-weight: bold;
	color: #303943;
	margin-bottom: 20rpx;
}
.liveListView li {
	font-size: 30rpx;
	color: #35414e;
}
.liveOverYes {
	box-sizing: border-box;
	width: 100%;
	height: 100rpx;
	line-height: 100rpx;
	padding: 0 30rpx;
	background-color: #f3f7ff;
}
.title1 {
	float: left;
	width: 480rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 32rpx;
	color: #303943;
	font-weight: bold;
}
.title3 {
	width: 480rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	float: left;
	font-size: 28rpx;
	color: #303943;
	font-weight: bold;
}
.live-right {
	float: right;
	font-size: 24rpx;
	width: 172rpx;
	text-align: right;
	overflow: hidden;
}
.live-right .color {
	/* display: block; */
	float: right;
	width: 130rpx;
	height: 46rpx;
	line-height: 46rpx;
	text-align: center;
	border: 1rpx solid #3073f4;
	border-radius: 4rpx;
	margin-top: 25rpx;
}
.color {
	color: #3585fe !important;
}
.color1 {
	background-color: #3585fe !important;
}
</style>
