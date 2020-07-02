<template>
  <div> 
<audio hidden controls  ref="joinAudio">
<source src="audio/join.mp3" type="audio/mpeg">
您的浏览器不支持 audio 元素。
</audio>
    <van-nav-bar v-show="createStatus"
    v-bind:title="'影院'+serverFd+'号'"
    left-text="退出"
    right-text="分享观影码"
    left-arrow
    @click-left="onClickLeft"
    @click-right="dialog"
    />
    
    <van-row v-show="createStatus">
      <van-col span="1"></van-col>
      <van-col span="18"> 
        <div >
<!--           <van-row>
            <div style="text-align: center;">
              <van-button type="info" v-on:click="dialog">邀请码</van-button>
              <van-button type="primary" size="mini" v-on:click="startAudioStream">开麦</van-button>
      <van-button type="primary" size="mini" v-on:click="stopAudioStream">关闭麦</van-button>
            </div>
          </van-row> -->
          <van-row>
            <van-col span="24"> 
              <div style="text-align: center;" v-if="clientFd">
                  观影者的音频
                  <br>
                  <audio  id="remoteAudio" autoplay controls="" ref="remoteAudio" width="10%" height="10px"></audio>                
              </div>
            </van-col>
          </van-row>
          <van-row>
            <van-col span="24"> 
              <!-- <div style="text-align: center;" v-if="clientFd"> -->
              <div style="text-align: center;">
                  共享屏幕
                  <video id="localVideo" autoplay muted playsinline controls="" ref="localVideo" width="100%" style="max-height:400px"></video>            
                  
              </div>
            </van-col>
          </van-row>          
        </div>
      </van-col>
      <van-col span="5">
          <div style="text-align: center;">
            房间状态
          </div>
          
        <van-steps active-color='#38f' direction="vertical" :active="roomStatusLength">
          <van-step v-for="(value, key) in roomStatus" :key="key">
            <!-- {{key+1}}: -->
            {{value}}
          </van-step>
        </van-steps>
      </van-col>
    </van-row>
    <div v-if="createStatus">
    </div>
    <div v-else>
      
      <van-notice-bar :scrollable="false" v-if="userAgent==false" left-icon="volume-o" >
        android<a href="/远程投屏.apk">请下载app</a>，ios敬请期待。
      </van-notice-bar>

      <van-form @submit="onSubmit">
      <van-field
      v-model="serverFd"
      name="影院号"
      label="影院号:"
      readonly
      />
      <van-field
      v-model="roomPwd"
      name="观影码"
      label="观影码:"
      readonly
      />
      <div style="margin: 16px;">
      <van-button round block type="info" native-type="submit" :disabled="userAgent==false">
      创建影院
      </van-button>
      </div>
      </van-form>
      <van-grid :column-num="3"  :center="true">
        <!-- <van-grid-item>
          创建影院(电脑浏览器:windwos/mac/linux/android(下载app)系统均支持)
        </van-grid-item>
        <van-grid-item>
          观看影院(手机浏览器/电脑浏览器均支持)
        </van-grid-item> -->
        <van-grid-item  icon="live" text="投屏端"/>
        <van-grid-item  icon="exchange" />
        <van-grid-item  icon="video" text="观看端" />
        <van-grid-item  text="windows浏览器"/>
        <van-grid-item  icon="exchange" />
        <van-grid-item  text="任意设备浏览器" />
        <van-grid-item  text="mac浏览器"/>
        <van-grid-item  icon="exchange" />
        <van-grid-item  text="任意设备浏览器" />
        <van-grid-item  text="linux浏览器"/>
        <van-grid-item  icon="exchange" />
        <van-grid-item  text="任意设备浏览器" />
        <van-grid-item  text="android app"/>
        <van-grid-item  icon="exchange" />
        <van-grid-item  text="任意设备浏览器" />
        <van-grid-item  text="ios app(敬请期待)"/>
        <van-grid-item  icon="exchange" />
        <van-grid-item  text="任意设备浏览器" />

      </van-grid>
    </div>

   
    <Tabbar v-bind:active="active"/>
  </div>
</template>

<script>
import websocket from '../assets/js/websocket.js';
import Tabbar from '@/components/Tabbar.vue'
import Vue from 'vue';
import { Form } from 'vant';
import { Field } from 'vant';
import { Button } from 'vant';
import { Col, Row } from 'vant';
import { Icon } from 'vant';
import { Dialog } from 'vant';
import { Step, Steps } from 'vant';
import { NoticeBar } from 'vant';

Vue.use(NoticeBar);
Vue.use(Step);
Vue.use(Steps);

Vue.use(Icon);
Vue.use(Col);
Vue.use(Row);

Vue.use(Button);
Vue.use(Field);
Vue.use(Form);

