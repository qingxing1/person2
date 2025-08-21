<template>
  <div class="method-container">
    <div class="page-header">
      <div class="header-content">
        <div class="header-info">
          <h2>
            <el-icon>
              <Grid />
            </el-icon>
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
            <div class="stat-number success">{{problems.filter(p => p.difficulty === '简单').length}}</div>
            <div class="stat-label">简单</div>
          </div>
          <div class="stat-item">
            <div class="stat-number warning">{{problems.filter(p => p.difficulty === '中等').length}}</div>
            <div class="stat-label">中等</div>
          </div>
          <div class="stat-item">
            <div class="stat-number danger">{{problems.filter(p => p.difficulty === '困难').length}}</div>
            <div class="stat-label">困难</div>
          </div>
        </div>
      </div>
    </div>

    <div class="content-area">
      <!-- 搜索和筛选区域 -->
      <div class="search-filter-section">
        <div class="search-row">
          <el-input
            v-model="searchTitle"
            placeholder="请输入题目名称搜索"
            clearable
            class="search-input"
            @clear="searchTitle = ''"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
          <el-select
            v-model="searchDifficulty"
            placeholder="选择难度"
            clearable
            class="filter-select"
            @clear="searchDifficulty = ''"
          >
            <el-option label="全部难度" value="" />
            <el-option label="简单" value="简单" />
            <el-option label="中等" value="中等" />
            <el-option label="困难" value="困难" />
          </el-select>
          
          <el-select
            v-model="searchCategory"
            placeholder="选择分类"
            clearable
            class="filter-select"
            @clear="searchCategory = ''"
          >
           <div v-for="category in CATEGORY" :key="category">
            <el-option :label="category" :value="category" />
           </div>
          </el-select>
          
          <el-button type="primary" @click="currentPage = 1; initMethodList()">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          
          <el-button @click="resetFilters">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </div>
      </div>

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
          @cancel="showAddDialog = false" :categories="CATEGORY" />

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
import { Grid, Search, Refresh } from '@element-plus/icons-vue'
import ProblemList from './components/ProblemList.vue'
import ProblemDetail from './components/ProblemDetail.vue'
import ProblemForm from './components/ProblemForm.vue'
import { getMethodList, deleteMethod, addMethod, updateMethod } from '@/api/method'
import type { Category } from '@/api/method'



interface Problem {
  id: string
  title: string
  difficulty: '简单' | '中等' | '困难'
  category: string
  description?: string
  solution?: string
  answer?: string
  createdAt: string
  updatedAt: string
}
const CATEGORY: Category[] = ['数组', '字符串', '链表', '树', '哈希表', '动态规划', '贪心', '回溯', '排序', '查找']
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

// 筛选条件
const searchTitle = ref('')
const searchDifficulty = ref('')
const searchCategory = ref('')

const currentProblem = reactive<Problem>({
  id: '',
  title: '',
  difficulty: '中等',
  category: '',
  description: '',
  solution: '',
  answer: '',
  createdAt: '',
  updatedAt: ''
})



const handleViewDetails = (problem: Problem) => {
  Object.assign(currentProblem, problem)
  showDetailDialog.value = true
}

const handleEditProblem = (problem: Problem) => {
  Object.assign(currentProblem, problem)
  isEdit.value = true
  showAddDialog.value = true
}

const handleDeleteProblem = async (id: string) => {
  await ElMessageBox.confirm('确定要删除这个题目吗？', '提示', {
    type: 'warning'
  })
  const res: any = await deleteMethod(id)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    initMethodList()
  } else {
    ElMessage.error(res.msg)
    initMethodList()
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  initMethodList()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1 // 重置到第一页
  initMethodList()
}

const handleSubmit = async (data: any) => {
  formLoading.value = true
  try {
    if (isEdit.value) {
      // 更新题目
      const res: any = await updateMethod(data.id.toString(), data)
      if (res.code === 200) {
        ElMessage.success('更新成功')
        initMethodList()
      } else {
        ElMessage.error(res.msg || '更新失败')
      }
    } else {
      // 新增题目
      // 移除id字段
      const { id, ...rest } = data
      const res: any = await addMethod(rest)
      if (res.code === 200) {
        ElMessage.success('添加成功')
        initMethodList()
      } else {
        ElMessage.error(res.msg || '添加失败')
      }
    }
    showAddDialog.value = false
    resetForm()
  } catch (error) {
    console.error('操作失败:', error)
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

const handleUpdateSolution = async () => {
  formLoading.value = true
  try {
    const res: any = await updateMethod(currentProblem.id.toString(), {
      ...currentProblem,
      solution: currentProblem.solution
    })
    if (res.code === 200) {
      ElMessage.success('解题思路更新成功')
      initMethodList()
    } else {
      ElMessage.error(res.msg || '更新失败')
    }
  } catch (error) {
    console.error('更新解题思路失败:', error)
    ElMessage.error('更新失败')
  } finally {
    formLoading.value = false
    showSolutionDialog.value = false
  }
}

const handleUpdateAnswer = async () => {
  formLoading.value = true
  try {
    const res: any = await updateMethod(currentProblem.id.toString(), {
      ...currentProblem,
      answer: currentProblem.answer
    })
    if (res.code === 200) {
      ElMessage.success('答案更新成功')
      initMethodList()
    } else {
      ElMessage.error(res.msg || '更新失败')
    }
  } catch (error) {
    console.error('更新答案失败:', error)
    ElMessage.error('更新失败')
  } finally {
    formLoading.value = false
    showAnswerDialog.value = false
  }
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

// 重置筛选条件
const resetFilters = () => {
  searchTitle.value = ''
  searchDifficulty.value = ''
  searchCategory.value = ''
  currentPage.value = 1
  initMethodList()
}

// 监听对话框关闭
watch(() => showAddDialog.value, (val) => {
  if (!val) {
    resetForm()
  }
})

// 监听筛选条件变化，自动重新加载数据
watch([searchTitle, searchDifficulty, searchCategory], () => {
  currentPage.value = 1 // 重置到第一页
  initMethodList()
})
// 初始化方法列表
const initMethodList = async () => {
  loading.value = true
  try {
    const query: any = {
      page: currentPage.value.toString(),
      limit: pageSize.value.toString()
    }
    
    // 添加筛选参数
    if (searchTitle.value) query.title = searchTitle.value
    if (searchDifficulty.value) query.difficulty = searchDifficulty.value
    if (searchCategory.value) query.category = searchCategory.value
    
    const res: any = await getMethodList(query)
    if (res.code === 200) {
      // 使用后端返回的分页数据结构
      problems.value = res.data.list || res.data
      total.value = res.data.total || res.data.length || 0
    }
  } catch (error) {
    console.error('获取算法题列表失败:', error)
    ElMessage.error('获取算法题列表失败')
  } finally {
    loading.value = false
  }
}


onMounted(() => {
  // loadProblems()
  initMethodList()
})
</script>

<style lang="scss" scoped>
.method-container {
  .page-header {
    margin-bottom: 10px;
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

  .search-filter-section {
    margin-bottom: 20px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .search-row {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }

  .search-input {
    flex: 1;
    min-width: 200px;
  }

  .filter-select {
    width: 150px;
  }

  .dialog-actions {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}

:deep(.el-overlay-dialog) {
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

  .search-row {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input,
  .filter-select {
    width: 100%;
    min-width: unset;
  }
}
</style>