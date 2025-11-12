# About Me Page Database Schema

## Table: `about_me`

### Description
This table stores all dynamic content for the About Me page, including personal information, professional background, skills, projects, and contact details.

### Table Structure

```sql
-- MySQL Database Schema for About Me Page
CREATE TABLE `about_me` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique identifier',

  -- Basic Personal Information
  `nickname` VARCHAR(50) NULL DEFAULT NULL COMMENT 'Nickname',
  `real_name` VARCHAR(50) NULL DEFAULT NULL COMMENT 'Real name',
  `motto` VARCHAR(200) NULL DEFAULT NULL COMMENT 'Personal motto/slogan',
  `bio` TEXT NULL COMMENT 'Detailed personal introduction',

  -- Simple Education Information (displayed in About Me section)
  `degree_simple` VARCHAR(50) NULL DEFAULT NULL COMMENT 'Simple degree info (e.g., "Master")',
  `school_simple` VARCHAR(100) NULL DEFAULT NULL COMMENT 'Simple school info (e.g., "ABC University")',

  -- Technical Skills (JSON array of strings)
  `skills` JSON NULL DEFAULT NULL COMMENT 'Technical skills list: ["React", "TypeScript", "Node.js"]',

  -- Hobbies (JSON array of strings)
  `hobbies` JSON NULL DEFAULT NULL COMMENT 'Hobbies list: ["Reading", "Fitness", "Coding"]',

  -- Contact Information
  `email` VARCHAR(100) NULL DEFAULT NULL COMMENT 'Email address',
  `phone` VARCHAR(20) NULL DEFAULT NULL COMMENT 'Phone number',
  `wechat` VARCHAR(50) NULL DEFAULT NULL COMMENT 'WeChat ID',
  `qq` VARCHAR(20) NULL DEFAULT NULL COMMENT 'QQ number',

  -- Social Links
  `github` VARCHAR(50) NULL DEFAULT NULL COMMENT 'GitHub username',
  `gitee` VARCHAR(50) NULL DEFAULT NULL COMMENT 'Gitee username',
  `website` VARCHAR(100) NULL DEFAULT NULL COMMENT 'Personal website/resume link',

  -- Education History (JSON array of objects)
  `education_history` JSON NULL DEFAULT NULL COMMENT 'Detailed education experiences: [{"year":"2017-2021","degree":"Bachelor","major":"Computer Science","school":"ABC University","description":"..."}]',

  -- Work Experience (JSON array of objects)
  `work_experience` JSON NULL DEFAULT NULL COMMENT 'Work experiences: [{"year":"2023-至今","position":"Full Stack Engineer","company":"Tech Co.","description":"..."}]',

  -- Projects (JSON array of objects)
  `projects` JSON NULL DEFAULT NULL COMMENT 'Project experiences: [{"title":"Personal Blog","description":"...","tech":["React","Node.js"],"link":"https://github.com/..."}]',

  -- System Fields
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation time',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Record last update time'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='About Me page dynamic content';
```

### Field Details

| Field Name | Data Type | Description | Example |
|------------|-----------|-------------|---------|
| **id** | BIGINT UNSIGNED | Unique primary key | 1 |
| **nickname** | VARCHAR(50) | User's nickname | "扣子" |
| **real_name** | VARCHAR(50) | User's real name | "张三" |
| **motto** | VARCHAR(200) | Personal motto | "技术改变世界，代码创造未来" |
| **bio** | TEXT | Detailed personal bio | "I'm a full stack developer with passion for modern web technologies..." |
| **degree_simple** | VARCHAR(50) | Simple degree info | "硕士" |
| **school_simple** | VARCHAR(100) | Simple school info | "某科技大学" |
| **skills** | JSON | Technical skills | `["React", "TypeScript", "Node.js", "Tailwind CSS"]` |
| **hobbies** | JSON | Hobbies and interests | `["阅读", "健身", "编程", "旅行"]` |
| **email** | VARCHAR(100) | Email address | "zhangsan@example.com" |
| **phone** | VARCHAR(20) | Phone number | "138-XXXX-XXXX" |
| **wechat** | VARCHAR(50) | WeChat ID | "zhangsan123" |
| **qq** | VARCHAR(20) | QQ number | "123456789" |
| **github** | VARCHAR(50) | GitHub username | "zhangsan" |
| **gitee** | VARCHAR(50) | Gitee username | "zhangsan" |
| **website** | VARCHAR(100) | Personal website | "https://zhangsan.dev" |
| **education_history** | JSON | Education background | ```[{"year":"2017-2021","degree":"本科","major":"计算机科学与技术","school":"某大学","description":"系统学习计算机基础知识..."},{"year":"2021-2023","degree":"硕士","major":"软件工程","school":"某科技大学","description":"深入研究软件工程理论..."}]``` |
| **work_experience** | JSON | Work experience | ```[{"year":"2023-至今","position":"全栈工程师","company":"科技有限公司","description":"负责前后端项目开发与维护..."}]``` |
| **projects** | JSON | Project experience | ```[{"title":"个人博客系统","description":"基于React+Node.js开发的现代化博客平台...","tech":["React","Node.js","MongoDB"],"link":"https://github.com/zhangsan/blog"}]``` |
| **created_at** | DATETIME | Creation time | "2025-11-12 10:00:00" |
| **updated_at** | DATETIME | Last update time | "2025-11-12 10:30:00" |

