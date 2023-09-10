<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'
import { nextTick, onMounted,onUnmounted,ref ,provide} from 'vue';
import {useRoute} from 'vue-router';
import {useUserStore} from '@/stores/index'
import {io,type Socket} from 'socket.io-client'
import {baseURL} from '@/utils/request'
import { MsgType,OrderType } from '@/enums'
import type { Message, TimeMessages } from '@/types/room'
import type {ConsultOrderItem,Image} from '@/types/consult'
import {getConsultOrderDetail} from '@/api/consult'
const store=useUserStore()
const route=useRoute()
let socket:Socket
const list = ref<Message[]>([])
const initSocket=()=>{
  socket=io(baseURL,{
    auth:{
      token:`Bearer ${store.user?.token}`
    },
    query:{
      orderId:route.query.orderId
    }
  })
  socket.on('connect',()=>{
    console.log('connect');
  })
  socket.on('error',()=>{
    console.log('error');
  })
  socket.on('disconnect',()=>{
    console.log('disconnect');
  })
  socket.on('chatMsgList',({data}:{data:TimeMessages[]})=>{
    const arr:Message[]=[]
    data.forEach((item,i)=>{
      arr.push({
        msgType:MsgType.Notify,
        msg:{content:item.createTime},
        createTime:item.createTime,
        id:item.createTime
      })
      arr.push(...item.items)
    })
    list.value.push(...arr)
  })
   // 接收消息
  socket.on('receiveChatMsg', async (msg) => {
      list.value.push(msg)
      console.log('查看list',list.value);
      
      console.log('接收到消息',msg);
      await nextTick()
      window.scrollTo(0, document.body.scrollHeight)
      //参数分别为x、y坐标，这个的意思是滚动到最底部
    })
}

onUnmounted(() => {
  socket.close()
})
onMounted(async() => {
  initSocket()
})
const consult=ref<ConsultOrderItem>()
onMounted(async() => {
  const res=await getConsultOrderDetail(route.query.orderId as string)
  consult.value=res
})
const sendText=(text:string)=>{
  // 发送信息需要数据：发送人、收消息人、消息类型、消息内容
  socket.emit('sendChatMsg', {
    from: store.user.id, // 发送人
    to: consult.value?.docInfo?.id, // 收消息人
    msgType: MsgType.MsgText, // 消息类型
    msg: { content: text } // 消息内容
  })
}
onMounted(async() => {
  socket.on('statusChange',async()=>{
    const res=await getConsultOrderDetail(route.query.orderId as string)
    console.log('订单数据更新了');
    consult.value=res
  })
})
const sendImage=(img:Image)=>{
  socket.emit('sendChatMsg',{
    from:store.user.id,
    to:consult.value?.docInfo?.id,
    msgType:MsgType.MsgImage,
    msg:{picture:img}
  })
}
provide('consult',consult)
const completeEva=(score:number)=>{
  const item=list.value.find((item)=>item.msgType===MsgType.CardEvaForm)
  if(item){
    item.msg.evaluateDoc={score}
    item.msgType=MsgType.CardEva
  }
}
provide('completeEva',completeEva)
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="医生问诊室" />
    <!-- 1. 问诊状态-->
    <room-status :status="consult?.status" :countdown="consult?.countdown" />
    <!-- 2. 问诊聊天列表消息 -->
    <room-message :list="list" />
    <!-- 3. 底部操作栏：发消息 -->
    <room-action @send-text="sendText" @send-image="sendImage" :disabled="consult?.status !== OrderType.ConsultChat" />
  </div>
</template>
<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
