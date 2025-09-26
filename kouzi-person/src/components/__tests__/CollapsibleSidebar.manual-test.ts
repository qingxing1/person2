/**
 * CollapsibleSidebar 手动测试脚本
 * 
 * 这个文件包含了可以在浏览器控制台中运行的测试函数
 * 用于验证组件的核心功能
 */

// 测试工具函数
const createTestElement = (tag: string, attributes: Record<string, string> = {}) => {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
};

const simulateScroll = (scrollY: number) => {
  Object.defineProperty(window, 'scrollY', { value: scrollY, writable: true });
  window.dispatchEvent(new Event('scroll'));
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 测试用例
export const manualTests = {
  // 测试 1: 滚动自动折叠
  async testScrollCollapse() {
    console.log('🧪 测试滚动自动折叠...');
    
    // 模拟滚动到顶部
    simulateScroll(0);
    await wait(100);
    
    const header = document.querySelector('[aria-label*="文章分类"]') as HTMLElement;
    if (!header) {
      console.error('❌ 找不到侧边栏头部元素');
      return false;
    }
    
    const isExpandedAtTop = header.getAttribute('aria-expanded') === 'true';
    console.log(`📍 顶部状态: ${isExpandedAtTop ? '展开' : '折叠'}`);
    
    // 模拟向下滚动
    simulateScroll(150);
    await wait(300);
    
    const isCollapsedAfterScroll = header.getAttribute('aria-expanded') === 'false';
    console.log(`📍 滚动后状态: ${isCollapsedAfterScroll ? '折叠' : '展开'}`);
    
    if (isExpandedAtTop && isCollapsedAfterScroll) {
      console.log('✅ 滚动自动折叠测试通过');
      return true;
    } else {
      console.log('❌ 滚动自动折叠测试失败');
      return false;
    }
  },

  // 测试 2: 手动控制
  async testManualControl() {
    console.log('🧪 测试手动控制...');
    
    const header = document.querySelector('[aria-label*="文章分类"]') as HTMLElement;
    if (!header) {
      console.error('❌ 找不到侧边栏头部元素');
      return false;
    }
    
    const initialState = header.getAttribute('aria-expanded');
    console.log(`📍 初始状态: ${initialState === 'true' ? '展开' : '折叠'}`);
    
    // 点击切换
    header.click();
    await wait(100);
    
    const afterClickState = header.getAttribute('aria-expanded');
    console.log(`📍 点击后状态: ${afterClickState === 'true' ? '展开' : '折叠'}`);
    
    if (initialState !== afterClickState) {
      console.log('✅ 手动控制测试通过');
      return true;
    } else {
      console.log('❌ 手动控制测试失败');
      return false;
    }
  },

  // 测试 3: 分类选择
  async testCategorySelection() {
    console.log('🧪 测试分类选择...');
    
    const categoryButtons = document.querySelectorAll('button[class*="w-full text-left"]');
    if (categoryButtons.length === 0) {
      console.error('❌ 找不到分类按钮');
      return false;
    }
    
    const firstCategory = categoryButtons[1] as HTMLElement; // 跳过"全部分类"
    const categoryName = firstCategory.textContent?.trim();
    
    console.log(`📍 点击分类: ${categoryName}`);
    
    // 记录点击前的样式
    const beforeClick = firstCategory.className;
    
    firstCategory.click();
    await wait(100);
    
    // 检查是否有活跃状态的样式
    const afterClick = firstCategory.className;
    const hasActiveStyle = afterClick.includes('bg-blue-50') || afterClick !== beforeClick;
    
    console.log(`📍 样式变化: ${hasActiveStyle ? '是' : '否'}`);
    
    if (hasActiveStyle) {
      console.log('✅ 分类选择测试通过');
      return true;
    } else {
      console.log('❌ 分类选择测试失败');
      return false;
    }
  },

  // 测试 4: 标签选择
  async testTagSelection() {
    console.log('🧪 测试标签选择...');
    
    const tagButtons = document.querySelectorAll('button[class*="rounded-full"]');
    if (tagButtons.length === 0) {
      console.error('❌ 找不到标签按钮');
      return false;
    }
    
    const firstTag = tagButtons[1] as HTMLElement; // 跳过"全部标签"
    const tagName = firstTag.textContent?.trim();
    
    console.log(`📍 点击标签: ${tagName}`);
    
    // 记录点击前的样式
    const beforeClick = firstTag.className;
    
    firstTag.click();
    await wait(100);
    
    // 检查是否有活跃状态的样式
    const afterClick = firstTag.className;
    const hasActiveStyle = afterClick.includes('bg-green-50') || afterClick !== beforeClick;
    
    console.log(`📍 样式变化: ${hasActiveStyle ? '是' : '否'}`);
    
    if (hasActiveStyle) {
      console.log('✅ 标签选择测试通过');
      return true;
    } else {
      console.log('❌ 标签选择测试失败');
      return false;
    }
  },

  // 测试 5: localStorage 功能
  async testLocalStorage() {
    console.log('🧪 测试 localStorage 功能...');
    
    try {
      const testKey = 'blog-sidebar-preference';
      
      // 清理之前的数据
      localStorage.removeItem(testKey);
      
      const header = document.querySelector('[aria-label*="文章分类"]') as HTMLElement;
      if (!header) {
        console.error('❌ 找不到侧边栏头部元素');
        return false;
      }
      
      // 点击切换状态
      header.click();
      await wait(100);
      
      // 检查是否保存到 localStorage
      const stored = localStorage.getItem(testKey);
      console.log(`📍 localStorage 数据: ${stored ? '已保存' : '未保存'}`);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log(`📍 保存的状态: ${JSON.stringify(parsed, null, 2)}`);
        
        console.log('✅ localStorage 功能测试通过');
        return true;
      } else {
        console.log('❌ localStorage 功能测试失败');
        return false;
      }
    } catch (error) {
      console.error('❌ localStorage 测试出错:', error);
      return false;
    }
  },

  // 运行所有测试
  async runAllTests() {
    console.log('🚀 开始运行所有测试...\n');
    
    const tests = [
      this.testScrollCollapse,
      this.testManualControl,
      this.testCategorySelection,
      this.testTagSelection,
      this.testLocalStorage
    ];
    
    const results = [];
    
    for (const test of tests) {
      try {
        const result = await test();
        results.push(result);
        console.log(''); // 空行分隔
      } catch (error) {
        console.error('❌ 测试执行出错:', error);
        results.push(false);
      }
    }
    
    const passed = results.filter(Boolean).length;
    const total = results.length;
    
    console.log(`📊 测试结果: ${passed}/${total} 通过`);
    
    if (passed === total) {
      console.log('🎉 所有测试通过！');
    } else {
      console.log('⚠️ 部分测试失败，请检查组件实现');
    }
    
    return { passed, total, results };
  }
};

// 导出到全局，方便在控制台使用
if (typeof window !== 'undefined') {
  (window as any).sidebarTests = manualTests;
  console.log('💡 在控制台中运行 sidebarTests.runAllTests() 来执行所有测试');
}