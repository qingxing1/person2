-- 博客表创建脚本
-- 包含图片上传功能所需的所有字段

DROP TABLE IF EXISTS `sys_blog`;
CREATE TABLE `sys_blog` (
  `id` varchar(36) NOT NULL COMMENT '博客ID',
  `title` varchar(200) NOT NULL COMMENT '博客标题',
  `content` longtext COMMENT '博客内容(富文本HTML格式)',
  `author` varchar(50) DEFAULT NULL COMMENT '作者',
  `tags` varchar(500) DEFAULT NULL COMMENT '标签(逗号分隔)',
  `category` varchar(50) DEFAULT NULL COMMENT '分类',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态: 1-发布, 0-草稿, 2-下线',
  `view_count` int(11) DEFAULT 0 COMMENT '浏览次数',
  `cover_image` varchar(500) DEFAULT NULL COMMENT '封面图片URL',
  `images` text COMMENT '图片列表(JSON格式数组)',
  `create_date` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_date` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='博客文章表';

-- 创建索引
CREATE INDEX idx_blog_status ON sys_blog(status);
CREATE INDEX idx_blog_create_date ON sys_blog(create_date);
CREATE INDEX idx_blog_category ON sys_blog(category);

-- 插入示例数据
INSERT INTO `sys_blog` (`id`, `title`, `content`, `author`, `tags`, `category`, `status`, `view_count`, `cover_image`, `images`) VALUES
('1', '第一篇博客示例', '<h2>欢迎使用博客系统</h2><p>这是第一篇博客的内容。</p><img src="https://example.com/image1.jpg" alt="示例图片1" width="600"/>', '管理员', '技术,分享', '技术文章', 1, 100, 'https://example.com/cover1.jpg', '["https://example.com/image1.jpg"]'),
('2', '第二篇博客示例', '<h2>博客系统介绍</h2><p>详细介绍博客系统的功能。</p>', '管理员', '教程', '系统教程', 1, 50, 'https://example.com/cover2.jpg', '[]');

-- 如果已存在表，添加缺失字段的ALTER语句
-- ALTER TABLE sys_blog ADD COLUMN cover_image VARCHAR(500) NULL COMMENT '封面图片URL';
-- ALTER TABLE sys_blog ADD COLUMN images TEXT NULL COMMENT '图片列表(JSON格式)';
-- ALTER TABLE sys_blog MODIFY COLUMN content LONGTEXT COMMENT '博客内容(富文本HTML格式)';

-- 查看表结构
-- DESCRIBE sys_blog;