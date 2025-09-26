import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "algorithm-sidebar-preference";

// 组件接口定义
interface CollapsibleAlgorithmSidebarProps {
  categories: Array<{id: string; name: string; slug: string}>;
  activeDifficulty?: string;
  activeCategory?: string;
  onSelectDifficulty: (difficulty: string) => void;
  onSelectCategory: (category: string) => void;
}

interface CategoryHeaderProps {
  isCollapsed: boolean;
  activeCategory?: string;
  onToggle: () => void;
}

// 类别区域头部组件 - 只控制类别折叠
function CategoryHeader({
  isCollapsed,
  activeCategory,
  onToggle,
}: CategoryHeaderProps) {
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.style.transform = "scale(0.98)";
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.style.transform = "";
  }, []);

  return (
    <div
      className={cn(
        "flex items-center justify-between cursor-pointer select-none rounded-lg p-2 -m-2 transition-all duration-200",
        "hover:bg-gray-50 dark:hover:bg-gray-700/50 focus-within:bg-gray-50 dark:focus-within:bg-gray-700/50",
        "active:bg-gray-100 dark:active:bg-gray-700 touch-manipulation"
      )}
      onClick={onToggle}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      aria-expanded={!isCollapsed}
      aria-label={`${isCollapsed ? "展开" : "折叠"}类别筛选`}
    >
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        <div className="flex items-center space-x-2">
          <i className="fa-solid fa-tags text-purple-500 dark:text-purple-400 text-sm"></i>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            类别
          </h3>
        </div>

        {isCollapsed && activeCategory && (
          <div className="flex items-center space-x-1 text-sm overflow-hidden">
            <span className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap max-w-[120px] sm:max-w-none truncate">
              {activeCategory}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2 text-gray-400 dark:text-gray-500">
        {isCollapsed && activeCategory && (
          <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
            点击展开
          </div>
        )}
        <div className="transition-transform duration-300 ease-in-out">
          <i
            className={cn(
              "fa-solid fa-chevron-down text-sm transition-transform duration-300 ease-in-out",
              isCollapsed ? "rotate-180" : "rotate-0"
            )}
          ></i>
        </div>
      </div>
    </div>
  );
}

// 难度筛选组件 - 始终显示
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
    <div>
      <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-900 dark:text-gray-100">
        <i className="fa-solid fa-signal text-yellow-500 dark:text-yellow-400 text-sm mr-2"></i>
        难度
      </h3>
      <div className="space-y-1">
        {difficulties.map((difficulty, index) => (
          <button
            key={difficulty.value}
            onClick={() => onSelectDifficulty(difficulty.value)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 transform touch-manipulation",
              "hover:scale-[1.02] active:scale-[0.98] sm:hover:scale-[1.02] active:bg-gray-100 dark:active:bg-gray-600",
              activeDifficulty === difficulty.value
                ? "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            {difficulty.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// 类别筛选组件 - 可折叠
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
      <div className="space-y-1">
        <button
          onClick={() => onSelectCategory('')}
          className={cn(
            "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 transform touch-manipulation",
            "hover:scale-[1.02] active:scale-[0.98] sm:hover:scale-[1.02] active:bg-gray-100 dark:active:bg-gray-600",
            !activeCategory
              ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
          )}
        >
          全部类别
        </button>
        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.name)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 transform touch-manipulation",
              "hover:scale-[1.02] active:scale-[0.98] sm:hover:scale-[1.02] active:bg-gray-100 dark:active:bg-gray-600",
              activeCategory === category.name
                ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// 主要的可折叠算法侧边栏组件
export default function CollapsibleAlgorithmSidebar({
  categories,
  activeDifficulty,
  activeCategory,
  onSelectDifficulty,
  onSelectCategory,
}: CollapsibleAlgorithmSidebarProps) {
  // 从 localStorage 读取用户偏好
  const getUserPreference = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      if (typeof parsed === "object" && parsed !== null && typeof parsed.isCollapsed === "boolean") {
        return parsed;
      }
      return null;
    } catch (error) {
      console.warn("Failed to read algorithm sidebar preference:", error);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      return null;
    }
  }, []);

  // 保存用户偏好到 localStorage
  const saveUserPreference = useCallback((collapsed: boolean) => {
    try {
      const data = {
        isCollapsed: collapsed,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn("Failed to save algorithm sidebar preference:", error);
    }
  }, []);

  // 状态管理 - 简化版本
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const preference = getUserPreference();
    return preference?.isCollapsed || false;
  });

  // 手动切换折叠状态
  const handleToggle = useCallback(() => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    
    // 保存用户偏好
    saveUserPreference(newCollapsedState);
  }, [isCollapsed, saveUserPreference]);

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-200 sticky top-20 z-10",
        "hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600"
      )}
    >
      <div className="p-5">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          筛选条件
        </h2>
        
        {/* 难度区域 - 始终显示 */}
        <div className="mb-6">
          <DifficultyFilter
            activeDifficulty={activeDifficulty}
            onSelectDifficulty={onSelectDifficulty}
          />
        </div>
        
        {/* 类别区域 - 可折叠 */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
          <CategoryHeader
            isCollapsed={isCollapsed}
            activeCategory={activeCategory}
            onToggle={handleToggle}
          />
          
          <div
            className={cn(
              "transition-all duration-300 ease-in-out overflow-hidden transform-gpu",
              isCollapsed
                ? "max-h-0 opacity-0 mt-0 -translate-y-2 scale-y-95"
                : "max-h-[1000px] opacity-100 mt-4 translate-y-0 scale-y-100"
            )}
          >
            <div
              className={cn(
                "transition-all duration-200 ease-out delay-75",
                isCollapsed
                  ? "opacity-0 transform scale-95"
                  : "opacity-100 transform scale-100"
              )}
            >
              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={onSelectCategory}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}