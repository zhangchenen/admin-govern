import request from '@/utils/request'

export interface ProfileFeature {
  id: string | number
  title: string
  percentage: number
  content: string
}

export interface ProfileChapter {
  id: string | number
  timestamp: string
  content: string
}
export const getProfileFeatures = () =>
  request<ProfileFeature[]>({
    url: '/user/feature',
  })

export const getProfileChapters = () =>
  request<ProfileChapter[]>({
    url: '/user/chapter',
  })
