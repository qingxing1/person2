<template>
  <div class="method-container">
    <div class="page-header">
      <div class="header-content">
        <div class="header-info">
          <h2>
            <el-icon><Grid /></el-icon>
            算法题管理
          </h2>
          <p class="subtitle">算法题库管理系统 - 统一管理平台</p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <div class="stat-number">{{ total }}</div>
            <div class="stat-label">总题目</div>
          </div>
          <div class="stat-item">
            <div class="stat-number success">{{ problems.filter(p => p.difficulty === '简单').length }}</div>
            <div class="stat-label">简单</div>
          </div>
          <div class="stat-item">
            <div class="stat-number warning">{{ problems.filter(p => p.difficulty === '中等').length }}</div>
            <div class="stat-label">中等</div>
          </div>
          <div class="stat-item">
            <div class="stat-number danger">{{ problems.filter(p => p.difficulty === '困难').length }}</div>
            <div class="stat-label">困难</div>
          </div>
        </div>
      </div>
    </div>

    <div class="content-area">
      <!-- 题目列表 -->
      <ProblemList :problems="problems" :loading="loading" :current-page="currentPage" :page-size="pageSize"
        :total="total" @add-problem="showAddDialog = true" @view-details="handleViewDetails"
        @edit-problem="handleEditProblem" @delete-problem="handleDeleteProblem" @page-change="handlePageChange"
      @update:page-size="handleSizeChange" />
    </div>

    <!-- 添加/编辑对话框 -->
    <el-dialog v-model="showAddDialog" :title="isEdit ? '编辑题目' : '添加题目'" width="80%" :close-on-click-modal="false">
      <div>
        <ProblemForm v-model="currentProblem" :is-edit="isEdit" :loading="formLoading" @submit="handleSubmit"
          @cancel="showAddDialog = false" />
      </div>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog v-model="showDetailDialog" title="题目详情" width="800px" :close-on-click-modal="false">
      <ProblemDetail :problem="currentProblem" @close="showDetailDialog = false" @edit-problem="handleEditFromDetail"
        @edit-solution="handleEditSolution" @edit-answer="handleEditAnswer" />
    </el-dialog>

    <!-- 编辑思路对话框 -->
    <el-dialog v-model="showSolutionDialog" title="编辑解题思路" width="600px">
      <el-input v-model="currentProblem.solution" type="textarea" :rows="8" placeholder="请输入解题思路" />
      <div class="dialog-actions">
        <el-button @click="showSolutionDialog = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateSolution" :loading="formLoading">
          保存
        </el-button>
      </div>
    </el-dialog>

    <!-- 编辑答案对话框 -->
    <el-dialog v-model="showAnswerDialog" title="编辑答案" width="600px">
      <el-input v-model="currentProblem.answer" type="textarea" :rows="8" placeholder="请输入答案或代码" />
      <div class="dialog-actions">
        <el-button @click="showAnswerDialog = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateAnswer" :loading="formLoading">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Grid } from '@element-plus/icons-vue'
import ProblemList from './components/ProblemList.vue'
import ProblemDetail from './components/ProblemDetail.vue'
import ProblemForm from './components/ProblemForm.vue'

interface Problem {
  id: number
  title: string
  difficulty: '简单' | '中等' | '困难'
  category: string
  description?: string
  solution?: string
  answer?: string
  createdAt: string
}

// 状态管理
const problems = ref<Problem[]>([])
const loading = ref(false)
const formLoading = ref(false)
const showAddDialog = ref(false)
const showDetailDialog = ref(false)
const showSolutionDialog = ref(false)
const showAnswerDialog = ref(false)
const isEdit = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const currentProblem = reactive<Problem>({
  id: 0,
  title: '',
  difficulty: '中等',
  category: '',
  description: '',
  solution: '',
  answer: '',
  createdAt: ''
})

// 模拟数据
const mockProblems: Problem[] = [
  {
    id: 1,
    title: '两数之和',
    difficulty: '简单',
    category: '数组',
    description: '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target 的那两个整数，并返回它们的数组下标。',
    solution: '使用哈希表存储已经遍历过的数字及其索引，时间复杂度O(n)',
    answer: '```javascript\nfunction twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n}\n```',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    title: '最长回文子串',
    difficulty: '中等',
    category: '字符串',
    description: '给你一个字符串 s，找到 s 中最长的回文子串。',
    solution: '使用中心扩展法，从每个字符向两边扩展判断回文',
    answer: '```javascript\nfunction longestPalindrome(s) {\n  if (s.length < 2) return s;\n  let start = 0, maxLen = 1;\n  \n  function expandAroundCenter(left, right) {\n    while (left >= 0 && right < s.length && s[left] === s[right]) {\n      const len = right - left + 1;\n      if (len > maxLen) {\n        maxLen = len;\n        start = left;\n      }\n      left--;\n      right++;\n    }\n  }\n  \n  for (let i = 0; i < s.length; i++) {\n    expandAroundCenter(i, i);\n    expandAroundCenter(i, i + 1);\n  }\n  \n  return s.substring(start, start + maxLen);\n}\n```',
    createdAt: '2024-01-16'
  }
]

