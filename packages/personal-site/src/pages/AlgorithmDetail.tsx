import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMethodDetail } from '@/services/method';
import { cn } from '@/lib/utils';
import { MdPreview } from 'md-editor-rt';
import { useTheme } from '@/hooks/useTheme';
import { useMemo } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';

// 根据难度返回不同的颜色类
const getDifficultyColor = (difficulty: string) => {
  const k = (difficulty || '').toLowerCase();
  if (k === 'easy' || difficulty === '简单') return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
  if (k === 'medium' || difficulty === '中等') return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
  if (k === 'hard' || difficulty === '困难') return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
  return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
};

// 根据难度返回中文标签
const getDifficultyLabel = (difficulty: string) => {
  const k = (difficulty || '').toLowerCase();
  if (k === 'easy') return '简单';
  if (k === 'medium') return '中等';
  if (k === 'hard') return '困难';
  return difficulty || '未知';
};

export default function AlgorithmDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'description' | 'solution' | 'answer'>('description');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<any | null>(null);
  const { isDark } = useTheme();

  // 监听 documentElement 的 class 变化，保证本页可实时感知主题切换
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const target = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDarkTheme(target.classList.contains('dark'));
    });
    observer.observe(target, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // 预览样式：背景透明 + 覆盖 md-editor-rt 背景变量（保持与外层卡片一致）
  const previewStyle = useMemo(() => {
    const style: React.CSSProperties & Record<string, string> = {
      backgroundColor: 'transparent',
    } as any;
    (style as any)['--md-bk-color'] = 'transparent';
    return style;
  }, []);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const numId = Number(id);
        if (!numId) throw new Error('无效的ID');
        const res = await getMethodDetail(numId);
        if (res.code === 200 && res.data) {
          setDetail(res.data);
        } else {
          throw new Error(res.msg || '获取详情失败');
        }
      } catch (e: any) {
        setError(e?.message || '网络错误，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // 设置页面 title
  usePageTitle(detail?.title || '算法详情');

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">加载中...</p>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold mb-4">详情未找到</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{error || '抱歉，请求的内容不存在或已被删除。'}</p>
        <button
          onClick={() => navigate('/algorithms')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          返回算法列表
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 算法头部 */}
      <header className="mb-10">
        <div className="flex items-center mb-4">
          <Link
            to="/algorithms"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
          >
            <i className="fa-solid fa-arrow-left mr-1"></i> 返回算法列表
          </Link>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white leading-tight">
            {detail.title}
          </h1>

          {detail.difficulty && (
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getDifficultyColor(detail.difficulty)}`}>
              {getDifficultyLabel(detail.difficulty)}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {detail.category && (
            <Link
              to={`/algorithms?category=${detail.category}`}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full"
            >
              {detail.category}
            </Link>
          )}
          {detail.createdAt && (
            <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
              创建于 {new Date(detail.createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          )}
        </div>
      </header>

      {/* 算法内容 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* 标签页导航 */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('description')}
              className={cn(
                "px-6 py-4 text-sm font-medium transition-colors",
                activeTab === 'description'
                  ? "border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400"
                  : "border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              问题描述
            </button>
            <button
              onClick={() => setActiveTab('solution')}
              className={cn(
                "px-6 py-4 text-sm font-medium transition-colors",
                activeTab === 'solution'
                  ? "border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400"
                  : "border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              解题思路/方案
            </button>
            <button
              onClick={() => setActiveTab('answer')}
              className={cn(
                "px-6 py-4 text-sm font-medium transition-colors",
                activeTab === 'answer'
                  ? "border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400"
                  : "border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              参考答案
            </button>
          </div>
        </div>

        {/* 标签页内容 */}
        <div className="p-6">
          {activeTab === 'description' && (
            <div className="prose prose-blue dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-4">问题描述</h2>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-6 text-sm border border-gray-100 dark:border-gray-700">
                <MdPreview
                  editorId="algo-desc"
                  key={(isDark || isDarkTheme) ? 'dark' : 'light'}
                  modelValue={detail.description || '暂无描述'}
                  theme={(isDark || isDarkTheme) ? 'dark' : 'light'}
                  style={previewStyle}
                  className="post-md-preview"
                />
              </div>
            </div>
          )}

          {activeTab === 'solution' && (
            <div className="prose prose-blue dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-4">解题思路</h2>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-6 text-sm border border-gray-100 dark:border-gray-700">
                <MdPreview
                  editorId="algo-solution"
                  key={(isDark || isDarkTheme) ? 'dark' : 'light'}
                  modelValue={detail.solution || '暂无方案'}
                  theme={(isDark || isDarkTheme) ? 'dark' : 'light'}
                  style={previewStyle}
                  className="post-md-preview"
                />
              </div>
            </div>
          )}

          {activeTab === 'answer' && (
            <div className="prose prose-blue dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-4">参考答案</h2>
              {detail.answer ? (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-6 text-sm border border-gray-100 dark:border-gray-700">
                  <MdPreview
                    editorId="algo-answer"
                    key={(isDark || isDarkTheme) ? 'dark' : 'light'}
                    modelValue={String(detail.answer)}
                    theme={(isDark || isDarkTheme) ? 'dark' : 'light'}
                    style={previewStyle}
                    className="post-md-preview"
                  />
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-6 text-sm text-gray-600 dark:text-gray-300">暂无答案</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}