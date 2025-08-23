import {get,post} from '@/utils/request';

// 获取头像
export async function getAvatar() {
  return get('/user/one/info?id=1');
}

// 增加访问量
export async function addVisit() {
  return post('/visit-stats/increment');
}
