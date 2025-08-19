<template>
  <div class="problem-list">
    <div class="list-header">
      <h3>算法题目列表</h3>
      <el-button type="primary" @click="$emit('add-problem')">
        <el-icon><Plus /></el-icon>
        添加题目
      </el-button>
    </div>
    
    <el-table :data="problems" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column prop="title" label="题目名称" min-width="200" align="center" />
      <el-table-column prop="difficulty" label="难度" width="150" align="center">
        <template #default="{ row }">
          <el-tag :type="getDifficultyType(row.difficulty)">
            {{ row.difficulty }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="分类" width="200" align="center" />

      <el-table-column prop="createdAt" label="创建时间" width="180" align="center">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right" align="center">

        <template #default="{ row }">
          <el-button type="primary" size="small" @click="$emit('view-details', row)">
            详情
          </el-button>
          <el-button type="warning" size="small" @click="$emit('edit-problem', row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="$emit('delete-problem', row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      @update:current-page="handlePageChange"
      @update:page-size="handleSizeChange"
      class="pagination"
    />
  </div>
</template>

<script lang="ts" setup>
import { Plus } from '@element-plus/icons-vue'

interface Problem {
  id: number
  title: string
  difficulty: '简单' | '中等' | '困难'
  category: string
  createdAt: string
  description?: string
  solution?: string
  answer?: string
}

interface Props {
  problems: Problem[]
  loading?: boolean
  currentPage: number
  pageSize: number
  total: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const emit = defineEmits<{
  'add-problem': []
  'view-details': [problem: Problem]
  'edit-problem': [problem: Problem]
  'delete-problem': [id: number]
  'page-change': [page: number]
  'update:page-size': [size: number]
}>()

const getDifficultyType = (difficulty: string) => {
  const map = {
    '简单': 'success',
    '中等': 'warning',
    '困难': 'danger'
  }
  return map[difficulty as keyof typeof map] || 'info'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const handlePageChange = (page: number) => {
  emit('page-change', page)
}

const handleSizeChange = (size: number) => {
  emit('update:page-size', size)
}
</script>

<style lang="scss" scoped>
.problem-list {
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
      margin: 0;
      color: #303133;
    }
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: right;
    padding: 20px 0;
  }

  :deep(.el-pagination.is-background .el-pager li) {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    margin: 0 4px;
    transition: all 0.3s ease;
  }

  :deep(.el-pagination.is-background .el-pager li:hover) {
    background: #f8f9ff;
    border-color: #667eea;
    transform: translateY(-1px);
  }

  :deep(.el-pagination.is-background .el-pager li.active) {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-color: #667eea;
    color: white;
    transform: translateY(-1px);
  }

  :deep(.el-pagination__sizes .el-select .el-input__wrapper) {
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  :deep(.el-pagination__jump .el-input__wrapper) {
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }
}
</style>