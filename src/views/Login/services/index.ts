// import{mobileRules,passwordRules,codeRules} from '@/utils/rules'
import { ref,onUnmounted } from 'vue'
import {showSuccessToast,type FormInstance } from 'vant'
import { sendMobileCode} from '@/api/user'
// import { useUserStore } from '@/stores'
// import { useRoute, useRouter } from 'vue-router'
// import {} from './services/index.vue'
export function useSendCode(mobile:string){
    const code=ref('')
    const time=ref(0)
    const form = ref<FormInstance>()
    let timeId:number
    const send=async ()=>{
        if(time.value>0)return
        try{
        await form.value?.validate('mobile')
        const sres=await sendMobileCode(mobile, 'login')
        showSuccessToast('发送成功')
        code.value=sres.code
        time.value=60
        timeId=window.setInterval(()=>{
            time.value-=1
            if(time.value<=0)window.clearInterval(timeId)
        },1000)
        }catch(error){
        console.log(error);
        }
    }
  onUnmounted(() => {
    window.clearInterval(timeId)
  })
  return {code,time,form,send}
}
