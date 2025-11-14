import {get} from '@/utils/request';

interface Query {
  page?:string;
  limit?:string;
  title?:string;
  difficulty?:string;
  category?:string;
}

// 算法分类接口响应类型
interface Item {
  id: number;
  name: string;
  slug: string;
}

type  MethodList = Item[];


// 获取方法列表
export async function getMethodList(query?:Query) {
  return get('/method/list',{params:query});
}

// 获取方法详情
export async function getMethodDetail(id: number) {
  return get(`/method/${id}`);
}

// 获取方法分类
export async function getMethodCategory(): Promise<MethodList> {
  return get('algorithm/problem/config/categories');
}
