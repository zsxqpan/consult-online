<script setup lang="ts">
// 评价医生
import EvaluateCard from './EvaluateCard.vue'
import { ConsultTime, PrescriptionStatus } from '@/enums'
import type { Message, Prescription } from '@/types/room'
import { MsgType } from '@/enums';
import { flagOptions, timeOptions } from '@/api/constants'
import {getPrescriptionPic} from '@/api/consult'
import { showImagePreview,showFailToast } from 'vant'; 
import { Image } from '@/types/consult';
import {useUserStore} from '@/stores/index'
import dayjs from 'dayjs'
import {useRouter} from 'vue-router'
import {useLookPre} from '@/hooks'
const {lookPre}=useLookPre()

// 获取患病时间label信息
const getIllnessTimeText = (time: ConsultTime) =>
  timeOptions.find((item) => item.value === time)?.label
// 获取是否就诊label信息
const getConsultFlagText = (flag: 0 | 1) =>
  flagOptions.find((item) => item.value === flag)?.label
const previewImg=(pictures? : Image[])=>{
  if (pictures && pictures.length) showImagePreview(pictures.map((item) => item.url))
}
defineProps<{ list: Message[] }>()
const formatTime=(time:string)=>dayjs(time).format('HH:mm')
const store=useUserStore()
const loadSuccess=()=>{
  window.scrollTo(0,document.body.scrollHeight)
  //这里因为@load本身就是加载完成之后执行的函数，所以划滚动条不用异步执行
}
// const showPrescription=async(id?:string)=>{
//   if(id){
//     const res=await getPrescriptionPic(id)
//     showImagePreview([res.url])
//   }
// }这里复用hookd里的函数
const router=useRouter()
const buy=(pre?:Prescription)=>{
  if(pre){
    if(pre.status===PrescriptionStatus.Invalid) return showFailToast('处方已失效')
    if(pre.status===PrescriptionStatus.NotPayment)return router.push(`/medicine/pay?id=${pre.id}`)
  }
}
</script>

<template>
  <!-- 消息列表 -->
  <template v-for="{msgType,msg,id,from,createTime} in list" :key="id">
    <!-- 1. 病情描述 -->
    <div class="msg msg-illness" v-if="msgType===MsgType.CardPat">
      <div class="patient van-hairline--bottom" v-if="msg.consultRecord">
        <p>{{ msg.consultRecord.patientInfo.name }}
          {{ msg.consultRecord.patientInfo.genderValue }}
          {{ msg.consultRecord.patientInfo.age }}
        </p>
        <p>{{ getIllnessTimeText(msg.consultRecord.illnessTime) }} |
          {{ getConsultFlagText(msg.consultRecord.consultFlag) }}
        </p>
      </div>
      <van-row>
        <van-col span="6">病情描述</van-col>
        <van-col span="18">{{ msg.consultRecord?.illnessDesc }}</van-col>
        <van-col span="6">图片</van-col>
        <van-col span="18" @click="previewImg(msg.consultRecord?.pictures)">点击查看</van-col>
      </van-row>
    </div>
    <!-- 2. 温馨提示 -->
    <div class="msg msg-tip" v-if="msgType===MsgType.NotifyTip">
      <div class="content">
        <span class="green">温馨提示：</span>
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <!-- 3. 通用通知 -->
    <div class="msg msg-tip" v-if="msgType===MsgType.Notify">
      <div class="content">
        <span>{{ msg.content }}</span>
      </div>
    </div>
      <!--4. 发送文字：患者发的消息 -->
    <div class="msg msg-to" v-if="msgType === MsgType.MsgText && store.user?.id === from">
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <div class="pao">{{ msg.content }}</div>
      </div>
      <img class="van-image" src="@/assets/patient.png"/>
      <!-- <van-image :src="store.user?.avatar" /> -->
    </div>

    <!--5. 接收文字：医生发的消息 -->
    <div class="msg msg-from" v-if="msgType === MsgType.MsgText && store.user?.id !== from">
      <img class="van-image" src="@/assets/doctor.png"/>
      <!-- <van-image :src="fromAvatar" /> -->
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <div class="pao">{{ msg.content }}</div>
      </div>
    </div>
    <!-- 6. 发送图片 -->
    <div class="msg msg-to" v-if="msgType === MsgType.MsgImage && store.user?.id === from">
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <van-image
          fit="contain"
          @load="loadSuccess()"
          :src="msg.picture?.url"
        />
      </div>
      <img class="van-image" src="@/assets/patient.png"/>
      <!-- <van-image src="@/assets/patient.png" /> -->
    </div>
    <!-- 7. 接收图片 -->
    <div class="msg msg-from" v-if="msgType===MsgType.MsgImage&&store.user.id!==from">
      <img class="van-image" src="@/assets/doctor.png"/>
      <!-- <van-image src="@/assets/doctor.png" /> -->
      <div class="content">
        <div class="time">{{ formatTime((createTime)) }}</div>
        <van-image
          fit="contain"
          @load="loadSuccess()"
          :src="msg.picture?.url"
        />
      </div>
    </div>
    <!-- 8. 处方消息 -->
    <div class="msg msg-recipe" v-if="msgType === MsgType.CardPre">
      <div class="content">
        <div class="head van-hairline--bottom">
          <div class="head-tit">
            <h3>电子处方</h3>
            <p @click="lookPre(msg.prescription?.id)">原始处方 <van-icon name="arrow"></van-icon></p>
          </div>
          <p>
            {{ msg.prescription?.name }}
            {{ msg.prescription?.genderValue }}
            {{ msg.prescription?.age }}岁
            {{ msg.prescription?.diagnosis }}
          </p>
          <p>开方时间：{{ msg.prescription?.createTime }}</p>
        </div>
        <div class="body">
          <div class="body-item" v-for="med in msg.prescription?.medicines" :key="med.id">
            <div class="durg">
              <p>{{ med.name }} {{ med.specs }}</p>
              <p>{{ med.usageDosag }}</p>
            </div>
            <div class="num">x{{ med.quantity }}</div>
          </div>
        </div>
        <div class="foot"><span @click="buy(msg.prescription)">购买药品</span></div>
        <!-- <div class="foot"><span>购买药品</span></div> -->
      </div>
    </div>
    <!-- 9. 订单取消/关闭诊室 -->
    <div class="msg msg-tip msg-tip-cancel" v-if="msgType === MsgType.NotifyCancel">
      <div class="content">
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <!-- 10. 医生评价 -->
    <div class="msg" v-if="msgType === MsgType.CardEva || msgType === MsgType.CardEvaForm">
      <evaluate-card :evaluateDoc="msg.evaluateDoc"></evaluate-card>
    </div>
  </template>
