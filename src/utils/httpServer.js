import { httpServer } from '@/utils/axiosFormat'
export function getImgCaptcha(obj) {
  return httpServer('post', 'common/getImgCaptcha', {}, obj)
}
export function login(obj) {
  return httpServer('post', 'login', {}, obj)
}
