<template>
	<view class='liveMore' :class="allCourseList.length<6?'Height':''" id='classBox'>
		<RecommendCourse :CourseList='allCourseList'></RecommendCourse>
		<Load v-if="loadMore"></Load>
		<view class='foot' v-if="isEnd">
			— 别扯了，已经到底了 —
		</view>
	</view>
</template>
<script>
import { getCourseList } from '@/services/course';
import Load from '@/components/loadings';
import RecommendCourse from '@/components/recommendCourse';
import { parseTime } from '@/utils/index';
import navigateTo from '@/utils/navigator';
export default {
	data() {
		return {
			allCourseList: [], //所有课程
			loadMore: true, //下拉加载更多动画
			isEnd: false, //我的底线
			pageSize: 8,
			goUrl: navigateTo,
		};
	},
	components: { Load, RecommendCourse },

	//下拉刷新页面
	onPullDownRefresh() {
		this.isEnd = false;
		this.loadMore = true;
		this.getRecommend();
	},
	//监听页面到底上拉加载
	onReachBottom() {
		if (!this.isEnd && !this.isOpen) {
			this.pageNo = Math.ceil(this.allCourseList.length / this.pageSize);
			this.getRecommend(++this.pageNo);
		}
	},
	methods: {
		//推荐课程列表
		async getRecommend(pageNo = 1) {
			try {
				let res = await getCourseList({
					pageNo: pageNo,
					pageSize: this.pageSize,
					categoryId: this.$root.$mp.query.categoryId,
					level: this.$root.$mp.query.level,
				});
				let total = res.data.total;
				this.allCourseList.splice(
					pageNo == 1 ? 0 : this.allCourseList.length,
					pageNo == 1 ? this.allCourseList.length : 0,
					...res.data.data
				);
				if (this.allCourseList.length >= total) {
					this.loadMore = false;
					this.isEnd = true;
				}
				wx.stopPullDownRefresh();
			} catch (e) {
				this.loadMore = false;
			}
		},
	},
	onUnload() {
		this.isEnd = false;
		this.loadMore = true;
	},
	onShow() {
		wx.setNavigationBarTitle({
			title: this.$root.$mp.query.name,
		});
	},
	mounted() {
		wx.showLoading({
			title: '加载中...',
			mask: true,
		});
		wx.setNavigationBarTitle({
			title: this.$root.$mp.query.name,
		});
		this.getRecommend().finally(() => wx.hideLoading());
	},
	computed: {
		timeFilter() {
			return this.allCourseList.map(i => {
				if (i.latelyLivingTime) {
					return parseTime(i.latelyLivingTime, '{m}.{d} {h}:{i}');
				}
			});
		},
	},
};
</script>

<style scoped>
img {
	width: 100%;
	height: 100%;
}

.classViewDetail {
	width: 360rpx;
	height: 200rpx;
	float: right;
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
.classViewImg .classViewImg_i {
	width: 100%;
	height: 20rpx;
	line-height: 20rpx;
	color: #fff;
	display: inline-block;
	position: absolute;
	bottom: 0rpx;
	left: 0rpx;
	font-size: 22rpx;
	padding: 10rpx 0 10rpx 5rpx;
	background: linear-gradient(to bottom, rgba(242, 242, 242, 0) 0%, rgba(102, 102, 102, 0.8) 100%);
}
.classView .classView_P {
	width: 360rpx;
	line-height: 38rpx;
	font-size: 32rpx;
	float: left;
	font-weight: bold;
	color: #333333;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}
.classView .classView_span {
	width: 360rpx;
	padding-top: 15rpx;
	font-size: 24rpx;
	color: #aaaaaa;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	overflow: hidden;
}
.classView .classView_now {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
}
.livePeple {
	height: 40rpx;
	line-height: 40rpx;
	font-size: 26rpx;
	position: absolute;
	bottom: 0;
	left: 330rpx;
	text-align: left;
	color: #787878;
}
.livePeple_span {
	color: #333333;
}

.classViewImgTop {
	width: 62rpx;
	height: 30rpx;
	position: absolute;
	left: 0;
	top: 0;
	color: #fff;
	font-size: 22rpx;
	line-height: 30rpx;
	padding-left: 10rpx;
}
.liveOver {
	position: absolute;
	right: 10rpx;
	bottom: 0;
	color: #00c750;
	font-size: 26rpx;
}
.liveMuch {
	position: absolute;
	right: 10rpx;
	bottom: 0;
	color: #ff2f19;
	font-size: 26rpx;
}

.flex-wrp {
	margin-bottom: 30rpx;
}

.flex-wrp .flex-item {
	display: flex;
	justify-content: center;
	height: 74rpx;
	width: 209rpx;
	align-content: center;
	background-color: #f5f7fa;
	line-height: 74rpx;
	margin-top: 30rpx;
	font-size: 28rpx;
	color: #303943;
	border-radius: 10rpx;
	font-weight: 500;
}

.flex-wrp .flex-item:nth-child(3n-1) {
	margin-left: 30rpx;
	margin-right: 30rpx;
}

.liveMore {
	width: 750rpx;
	/* height: 100vh; */
	background: #fff;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	border-top: 1px #e5e5e5 solid;
	padding-top: 52rpx;
	box-sizing: border-box;
}
.Height {
	height: 100%;
}
.liveClassTitle {
	height: 41rpx;
	line-height: 41rpx;
	padding-left: 37rpx;
	padding-bottom: 52rpx;
	color: #303943;
	font-size: 42rpx;
	font-weight: bold;
}

.foot {
	width: 750rpx;
	height: 35px;
	line-height: 35px;
	color: #aaaaaa;
	background: #f3f3f3;
	font-size: 24rpx;
	text-align: center;
}
</style>
