<template>
  <div class="blog-list">
    <div class="list-header">
      <h3>博客列表</h3>
      <div class="header-actions">
        <el-select v-model="categoryFilter" placeholder="选择分类" clearable style="width: 120px; margin-right: 10px">
           <div v-for="category in availableCategories">
            <el-option :label="category" :value="category" />
           </div>
        </el-select>
        <el-select v-model="statusFilter" placeholder="选择状态" clearable style="width: 120px; margin-right: 10px">
          <el-option label="已发布" value="published" />
          <el-option label="草稿" value="draft" />
        </el-select>
        <el-button type="primary" @click="handleAdd">
          <el-icon>
            <Plus />
          </el-icon>
          新增博客
        </el-button>
      </div>
    </div>

    <div class="list-content">
      <el-table :data="blogs" style="width: 100%" v-loading="loading">
        <el-table-column prop="title" label="标题" min-width="200" align="center" />
        <el-table-column prop="tags" label="标签" width="160" align="center">
          <template #default="{ row }">
            <div class="flex justify-center content-center">
              <el-tag
                v-for="tag in (typeof row.tags === 'string' ? row.tags.split(',').filter((t: string) => t.trim()) : row.tags)"
                :key="tag.trim()" type="info" effect="light"
                class="!px-2 !py-0.5 !mr-2 !text-xs !border-0 !bg-blue-100 !text-blue-600 hover:!bg-blue-200 transition-colors"
                size="small">
                {{ tag.trim() }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="100" align="center" />
        <el-table-column prop="createTime" label="创建时间" width="190" align="center" />
        <el-table-column prop="updateTime" label="更新时间" width="190" align="center" />
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'info'">
              {{ row.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right" align="center">

          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">
              查看
            </el-button>
            <el-button type="primary" link @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
          :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

import { Plus } from '@element-plus/icons-vue'
import { getBlogList, deleteBlog, getBlogCategoryList } from '@/api/boke'
import { ElMessage } from 'element-plus'
import type { Blog } from '../types/blog'
import emitter from '@/utils/mitt';


const props = defineProps<{
  loading: boolean
  searchKeyword?: string
}>()
// 记录总条数
const total = ref(0)
// 分类选项
const availableCategories = ref<string[]>([])

// 加载分类列表
const loadCategories = async () => {
  try {
    const res = await getBlogCategoryList()
    if (res?.code === 200) {
      availableCategories.value = (res.data || []).map((item: any) => item.name)
    }
  } catch (error) {
    console.error('加载分类列表失败:', error)
  }
}

const emit = defineEmits<{
  view: [blog: Blog],
  add: {},
  edit: [blog: Blog],
  pageChange: [page: number, size: number]
}>()
// 博客列表
const blogs = ref<Blog[]>([])

const currentPage = ref(1)
const pageSize = ref(10)
const categoryFilter = ref('')
const statusFilter = ref('')


const handleView = (blog: Blog) => {
  emit('view', blog)
}

const handleEdit = (blog: Blog) => {
  emit('edit', blog)
}

const handleSizeChange = (size: number) => {
  emit('pageChange', currentPage.value, size)
}

const handleCurrentChange = (page: number) => {
  emit('pageChange', page, pageSize.value)
}

// 新增博客
const handleAdd = () => {
  emit('add', {})
}
// 删除博客
const handleDelete = async (blog: Blog) => {
  try {
    // 显示确认对话框
    await ElMessageBox.confirm(
      `确定要删除博客 "${blog.title}" 吗？此操作不可撤销。`,
      '确认删除',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 删除博客
    const res: any = await deleteBlog(blog.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      // 刷新博客列表
      getBokeList()
    } else {
      ElMessage.error(res.msg)
    }
  } catch (error) {
    // 用户取消删除操作
    if (error !== 'cancel') {
      console.error('删除博客时发生错误:', error)
    }
  }
}

// 获取博客列表
const getBokeList = async () => {
  const params = {
    page: currentPage.value,
    size: pageSize.value,
    ...(categoryFilter.value && { category: categoryFilter.value }),
    ...(statusFilter.value && { status: statusFilter.value }),
    ...(props.searchKeyword && { title: props.searchKeyword })
  }
  
  const res: any = await getBlogList(params)
  // 使用新的数据结构
  if (res.code === 200) {
    blogs.value = res.data.list
    total.value = res.data.total
  }
}

// 监听筛选条件变化
watch([categoryFilter, statusFilter], () => {
  currentPage.value = 1 // 重置到第一页
  getBokeList()
})

// 防抖函数实现
let searchTimeout: ReturnType<typeof setTimeout> | null = null

// 监听搜索关键词变化 - 使用防抖函数
watch(() => props.searchKeyword, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    currentPage.value = 1 // 重置到第一页
    getBokeList()
  }, 1000)
})

// 监听分页变化
watch([currentPage, pageSize], () => {
  getBokeList()
})

onMounted(() => {
  // 加载分类数据
  loadCategories()
  // 初始化获取博客列表
  getBokeList()
  // 监听刷新事件
  emitter.on('refreshBlogList', getBokeList);
})

onUnmounted(() => {
  // 移除刷新事件监听
  emitter.off('refreshBlogList', getBokeList);
  // 清理搜索防抖定时器
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
});

</script>

<style scoped lang="scss">
.blog-list {
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      margin: 0;
      color: var(--el-text-color-primary);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }

  .list-content {
    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>