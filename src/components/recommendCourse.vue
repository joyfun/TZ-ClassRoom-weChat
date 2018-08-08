<template>
	<view class='liveMore' id='classBox' v-if="CourseList.length>0">
		<block v-for="(item,index) in myList" :key="index">
			<form @submit="formSubmit" report-submit :data-courseId="item.courseId">
				<button @click="goto(item)" class='liveMore_classView' :data-item="item" v-if="item.unshelve == undefined || item.unshelve == 0 ">
					<view class='liveMore_classViewImg' :style="{'background':'url('+item.compressCover +') no-repeat center','background-size':'300rpx 181rpx'}">
						<view class="left_top_img">
							<i class="leftTopBg"></i>
							<view class="leftTopText">{{item.teachingMethod == 0 ?'直播课': '视频课'}}</view>
						</view>
						<view class='classView_now'>
							<view class="bottom_box" v-if="item.status == 1">
								<img src="/static/images/1.gif" alt="" style="width:30rpx;height:32rpx" class="gif">
								<view class="classView_now_msg">正在上课</view>
							</view>
							<i class='classViewImg_i' v-else>
								{{item.teachingMethod == 0 ? item.status == 3 ? '最近直播'+timeFilter[index] : '最近直播：待定': '共更新'+item.backChapterNum+'个课时'}}
							</i>
						</view>
					</view>
					<view class='classViewDetail'>
						<!-- <view class="people_num"> -->
						<div>
							<p class="classView_P">{{item.courseName}}</p>
							<view class="liveMuch calGreen" v-if="!myNewCouse">免费</view>
						</div>
						<template v-if="myNewCouse">
							<view class="recomApplyNum">{{item.mainTeacher}}</view>
						</template>
						<view class="recomApplyNum" v-if="!myNewCouse">{{item.applyNum}}人报名</view>

						<!-- 付费 -->
						<!-- <template v-else>
								<view class="liveMuch calRed">￥{{item.coursePrice}}</view>
								<view class="recomApplyNum">{{item.applyNum}}人购买</view>
							</template> -->
						<!-- </view> -->
					</view>
				</button>

				<!-- 已下架课程 -->
				<button @click="courseUnshelve(item)" v-if="item.unshelve == 1" class='liveMore_classView'>
					<view class='liveMore_classViewImg' :style="{'background':'url('+item.compressCover +') no-repeat center','background-size':'300rpx 181rpx'}">
						<view class="liveMoreMask"></view>
					</view>
					<view class='classViewDetail'>
						<view class="people_num ">
							<p class="classView_P colorGrop">{{item.courseName}}</p>
							<span class="classView_span colorGrop">{{item.mainTeacher}}</span>
						</view>
						<view>
							<view class="grayDrop">已下架</view>
						</view>
					</view>
				</button>

			</form>

		</block>
	</view>
</template>


