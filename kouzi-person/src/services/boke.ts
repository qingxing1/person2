import { get } from "@/utils/request";

// 博客查询参数类型定义
interface BlogQueryParams {
  // 博客标题（模糊查询，可选）
  title?: string;
  // 博客分类（可选）
  category?: string;
  // 博客标签（可选）
  tag?: string;
  // 博客状态（可选，只能是'draft'或'published'）
  status?: "draft" | "published";
  // 页码（可选，数字类型）
  page?: string;
  // 每页数量（可选，数字类型）
  size?: string;
}

// 获取博客列表
export async function getBokeList(query: BlogQueryParams) {
  return get("/blog/list", { params: query });
}

// 获取博客详情
export async function getBokeDetail(id: number) {
  return get(`/blog/${id}`);
}
