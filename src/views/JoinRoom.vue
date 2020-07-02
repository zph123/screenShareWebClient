<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
		<van-nav-bar v-if="joinStatus"
    v-bind:title="'影院'+roomId+'号'"
    left-text="退出"
    left-arrow
    @click-left="onClickOut"
    />
    <van-nav-bar v-else
		v-bind:title="'影院'+roomId+'号'"
		left-text="返回"
		left-arrow
		@click-left="onClickLeft"
		/>
    
    <div v-if="joinStatus">
      <van-row>
        <van-col span="4"></van-col>
        <van-col span="16"> 
          <!-- <div v-show="createStatus"> -->
            <van-row>
              <van-col span="24">
                <div style="text-align: center;">
                  音频
                  <br>
                  <audio id="remoteAudio" autoplay muted playsinline controls="" ref="remoteAudio" width="100%"></audio>
                </div>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="24"> 
                <div style="text-align: center;">
                  视频
                  <br>
                  <video id="remoteVideo" autoplay muted playsinline controls="" ref="remoteVideo" width="100%" style="max-height:400px"></video>
                </div>
              </van-col>
            </van-row>

            
            
          <!-- </div> -->
        </van-col>
        <van-col span="4"></van-col>
      </van-row>

      

    </div>
    <div v-else>
      <van-notice-bar :scrollable="false" left-icon="volume-o" >
        如果使用的是ios微信，点击右上角在浏览器中打开，其他用户请忽略。
      </van-notice-bar>
      <van-form validate-first @failed="onFailed"  @submit="onSubmit">
      <!-- 通过 pattern 进行正则校验 -->
      <van-field
        v-model="roomPwd"
        name="pattern"
        placeholder="6位数字的影院密码"
        :rules="[{ pattern, message: '请输入6位数字组成的密码' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">
          进入
        </van-button>
      </div>
    </van-form>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import websocket from '../assets/js/websocket.js';
import Vue from 'vue';
import { NavBar } from 'vant';
import { Form } from 'vant';
import { NoticeBar } from 'vant';

Vue.use(NoticeBar);
Vue.use(Form);

Vue.use(NavBar);
export default {
  name: 'Home',
  data() {
    return {
      roomPwd:'',
      pattern: /^\d{6}$/,
      ws:this.$store.state.ws,
      roomId:"0",
      joinStatus:false,
      pcConfig:null

    }
  },
  mounted(){
    if (process.env.VUE_APP_WEBRTC_PCCONFIG != '') {
      this.pcConfig = eval ("(" + process.env.VUE_APP_WEBRTC_PCCONFIG + ")");
    }
    console.log(typeof(this.$route.query.roomId))
    if (typeof(this.$route.query.roomId) != 'undefined') {
        this.roomId = this.$route.query.roomId
    }
    
    this.gotAudioStream()
    if (!this.$store.state.ws) {
      this.ws = websocket.init();
      websocket.onmessage(this.ws,this)
    }else{
      websocket.onmessage(this.ws,this)
    }
    
  },
  methods: {
    gotAudioStream(){
      // alert(123)
       navigator.mediaDevices.getUserMedia({video: false, audio: true}).then(stream => 
        {
          this.localAudioStream=stream
        },error => {console.log(error);});
    },
    onClickLeft(){
      this.$router.push('/')
    },
    onClickOut(){
      const sendMessage = {'type':'joinerOutRoom'}
      websocket.send(this.ws,sendMessage)
      this.$router.push('/')
    },
    onSubmit(values) {
      console.log('submit', values);
      console.log(this.ws)
      const sendMessage = {'type':'joinRoom','data':{'roomId':this.roomId,'roomPwd':this.roomPwd}}
      websocket.send(this.ws,sendMessage)

    },
    onFailed(errorInfo) {
      console.log('failed', errorInfo);
    },
    serverBye(){
      
      this.remoteConnection.close()
      this.$router.push('/')
      alert('房主关闭房间');
      
    },
    joinRoomCallbackError(reciveMessage){
      console.log(reciveMessage)
      alert(reciveMessage.data)
    },
    joinRoomCallback(reciveMessage){
      console.log(reciveMessage)
      this.joinStatus=true
      this.serverFd=reciveMessage.data.serverFd
      this.clientFd=reciveMessage.data.clientFd
      // console.log(this.serverFd)
      // console.log(this.clientFd)
    },
    clientSetRemoteDescription(reciveMessage) {
      // window.console.log(reciveMessage)
      this.remoteConnection = new RTCPeerConnection(this.pcConfig);
      // console.log(this.localAudioStream)
      if (this.localAudioStream) {
        for (const track of this.localAudioStream.getTracks()) {
          console.log(track)
          this.remoteConnection.addTrack(track, this.localAudioStream);
        }
      }
      this.remoteConnection.ontrack = this.handleRemoteStreamAdded;
      this.remoteConnection.addEventListener('icecandidate', async event => {
        window.console.log('Remote ICE candidate: ', event.candidate);
        // const clientFd = document.querySelector('span#clientFd').innerHTML;
        const serverFd = this.serverFd
        let sendMessage={'type':'remoteIceCandidate','data':event.candidate,'serverFd':serverFd}
        // let sendMessage={'type':'localIceCandidate','data':event.candidate,'serverFd':serverFd}
        sendMessage=JSON.stringify(sendMessage)
        this.ws.send(sendMessage);
        // await this.localConnection.addIceCandidate(event.candidate);
      });
      window.console.log('Created remote peer connection object remoteConnection');
      const offerDesc = reciveMessage.data
      window.console.log(offerDesc)
      this.remoteConnection.setRemoteDescription(offerDesc);
      this.createAnswer()
    },
    async createAnswer(){
      const answer=await this.remoteConnection.createAnswer();
      window.console.log(answer)
      this.remoteConnection.setLocalDescription(answer);
      // const serverFd = document.querySelector('span#serverFd').innerHTML;
      const serverFd = this.serverFd
      let sendMessage={'type':'createAnswer','data':answer,'serverFd':serverFd}
      sendMessage=JSON.stringify(sendMessage)
      this.ws.send(sendMessage);
    },
    clientAddIceCandidate(reciveMessage){
      const iceCandidate = reciveMessage.data
      window.console.log(iceCandidate)
      if (iceCandidate!=null) {
        this.remoteConnection.addIceCandidate(iceCandidate);
      }
    },
    handleRemoteStreamAdded(event) {
      console.log(event.track.kind);
      console.log(event.streams);
      if(event.track.kind=="video"){
        if (event.streams && event.streams[0]) {
          this.$refs.remoteVideo.srcObject = event.streams[0]
        }
      }else{
        if (event.streams && event.streams[0]) {
          console.log("start audio")
          this.$refs.remoteAudio.srcObject = event.streams[0]
        }
      }
      
      
      
    }
  }
}
</script>
