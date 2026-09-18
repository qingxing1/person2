import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAvatar, addVisit } from "@/services/common";
import { getMethodList } from '@/services/method';
import { getBokeList } from '@/services/boke';
import { usePerson } from '@/contexts/PersonContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import * as echarts from "echarts";
import { extractTextFromMarkdown } from '@/utils/text-handle';

// 根据难度返回不同的颜色类
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "简单":
      return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
    case "中等":
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
    case "困难":
      return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
    
    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
  }
};

// 根据难度返回中文标签
const getDifficultyLabel = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "简单";
    case "medium":
      return "中等";
    case "hard":
      return "困难";
    default:
      return difficulty;
  }
};

// Home 组件
function Home() {
  const navigate = useNavigate();
  const { personInfo, avatarUrl } = usePerson();

  // 设置页面 title
  usePageTitle('首页');

  const stop = (e: React.MouseEvent) => e.stopPropagation();
  const onKeyGo = (go: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      go();
    }
  };
  // 用户名
  const [username, setUsername] = useState("技术开发者cao");
  // 首页展示列表（来自后端）
  const [latestBlogPosts, setLatestBlogPosts] = useState<any[]>([]);
  const [featuredAlgorithms, setFeaturedAlgorithms] = useState<any[]>([]);

  // 技能数据（来自后端）
  const [skills, setSkills] = useState<{ name: string; level: number }[]>([]);
  // 兴趣爱好（来自后端）
  const [hobbies, setHobbies] = useState<string[]>([]);
  // 图表容器 ref
  const skillChartRef = useRef<HTMLDivElement | null>(null);
  const hobbyChartRef = useRef<HTMLDivElement | null>(null);
  // 图表实例 ref（用于主题切换时更新）
  const skillChartInstRef = useRef<echarts.ECharts | null>(null);
  const hobbyChartInstRef = useRef<echarts.ECharts | null>(null);
  // 精美配色
  const palette = [
    "#60a5fa", // blue-400
    "#34d399", // emerald-400
    "#fbbf24", // amber-400
    "#fb7185", // rose-400
    "#a78bfa", // violet-400
    "#38bdf8", // sky-400
    "#f59e0b", // amber-500
    "#22d3ee", // cyan-400
    "#c084fc", // violet-400
  ];

  // 页面访问统计
  useEffect(() => {
    // 增加访问量统计
    addVisit().catch(err => {
      console.error('访问统计记录失败:', err);
    });
  }, []);
  
  useEffect(() => {
    if (personInfo) {
      setUsername(personInfo.nickname || "技术开发者cao");
      // 解析后端 skills 字符串为展示用数组
      if (personInfo.skills && Array.isArray(personInfo.skills)) {
        const parsed = personInfo.skills
          .map((name: string, idx: number) => ({
            name,
            // 给一个合理的展示分值，若未来后端提供 level 则可直接使用
            level: 75 + ((idx * 7) % 21), // 75-95 之间分布
          }));
        setSkills(parsed);
      } else {
        setSkills([]);
      }

      // 解析兴趣爱好（后端数组）
      if (personInfo.hobbies && Array.isArray(personInfo.hobbies)) {
        setHobbies(personInfo.hobbies);
      } else {
        setHobbies([]);
      }
    }
  }, [personInfo]);

  // 获取首页列表：最新博客（3条）与算法（3条）
  useEffect(() => {
    (async () => {
      try {
        const [blogRes, algRes] = await Promise.all([
          getBokeList({ page: '1', size: '3' } as any),
          getMethodList({ page: '1', limit: '3' } as any),
        ]);

        // 博客：兼容 data.list 或 data 直接为数组
        if (blogRes && blogRes.code === 200) {
          const list = (blogRes.data?.list ?? blogRes.data ?? []) as any[];
          setLatestBlogPosts(Array.isArray(list) ? list.slice(0, 3) : []);
        }

        // 算法：data 为数组
        if (algRes && algRes.code === 200) {
          const list = (algRes.data ?? []) as any[];
          setFeaturedAlgorithms(Array.isArray(list) ? list.slice(0, 3) : []);
        }
      } catch (e) {
        // 静默失败，避免打断首页
        console.error('加载首页列表失败', e);
      }
    })();
  }, []);

  // 初始化/更新技能饼图（甜甜圈 + 阴影 + 动画）
  useEffect(() => {
    if (!skillChartRef.current) return;
    const chart =
      echarts.getInstanceByDom(skillChartRef.current) || echarts.init(skillChartRef.current);
    skillChartInstRef.current = chart;

    const isDark = document.documentElement.classList.contains("dark");
    // 暗色提亮；亮色进一步加深对比
    const textColor = isDark ? "#e5e7eb" : "#1f2937"; // dark: gray-200, light: gray-800
    const subtleText = isDark ? "#cbd5e1" : "#374151"; // dark: slate-300, light: gray-700
    // 均等分：以技能数量作为总数（不再展示居中文本）

    const option: echarts.EChartsOption = {
      color: palette,
      tooltip: {
        trigger: "item",
        // 不展示百分比与数值，仅显示名称
        formatter: "{b}",
        backgroundColor: isDark ? "#0b1220" : "#ffffff",
        borderColor: isDark ? "#1f2937" : "#e5e7eb",
        textStyle: { color: isDark ? "#e5e7eb" : "#374151" },
        extraCssText: `box-shadow:${isDark ? "0 6px 18px rgba(0,0,0,0.45)" : "0 6px 18px rgba(0,0,0,0.12)"}; border-width:1px;`,
      },
      // 置为 plain，超出自动换行，可居中
      legend: {
        type: "plain",
        orient: "horizontal",
        left: "center",
        bottom: 6,
        itemGap: 16,
        padding: [28, 16, 0, 16], // 顶部留白，进一步拉开与图的距离
        textStyle: { color: subtleText },
        // 限制宽度，促使多行换行
        width: "80%",
      },
      series: [
        {
          name: "技能",
          type: "pie",
          radius: ["50%", "72%"],
          center: ["50%", "38%"], // 再上移，为图例留出更多空间
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 6,
            shadowBlur: 12,
            shadowColor: isDark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.12)",
            borderColor: isDark ? "#0b1220" : "#ffffff",
            borderWidth: 2,
          },
          emphasis: {
            scale: true,
            itemStyle: {
              shadowBlur: 18,
              shadowColor: isDark ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.2)",
            },
          },
          label: {
            show: true,
            // 不展示百分比
            formatter: "{b}",
            color: textColor,
            fontWeight: isDark ? 500 : 600,
          },
          labelLine: {
            show: true,
            length: 10,
            length2: 8,
            lineStyle: { color: subtleText },
          },
          // 均等分：每项 value 固定为 1
          data: skills.map((s) => ({ name: s.name, value: 1 })),
          animation: true,
          animationType: "scale",
          animationEasing: "exponentialInOut",
          animationDuration: 800,
        },
      ],
    };
    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      // 不主动 dispose，避免切换主题时频繁销毁；组件卸载时由 React 控制
    };
  }, [skills]);

  // 初始化/更新兴趣饼图（甜甜圈 + 阴影 + 动画）
  useEffect(() => {
    if (!hobbyChartRef.current) return;
    const chart =
      echarts.getInstanceByDom(hobbyChartRef.current) || echarts.init(hobbyChartRef.current);
    hobbyChartInstRef.current = chart;

    const isDark = document.documentElement.classList.contains("dark");
    // 暗色提亮；亮色进一步加深对比
    const textColor = isDark ? "#e5e7eb" : "#1f2937";
    const subtleText = isDark ? "#cbd5e1" : "#374151";

    const option: echarts.EChartsOption = {
      color: palette,
      tooltip: {
        trigger: "item",
        formatter: "{b}: {d}%",
        backgroundColor: isDark ? "#0b1220" : "#ffffff",
        borderColor: isDark ? "#1f2937" : "#e5e7eb",
        textStyle: { color: isDark ? "#e5e7eb" : "#374151" },
        extraCssText: `box-shadow:${isDark ? "0 6px 18px rgba(0,0,0,0.45)" : "0 6px 18px rgba(0,0,0,0.12)"}; border-width:1px;`,
      },
      legend: {
        type: "plain",
        orient: "horizontal",
        left: "center",
        bottom: 6,
        itemGap: 16,
        padding: [28, 16, 0, 16],
        textStyle: { color: subtleText },
        width: "80%",
      },
      series: [
        {
          name: "兴趣爱好",
          type: "pie",
          radius: ["50%", "72%"],
          center: ["50%", "42%"],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 6,
            shadowBlur: 12,
            shadowColor: isDark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.12)",
            borderColor: isDark ? "#0b1220" : "#ffffff",
            borderWidth: 2,
          },
          label: { show: true, formatter: "{b}", color: textColor, fontWeight: isDark ? 500 : 600 },
          labelLine: {
            show: true,
            length: 10,
            length2: 8,
            lineStyle: { color: subtleText },
          },
          data: hobbies.map((h) => ({ name: h, value: 1 })),
          animation: true,
          animationType: "scale",
          animationEasing: "exponentialInOut",
          animationDuration: 800,
        },
      ],
    };
    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [hobbies]);

  // 监听主题变化（html.classList: dark 切换），并更新两个图的主题相关样式
  useEffect(() => {
    const applyThemeToCharts = () => {
      const isDark = document.documentElement.classList.contains("dark");
      const textColor = isDark ? "#e5e7eb" : "#1f2937";
      const subtleText = isDark ? "#cbd5e1" : "#374151";
      const tooltipCommon = {
        backgroundColor: isDark ? "#0b1220" : "#ffffff",
        borderColor: isDark ? "#1f2937" : "#e5e7eb",
        textStyle: { color: isDark ? "#e5e7eb" : "#374151" },
        extraCssText: `box-shadow:${isDark ? "0 6px 18px rgba(0,0,0,0.45)" : "0 6px 18px rgba(0,0,0,0.12)"}; border-width:1px;`,
      } as const;

      // 技能图
      if (skillChartInstRef.current) {
        skillChartInstRef.current.setOption(
          {
            tooltip: tooltipCommon,
            legend: { textStyle: { color: subtleText } },
            series: [
              {
                label: { color: textColor },
                labelLine: { lineStyle: { color: subtleText } },
                itemStyle: {
                  shadowColor: isDark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.12)",
                  borderColor: isDark ? "#0b1220" : "#ffffff",
                },
                emphasis: {
                  itemStyle: {
                    shadowColor: isDark ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.2)",
                  },
                },
              },
            ],
            graphic: [
              {
                type: "text",
                left: "center",
                top: "center",
                style: { fill: textColor },
              },
            ],
          },
          false
        );
      }

      // 兴趣图
      if (hobbyChartInstRef.current) {
        hobbyChartInstRef.current.setOption(
          {
            tooltip: tooltipCommon,
            legend: { textStyle: { color: subtleText } },
            series: [
              {
                label: { color: textColor },
                labelLine: { lineStyle: { color: subtleText } },
                itemStyle: {
                  shadowColor: isDark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.12)",
                  borderColor: isDark ? "#0b1220" : "#ffffff",
                },
                emphasis: {
                  itemStyle: {
                    shadowColor: isDark ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.2)",
                  },
                },
              },
            ],
          },
          false
        );
      }
    };

    // 初次运行一次（如果用户在暗色/亮色之间切换过）
    applyThemeToCharts();

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName === "class") {
          applyThemeToCharts();
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [skills, hobbies]);
  return (
    <div className="space-y-16">
      {/* 英雄区域 */}
      <section className="flex flex-col md:flex-row items-center gap-10 py-10 min-h-70vh" >
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            你好，我是
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              {" "}
              {username}
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            专注于前端开发和算法研究，热衷于分享技术知识和编程经验。
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/blog"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              浏览博客
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </Link>
            <Link
              to="/algorithms"
              className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              查看算法集
            </Link>
          </div>

          {/* 社交媒体链接 */}
          <div className="flex items-center gap-4 pt-4">
            <a
              href="https://github.com/qingxing1/person2"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <i className="fa-brands fa-github text-xl"></i>
            </a>
            {/* <a
              href="https://gitee.com/qiaoyuning"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <i className="fa-brands fa-git text-xl"></i>
            </a> */}
            <a
              href="https://blog.csdn.net/m0_72682057?type=blog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <i className="fa-brands fa-zhihu text-xl"></i>
            </a>
            {/* <a
              href="mailto:qiao252423@163.com"
              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <i className="fa-solid fa-envelope text-xl"></i>
            </a> */}
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <div className="relative">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-1 shadow-xl">
              <img
                src={avatarUrl}
                alt="开发者头像"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.currentTarget.src = "/avatar.png";
                }}
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400">
                  <i className="fa-solid fa-code"></i>
                </div>
                <div>
                  <div className="text-sm font-medium">持续学习中</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    专注技术提升
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 技能与兴趣（双饼图） */}
      <section className="py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">我的技能与兴趣</h2>
          <Link
            to="/about"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
          >
            了解更多 <i className="fa-solid fa-arrow-right ml-1"></i>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
            <div className="text-lg font-semibold">技能</div>
            <div ref={skillChartRef} style={{ width: "100%", height: 320 }} />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
            <div className="text-lg font-semibold mb-2">兴趣爱好</div>
            <div ref={hobbyChartRef} style={{ width: "100%", height: 320 }} />
          </div>
        </div>
      </section>

      {/* 最新博客文章 */}
      <section className="py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">最新博客</h2>
          <Link
            to="/blog"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
          >
            查看全部 <i className="fa-solid fa-arrow-right ml-1"></i>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestBlogPosts.map((post: any) => (
            <article
              key={post.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/blog/${post.id}`)}
              onKeyDown={onKeyGo(() => navigate(`/blog/${post.id}`))}
              className="cursor-pointer bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 flex flex-col h-full"
            >
              {post.coverImage && (
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                </div>
              )}
              <div className="p-5 flex-grow flex flex-col">
                {post.category && (
                  <Link
                    to={`/blog?category=${post.category}`}
                    onClick={stop}
                    className="inline-block px-2 py-0.5 text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full mb-2 self-start"
                  >
                    {post.category}
                  </Link>
                )}

                <h3 className="text-lg font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-grow">
                  <Link to={`/blog/${post.id}`} onClick={stop}>{post.title}</Link>
                </h3>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                  {typeof post.content === 'string' ? `${ extractTextFromMarkdown(post.content).substring(0, 120)}...` : ''}
                </p>

                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-auto pt-2">
                  {post.createTime && (
                    <span>
                      {new Date(post.createTime).toLocaleDateString("zh-CN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                  {typeof post.viewCount !== 'undefined' && (
                    <>
                      <span className="mx-2">•</span>
                      <span><i className="fa-regular fa-eye mr-1"></i>{post.viewCount} 次阅读</span>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 精选算法 */}
      <section className="py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">精选算法</h2>
          <Link
            to="/algorithms"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
          >
            查看全部 <i className="fa-solid fa-arrow-right ml-1"></i>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredAlgorithms.map((algorithm: any) => (
            <div
              key={algorithm.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/algorithms/${algorithm.id}`)}
              onKeyDown={onKeyGo(() => navigate(`/algorithms/${algorithm.id}`))}
              className="cursor-pointer bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 flex flex-col h-full"
            >
              <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Link to={`/algorithms/${algorithm.id}`} onClick={stop}>{algorithm.title}</Link>
                  </h3>

                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getDifficultyColor(
                      algorithm.difficulty
                    )}`}
                  >
                    {getDifficultyLabel(algorithm.difficulty)}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">
                  {extractTextFromMarkdown(algorithm.description)}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/algorithms?category=${algorithm.category}`}
                    onClick={stop}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded"
                  >
                    {algorithm.category}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 联系区域 */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-2xl overflow-hidden">
        <div className="max-w-3xl mx-auto text-center text-white p-8">
          <h2 className="text-3xl font-bold mb-4">想了解更多？</h2>
          <p className="text-xl text-blue-100 mb-8">
            对我的博客或算法集有任何问题？或者想讨论合作机会？随时与我联系！
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            联系我
            <i className="fa-solid fa-envelope ml-2"></i>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
