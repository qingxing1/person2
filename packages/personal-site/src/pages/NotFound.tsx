import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '@/hooks/useSearch';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function NotFound() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { results } = useSearch(searchQuery);

  // 设置页面 title
  usePageTitle('页面未找到');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && results.length > 0) {
      navigate('/search', { state: { results, query: searchQuery } });
    }
  };
  
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
      <div className="w-24 h-24 mb-6 relative">
        <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900 rounded-full animate-pulse"></div>
        <div className="relative flex items-center justify-center w-full h-full">
          <i className="fa-solid fa-exclamation-triangle text-4xl text-blue-600 dark:text-blue-400"></i>
        </div>
      </div>
      
      <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">404</h1>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">页面未找到</h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        抱歉，您访问的页面不存在或已被移动。请检查URL或使用下方搜索功能查找内容。
      </p>
      
      {/* 搜索框 */}
      <form onSubmit={handleSearch} className="w-full max-w-md mb-8">
        <div className="flex">
          <input
            type="text"
            placeholder="搜索文章或算法..."
            className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            disabled={!searchQuery.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fa-solid fa-search"></i>
          </button>
        </div>
      </form>
      
      {/* 操作按钮 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          返回首页
        </button>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> 返回上一页
        </button>
      </div>
    </div>
  );
}