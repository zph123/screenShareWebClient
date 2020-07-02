<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <van-cell-group>
      <van-cell v-for="(value, key) in getRoomList" :key="key" :title="'影院'+key+'号'"  value="内容" label="描述信息" v-on:click="joinroom(key)" />
    </van-cell-group>

    <Tabbar v-bind:active="active"/>
    
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import Tabbar from '@/components/Tabbar.vue'
import websocket from '../assets/js/websocket.js';
import Vue from 'vue';
import { Panel } from 'vant';

Vue.use(Panel);
import { Cell, CellGroup } from 'vant';

Vue.use(Cell);
Vue.use(CellGroup);
export default {
  name: 'Home',
  components: {
    Tabbar
  },
  data() {
    return {
      active:0,
      getRoomList:this.$store.state.getRoomList
    }
  },
  mounted() {
    if(!this.$store.state.ws) {
      this.ws = websocket.init();
      this.$store.state.ws=this.ws
      const sendMessage={'type':'getRoomList'}
      websocket.onopen(this.ws,sendMessage)
      websocket.onmessage(this.ws,this)
    }else{
      this.ws = this.$store.state.ws
      let sendMessage={'type':'getRoomList'}
      sendMessage=JSON.stringify(sendMessage)
      websocket.onmessage(this.ws,this)
      this.ws.send(sendMessage);
    }
  },
  methods: {
    joinroom:function(event){
      this.$router.push({
          name: 'JoinRoom',
          query: {
            roomId: event
          }
        })
    },
    getRoomListCallback(reciveMessage){
      console.log(reciveMessage)
      this.getRoomList=reciveMessage.data
      // this.$store.state.getRoomList=reciveMessage.data
    },

  }
}
</script>
