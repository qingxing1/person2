<template>
  <div class="todo-stats-card">
    <div class="card-header">
      <h3>待办统计</h3>
      <el-icon><DataAnalysis /></el-icon>
    </div>
    <div class="stats-content">
      <div class="stat-item">
        <div class="stat-number">{{ stats.total }}</div>
        <div class="stat-label">总任务</div>
      </div>
      <div class="stat-item">
        <div class="stat-number completed">{{ stats.completed }}</div>
        <div class="stat-label">已完成</div>
      </div>
      <div class="stat-item">
        <div class="stat-number pending">{{ stats.pending }}</div>
        <div class="stat-label">待完成</div>
      </div>
      <div class="stat-item">
        <div class="stat-number rate">{{ stats.completionRate }}%</div>
        <div class="stat-label">完成率</div>
      </div>
    </div>
    <el-progress 
      :percentage="stats.completionRate" 
      :color="getProgressColor"
      :stroke-width="8"
      class="progress-bar"
    />
  </div>
</template>

<script lang="ts" setup>
import { DataAnalysis } from '@element-plus/icons-vue'

interface Props {
  stats: {
    total: number
    completed: number
    pending: number
    completionRate: number
  }
}

const props = defineProps<Props>()

const getProgressColor = (percentage: number) => {
  if (percentage >= 80) return '#67C23A'
  if (percentage >= 50) return '#E6A23C'
  return '#F56C6C'
}
</script>

<style lang="scss" scoped>
.todo-stats-card {
  background: #fff;
  border-radius:8px 8px 0 0;
  padding: 24px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }
  }

  .stats-content {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 20px;

    .stat-item {
      text-align: center;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;

      .stat-number {
        font-size: 24px;
        font-weight: 700;
        color: #303133;
        line-height: 1;
        margin-bottom: 4px;

        &.completed {
          color: #67C23A;
        }

        &.pending {
          color: #E6A23C;
        }

        &.rate {
          color: #409EFF;
        }
      }

      .stat-label {
        font-size: 12px;
        color: #909399;
      }
    }
  }

  .progress-bar {
    margin-top: 10px;
  }
}

@media screen and (max-width: 768px) {
  .stats-content {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>