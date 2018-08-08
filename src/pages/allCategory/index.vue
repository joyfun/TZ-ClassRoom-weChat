<template>
	<view class="container_wrapper" v-show="fristCategoryList.length>0">
		<scroll-view class="frist_category_left" :scroll-y='true'>
			<view class="frist_category_item" v-for="(item_frist,index) in fristCategoryList" :class="{frist_category_item_active:fristCategoryIndex == index}" :key='index' @click="switchFristCategory($event,index,item_frist.id,item_frist.name)" :data-FristCategoryIndex="index">{{item_frist.name}}</view>
		</scroll-view>
		<scroll-view class="second_category_right" :scroll-y="true">
			<view class="wrapper">
				<view v-for="(item,index) in secondCategoryList" :key="index" v-if="secondCategoryIndex==index" class="list_content">
					<view class="second_category_wrapper" v-for="(item_second,index1) in item" :key="index1">
						<view class="second_category_title" @click="goUrl('category',{categoryId:item_second.id,level:2,name:item_second.name})">{{item_second.name}}
							<view class="allCrouse_arrow"></view>
						</view>
						<view class="thrid_category_item" v-for="(item_thrid,index2) in item_second.children" :class="{thrid_category_item_active:thridCategoryIndex == item_thrid.id}" :key="index2" :data-thridindex="item_thrid.id" @click='switchThridCategory($event,item_thrid.id,item_thrid.name)'>{{item_thrid.name}}</view>
					</view>
				</view>

				<view class="allCrouse">
					<view class="allCrouse_btn" @click="allCrouse">
						<view class="allCrouse_text">查看全部课程</view>
						<view class="allCrouse_arrow all_arrow"></view>
					</view>
				</view>
			</view>

		</scroll-view>
	</view>
</template>
<script>
import { getCateList } from '@/services/cate';
import navigateTo from '@/utils/navigator';
export default {
	data() {
		return {
			fristCategoryList: [], //一级类目
			// secondCategoryList: [], //二级类目
			fristCategoryIndex: 0, //一级类目索引
			secondCategoryIndex: 0, //二级类目索引
			thridCategoryIndex: -1, //三级类目索引
			goUrl: navigateTo,
			fristCategoryId: '',
			fristCategoryName: '',
			winHeight: '',
		};
	},
	onShow() {
		this.getcategory();
		this.thridCategoryIndex = '';
	},
	methods: {
		allCrouse() {
			navigateTo('category', { categoryId: this.fristCategoryId, level: 1, name: this.fristCategoryName });
		},
		// 点击切换三级类目
		switchThridCategory($event, index2, name) {
			let eventIndex = $event.mp.target.dataset.thridindex;
			if (eventIndex == index2) {
				this.thridCategoryIndex = index2;
				navigateTo('category', { categoryId: index2, level: 3, name: name });
			}
		},
		// 点击一级类目切换
		switchFristCategory($event, index, id, name) {
			this.fristCategoryId = id;
			this.fristCategoryName = name;
			if (this.secondCategoryIndex != index) {
				this.secondCategoryIndex = index;
				let eventIndex = $event.mp.target.dataset.fristcategoryindex;
				if (eventIndex == index) {
					this.fristCategoryIndex = index;
				}
			}
		},
		// 获取分类
		async getcategory() {
			let res = await getCateList();

			this.fristCategoryList = res.data;
			// console.log(res.data);
			this.fristCategoryId = this.fristCategoryId || this.fristCategoryList[0].id;
			this.fristCategoryName = this.fristCategoryName || this.fristCategoryList[0].name;
			console.log(this.fristCategoryId);
		},
	},
	mounted() {},
	computed: {
		secondCategoryList() {
			// 获取二级类目数组
			return this.fristCategoryList.map((element, index) => {
				return element.children;
			});
		},
	},
};
</script>
<style>
view {
	box-sizing: border-box;
	font-family: SFProText-Regular;
}
.container_wrapper {
	width: 100%;
	height: 100%;
	display: flex;
	border-top: 1rpx solid #e5e5e5;
}
.pull_wrapper {
	display: flex;
}
.frist_category_left {
	height: 100%;
	flex: 0 0 174rpx;
	width: 174rpx;
	background-color: #f3f5f7;
}
.frist_category_item {
	/* padding: 0 35rpx; */
	width: 100%;
	height: 115rpx;
	line-height: 115rpx;
	font-size: 32rpx;
	font-family: SFProText-Medium;
	color: #303943;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	-webkit-line-clamp: 1;
	text-align: center;
}
.frist_category_item_active {
	color: #3073f4;
	background-color: #fff;
	font-weight: bold;
}
.second_category_right {
	flex: 1;
	padding-top: 36rpx;
	padding-left: 17rpx;
	/* padding: 27rpx 0 0 14rpx; */
	/* box-sizing: border-box;
	display: flex;
	flex-direction: column-reverse;
	justify-content: space-between; */
}
.wrapper {
	min-height: 100%;
	position: relative;
}
.list_content {
	padding-bottom: 150rpx;
}
.allCrouse {
	position: absolute;
	bottom: 0;
	left: 0;
	display: flex;
	/* margin-top: -108rpx; */
	margin-bottom: 47rpx;
	width: 100%;
	height: 68rpx;
	justify-content: center;
	font-size: 28rpx;
	color: #a1a1a3;
}
.allCrouse_btn {
	/* padding: 0 29rpx; */
	display: flex;
	width: 248rpx;
	height: 68rpx;
	line-height: 68rpx;
	align-items: center;
	justify-content: center;
	background: rgba(243, 245, 247, 1);
	border-radius: 10rpx;
}
.allCrouse_text {
	/* width: 161rpx; */
	height: 68rpx;
	line-height: 68rpx;
	text-align: center;
	/* overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	-webkit-line-clamp: 1; */
}
.allCrouse_arrow {
	margin-left: 12rpx;
	display: inline-block;
	width: 14rpx;
	height: 26rpx;
	background: url('../../../static/images/icon_11@2x.png') no-repeat center;
	background-size: 14rpx 26rpx;
}
.all_arrow {
	margin-left: 16rpx;
	display: inline-block;
	width: 12rpx;
	height: 22rpx;
	background: url('../../../static/images/icon_12@2x.png') no-repeat center;
	background-size: 12rpx 22rpx;
}
.second_category_wrapper {
	padding-top: 28rpx;
}
.second_category_title {
	margin-bottom: 25rpx;
	display: flex;
	align-items: center;
	font-size: 32rpx;
	font-weight: bold;
	color: rgba(48, 57, 67, 1);
}
.thrid_category_item {
	margin-right: 10rpx;
	margin-bottom: 5rpx;
	display: inline-block;
	width: 174rpx;
	height: 68rpx;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	-webkit-line-clamp: 1;
	line-height: 68rpx;
	border-radius: 10rpx;
	background: rgba(243, 245, 247, 1);
	/* border: 1rpx solid #a1a1a3; */
	text-align: center;
	font-size: 28rpx;
	color: rgba(48, 57, 67, 1);
}
.thrid_category_item_active {
	color: #3073f4;
}
</style>
