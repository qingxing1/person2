import { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { Category, Tag } from "@/config/boke.config";

const STORAGE_KEY = "blog-sidebar-preference";

// 组件接口定义
interface CollapsibleSidebarProps {
  categories: Category[];
  tags: Tag[];
  activeCategory?: string;
  activeTag?: string;
  onSelectCategory: (category: string) => void;
  onSelectTag: (tag: string) => void;
}

interface CategoryHeaderProps {
  isCollapsed: boolean;
  activeCategory?: string;
  onToggle: () => void;
}

// 分类区域头部组件 - 只控制分类折叠
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
      aria-label={`${isCollapsed ? "展开" : "折叠"}文章分类`}
    >
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        <div className="flex items-center space-x-2">
          <i className="fa-solid fa-folder text-blue-500 dark:text-blue-400 text-sm"></i>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            文章分类
          </h3>
        </div>

        {isCollapsed && activeCategory && (
          <div className="flex items-center space-x-1 text-sm overflow-hidden">
            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap max-w-[120px] sm:max-w-none truncate">
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

// 分类列表组件 - 优化动画版本
function CategoryList({
  categories,
  activeCategory,
  onSelectCategory,
}: {
  categories: Category[];
  activeCategory?: string;
  onSelectCategory: (category: string) => void;
}) {
  return (
    <div>
      <div className="space-y-2">
        <button
          onClick={() => onSelectCategory("")}
          className={cn(
            "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 transform touch-manipulation",
            "hover:scale-[1.02] active:scale-[0.98] sm:hover:scale-[1.02] active:bg-gray-100 dark:active:bg-gray-600",
            !activeCategory
              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
          )}
        >
          全部分类
        </button>
        {categories.map((category, index) => (
          <button
            key={category.slug}
            onClick={() => onSelectCategory(category.name)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 transform touch-manipulation",
              "hover:scale-[1.02] active:scale-[0.98] sm:hover:scale-[1.02] active:bg-gray-100 dark:active:bg-gray-600",
              activeCategory === category.name
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm"
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

// 标签云组件 - 优化动画版本
function TagCloud({
  tags,
  activeTag,
  onSelectTag,
}: {
  tags: Tag[];
  activeTag?: string;
  onSelectTag: (tag: string) => void;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <i className="fa-solid fa-tags text-green-500 dark:text-green-400 text-sm mr-2"></i>
        热门标签
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectTag("")}
          className={cn(
            "px-3 py-1 rounded-full text-sm transition-all duration-200 transform touch-manipulation",
            "hover:scale-105 active:scale-95 sm:hover:scale-105 active:bg-gray-200 dark:active:bg-gray-600",
            !activeTag
              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium shadow-sm"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          )}
        >
          全部标签
        </button>
        {tags.map((tag, index) => (
          <button
            key={tag.slug}
            onClick={() => onSelectTag(tag.name)}
            className={cn(
              "px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 transform touch-manipulation",
              "hover:scale-105 active:scale-95 sm:hover:scale-105 active:bg-gray-200 dark:active:bg-gray-600",
              activeTag === tag.name
                ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 shadow-sm"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            )}
            style={{
              animationDelay: `${index * 30}ms`,
            }}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// 主要的可折叠侧边栏组件
export default function CollapsibleSidebar({
  categories,
  tags,
  activeCategory,
  activeTag,
  onSelectCategory,
  onSelectTag,
}: CollapsibleSidebarProps) {
  // 检测浏览器功能支持
  const browserSupport = useMemo(() => {
    const hasLocalStorage = (() => {
      try {
        const test = "__localStorage_test__";
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch {
        return false;
      }
    })();

    return { hasLocalStorage };
  }, []);

  // 从 localStorage 读取用户偏好 - 增强错误处理
  const getUserPreference = useCallback(() => {
    if (!browserSupport.hasLocalStorage) return null;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      // 验证数据结构
      if (
        typeof parsed === "object" &&
        parsed !== null &&
        typeof parsed.isCollapsed === "boolean" &&
        typeof parsed.timestamp === "number"
      ) {
        return parsed;
      }
      return null;
    } catch (error) {
      console.warn("Failed to read sidebar preference:", error);
      // 清理损坏的数据
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      return null;
    }
  }, [browserSupport.hasLocalStorage]);

  // 保存用户偏好到 localStorage - 增强错误处理
  const saveUserPreference = useCallback(
    (collapsed: boolean, isManual: boolean) => {
      if (!browserSupport.hasLocalStorage) return;

      try {
        const data = {
          isCollapsed: collapsed,
          isManual,
          timestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.warn("Failed to save sidebar preference:", error);
        // 尝试清理空间后重试
        try {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              isCollapsed: collapsed,
              isManual,
              timestamp: Date.now(),
            })
          );
        } catch {
          // 静默失败，不影响用户体验
        }
      }
    },
    [browserSupport.hasLocalStorage]
  );

  // 状态管理 - 简化版本
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const preference = getUserPreference();
    return preference?.isCollapsed || false;
  });

  // 手动切换折叠状态 - 纯手动版本
  const handleToggle = useCallback(() => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);

    // 保存用户偏好
    saveUserPreference(newCollapsedState, false);
  }, [isCollapsed, saveUserPreference]);

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-200 sticky top-20 z-10",
        "hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600"
      )}
    >
      <div className="p-5">
        {/* 分类区域 - 可折叠 */}
        <div className="mb-6">
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
              <CategoryList
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={onSelectCategory}
              />
            </div>
          </div>
        </div>

        {/* 标签区域 - 始终显示 */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
          <TagCloud
            tags={tags}
            activeTag={activeTag}
            onSelectTag={onSelectTag}
          />
        </div>
      </div>
    </div>
  );
}
