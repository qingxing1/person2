<template>
  <div class="collect-management-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>
        <el-icon><Star /></el-icon>
        收藏管理
      </h2>
      <p class="subtitle">管理您收藏的网站和链接，添加备注便于记忆</p>
    </div>

    <!-- 搜索和添加区域 -->
    <div class="search-add-container">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索网站名称、网址或备注"
            prefix-icon="Search"
            clearable
          />
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="showAddDialog = true" :icon="Plus">
            添加收藏
          </el-button>
        </el-col>
      </el-row>
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
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="网站图标" width="80">
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
        <el-table-column prop="name" label="网站名称" width="150" />
        <el-table-column prop="url" label="网址">
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
        <el-table-column prop="category" label="分类" width="100">
          <template #default="scope">
            <el-tag size="small" :type="getCategoryType(scope.row.category)">
              {{ scope.row.category }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="备注" min-width="200" />
        <el-table-column prop="createTime" label="收藏时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
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
          :total="filteredCollects.length"
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
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Star, Plus, Edit, Delete, Link } from '@element-plus/icons-vue'

// 定义收藏类型
interface CollectItem {
  id: number
  name: string
  url: string
  icon?: string
  category: string
  description: string
  createTime: string
}

// 分类选项
const categories = [
  { label: '技术', value: '技术' },
  { label: '学习', value: '学习' },
  { label: '工具', value: '工具' },
  { label: '娱乐', value: '娱乐' },
  { label: '购物', value: '购物' },
  { label: '其他', value: '其他' }
]

// 数据状态
const collects = ref<CollectItem[]>([])
const loading = ref(false)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const showAddDialog = ref(false)
const editingCollect = ref<CollectItem | null>(null)
const submitLoading = ref(false)

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

// 过滤后的收藏
const filteredCollects = computed(() => {
  if (!searchKeyword.value) return collects.value
  
  const keyword = searchKeyword.value.toLowerCase()
  return collects.value.filter(item =>
    item.name.toLowerCase().includes(keyword) ||
    item.url.toLowerCase().includes(keyword) ||
    item.description.toLowerCase().includes(keyword) ||
    item.category.toLowerCase().includes(keyword)
  )
})

// 分页处理
const paginatedCollects = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return filteredCollects.value.slice(startIndex, endIndex)
})

// 页面加载时获取数据
onMounted(() => {
  fetchCollects()
})

// 获取分类标签类型
function getCategoryType(category: string) {
  const typeMap: Record<string, string> = {
    '技术': 'primary',
    '学习': 'success',
    '工具': 'warning',
    '娱乐': 'danger',
    '购物': 'info',
    '其他': ''
  }
  return typeMap[category] || ''
}

// 获取收藏数据
function fetchCollects() {
  loading.value = true
  
  // 模拟API请求延迟
  setTimeout(() => {
    // 从本地存储获取数据
    const storedData = localStorage.getItem('collects')
    if (storedData) {
      collects.value = JSON.parse(storedData)
    } else {
      // 生成模拟数据
      const mockData: CollectItem[] = [
        {
          id: 1,
          name: 'Vue.js',
          url: 'https://vuejs.org',
          icon: 'https://vuejs.org/logo.svg',
          category: '技术',
          description: '渐进式JavaScript框架',
          createTime: new Date(Date.now() - 86400000).toISOString().slice(0, 10)
        },
        {
          id: 2,
          name: 'GitHub',
          url: 'https://github.com',
          icon: 'https://github.com/favicon.ico',
          category: '工具',
          description: '全球最大的代码托管平台',
          createTime: new Date(Date.now() - 172800000).toISOString().slice(0, 10)
        },
        {
          id: 3,
          name: 'MDN Web Docs',
          url: 'https://developer.mozilla.org',
          category: '学习',
          description: 'Web技术文档和学习资源',
          createTime: new Date(Date.now() - 259200000).toISOString().slice(0, 10)
        }
      ]
      collects.value = mockData
      saveToLocalStorage()
    }
    loading.value = false
  }, 500)
}

// 保存到本地存储
function saveToLocalStorage() {
  localStorage.setItem('collects', JSON.stringify(collects.value))
}

// 处理图片加载错误
function handleImageError(item: CollectItem) {
  item.icon = undefined
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
function deleteCollect(id: number) {
  ElMessageBox.confirm('确定要删除这个收藏吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = collects.value.findIndex(item => item.id === id)
    if (index !== -1) {
      collects.value.splice(index, 1)
      saveToLocalStorage()
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    // 取消删除
  })
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
function submitCollect() {
  collectFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      submitLoading.value = true
      
      setTimeout(() => {
        if (editingCollect.value) {
          // 编辑模式
          const index = collects.value.findIndex(item => item.id === editingCollect.value!.id)
          if (index !== -1) {
            collects.value[index] = {
              ...editingCollect.value,
              ...collectForm.value,
              createTime: editingCollect.value.createTime
            }
            ElMessage.success('更新成功')
          }
        } else {
          // 添加模式
          const newCollect: CollectItem = {
            id: Date.now(),
            ...collectForm.value,
            createTime: new Date().toISOString().slice(0, 10)
          }
          collects.value.unshift(newCollect)
          ElMessage.success('添加成功')
        }
        
        saveToLocalStorage()
        handleCloseDialog()
        submitLoading.value = false
      }, 500)
    }
  })
}

// 分页大小变化
function handleSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
}

// 当前页码变化
function handleCurrentChange(current: number) {
  currentPage.value = current
}
</script>

<style scoped>
.collect-management-container {
  padding: 24px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.page-header h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #262626;
}

.subtitle {
  margin: 8px 0 0 0;
  font-size: 14px;
  color: #666;
}

.search-add-container {
  margin-bottom: 24px;
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

  .search-add-container .el-row {
    flex-direction: column;
    gap: 16px;
  }

  .search-add-container .el-col {
    width: 100%;
  }

  .collect-list-card .el-table {
    font-size: 12px;
  }

  .pagination-container {
    justify-content: center;
  }
}
</style>