export interface User {
    token: string
    id?: string
    account?: string
    mobile?: string
    avatar?: string
    refreshToken?: string
  }
  export type CodeType = 'login' | 'register'
  type OmitUser=Omit<User,'token'>
  export type UserInfo=OmitUser&{
    likeNumber: number
    collectionNumber: number
    score: number
    couponNumber: number
    orderInfo: {
      paidNumber: number
      receivedNumber: number
      shippedNumber: number
      finishedNumber: number
    }
  }
  // 家庭档案-患者信息
export type Patient = {
  id?: string
  name: string
  idCard: string
  defaultFlag: 0 | 1
  gender: 0 | 1
  genderValue?: string
  age?: number
}

// 家庭档案-患者信息列表
export type PatientList = Patient[]
