<template>
	<view class="contain">
		<view class="live">
			<img :src="url+course.cover+width" alt="" v-if="course.cover">
			<view class="onlive" v-if="isLiving">
				<button :plain="true" :open-type="Auth ? '' :'getPhoneNumber'" @click="authorize($event,courseId,1)" @getphonenumber="getPhoneNumber($event,courseId,1)">
					<img class="pic" src="/static/images/live.png" alt="">
					<view class="num">
						<view style="width:30rpx;height:32rpx;display:inline-block;padding-right:10rpx"><img src="/static/images/1.gif" alt=""> </view>{{course.applyNum}}人在上课
					</view>
					<span>进入教室</span>
				</button>
			</view>
		</view>
		<view class='classIntroduce clear'>
			<view class='classIntroduceTitle clear'>
				<view class="title">{{course.courseName}}</view>
				<button :plain="true" open-type="share"><img src="/static/images/live-share.png" alt=""></button>
			</view>
			<view class='liveTeacher'>主讲：&nbsp;&nbsp;{{course.mainTeacher}}
			</view>
			<view class='liveTeacher liveTeacher1'>报名人数：&nbsp;&nbsp;{{course.applyNum}}
			</view>
		</view>
		<view class="bgGary"></view>
		<!-- 课程内容 -->
		<view class='liveList clear' v-if='chapterList.length!=0'>
			<view class='liveListView'>
				<view class='liveListTitle'>课程内容</view>
				<p style="font-size:28rpx;color:#A1A1A3;padding-bottom:15rpx" v-if="course.endChapterNum>0">已结束{{course.endChapterNum}}个章节</p>
				<ul>
					<li v-for="(item,index) in chapterList" :key="item.chapterId " :class="{vedioFont:(!livingCourse && item.playUrl.length >0)} " class="clear">
						<view class='liveOverYes clear' @click="seleceDive(item)">
							<view class="title1" :class="{color:course.status==1 && livingCourse && item.status==1} ">{{index+1+course.endChapterNum}} {{item.chapterName}}</view>

							<!-- 直播中 -->
							<view class='live-right color' v-if="course.status==1 && livingCourse && item.status==1">
								<view class="animate"><img src="/static/images/2.gif" alt=""></view>
							</view>
							<!-- 未开始， -->
							<view class="live-right" v-else-if="livingCourse &&(item.status==3|| item.status==1)">
								<span>{{tFilter1[index] || ''}}</span>
							</view>
							<!-- 录播 -->
							<view class="live-right clear" v-if="!livingCourse && item.playUrl.length >0">
								<span class="up" :class="item.open ? 'sclce' :''"><img src="/static/images/ups.png" alt=""></span>
							</view>
						</view>
						<view class="morePlayUrl" v-show="item.playUrl.length >0 && item.open">
							<ul>
								<li v-for="(item,i) in item.playUrl" :key="i" style="color:#A1A1A3" class="clear">
									<view class="pointNum">
										<!-- <span class="point"></span> -->
										{{(i>10) ? i+1 : '0'+(i+1) }} </view>
									<view class="title1 title2">{{item.name}}</view>
									<view class="live-right">
										<button class="gray" :plain="true" :open-type="Auth ? '' :'getPhoneNumber'" @getphonenumber="getPhoneNumber($event,item.polyVid,2)" @click="authorize($event,item.polyVid,2)">
											<img src="/static/images/icon_bf.png" alt="" class="videoImg">
											<span style="display:inline;float:left;margin-left:15rpx">{{item.seconds}}</span>
										</button>
									</view>
								</li>
							</ul>
						</view>
					</li>
				</ul>
				<view class="courseMore" @click="moreChapters" v-if="coursMore">
					查看所有课程内容
					<view style="width:27rpx;height:24rpx;display:inlne-block;float:right;padding-top:5px">
						<img src="/static/images/icon_v1.png" alt="">
					</view>
				</view>
			</view>
		</view>
		<view class="bgGary" v-if='chapterList.length!=0'></view>
		<!-- 课程详情 -->
		<view class="courseDetail" v-if="course.courseDesc">
			<view class="courseDetailContent clear">
				<view class="courseDetailTitle">课程详情</view>
				<rich-text class="intro" :nodes="course.transDesc"></rich-text>
			</view>
		</view>
		<view class='button'>
			<view class="clear">

				<button class='enroll' @click="authorize($event,courseId,1)" :plain="true" :open-type="Auth ? '' : 'getPhoneNumber'" @getphonenumber="getPhoneNumber($event,courseId,1)" v-if="livingCourse && isLiving">开始学习</button>

				<button class='enroll' v-if="livingCourse && notLiving" :plain="true" @click="notStart">{{'下节直播：'+tFilter2}}</button>

				<button class='enroll' :plain="true" v-if="livingCourse && livingEnding" @click="over()">待更新</button>

				<!-- 录播 -->
				<button class='enroll' @click="authorize($event,chaptersPlay[0].playUrl[0].polyVid,2)" :plain="true" :open-type="Auth ? '' : 'getPhoneNumber'" @getphonenumber="getPhoneNumber($event,chaptersPlay[0].playUrl[0].polyVid,2)" v-if="!livingCourse &&chaptersPlay.length>0">开始学习</button>

				<button class='enroll' :plain="true" @click="noVedio()" v-if="!livingCourse && chaptersPlay.length==0">暂无可观看视频</button>
			</view>
		</view>
	</view>
