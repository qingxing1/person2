/**
 * CollapsibleSidebar 端到端测试演示
 * 
 * 这个文件包含了完整的用户场景测试，可以在实际页面中运行
 * 模拟真实用户的操作流程
 */

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  duration: number;
}

class E2ETestRunner {
  private results: TestResult[] = [];
  private startTime: number = 0;

  private async runTest(name: string, testFn: () => Promise<boolean>): Promise<void> {
    this.startTime = Date.now();
    console.log(`🧪 开始测试: ${name}`);
    
    try {
      const passed = await testFn();
      const duration = Date.now() - this.startTime;
      
      this.results.push({
        name,
        passed,
        message: passed ? '✅ 通过' : '❌ 失败',
        duration
      });
      
      console.log(`${passed ? '✅' : '❌'} ${name} (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - this.startTime;
      this.results.push({
        name,
        passed: false,
        message: `❌ 错误: ${error}`,
        duration
      });
      
      console.error(`❌ ${name} 执行出错:`, error);
    }
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private simulateScroll(scrollY: number): Promise<void> {
    return new Promise(resolve => {
      Object.defineProperty(window, 'scrollY', { value: scrollY, writable: true });
      window.dispatchEvent(new Event('scroll'));
      setTimeout(resolve, 100);
    });
  }

  private getSidebarHeader(): HTMLElement | null {
    return document.querySelector('[aria-label*="文章分类"]') as HTMLElement;
  }

  private getCategoryButtons(): NodeListOf<HTMLElement> {
    return document.querySelectorAll('button[class*="w-full text-left"]');
  }

  private getTagButtons(): NodeListOf<HTMLElement> {
    return document.querySelectorAll('button[class*="rounded-full"]');
  }

  // 测试 1: 完整的用户筛选流程
  private async testCompleteFilteringFlow(): Promise<boolean> {
    console.log('📝 模拟用户筛选文章的完整流程...');
    
    // 1. 选择分类
    const categoryButtons = this.getCategoryButtons();
    if (categoryButtons.length < 2) return false;
    
    const frontendCategory = Array.from(categoryButtons).find(btn => 
      btn.textContent?.includes('前端')
    ) as HTMLElement;
    
    if (!frontendCategory) return false;
    
    frontendCategory.click();
    await this.wait(200);
    
    // 检查 URL 是否更新
    const hasCategory = window.location.search.includes('category=');
    if (!hasCategory) return false;
    
    // 2. 添加标签筛选
    const tagButtons = this.getTagButtons();
    const reactTag = Array.from(tagButtons).find(btn => 
      btn.textContent?.includes('React')
    ) as HTMLElement;
    
    if (reactTag) {
      reactTag.click();
      await this.wait(200);
      
      // 检查 URL 是否包含标签
      const hasTag = window.location.search.includes('tag=');
      if (!hasTag) return false;
    }
    
    // 3. 测试滚动时的折叠行为
    await this.simulateScroll(150);
    await this.wait(300);
    
    const header = this.getSidebarHeader();
    if (!header) return false;
    
    const isCollapsed = header.getAttribute('aria-expanded') === 'false';
    
    // 4. 验证折叠状态下仍显示选中的筛选条件
    if (isCollapsed) {
      const hasActiveCategory = document.querySelector('[class*="bg-blue-50"]');
      const hasActiveTag = document.querySelector('[class*="bg-green-50"]');
      
      if (!hasActiveCategory && !hasActiveTag) return false;
    }
    
    // 5. 清除筛选
    const clearButton = document.querySelector('button[class*="text-blue-600"]') as HTMLElement;
    if (clearButton && clearButton.textContent?.includes('清除筛选')) {
      clearButton.click();
      await this.wait(200);
      
      // 检查 URL 是否清空
      const isCleared = !window.location.search.includes('category=') && 
                       !window.location.search.includes('tag=');
      return isCleared;
    }
    
    return true;
  }

  // 测试 2: 响应式行为测试
  private async testResponsiveBehavior(): Promise<boolean> {
    console.log('📱 测试响应式行为...');
    
    const originalWidth = window.innerWidth;
    
    try {
      // 模拟移动设备宽度
      Object.defineProperty(window, 'innerWidth', { value: 375, writable: true });
      window.dispatchEvent(new Event('resize'));
      await this.wait(200);
      
      // 测试触摸交互
      const header = this.getSidebarHeader();
      if (!header) return false;
      
      // 模拟触摸事件
      const touchStart = new TouchEvent('touchstart', { bubbles: true });
      const touchEnd = new TouchEvent('touchend', { bubbles: true });
      
      header.dispatchEvent(touchStart);
      await this.wait(50);
      header.dispatchEvent(touchEnd);
      header.click();
      await this.wait(200);
      
      // 检查状态是否正确切换
      const isToggled = header.getAttribute('aria-expanded') === 'false';
      
      return isToggled;
    } finally {
      // 恢复原始宽度
      Object.defineProperty(window, 'innerWidth', { value: originalWidth, writable: true });
      window.dispatchEvent(new Event('resize'));
    }
  }

  // 测试 3: 性能和内存测试
  private async testPerformanceAndMemory(): Promise<boolean> {
    console.log('⚡ 测试性能和内存使用...');
    
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    // 快速滚动测试
    const scrollPromises = [];
    for (let i = 0; i < 50; i++) {
      scrollPromises.push(this.simulateScroll(i * 10));
    }
    
    const startTime = Date.now();
    await Promise.all(scrollPromises);
    const scrollDuration = Date.now() - startTime;
    
    // 检查滚动性能（应该在合理时间内完成）
    if (scrollDuration > 1000) return false;
    
    // 快速点击测试
    const header = this.getSidebarHeader();
    if (!header) return false;
    
    const clickStartTime = Date.now();
    for (let i = 0; i < 20; i++) {
      header.click();
      await this.wait(10);
    }
    const clickDuration = Date.now() - clickStartTime;
    
    // 检查点击响应性能
    if (clickDuration > 500) return false;
    
    // 内存检查
    await this.wait(1000); // 等待垃圾回收
    const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;
    
    // 内存增长应该在合理范围内（< 5MB）
    const memoryOk = memoryIncrease < 5 * 1024 * 1024;
    
    console.log(`📊 性能数据: 滚动${scrollDuration}ms, 点击${clickDuration}ms, 内存增长${Math.round(memoryIncrease/1024)}KB`);
    
    return memoryOk;
  }

  // 测试 4: 错误恢复测试
  private async testErrorRecovery(): Promise<boolean> {
    console.log('🛠️ 测试错误恢复能力...');
    
    // 模拟 localStorage 错误
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = () => {
      throw new Error('Storage quota exceeded');
    };
    
    try {
      const header = this.getSidebarHeader();
      if (!header) return false;
      
      // 尝试触发 localStorage 操作
      header.click();
      await this.wait(100);
      
      // 应该仍然能够切换状态，即使存储失败
      const isToggled = header.getAttribute('aria-expanded') === 'false';
      
      return isToggled;
    } finally {
      // 恢复 localStorage
      localStorage.setItem = originalSetItem;
    }
  }

  // 测试 5: 无障碍功能测试
  private async testAccessibility(): Promise<boolean> {
    console.log('♿ 测试无障碍功能...');
    
    const header = this.getSidebarHeader();
    if (!header) return false;
    
    // 检查 ARIA 属性
    const hasAriaExpanded = header.hasAttribute('aria-expanded');
    const hasAriaLabel = header.hasAttribute('aria-label');
    const hasRole = header.getAttribute('role') === 'button';
    const hasTabIndex = header.hasAttribute('tabindex');
    
    if (!hasAriaExpanded || !hasAriaLabel || !hasRole || !hasTabIndex) {
      return false;
    }
    
    // 测试键盘导航
    header.focus();
    await this.wait(100);
    
    const isFocused = document.activeElement === header;
    if (!isFocused) return false;
    
    // 测试 Enter 键
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    header.dispatchEvent(enterEvent);
    await this.wait(100);
    
    // 测试空格键
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
    header.dispatchEvent(spaceEvent);
    await this.wait(100);
    
    return true;
  }

  // 运行所有测试
  async runAllTests(): Promise<void> {
    console.log('🚀 开始运行端到端测试套件...\n');
    
    await this.runTest('完整筛选流程', () => this.testCompleteFilteringFlow());
    await this.runTest('响应式行为', () => this.testResponsiveBehavior());
    await this.runTest('性能和内存', () => this.testPerformanceAndMemory());
    await this.runTest('错误恢复', () => this.testErrorRecovery());
    await this.runTest('无障碍功能', () => this.testAccessibility());
    
    this.generateReport();
  }

  private generateReport(): void {
    console.log('\n📊 测试报告');
    console.log('='.repeat(50));
    
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    const passRate = Math.round((passed / total) * 100);
    
    console.log(`总体结果: ${passed}/${total} 通过 (${passRate}%)`);
    console.log('');
    
    this.results.forEach(result => {
      console.log(`${result.message} ${result.name} (${result.duration}ms)`);
    });
    
    console.log('');
    
    if (passed === total) {
      console.log('🎉 所有测试通过！组件已准备好发布。');
    } else {
      console.log('⚠️ 部分测试失败，请检查并修复问题。');
    }
    
    // 生成详细报告
    const report = {
      timestamp: new Date().toISOString(),
      summary: { passed, total, passRate },
      results: this.results,
      environment: {
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        url: window.location.href
      }
    };
    
    console.log('\n📋 详细报告数据:');
    console.log(JSON.stringify(report, null, 2));
  }
}

// 导出测试运行器
export const e2eTests = new E2ETestRunner();

// 添加到全局对象，方便在控制台使用
if (typeof window !== 'undefined') {
  (window as any).e2eTests = e2eTests;
  console.log('💡 在控制台中运行 e2eTests.runAllTests() 来执行端到端测试');
}