<script>
import navigateTo from '@/utils/navigator';
import { parseTime } from '@/utils/index';
import config from '@/utils/env';
import store from '@/store';
export default {
	name: 'recommendCourse',
	props: ['CourseList', 'myNewCouse'],
	data() {
		return {
			goUrl: navigateTo,
		};
	},
	methods: {
		goto: function(item) {
			navigateTo(item.status === 1 ? 'live' : 'courseDetail', {
				courseId: item.courseId,
			});
		},
		courseUnshelve: function(item) {
			wx.showToast({
				title: '该课程已下架',
				icon: 'none',
			});
		},

		// wx.showToast({
		//   title: '成功',
		//   icon: 'success',
		//   duration: 2000
		// })
	},
	computed: {
		timeFilter() {
			return this.CourseList.map(i => {
				if (i.liveStartTime) {
					return parseTime(i.liveStartTime, '{m}.{d} {h}:{i}');
				}
			});
		},
		myList() {
			return this.CourseList.map(course => {
				let { applyNum, cover } = course;
				applyNum = +applyNum;
				return Object.assign(
					{
						calcuNum: applyNum > 9999 ? Math.round(applyNum / 10000 * 10) / 10 + '万' : applyNum,
						compressCover: config.res + cover + store.getters.imgPostfix + 300,
					},
					course
				);
			});
		},
	},
	components: {},
};
</script>
<style scoped>
/* .liveMore start */
.liveMuch s.active {
	text-decoration: line-through;
	color: red;
	display: inline-block;
}
.liveMore {
	width: 750rpx;
	height: auto;
	padding: 0 29rpx 0 29rpx;
	background: #fff;
}
.liveMore_classView {
	padding-left: 0;
	text-align: left;
	margin-bottom: 39rpx;
	display: flex;
	width: 100%;
	height: 181rpx; /* 168rpx; */
	border-radius: 6rpx;
	overflow: hidden;
	border-radius: 0;
	background-color: transparent;
}
.liveMore_classView::after {
	border-radius: 0;
	border: none;
}
.liveMore_classViewImg {
	position: relative;
	flex: 0 0 300rpx;
	margin-right: 32rpx;
	height: 100%;
	/* border-radius: 6rpx; */
	overflow: hidden;
	position: relative;
	/* margin-top: 8rpx; */
}
.classViewDetail {
	display: flex;
	flex: 1;
	height: 100%;
	flex-direction: column;
	justify-content: space-between;
}
.people_num {
	position: relative;
	top: 0rpx;
	/* overflow: hidden; */
	padding-right: 21rpx;
	display: flex;
	flex: 1;
	justify-content: space-between;
	flex-direction: column;
}
.classViewImg_i {
	position: absolute;
	width: 100%;
	height: 50rpx;
	line-height: 50rpx;
	color: #fff;
	bottom: 0;
	left: 0;
	font-size: 22rpx;
	border-radius: 0 6rpx 6rpx 0;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	padding-left: 20rpx;
	background: linear-gradient(
		to bottom,
		RGBA(0, 0, 0, 0) 0%,
		RGBA(0, 0, 0, 0.1) 20%,
		RGBA(0, 0, 0, 0.5) 70%,
		RGBA(0, 0, 0, 0.7) 100%
	);
}
.classView_P {
	width: 342rpx;
	font-size: 34rpx;
	font-family: PingFangSC-Regular;
	color: #303943;
	/* font-weight: bold; */
	line-height: 44rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	margin-bottom: 13rpx;
	margin-top: -5rpx;
}
.classView_span {
	/* margin-right: 10rpx; */
	float: left;
	max-width: 350rpx;
	line-height: 40rpx;
	font-size: 28rpx;
	font-family: PingFangSC-Regular;
	color: rgba(161, 161, 163, 1);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
/* .livePeple_span {
	float: left;
	font-size: 28rpx;
	color: rgba(161, 161, 163, 1);
	line-height: 40rpx;
} */
.line {
	display: inline-block;
	width: 3rpx;
	height: 20rpx;
	background-color: #a1a1a3;
	margin: 0 10rpx;
}
.classView_now {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	/* background: rgba(0, 0, 0, 0.3); */
}
.classView_now_img {
	position: absolute;
	right: 10rpx;
	top: 10rpx;
	width: 104rpx;
	height: 36rpx;
}
.classView_now_msg {
	position: absolute;
	left: 58rpx;
	bottom: 5rpx;
	font-size: 26rpx;
	color: rgba(255, 255, 255, 1);
	line-height: 38rpx;
}
.classView_now_btn {
	position: absolute;
	right: 15rpx;
	bottom: 11rpx;
	width: 120rpx;
	height: 42rpx;
	line-height: 44rpx;
	background: rgba(24, 177, 42, 1);
	font-size: 24rpx;
	color: rgba(255, 255, 255, 1);
	text-align: center;
}

.classViewImgTop {
	width: 88rpx;
	height: 40rpx;
	position: absolute;
	left: 0rpx;
	top: 0rpx;
	color: #fff;
	font-size: 22rpx;
	line-height: 30rpx;
}
.classViewImgTop img {
	width: 100%;
	height: 100%;
}
.liveMuch {
	font-size: 28rpx;
	font-family: SFProText-Medium;
	color: rgba(245, 68, 54, 1);
	line-height: 30rpx;
	font-weight: 600;
}
.calGreen {
	color: #10c826;
}
.calRed {
	color: #f54436;
}
.courseend {
	position: absolute;
	width: 100%;
	height: 100%;
	left: 0;
	bottom: 0;
	color: #ffffff;
	text-align: center;
	font-size: 28rpx;
	padding-top: 80rpx;
	background: rgba(0, 0, 0, 0.5);
}
.gif {
	position: absolute;
	bottom: 11rpx;
	left: 15rpx;
}
/*蒙版*/
.liveMoreMask {
	position: absolute;
	top: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.5);
	width: 100%;
	height: 100%;
}
.colorGrop {
	color: #a1a1a3;
}
.grayDrop {
	width: 100rpx;
	line-height: 36rpx;
	color: #fff;
	text-align: center;
	font-size: 24rpx;
	border-radius: 5rpx;
	background: #a1a1a3;
}
.bottom_box {
	position: absolute;
	/* padding-bottom: 10rpx; */
	left: 0;
	right: 0;
	bottom: 0;
	height: 75rpx;
	/* border-radius: 0 0 12rpx 12rpx; */
	background: linear-gradient(
		to bottom,
		RGBA(0, 0, 0, 0) 0%,
		RGBA(0, 0, 0, 0.1) 20%,
		RGBA(0, 0, 0, 0.5) 70%,
		RGBA(0, 0, 0, 0.7) 100%
	);
}
.left_top_img {
	position: absolute;
	top: 10rpx;
	right: 10rpx;
	width: 104rpx;
	height: 36rpx;
	line-height: 36rpx;
	background: rgba(0, 0, 0, 0.5);
	border-radius: 18rpx;
	color: #fff;
	font-size: 22rpx;
	display: flex;
	flex: 1;
	text-align: center;
}
.leftTopBg {
	background: #fff;
	border-radius: 50%;
	width: 8rpx;
	height: 8rpx;
	margin: 15rpx 8rpx 0 10rpx;
	display: -webkit-box;
}
.leftTopText {
	display: -webkit-box;
}
.recomApplyNum {
	font-size: 28rpx;
	color: rgba(161, 161, 163, 1);
	line-height: 40rpx;
	max-height: 80rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}
/* .liveMore end */
</style>
