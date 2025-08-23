// 基于Axios的请求工具 - TypeScript版本
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// 开发环境使用代理，生产环境使用实际地址
const isDev = import.meta.env.DEV;
const API_BASE_URL = isDev ? '/api' : import.meta.env.VITE_API_BASE_URL || '/api';

// 创建axios实例
const request: AxiosInstance = axios.create({
  baseURL: API_BASE_URL, // 开发环境自动代理到127.0.0.1:8081
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 封装请求方法
export async function get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return request.get(url, config);
}

export async function post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return request.post(url, data, config);
}

export async function put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return request.put(url, data, config);
}

export async function del<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return request.delete(url, config);
}

// 导出axios实例以供特殊需求使用
export default request;