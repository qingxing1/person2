import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBokeDetail } from '@/services/boke';
import { CodeBlock } from '@/components/CodeBlock';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<any | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const numId = Number(id);
        if (!numId) throw new Error('无效的文章ID');
        const res = await getBokeDetail(numId);
        if (res.code === 200 && res.data) {
          setPost(res.data);
        } else {
          throw new Error(res.msg || '获取文章失败');
        }
      } catch (e: any) {
        setError(e?.message || '网络错误，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">加载中...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold mb-4">文章未找到</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{error || '抱歉，请求的文章不存在或已被删除。'}</p>
        <button
          onClick={() => navigate('/blog')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          返回博客列表
        </button>
      </div>
    );
  }

  // 自定义 markdown 渲染组件（代码块）
  const mdComponents = {
    code({ inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const code = String(children || '');
      if (!inline) {
        return <CodeBlock code={code} language={(match && match[1]) || 'text'} />;
      }
      return <code className={className} {...props}>{children}</code>;
    },
    img({ src = '', alt = '', ...props }: any) {
      // 直接输出图片，支持外链
      return (
        <img src={src} alt={alt} className="max-w-full h-auto rounded-lg" {...props} />
      );
    },
  } as any;

  const tags: string[] = typeof post.tags === 'string' && post.tags
    ? post.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
    : [];

  return (
    <article className="max-w-4xl mx-auto">
      {/* 文章头部 */}
      <header className="mb-10">
        <div className="flex items-center mb-4">
          <Link 
            to="/blog" 
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
          >
            <i className="fa-solid fa-arrow-left mr-1"></i> 返回博客列表
          </Link>
        </div>

        {post.category && (
          <Link 
            to={`/blog?category=${post.category}`}
            className="inline-block px-3 py-1 text-sm font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full mb-4"
          >
            {post.category}
          </Link>
        )}

        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mb-6 gap-x-6 gap-y-2">
          {post.createTime && (
            <div className="flex items-center">
              <i className="fa-regular fa-calendar mr-2"></i>
              <span>
                {new Date(post.createTime).toLocaleDateString('zh-CN', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
            </div>
          )}
          {typeof post.viewCount !== 'undefined' && (
            <div className="flex items-center">
              <i className="fa-regular fa-eye mr-2"></i>
              <span>{post.viewCount} 次阅读</span>
            </div>
          )}
          {post.author && (
            <div className="flex items-center">
              <i className="fa-regular fa-user mr-2"></i>
              <span>{post.author}</span>
            </div>
          )}
        </div>

        {post.coverImage && (
          <div className="rounded-xl overflow-hidden shadow-lg mb-8">
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-auto object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/avatar.png'; }}
            />
          </div>
        )}
      </header>

      

      {/* 文章内容 */}
      <div className="grid grid-cols-1 gap-8">
        {/* 文章内容区 */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
            <div className="prose prose-blue dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                {post.content || ''}
              </ReactMarkdown>
            </div>

            {/* 标签 */}
            {tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-3">标签</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string) => (
                    <Link
                      key={tag}
                      to={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}