import { useLocation, Link, useNavigate } from 'react-router-dom';
import { SearchResult } from '@/lib/types';
import { cn } from '@/lib/utils';

// 根据难度返回不同的颜色类
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
    case 'medium':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
    case 'hard':
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
    default:
      return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
  }
};

// 根据难度返回中文标签
const getDifficultyLabel = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return '简单';
    case 'medium':
      return '中等';
    case 'hard':
      return '困难';
    default:
      return difficulty;
  }
};

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, query } = location.state as { results: SearchResult[], query: string };
  
  // 分离博客和算法结果
  const blogResults = results.filter(item => item.type === 'blog');
  const algorithmResults = results.filter(item => item.type === 'algorithm');
  
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-16 max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
          <i className="fa-solid fa-search text-2xl text-gray-400"></i>
        </div>
        <h1 className="text-2xl font-bold mb-2">未找到结果</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          没有找到与" {query} "相关的内容，请尝试其他关键词。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            返回首页
          </button>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i> 返回上一页
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center mb-4"
        >
          <i className="fa-solid fa-arrow-left mr-1"></i> 返回
        </button>
        
        <h1 className="text-3xl font-bold mb-2">搜索结果</h1>
        <p className="text-gray-600 dark:text-gray-400">
          找到 {results.length} 个与" {query} "相关的结果
        </p>
      </div>
      
      {/* 博客结果 */}
      {blogResults.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <i className="fa-solid fa-newspaper text-orange-500 mr-2"></i>
            博客文章 ({blogResults.length})
          </h2>
          
          <div className="space-y-4">
            {blogResults.map((result, index) => {
              const post = result.item;
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-2">
                    <Link 
                      to={`/blog?category=${post.category.slug}`}
                      className="inline-block px-2 py-0.5 text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full mr-2"
                    >
                      {post.category.name}
                    </Link>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(post.publishedAt).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <Link
                        key={tag.id}
                        to={`/blog?tag=${tag.slug}`}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded"
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
      
      {/* 算法结果 */}
      {algorithmResults.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <i className="fa-solid fa-code text-green-500 mr-2"></i>
            算法 ({algorithmResults.length})
          </h2>
          
          <div className="space-y-4">
            {algorithmResults.map((result, index) => {
              const algorithm = result.item;
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Link to={`/algorithms/${algorithm.slug}`}>{algorithm.title}</Link>
                    </h3>
                    
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getDifficultyColor(algorithm.difficulty)}`}>
                      {getDifficultyLabel(algorithm.difficulty)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                    {algorithm.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/algorithms?category=${algorithm.category}`}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded"
                    >
                      {algorithm.category}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}