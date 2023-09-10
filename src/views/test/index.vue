<style scoped>
    
</style>
<script setup lang="ts">
import { useUserStore } from '@/stores'
import { request } from '@/utils/request';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import {User} from '@/types/user'

const store = useUserStore()
const route=useRoute()
console.log(route);

const getHome =async ()=>{
  const res=await request.get('/patient/myUser')
  console.log(res)
}

const login = async () => {
  const res = await request.post<any, User>('/login/password', {
    mobile: '13211112222',
    // 密码 abc123456 测试：出现非10000的情况
    password: 'abc12345000'
  })
  store.setUser(res)
  console.log('登录成功',res);
  
}
onMounted(() => {
  login()
})
</script>

<template>
  <!-- <p>{{ store.user }}</p> -->
  <button @click="store.setUser({ id: '1', mobile: '1', account: '1', avatar: '1', token: '1' })">
    登录
  </button>
  <button @click="store.delUser()">退出</button>
  <van-button type="primary">主要按钮</van-button>
<van-button type="success">成功按钮</van-button>
<van-button type="default">默认按钮</van-button>
<van-button type="warning">警告按钮</van-button>
<van-button type="danger">危险按钮</van-button>
</template>