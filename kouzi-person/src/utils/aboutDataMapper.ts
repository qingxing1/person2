// 数据映射函数
export const mapApiToAboutMeData = (apiData: any) => {
  if (!apiData) return null;
  
  return {
    id: parseInt(apiData.id) || 0,
    nickname: apiData.nickname || null,
    real_name: apiData.realName || null,
    motto: apiData.motto || null,
    bio: apiData.bio || null,
    degree_simple: apiData.degreeSimple || null,
    school_simple: apiData.schoolSimple || null,
    skills: apiData.skills || [],
    hobbies: apiData.hobbies || [],
    email: apiData.email || null,
    phone: apiData.phone || null,
    wechat: apiData.wechat || null,
    qq: apiData.qq || null,
    github: apiData.github || null,
    gitee: apiData.gitee || null,
    website: apiData.website || null,
    education_history: apiData.educationHistory || [],
    work_experience: apiData.workExperience || [],
    projects: apiData.projects || [],
    self_evaluation: apiData.selfEvaluation || null,
    created_at: apiData.createdAt || new Date().toISOString(),
    updated_at: apiData.updatedAt || new Date().toISOString()
  };
};