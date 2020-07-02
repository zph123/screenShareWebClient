<template>
  <div>
	<van-swipe class="my-swipe"  :autoplay="3000" indicator-color="black">
		<van-swipe-item>
			远程投屏
		</van-swipe-item>
	</van-swipe>

	<van-grid :column-num="2">
		<van-grid-item icon="live" text="实时屏幕" />
		<van-grid-item icon="audio" text="语音聊天" />
		<van-grid-item icon="add-square" text="创建简单" />
		<van-grid-item icon="video" text="观看方便" />
	</van-grid>
	<br>
	<van-grid :column-num="1" :border="false">
		<van-grid-item  text="能做什么？" />
	</van-grid>
	<van-grid :column-num="2" :border="false">
		<van-grid-item  icon="new-arrival-o" text="与朋友一起观看电影" />
		<van-grid-item  icon="new-arrival-o" text="与同事分享屏幕工作" />
		<van-grid-item  icon="" text=" " />
		<van-grid-item  icon="" text=" " />
	</van-grid>
    <Tabbar v-bind:active="active"/>
  </div>
</template>
<style>
.my-swipe .van-swipe-item {
color: #000;
font-size: 70px;
line-height: 150px;
text-align: center;
background-color: #FCFCFC;
}
</style>
<script>
// @ is an alias to /src
import Tabbar from '@/components/Tabbar.vue'
import Vue from 'vue';
import { Swipe, SwipeItem } from 'vant';

Vue.use(Swipe);
Vue.use(SwipeItem);
import { Grid, GridItem } from 'vant';

Vue.use(Grid);
Vue.use(GridItem);
export default {
  name: 'Index',
  components: {
    Tabbar
  },
  data() {
    return {
      active:0,
    }
  },
  methods: {
  }
}
</script>
