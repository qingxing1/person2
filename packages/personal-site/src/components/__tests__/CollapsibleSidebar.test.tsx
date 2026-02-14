/**
 * CollapsibleSidebar 组件单元测试
 * 
 * 注意：此测试文件需要配置测试环境（如 Vitest + React Testing Library）才能运行
 * 这里提供了完整的测试用例作为参考
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CollapsibleSidebar from '../CollapsibleSidebar';
import type { Category, Tag } from '@/config/boke.config';

// Mock 数据
const mockCategories: Category[] = [
  { id: '1', name: '前端', slug: 'frontend' },
  { id: '2', name: '后端', slug: 'backend' },
  { id: '3', name: '全栈', slug: 'fullstack' }
];

const mockTags: Tag[] = [
  { id: '1', name: 'React', slug: 'react' },
  { id: '2', name: 'TypeScript', slug: 'typescript' },
  { id: '3', name: 'JavaScript', slug: 'javascript' }
];

// Mock 函数
const mockOnSelectCategory = vi.fn();
const mockOnSelectTag = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock requestAnimationFrame
Object.defineProperty(window, 'requestAnimationFrame', {
  value: vi.fn((cb) => setTimeout(cb, 16))
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  value: vi.fn((id) => clearTimeout(id))
});

describe('CollapsibleSidebar', () => {
  const defaultProps = {
    categories: mockCategories,
    tags: mockTags,
    onSelectCategory: mockOnSelectCategory,
    onSelectTag: mockOnSelectTag
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('基本渲染', () => {
    it('应该正确渲染组件', () => {
      render(<CollapsibleSidebar {...defaultProps} />);
      
      expect(screen.getByText('文章分类')).toBeInTheDocument();
      expect(screen.getByText('热门标签')).toBeInTheDocument();
      expect(screen.getByText('全部分类')).toBeInTheDocument();
      expect(screen.getByText('全部标签')).toBeInTheDocument();
    });

    it('应该渲染所有分类', () => {
      render(<CollapsibleSidebar {...defaultProps} />);
      
      mockCategories.forEach(category => {
        expect(screen.getByText(category.name)).toBeInTheDocument();
      });
    });

    it('应该渲染所有标签', () => {
      render(<CollapsibleSidebar {...defaultProps} />);
      
      mockTags.forEach(tag => {
        expect(screen.getByText(tag.name)).toBeInTheDocument();
      });
    });
  });

  describe('状态管理', () => {
    it('应该正确显示活跃分类', () => {
      render(<CollapsibleSidebar {...defaultProps} activeCategory="前端" />);
      
      const activeButton = screen.getByRole('button', { name: '前端' });
      expect(activeButton).toHaveClass('bg-blue-50');
    });

    it('应该正确显示活跃标签', () => {
      render(<CollapsibleSidebar {...defaultProps} activeTag="React" />);
      
      const activeButton = screen.getByRole('button', { name: 'React' });
      expect(activeButton).toHaveClass('bg-green-50');
    });

    it('应该在折叠状态下显示活跃分类和标签', async () => {
      const user = userEvent.setup();
      render(<CollapsibleSidebar {...defaultProps} activeCategory="前端" activeTag="React" />);
      
      // 点击标题折叠
      const header = screen.getByRole('button', { name: /折叠文章分类/ });
      await user.click(header);
      
      // 检查折叠状态下的显示
      await waitFor(() => {
        expect(screen.getByText('前端')).toBeInTheDocument();
        expect(screen.getByText('#React')).toBeInTheDocument();
      });
    });
  });

  describe('用户交互', () => {
    it('应该响应分类选择', async () => {
      const user = userEvent.setup();
      render(<CollapsibleSidebar {...defaultProps} />);
      
      const categoryButton = screen.getByRole('button', { name: '前端' });
      await user.click(categoryButton);
      
      expect(mockOnSelectCategory).toHaveBeenCalledWith('前端');
    });

    it('应该响应标签选择', async () => {
      const user = userEvent.setup();
      render(<CollapsibleSidebar {...defaultProps} />);
      
      const tagButton = screen.getByRole('button', { name: 'React' });
      await user.click(tagButton);
      
      expect(mockOnSelectTag).toHaveBeenCalledWith('React');
    });

    it('应该响应手动折叠/展开', async () => {
      const user = userEvent.setup();
      render(<CollapsibleSidebar {...defaultProps} />);
      
      const header = screen.getByRole('button', { name: /折叠文章分类/ });
      
      // 点击折叠
      await user.click(header);
      expect(header).toHaveAttribute('aria-expanded', 'false');
      
      // 再次点击展开
      await user.click(header);
      expect(header).toHaveAttribute('aria-expanded', 'true');
    });

    it('应该支持键盘导航', async () => {
      const user = userEvent.setup();
      render(<CollapsibleSidebar {...defaultProps} />);
      
      const header = screen.getByRole('button', { name: /折叠文章分类/ });
      header.focus();
      
      // 按 Enter 键
      await user.keyboard('{Enter}');
      expect(header).toHaveAttribute('aria-expanded', 'false');
      
      // 按空格键
      await user.keyboard(' ');
      expect(header).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('滚动行为', () => {
    it('应该在滚动超过阈值时自动折叠', async () => {
      render(<CollapsibleSidebar {...defaultProps} />);
      
      // 模拟滚动
      Object.defineProperty(window, 'scrollY', { value: 150, writable: true });
      fireEvent.scroll(window);
      
      await waitFor(() => {
        const header = screen.getByRole('button', { name: /展开文章分类/ });
        expect(header).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('应该在滚动回到顶部时自动展开', async () => {
      render(<CollapsibleSidebar {...defaultProps} />);
      
      // 先折叠
      Object.defineProperty(window, 'scrollY', { value: 150, writable: true });
      fireEvent.scroll(window);
      
      await waitFor(() => {
        const header = screen.getByRole('button', { name: /展开文章分类/ });
        expect(header).toHaveAttribute('aria-expanded', 'false');
      });
      
      // 再滚动回顶部
      Object.defineProperty(window, 'scrollY', { value: 30, writable: true });
      fireEvent.scroll(window);
      
      await waitFor(() => {
        const header = screen.getByRole('button', { name: /折叠文章分类/ });
        expect(header).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('手动控制应该覆盖自动行为', async () => {
      const user = userEvent.setup();
      render(<CollapsibleSidebar {...defaultProps} />);
      
      const header = screen.getByRole('button', { name: /折叠文章分类/ });
      
      // 手动折叠
      await user.click(header);
      expect(header).toHaveAttribute('aria-expanded', 'false');
      
      // 滚动到顶部（通常会自动展开）
      Object.defineProperty(window, 'scrollY', { value: 30, writable: true });
      fireEvent.scroll(window);
      
      // 应该保持折叠状态（手动控制覆盖自动行为）
      await waitFor(() => {
        expect(header).toHaveAttribute('aria-expanded', 'false');
      }, { timeout: 1000 });
    });
  });

  describe('localStorage 集成', () => {
    it('应该保存用户偏好', async () => {
      const user = userEvent.setup();
      render(<CollapsibleSidebar {...defaultProps} />);
      
      const header = screen.getByRole('button', { name: /折叠文章分类/ });
      await user.click(header);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'blog-sidebar-preference',
        expect.stringContaining('"isCollapsed":true')
      );
    });

    it('应该从 localStorage 恢复用户偏好', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        isCollapsed: true,
        isManual: true,
        timestamp: Date.now()
      }));
      
      render(<CollapsibleSidebar {...defaultProps} />);
      
      const header = screen.getByRole('button', { name: /展开文章分类/ });
      expect(header).toHaveAttribute('aria-expanded', 'false');
    });

    it('应该处理损坏的 localStorage 数据', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      // 应该不抛出错误
      expect(() => {
        render(<CollapsibleSidebar {...defaultProps} />);
      }).not.toThrow();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('blog-sidebar-preference');
    });
  });

  describe('错误处理', () => {
    it('应该处理 localStorage 不可用的情况', () => {
      const originalLocalStorage = window.localStorage;
      // @ts-ignore
      delete window.localStorage;
      
      expect(() => {
        render(<CollapsibleSidebar {...defaultProps} />);
      }).not.toThrow();
      
      window.localStorage = originalLocalStorage;
    });

    it('应该处理滚动事件错误', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      // Mock scrollY 抛出错误
      Object.defineProperty(window, 'scrollY', {
        get: () => { throw new Error('Scroll error'); }
      });
      
      render(<CollapsibleSidebar {...defaultProps} />);
      fireEvent.scroll(window);
      
      expect(consoleSpy).toHaveBeenCalledWith('Error in scroll handler:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });

  describe('性能优化', () => {
    it('应该防抖滚动事件', () => {
      render(<CollapsibleSidebar {...defaultProps} />);
      
      // 快速触发多次滚动事件
      for (let i = 0; i < 10; i++) {
        fireEvent.scroll(window);
      }
      
      // requestAnimationFrame 应该只被调用一次（防抖）
      expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
    });

    it('应该清理事件监听器', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      
      const { unmount } = render(<CollapsibleSidebar {...defaultProps} />);
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('orientationchange', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });
  });

  describe('响应式设计', () => {
    it('应该处理设备方向变化', () => {
      render(<CollapsibleSidebar {...defaultProps} />);
      
      fireEvent(window, new Event('orientationchange'));
      
      // 应该重新计算滚动位置
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('应该处理窗口大小变化', () => {
      render(<CollapsibleSidebar {...defaultProps} />);
      
      fireEvent(window, new Event('resize'));
      
      // 应该重新计算滚动位置
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });
  });
});