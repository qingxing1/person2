<template>
  <div class="collect-management-container">
    <!-- 页面标题 -->
    <div class="page-header-modern">
      <div class="header-container">
        <div class="header-left">
          <div class="icon-badge">
            <el-icon class="header-icon"><Star /></el-icon>
          </div>
          <div class="header-info">
            <h1 class="page-title">收藏管理</h1>
            <p class="page-description">集中管理您的网站收藏，支持分类整理和智能搜索</p>
          </div>
        </div>
        <div class="header-actions">
          <el-button type="primary" @click="showAddDialog = true" :icon="Plus" class="add-btn">
            <span class="btn-content">
              添加收藏
            </span>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="mb-2!">
      <div class="search-container">
        <div class="search-box">
          <div class="search-prefix">
            <el-icon><Search /></el-icon>
          </div>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索网站名称..."
            clearable
            class="modern-search"
            size="large"
          />
        </div>
        <div class="filter-chips">
          <el-tag
            :type="selectedCategory === '' ? 'primary' : ''"
            class="category-chip"
            effect="light"
            @click="selectedCategory = ''"
          >
            全部
          </el-tag>
          <el-tag
            v-for="category in categories"
            :key="category.value"
            :type="selectedCategory === category.value ? 'primary' : getCategoryType(category.value)"
            class="category-chip"
            effect="light"
            @click="selectedCategory = category.value"
          >
            {{ category.label }}
          </el-tag>
        </div>
      </div>
    </div>

    <!-- 收藏列表 -->
    <el-card class="collect-list-card">
      <el-table
        v-loading="loading"
        :data="paginatedCollects"
        style="width: 100%"
        border
        highlight-current-row
        empty-text="暂无收藏内容"
      >
        <el-table-column prop="id" label="ID" width="60" align="center" />
        <el-table-column label="网站图标" width="100" align="center">

          <template #default="scope">
            <div class="website-icon">
              <img 
                v-if="scope.row.icon" 
                :src="scope.row.icon" 
                :alt="scope.row.name"
                @error="handleImageError(scope.row)"
              />
              <div v-else class="icon-placeholder">
                <el-icon><Link /></el-icon>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="网站名称" width="150" align="center" />
        <el-table-column prop="url" label="网址" width="200" align="center">
          <template #default="scope">
            <el-link 
              :href="scope.row.url" 
              target="_blank" 
              type="primary"
              :underline="false"
            >
              {{ scope.row.url }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="100" align="center">

          <template #default="scope">
            <el-tag size="small" :type="getCategoryType(scope.row.category)">
              {{ scope.row.category }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="备注" min-width="200" align="center" />
        <el-table-column prop="createTime" label="收藏时间" width="100" align="center" />
        <el-table-column label="操作" width="180" fixed="right" align="center">

          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="editCollect(scope.row)"
              :icon="Edit"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteCollect(scope.row.id)"
              :icon="Delete"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
    </el-card>

    <!-- 添加/编辑收藏弹窗 -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingCollect ? '编辑收藏' : '添加收藏'"
      :width="'50%'"
      :before-close="handleCloseDialog"
    >
      <el-form
        ref="collectFormRef"
        :model="collectForm"
        :rules="collectRules"
        label-width="100px"
      >
        <el-form-item label="网站名称" prop="name">
          <el-input v-model="collectForm.name" placeholder="请输入网站名称" />
        </el-form-item>
        <el-form-item label="网站地址" prop="url">
          <el-input v-model="collectForm.url" placeholder="请输入完整的网址" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="collectForm.category" placeholder="请选择分类">
            <el-option
              v-for="item in categories"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="网站图标" prop="icon">
          <el-input v-model="collectForm.icon" placeholder="请输入图标URL（可选）" />
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input
            v-model="collectForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息，便于记忆"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCloseDialog">取消</el-button>
          <el-button type="primary" @click="submitCollect" :loading="submitLoading">
            {{ editingCollect ? '更新' : '添加' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Star, Plus, Edit, Delete, Link,Search } from '@element-plus/icons-vue'
import { getCollectionList, addCollection,updateCollection,deleteCollection,getCategoryList, getCollectionListByCategory } from '@/api/collection'


// 定义收藏类型
interface CollectItem {
  id: number
  name: string
  url: string
  icon: string
  category: string
  description: string
  createTime: string
}

interface CollectionListResponse {
  data: CollectItem[]
  total: number
  page: number
  size: number
  totalPages: number
}

// 分类选项 - 从API获取
const categories = ref<{ label: string; value: string }[]>([])
const selectedCategory = ref('')

// 数据状态
const collects = ref<CollectItem[]>([])
const loading = ref(false)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const showAddDialog = ref(false)
const editingCollect = ref<CollectItem | null>(null)
const submitLoading = ref(false)
const totalCount = ref(0)

// 表单引用
const collectFormRef = ref()

// 表单数据
const collectForm = ref({
  name: '',
  url: '',
  icon: '',
  category: '其他',
  description: ''
})

// 表单验证规则
const collectRules = {
  name: [
    { required: true, message: '请输入网站名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  url: [
    { required: true, message: '请输入网站地址', trigger: 'blur' },
    { 
      pattern: /^https?:\/\/.+/, 
      message: '请输入有效的网址（以http://或https://开头）', 
      trigger: 'blur' 
    }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  description: [
    { max: 200, message: '备注最多200个字符', trigger: 'blur' }
  ]
}



// 分页处理
const paginatedCollects = computed(() => {
  return collects.value
})

// 获取分类列表
async function fetchCategories() {
  try {
    const response:any = await getCategoryList()

    if (response.code === 200) {
      // 假设API返回的是字符串数组
      const categoryData = response.data as string[]
      categories.value = categoryData.map(cat => ({
        label: cat,
        value: cat
      }))
    } else {
      ElMessage.error(response.msg || '获取分类列表失败')
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
    ElMessage.error('获取分类列表失败，请稍后重试')
  }
}

// 监听搜索关键词变化
watch([searchKeyword, selectedCategory], () => {
  currentPage.value = 1
  fetchCollects()
})

// 页面加载时获取数据
onMounted(() => {
  fetchCollects()
  fetchCategories()
})

// 获取分类标签类型
function getCategoryType(category: string) {
  const typeMap: Record<string, string> = {
    '技术': 'primary',
    '学习': 'success',
    '工具': 'warning',
    '娱乐': 'danger',
    '购物': 'info',
    '其他': '',
    '搜索引擎': 'primary'
  }
  return typeMap[category] || ''
}

// 获取收藏数据
async function fetchCollects() {
  loading.value = true
  try {
    const params: any = {
      page: currentPage.value.toString(),
      size: pageSize.value.toString()
    }
    
    // 添加搜索参数
    if (searchKeyword.value) {
      params.name = searchKeyword.value
    }
    
    // 添加分类参数
    if (selectedCategory.value) {
      params.category = selectedCategory.value
    }
    
    const response:any = await getCollectionList(params)
    if (response.code === 200) {
      const data = response.data as CollectionListResponse
      collects.value = data.data.map(item => ({
        ...item,
        createTime: new Date(item.createTime).toLocaleDateString()
      }))
      totalCount.value = data.total
    } else {
      ElMessage.error(response.msg || '获取收藏列表失败')
    }
  } catch (error) {
    console.error('获取收藏列表失败:', error)
    ElMessage.error('获取收藏列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 处理图片加载错误
function handleImageError(item: CollectItem) {
  item.icon = ''
}

// 打开编辑对话框
function editCollect(item: CollectItem) {
  editingCollect.value = item
  collectForm.value = {
    name: item.name,
    url: item.url,
    icon: item.icon || '',
    category: item.category,
    description: item.description
  }
  showAddDialog.value = true
}

// 删除收藏
async function deleteCollect(id: number) {
  try {
    const confirmResult = await ElMessageBox.confirm('确定要删除这个收藏吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    if (confirmResult) {
      const response:any = await deleteCollection(id.toString())

      if (response.code === 200) {
        ElMessage.success('删除成功')
        fetchCollects()
      } else {
        ElMessage.error(response.msg || '删除失败')
      }
    }
  } catch (error) {
    // 用户取消删除
  }
}

// 关闭对话框
function handleCloseDialog() {
  showAddDialog.value = false
  editingCollect.value = null
  collectFormRef.value?.resetFields()
  collectForm.value = {
    name: '',
    url: '',
    icon: '',
    category: '其他',
    description: ''
  }
}

// 提交表单
async function submitCollect() {
  const valid = await collectFormRef.value?.validate()
  if (!valid) return
  
  submitLoading.value = true
  try {
    let response:any

    
    if (editingCollect.value) {
      // 编辑模式
      response = await updateCollection({
        id: editingCollect.value.id.toString(),
        ...collectForm.value
      })
    } else {
      // 添加模式
      response = await addCollection(collectForm.value)
    }
    
    if (response.code === 200) {
      ElMessage.success(editingCollect.value ? '更新成功' : '添加成功')
      fetchCollects()
      handleCloseDialog()
    } else {
      ElMessage.error(response.msg || '操作失败')
    }
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败，请稍后重试')
  } finally {
    submitLoading.value = false
  }
}

// 分页大小变化
function handleSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
  fetchCollects()
}

// 当前页码变化
function handleCurrentChange(current: number) {
  currentPage.value = current
  fetchCollects()
}


</script>

<style scoped>
.collect-management-container {
  background-color: #f5f5f5;
}

/* 全新的现代设计风格 */
.page-header-modern {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-badge {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
}

.header-icon {
  font-size: 28px;
  color: white;
}

.header-info h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
}

.page-description {
  margin: 0;
  font-size: 15px;
  color: #64748b;
  line-height: 1.5;
}

.header-stats {
  display: flex;
  gap: 32px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.add-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-weight: 600;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
  transition: all 0.2s ease;
}

.add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 15px -3px rgba(59, 130, 246, 0.4);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-container {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.search-box {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.search-prefix {
  color: #64748b;
  font-size: 20px;
}

.modern-search :deep(.el-input__wrapper) {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  box-shadow: none;
  transition: all 0.2s ease;
}

.modern-search :deep(.el-input__wrapper):hover {
  border-color: #3b82f6;
  background: white;
}

.modern-search :deep(.el-input__wrapper).is-focus {
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.category-chip {
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-chip:hover {
  transform: translateY(-1px);
}

.collect-list-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.website-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}
:deep(.el-table .cell) {
  display: flex;
  align-items: center;
  justify-content: center;

}
.website-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.icon-placeholder {
  width: 32px;
  height: 32px;
  background-color: #f0f0f0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .collect-management-container {
    padding: 16px;
  }

  .page-header {
    margin-bottom: 24px;
    padding: 20px 0;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    padding: 0 20px;
  }

  .title-section {
    gap: 12px;
  }

  .title-icon-wrapper {
    width: 40px;
    height: 40px;
  }

  .title-icon {
    font-size: 20px;
  }

  .title-text h2 {
    font-size: 20px;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .el-button {
    width: 100%;
  }

  .search-filter-section {
    margin-bottom: 24px;
  }

  .search-card {
    padding: 16px;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .search-icon {
    display: none;
  }

  .collect-list-card .el-table {
    font-size: 12px;
  }

  .pagination-container {
    justify-content: center;
  }
}
</style>