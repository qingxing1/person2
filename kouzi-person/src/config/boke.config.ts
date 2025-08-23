export interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export const bokeConfig = {
  // 标准化的分类数据
  categories: [
    { id: '1', name: '前端', slug: 'frontend' },
    { id: '2', name: '后端', slug: 'backend' },
    { id: '3', name: '全栈', slug: 'fullstack' },
    { id: '4', name: '移动开发', slug: 'mobile' },
    { id: '5', name: '数据库', slug: 'database' },
    { id: '6', name: '运维', slug: 'devops' },
    { id: '7', name: '安全', slug: 'security' },
    { id: '8', name: '项目管理', slug: 'project-management' },
    { id: '9', name: '其他', slug: 'other' }
  ],
  // 标准化的标签数据
  tags: [
    { id: '1', name: 'React', slug: 'react' },
    { id: '2', name: 'TypeScript', slug: 'typescript' },
    { id: '3', name: 'JavaScript', slug: 'javascript' },
    { id: '4', name: 'CSS', slug: 'css' },
    { id: '5', name: 'Node.js', slug: 'nodejs' },
    { id: '6', name: '性能优化', slug: 'performance' },
    { id: '7', name: 'Webpack', slug: 'webpack' },
    { id: '8', name: 'Vite', slug: 'vite' },
    { id: '9', name: '测试', slug: 'testing' },
    { id: '10', name: '状态管理', slug: 'state-management' }
  ]
};

export default bokeConfig;