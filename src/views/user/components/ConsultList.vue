<script setup lang="ts">
import ConsultItem from './ConsultItem.vue'
import type {ConsultOrderListParams,ConsultOrderItem} from '@/types/consult'
import type {ConsultType} from '@/enums/index'
import { getConsultOrderList } from '@/api/consult'
import {ref} from 'vue'
const props=defineProps<{
  type:ConsultType
}>()
const params=ref<ConsultOrderListParams>({
  type:props.type,
  current:1,
  pageSize:5
})
const finished=ref(false)
const loading=ref(false)
const list=ref<ConsultOrderItem[]>([])
const onLoad=async()=>{
  const res=await getConsultOrderList(params.value)
  list.value.push(...res.rows)
  if(params.value.current<res.pageTotal){
    params.value.current++
  }else{
    finished.value=true
  }
  loading.value=false
}
const onDelete=(id:string)=>{
  list.value=list.value.filter((item)=>item.id!==id)
}
</script>

<template>
  <div class="consult-list">
    <van-list 
    v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了喔"
      @load="onLoad">
      <consult-item v-for="item in list" :key="item.id" :item="item"
      @on-delete="onDelete" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>
