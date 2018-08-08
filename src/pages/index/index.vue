<template>
	<view class="liveIndex">
		<!-- 我的直播预告 -->
		<view class='liveClass' v-if="auth && ListFreeCourse.length>0">
			<view class='liveMore-title' style="overflow:hidden">
				<span class="liveClassTitle_big">今日直播课表</span>
				<span class="liveMore" @click="myCourse">查看更多<img src="/static/images/icon_gd@2x.png" /></span>
			</view>
			<swiper :next-margin="nextMargin+'rpx'" :previous-margin="previousMargin+'rpx'" duration='300' :current="current" @change="marginChange" :class="ListFreeCourse.length == 1 ? 'swiperOne' :'swiper'">
				<swiper-item v-for=" (item,index) in ListFreeCourse " :key='index' :class="[ListFreeCourse.length==1 ? 'liveCourseOne' : ''] ">
					<view :class="ListFreeCourse.length==1 ? 'classView100' : 'classView'">
						<form report-submit :data-courseId="item.courseId " class="form_box ">
							<button @click="getGoto(item) " form-type="submit " class="liveMore_classView ">
								<!-- :class="[ListFreeCourse.length == 1 ? 'height414' : 'classViewImg']" -->
								<view :class="[ListFreeCourse.length == 1 ? 'height414' : 'classViewImg']" :style="{background: 'url('+imgCdn+item.cover +width+ ') no-repeat center', 'background-size': ' 100% 100%'} ">
									<view class="left_top_img">
										<i class="leftTopBg"></i>
										<view class="leftTopText">直播课</view>
									</view>
									<!-- 直播课 -->
									<view class="bottom_box ">
										<!-- <p class="right_bottom_btn " :data-item="item ">进入教室</p> -->
										<view class="left_bottom_text " v-if='item.status==1'>
											<view class="animate ">
												<img src=" /static/images/1.gif ">
											</view>
											<span class="num">正在上课</span>
										</view>
										<view class="left_bottom_text">
											<span v-if='item.status==3'>直播时间：{{timeFilter[index]}}</span>
										</view>
									</view>
								</view>
								<view class="courseTitle ">
									{{item.courseName}}
								</view>
							</button>
						</form>
					</view>
				</swiper-item>
			</swiper>

		</view>
		<!-- 精品推荐 -->
		<view>
			<view class="liveMore-title " v-if="allCourseList.length> 0">精品推荐</view>
			<RecommendCourse :CourseList="allCourseList"></RecommendCourse>
		</view>
		<!-- 页面加载 -->
		<Load v-if=" loadMore "></Load>

		<view style="flex:1;position:relative;margin-top:60rpx; ">
			<view class='foot' v-if="isEnd ">
				— 别扯了，已经到底了 —
			</view>
		</view>
	</view>

