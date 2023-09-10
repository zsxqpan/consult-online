import {followDoctor,getPrescriptionPic} from '@/api/consult'
import {ref} from 'vue'
import {showSuccessToast,showImagePreview} from 'vant'
import {Doctor,FollowType} from '@/types/consult'
const useFollow=(type:FollowType='doc')=>{//关注医生功能
    const loading=ref(false)
    const follow=async(doc:{id:string;likeFlag:0|1})=>{
        loading.value=true
        try {
          await followDoctor(doc.id,type)
          doc.likeFlag = doc.likeFlag === 1 ? 0 : 1
          showSuccessToast(doc.likeFlag===1?'关注成功':'未关注')
        } finally {
          loading.value = false
        }
      }
      return {loading,follow}
}
//查看处方
const useLookPre=()=>{
  const lookPre=async(id?:string)=>{
    try{
      if(!id)return
      const res=await getPrescriptionPic(id)
      showImagePreview([res.url])
    }catch(error){
      console.log(error);
    }
  }
  return {lookPre}
}
import { getMedicalOrderDetail } from '@/api/medicine'
import type { OrderDetail } from '@/types/medicine'
import { onMounted } from 'vue'

const useOrderDetail = (id: string) => {
  const loading = ref(false)
  const order = ref<OrderDetail>()
  onMounted(async () => {
    loading.value = true
    try {
      const res = await getMedicalOrderDetail(id)
      order.value = res
    } finally {
      loading.value = false
    }
  })
  return { order, loading }
}
export {useFollow,useLookPre,useOrderDetail}
