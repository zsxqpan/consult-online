<script setup lang="ts">
import {getPatientList,addPatient,editPatient,deletePatient} from '@/api/user'
import type {PatientList,Patient} from '@/types/user'
import { showConfirmDialog, showFailToast, showSuccessToast, showToast } from 'vant'
import {ref,onMounted,computed} from 'vue'
import { useRoute,useRouter } from 'vue-router'
import {useConsultStore} from '@/stores/index'
import Validator from 'id-validator'
const list=ref<PatientList>([])
const loadList=async ()=>{
  const data=await getPatientList()
  console.log(data);
  list.value=data
  if(isChange.value&&list.value.length){
    // 首选默认患者被选中
    const defPatient=list.value.find((item)=>item.defaultFlag===1)
    if(defPatient){
      patientId.value=defPatient.id
    }else{patientId.value=list.value[0].id}
  }
}
const store=useConsultStore()
const router=useRouter()
const next=()=>{
  if(!patientId.value) return showToast('请选问诊择患者')
  store.setPatient(patientId.value)
  router.push('/consult/pay')
}

const show=ref(false)
const showPopup=(item?:Patient)=>{
  if(item){
    const {id, gender, name, idCard, defaultFlag }=item
    patient.value={id, gender, name, idCard, defaultFlag }
  }else{
    patient.value={...initPatient}
  }
  show.value=true
}
const closeDialog=()=>{
  show.value=false;
}
const options=[
  {label:'男',value:1},
  {label:'女',value:0}
]
const gender=ref(1)
const initPatient:Patient = {
  name: '',
  idCard: '',
  gender: 1,
  defaultFlag: 0
}
const patient=ref<Patient>({...initPatient})
const defaultFlag=computed({
  get(){
    return patient.value.defaultFlag===1?true:false
  },
  set(value){
    patient.value.defaultFlag=value?1:0
  }
})
const submit=async()=>{
  if(!patient.value.name) return showFailToast('请输入真实姓名')
  if (!patient.value.idCard) return showFailToast('请输入身份证号')
  const validate = new Validator()
  if (!validate.isValid(patient.value.idCard)) return showFailToast('身份证格式错误')
  const { sex } = validate.getInfo(patient.value.idCard)
  if (patient.value.gender !== sex) return showFailToast('性别和身份证不符')
  patient.value.id?await editPatient(patient.value):await addPatient(patient.value)
  show.value=false
  loadList()
  showSuccessToast(patient.value.id ? '编辑成功' : '添加成功')
}
const remove=async()=>{
  if(patient.value.id){
    await showConfirmDialog({
      title:'温馨提示',
      message:`你确定删除${patient.value.name}患者档案吗?`
    })
    await deletePatient(patient.value.id)
    show.value=false
    loadList()
    showSuccessToast('删除成功!')
  }
}
const route=useRoute()
const isChange=computed(()=>route.query.isChange==='1')
const patientId=ref<string>()
const selectedPatient=(item:Patient)=>{
  if(isChange.value){
    patientId.value=item.id
  }
}
onMounted(()=>{
  loadList()
})
</script>

<template>
  <div class="patient-page">
    <cp-nav-bar :title="isChange ? '选择患者' : '家庭档案'"></cp-nav-bar>
    <!-- 头部选择提示 -->
    <div class="patient-change" v-if="isChange">
      <h3>请选择患者信息</h3>
      <p>以便医生给出更准确的治疗，信息仅医生可见</p>
    </div>
    <div class="patient-list">
      <div class="patient-item" v-for="item in list" :key="item.id" 
      @click="selectedPatient(item)" :class="{selected:patientId===item.id}">
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{ item.idCard.replace(/^(.{6})(?:\d+)(.{4})$/,'\$1******\$2') }}</span>
          <span>{{ item.gender===0?'女':'男' }}</span>
          <span>3{{ item.age }}岁</span>
        </div>
        <div class="icon" @click="showPopup(item)"><cp-icon name="user-edit" /></div>
        <div class="tag" v-if="item.defaultFlag===1">默认</div>
      </div>
      <div class="patient-add" v-if="list.length<6" @click="showPopup()">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <van-popup v-model:show="show" position="right">
          <cp-nav-bar :title="patient.id ? '编辑患者' : '添加患者'" 
          :back="closeDialog" right-text="保存" @click-right="submit"></cp-nav-bar>
          <van-form autocomplete="off">
            <van-field label="真实姓名" v-model="patient.name" placeholder="请输入真实姓名" />
            <van-field label="身份证号" v-model="patient.idCard" placeholder="请输入身份证号" />
            <van-field label="性别">
              <!-- 单选按钮组件 -->
              <template #input>
                <cp-radio-btn :options="options" v-model="patient.gender"></cp-radio-btn>
              </template>
            </van-field>
            <van-field label="默认就诊人">
              <template #input>
                <van-checkbox v-model="defaultFlag" round />
              </template>
            </van-field>
          </van-form>
          <van-action-bar v-if="patient.id">
            <van-action-bar-button @click="remove" type="danger" text="删除"></van-action-bar-button>
          </van-action-bar>
        </van-popup>
      <div class="patient-tip">最多可添加 6 人</div>
    </div>
    <!-- 患者选择下一步 -->
    <div class="patient-next" v-if="isChange">
      <van-button type="primary" @click="next"  round block>下一步</van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.patient-page {
  padding: 46px 0 80px;
  ::v-deep() {
    .van-popup {
      width: 100%;
      height: 100%;
      padding-top: 46px;
      box-sizing: border-box;
    }
  }
}
.patient-page {
  padding: 46px 0 80px;
}
.patient-change {
  padding: 15px;
  > h3 {
    font-weight: normal;
    margin-bottom: 5px;
  }
  > p {
    color: var(--cp-text3);
  }
}
.patient-next {
  padding: 15px;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 80px;
  box-sizing: border-box;
}
.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}
</style>
