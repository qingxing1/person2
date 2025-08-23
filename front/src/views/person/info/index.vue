<template>
  <div class="info-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-info">
          <div class="title-wrapper">
            <div class="title-icon">
              <el-icon>
                <User />
              </el-icon>
            </div>
            <div class="title-text">
              <h2>个人信息设置</h2>
              <p class="subtitle">管理您的个人资料信息，展示专业形象</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <el-card class="info-card">
      <el-form ref="infoFormRef" :model="infoForm" :rules="rules" label-width="100px" class="info-form">
        <!-- 基本信息 -->
        <el-divider content-position="left">基本信息</el-divider>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickname">
              <el-input v-model="infoForm.nickname" placeholder="请输入昵称" maxlength="20" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="realName">
              <el-input v-model="infoForm.realName" placeholder="请输入真实姓名" maxlength="10" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="infoForm.gender" placeholder="请选择性别" style="width: 100%">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
                <el-option label="保密" value="保密" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker v-model="infoForm.birthday" type="date" placeholder="选择出生日期" style="width: 100%"
                :disabled-date="disabledBirthday" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="个人简介" prop="bio">
          <el-input v-model="infoForm.bio" type="textarea" :rows="3" placeholder="简短介绍自己，最多200字" maxlength="200"
            show-word-limit />
        </el-form-item>

        <!-- 联系方式 -->
        <el-divider content-position="left">联系方式</el-divider>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="邮箱地址" prop="email">
              <el-input v-model="infoForm.email" placeholder="请输入邮箱地址">
                <template #prefix>
                  <el-icon>
                    <Message />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="infoForm.phone" placeholder="请输入手机号码">
                <template #prefix>
                  <el-icon>
                    <Phone />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="QQ号码" prop="qq">
              <el-input v-model="infoForm.qq" placeholder="请输入QQ号码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="微信号码" prop="wechat">
              <el-input v-model="infoForm.wechat" placeholder="请输入微信号码" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 地理位置 -->
        <el-divider content-position="left">地理位置</el-divider>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所在地区" prop="location">
              <el-input v-model="infoForm.location" placeholder="请输入所在地区，如：北京市朝阳区" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="infoForm.address" placeholder="请输入详细街道地址" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 专业技能 -->
        <el-divider content-position="left">专业技能</el-divider>

        <el-form-item label="技术栈" prop="skills">
          <TagSelector v-model="infoForm.skills" :available-tags="skillOptions" placeholder="请输入或选择您的技术栈" />
        </el-form-item>



        <!-- 兴趣爱好 -->
        <el-divider content-position="left">兴趣爱好</el-divider>

        <el-form-item label="兴趣标签" prop="hobbies">
          <TagSelector v-model="infoForm.hobbies" :available-tags="hobbyOptions" placeholder="请输入或选择您的兴趣爱好" />
        </el-form-item>

        <!-- 社交媒体 -->
        <el-divider content-position="left">社交媒体</el-divider>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="GitHub" prop="github">
              <el-input v-model="infoForm.github" placeholder="GitHub用户名">
                <template #prepend>github.com/</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="个人网站" prop="website">
              <el-input v-model="infoForm.website" placeholder="个人网站或博客地址">
                <template #prepend>https://</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 扩展信息 -->
        <el-divider content-position="left">扩展信息</el-divider>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="教育背景" prop="education">
              <el-select v-model="infoForm.education" placeholder="请选择最高学历" style="width: 100%">
                <el-option label="高中" value="高中" />
                <el-option label="专科" value="专科" />
                <el-option label="本科" value="本科" />
                <el-option label="硕士" value="硕士" />
                <el-option label="博士" value="博士" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="毕业院校" prop="school">
              <el-input v-model="infoForm.school" placeholder="请输入毕业院校" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="loading">
            <el-icon>
              <Check />
            </el-icon>
            保存修改
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  User,
  Message,
  Phone,
  Check,
} from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

// 引入组件
import TagSelector from './components/TagSelector.vue'
import { getPersonInfo, updatePersonInfo } from '@/api/person'
import type { UserInfo } from '@/api/person'



// 表单实例
const infoFormRef = ref<FormInstance>()
const loading = ref(false)

// 表单数据
const infoForm = reactive({
  avatar: '',
  nickname: '',
  realName: '',
  gender: '',
  birthday: '',
  bio: '',
  email: '',
  phone: '',
  qq: '',
  wechat: '',
  location: '',
  address: '',
  skills: [] as string[],
  experience: 0,

  hobbies: [] as string[],
  github: '',
  website: '',
  education: '',
  school: '',
  expectedSalary: 15
})

// 页面加载时获取个人信息
onMounted(() => {
  fetchPersonInfo()
})

