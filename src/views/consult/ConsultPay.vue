<script setup lang="ts">
import { getConsultOrderPre,createConsultOrder,getConsultOrderPayUrl } from '@/api/consult'
import { getPatientDetail } from '@/api/user'
import { ConsultType } from '@/enums'
import { useConsultStore} from '@/stores'
import type { ConsultOrderPreData } from '@/types/consult'
import type { Patient } from '@/types/user'
import { showConfirmDialog, showLoadingToast, showToast } from 'vant'
import { onMounted, ref } from 'vue'
import { onBeforeRouteLeave,useRouter } from 'vue-router'
const store=useConsultStore()
const payInfo=ref<ConsultOrderPreData>()
const loadData=async()=>{
  const res=await getConsultOrderPre({type:store.consult.type,illnessType:store.consult.illnessType})
  payInfo.value=res
  console.log(888,res);
  // console.dir(res)
  store.setCunpon(payInfo.value.couponId)
}
const patient=ref<Patient>()
const loadPatient=async()=>{
  if(!store.consult.patientId) return
  const res=await getPatientDetail(store.consult.patientId+1)
  patient.value=res
  console.log(999,res);
  
}
onMounted(()=>{
  loadData()
  loadPatient()
})
const agree=ref(false)
const show = ref(false)
// 支付方式
const paymentMethod = ref<0 | 1>()
const orderId=ref('')
const submit = async () => {
  if (!agree.value) return showToast('请勾选我已同意支付协议')
  const res=await createConsultOrder(store.consult)
  orderId.value=res.id
  store.clear()
  // 打开
  show.value = true
}
const router=useRouter()
const onClose=()=>{
  return showConfirmDialog({
    title:'关闭支付',
    message:'取消支付将无法获得医生回复，医生接诊名额有限，是否确认关闭？',
    cancelButtonText:'仍要关闭',
    confirmButtonText:'继续支付',
    confirmButtonColor:'var(--cp-primary)'
  }).then(()=>{
    return false
  }).catch((error)=>{
    console.log(error);
    console.log(666);
    
    orderId.value=''
    router.push('/user/consult')
    return true
  })
}
onBeforeRouteLeave(()=>{
  if(orderId.value) return false
})

</script>

<template>
  <div class="consult-pay-page">
    <cp-nav-bar title="支付" />
    <!-- 1. 支付信息 -->
    <div class="pay-info">
      <p class="tit">图文问诊{{payInfo?.payment}}元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <van-cell-group>
      <van-cell title="优惠券" :value="`-¥${payInfo?.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-¥${payInfo?.pointDeduction}`" />
      <van-cell title="实付款" :value="`¥${payInfo?.actualPayment}`" class="pay-price" />
    </van-cell-group>
    <div class="pay-space"></div>
    <!-- 2. 患者信息  -->
    <van-cell-group>
      <van-cell title="患者信息" :value="`${patient?.name} | ${patient?.gender===0?'女':'男'} | ${patient?.age}岁`"></van-cell>
      <van-cell title="病情描述" :label="store.consult.illnessDesc"></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree">我已同意 <span class="text">支付协议</span></van-checkbox>
    </div>
    <!-- 3. 打开支付弹层并创建问诊订单 -->
      <!-- 控制支付抽屉显隐 订单ID 支付金额 关闭后回调 -->
    <van-submit-bar button-type="primary" :price="payInfo?.actualPayment! * 100"
     button-text="立即支付" text-align="left" @click="submit" />
     <cp-pay-sheet
        v-model:show="show" 
        :order-id="orderId" 
        :actualPayment="payInfo?.actualPayment" 
        :onClose="onClose"
      />
  </div>
</template>

<style lang="scss" scoped>
.consult-pay-page {
  padding: 46px 0 50px 0;
  .pay-info {
    display: flex;
    padding: 15px;
    flex-wrap: wrap;
    align-items: center;
    .tit {
      width: 100%;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .img {
      margin-right: 10px;
      width: 38px;
      height: 38px;
      border-radius: 4px;
      overflow: hidden;
    }
    .desc {
      flex: 1;
      > span {
        display: block;
        color: var(--cp-tag);
        &:first-child {
          font-size: 16px;
          color: var(--cp-text2);
        }
      }
    }
  }
  .pay-price {
    ::v-deep() {
      .vam-cell__title {
        font-size: 16px;
      }
      .van-cell__value {
        font-size: 16px;
        color: var(--cp-price);
      }
    }
  }
  .pay-space {
    height: 12px;
    background-color: var(--cp-bg);
  }
  .pay-schema {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    .text {
      color: var(--cp-primary);
    }
  }
  ::v-deep() {
    .van-submit-bar__button {
      font-weight: normal;
      width: 160px;
    }
  }
}
// 支付弹层样式
.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .btn {
    padding: 15px;
  }
  .van-cell {
    align-items: center;
    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}
</style>
