// 共享的博客类型定义
export interface Blog {
  id: string;
  title: string;
  author: string;
  tags: string;
  category: string;
  createTime: string;
  status: 'published' | 'draft';
  content: string;
  coverImage: string;
}

export interface BlogFormData {
  title: string;
  tags: string;
  category: string;
  status: 'published' | 'draft';
  content: string;
  coverImage: string;
}

// 共享的API响应类型
export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

// 共享的分页类型
export interface PaginationParams {
  page: number;
  size: number;
  [key: string]: any;
}

export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
}