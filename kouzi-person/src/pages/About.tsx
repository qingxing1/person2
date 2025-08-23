import { useState, useEffect } from 'react';
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto mb-4"></div>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-10">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <i className="fa-solid fa-exclamation-triangle text-6xl text-red-400 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            加载失败
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {error}
          </p>
          <button
            onClick={fetchPersonInfo}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  if (!personInfo) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <i className="fa-solid fa-user text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            暂无个人信息
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            暂无个人信息展示
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">关于我</h1>
        <div className="h-1 w-20 bg-blue-600 dark:bg-blue-400 rounded-full mb-8"></div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* 左侧：个人简介 */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-32 h-32 mb-4">
                <img 
                  src={avatarUrl || "/avatar.png"} 
                  alt="个人头像" 
                  className="w-full h-full object-cover rounded-full border-4 border-blue-100 dark:border-blue-900"
                />
              </div>
              <h2 className="text-xl font-bold mb-1">{personInfo.nickname || personInfo.realName}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{personInfo.bio}</p>
              
              <div className="w-full border-t border-gray-200 dark:border-gray-700 my-4 pt-4">
                <ul className="space-y-3 text-left w-full">
                  {personInfo.email && (
                    <li className="flex items-start">
                      <i className="fa-solid fa-envelope text-blue-600 dark:text-blue-400 mt-1 mr-3 w-5 text-center"></i>
                      <span className="text-gray-700 dark:text-gray-300">{personInfo.email}</span>
                    </li>
                  )}
                  {personInfo.location && (
                    <li className="flex items-start">
                      <i className="fa-solid fa-map-marker-alt text-blue-600 dark:text-blue-400 mt-1 mr-3 w-5 text-center"></i>
                      <span className="text-gray-700 dark:text-gray-300">{personInfo.location}</span>
                    </li>
                  )}
                  {personInfo.birthday && (
                    <li className="flex items-start">
                      <i className="fa-solid fa-calendar text-blue-600 dark:text-blue-400 mt-1 mr-3 w-5 text-center"></i>
                      <span className="text-gray-700 dark:text-gray-300">{personInfo.birthday}</span>
                    </li>
                  )}
                  {personInfo.gender && (
                    <li className="flex items-start">
                      <i className="fa-solid fa-user text-blue-600 dark:text-blue-400 mt-1 mr-3 w-5 text-center"></i>
                      <span className="text-gray-700 dark:text-gray-300">{personInfo.gender}</span>
                    </li>
                  )}
                </ul>
              </div>
              
              {/* 社交媒体链接 */}
              <div className="flex items-center justify-center gap-4">
                {personInfo.github && (
                  <a href={`https://github.com/${personInfo.github}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <i className="fa-brands fa-github text-xl"></i>
                  </a>
                )}
                {personInfo.website && (
                  <a href={personInfo.website} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <i className="fa-solid fa-globe text-xl"></i>
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {/* 兴趣爱好 */}
          {hobbies.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <i className="fa-solid fa-heart text-red-500 mr-2"></i>
                兴趣爱好
              </h3>
              <div className="flex flex-wrap gap-2">
                {hobbies.map((hobby: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* 联系方式 */}
          {(personInfo.phone || personInfo.qq || personInfo.wechat) && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <i className="fa-solid fa-phone text-green-500 mr-2"></i>
                联系方式
              </h3>
              <ul className="space-y-3">
                {personInfo.phone && (
                  <li className="flex items-center">
                    <i className="fa-solid fa-phone-alt text-gray-400 mr-3 w-5 text-center"></i>
                    <span className="text-gray-700 dark:text-gray-300">{personInfo.phone}</span>
                  </li>
                )}
                {personInfo.qq && (
                  <li className="flex items-center">
                    <i className="fa-brands fa-qq text-blue-400 mr-3 w-5 text-center"></i>
                    <span className="text-gray-700 dark:text-gray-300">{personInfo.qq}</span>
                  </li>
                )}
                {personInfo.wechat && (
                  <li className="flex items-center">
                    <i className="fa-brands fa-weixin text-green-400 mr-3 w-5 text-center"></i>
                    <span className="text-gray-700 dark:text-gray-300">{personInfo.wechat}</span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
        
        {/* 右侧：详细信息 */}
        <div className="lg:col-span-2 space-y-10">
          {/* 个人简介 */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4">个人简介</h2>
            <div className="prose prose-blue dark:prose-invert max-w-none">
              <p className="mb-4">
                {personInfo.bio}
              </p>
              {personInfo.education && personInfo.school && (
                <p className="mb-4">
                  毕业于{personInfo.school}，获得{personInfo.education}学位。
                </p>
              )}
              <p>
                我是一名热爱编程的全栈工程师，专注于前端技术开发和用户体验优化。
              </p>
            </div>
          </section>
          
          {/* 技能 */}
          {skills.length > 0 && (
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4">专业技能</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
          
          {/* 地址信息 */}
          {personInfo.address && (
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4">地址信息</h2>
              <p className="text-gray-700 dark:text-gray-300">
                {personInfo.address}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}