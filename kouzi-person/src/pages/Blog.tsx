import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { getBokeList } from '@/services/boke';
import { cn } from '@/lib/utils';
import { bokeConfig } from '@/config/boke.config';
import { extractTextFromMarkdown } from '@/utils/text-handle'

// 博客卡片组件 - 适配后端数据结构
function BlogCard({ post }: { post: any }) {
  const navigate = useNavigate();
  const goDetail = () => navigate(`/blog/${post.id}`);
  const stop = (e: React.MouseEvent) => e.stopPropagation();
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goDetail();
    }
  };
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={goDetail}
      onKeyDown={onKey}
      className="cursor-pointer bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
    >
      {post.coverImage && (
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
            onError={(e) => {
              e.currentTarget.src = '/avatar.png';
            }}
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center mb-3">
          <Link 
            to={`/blog?category=${post.category}`}
            onClick={stop}
            className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full mr-2"
          >
            {post.category}
          </Link>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(post.createTime).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <i className="fa-regular fa-eye mr-1"></i> {post.viewCount} 次阅读
          </span>
        </div>
        
        <h2 className="text-xl font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <Link to={`/blog/${post.id}`} onClick={stop}>{post.title}</Link>
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          { extractTextFromMarkdown(post.content).substring(0, 150) }
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags && post.tags.split(',').map((tag: string, index: number) => (
            <span
              key={index}
              className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded"
            >
              #{tag.trim()}
            </span>
          ))}
        </div>
        
        <Link
          to={`/blog/${post.id}`}
          onClick={stop}
          className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          阅读更多<i className="fa-solid fa-arrow-right ml-1 text-xs"></i>
        </Link>
      </div>
    </article>
  );
}

