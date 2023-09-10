import type { KnowledgePage, KnowledgeParams,DoctorPage,
   PageParams,FollowType,TopDep,Image,ConsultOrderPreData,
  ConsultOrderPreParams,PartialConsult, ConsultOrderItem} from '@/types/consult'
import type { ConsultOrderListParams, ConsultOrderPage } from '@/types/consult'

import { request } from '@/utils/request'

export const getKnowledgePage = (params: KnowledgeParams) =>
  request.get<any, KnowledgePage>('/patient/home/knowledge', { params })

export const getDoctorPage = (params: PageParams)=>
  request.get<any,DoctorPage>('/home/page/doc',{params})

export const followDoctor = (id: string, type: FollowType = 'doc') =>
  request.post('/like', { id, type })

export const getAllDep=()=>request.get<any,TopDep[]>('/dep/all')

export const uploadImage=(file:File)=>{
  const fd=new FormData()
  fd.append('file',file)
  return request.post<any,Image>('/upload',fd)
}

// 拉取预支付订单信息
export const getConsultOrderPre = (params: ConsultOrderPreParams) =>
  request.get<any,ConsultOrderPreData>('/patient/consult/order/pre', { params })

// 生成订单
export const createConsultOrder = (data: PartialConsult) =>
  request.post<any, { id: string }>('/patient/consult/order', data)

export const getConsultOrderPayUrl = (data: {
  paymentMethod: 0 | 1
  orderId: string
  payCallback: string
}) => request.post<any, { payUrl: string }>('/patient/consult/pay', data)

export const getConsultOrderDetail=(orderId:string)=>
  request.get<any,ConsultOrderItem>('/patient/consult/order/detail',{params:{orderId}})

// 查看处方
export const getPrescriptionPic = (id: string) =>
  request.get<any, { url: string }>(`/patient/consult/prescription/${id}`)

// 评价问诊
export const evaluateConsultOrder = (data: {
  docId: string // 医生ID
  orderId: string // 订单ID
  score: number // 评价星级
  content: string // 评价留言
  anonymousFlag: 0 | 1 // 是否匿名评价：1匿名 0实名
}) => request.post('/patient/order/evaluate', data)

//获取问诊订单纪录列表
export const getConsultOrderList = (params:ConsultOrderListParams) =>
  request.get<any,ConsultOrderPage>('/patient/consult/order/list',{params})

//取消订单
export const cancelOrder=(id:string) => request.put(`/patient/order/cancel/${id}`)

// 删除订单
export const deleteOrder = (id: string) => request.delete(`/patient/order/${id}`)