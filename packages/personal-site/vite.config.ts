import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

function getPlugins() {
  const plugins = [react(), tsconfigPaths()];
  return plugins;
}

// 开发环境的后端地址
const devBackendUrl = 'http://39.106.45.186:6999';
// const devBackendUrl = 'http://localhost:6999';

export default defineConfig({
  plugins: getPlugins(),
  define: {
    'process.env': process.env
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    open: true, // 启动后自动打开浏览器
    port: 3000, // 指定前端启动端口
    cors: true,
    proxy: {
      '/api': {
        target: devBackendUrl,
        ws: true,
        changeOrigin: true
      },
      // 后端上传的图片（数据库中返回相对路径 /static/...），开发时代理到后端
      '/static': {
        target: devBackendUrl,
        changeOrigin: true
      }
    }
  }
});