export default {
  name: 'CreateRoom',
  components: {
    Tabbar
  },
  data() {
    return {
      userAgent:"",
      active:1,
      serverFd: '',
      clientFd: false,
      roomPwd: '',
      roomUrl:'',
      createStatus: false,
      roomStatus:['创建房间'],
      localStream:false,
      localAudioStream:false,
      pcConfig: null
    }
  },
  mounted() {
      if (process.env.VUE_APP_WEBRTC_PCCONFIG != '') {
        this.pcConfig = eval ("(" + process.env.VUE_APP_WEBRTC_PCCONFIG + ")");
      }
      this.userAgent=this.IsPC();
      // this.userAgent = navigator.userAgent;
      console.log(websocket)
      this.ws = websocket.init();
      const sendMessage={'type':'getFd'}
      websocket.onopen(this.ws,sendMessage)
      websocket.onmessage(this.ws,this)
      let num = '';
      for (let i = 0; i < 6; i++) {
        num += Math.floor(Math.random() * 9 + 1);
      }
      this.roomPwd = num
  },
  computed: {
    // 计算属性的 getter
    roomStatusLength: function () {
      // `this` 指向 vm 实例
      return this.roomStatus.length-1
    }
  },
  methods: {
    IsPC() {
        const userAgentInfo = navigator.userAgent;
        const Agents = ["Mobile","Android","iPhone"];
        let flag = true;
        for (let v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
        }
        }
        return flag;
    },
    dialog(){
      Dialog({ message: '观影网址:<br>'+this.roomUrl+"<br>观影码:<br>"+this.roomPwd });

    },
    onClickLeft(){
      // this.$router.push('/')
      window.location.href=''
    },
    onSubmit(values) {
      console.log('submit', values);
      //----
      // this.createRoom()
      // this.createStatus=true
      //----
      // navigator.mediaDevices.getUserMedia(
      //                     {video: false, audio: true});
      this.gotAudioStream()
      if (navigator.getDisplayMedia) {
        navigator.getDisplayMedia({video: true,audio: true}).then(stream => {this.gotStream(stream);},error => {console.log(error);});
      } 
      else if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia({video: true,audio: true}).then(stream => {this.gotStream(stream);},error => {console.log(error);});
      } else {
      navigator.mediaDevices.getUserMedia({video: {mediaSource: 'screen'}}).then(stream => {this.gotStream(stream);},error => {console.log(error);});
      }
    },
    gotStream(stream) {
      console.log(stream)
      this.createStatus=true
      this.$refs.localVideo.srcObject = stream
      this.localStream=stream
      this.createRoom()
    },
    gotAudioStream(){
      // alert(123)
      navigator.mediaDevices.getUserMedia({video: false, audio: true}).then(stream => 
        {
          this.localAudioStream=stream
        },error => {console.log(error);});
    },
    // startAudioStream(){
    //   this.localAudioStream.getTracks().forEach(track => track.start());
    // },
    // stopAudioStream(){
    //   this.localAudioStream.getTracks().forEach(track => track.stop());
    // },
    getFdCallback(reciveMessage){
      this.serverFd=reciveMessage.data.serverFd
      this.roomUrl=window.location.protocol+"//"+window.location.host+"/joinroom?roomId="+this.serverFd
    },
    createRoom() {
      const sendMessage = {'type':'createRoom','data':{'roomPwd':this.roomPwd}}
      websocket.send(this.ws,sendMessage)
    },
    clientBye(){
      
      this.localConnection.close()
      this.clientFd=false
      // alert('观影者退出');
      this.roomStatus.push('观影者退出')
    },
    createRoomCallback(reciveMessage){
      console.log(reciveMessage)
      // this.serverFd=reciveMessage.data.serverFd
    },
    clientJoinRoom(reciveMessage){
      console.log(reciveMessage)
      this.clientFd=reciveMessage.data.clientFd
      this.createConnection()
      this.roomStatus.push('观影者加入房间')
      this.$refs.joinAudio.play();
    },
    createConnection() {
      this.localConnection = new RTCPeerConnection(this.pcConfig);
      for (const track of this.localStream.getTracks()) {
        console.log(track)
        this.localConnection.addTrack(track, this.localStream);
        // this.localConnection.addTrack(track, this.localAudioStream);
      }
      if (this.localAudioStream) {
        for (const track of this.localAudioStream.getTracks()) {
          console.log(track)
          this.localConnection.addTrack(track, this.localAudioStream);
        }
      }
      this.localConnection.ontrack = this.handleRemoteStreamAdded;

      console.log('Created local peer connection object localConnection');
      // this.localConnection.addTrack(this.localStream);
      this.localConnection.addEventListener('icecandidate', event => {
        this.localIceCandidate(event)
      });
      try {
        this.createOffer();
      } catch (e) {
        console.log('Failed to create session description: ', e);
      }

      this.fileInputDisabled = true;
    },
    async createOffer(){
      const offer = await this.localConnection.createOffer();
      await this.localConnection.setLocalDescription(offer)
      console.log(offer)
      console.log('createOffer')
      const clientFd = this.clientFd
      let sendMessage={'type':'createOffer','data':offer,'clientFd':clientFd}
      sendMessage=JSON.stringify(sendMessage)
      this.ws.send(sendMessage);
    },
    localIceCandidate(event){
      console.log('Local ICE candidate: ', event.candidate);
      const clientFd = this.clientFd
      let sendMessage={'type':'localIceCandidate','data':event.candidate,'clientFd':clientFd}
      sendMessage=JSON.stringify(sendMessage)
      this.ws.send(sendMessage);
    },
    serverSetRemoteDescription(reciveMessage){
      const answerDesc = reciveMessage.data
      console.log(answerDesc)
      this.localConnection.setRemoteDescription(answerDesc);
    },
    async serverAddIceCandidate(reciveMessage){
      const iceCandidate = reciveMessage.data
      console.log(iceCandidate)
      if (iceCandidate!=null) {
        await this.localConnection.addIceCandidate(iceCandidate);
      }
      
    },
    handleRemoteStreamAdded(event) {
      console.log(event.track.kind);
      if(event.track.kind=="audio"){
        if (event.streams && event.streams[0]) {
          this.$refs.remoteAudio.srcObject = event.streams[0]
        }
      }
    }
  }
}
</script>
