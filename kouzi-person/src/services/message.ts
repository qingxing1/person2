import { post } from "@/utils/request";

export interface MessageInterface {
  name: string;
  email: string;
  subject: string;
  content: string;  // 后端要求使用content字段
  address: string;
}

// 发送消息
export async function sendMessage(data: MessageInterface) {
  return post("/message", data);
}