</template>

<style lang="scss" scoped>
.msg {
  display: flex;
  padding: 15px;
  // 医生消息+图片
  &-from {
    .content {
      max-width: 240px;
      min-width: 52px;
      .time {
        color: var(--cp-tip);
        margin-bottom: 5px;
      }
      .pao {
        padding: 15px;
        background-color: #fff;
        color: var(--cp-text3);
        font-size: 15px;
        border-radius: 8px;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          left: -13px;
          top: 10px;
          width: 13px;
          height: 16px;
          background: #fff;
          border-top-left-radius: 13px 3px;
        }
        &::after {
          content: '';
          position: absolute;
          left: -13px;
          top: 13px;
          width: 13px;
          height: 13px;
          background: var(--cp-bg);
          border-top-right-radius: 13px 13px;
        }
      }
      .van-image {
        max-height: 160px;
        max-width: 160px;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid var(--cp-line);
      }
    }
    > .van-image {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 13px;
    }
  }
  // 患者消息+图片
  &-to {
    justify-content: flex-end;
    .content {
      max-width: 240px;
      min-width: 52px;
      .time {
        color: var(--cp-tip);
        margin-bottom: 5px;
        text-align: right;
      }
      .pao {
        padding: 15px;
        background-color: var(--cp-primary);
        color: #fff;
        font-size: 15px;
        border-radius: 8px;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          right: -13px;
          top: 10px;
          width: 13px;
          height: 16px;
          background: var(--cp-primary);
          border-top-right-radius: 13px 3px;
        }
        &::after {
          content: '';
          position: absolute;
          right: -13px;
          top: 13px;
          width: 13px;
          height: 13px;
          background: var(--cp-bg);
          border-top-left-radius: 13px 13px;
        }
      }
      .van-image {
        max-height: 160px;
        max-width: 160px;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid var(--cp-line);
      }
    }
    > .van-image {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      overflow: hidden;
      margin-left: 13px;
    }
  }
  &-tip {
    justify-content: center;
    font-size: 12px;
    .content {
      height: 34px;
      line-height: 34px;
      background-color: #fff;
      color: var(--cp-tip);
      font-size: 12px;
      border-radius: 17px;
      padding: 0 16px;
      max-width: 100%;
      .green {
        color: var(--cp-primary);
      }
    }
    &-cancel {
      .content {
        background-color: #ededed;
      }
    }
  }
  &-illness {
    display: block;
    background-color: #fff;
    margin: 15px;
    border-radius: 8px;
    font-size: 12px;
    .patient {
      padding-bottom: 15px;
      margin-bottom: 15px;
      > p {
        &:first-child {
          font-size: 16px;
        }
        &:last-child {
          margin-top: 5px;
          color: var(--cp-tip);
        }
      }
    }
    .van-col {
      &:nth-child(-n + 2) {
        margin-bottom: 5px;
      }
      &:nth-child(2n) {
        color: var(--cp-tip);
      }
    }
  }
  &-recipe {
    padding: 15px;
    .content {
      background-color: #fff;
      border-radius: 8px;
      color: var(--cp-tip);
      font-size: 12px;
      flex: 1;
      .head {
        padding: 15px;
        .head-tit {
          display: flex;
          justify-content: space-between;
          > h3 {
            font-weight: normal;
            font-size: 16px;
            color: var(--cp-text1);
          }
        }
        p {
          margin-top: 5px;
        }
      }
      .body {
        padding: 15px 15px 0 15px;
        &-item {
          display: flex;
          margin-bottom: 15px;
          .durg {
            flex: 1;
            > p {
              &:first-child {
                font-size: 14px;
                color: var(--cp-text1);
                margin-bottom: 5px;
              }
            }
          }
          .num {
            color: var(--cp-text1);
          }
        }
      }
      .foot {
        background-color: var(--cp-plain);
        color: var(--cp-primary);
        font-size: 16px;
        text-align: center;
        height: 42px;
        line-height: 42px;
      }
    }
  }
}
</style>
