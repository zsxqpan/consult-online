<script setup lang="ts">

defineProps<{
    options:{
        label:string
        value:string|number
    }[]
    modelValue?:number|string
}>()
const emit=defineEmits<{
    (e:'update:modelValue',data:string|number):void
}>()
const changeOptions=(data:string|number)=>{
    emit('update:modelValue',data)
}
</script>

<template>
  <div class="cp-radio-btn">
    <a class="item" href="javascript:;" v-for="item in options" 
    :key="item.value" :class="{active:modelValue===item.value}"
    @click="changeOptions(item.value)">{{ item.label }}</a>
  </div>
</template>

<style lang="scss" scoped>
.cp-radio-btn {
  display: flex;
  flex-wrap: wrap;
  .item {
    height: 32px;
    min-width: 70px;
    line-height: 30px;
    padding: 0 14px;
    text-align: center;
    border: 1px solid var(--cp-bg);
    background-color: var(--cp-bg);
    margin-right: 10px;
    box-sizing: border-box;
    color: var(--cp-text2);
    margin-bottom: 10px;
    border-radius: 4px;
    transition: all 0.3s;
    &.active {
      border-color: var(--cp-primary);
      background-color: var(--cp-plain);
    }
  }
}
</style>