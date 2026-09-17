/*
 Navicat Premium Dump SQL

 Source Server         : ry
 Source Server Type    : MySQL
 Source Server Version : 80043 (8.0.43)
 Source Host           : localhost:3306
 Source Schema         : kapok

 Target Server Type    : MySQL
 Target Server Version : 80043 (8.0.43)
 File Encoding         : 65001

 Date: 25/08/2025 21:46:45
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for algorithm_problems
-- ----------------------------
DROP TABLE IF EXISTS `algorithm_problems`;
CREATE TABLE `algorithm_problems`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `difficulty` enum('简单','中等','困难') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '中等',
  `category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `solution` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_category`(`category` ASC) USING BTREE,
  INDEX `idx_difficulty`(`difficulty` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of algorithm_problems
-- ----------------------------
INSERT INTO `algorithm_problems` VALUES (2, '两数之和优化版', '简单', '数组', '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target 的那两个整数，并返回它们的数组下标。优化空间复杂度。', '使用哈希表存储已遍历的数字及其索引，时间复杂度O(n)，空间复杂度O(n)', '```\nclass Solution {\n  public int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n      int complement = target - nums[i];\n      if (map.containsKey(complement)) {\n        return new int[] { map.get(complement), i };\n      }\n      map.put(nums[i], i);\n    }\n    throw new IllegalArgumentException(\"No two sum solution\");\n  }\n}\n```', '2025-08-19 20:02:29.000000', '2025-08-25 19:28:59.000000');
INSERT INTO `algorithm_problems` VALUES (3, '两数之和121', '简单', '数组', '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target 的那两个整数，并返回它们的数组下标。', '使用哈希表存储已遍历的数字及其索引，时间复杂度O(n)', 'class Solution {\n  public int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n      int complement = target - nums[i];\n      if (map.containsKey(complement)) {\n        return new int[] { map.get(complement), i };\n      }\n      map.put(nums[i], i);\n    }\n    throw new IllegalArgumentException(\"No two sum solution\");\n  }\n}', '2025-08-21 19:49:07.000000', '2025-08-21 20:15:58.000000');
INSERT INTO `algorithm_problems` VALUES (5, '12', '中等', '数组', '12', '12', '12', '2025-08-22 21:20:22.000000', '2025-08-22 21:20:22.000000');
INSERT INTO `algorithm_problems` VALUES (6, '12', '中等', '字符串', '12', '11', '21', '2025-08-22 21:21:11.000000', '2025-08-22 21:21:11.000000');
INSERT INTO `algorithm_problems` VALUES (9, '12', '中等', '数组', '122', '1222', '12', '2025-08-23 10:26:33.000000', '2025-08-23 10:31:58.000000');
INSERT INTO `algorithm_problems` VALUES (10, '14', '困难', '链表', '14', '1422', '14', '2025-08-23 10:31:34.000000', '2025-08-23 10:31:55.000000');
INSERT INTO `algorithm_problems` VALUES (11, '14', '中等', '链表', '14', '14', '14', '2025-08-23 10:31:43.000000', '2025-08-23 10:31:43.000000');

-- ----------------------------
-- Table structure for blog_posts
-- ----------------------------
DROP TABLE IF EXISTS `blog_posts`;
CREATE TABLE `blog_posts`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '博客标题',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '博客内容(Markdown格式)',
  `author` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '作者姓名',
  `tags` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '标签列表(逗号分隔)',
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '分类',
  `status` enum('draft','published') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'draft' COMMENT '状态',
  `viewCount` int NOT NULL DEFAULT 0 COMMENT '浏览次数',
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `coverImage` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '封面图片URL',
  `images` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '图片列表(JSON格式)',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of blog_posts
-- ----------------------------
INSERT INTO `blog_posts` VALUES (1, '测试测试11', '这是更新后的博客内容\n![图片描述](/static/blog/content/1755748407395-896zist0j4.png)', '测试作者', '更新,测试,Nestjs', '编程', 'published', 21, '2025-08-19 19:14:51.000000', '2025-08-25 20:13:24.000000', '/static/blog/cover/1755747356411-rm9jwxopei8.png', NULL);
INSERT INTO `blog_posts` VALUES (4, '测试的的', '测试', 'admin', 'TypeScript,CSS', '前端', 'draft', 36, '2025-08-21 10:54:41.112481', '2025-08-25 19:35:30.000000', '/static/blog/cover/1755747190995-3xbd5eoic3y.png', NULL);
INSERT INTO `blog_posts` VALUES (6, '测试11', '测试1111', 'admin', 'React,TypeScript', '前端', 'draft', 6, '2025-08-21 18:13:38.351854', '2025-08-23 20:41:43.000000', '/static/blog/cover/1755771211940-g26ov6ya3q4.jpg', NULL);
INSERT INTO `blog_posts` VALUES (7, 'Vite 打包目录结构自定义配置指南', '# Vite 打包目录结构自定义配置指南\n在 Vite 工程开发中，默认打包后的 dist 目录资源常集中在 asset 目录下，不利于资源管理。本文基于 Rollup 配置原理，详细介绍如何通过 Vite 配置自定义打包目录结构，实现 JS、CSS、图片等资源的分类存放。\n\n\n## 一、实现原理\nVite 底层依赖 Rollup 进行打包，因此需通过 Vite 的 build.rollupOptions 配置项传递 Rollup 相关参数，核心通过 Rollup 的 output 配置控制资源输出路径：\n- **entryFileNames**：控制入口 JS 文件的输出路径\n- **chunkFileNames**：控制分包/懒加载生成的 JS chunk 文件路径\n- **assetFileNames**：控制非 JS 资源（CSS、图片、SVG 等）的输出路径\n\n\n## 二、具体配置步骤\n### 1. 基础配置文件\n在项目根目录的 vite.config.js（或 vite.config.ts）中，通过 build.rollupOptions.output 配置资源输出规则：\n\n```javascript\n// vite.config.js\nimport { defineConfig } from \'vite\';\n\nexport default defineConfig({\n  build: {\n    rollupOptions: {\n      output: {\n        // 1. 入口 JS 文件输出配置\n        entryFileNames: \'js/[name].[hash].js\', \n        // 2. 分包/懒加载 JS 文件输出配置\n        chunkFileNames: \'js/[name].[hash].js\', \n        // 3. 非 JS 资源输出配置（通过函数细分类型）\n        assetFileNames: (assetInfo) => {\n          // 定义图片后缀列表\n          const imgExts = [\'png\', \'jpg\', \'jpeg\', \'gif\', \'svg\', \'webp\'];\n          // 获取资源文件名\n          const fileName = assetInfo.name || \'\';\n          \n          // 若为 CSS 文件，输出到 css 目录\n          if (fileName.endsWith(\'.css\')) {\n            return \'css/[name].[hash].[ext]\';\n          }\n          // 若为图片文件，输出到 images 目录\n          if (imgExts.some(ext => fileName.endsWith(`.${ext}`))) {\n            return \'images/[name].[hash].[ext]\';\n          }\n          // 其他资源默认输出到 asset 目录\n          return \'asset/[name].[hash].[ext]\';\n        }\n      }\n    }\n  }\n});\n```\n\n\n### 2. 配置说明\n#### （1）JS 资源分离\n- **entryFileNames**：将项目入口 JS 文件（如 main.js）输出到 dist/js 目录，命名格式为 文件名.哈希值.js（哈希值用于缓存控制）。\n- **chunkFileNames**：将路由懒加载、代码分割生成的 JS chunk 文件统一输出到 dist/js 目录，与入口 JS 集中管理。\n\n\n#### （2）非 JS 资源细分\n通过 assetFileNames 函数对资源类型进行判断：\n- **CSS 文件**：匹配 .css 后缀，输出到 dist/css 目录。\n- **图片资源**：匹配 png、jpg、svg等图片后缀，输出到 dist/images目录。\n- **其他资源**：未匹配的资源（如字体、视频等）默认输出到 dist/asset 目录。\n\n\n#### （3）占位符说明\n配置中使用的 Rollup 占位符含义：\n- [name]：资源原始文件名（不含后缀）\n- [hash]：基于文件内容生成的哈希值（用于避免缓存问题）\n- [ext]：资源原始后缀名（含 .，如 .css、.png）\n\n\n## 三、打包效果验证\n执行 npm run build 打包后，dist 目录结构如下：\n```\ndist/\n├─ js/                 # 所有 JS 资源\n│  ├─ main.xxxx.js     # 入口 JS\n│  └─ chunk.xxxx.js    # 分包 JS\n├─ css/                # 所有 CSS 资源\n│  └─ style.xxxx.css\n├─ images/             # 所有图片资源\n│  ├─ logo.xxxx.png\n│  └─ icon.xxxx.svg\n└─ asset/              # 其他资源\n   └─ font.xxxx.ttf\n```\n\n\n## 四、注意事项\n1. **配置兼容性**：确保 Vite 版本 ≥ 2.0，Rollup 配置语法随版本可能略有差异，建议参考对应版本官方文档。\n2. **资源类型扩展**：如需添加更多资源类型（如字体 woff2），可在 imgExts 或判断逻辑中扩展。\n3. **哈希值必要性**：保留 [hash] 占位符可有效解决浏览器缓存问题，避免线上资源更新后用户无法获取最新内容。\n\n通过上述配置，可实现 Vite 打包目录的精细化管理，提升项目资源组织的清晰度和可维护性。', 'admin', 'Vite,性能优化', '前端', 'published', 62, '2025-08-21 18:15:55.000000', '2025-08-25 20:08:30.000000', '/static/blog/cover/1755771275355-cnh76ho9iao.jpg', NULL);
INSERT INTO `blog_posts` VALUES (8, '测试测试', '# 标题\n## 测试\n### 开始\n#### 测试\n\n![]()\n![]()\n', 'admin', 'CSS,React,TypeScript,JavaScript', '前端', 'draft', 8, '2025-08-25 18:51:36.744418', '2025-08-25 20:38:50.000000', '/static/blog/cover/1756119029164-i8lb8qlj3h.jpg', NULL);
INSERT INTO `blog_posts` VALUES (9, '测试测试', '![](/static/blog/content/1756119794938-c6lihtepdy8.jpg)\n\n这是一个测试的文本`测试`\n```js\nconst data = {\n  \"ceshi\":\"测试\"\n}\n```\n', 'admin', 'React', '后端', 'draft', 37, '2025-08-25 19:04:38.000000', '2025-08-25 19:51:16.000000', '/static/blog/cover/1756119786928-t3vp6n0wvdc.jpg', NULL);

-- ----------------------------
-- Table structure for personal_info
-- ----------------------------
DROP TABLE IF EXISTS `personal_info`;
CREATE TABLE `personal_info`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `nickname` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户昵称',
  `gender` enum('男','女','保密') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '保密' COMMENT '性别',
  `birthday` date NULL DEFAULT NULL COMMENT '出生日期',
  `bio` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '个人简介',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '邮箱地址',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '手机号码',
  `qq` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'QQ号码',
  `wechat` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '微信号码',
  `location` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '所在地区',
  `address` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '详细地址',
  `skills` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '技术栈(逗号分隔)',
  `hobbies` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '兴趣标签(逗号分隔)',
  `github` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'GitHub用户名',
  `website` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '个人网站',
  `education` enum('高中','专科','本科','硕士','博士') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '教育背景',
  `school` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '毕业院校',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `realName` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '真实姓名',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of personal_info
-- ----------------------------
INSERT INTO `personal_info` VALUES (1, '测试', '保密', '2001-05-09', '热爱编程的全栈工程师', 'zhangsan@example.com', '13800138000', '12345678', 'zhangsan_wx', '北京市朝阳区', '朝阳区某某街道123号', 'JavaScript,Vue.js,React,Node.js,TypeScript,Angular,Python', '编程,阅读,音乐,旅行,摄影,健身', 'your-github-name', 'https://your-blog.com', '本科', '北京大学', '2025-08-21 21:01:48.000000', '2025-08-23 10:42:34.000000', '百度');
INSERT INTO `personal_info` VALUES (2, '百度', '女', '1992-08-20', '更新后的个人简介', 'lisi@example.com', '13900139000', '987654321', 'lisi_wechat', '上海市浦东新区', '张江高科技园区', 'Python,Django,React,MySQL', '摄影,健身,音乐', 'lisi', 'https://lisi.dev', '硕士', '北京大学', '2025-08-22 15:05:16.831817', '2025-08-22 15:11:29.218271', '百度');

-- ----------------------------
-- Table structure for sys_dept
-- ----------------------------
DROP TABLE IF EXISTS `sys_dept`;
CREATE TABLE `sys_dept`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `parent_id` bigint NOT NULL COMMENT '父级部门 id',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '部门状态，1-有效，0-禁用',
  `order_num` int NOT NULL DEFAULT 0 COMMENT '排序',
  `create_date` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '备注',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '部门名称',
  `leader` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '部门负责人',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_dept
-- ----------------------------
INSERT INTO `sys_dept` VALUES (1, 0, 1, 0, '2023-05-04 00:16:02.040115', '总公司', 'K科技有限公司', 'kapok');
INSERT INTO `sys_dept` VALUES (2, 1, 1, 0, '2023-05-04 00:16:46.557000', '杭州分部', '杭州技术部', 'kapok');

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '菜单名称',
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '菜单/按钮唯一标识，由前端路由name,用于控制菜单按钮显隐',
  `type` int NOT NULL COMMENT '菜单类型， 1-菜单/目录 2-tabs 3-按钮',
  `order_num` int NOT NULL DEFAULT 0 COMMENT '排序',
  `parent_id` bigint NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 50 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
INSERT INTO `sys_menu` VALUES (1, '首页', 'dashboard', 1, 0, 0);
INSERT INTO `sys_menu` VALUES (2, '权限管理', 'perm', 1, 0, 0);
INSERT INTO `sys_menu` VALUES (3, '用户管理', 'perm_users', 1, 0, 2);
INSERT INTO `sys_menu` VALUES (4, '角色管理', 'perm_roles', 1, 0, 2);
INSERT INTO `sys_menu` VALUES (5, '系统设置', 'system', 1, 0, 0);
INSERT INTO `sys_menu` VALUES (6, '资源管理', 'system_menus', 1, 0, 5);
INSERT INTO `sys_menu` VALUES (7, '文件列表', 'system_oss', 1, 0, 5);
INSERT INTO `sys_menu` VALUES (8, '编辑', 'perm_users:edit', 3, 0, 3);
INSERT INTO `sys_menu` VALUES (9, '启用/禁用', 'perm_users:updateStatus', 3, 0, 3);
INSERT INTO `sys_menu` VALUES (10, '重置密码', 'perm_users:resetPw', 3, 0, 3);
INSERT INTO `sys_menu` VALUES (11, '批量导入', 'perm_users:createMultUser', 3, 0, 3);
INSERT INTO `sys_menu` VALUES (12, '新增', 'perm_roles:create', 3, 0, 4);
INSERT INTO `sys_menu` VALUES (13, '编辑', 'perm_roles:edit', 3, 0, 4);
INSERT INTO `sys_menu` VALUES (14, '删除', 'perm_roles:del', 3, 0, 4);
INSERT INTO `sys_menu` VALUES (15, '关联用户/解除关联', 'perm_roles:bind', 3, 0, 4);
INSERT INTO `sys_menu` VALUES (16, '添加', 'system_menus:create', 3, 0, 6);
INSERT INTO `sys_menu` VALUES (17, '编辑', 'system_menus:edit', 3, 0, 6);
INSERT INTO `sys_menu` VALUES (18, '删除', 'system_menus:del', 3, 0, 6);
INSERT INTO `sys_menu` VALUES (23, '测试按钮', '123232', 3, 0, 0);
INSERT INTO `sys_menu` VALUES (25, '部门管理', 'perm_depts', 1, 0, 2);
INSERT INTO `sys_menu` VALUES (26, '岗位管理', 'perm_posts', 1, 0, 2);
INSERT INTO `sys_menu` VALUES (27, '新增', 'perm_posts:create', 3, 0, 26);
INSERT INTO `sys_menu` VALUES (28, '编辑', 'perm_posts:edit', 3, 0, 26);
INSERT INTO `sys_menu` VALUES (29, '删除', 'perm_posts:del', 3, 0, 26);
INSERT INTO `sys_menu` VALUES (30, '删除', 'perm_depts:del', 3, 0, 25);
INSERT INTO `sys_menu` VALUES (31, '编辑', 'perm_depts:edit', 3, 0, 25);
INSERT INTO `sys_menu` VALUES (32, '新增', 'perm_depts:create', 3, 0, 25);
INSERT INTO `sys_menu` VALUES (34, '前端展示', 'front', 2, 0, 0);
INSERT INTO `sys_menu` VALUES (35, '前端展示', 'front', 3, 0, 34);
INSERT INTO `sys_menu` VALUES (37, '测试', '1', 3, 0, 36);
INSERT INTO `sys_menu` VALUES (38, '博客管理', 'boke_info', 1, 1, 0);
INSERT INTO `sys_menu` VALUES (40, '博客管理', 'boke_info', 3, 1, 38);
INSERT INTO `sys_menu` VALUES (41, '信息留言', 'person_information', 1, 0, 41);
INSERT INTO `sys_menu` VALUES (42, '个人信息管理', 'person_info', 3, 0, 41);
INSERT INTO `sys_menu` VALUES (43, '信息留言', 'person_information', 3, 0, 41);
INSERT INTO `sys_menu` VALUES (44, '个人信息', 'person', 1, 0, 0);
INSERT INTO `sys_menu` VALUES (45, '信息设置', 'person_info', 1, 0, 44);
INSERT INTO `sys_menu` VALUES (46, '信息留言', 'person_information', 1, 1, 44);
INSERT INTO `sys_menu` VALUES (47, '算法题集', 'method', 1, 0, 0);
INSERT INTO `sys_menu` VALUES (48, '算法题集合', 'method_info', 3, 0, 47);
INSERT INTO `sys_menu` VALUES (49, '收藏管理', 'person_collect', 3, 0, 44);

-- ----------------------------
-- Table structure for sys_menu_perm
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu_perm`;
CREATE TABLE `sys_menu_perm`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `menu_id` bigint NOT NULL COMMENT '菜单id',
  `api_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '该菜单所能调用的 api 接口，必须是本应用的接口，否则设置了也不生效',
  `api_method` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '该菜单所能调用 api 接口的 method 方法',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 43 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_menu_perm
-- ----------------------------
INSERT INTO `sys_menu_perm` VALUES (2, 3, '/api/user/list', 'GET');
INSERT INTO `sys_menu_perm` VALUES (3, 4, '/api/role/list', 'GET');
INSERT INTO `sys_menu_perm` VALUES (4, 4, '/api/role/one/:id/perms', 'GET');
INSERT INTO `sys_menu_perm` VALUES (5, 4, '/api/user/list', 'GET');
INSERT INTO `sys_menu_perm` VALUES (6, 6, '/api/menu/all', 'GET');
INSERT INTO `sys_menu_perm` VALUES (7, 6, '/api/menu/one/:parentId/btns', 'GET');
INSERT INTO `sys_menu_perm` VALUES (8, 6, '/api/menu/one/:id/menu-perm', 'GET');
INSERT INTO `sys_menu_perm` VALUES (9, 7, '/api/oss/list', 'GET');
INSERT INTO `sys_menu_perm` VALUES (10, 8, '/api/user/one/:id', 'GET');
INSERT INTO `sys_menu_perm` VALUES (11, 8, '/api/user', 'PUT');
INSERT INTO `sys_menu_perm` VALUES (12, 9, '/api/user/status/change', 'PUT');
INSERT INTO `sys_menu_perm` VALUES (13, 10, '/api/user/password/reset/:userId', 'PUT');
INSERT INTO `sys_menu_perm` VALUES (15, 12, '/api/role', 'POST');
INSERT INTO `sys_menu_perm` VALUES (16, 13, '/api/role', 'PUT');
INSERT INTO `sys_menu_perm` VALUES (17, 14, '/api/role/:id', 'DELETE');
INSERT INTO `sys_menu_perm` VALUES (18, 15, '/api/user/role/update', 'POST');
INSERT INTO `sys_menu_perm` VALUES (20, 17, '/api/menu', 'PUT');
INSERT INTO `sys_menu_perm` VALUES (21, 16, '/api/menu', 'POST');
INSERT INTO `sys_menu_perm` VALUES (22, 18, '/api/menu/:id', 'DELETE');
INSERT INTO `sys_menu_perm` VALUES (24, 11, '/api/user/import', 'POST');
INSERT INTO `sys_menu_perm` VALUES (27, 25, '/api/dept/list', 'GET');
INSERT INTO `sys_menu_perm` VALUES (28, 26, '/api/post/list', 'GET');
INSERT INTO `sys_menu_perm` VALUES (32, 29, '/api/post/:id', 'DELETE');
INSERT INTO `sys_menu_perm` VALUES (36, 27, '/api/post', 'POST');
INSERT INTO `sys_menu_perm` VALUES (37, 28, '/api/post/:id', 'GET');
INSERT INTO `sys_menu_perm` VALUES (38, 28, '/api/post', 'PUT');
INSERT INTO `sys_menu_perm` VALUES (39, 30, '/api/dept/:id', 'DELETE');
INSERT INTO `sys_menu_perm` VALUES (40, 31, '/api/dept', 'PUT');
INSERT INTO `sys_menu_perm` VALUES (41, 32, '/api/dept', 'POST');
INSERT INTO `sys_menu_perm` VALUES (42, 37, '/api/register', 'POST');

-- ----------------------------
-- Table structure for sys_oss
-- ----------------------------
DROP TABLE IF EXISTS `sys_oss`;
CREATE TABLE `sys_oss`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文件 url',
  `size` int NOT NULL COMMENT '文件size',
  `location` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文件存放位置',
  `create_date` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `business` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '业务描述字段，可以字符串，也可以是 JSON 字符串',
  `user_id` bigint NOT NULL COMMENT '上传用户id',
  `user_account` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '上传用户帐号',
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文件mimetype类型',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_oss
-- ----------------------------
INSERT INTO `sys_oss` VALUES (1, '/static/b37f8d762222ffbf280fa708b4b57f4a.jpg', 59975, 'D:\\programmeWork\\kapok\\nest-admin\\upload\\347811e1f6da4221a09cee7f3c7b03ce.jpeg', '2021-11-23 21:13:01.820103', '头像', 1, 'admin', 'image/jpeg');
INSERT INTO `sys_oss` VALUES (2, '/static/67f57d2058984103afc54d164aff5648.jpeg', 59767, 'D:\\programmeWork\\kapok\\nest-admin\\upload\\aa96fb05de9945f690e6d4b8a0f9b5e4.jpeg', '2021-11-24 19:51:01.567326', '头像', 1, 'admin', 'image/jpeg');
INSERT INTO `sys_oss` VALUES (3, '/static/59f38c077c758158297d70061431429b.jpg', 59516, 'D:\\programmeWork\\kapok\\nest-admin\\upload\\67f57d2058984103afc54d164aff5648.jpeg', '2021-11-24 20:31:04.633617', '头像', 1, 'admin', 'image/jpeg');
INSERT INTO `sys_oss` VALUES (4, '/static/用户导入模板.xlsx', 10956, 'D:\\programmeWork\\kapok\\nest-admin\\upload\\用户导入模板.xlsx', '2023-04-24 23:48:09.000000', '文档', 1, 'admin', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
INSERT INTO `sys_oss` VALUES (6, '/static/ceb80f4d9da54d7587904ab1dd7d7d13.jpeg', 76475, 'C:\\Users\\HP\\Desktop\\code\\nest-admin2\\upload\\ceb80f4d9da54d7587904ab1dd7d7d13.jpeg', '2025-08-17 19:26:50.263053', '头像', 1, 'admin', 'image/jpeg');
INSERT INTO `sys_oss` VALUES (7, '/static/9b253e64f2a24feeb304b8ca24475839.jpeg', 91108, 'C:\\Users\\HP\\Desktop\\code\\person\\nest-admin2\\upload\\9b253e64f2a24feeb304b8ca24475839.jpeg', '2025-08-19 12:07:42.510489', '头像', 1, 'admin', 'image/jpeg');

-- ----------------------------
-- Table structure for sys_post
-- ----------------------------
DROP TABLE IF EXISTS `sys_post`;
CREATE TABLE `sys_post`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '岗位编码',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '岗位状态，1-有效，0-禁用',
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '备注',
  `order_num` int NOT NULL DEFAULT 0 COMMENT '排序',
  `create_date` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '岗位名称',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_post
-- ----------------------------
INSERT INTO `sys_post` VALUES (2, 'hr', 0, '山东科技山东科技花生壳', 1, '2022-01-06 20:32:01.513000', '人事');
INSERT INTO `sys_post` VALUES (3, 'it', 1, '写代码', 0, '2022-01-06 04:32:56.250000', '技术员');

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '角色名称',
  `remark` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '角色备注',
  `create_date` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_date` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO `sys_role` VALUES (1, '测试', '测试橘色', '2021-11-18 21:41:50.187783', '2021-11-18 21:41:50.187783');
INSERT INTO `sys_role` VALUES (2, '测试22', '测试呀', '2021-12-30 23:22:18.454332', '2023-06-23 01:46:20.000000');

-- ----------------------------
-- Table structure for sys_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_menu`;
CREATE TABLE `sys_role_menu`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role_id` bigint NOT NULL COMMENT '角色 id',
  `menu_id` bigint NOT NULL COMMENT '菜单 id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_role_menu
-- ----------------------------
INSERT INTO `sys_role_menu` VALUES (1, 1, 1);
INSERT INTO `sys_role_menu` VALUES (2, 1, 2);
INSERT INTO `sys_role_menu` VALUES (3, 1, 3);
INSERT INTO `sys_role_menu` VALUES (4, 1, 8);
INSERT INTO `sys_role_menu` VALUES (5, 1, 9);
INSERT INTO `sys_role_menu` VALUES (6, 1, 10);
INSERT INTO `sys_role_menu` VALUES (7, 1, 11);
INSERT INTO `sys_role_menu` VALUES (8, 1, 4);
INSERT INTO `sys_role_menu` VALUES (9, 1, 12);
INSERT INTO `sys_role_menu` VALUES (10, 1, 13);
INSERT INTO `sys_role_menu` VALUES (11, 1, 14);
INSERT INTO `sys_role_menu` VALUES (12, 1, 15);
INSERT INTO `sys_role_menu` VALUES (13, 1, 5);
INSERT INTO `sys_role_menu` VALUES (14, 1, 6);
INSERT INTO `sys_role_menu` VALUES (15, 1, 16);
INSERT INTO `sys_role_menu` VALUES (16, 1, 17);
INSERT INTO `sys_role_menu` VALUES (17, 1, 18);
INSERT INTO `sys_role_menu` VALUES (18, 1, 7);
INSERT INTO `sys_role_menu` VALUES (21, 2, 2);
INSERT INTO `sys_role_menu` VALUES (22, 2, 4);
INSERT INTO `sys_role_menu` VALUES (23, 2, 3);
INSERT INTO `sys_role_menu` VALUES (24, 2, 1);

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户登录密码',
  `salt` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '盐',
  `account` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户登录账号',
  `phone_num` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户手机号码',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '邮箱地址',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '所属状态: 1-有效，0-禁用',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '头像地址',
  `type` tinyint NOT NULL DEFAULT 1 COMMENT '帐号类型：0-超管， 1-普通用户',
  `create_date` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_date` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES (1, '$2a$10$JChCYKwJYbVV4ANalu2tBe.yUVLHAe01dB5QxcyXGohPK1QmqQwau', '$2a$10$JChCYKwJYbVV4ANalu2tBe', 'admin', '18374914562', '123@qq.com', 1, '/static/67f57d2058984103afc54d164aff5648.jpeg', 0, '2021-11-15 16:09:23.000000', '2025-08-17 19:26:38.000000');
INSERT INTO `sys_user` VALUES (2, '$2a$10$NSrq5H2chKrcMy/AeiHqK.C1ER40JmLWCh/OIpXkL/nZ4lHN/epse', '$2a$10$NSrq5H2chKrcMy/AeiHqK.', 'test', '18374915874', '12345@qq.com', 1, '/static/9b253e64f2a24feeb304b8ca24475839.jpeg', 1, '2021-12-30 15:25:47.000000', '2023-06-24 17:17:06.000000');

-- ----------------------------
-- Table structure for sys_user_dept
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_dept`;
CREATE TABLE `sys_user_dept`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL COMMENT '用户id',
  `dept_id` bigint NOT NULL COMMENT '部门id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_user_dept
-- ----------------------------
INSERT INTO `sys_user_dept` VALUES (1, 2, 2);

-- ----------------------------
-- Table structure for sys_user_post
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_post`;
CREATE TABLE `sys_user_post`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL COMMENT '用户id',
  `post_id` bigint NOT NULL COMMENT '岗位id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_user_post
-- ----------------------------

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL COMMENT '用户id',
  `role_id` bigint NOT NULL COMMENT '角色id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 37 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
INSERT INTO `sys_user_role` VALUES (35, 2, 2);
INSERT INTO `sys_user_role` VALUES (36, 2, 1);

-- ----------------------------
-- Table structure for todo_list
-- ----------------------------
DROP TABLE IF EXISTS `todo_list`;
CREATE TABLE `todo_list`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '待办事项标题',
  `completed` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否完成 (0:未完成, 1:已完成)',
  `priority` enum('高','中','低') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '中' COMMENT '优先级',
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of todo_list
-- ----------------------------
INSERT INTO `todo_list` VALUES (1, '待办事项标题', 1, '中', '2025-08-22 19:39:54.946180', '2025-08-22 20:26:40.000000');
INSERT INTO `todo_list` VALUES (2, '12', 1, '中', '2025-08-22 19:58:26.313493', '2025-08-22 20:05:31.408354');
INSERT INTO `todo_list` VALUES (3, '12', 1, '中', '2025-08-22 19:58:30.078099', '2025-08-22 20:05:46.698242');
INSERT INTO `todo_list` VALUES (4, '12', 1, '中', '2025-08-22 20:02:33.607329', '2025-08-22 20:26:53.000000');
INSERT INTO `todo_list` VALUES (5, '12', 0, '中', '2025-08-22 20:02:36.536739', '2025-08-23 10:44:21.000000');
INSERT INTO `todo_list` VALUES (6, '12', 0, '中', '2025-08-22 20:02:40.507021', '2025-08-23 10:44:18.000000');
INSERT INTO `todo_list` VALUES (7, '12', 0, '中', '2025-08-22 20:02:45.223412', '2025-08-23 10:57:49.000000');
INSERT INTO `todo_list` VALUES (8, '12', 0, '中', '2025-08-22 20:02:49.082594', '2025-08-23 10:57:50.000000');

-- ----------------------------
-- Table structure for user_collections
-- ----------------------------
DROP TABLE IF EXISTS `user_collections`;
CREATE TABLE `user_collections`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '网站名称',
  `url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '网站地址',
  `icon` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '网站图标URL',
  `category` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '其他' COMMENT '收藏分类',
  `description` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备注信息',
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '收藏日期',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_collections
-- ----------------------------
INSERT INTO `user_collections` VALUES (1, '百度', 'https://www.baidu.com', 'https://www.baidu.com/favicon.ico', '搜索引擎', '国内最大的搜索引擎', '2025-08-22 15:49:35.340003');
INSERT INTO `user_collections` VALUES (2, 'GitHub', 'https://github.com', 'https://github.com/favicon.ico', '工具', '全球最大的代码托管平台', '2025-08-22 15:49:35.340003');
INSERT INTO `user_collections` VALUES (3, 'MDN Web Docs', 'https://developer.mozilla.org', 'https://github.com/favicon.ico', '学习', 'Web技术文档和学习资源', '2025-08-22 15:49:35.340003');
INSERT INTO `user_collections` VALUES (6, '测试', 'http://baidu.com', 'http://baidu.com/favicon.ico', '工具', '测试1', '2025-08-22 17:50:50.006181');

-- ----------------------------
-- Table structure for user_messages
-- ----------------------------
DROP TABLE IF EXISTS `user_messages`;
CREATE TABLE `user_messages`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户姓名',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户邮箱',
  `subject` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '消息主题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '消息内容',
  `address` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户地址',
  `submit_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '提交日期时间',
  `status` enum('unread','read') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'unread' COMMENT '消息状态：未读/已读',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_messages
-- ----------------------------
INSERT INTO `user_messages` VALUES (1, '张三', 'zhangsan@example.com', '产品咨询', '请问贵公司的产品如何购买？', '北京市朝阳区', '2024-01-15 00:00:00.000000', 'read');
INSERT INTO `user_messages` VALUES (2, '李四', 'lisi@example.com', '技术支持', '使用过程中遇到了一些问题，希望能得到帮助', '上海市浦东新区', '2024-01-16 00:00:00.000000', 'read');
INSERT INTO `user_messages` VALUES (5, '测试', 'osianneclure@id.swapco.de', '百度', '测试', 'http://localhost:3000', '2025-08-23 13:09:35.942231', 'unread');
INSERT INTO `user_messages` VALUES (6, '测试', 'osianneclure@id.swapco.de', '百度', '菜单', 'http://localhost:3000', '2025-08-24 12:33:40.900290', 'unread');

-- ----------------------------
-- Table structure for visit_stats
-- ----------------------------
DROP TABLE IF EXISTS `visit_stats`;
CREATE TABLE `visit_stats`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL COMMENT '统计日期',
  `count` int NOT NULL DEFAULT 0 COMMENT '访问量',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of visit_stats
-- ----------------------------
INSERT INTO `visit_stats` VALUES (2, '2025-08-13', 15, '2025-08-22 21:21:58', '2025-08-22 21:21:58');
INSERT INTO `visit_stats` VALUES (3, '2025-08-14', 23, '2025-08-22 21:21:58', '2025-08-22 21:21:58');
INSERT INTO `visit_stats` VALUES (4, '2025-08-15', 18, '2025-08-22 21:21:58', '2025-08-22 21:21:58');
INSERT INTO `visit_stats` VALUES (5, '2025-08-16', 35, '2025-08-22 21:21:58', '2025-08-22 21:21:58');
INSERT INTO `visit_stats` VALUES (6, '2025-08-17', 42, '2025-08-22 21:21:58', '2025-08-22 21:21:58');
INSERT INTO `visit_stats` VALUES (7, '2025-08-18', 28, '2025-08-22 21:21:58', '2025-08-22 21:21:58');
INSERT INTO `visit_stats` VALUES (8, '2025-08-19', 56, '2025-08-22 21:21:58', '2025-08-22 21:21:58');
INSERT INTO `visit_stats` VALUES (9, '2025-08-20', 67, '2025-08-22 21:21:58', '2025-08-22 21:21:58');
INSERT INTO `visit_stats` VALUES (10, '2025-08-21', 89, '2025-08-22 21:21:58', '2025-08-22 21:21:58');
INSERT INTO `visit_stats` VALUES (11, '2025-08-22', 78, '2025-08-22 21:21:58', '2025-08-22 21:21:58');
INSERT INTO `visit_stats` VALUES (12, '2025-08-23', 1, '2025-08-23 11:44:08', '2025-08-23 11:44:08');
INSERT INTO `visit_stats` VALUES (13, '2025-08-24', 6, '2025-08-24 12:30:59', '2025-08-24 12:30:59');
INSERT INTO `visit_stats` VALUES (14, '2025-08-24', 1, '2025-08-24 12:31:00', '2025-08-24 12:31:00');
INSERT INTO `visit_stats` VALUES (15, '2025-08-25', 28, '2025-08-25 19:07:18', '2025-08-25 19:07:18');

SET FOREIGN_KEY_CHECKS = 1;