// 分类列表组件
function CategoryList({ 
  categories, 
  activeCategory, 
  onSelectCategory 
}: { 
  categories: Category[]; 
  activeCategory?: string; 
  onSelectCategory: (category: string) => void;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">文章分类</h3>
      <div className="space-y-2">
        <button
          onClick={() => onSelectCategory('')}
          className={cn(
            "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors",
            !activeCategory ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
          )}
        >
          全部分类
        </button>
        {categories.map(category => (
          <button
            key={category.slug}
            onClick={() => onSelectCategory(category.name)}  // 传递汉字名称
            className={cn(
              "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors",
              activeCategory === category.name  // 比较汉字名称
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// 标签云组件
function TagCloud({ 
  tags, 
  activeTag, 
  onSelectTag 
}: { 
  tags: Tag[]; 
  activeTag?: string; 
  onSelectTag: (tag: string) => void;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">热门标签</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectTag('')}
          className={cn(
            "px-3 py-1 rounded-full text-sm transition-colors",
            !activeTag ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          )}
        >
          全部标签
        </button>
        {tags.map(tag => (
          <button
            key={tag.slug}
            onClick={() => onSelectTag(tag.name)}  // 传递汉字名称
            className={cn(
              "px-3 py-1 rounded-full text-sm font-medium transition-colors",
              activeTag === tag.name  // 比较汉字名称
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            )}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');
  const [activeTag, setActiveTag] = useState(searchParams.get('tag') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('title') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [size] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  useEffect(() => {
    const category = searchParams.get('category') || '';
    const tag = searchParams.get('tag') || '';
    const title = searchParams.get('title') || '';
    
    // 如果 category 是 slug，转换为中文名用于显示
    const categoryName = bokeConfig.categories.find(c => c.slug === category)?.name || category;
    const tagName = bokeConfig.tags.find(t => t.slug === tag)?.name || tag;
    
    setActiveCategory(categoryName);
    setActiveTag(tagName);
    setSearchQuery(title);
    // 重置到第一页并加载
    setPage(1);
    setHasMore(true);
    loadPage(1, true, { category: categoryName, tag: tagName, title });
  }, [searchParams]);
  
  const loadPage = useCallback(
    async (
      targetPage: number,
      replace: boolean = false,
      params: { category?: string; tag?: string; title?: string } = {}
    ) => {
      try {
        if (targetPage === 1 && replace) setLoading(true);
        else setIsLoadingMore(true);
        setError(null);

        const queryParams: any = {};
        if (params.category) queryParams.category = params.category;
        if (params.tag) queryParams.tag = params.tag;
        if (params.title) queryParams.title = params.title;
        queryParams.page = String(targetPage);
        queryParams.size = String(size);

        const response = await getBokeList(queryParams);
        if (response.code === 200 && response.data) {
          const list = (response.data.list || []) as any[];
          setPosts(prev => (replace ? list : [...prev, ...list]));
          setHasMore(Array.isArray(list) ? list.length >= size : false);
          setPage(targetPage);
        } else {
          setError(response.msg || '获取博客列表失败');
        }
      } catch (err) {
        setError('网络错误，请稍后重试');
        console.error('获取博客列表失败:', err);
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [size]
  );
  
  // 防抖搜索 - 1秒防抖
  const handleSearch = useCallback((searchTerm: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (searchTerm) next.set('title', searchTerm);
      else next.delete('title');
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

  const debouncedSearch = useCallback(debounce(handleSearch, 1000), [handleSearch]);

  // 获取当前筛选条件的标题
  const getFilterTitle = () => {
    if (searchQuery) {
      return `搜索: "${searchQuery}"`;
    }
    
    if (activeCategory) {
      return `分类: ${activeCategory}`;
    }
    
    if (activeTag) {
      return `标签: ${activeTag}`;
    }
    
    return '全部博客文章';
  };

  // 筛选文章
  const filteredPosts = posts.filter(post => {
    if (activeCategory && post.category !== activeCategory) return false;
 if (activeTag && (!post.tags || !post.tags.includes(activeTag))) return false;
    return true;
  });

  // 处理筛选
  const handleCategoryFilter = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      const categorySlug = bokeConfig.categories.find(c => c.name === category)?.slug || category;
      params.set('category', categorySlug);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  const handleTagFilter = (tag: string) => {
    const params = new URLSearchParams(searchParams);
    if (tag) {
      const tagSlug = bokeConfig.tags.find(t => t.name === tag)?.slug || tag;
      params.set('tag', tagSlug);
    } else {
      params.delete('tag');
    }
    setSearchParams(params);
  };

  // 清除筛选
  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };
  
  return (
    <div className="blog-page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{getFilterTitle()}</h1>
        <p className="text-gray-600 dark:text-gray-400">
        记录开发思路的文字分享
        </p>
        {(activeCategory || activeTag) && (
          <div className="mt-2">
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              <i className="fa-solid fa-times mr-1"></i>清除筛选
            </button>
          </div>
        )}
        {/* 搜索框 */}
          <div className="relative mt-6">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索博客文章..."
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery(value);
                  debouncedSearch(value);
                }}
                className="w-full px-4 py-3 pl-12 pr-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    debouncedSearch('');
                  }}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                正在搜索... <span className="animate-pulse">|</span>
              </div>
            )}
          </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 侧边栏 - 分类和标签 */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
            <CategoryList 
              categories={bokeConfig.categories} 
              activeCategory={activeCategory}
              onSelectCategory={handleCategoryFilter}
            />
            <div className="border-t border-gray-200 dark:border-gray-700 my-5 pt-5"></div>
            <TagCloud 
              tags={bokeConfig.tags} 
              activeTag={activeTag}
              onSelectTag={handleTagFilter}
            />
          </div>
        </div>
        
        {/* 主内容区 - 博客文章列表 */}
        <div className="lg:col-span-3">
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-10 text-center border border-gray-100 dark:border-gray-700">
              <i className="fa-solid fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
              <h3 className="text-xl font-medium mb-2">加载失败</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {error}
              </p>
              <button
                onClick={() => loadPage(1, true, { category: activeCategory, tag: activeTag, title: searchQuery })}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                重新加载
              </button>
            </div>
          )}

          {!loading && !error && filteredPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {!loading && !error && filteredPosts.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-10 text-center border border-gray-100 dark:border-gray-700">
              <i className="fa-solid fa-search text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
              <h3 className="text-xl font-medium mb-2">未找到文章</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {activeCategory || activeTag ? '该筛选条件下暂无文章' : '暂无文章，敬请期待'}
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                查看全部文章
              </button>
            </div>
          )}

          {!loading && !error && filteredPosts.length > 0 && hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={() => loadPage(page + 1, false, { category: activeCategory, tag: activeTag, title: searchQuery })}
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
    </div>
  );
}