</template>
<script>
import { getCourseDetail, applyCourse } from '@/services/course.js';
import store from '@/store';
import { parseTime } from '@/utils';
import navigateTo from '@/utils/navigator';
import config from '@/utils/env';
export default {
	data() {
		return {
			course: '',
			courseId: '',
			chapterList: [],
			chapterList1: [],
			coursMore: false,
			formId: '',
			url: config.res + '/',
			open: false,
			isOut: true,
			width: store.getters.imgPostfix + 550, //'?x-oss-process=image/resize,m_mfit,w_'+store.getters.availWidth,
		};
	},
	computed: {
		//已登录
		Auth() {
			return store.getters.auth;
		},
		//已报名
		isApply() {
			return this.course.isApply;
		},
		//直播中
		isLiving() {
			return this.course.status == 1;
		},
		//直播结束
		livingEnding() {
			return this.course.status == 2;
		},
		//直播未开始
		notLiving() {
			return this.course.status == 3;
		},
		//有回看的章节
		chaptersPlay() {
			return this.chapterList1.filter(i => {
				return i.playUrl.length > 0;
			});
		},
		//章节时间
		tFilter1() {
			return this.chapterList.map(i => {
				if (i.liveStartTime) {
					return parseTime(+i.liveStartTime, '{m}.{d}  {h}:{i}');
				}
			});
		},
		//下节直播时间
		tFilter2() {
			let time = this.course.nextLiveTime;
			return time ? parseTime(+time, '{m}.{d}  {h}:{i}') : '';
		},
		//是直播课
		livingCourse() {
			return this.course.teachingMethod == 0;
		},
	},
	onPullDownRefresh() {
		this.getCourse();
	},
	methods: {
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
		seleceDive(item) {
			if (item.playUrl.length == 0 && !this.livingCourse) {
				wx.showToast({ title: '暂无可观看视频 !', icon: 'none' });
			} else {
				item.open = !item.open;
			}
		},
		//获取课程详情
		async getCourse() {
			try {
				wx.showLoading({ title: '加载中', mask: true });
				let res = await getCourseDetail({
					courseId: this.courseId,
				});
				wx.hideLoading();
				if (!res.data.unshelve == 0) {
					setTimeout(() => {
						if (!this.isOut) {
							navigateTo('unshelve', { title: res.data.courseName }, 1);
						}
					}, 1500);
					return;
				}
				this.course = res.data;
				this.course.transDesc = this.course.courseDesc.replace(
					/<img.+src="([^"]+)"[^>]*>/g,
					'<img src="$1' + this.width + '" style="max-width: 100%">'
				);
				this.chapterList1 = this.course.chapters.map((item, index) => {
					return Object.assign({ open: index == 0 }, item);
				});
				this.chapterList1.forEach(item => {
					item.playUrl.forEach(i => {
						i.seconds = this.time(i.seconds);
					});
				});
				if (this.chapterList1.length >= 6) {
					this.coursMore = true;
					this.chapterList = this.chapterList1.slice(0, 5);
				} else {
					this.chapterList = this.chapterList1;
				}
				if (!this.isOut) {
					wx.setNavigationBarTitle({
						title: this.course.courseName,
					});
				}
				wx.stopPullDownRefresh();
			} catch (e) {
				wx.hideLoading();
				wx.showToast({ title: '数据加载失败，请检查网络设置！', icon: 'none' });
				throw e;
			}
		},
		//查看更多课程
		moreChapters() {
			this.coursMore = false;
			this.chapterList = this.chapterList1;
		},
		//报名
		async applyUser() {
			try {
				await applyCourse({ courseId: this.courseId });
				wx.showToast({ title: '报名成功' });
				this.course.isApply = true;
			} catch (res) {
				if (res.status == 3) {
					wx.showToast({ title: applys.msg });
				}
			}
		},
		//直播允许授权
		async getPhoneNumber(e, id, num) {
			let payload = e.mp.detail;
			let { encryptedData, iv } = payload;
			if (!encryptedData) {
				wx.showModal({
					title: '提示',
					content: '未授权',
					showCancel: false,
					success: function(res) {},
				});
			} else {
				try {
					let res = await store.dispatch('WxLogin', {
						encryptedData,
						iv,
					});
					wx.showToast({ title: '授权成功' });
					let { status } = res;
					if (status == 1010) navigateTo('selectAccountLogin');
					console.log('getPhone-id2:' + id);
					this.authorize(e, id, num);
				} catch (e) {
					wx.showToast({
						title: e.msg,
						icon: 'none',
					});
				}
			}
		},

		//点击授权
		async authorize(e, id, num) {
			//已登录
			if (this.Auth) {
				if (num === 1) {
					//直播
					this.lookLive();
				} else if (num === 2) {
					//回看
					this.lookBack(e, id);
				}
			}
		},
		//课程已结束
		over() {
			wx.showToast({ title: '暂无更新的章节 !', icon: 'none' });
		},
		//视频章节无回看
		noVedio() {
			wx.showToast({ title: '暂无可观看视频 !', icon: 'none' });
		},
		//课程未开始
		notStart() {
			wx.showToast({ title: '直播尚未开始 !', icon: 'none' });
		},
		//直播视频
		lookLive() {
			navigateTo('live', {
				courseId: this.courseId,
			});
		},
		//录播
		lookBack(e, playId) {
			navigateTo('review', {
				playId: JSON.stringify(playId),
				courseId: this.courseId,
			});
		},
	},

	mounted() {
		this.isOut = false;
		this.courseId = this.$root.$mp.query.courseId;
		!this.Auth && store.dispatch('GetAuthKey');
		this.getCourse();
	},

	onUnload() {
		this.isOut = true;
		this.coursMore = false;
	},
};
</script> 
<style scoped>
.bgGary {
	background-color: #f3f3f3;
	height: 30rpx;
	width: 100%;
}
.vedioFont {
	font-size: 32rpx;
	background-color: rgba(243, 247, 255, 1);
}
.liveOverYes {
	padding: 0 30rpx;
}
.pointNum {
	display: inline-block;
	float: left;
	height: 85rpx;
	line-height: 85rpx;
	padding-right: 10rpx;
}
.sclce {
	transition: all 0.3s;
	transform: rotateX(-180deg);
}
.morePlayUrl {
	background-color: #fff;
}
.morePlayUrl .point {
	display: inline-block;
	width: 12rpx;
	height: 12rpx;
	background-color: #303943;
	padding-right: 0;
	margin-right: 15rpx;
	margin-top: -5rpx;
	vertical-align: middle;
}
.up {
	display: block;
	width: 27rpx;
	height: 16rpx;
	margin-top: 36rpx;
	vertical-align: middle;
	float: right;
}
.morePlayUrl {
	width: 100%;
	height: auto;
}
.morePlayUrl ul li {
	padding-left: 30rpx;
}
.contain {
	/* display: flex;
	flex-direction: column; */
	/* background-color: #f3f3f3; */
}
.live-right .animate {
	width: 25rpx;
	height: 35rpx;
	margin-right: 10rpx;
	display: inline-block;
}
button[plain] {
	font-size: 28rpx;
	text-align: center;
	line-height: auto;
	background: transparent;
	padding: 0;
	border: none;
	border-radius: 0;
}
button.contact {
	background: #fff;
	height: 100%;
	font-size: 34rpx;
}
.contact::after {
	border: none;
}
.onlive button[plain] {
	line-height: 40rpx;
	color: #fff;
}
button.color[plain] {
	color: #3585fe;
}
button.gray[plain] {
	color: #a1a1a3;
}
button.enroll[plain] {
	background: #3585fe;
	color: #fff;
	font-size: 32rpx;
}
.courseMore {
	font-size: 28rpx;
	font-weight: 500;
	padding: 30rpx 30rpx;
}
.cdImg {
	height: 300rpx;
	padding-right: 30rpx;
}
view {
	box-sizing: border-box;
}
.contain {
	min-height: 100%;
	position: relative;
	padding-bottom: 100rpx;
}
.color {
	color: #3585fe;
}
img {
	display: inline;
	width: 100%;
	height: 100%;
}

