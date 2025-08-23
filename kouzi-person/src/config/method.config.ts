export interface MethodType {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export const methodConfig = {
  // 标准化的算法类别数据
  categories: [
    { id: '1', name: '数组', slug: 'array' },
    { id: '2', name: '字符串', slug: 'string' },
    { id: '3', name: '链表', slug: 'linked-list' },
    { id: '4', name: '树', slug: 'tree' },
    { id: '5', name: '哈希表', slug: 'hash-table' },
    { id: '6', name: '动态规划', slug: 'dynamic-programming' },
    { id: '7', name: '贪心', slug: 'greedy' },
    { id: '8', name: '回溯', slug: 'backtracking' },
    { id: '9', name: '排序', slug: 'sorting' },
    { id: '10', name: '查找', slug: 'searching' }
  ]
};

export default methodConfig;
