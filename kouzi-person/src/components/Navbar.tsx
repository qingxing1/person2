import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onSearch: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };
  
  const openBingSearch = (q: string) => {
    const term = q.trim();
    if (!term) return;
    const url = `https://www.bing.com/search?q=${encodeURIComponent(term)}`;
    window.open(url, '_blank');
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      openBingSearch(searchQuery);
    }
  };
  
  const navItems = [
    { label: '首页', path: '/' },
    { label: '博客', path: '/blog' },
    { label: '算法集', path: '/algorithms' },
    { label: '关于我', path: '/about' },
    { label: '联系方式', path: '/contact' }
  ];
  
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/标题 */}
          <Link to="/" className="flex items-center space-x-2">
            <i className="fa-solid fa-code text-blue-600 dark:text-blue-400 text-xl"></i>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              TechPortfolio
            </span>
          </Link>
          
          {/* 桌面导航 */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400",
                  location.pathname === item.path
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* 搜索框、主题切换和移动端菜单按钮 */}
          <div className="flex items-center space-x-4">
            {/* 搜索框 */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="必应搜索..."
                className="w-48 lg:w-64 pl-9 pr-4 py-2 rounded-full text-sm border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
              />
              <i
                className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                role="button"
                aria-label="Bing 搜索"
                onClick={() => openBingSearch(searchQuery)}
              ></i>
            </div>
            
            {/* 主题切换 */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
            >
              {theme === 'light' ? (
                <i className="fa-solid fa-moon"></i>
              ) : (
                <i className="fa-solid fa-sun"></i>
              )}
            </button>
            
            {/* 移动端菜单按钮 */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "block px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                  location.pathname === item.path
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
        
        {/* 移动端搜索框 */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="必应搜索..."
              className="w-full pl-9 pr-4 py-2 rounded-full text-sm border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
            />
            <i
              className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              role="button"
              aria-label="Bing 搜索"
              onClick={() => openBingSearch(searchQuery)}
            ></i>
          </div>
        </div>
      </div>
    </header>
  );
}