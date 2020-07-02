<template>
  <div>
	<van-grid :column-num="1" :border="false">
		<van-grid-item  icon="" text="第一步：创建影院->授权麦克风->授权获取桌面" />
		<van-grid-item  icon="" text="第二步：进入影院->点击右上角“分享观影码”->发送给朋友" />
		<van-grid-item  icon="" text="第三步：朋友点开链接->授权麦克风->输入观影码->成功加入房间" />
		<van-grid-item  icon="" text="第四步：边聊边观影" />
	</van-grid>
    <Tabbar v-bind:active="active"/>
    
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import Tabbar from '@/components/Tabbar.vue'
export default {
  name: 'Home',
  components: {
    Tabbar
  },
  data() {
    return {
      active:2,
    }
  },
  methods: {
  }
}
</script>
