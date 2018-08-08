<template>
	<view class="contain">
		<RecommendCourse :CourseList="courseList" :myNewCouse='true'></RecommendCourse>
		<view v-if="addMore && !isNoCourse">
			<Load></Load>
		</view>
		<view class='foot' v-if="isend" style="background:#f3f3f3">
			— 我是有底线的 —
		</view>
		<!-- 没有课程的展示 -->
		<view class="courseDown" v-show="isNoCourse && !addMore">
			<view class="courseDown-main">
				<view class="courseDown-img"><img src="/static/images/nocourse.png" alt=""></view>
				<p>你还未报名课程，快去报名一个课程试试呀。</p>
				<a @click="page">去逛逛</a>
			</view>
		</view>
	</view>
</template>
<script>
import { getMyCourse } from '@/services/user';
import Load from '@/components/loadings';
import RecommendCourse from '@/components/recommendCourse';
import store from '@/store';
import navigateTo from '@/utils/navigator';
import { parseTime } from '@/utils';
export default {
	data() {
		return {
			courseList: [],
			pageNo: 1,
			pageSize: 8,
			addMore: false,
			isend: false,
			isNoCourse: false,
		};
	},
	components: {
		Load,
		RecommendCourse,
	},
	computed: {
		auth() {
			return store.getters.auth;
		},
		timeFilter1() {
			return this.courseList.map(s => {
				if (s.liveStartTime) {
					return parseTime(+s.liveStartTime, '{y}年{m}月{d}日  {h}:{i}');
				}
			});
		},
	},
	onPullDownRefresh() {
		this.pageNo = 1;
		this.getCourseList();
	},
	onReachBottom() {
		if (!this.isend) {
			this.addMore = true;
			this.getCourseList(++this.pageNo);
		}
	},
	onShow() {
		this.pageNo = 1;
		// 次页面禁止分享
		wx.hideShareMenu({});
	},
	methods: {
		async getCourseList(pageNo = 1) {
			try {
				let res = await getMyCourse({
					pageNo: pageNo,
					pageSize: this.pageSize,
				});
				//滚动加载功能
				this.courseList.splice(
					pageNo == 1 ? 0 : this.courseList.length,
					pageNo == 1 ? this.courseList.length : 0,
					...res.data.data
				);
				if (this.courseList.length == 0) {
					this.isNoCourse = true;
				} else {
					this.isNoCourse = false;
				}
				wx.hideLoading();
				wx.stopPullDownRefresh();
				if (this.courseList.length >= res.data.total) {
					this.isend = true;
					this.addMore = false;
				} else {
					this.isend = false;
				}
			} catch (e) {
				e && e.status == 2 && wx.navigateBack({ delta: 1 });
			}
		},
		jump(id, status, unshelve) {
			if (status == 1 && unshelve != 0) {
				navigateTo('live', {
					courseId: id,
				});
			} else {
				navigateTo('courseDetail', {
					courseId: id,
				});
			}
		},
		page() {
			navigateTo('index', {}, 2);
		},
	},
	mounted() {
		wx.showLoading({
			title: '加载中',
		});
		this.getCourseList();
	},
};
</script>
<style>
view {
	box-sizing: border-box;
}
img {
	width: 100%;
	height: 100%;
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
.classView {
	width: 690rpx;
	height: 200rpx;
	margin: 0 0 30rpx 30rpx;
	position: relative;
}
.classViewImg {
	width: 300rpx;
	height: 200rpx;
	border-radius: 10rpx;
	float: left;
	position: relative;
	margin-right: 30rpx;
	overflow: hidden;
}
.classViewImg .time {
	width: 100%;
	height: 40rpx;
	line-height: 40rpx;
	color: #fff;
	position: absolute;
	bottom: 0rpx;
	padding-left: 10rpx;
	font-size: 22rpx;
	background: linear-gradient(to bottom, rgba(239, 239, 239, 0) 0%, rgba(102, 102, 102, 0.8) 100%);
}
.course-text {
	float: left;
	width: 360rpx;
	height: 100%;
	position: relative;
}
.course-text p {
	line-height: 38rpx;
	font-size: 28rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}
.course-text > span {
	height: 25rpx;
	padding-top: 25rpx;
	font-size: 24rpx;
	color: #aaaaaa;
}
.course-text .num {
	color: #787878;
	font-size: 24rpx;
	position: absolute;
	bottom: 0;
	left: 0;
}
.num span {
	color: #333333;
}
.liveMore {
	width: 750rpx;
	height: auto;
	margin-top: 15rpx;
	background: #fff;
	padding-bottom: 1rpx;
}
.classViewImgTop {
	width: 72rpx;
	height: 30rpx;
	position: absolute;
	left: 0;
	top: 0;
	color: #fff;
	font-size: 22rpx;
	line-height: 30rpx;
	padding-left: 10rpx;
}
.classViewImgTop img {
	position: absolute;
	top: 0;
	left: -2rpx;
	z-index: 2;
}
.classViewImgTop span {
	position: relative;
	z-index: 10;
}
.foot {
	width: 750rpx;
	height: 70rpx;
	line-height: 70rpx;
	color: #aaaaaa;
	font-size: 24rpx;
	text-align: center;
	position: absolute;
	bottom: 0;
}
page {
	height: 100%;
}
.contain {
	min-height: 100%;
	position: relative;
	padding-bottom: 70rpx;
	border-top: 1px solid #eee;
	padding-top: 25rpx;
}
.classView_now {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
}
.courseDown {
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	background: #ffffff;
	z-index: 100;
	padding-top: 250rpx;
}
.courseDown .courseDown-img {
	width: 150rpx;
	height: 150rpx;
	margin: 0 auto;
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

