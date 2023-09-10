<script setup lang="ts">
import { ref } from 'vue'
import {uploadImage} from '@/api/consult'
import type { Image } from '@/types/consult'
import { showLoadingToast } from 'vant'
import type { UploaderAfterRead } from 'vant/lib/uploader/types'
const emit = defineEmits<{
  (e:'send-text',text:string):void
  (e:'send-image',img:Image):void
}>()
const text=ref('')
const sendText=()=>{
  emit('send-text',text.value)
  text.value=''
}
defineProps<{
  disabled:boolean
}>()
const sendImage:UploaderAfterRead=async(data)=>{
  if(Array.isArray(data)) return
  if(!data.file) return
  const t=showLoadingToast({
    message:'正在上传',
    duration:0
  })
  const res=await uploadImage(data.file)
  t.close()
  console.log('上传图片',res);
  
  emit('send-image',res)
}
</script>

<template>
  <div class="room-action">
    <van-field
    v-model="text"
    :disabled="disabled"
    @keyup.enter="sendText"
      type="text"
      class="input"
      :border="false"
      placeholder="问医生"
      autocomplete="off"
    ></van-field>
    <van-uploader :preview-image="false" :disabled="disabled"
    :after-read="sendImage">
      <cp-icon name="consult-img" />
    </van-uploader>
  </div>
</template>

<style lang="scss" scoped>
.room-action {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 1;
  box-sizing: border-box;
  .input {
    background-color: var(--cp-bg);
    border: none;
    border-radius: 25px;
    margin-right: 10px;
    padding: 8px 15px;
  }
  .cp-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
