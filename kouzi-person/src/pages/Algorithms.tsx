import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { getMethodList } from '@/services/method';
import { cn } from '@/lib/utils';
import { methodConfig } from '@/config/method.config';
import { extractTextFromMarkdown } from '@/utils/text-handle';

// 算法卡片组件
function AlgorithmCard({ algorithm }: { algorithm: any }) {
  const navigate = useNavigate();
  const goDetail = () => navigate(`/algorithms/${algorithm.id}`);
  const stop = (e: React.MouseEvent) => e.stopPropagation();
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goDetail();
    }
  };
  // 根据难度返回不同的颜色类
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '简单':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case '中等':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case '困难':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={goDetail}
      onKeyDown={onKey}
      className="cursor-pointer bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 flex flex-col h-full"
    >
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <Link 
            to={`/algorithms/${algorithm.id}`}
            onClick={stop}
            className="text-lg font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {algorithm.title}
          </Link>
          
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getDifficultyColor(algorithm.difficulty)}`}>
            {algorithm.difficulty}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          { extractTextFromMarkdown(algorithm.description)}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Link
            to={`/algorithms?category=${algorithm.category}`}
            onClick={stop}
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded"
          >
            {algorithm.category}
          </Link>
        </div>
      </div>
      
      <div className="px-5 pb-5">
        <Link
          to={`/algorithms/${algorithm.id}`}
          onClick={stop}
          className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          查看详情
          <i className="fa-solid fa-arrow-right ml-1 text-xs"></i>
        </Link>
      </div>
    </div>
  );
}

// 难度筛选组件
function DifficultyFilter({ 
  activeDifficulty, 
  onSelectDifficulty 
}: { 
  activeDifficulty?: string; 
  onSelectDifficulty: (difficulty: string) => void;
}) {
  const difficulties = [
    { value: '', label: '全部难度' },
    { value: '简单', label: '简单' },
    { value: '中等', label: '中等' },
    { value: '困难', label: '困难' }
  ];
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <i className="fa-solid fa-signal text-yellow-500 mr-2"></i>
        难度
      </h3>
      <ul className="space-y-1">
        {difficulties.map(difficulty => (
          <li key={difficulty.value}>
            <button
              onClick={() => onSelectDifficulty(difficulty.value)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                activeDifficulty === difficulty.value 
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              )}
            >
              {difficulty.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 类别筛选组件
function CategoryFilter({ 
  categories,
  activeCategory, 
  onSelectCategory 
}: { 
  categories: Array<{id: string; name: string; slug: string}>;
  activeCategory?: string; 
  onSelectCategory: (category: string) => void;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <i className="fa-solid fa-tags text-purple-500 mr-2"></i>
        类别
      </h3>
      <ul className="space-y-1">
        <li>
          <button
            onClick={() => onSelectCategory('')}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
              !activeCategory 
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium" 
                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            )}
          >
            全部类别
          </button>
        </li>
        {categories.map(category => (
          <li key={category.id}>
            <button
              onClick={() => onSelectCategory(category.name)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                activeCategory === category.name
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              )}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Algorithms() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [algorithms, setAlgorithms] = useState<any[]>([]);
  // 类别从配置文件中获取
  const [categories, setCategories] = useState<Array<{id: string; name: string; slug: string}>>(methodConfig.categories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const activeDifficulty = searchParams.get('difficulty') || '';
  const activeCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';

  const loadPage = useCallback(async (targetPage: number, replace: boolean = false) => {
    try {
      if (targetPage === 1 && replace) setLoading(true);
      else setIsLoadingMore(true);
      setError(null);

      const query: any = {};
      if (searchQuery) query.title = searchQuery;
      if (activeDifficulty) query.difficulty = activeDifficulty;
      if (activeCategory) query.category = activeCategory;
      query.page = String(targetPage);
      query.limit = String(limit);

      const response = await getMethodList(query);
      if (response.code === 200 && response.data) {
        const list = response.data as any[];
        setAlgorithms(prev => (replace ? list : [...prev, ...list]));
        setCategories(methodConfig.categories);
        setHasMore(Array.isArray(list) ? list.length >= limit : false);
        setPage(targetPage);
      } else {
        setError('获取算法列表失败');
      }
    } catch (err) {
      setError('获取算法列表失败，请稍后重试');
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [searchQuery, activeDifficulty, activeCategory, limit]);

  useEffect(() => {
    // 筛选变化时重置到第一页
    setPage(1);
    setHasMore(true);
    loadPage(1, true);
  }, [searchQuery, activeDifficulty, activeCategory, loadPage]);

  const handleReload = () => loadPage(1, true);

  // 防抖搜索
  const handleSearch = useCallback((searchTerm: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (searchTerm) next.set('search', searchTerm);
      else next.delete('search');
      return next;
    });
  }, [setSearchParams]);

  // 防抖函数
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const debouncedSearch = useCallback(debounce(handleSearch, 300), [handleSearch]);



  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            算法题库
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            精选算法题目，助你提升编程能力
          </p>
          {/* 顶部搜索框 */}
          <div className="mt-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="搜索算法..."
                defaultValue={searchQuery}
                onChange={(e) => {
                  debouncedSearch(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              获取数据失败
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {error}
            </p>
            <button
              onClick={handleReload}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              重新加载
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 左侧筛选栏 */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  筛选条件
                </h2>
                
                {/* 搜索框已移动到顶部，这里移除 */}
                
                <DifficultyFilter
                  activeDifficulty={activeDifficulty}
                  onSelectDifficulty={(difficulty) => {
                    setSearchParams(prev => {
                      const next = new URLSearchParams(prev);
                      if (difficulty) next.set('difficulty', difficulty);
                      else next.delete('difficulty');
                      return next;
                    });
                  }}
                />
                
                <CategoryFilter
                  categories={categories}
                  activeCategory={activeCategory}
                  onSelectCategory={(category) => {
                    setSearchParams(prev => {
                      const next = new URLSearchParams(prev);
                      if (category) next.set('category', category);
                      else next.delete('category');
                      return next;
                    });
                  }}
                />
              </div>
            </div>

            {/* 右侧内容区 */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {algorithms.map(algorithm => (
                  <AlgorithmCard key={algorithm.id} algorithm={algorithm} />
                ))}
              </div>
              
              {algorithms.length === 0 && (
                <div className="text-center py-12">
                  <i className="fas fa-search text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    暂无算法题目
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    请尝试调整筛选条件
                  </p>
                </div>
              )}

              {algorithms.length > 0 && hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => loadPage(page + 1, false)}
                    disabled={isLoadingMore}
                    className={cn(
                      "px-6 py-2 rounded-md text-white",
                      isLoadingMore ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    )}
                  >
                    {isLoadingMore ? '加载中...' : '加载更多'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}