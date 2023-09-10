<script setup lang="ts">
import KnowledgeCard from './KnowledgeCard.vue'
import {KnowledgeType,KnowledgeList,KnowledgeParams} from '@/types/consult'
import {ref} from 'vue'
import {getKnowledgePage} from '@/api/consult'
import { type } from 'os'
const props=defineProps<{
  type:KnowledgeType
}>()
const loading=ref(false)
const finished=ref(false)
const list=ref<KnowledgeList>([])
const params=ref<KnowledgeParams>({
  type:props.type,
  current:1,
  pageSize:10
})
const onLoad=async ()=>{
  const res=await getKnowledgePage(params.value)
  list.value.push(...res.rows)
  if(res.pageTotal=params.value.current){
    finished.value=true
  }else{
    params.value.current++
  }
  loading.value=false
  // setTimeout(() => {
  //   for (let i = 0; i < 10; i++) {
  //     list.value.push(list.value.length+1)
  //   }
  //   loading.value=false
  //   if(list.value.length>=30){
  //     finished.value=true
  //   }
  // }, 1000);
}

</script>

<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <knowledge-card v-for="item in list" :key="item.id" :item="item"></knowledge-card>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>