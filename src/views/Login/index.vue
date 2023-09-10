<template>
   <cp-nav-bar title="登录"  rightText="注册" @click-right="clickRight"></cp-nav-bar>
    <div class="login">
      <div class="login-head">
        <h3>{{ isPass?'密码登录':'短信验证码登录' }}</h3>
        <a href="javascript:;" @click="isPass=!isPass">
          <span>{{ !isPass?'密码登录':'短信验证码登录' }}</span>
          <van-icon name="arrow"></van-icon>
        </a>
      </div>
      <van-form @submit="login" autocomplete="off" ref="form">
        <van-field placeholder="请输入手机号" name="mobile" type="tel" v-model="mobile"
         :rules="mobileRules"></van-field>
        <van-field placeholder="请输入密码" :type="isShow?'text':'password'"
         v-model="password" :rules="passwordRules" v-if="isPass">
          <template #button>
              <cp-icon :name="`login-eye-${isShow?'on':'off'}`" @click="isShow=!isShow"></cp-icon>
          </template>
        </van-field>
        <van-field v-else placeholder="短信验证码" v-model="code" :rules="codeRules">
          <template #button>
            <span @click="send" class="{active:time>0}">{{ time>0?`${time}秒后再次发送`:'发送验证码' }}</span>
          </template>
        </van-field>
        <div class="cp-cell">
          <van-checkbox v-model="agree">
            <span>我已同意</span>
            <a href="javascript:;">用户协议</a>
            <span>及</span>
            <a href="javascript:;">隐私条款</a>
          </van-checkbox>
        </div>
        <div class="cp-cell">
          <van-button block round type="primary" native-type="submit">登 录</van-button>
        </div>
        <div class="cp-cell">
          <a href="javascript:;">忘记密码？</a>
        </div>
      </van-form>
    </div>
  </template>
<script setup lang="ts">
import{mobileRules,passwordRules,codeRules} from '@/utils/rules'
import { ref,onUnmounted } from 'vue'
import { showFailToast,showSuccessToast,type FormInstance } from 'vant'
import { loginByPassword ,sendMobileCode,loginByMobile} from '@/api/user'
import { useUserStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
import {useSendCode} from './services/index'
// import { setInterval } from 'timers'
// import { timeEnd } from 'console'

// 表单提交
const agree = ref(false)
const mobile=ref('13230000055')

const password=ref('abc12345')
const isShow=ref(false)
const isPass=ref(true)
const clickRight=()=>{
  console.log(666);
}
//因为包装了hook在services里，若先使用useSendCode函数，无法提供mobile值（send函数必须用到），
//而在这个文件中调用send，send函数本体必须由services.index的useSendCode函数得来，而调用它又
//必须mobile，解决办法，用一个watch监视mobile，它一变就调用useSendCode，这样这些变量就不用设
//置初始值，但感觉这个方法比较笨。
//若useSendCode放在后面，则login无法验证验证码code，若放在login里面，则code等四个变量变为局部
//变量，不利于send调用。因此这里mobile设一个初始值，往后若要用到封装hook，注意这些问题

const store=useUserStore()
const router=useRouter()
const route=useRoute()
const {code,time,form,send}=useSendCode(mobile.value)

const login = async () => {
  if (!agree.value) return showFailToast('请勾选我已同意')
  // return Toast.fail('请勾选我已同意')
  // 验证完毕，进行登录
  try{
    const res = isPass
      ?await loginByPassword(mobile.value,password.value)
      :await loginByMobile(mobile.value,code.value)
    console.log(res);
    store.setUser(res)
    //原本是push，换成replace的目的，是使路径由a=》login+》b变成a=》b
    router.replace((route.query.returnUrl as string)||'/user')
    showSuccessToast('登录成功')
  }catch(error){
    console.log(error);
  }
}


</script>
  
<style lang="scss" scoped>
.active{
  color: red;
}
.login {
  padding-top: 46px;
  &-head {
    padding: 30px 30px 50px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }
  .van-form {
    padding: 0 14px;
    .cp-cell {
      height: 52px;
      padding: 14px 16px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      .van-checkbox {
        a {
          color: var(--cp-primary);
          padding: 0 5px;
        }
      }
    }
  }
}
</style>