</template>
<script>
import Load from '@/components/loadings';
import RecommendCourse from '@/components/recommendCourse';
import { getMyLiveCourse } from '@/services/user';
import { parseTime } from '@/utils/index';
import { getRecommendCourseList } from '@/services/course';
import navigateTo from '@/utils/navigator';
import store from '@/store';
import config from '@/utils/env';
export default {
	data() {
		return {
			current: 0,
			// previousMargin: 30,
			// nextMargin: 169,
			imgCdn: config.res + '/',
			allCourseList: [], //精品课程
			pageSize: 8,
			pageNo: 1,
			loadMore: true,
			isEnd: false,
			total: 0,
			scrollLeft: 0,
			scrollTop: 0,
			ListFreeCourse: [], //我的直播预告
			width: store.getters.imgPostfix + 550, //'?x-oss-process=image/resize,m_mfit,w_' + Math.ceil(690 / store.getters.ratio),
			myTotal: 0,
			scrollTopHeight: 0,
		};
	},
	methods: {
		// 我的课表，更多
		myCourse() {
			navigateTo('myCourse');
		},
		// 点击课程跳转
		getGoto: function(x) {
			navigateTo(x.status === 1 ? 'live' : 'courseDetail', {
				courseId: x.courseId,
			});
		},
		//我的直播预告
		async CourseMyLive(pageNo = 1) {
			if (!this.auth) return;
			let pageSize = this.pageSize;
			let res = await getMyLiveCourse({
				pageNo: pageNo,
				pageSize,
			});
			let { data, total } = res.data;
			// total = 1;
			console.log(total);
			this.total = total;
			if (pageNo == 1) {
				this.ListFreeCourse = data;
			} else {
				this.ListFreeCourse.push(...data);
			}
			// this.ListFreeCourse.length = 1;
			if (pageNo * pageSize < total) {
				this.CourseMyLive(pageNo + 1);
			}
		},

		// 推荐课程列表
		async getRecommend(pageNo = 1) {
			try {
				let res = await getRecommendCourseList({
					pageNo: pageNo,
					pageSize: this.pageSize,
				});
				let total = res.data.total;
				this.allCourseList.splice(
					pageNo == 1 ? 0 : this.allCourseList.length,
					pageNo == 1 ? this.allCourseList.length : 0,
					...res.data.data
				);
				if (this.allCourseList.length == total) {
					this.loadMore = false;
					this.isEnd = true;
				}
				wx.stopPullDownRefresh();
			} catch (e) {
				wx.pageScrollTo({
					scrollTop: this.scrollTopHeight - 100,
					duration: 10,
				});
				this.loadMore = false;
			}
		},
		marginChange: function(e) {
			this.current = e.target.current;
		},
	},
	onPageScroll(e) {
		this.scrollTopHeight = e.scrollTop;
		// console.log(this.scrollTopHeight);
	},
	//监听页面到底上拉加载
	onReachBottom() {
		if (!this.isEnd) {
			this.loadMore = true;
			this.pageNo = Math.ceil(this.allCourseList.length / this.pageSize);
			this.getRecommend(++this.pageNo);
		}
	},
	//下拉刷新页面
	onPullDownRefresh() {
		this.CourseMyLive();
		this.getRecommend();
		this.isEnd = false;
		this.loadMore = true;
		// this.current = 0;
	},
	components: {
		RecommendCourse,
		Load,
	},
	onShow() {
		this.loadMore = true;
		this.isEnd = false;
		this.current = 0;
		// if (this.current == 0) {
		// 	this.previousMargin = 30;
		// 	this.nextMargin = 169;
		// }
		// this.pageNo = 1;
		this.CourseMyLive();
		this.getRecommend();
		wx.pageScrollTo({
			scrollTop: 0,
			duration: 10,
		});
		wx.setNavigationBarTitle({
			title: '潭州课堂',
		});
	},
	computed: {
		// 是否登录
		auth() {
			return store.getters.auth;
		},
		timeFilter() {
			return this.ListFreeCourse.map(i => {
				if (i.liveStartTime) {
					return parseTime(i.liveStartTime, '{m}.{d} {h}:{i}');
				}
			});
		},
		previousMargin() {
			let total = this.total;
			let current = this.current;
			// console.log(current, total);
			if (total < 1) return 0;
			if (current == 0) return 30;
			if (current == total - 1) return 200;
			return 100;
		},

		nextMargin() {
			let total = this.total;
			let current = this.current;
			if (total < 1 || current == total - 1) return 0;
			if (current == 0) return 170;
			return 100;
		},
	},
	mounted() {
		let query = this.$mp.query;
		let { page, params } = query;
		if (page && page != 'index') {
			params = JSON.parse(params);
			navigateTo(page, params);
		}
	},
};
</script>
<style scoped>
/* 隐藏滚动条 */
/* ::-webkit-scrollbar {
	width: 0;
	height: 0;
	color: transparent;
} */
view {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
	font-family: PingFangSC-Regular;
}
label {
	font-family: PingFangSC-Regular;
}
img {
	border: none;
}
.static {
	border-bottom: 15rpx solid #f3f3f3;
}
img {
	width: 100%;
	height: 100%;
}
.animate {
	display: inline-block;
	width: 30rpx;
	height: 32rpx;
	vertical-align: -8rpx;
}
.living_mask {
	width: 100%;
	height: 100%;
	background: rgba(1, 8, 35, 0.3);
}
.left_bottom_text .num {
	position: absolute;
	left: 43rpx;
	top: 7rpx;
}
.animate .music {
	width: 100%;
	height: 100%;
	top: 10rpx;
	left: 50rpx;
	/* bottom: 0; */
}
/* category_wrapper */
.category_wrapper {
	display: flex;
	padding: 32rpx 0 25rpx 29rpx;
	justify-content: flex-start;
	width: 100%;
	border-bottom: 1px solid #e5e5e5;
}
.category_item {
	width: 122rpx;
	margin-right: 22rpx;
	text-align: center;
}
.category_item:last-child {
	margin-right: 0;
}
.category_item_img {
	display: inline-block;
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background-color: #00c750;
}
.category_item .all {
	display: inline-block;
	background: url('../../../static/images/icon_qblm@2x.png') no-repeat center #afb5bd;
	background-size: 36rpx 36rpx;
}
.category_item_text {
	color: rgba(48, 57, 67, 1);
	font-size: 24rpx;
	overflow: hidden;
	font-weight: 600;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.tabView {
	height: 100rpx;
	width: 100%;
	overflow: hidden;
	z-index: 10;
	position: sticky;
	top: -1px;
}
.courseDown-img {
	width: 150rpx;
	height: 150rpx;
	margin: 0 auto;
	padding-bottom: 100rpx;
}
.banner_img {
	height: 350rpx;
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
.classBtn_img1 {
	width: 46rpx;
	height: 39rpx;
}
.classBtn_img2 {
	width: 42rpx;
	height: 39rpx;
}
.clear {
	clear: both;
}
.none {
	display: none;
}
.banner {
	width: 750rpx;
	height: 350rpx;
	background-color: #f3f3f3;
}

/* liveClass */
.liveClass {
	width: 750rpx;
	height: auto;
	background: #fff;
	border-top: 1px solid #e5e5e5;
	border-bottom: 30rpx solid #f3f5f7;
}
.liveClassTitle {
	margin: 0 0 0 29rpx;
	font-size: 28rpx;
	color: #a1a1a3;
}
.liveClassTitle_big {
	font-family: PingFangSC-Medium;
	font-size: 36rpx;
	color: #303943;
	margin-bottom: 5rpx;
	font-weight: bolder;
}
.form_box {
	/* width: 620rpx; */
	width: 100%;
	display: block;
	position: relative;
}
.liveMore-title {
	margin: 34rpx 0 35rpx 29rpx;
	/* width: 100%; */
	font-size: 42rpx;
	font-family: PingFangSC-Medium;
	color: rgba(48, 57, 67, 1);
	font-weight: bolder;
}
.classView_wrapper {
	display: flex;
	padding-left: 30rpx;
	padding-bottom: 26rpx;
	width: 100%;
	white-space: nowrap;
	border-bottom: 31rpx solid #f3f5f7;
	overflow: hidden;
}
.classView {
	vertical-align: top;
	position: relative;
	display: inline-block;
	width: 520rpx;
	/* width: 100%; */
}
.classView100 {
	width: 100%;
}
.height414,
.classViewImg {
	position: relative;
	padding: 0;
	width: 100%;
	text-align: left;
	border-radius: 10rpx;
}
.height414 {
	height: 414rpx;
}
.classViewImg {
	height: 312rpx;
}
.bottom_box {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: 75rpx;
	border-radius: 0 0 10rpx 10rpx;
	background: linear-gradient(
		to bottom,
		RGBA(0, 0, 0, 0) 0%,
		RGBA(0, 0, 0, 0.1) 20%,
		RGBA(0, 0, 0, 0.5) 70%,
		RGBA(0, 0, 0, 0.7) 100%
	);
}
.classView_text {
	padding: 0;
	display: block;
	/* width: 620rpx; */
	width: 100%;
	height: 92rpx;
	font-size: 34rpx;
	color: rgba(48, 57, 67, 1);
	line-height: 48rpx;
	text-align: left;
	font-weight: 600;
	white-space: normal;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	background-color: transparent;
}
.classView_text::after {
	border: none;
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
	/* justify-content: space-between; */
	flex: 1;
	/* flex-direction: column; */
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
	/* margin: -29rpx 0 0 26rpx; */
	display: -webkit-box;
}
.right_bottom_btn {
	position: absolute;
	/* padding: 5rpx 0; */
	box-sizing: border-box;
	right: 13rpx;
	bottom: 13;
	width: 150rpx;
	height: 64rpx;
	line-height: 65rpx;
	font-size: 28rpx;
	color: #ffffff;
	text-align: center;
	border: 0;
	background-color: #18b12a;
}
.right_bottom_btn:after {
	border: none;
}
.free {
	text-align: left;
	padding-left: 20rpx;
}
.order_btn {
	/* bottom: 133rpx; */
	border-radius: 0;
}
.right_bottom_btn_img {
	position: absolute;
	right: 13rpx;
	bottom: 15rpx;
	width: 30rpx;
	height: 30rpx;
	border-radius: 50%;
	background: url('../../../static/images/icon_jt@2x.png') no-repeat center;
	background-size: 30rpx 30rpx;
}
.left_bottom_text {
	position: absolute;
	left: 14rpx;
	bottom: 0;
	width: 420rpx;
	font-size: 28rpx;
	color: rgba(255, 255, 255, 1);
	white-space: normal;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
}
.foot {
	width: 100%;
	height: 70rpx;
	line-height: 70rpx;
	color: #aaaaaa;
	background: #f3f3f3;
	font-size: 24rpx;
	text-align: center;
	position: absolute;
	bottom: 0;
	left: 0;
}
/*加载*/
/* .loading {
	color: #a1a1a3;
	text-align: center;
	padding: 30rpx 0;
	margin-left: -45rpx;
	font-size: 30rpx;
}
.loading img {
	width: 52rpx;
	height: 52rpx;
	vertical-align: -14rpx;
	margin-right: 12rpx;
} */
/* 只有一个直播预告课程时 - 展示 */
.liveCourseOne {
	width: 690rpx;
	/* height: 414rpx; */
}
.liveMore_classView {
	padding-left: 0;
	padding-right: 0;
	text-align: left;
	width: 100%;
	border-radius: 6rpx;
	overflow: hidden;
	border-radius: 0;
	background-color: transparent;
}
.liveMore_classView::after {
	border-radius: 0;
	border: none;
}
.courseTitle {
	font-size: 32rpx;
	line-height: 48rpx;
	height: 48rpx;
	/* white-space: pre-line; */
	margin-top: 26rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	/* display: -webkit-box; */
	/* -webkit-box-orient: vertical; */
	/* -webkit-line-clamp: 2; */
}
.liveIndex {
	display: flex;
	min-height: 100%;
	flex-direction: column;
}
.liveMore {
	float: right;
	font-size: 28rpx;
	color: #a1a1a3;
	margin-right: 31rpx;
	margin-top: 15rpx;
}
.liveMore img {
	width: 13rpx;
	height: 25rpx;
	vertical-align: -1rpx;
}
.swiper {
	height: 385rpx;
	padding-bottom: 25rpx;
}
.swiperOne {
	height: 504rpx;
	margin-right: 30rpx;
}
</style>

