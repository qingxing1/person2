// TypeScript Interface for About Page Content

export interface EducationItem {
  year: string;          // 年份区间 (如: "2017-2021")
  degree: string;        // 学位 (如: "本科", "硕士")
  major: string;         // 专业 (如: "计算机科学与技术")
  school: string;        // 学校 (如: "某大学")
  description: string;   // 描述
}

export interface WorkExperienceItem {
  year: string;          // 年份区间 (如: "2023-至今")
  position: string;      // 职位 (如: "全栈工程师")
  company: string;       // 公司 (如: "科技有限公司")
  description: string;   // 描述
}

export interface ProjectItem {
  title: string;         // 项目标题
  description: string;   // 项目描述
  tech: string[];        // 技术栈
  link: string;          // 项目链接
}

export interface AboutMeData {
  id: number;
  nickname?: string;
  real_name?: string;
  motto?: string;
  bio?: string;
  degree_simple?: string;
  school_simple?: string;
  skills: string[];
  hobbies: string[];
  email?: string;
  phone?: string;
  wechat?: string;
  qq?: string;
  github?: string;
  gitee?: string;
  website?: string;
  education_history: EducationItem[];
  work_experience: WorkExperienceItem[];
  projects: ProjectItem[];
  created_at: string;
  updated_at: string;
}