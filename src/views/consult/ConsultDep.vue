<script setup lang="ts">
import {getAllDep} from '@/api/consult'
import type { TopDep } from '@/types/consult'
import { onMounted, ref,computed } from 'vue'
import {useConsultStore} from '@/stores/index'
const store=useConsultStore()
const dep=ref<TopDep[]>([])
const subDep=computed(()=>dep.value[active.value]?.child)
// 使用可选链操作符，解决组件初始化的时候没有数据 child 可能拿不到
onMounted(async()=>{
  const res = await getAllDep()
  dep.value=res
})

const active = ref(0)
</script>

<template>
  <!-- 2. 极速问诊-选择科室 -->
  <div class="consult-dep-page">
    <cp-nav-bar title="选择科室" />
    <div class="wrapper">
      <!-- 一级科室 -->
      <van-sidebar v-model="active">
        <van-sidebar-item v-for="top in dep" :key="top.id" :title="top.name"></van-sidebar-item>
        <!-- <van-sidebar-item title="内科" />
        <van-sidebar-item title="外科" />
        <van-sidebar-item title="皮肤科" />
        <van-sidebar-item title="骨科" /> -->
      </van-sidebar>
      <!-- 二级科室 -->
      <div class="sub-dep">
        <router-link to="/consult/illness" v-for="sdep in subDep" 
        :key="sdep.id" @click="store.setDep(sdep.id)">{{ sdep.name }}</router-link>
        <!-- <router-link to="/consult/illness">科室一</router-link>
        <router-link to="/consult/illness">科室二</router-link>
        <router-link to="/consult/illness">科室三</router-link> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.van-sidebar {
  width: 114px;
  &-item {
    padding: 14px;
    color: var(--cp-tag);
    &--select {
      color: var(--cp-main);
      font-weight: normal;
      &::before {
        display: none;
      }
    }
  }
}
.consult-dep-page {
  padding-top: 46px;
}

.wrapper {
  height: calc(100vh - 46px);
  overflow: hidden;
  display: flex;
  .sub-dep {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    > a {
      display: block;
      padding: 14px 30px;
      color: var(--cp-dark);
    }
  }
}
</style>
