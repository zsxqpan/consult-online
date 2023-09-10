<script lang="ts" setup>
import {Doctor} from '@/types/consult'
// import {followDoctor} from '@/api/consult'
// import {ref} from 'vue'
// const loading=ref(false)
import {useFollow} from '@/hooks/index'
const props=defineProps<{
  item:Doctor
}>()
// const follow=async(doc:Doctor)=>{
//   loading.value=true
//   try {
//     await followDoctor(doc.id)
//     doc.likeFlag = doc.likeFlag === 1 ? 0 : 1
//   } finally {
//     loading.value = false
//   }
// }
const {loading,follow}=useFollow()
</script>
<template>
  <div class="doctor-card">
    <van-image
      round
      :src="item.avatar"
    />
    <p class="name">{{ item.name }}</p>
    <p>{{ item.hospitalName }}</p>
    <p>{{ item.positionalTitles }}</p>
    <van-button round size="small" type="primary"
    :loading="loading" @click="follow(item)"
    >{{ item.likeFlag===1?'已关注':'+关注' }}</van-button>
  </div>
</template>
<style scoped lang="scss">
.doctor-card {
  width: 135px;
  // height: 190px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0px 0px 11px 0px rgba(229, 229, 229, 0.2);
  text-align: center;
  padding: 15px;
  margin-left: 15px;
  display: inline-block;
  box-sizing: border-box;
  > .van-image {
    width: 58px;
    height: 58px;
    vertical-align: top;
    border-radius: 50%;
    margin: 0 auto 8px;
  }
  > p {
    margin-bottom: 0;
    font-size: 11px;
    color: var(--cp-tip);
    &.name {
      font-size: 13px;
      color: var(--cp-text1);
      margin-bottom: 5px;
    }
  }
  > .van-button {
    padding: 0 12px;
    height: 28px;
    margin-top: 8px;
    width: 72px;
  }
}
</style>
