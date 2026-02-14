import {get} from '@/utils/request';

// 获取个人信息
export async function getPersonInfo() {
  return get('/personal');
}
