import type {User,CodeType,UserInfo,PatientList,Patient} from '@/types/user'
import {request} from '@/utils/request'

export const loginByPassword = (mobile:string,password:string)=>
    request.post<any,User>('/login/password',{mobile,password})

export const sendMobileCode=(mobile:string,type:CodeType)=>
    request.get<any,{code:string}>('/code',{params:{mobile,type}})

export const loginByMobile=(mobile:string,code:string)=>
    request.post<any,User>('/login',{mobile,code})

export const getUserInfo=()=>request.get<any,UserInfo>('/patient/myUser')

export const getPatientList=()=>request.get<any,PatientList>('/patient/mylist')

export const addPatient=(patient:Patient)=>request.post('/patient/add',patient)

export const editPatient=(patient:Patient)=>request.put('patient/update',patient)

export const deletePatient=(id:string)=>request.delete(`/patient/del/${id}`)

// 查询患者详情
export const getPatientDetail = (id: string) => request.get<any,Patient>(`/patient/info/${id}`)
// 以这个api为例子，markdown文档里面返回类型都加了any，因为实际使用函数全都是直接传所需要的数据data来，
// 不用res.data,但实际传回来的对象里面的属性虽然和所需要的patient类型里面的属性一毛一样，但实际类型不
// 一样，实际类型是一个Axios啥的，所以加any便于接收。应该是黑马后台把api返回形式改了，直接用data或者
// res便于接收
