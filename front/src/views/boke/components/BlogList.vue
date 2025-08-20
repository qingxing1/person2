<template>
  <div class="blog-list">
    <div class="list-header">
      <h3>博客列表</h3>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增博客
      </el-button>
    </div>

    <div class="list-content">
      <el-table :data="blogs" style="width: 100%" v-loading="loading">
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="author" label="作者" width="120" />
        <el-table-column prop="tags" label="标签" width="200">
          <template #default="{ row }">
            <div class="flex flex-wrap gap-1">
              <el-tag
                v-for="tag in (typeof row.tags === 'string' ? row.tags.split(',').filter(t => t.trim()) : row.tags)"
                :key="tag.trim()"
                type="info"
                effect="light"
                class="!px-2 !py-0.5 !text-xs !border-0 !bg-blue-50 !text-blue-600 hover:!bg-blue-100 transition-colors"
                size="small"
              >
                {{ tag.trim() }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'info'">
              {{ row.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
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
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { getBlogList,getBlogDetail } from '@/api/boke'


import type { Blog } from '../types/blog'

const props = defineProps<{
  // blogs: Blog[]
  loading: boolean
  total: number
}>()

const emit = defineEmits<{
  add: []
  view: [blog: Blog]
  edit: [blog: Blog]
  delete: [blog: Blog]
  pageChange: [page: number, size: number]
}>()
// 博客列表
const blogs = ref<Blog[]>([])

const currentPage = ref(1)
const pageSize = ref(10)

const handleAdd = () => {
  emit('add')
}

const handleView = (blog: Blog) => {
  emit('view', blog)
}

const handleEdit = (blog: Blog) => {
  emit('edit', blog)
}

const handleDelete = (blog: Blog) => {
  emit('delete', blog)
}

const handleSizeChange = (size: number) => {
  emit('pageChange', currentPage.value, size)
}

const handleCurrentChange = (page: number) => {
  emit('pageChange', page, pageSize.value)
}
onMounted(async() => {
  const res:any = await getBlogList()
  blogs.value = res.data
})
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