// 获取个人信息
const fetchPersonInfo = async () => {
  try {
    loading.value = true
    const response:any = await getPersonInfo()

    if (response.code === 200 && response.data && response.data.length > 0) {
      const userData = response.data[0] // 获取第一个用户数据

      // 填充表单数据
      infoForm.nickname = userData.nickname || ''
      infoForm.realName = userData.realName || ''
      infoForm.gender = userData.gender || ''
      infoForm.birthday = userData.birthday || ''
      infoForm.bio = userData.bio || ''
      infoForm.email = userData.email || ''
      infoForm.phone = userData.phone || ''
      infoForm.qq = userData.qq || ''
      infoForm.wechat = userData.wechat || ''
      // 处理地区数据 - 直接作为字符串使用
      infoForm.location = userData.location || ''
      infoForm.address = userData.address || ''
      infoForm.skills = userData.skills ? userData.skills.split(',').filter((skill: any) => skill.trim()) : []
      infoForm.hobbies = userData.hobbies ? userData.hobbies.split(',').filter((hobby: any) => hobby.trim()) : []
      infoForm.github = userData.github || ''
      infoForm.website = userData.website ? userData.website.replace('https://', '') : ''
      infoForm.education = userData.education || ''
      infoForm.school = userData.school || ''
      ElMessage.success('个人信息加载成功')
    } else {
      ElMessage.warning('暂无个人信息，请填写表单')
    }
  } catch (error) {
    console.error('获取个人信息失败:', error)
    ElMessage.error('获取个人信息失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 验证规则
const rules: FormRules = {
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  bio: [
    { max: 200, message: '最多200个字符', trigger: 'blur' }
  ]
}

// 选项数据
const skillOptions = [
  'JavaScript', 'TypeScript', 'Vue.js', 'React', 'Angular',
  'Node.js', 'Python', 'Java', 'Go', 'Rust',
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
  'Docker', 'Kubernetes', 'CI/CD', 'AWS', '阿里云',
  'Spring Boot', 'Django', 'Flask', 'Express', 'NestJS'
]

const hobbyOptions = [
  '编程', '阅读', '音乐', '电影', '旅行', '摄影',
  '健身', '美食', '游戏', '绘画', '写作', '舞蹈',
  '篮球', '足球', '羽毛球', '游泳', '跑步', '瑜伽',
  '登山', '滑雪', '骑行', '露营', '钓鱼', '园艺'
]


// 禁用未来日期
const disabledBirthday = (time: Date): boolean => {
  return time.getTime() > Date.now()
}

// 提交表单
const submitForm = async (): Promise<void> => {
  if (!infoFormRef.value) return

  await infoFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true

        // 准备提交数据
        const submitData: UserInfo = {
          id: 1, // 默认用户ID
          nickname: infoForm.nickname,
          realName: infoForm.realName,
          gender: infoForm.gender,
          birthday: infoForm.birthday,
          bio: infoForm.bio,
          email: infoForm.email,
          phone: infoForm.phone,
          qq: infoForm.qq,
          wechat: infoForm.wechat,
          location: infoForm.location || '',
          address: infoForm.address,
          skills: infoForm.skills.join(','),
          hobbies: infoForm.hobbies.join(','),
          github: infoForm.github,
          website: infoForm.website ? `https://${infoForm.website}` : '',
          education: infoForm.education,
          school: infoForm.school
        }

        const response: any = await updatePersonInfo(submitData)
        if (response.code === 200) {
          ElMessage.success('个人信息更新成功！')
        } else {
          ElMessage.error(response.msg || '更新失败')
        }
      } catch (error) {
        console.error('更新个人信息失败:', error)
        ElMessage.error('更新失败，请稍后重试')
      } finally {
        loading.value = false
      }
    } else {
      ElMessage.error('请完善表单信息')
    }
  })
}
</script>
<style scoped>
.info-container {
  background-color: #f5f5f5;
}

.page-header {
  margin-bottom: 10px;
  padding: 20px 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-bottom: none;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border-radius: 12px;
  color: #fff;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.title-text h2 {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  line-height: 1.3;
}

.subtitle {
  margin: 0;
  font-size: 14px;
  color: #8c8c8c;
  line-height: 1.5;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.info-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-form {
  margin: 0 auto;
}

:deep(.el-divider__text) {
  background-color: #fff;
  color: #262626;
  font-weight: 600;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .info-container {
    padding: 16px;
  }

  .page-header {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .title-wrapper {
    gap: 12px;
  }

  .title-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .title-text h2 {
    font-size: 20px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .header-actions .el-button {
    flex: 1;
    max-width: 120px;
  }

  .info-form {
    padding: 0 8px;
  }

  :deep(.el-form-item__label) {
    text-align: left;
  }
}
</style>