.pic {
	display: block;
}
.advisory {
	position: fixed;
	height: 350rpx;
	width: 540rpx;
	left: 50%;
	top: 50%;
	margin-left: -270rpx;
	margin-top: -175rpx;
	background: #ffffff;
	border-radius: 20rpx;
	z-index: 10;
	font-size: 30rpx;
	padding-top: 50rpx;
}
.advisory .close {
	display: block;
	width: 24rpx;
	height: 24rpx;
	margin: 30rpx;
	float: right;
}
/* .advisory .add {
  padding: 20rpx 30rpx 30rpx 30rpx;
  text-align: center;
} */
.advisory .add span {
	color: #3585fe;
}
.advisory button {
	background: #3073f4;
	color: #ffffff;
	font-size: 36rpx;
	border-radius: 10rpx;
	width: 400rpx;
	margin-top: 30rpx;
	border: none;
	font-size: 34rpx;
}
.advisory button.login {
	border: 1rpx solid #3073f4;
	background: #ffffff;
	color: #3073f4;
}
.advisory-bg {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
}
page {
	display: block;
	background-color: #f3f3f3;
	height: 100%;
	padding-bottom: 100rpx;
	font-family: '微软雅黑';
}
.title {
	width: 580rpx;
	/* height: 94rpx; */
	/* line-height: 60rpx; */
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	font-weight: 500;
	float: left;
	word-break: break-all;
	font-size: 40rpx;
	font-weight: 500;
}
.title1 {
	width: 480rpx;
	height: 85rpx;
	line-height: 85rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	float: left;
}
.title2 {
	width: 450rpx;
}
.clear:before,
.clear:after {
	content: '';
	display: block;
	clear: both;
}
.live {
	width: 750rpx;
	height: 450rpx;
	position: relative;
}
.live .onlive {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	text-align: center;
	font-size: 26rpx;
	background: rgba(0, 0, 0, 0.5);
	color: #ffffff;
	padding-top: 98rpx;
	box-sizing: border-box;
}
.onlive .pic {
	display: inline-block;
	width: 110rpx;
	height: 110rpx;
}
.onlive .num {
	margin-top: 15rpx;
	margin-bottom: 30rpx;
}
.animation {
	display: inline-block;
	width: 50rpx;
	height: 40rpx;
	position: relative;
}
.onlive span {
	display: block;
	width: 160rpx;
	height: 60rpx;
	line-height: 60rpx;
	text-align: center;
	background: #18b12a;
	border-radius: 4rpx;
	margin: 0 auto;
}
.live .name {
	position: absolute;
	width: 100%;
	height: 120rpx;
	padding: 50rpx 30rpx 0 30rpx;
	font-size: 34rpx;
	color: #ffffff;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	bottom: 0;
	left: 0;
	background: linear-gradient(rgba(14, 21, 33, 0), rgba(10, 17, 31, 0.8));
}
/* 获赠课程 */
.getCourse {
	height: 100rpx;
	line-height: 100rpx;
	padding-left: 86rpx;
	padding-right: 30rpx;
	position: relative;
	font-size: 24rpx;
	background: #ffffff;
	color: #f54436;
	margin-top: 30rpx;
}
.getCourse span {
	position: absolute;
	display: block;
	left: 30rpx;
	top: 28rpx;
	width: 44rpx;
	height: 44rpx;
	line-height: 44rpx;
	text-align: center;
	color: #ffffff;
	background: #f54436;
	border-radius: 4rpx;
	font-size: 24rpx;
}
.getCourse .btn {
	float: right;
	display: block;
	width: 110rpx;
	height: 46rpx;
	line-height: 46rpx;
	text-align: center;
	border: 1rpx solid #f54436;
	border-radius: 4rpx;
	color: #f54436;
	font-size: 24rpx;
	padding: 0;
	margin-top: 28rpx;
}
/* 点击展开课程详情 */
.openMain {
	height: 100rpx;
	line-height: 100rpx;
	padding: 0 30rpx;
	font-size: 28rpx;
	color: #a1a1a3;
	background: #ffffff;
	margin-top: 30rpx;
}
.openMain .icon,
.openbtn .icon {
	width: 27rpx;
	height: 16rpx;
	float: right;
	margin-top: 42rpx;
}
.openbtn .icon {
	margin-top: 5rpx;
}
.openMain .icon.active,
.openbtn .icon.active {
	transform: rotate(180deg);
}
.classIntroduce {
	width: 750rpx;
	padding: 30rpx 30rpx;
	background: #fff;
}
.classIntroduceTitle {
	font-size: 36rpx;
	/* height: 43rpx; */
	/* line-height: 40rpx; */
	color: #333;
	width: 100%;
}
.classIntroduceTitle button {
	/* width: 70rpx;
	padding-right: 5rpx; */
	float: right;
	display: block;
	border: none;
	text-align: center;
	padding-top: 10rpx;
}
.classIntroduceTitle button img {
	width: 41rpx;
	height: 43rpx;
	display: block;
}
.classTime {
	width: 685rpx;
	height: 45rpx;
	margin: 30rpx 0 0 30rpx;
	float: left;
}
.classTime span {
	width: 66rpx;
	height: 36rpx;
	background: #fe4c46;
	color: #fff;
	font-size: 24rpx;
	border-radius: 4rpx;
	display: inline-block;
	text-align: center;
	line-height: 36rpx;
	float: left;
}
.classTimeNext {
	float: left;
	color: #3585fe;
	font-size: 24rpx;
	margin-left: 15rpx;
	height: 36rpx;
	line-height: 36rpx;
}
.classTimeState {
	float: right;
	width: 120rpx;
	height: 44rpx;
	color: #fff;
	background: -webkit-linear-gradient(left, #3387fe, #14b5ff);
	font-size: 26rpx;
	border-radius: 20rpx;
	line-height: 44rpx;
	margin-top: -5rpx;
}
.classTimeState span {
	width: 16rpx;
	height: 16rpx;
	margin: 15rpx 5rpx 0 15rpx;
	float: left;
	background: none;
}
.classTimeText {
	width: 676rpx;
	height: 187rpx;
	margin: 30rpx 0 0 30rpx;
	float: left;
}
.teacherInt {
	width: 690rpx;
	height: 245rpx;
	float: left;
	margin: 20rpx 35rpx;
}
.teacherImg {
	width: 90rpx;
	height: 90rpx;
	border-radius: 50%;
	float: left;
	overflow: hidden;
}
.teacherText {
	width: 570rpx;
	float: left;
	margin-left: 20rpx;
}
.teacherText span {
	font-size: 30rpx;
	font-weight: 500;
}
.teacherTxt {
	color: #696969;
	font-size: 24rpx;
	line-height: 40rpx;
	margin-top: 10rpx;
}
.liveList,
.courseDetail {
	width: 750rpx;
	height: 100%;
	background: #fff;
	padding: 40rpx 0 0 0rpx;
}
.courseDetail {
	padding-bottom: 30rpx;
	height: 100%;
	/* flex: 1; */
}
.liveListView {
	width: 100%;
	height: auto;
	float: left;
}
.liveListView p {
	padding: 0 30rpx;
}
.liveListTitle,
.courseDetailTitle {
	font-size: 40rpx;
	font-weight: 500;
	color: #303943;
	margin-bottom: 30rpx;
}
.liveListTitle {
	padding: 0 30rpx;
}
.liveListView li {
	/* height: 90rpx; */
	height: 100%;
	line-height: 90rpx;
	/* display: block; */
	font-size: 32rpx;
	color: #35414e;
}
.live-right {
	float: right;
	font-size: 28rpx;
	width: 172rpx;
	height: 85rpx;
	overflow: hidden;
	text-align: right;
}
.live-right .color {
	display: block;
	width: 100%;
	height: 46rpx;
	line-height: 30rpx;
	text-align: center;
	margin-top: 25rpx;
	float: right;
}
span.living {
	float: right;
	display: inline-block;
	width: 120rpx;
	height: 40rpx;
	line-height: 40rpx;
	text-align: center;
	color: #5b9cfe;
	font-size: 24rpx;
	border-radius: 4rpx;
	margin-top: 30rpx;
}
.button {
	width: 100%;
	height: 100rpx;
	margin-top: 15rpx;
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 10;
}
.consult {
	width: 50%;
	height: 100rpx;
	background: #fff;
	color: #303943;
	font-size: 34rpx;
	border: none;
	line-height: 100rpx;
	text-align: center;
	float: left;
	border-top: 1px solid #eaebec;
	border-bottom: 1px solid #eaebec;
}
.consult .book {
	display: inline-block;
	width: 36rpx;
	height: 42rpx;
	vertical-align: middle;
	margin-right: 10rpx;
}

.enroll {
	color: #fff;
	font-size: 34rpx;
	width: 100%;
	height: 100rpx;
	line-height: 100rpx;
	text-align: center;
	float: left;
	background: #3073f4;
	border-radius: 0;
	border: none;
}
.enroll .del {
	text-decoration: line-through;
}
.enroll b {
	font-size: 24rpx;
}
.enroll b,
i {
	font-weight: normal;
}
.liveTeacher {
	width: 100%;
	margin-top: 30rpx;
	font-size: 28rpx;
	color: #303943;
	line-height: 40rpx;
	float: left;
}
.liveTeacher1 {
	margin-top: 20rpx;
}
.openbtn {
	height: 48rpx;
	line-height: 48rpx;
	margin: 20rpx auto 0;
}
.video {
	border-top: 1rpx solid transparent;
}
.courseDetailContent {
	/* width: 690rpx; */
	overflow: hidden;
	padding: 0 30rpx;
}
.courseDetailContent .intro {
	font-size: 32rpx;
	color: #35414e;
}
.live-right .videoImg {
	width: 30rpx;
	height: 30rpx;
	display: inherit;
	float: left;
	margin-top: 22rpx;
}
</style>


