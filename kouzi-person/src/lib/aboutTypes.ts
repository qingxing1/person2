// TypeScript Interface for About Page Content

export interface EducationItem {
  year: string;          // 年份区间 (如: "2017-2021")
  degree: string;        // 学位 (如: "本科", "硕士")
  major: string;         // 专业 (如: "计算机科学与技术")
  school: string;        // 学校 (如: "某大学")
  description?: string;   // 描述 (可选)
}

export interface WorkExperienceItem {
  year: string;          // 年份区间 (如: "2023-至今")
  position: string;      // 职位 (如: "全栈工程师")
  company: string;       // 公司 (如: "科技有限公司")
  description?: string;   // 描述 (可选)
}

export interface ProjectItem {
  title: string;         // 项目标题
  description: string;   // 项目描述
  tech: string[];        // 技术栈
  link: string;          // 项目链接
}

export interface AboutMeData {
  id: number;
  nickname?: string | null;
  real_name?: string | null;
  motto?: string | null;
  bio?: string | null;
  degree_simple?: string | null;
  school_simple?: string | null;
  skills: string[];
  hobbies: string[];
  email?: string | null;
  phone?: string | null;
  wechat?: string | null;
  qq?: string | null;
  github?: string | null;
  gitee?: string | null;
  website?: string | null;
  education_history: EducationItem[] | null;
  work_experience: WorkExperienceItem[] | null;
  projects: ProjectItem[];
  self_evaluation?: string | null;
  created_at: string;
  updated_at: string;
}