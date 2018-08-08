<template>
    <!-- 没有课程展示效果 -->
    <view class="courseDown">
      <view class="courseDown-main">
        <view class="courseDown-img"><img :src="imgsrc" alt=""></view>
        <p>{{title}}</p>
        <!-- <a href="/pages/index/index">去逛逛</a> -->
      </view>
    </view>
</template>

<script>
export default {
  props: ["imgsrc", "title"]
};
</script>

<style>
.courseDown {
  width: 100%;
  background: #ffffff;
}
.courseDown .courseDown-img {
  width: 150rpx;
  height: 150rpx;
  margin: 0 auto;
}
.courseDown-img > img {
  width: 150rpx;
  height: 150rpx;
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