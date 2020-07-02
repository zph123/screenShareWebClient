<template>
  <div class="hello">
	<van-tabbar v-model="active" active-color="red" inactive-color="white" style="background-color: black">
		<van-tabbar-item icon="wap-home" url="/">首页</van-tabbar-item>
		<van-tabbar-item icon="live" url="/createroom">创建影院</van-tabbar-item>
		<van-tabbar-item icon="column" url="/introduction">使用说明</van-tabbar-item>
<!-- 		<van-tabbar-item icon="setting-o">标签</van-tabbar-item> -->
	</van-tabbar>
  </div>
</template>

<script>
import Vue from 'vue';
import { Tabbar, TabbarItem } from 'vant';
Vue.use(Tabbar);
Vue.use(TabbarItem);
export default {
  name: 'Tabbar',
  data() {
    return {
      // active: 0
    }
  },
  props: {
    active: Number
  }
}
</script>