// 方法
const loadProblems = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    problems.value = mockProblems.slice(
      (currentPage.value - 1) * pageSize.value,
      currentPage.value * pageSize.value
    )
    total.value = mockProblems.length
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const handleViewDetails = (problem: Problem) => {
  Object.assign(currentProblem, problem)
  showDetailDialog.value = true
}

const handleEditProblem = (problem: Problem) => {
  Object.assign(currentProblem, problem)
  isEdit.value = true
  showAddDialog.value = true
}

const handleDeleteProblem = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个题目吗？', '提示', {
      type: 'warning'
    })
    // 模拟删除
    problems.value = problems.value.filter(p => p.id !== id)
    ElMessage.success('删除成功')
  } catch {
    // 用户取消
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadProblems()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1 // 重置到第一页
  loadProblems()
}

const handleSubmit = async (data: any) => {
  formLoading.value = true
  try {
    if (isEdit.value) {
      // 模拟更新
      const index = problems.value.findIndex(p => p.id === data.id)
      if (index !== -1) {
        problems.value[index] = { ...data, createdAt: problems.value[index].createdAt }
      }
      ElMessage.success('更新成功')
    } else {
      // 模拟添加
      const newProblem = {
        ...data,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0]
      }
      problems.value.unshift(newProblem)
      total.value++
      ElMessage.success('添加成功')
    }
    showAddDialog.value = false
    resetForm()
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    formLoading.value = false
  }
}

const handleEditFromDetail = (problem: Problem) => {
  showDetailDialog.value = false
  Object.assign(currentProblem, problem)
  isEdit.value = true
  showAddDialog.value = true
}

const handleEditSolution = () => {
  showDetailDialog.value = false
  showSolutionDialog.value = true
}

const handleEditAnswer = () => {
  showDetailDialog.value = false
  showAnswerDialog.value = true
}

const handleUpdateSolution = () => {
  formLoading.value = true
  setTimeout(() => {
    const index = problems.value.findIndex(p => p.id === currentProblem.id)
    if (index !== -1) {
      problems.value[index].solution = currentProblem.solution
    }
    formLoading.value = false
    showSolutionDialog.value = false
    ElMessage.success('解题思路更新成功')
  }, 500)
}

const handleUpdateAnswer = () => {
  formLoading.value = true
  setTimeout(() => {
    const index = problems.value.findIndex(p => p.id === currentProblem.id)
    if (index !== -1) {
      problems.value[index].answer = currentProblem.answer
    }
    formLoading.value = false
    showAnswerDialog.value = false
    ElMessage.success('答案更新成功')
  }, 500)
}

const resetForm = () => {
  Object.assign(currentProblem, {
    id: 0,
    title: '',
    difficulty: '中等',
    category: '',
    description: '',
    solution: '',
    answer: '',
    createdAt: ''
  })
  isEdit.value = false
}

// 监听对话框关闭
watch(() => showAddDialog.value, (val) => {
  if (!val) {
    resetForm()
  }
})

onMounted(() => {
  loadProblems()
})
</script>

<style lang="scss" scoped>
.method-container {
  .page-header {
  margin-bottom: 24px;
  padding: 24px 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
}

.header-info h2 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 500;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-info h2 .el-icon {
  font-size: 24px;
  color: #409eff;
}

.subtitle {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.header-stats {
  display: flex;
  gap: 32px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.stat-number.success {
  color: #67c23a;
}

.stat-number.warning {
  color: #e6a23c;
}

.stat-number.danger {
  color: #f56c6c;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

  .content-area {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .dialog-actions {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}

:deep(.el-overlay-dialog){
   display: flex;
   justify-content: center;
   align-items: center;

}
:deep(.el-dialog) {
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .method-container {
    padding: 16px;
  }
  
  .page-header {
    margin-bottom: 16px;
    padding: 16px 0;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 0 16px;
  }
  
  .header-info h2 {
    font-size: 18px;
  }
  
  .header-stats {
    gap: 16px;
    width: 100%;
    justify-content: space-around;
  }
  
  .stat-item {
    flex: 1;
    min-width: 60px;
  }
  
  .stat-number {
    font-size: 20px;
  }
}
</style>