import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 关于 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              关于
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              个人技术博客与算法集，分享前端开发、后端技术和算法知识。
            </p>
          </div>
          
          {/* 快速链接 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              快速链接
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  博客
                </Link>
              </li>
              <li>
                <Link to="/algorithms" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  算法集
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  关于我
                </Link>
              </li>
            </ul>
          </div>
          
          {/* 博客分类 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              博客分类
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/blog?category=frontend" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  前端开发
                </Link>
              </li>
              <li>
                <Link to="/blog?category=backend" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  后端开发
                </Link>
              </li>
              <li>
                <Link to="/blog?category=全栈" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  全栈开发
                </Link>
              </li>
              <li>
                <Link to="/blog?category=其他" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  其他
                </Link>
              </li>
            </ul>
          </div>
          
          {/* 联系方式 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              联系我
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <i className="fa-brands fa-github w-5 mr-2 text-gray-400"></i>
                <a href="https://github.com/Coninute?tab=repositories" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  GitHub
                </a>
              </li>
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <i className="fa-brands fa-git w-5 mr-2 text-gray-400"></i>
                <a href="https://gitee.com/qiaoyuning" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Gitee
                </a>
              </li>
               <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <i className="fa-brands fa-zhihu w-5 mr-2 text-gray-400"></i>
                </div>
                <a href="https://blog.csdn.net/duduanwang?spm=1000.2115.3001.5343" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  CSDN
                </a>
              </li>
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <i className="fa-solid fa-envelope w-5 mr-2 text-gray-400"></i>
                <a href="qiao252423@163.com" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  qiao252423@163.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {currentYear} TechPortfolio. 保留所有权利。
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              隐私政策
            </Link>
            <Link to="/terms" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              使用条款
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}