<template>
  <div class="message-management-container">
    <!-- 页面标题 -->
    <div class="page-header-modern">
      <div class="header-content">
        <div class="header-left">
          <div class="icon-wrapper">
            <el-icon>
              <Message />
            </el-icon>
          </div>
          <div class="header-info">
            <h1>消息管理</h1>
            <p class="page-description">管理前台用户提交的联系信息</p>
          </div>
        </div>
        <div class="header-stats flex gap-8">
          <div class="stat-item text-center bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-4 rounded-xl border border-blue-100 min-w-[120px]">
            <div class="stat-number text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">{{ totalCount }}</div>
            <div class="stat-label text-sm font-medium text-gray-600">总消息</div>
          </div>
          <div class="stat-item text-center bg-gradient-to-br from-green-50 to-emerald-50 px-6 py-4 rounded-xl border border-green-100 min-w-[120px]">
            <div class="stat-number text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">{{ unreadCount | 0 }}</div>
            <div class="stat-label text-sm font-medium text-gray-600">未读</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="search-section">
      <div class="search-container">
        <div class="search-row">
          <div class="search-input-group">
            <el-icon class="search-icon">
              <Search />
            </el-icon>
            <el-input v-model="searchKeyword" placeholder="搜索姓名、邮箱或主题" clearable class="modern-input" />
          </div>
          <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" class="modern-date-picker" />
        </div>
      </div>
    </div>

    <!-- 消息列表 -->
    <el-card class="message-list-card">
      <el-table v-loading="loading" :data="paginatedMessages" style="width: 100%" border highlight-current-row>
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="name" label="姓名" width="120" align="center" />
        <el-table-column prop="email" label="邮箱" width="220" align="center" />
        <el-table-column prop="subject" label="主题" width="180" align="center" />
        <el-table-column prop="address" label="地址" min-width="220" align="center" />
        <el-table-column prop="submitTime" label="提交时间" width="100" align="center" />
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'read' ? 'success' : 'primary'" size="small">
              {{ scope.row.status === 'read' ? '已读' : '未读' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="center">

          <template #default="scope">
            <el-button type="primary" size="small" @click="viewMessage(scope.row)" :icon="View">
              查看
            </el-button>
            <el-button type="danger" size="small" @click="deleteMessage(scope.row.id)" :icon="Delete">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </el-card>

    <!-- 消息详情弹窗 -->
    <el-dialog v-model="showDetailDialog" title="消息详情" :width="'50%'" :before-close="handleCloseDetailDialog">
      <div v-if="selectedMessage" class="message-detail">
        <div class="detail-item">
          <span class="label">ID:</span>
          <span class="value">{{ selectedMessage.id }}</span>
        </div>
        <div class="detail-item">
          <span class="label">姓名:</span>
          <span class="value">{{ selectedMessage.name }}</span>
        </div>
        <div class="detail-item">
          <span class="label">邮箱:</span>
          <span class="value">{{ selectedMessage.email }}</span>
        </div>
        <div class="detail-item">
          <span class="label">主题:</span>
          <span class="value">{{ selectedMessage.subject }}</span>
        </div>
        <div class="detail-item">
          <span class="label">地址:</span>
          <span class="value">{{ selectedMessage.address }}</span>
        </div>
        <div class="detail-item">
          <span class="label">提交时间:</span>
          <span class="value">{{ selectedMessage.submitTime }}</span>
        </div>
        <div class="detail-item">
          <span class="label">状态:</span>
          <span class="value">
            <el-tag :type="selectedMessage.status === 'read' ? 'success' : 'primary'" size="small">
              {{ selectedMessage.status === 'read' ? '已读' : '未读' }}
            </el-tag>
          </span>
        </div>
        <div class="detail-item detail-content">
          <span class="label">消息内容:</span>
          <div class="value">{{ selectedMessage.content }}</div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCloseDetailDialog">关闭</el-button>
          <el-button type="primary" @click="markAsRead">标为已读</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Message, Search, View, Delete, Check } from '@element-plus/icons-vue'
import { getInformationList, markInformationAsRead, deleteInformation, getUnreadCount } from '@/api/information'

// 简易防抖函数
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => func(...args), wait)
  }
}

// 定义消息类型
interface MessageItem {
  id: number
  name: string
  email: string
  subject: string
  content: string
  address: string
  submitTime: string
  status: 'read' | 'unread'
}

// 消息列表响应
interface MessageListResponse {
  list: MessageItem[]
  total: number
  page: number
  size: number
  totalPages: number
}

