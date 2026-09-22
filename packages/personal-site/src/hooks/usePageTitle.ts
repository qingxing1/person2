import { useEffect } from 'react';

/**
 * 自定义 Hook：设置页面 title
 * @param title 页面标题
 * @param includeSiteName 是否包含网站名称后缀
 */
export function usePageTitle(title: string, includeSiteName: boolean = true) {
  useEffect(() => {
    const siteName = '个人技术笔记';
    document.title = includeSiteName
      ? `${title} - ${siteName}`
      : title;

    // 组件卸载时恢复默认 title
    return () => {
      document.title = `${siteName} - 专注前端开发与算法研究`;
    };
  }, [title, includeSiteName]);
}
