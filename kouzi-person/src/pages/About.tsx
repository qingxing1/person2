import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPersonInfo } from '@/services/person';
import { getAvatar } from "@/services/common";

export default function About() {
  const [personInfo, setPersonInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchPersonInfo();
    getAvatarUrl().then(url => setAvatarUrl(url));
  }, []);


  const fetchPersonInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPersonInfo();

      if (response.code === 200 && response.data && response.data.length > 0) {
        setPersonInfo(response.data[0]); // 始终展示第一个
      } else {
        setError(response.msg || '获取个人信息失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('获取个人信息失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 获取头像
  const getAvatarUrl = async () => {
    try {
      const res = await getAvatar();
      if (res && res.data && res.data.avatar) {
        return res.data.avatar;
      }
      return "/avatar.png";
    } catch (error) {
      return "/avatar.png";
    }
  };

  // 处理技能字符串为数组
  const skills = personInfo?.skills ? personInfo.skills.split(',').map((s: string) => s.trim()) : [];

  // 处理爱好字符串为数组
  const hobbies = personInfo?.hobbies ? personInfo.hobbies.split(',').map((h: string) => h.trim()) : [];

  // 模拟项目数据（实际项目中可从API获取）
  const mockProjects = [
    {
      id: 1,
      title: '个人博客系统',
      description: '基于 React + Node.js 开发的现代化博客平台，支持 Markdown 编辑、评论系统和响应式设计。',
      tech: ['React', 'Node.js', 'MongoDB', 'Express'],
      link: personInfo?.github ? `https://github.com/${personInfo.github}/blog` : '#',
    },
    {
      id: 2,
      title: '电商管理后台',
      description: '使用 Vue 3 + Element Plus 构建的电商管理系统，包含商品、订单、用户管理等功能模块。',
      tech: ['Vue 3', 'Element Plus', 'TypeScript', 'Axios'],
      link: personInfo?.github ? `https://github.com/${personInfo.github}/admin` : '#',
    },
  ];

  // 模拟工作经历（实际项目中可从API获取）
  const mockWorkExperience = [
    {
      year: '2023-至今',
      position: '全栈工程师',
      company: '科技有限公司',
      description: '负责公司前端和后端项目的开发与维护，参与技术架构设计和性能优化工作。',
    },
    {
      year: '2021-2023',
      position: '前端工程师',
      company: '互联网公司',
      description: '专注于前端界面开发，使用 React 和 Vue 构建用户友好的 Web 应用。',
    },
  ];

  // 模拟教育背景（实际项目中可从API获取）
  const mockEducation = [
    {
      year: '2017-2021',
      degree: '本科',
      major: '计算机科学与技术',
      school: '某大学',
      description: '系统学习计算机科学基础知识，包括数据结构、算法、操作系统等核心课程，并参与多个实践项目提升编程能力。',
    },
    {
      year: '2021-2023',
      degree: '硕士',
      major: '软件工程',
      school: '某科技大学',
      description: '深入研究软件工程理论与实践，专注于前端技术和用户体验优化，发表多篇相关学术论文。',
    },
  ];

  if (loading) {
    return (
      <LoadingComponent></LoadingComponent>
    );
  }

  if (error) {
    return (
     <ErrorComponent fetchPersonInfo={fetchPersonInfo} ></ErrorComponent>
    );
  }

  if (!personInfo) {
    return (
     <EmptyComponent></EmptyComponent>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-9xl mx-auto">
          {/* Content */}
          <div className="relative z-10">
            <div className="w-full rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-6 sm:p-10 border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Avatar */}
                <div className="relative mx-auto md:mx-0">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-36 md:h-36 rounded-full border-4 border-white/80 dark:border-slate-900/80 shadow-xl overflow-hidden">
                    <img
                      src={avatarUrl || "/avatar.png"}
                      alt="个人头像"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-3 border-white flex items-center justify-center shadow-md">
                    <i className="fa-solid fa-circle-check text-white text-base"></i>
                  </div>
                  
                </div>

                {/* Content Section */}
                <div className="flex-1 space-y-4">
                  {/* Info */}

                  <div className="space-y-3">
                    <div>
                      <h1 className="text-[clamp(1.2rem,2.5vw,2rem)] font-bold text-slate-900 dark:text-white text-center md:text-left mb-1.5">
                        {personInfo.nickname || personInfo.realName}
                      </h1>
                      {/* Personal Motto */}
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                        <i className="fa-solid fa-quote-left text-indigo-500 text-lg"></i>
                        <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base italic">
                          技术改变世界，代码创造未来
                        </p>
                        <i className="fa-solid fa-quote-right text-indigo-500 text-lg"></i>
                      </div>
                    </div>
                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-3">
                      {personInfo.github && (
                        <a
                          href={`https://github.com/${personInfo.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center h-10 gap-2 px-6 py-1.5 bg-white text-indigo-600 dark:bg-slate-900 dark:text-indigo-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 font-medium text-sm shadow-md flex-1"
                        >
                          <i className="fa-brands fa-github"></i>
                          <span>GitHub</span>
                        </a>
                      )}
                      {personInfo.website && (
                        <a
                          href={personInfo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center h-10 gap-2 px-6 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all duration-300 font-medium text-sm shadow-md flex-1"
                        >
                          <i className="fa-solid fa-globe"></i>
                          <span>简历</span>
                        </a>
                      )}
                        <Link
                        to="/contact"
                        className="flex items-center justify-center h-10 gap-2 px-6 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/40 transition-all duration-300 font-medium text-sm shadow-md flex-1"
                        >
                          <i className="fa-solid fa-envelope"></i>
                          <span>CSDN</span>
                        </Link>
                      <Link
                        to="/contact"
                        className="flex items-center justify-center h-10 gap-2 px-6 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/40 transition-all duration-300 font-medium text-sm shadow-md flex-1"
                        >
                          <i className="fa-solid fa-envelope"></i>
                          <span>联系我</span>
                        </Link>
                    </div>
                  </div>
                  

                  {/* Hobbies & Contact - Stack on mobile */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Hobbies */}
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-3">
                        <i className="fa-solid fa-heart text-pink-500 text-base"></i>
                        <span className="text-lg font-semibold text-slate-600 dark:text-slate-300">兴趣爱好</span>
                      </div>
                      <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
                        {hobbies.length > 0 ? (
                          hobbies.map((hobby: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200 rounded-full text-xs sm:text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              {hobby}
                            </span>
                          ))
                        ) : (
                          <div className="flex items-center gap-2 w-full text-center">
                            <i className="fa-solid fa-heart text-pink-500 text-sm"></i>
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 italic">暂无兴趣爱好数据</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-3">
                        <i className="fa-solid fa-paper-plane text-green-500 text-base"></i>
                        <span className="text-lg font-semibold text-slate-600 dark:text-slate-300">联系方式</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {personInfo.email && (
                          <div className="flex items-center gap-2 min-w-[45%] sm:min-w-[40%] md:min-w-[20%]">
                            <i className="fa-solid fa-envelope text-indigo-500 text-sm flex-shrink-0"></i>
                            <span className="text-sm text-slate-700 dark:text-slate-300 break-words">{personInfo.email}</span>
                          </div>
                        )}
                        {personInfo.phone && (
                          <div className="flex items-center gap-2 min-w-[45%] sm:min-w-[40%] md:min-w-[20%]">
                            <i className="fa-solid fa-phone text-green-500 text-sm flex-shrink-0"></i>
                            <span className="text-sm text-slate-700 dark:text-slate-300 break-words">{personInfo.phone}</span>
                          </div>
                        )}
                        {personInfo.wechat && (
                          <div className="flex items-center gap-2 min-w-[45%] sm:min-w-[40%] md:min-w-[20%]">
                            <i className="fa-brands fa-weixin text-green-500 text-sm flex-shrink-0"></i>
                            <span className="text-sm text-slate-700 dark:text-slate-300 break-words">{personInfo.wechat}</span>
                          </div>
                        )}
                        {personInfo.qq && (
                          <div className="flex items-center gap-2 min-w-[45%] sm:min-w-[40%] md:min-w-[20%]">
                            <i className="fa-brands fa-qq text-blue-500 text-sm flex-shrink-0"></i>
                            <span className="text-sm text-slate-700 dark:text-slate-300 break-words">{personInfo.qq}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-9xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-10">
        {/* About Me */}
        <div className="pb-8 sm:pb-10">
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <i className="fa-solid fa-user text-indigo-600 dark:text-indigo-400 text-sm"></i>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">关于我</h2>
          </div>
          <div className="space-y-2 sm:space-y-3 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            <p>{personInfo.bio}</p>
            {personInfo.education && personInfo.school && (
              <p>
                毕业于 <span className="text-indigo-600 dark:text-indigo-400 font-medium">{personInfo.school}</span>，获得
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">{personInfo.education}</span> 学位。
              </p>
            )}
            <p>
              我是一名热爱编程的全栈工程师，专注于前端技术开发和用户体验优化，始终追求编写高质量、可维护的代码。
              我坚信技术的价值在于解决实际问题，通过持续学习和实践不断提升自己的技术能力。
            </p>
          </div>
        </div>

        {/* Self Evaluation */}
        <div className="pb-8 sm:pb-10">
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <i className="fa-solid fa-star text-indigo-600 dark:text-indigo-400 text-sm"></i>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">自我评价</h2>
          </div>
          <div className="space-y-2 sm:space-y-3 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            <p>
              我是一个对技术充满热情的全栈工程师，具备扎实的前端开发能力和良好的后端技术基础。
              擅长将用户需求转化为高质量的技术实现，注重代码的可维护性和用户体验。
              具有良好的团队协作精神和解决问题的能力，能够快速适应新的技术栈和工作环境。
            </p>
            <p>
              平时喜欢关注前端技术发展趋势，不断学习和探索新技术，致力于提升自己的技术能力。
              坚信技术的价值在于解决实际问题，希望通过自己的努力创造出有价值的产品和服务。
            </p>
          </div>
        </div>

        {/* Education Background */}
        <div className="pb-8 sm:pb-10">
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <i className="fa-solid fa-graduation-cap text-indigo-600 dark:text-indigo-400 text-sm"></i>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">教育背景</h2>
          </div>

          {/* Timeline */}
          <div className="space-y-4 sm:space-y-5">
            {mockEducation.map((education, index) => (
              <div key={index} className="flex gap-3 sm:gap-4">
                {/* Year */}
                <div className="flex-shrink-0 pt-0.5">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs sm:text-sm font-medium">
                    {education.year.split('-')[0]}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">{education.degree} - {education.major}</h3>
                    <span className="text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm font-medium">{education.school}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">{education.year}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">{education.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Journey */}
        <div className="pb-8 sm:pb-10">
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <i className="fa-solid fa-road text-indigo-600 dark:text-indigo-400 text-sm"></i>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">历程</h2>
          </div>

          {/* Timeline */}
          <div className="space-y-4 sm:space-y-5">
            {mockWorkExperience.map((experience, index) => (
              <div key={index} className="flex gap-3 sm:gap-4">
                {/* Year */}
                <div className="flex-shrink-0 pt-0.5">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs sm:text-sm font-medium">
                    {experience.year.split('-')[0]}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">{experience.position}</h3>
                    <span className="text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm font-medium">{experience.company}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">{experience.year}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">{experience.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Skills Chart */}
        <div className="pb-8 sm:pb-10">
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <i className="fa-solid fa-code text-indigo-600 dark:text-indigo-400 text-sm"></i>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">技术栈</h2>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            {skills.map((skill: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm sm:text-base font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Featured Projects */}
        <div className="pb-8 sm:pb-10">
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <i className="fa-solid fa-laptop-code text-indigo-600 dark:text-indigo-400 text-sm"></i>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">项目经历</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {mockProjects.map((project) => (
              <a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg p-3 sm:p-4 bg-white/90 dark:bg-slate-800/90 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md hover:scale-[1.015] transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                  <i className="fa-solid fa-rocket text-indigo-500 text-xs sm:text-sm"></i>
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">{project.title}</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200 text-xs font-medium rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>

          {/* More Projects */}
          <div className="mt-5 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">更多项目请访问我的代码仓库</p>
              <div className="flex gap-2">
                {personInfo.github && (
                  <a
                    href={`https://github.com/${personInfo.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-500 transition-all duration-300"
                  >
                    <i className="fa-brands fa-github text-sm"></i>
                    GitHub
                  </a>
                )}
                {personInfo.gitee && (
                  <a
                    href={`https://gitee.com/${personInfo.gitee}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-500 transition-all duration-300"
                  >
                    <i className="fa-brands fa-git-alt text-sm"></i>
                    Gitee
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// 加载过程中使用的组件
function LoadingComponent() {
  return (
     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            {/* Hero */}
            <div className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 p-8 sm:p-12">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-36 h-36 rounded-full bg-white/20"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-8 w-48 bg-white/20 rounded"></div>
                  <div className="h-4 w-64 bg-white/20 rounded"></div>
                  <div className="flex gap-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-8 w-24 bg-white/20 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                  <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
}

// 错误处理组件
function ErrorComponent(props: { fetchPersonInfo: () => void }) {
  return (
     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <i className="fa-solid fa-exclamation-circle text-8xl text-red-400 mb-6"></i>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">加载失败</h2>
              <button
                onClick={props.fetchPersonInfo}
                className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
              >
                重新加载
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}

// 空组件
function EmptyComponent() {
  return (
     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <i className="fa-solid fa-user-circle text-8xl text-slate-300 dark:text-slate-600 mb-6"></i>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">暂无个人信息</h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">目前没有可展示的个人信息</p>
            </div>
          </div>
        </div>
      </div>
  );
}
