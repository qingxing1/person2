import { useState, useEffect } from 'react';
import { SearchResult } from '@/lib/types';
import { getBokeList } from '@/services/boke';
import { getMethodList } from '@/services/method';

interface SearchOptions {
  searchInBlogs?: boolean;
  searchInAlgorithms?: boolean;
}

const defaultOptions: SearchOptions = {
  searchInBlogs: true,
  searchInAlgorithms: true
};

export function useSearch(query: string, options: SearchOptions = defaultOptions) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // 防抖处理，避免频繁搜索
    const timer = setTimeout(() => {
      if (!query.trim()) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      (async () => {
        try {
          const tasks: Array<Promise<any>> = [];
          if (options.searchInBlogs) {
            tasks.push(getBokeList({ title: query, page: '1', size: '10' }));
          }
          if (options.searchInAlgorithms) {
            tasks.push(getMethodList({ title: query, page: '1', limit: '10' } as any));
          }

          const responses = await Promise.all(tasks);
          const combined: SearchResult[] = [];

          // 博客结果（约定：第一个是博客，如果请求了）
          let idx = 0;
          if (options.searchInBlogs) {
            const r = responses[idx++];
            if (r && r.code === 200) {
              const list = (r.data?.list || []) as any[];
              combined.push(...list.map(item => ({ type: 'blog' as const, item })));
            }
          }
          // 算法结果
          if (options.searchInAlgorithms) {
            const r = responses[idx++];
            if (r && r.code === 200) {
              const list = (r.data || []) as any[];
              combined.push(...list.map(item => ({ type: 'algorithm' as const, item })));
            }
          }

          setResults(combined);
        } catch (e) {
          // 忽略错误，返回空结果
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      })();
    }, 300); // 300ms防抖

    return () => clearTimeout(timer);
  }, [query, options.searchInBlogs, options.searchInAlgorithms]);

  return { results, isSearching };
}