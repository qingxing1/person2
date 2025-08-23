import {get} from '@/utils/request';

interface Query {
  page?:string;
  limit?:string;
  title?:string;
  difficulty?:string;
  category?:string;
}

// 获取方法列表
export async function getMethodList(query?:Query) {
  return get('/method/list',{params:query});
}

// 获取方法详情
export async function getMethodDetail(id: number) {
  return get(`/method/${id}`);
}