// 数据状态
const messages = ref<MessageItem[]>([])
const loading = ref(false)
const searchKeyword = ref('')
const dateRange = ref<string[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const showDetailDialog = ref(false)
const selectedMessage = ref<MessageItem | null>(null)
const totalCount = ref(0)
const unreadCount = ref(0)

// 分页处理
const paginatedMessages = computed(() => {
  return messages.value
})

// 监听搜索和日期范围变化
const debouncedFetch = debounce(() => {
  fetchMessages()
}, 1000)

watch([searchKeyword, dateRange], () => {
  currentPage.value = 1
  debouncedFetch()
}, { deep: true })

// 页面加载时获取数据
onMounted(() => {
  fetchMessages()
  fetchUnreadCount()
})

// 获取消息数据
async function fetchMessages() {
  loading.value = true
  try {
    const params: any = {
      page: currentPage.value,
      size: pageSize.value
    }

    // 添加搜索参数
    if (searchKeyword.value) {
      params.search = searchKeyword.value
    }

    // 添加日期范围参数
    if (dateRange.value && dateRange.value.length === 2 && dateRange.value[0] && dateRange.value[1]) {
      params.startDate = dateRange.value[0]
      params.endDate = dateRange.value[1]
    }

    const response: any = await getInformationList(params)
    if (response.code === 200 && response.data) {
      const data = response.data
      messages.value = (data.list || []).map((item: MessageItem) => ({

        ...item,
        submitTime: new Date(item.submitTime).toLocaleDateString()
      }))
      totalCount.value = data.total || 0
    } else {
      messages.value = []
      totalCount.value = 0
      ElMessage.error(response.msg || '获取消息列表失败')
    }
  } catch (error) {
    console.error('获取消息列表失败:', error)
    ElMessage.error('获取消息列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 获取未读消息数量
async function fetchUnreadCount() {
  try {
    const response: any = await getUnreadCount()
    if (response.code === 200) {
      unreadCount.value = response.data
    } else {
      ElMessage.error(response.msg || '获取未读数量失败')
    }
  } catch (error) {
    console.error('获取未读数量失败:', error)
  }
}

// 查看消息详情
async function viewMessage(message: MessageItem) {
  selectedMessage.value = { ...message }
  showDetailDialog.value = true

  // 如果是未读消息，标记为已读
  if (message.status === 'unread') {
    await markAsRead()
  }
}

// 关闭详情弹窗
function handleCloseDetailDialog() {
  showDetailDialog.value = false
  selectedMessage.value = null
}

// 标记为已读
async function markAsRead() {
  if (selectedMessage.value) {
    try {
      const response: any = await markInformationAsRead(selectedMessage.value.id.toString())

      if (response.code === 200) {
        // 更新本地数据状态
        const index = messages.value.findIndex(item => item.id === selectedMessage.value?.id)
        if (index !== -1) {
          messages.value[index].status = 'read'
          selectedMessage.value.status = 'read'
        }
        // 更新未读数量
        await fetchUnreadCount()
        ElMessage.success('已标记为已读')
      } else {
        ElMessage.error(response.msg || '标记已读失败')
      }
    } catch (error) {
      console.error('标记已读失败:', error)
      ElMessage.error('标记已读失败，请稍后重试')
    }
  }
}

// 删除消息
function deleteMessage(id: number) {
  ElMessageBox.confirm('确定要删除这条消息吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const response: any = await deleteInformation(id.toString())

      if (response.code === 200) {
        await fetchMessages()
        await fetchUnreadCount()
        ElMessage.success('删除成功')
      } else {
        ElMessage.error(response.msg || '删除失败')
      }
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请稍后重试')
    }
  }).catch(() => {
    // 取消删除
  })
}

// 分页大小变化
function handleSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
  fetchMessages()
}

// 当前页码变化
function handleCurrentChange(current: number) {
  currentPage.value = current
  fetchMessages()
}
</script>

<style scoped>
.message-management-container {
  background-color: #f8fafc;
}

/* 现代简洁标题区域 */
.page-header-modern {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px 32px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.icon-wrapper .el-icon {
  font-size: 24px;
  color: white;
}

.header-info h1 {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.3;
}

.page-description {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}

.header-stats {
  /* 使用Tailwind样式，移除原有样式 */
}

/* 搜索区域 */
.search-section {
  margin-bottom: 10px;
}

.search-container {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.search-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.search-input-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 500px;
}

.search-icon {
  font-size: 18px;
  color: #64748b;
}

.modern-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  box-shadow: none;
  transition: all 0.2s ease;
}

.modern-input :deep(.el-input__wrapper):hover {
  border-color: #3b82f6;
  background: white;
}

.modern-input :deep(.el-input__wrapper).is-focus {
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modern-date-picker {
  min-width: 280px;
}

.modern-date-picker :deep(.el-input__wrapper) {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  box-shadow: none;
  transition: all 0.2s ease;
}

.modern-date-picker :deep(.el-input__wrapper):hover {
  border-color: #3b82f6;
  background: white;
}

.message-list-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.message-detail {
  padding: 10px 0;
}

.detail-item {
  display: flex;
  margin-bottom: 16px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.label {
  width: 100px;
  font-weight: 500;
  color: #666;
}

.value {
  flex: 1;
  color: #333;
}

.detail-content .value {
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.6;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