### Example Data Insertion

```sql
INSERT INTO `about_me` (`nickname`, `real_name`, `motto`, `bio`, `skills`, `hobbies`, `email`, `github`, `website`, `education_history`, `work_experience`, `projects`)
VALUES (
  '扣子',
  '张三',
  '技术改变世界，代码创造未来',
  '我是一名热爱编程的全栈工程师，专注于前端技术开发和用户体验优化...',
  '["React", "TypeScript", "Node.js", "Tailwind CSS"]',
  '["阅读", "健身", "编程", "旅行"]',
  'zhangsan@example.com',
  'zhangsan',
  'https://zhangsan.dev',
  '[
    {
      "year": "2017-2021",
      "degree": "本科",
      "major": "计算机科学与技术",
      "school": "某大学",
      "description": "系统学习计算机科学基础知识，包括数据结构、算法、操作系统等核心课程..."
    },
    {
      "year": "2021-2023",
      "degree": "硕士",
      "major": "软件工程",
      "school": "某科技大学",
      "description": "深入研究软件工程理论与实践，专注于前端技术和用户体验优化..."
    }
  ]',
  '[
    {
      "year": "2023-至今",
      "position": "全栈工程师",
      "company": "科技有限公司",
      "description": "负责公司前端和后端项目的开发与维护..."
    }
  ]',
  '[
    {
      "title": "个人博客系统",
      "description": "基于 React + Node.js 开发的现代化博客平台...",
      "tech": ["React", "Node.js", "MongoDB", "Express"],
      "link": "https://github.com/zhangsan/blog"
    }
  ]'
);
```

### API Response Format

The backend API should return data in the following JSON format:

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "id": 1,
    "nickname": "扣子",
    "real_name": "张三",
    "motto": "技术改变世界，代码创造未来",
    "bio": "我是一名热爱编程的全栈工程师...",
    "degree_simple": "硕士",
    "school_simple": "某科技大学",
    "skills": ["React", "TypeScript", "Node.js", "Tailwind CSS"],
    "hobbies": ["阅读", "健身", "编程", "旅行"],
    "email": "zhangsan@example.com",
    "phone": "138-XXXX-XXXX",
    "wechat": "zhangsan123",
    "qq": "123456789",
    "github": "zhangsan",
    "gitee": "zhangsan",
    "website": "https://zhangsan.dev",
    "education_history": [
      {
        "year": "2017-2021",
        "degree": "本科",
        "major": "计算机科学与技术",
        "school": "某大学",
        "description": "系统学习计算机基础知识..."
      }
    ],
    "work_experience": [
      {
        "year": "2023-至今",
        "position": "全栈工程师",
        "company": "科技有限公司",
        "description": "负责公司前后端项目的开发与维护..."
      }
    ],
    "projects": [
      {
        "title": "个人博客系统",
        "description": "基于 React + Node.js 开发的现代化博客平台...",
        "tech": ["React", "Node.js", "MongoDB", "Express"],
        "link": "https://github.com/zhangsan/blog"
      }
    ],
    "created_at": "2025-11-12T10:00:00.000Z",
    "updated_at": "2025-11-12T10:30:00.000Z"
  }
}
```

### Notes
1. This schema uses JSON data types for array structures (skills, hobbies, education_history, work_experience, projects), which are supported in MySQL 5.7+ and all modern databases.
2. All fields are nullable (NULL default) to accommodate partial data entry.
3. The `id` field is auto-incrementing, ensuring unique records.
4. System fields (`created_at`, `updated_at`) are automatically managed by the database.