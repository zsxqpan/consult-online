<script setup lang='ts'>
import { showLoadingToast } from 'vant'
import { ref } from 'vue'
import { getConsultOrderPayUrl } from '@/api/consult'

const { orderId,payCallback } = defineProps<{
  orderId: string
  actualPayment?: number
  onClose?: () => void
  show: boolean
  payCallback?: string
}>()
//js里用到才需要解构，模板里可以直接用
const emit = defineEmits<{
  (e: 'update:show', val: boolean): void
}>()

const paymentMethod = ref<0 | 1>()   
const pay=async()=>{
if(paymentMethod.value===undefined) return showLoadingToast('请选择支付方式')
showLoadingToast('跳转支付')
const res=await getConsultOrderPayUrl({
    orderId:orderId,
    paymentMethod:paymentMethod.value,
    // payCallback:'http://localhost:5173/room'   支付成功后的回跳地址http://localhost:5173/room
    payCallback: payCallback || 'http://localhost:5173/room'//支付成功后的回跳地址http://localhost:5173/room
})
console.log('支付地址',res.payUrl);
window.location.href=res.payUrl//跳转到支付地址
}
</script>

<template>
  <div>
   <!-- 支付弹层 -->
   <van-action-sheet :show="show" @update:show="emit('update:show', $event)" 
   title="选择支付方式" :close-on-popstate="false"
      :before-close="onClose"  :closeable="false">
        <div class="pay-type">
          <p class="amount">￥{{ actualPayment?.toFixed(2) }}</p>
          <van-cell-group>
            <van-cell title="微信支付" @click="paymentMethod = 0">
              <template #icon><cp-icon name="consult-wechat" /></template>
              <template #extra><van-checkbox :checked="paymentMethod === 0" /></template>
            </van-cell>
            <van-cell title="支付宝支付" @click="paymentMethod = 1">
              <template #icon><cp-icon name="consult-alipay" /></template>
              <template #extra><van-checkbox :checked="paymentMethod === 1" /></template>
            </van-cell>
          </van-cell-group>
          <div class="btn">
            <van-button type="primary" round block @click="pay">立即支付</van-button>
          </div>
        </div>
      </van-action-sheet>
  </div>
</template>

<style lang='scss' scoped>
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