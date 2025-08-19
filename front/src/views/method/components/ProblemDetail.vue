<template>
  <div class="problem-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ problem.title }}</span>
          <div class="header-actions">
            <el-tag :type="getDifficultyType(problem.difficulty)">
              {{ problem.difficulty }}
            </el-tag>
            <el-tag class="ml-2">{{ problem.category }}</el-tag>
          </div>
        </div>
      </template>
      
      <el-tabs v-model="activeTab">
        <el-tab-pane label="题目描述" name="description">
          <div class="content-section">
            <h4>题目描述</h4>
            <div class="content-text" v-html="problem.description || '暂无描述'" />
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="解题思路" name="solution">
          <div class="content-section">
            <div class="section-header">
              <h4>解题思路</h4>
              <el-button type="primary" size="small" @click="$emit('edit-solution')">
                <el-icon><Edit /></el-icon>
                编辑思路
              </el-button>
            </div>
            <div class="content-text" v-html="problem.solution || '暂无解题思路'" />
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="答案" name="answer">
          <div class="content-section">
            <div class="section-header">
              <h4>答案</h4>
              <el-button type="primary" size="small" @click="$emit('edit-answer')">
                <el-icon><Edit /></el-icon>
                编辑答案
              </el-button>
            </div>
            <div class="content-text" v-html="problem.answer || '暂无答案'" />
          </div>
        </el-tab-pane>
      </el-tabs>
      
      <div class="card-actions">
        <el-button @click="$emit('close')">关闭</el-button>
        <el-button type="primary" @click="$emit('edit-problem', problem)">
          编辑题目
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Edit } from '@element-plus/icons-vue'

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

interface Props {
  problem: Problem
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'close': []
  'edit-problem': [problem: Problem]
  'edit-solution': []
  'edit-answer': []
}>()

const activeTab = ref('description')

const getDifficultyType = (difficulty: string) => {
  const map = {
    '简单': 'success',
    '中等': 'warning',
    '困难': 'danger'
  }
  return map[difficulty as keyof typeof map] || 'info'
}
</script>

<style lang="scss" scoped>
.problem-detail {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    span {
      font-size: 18px;
      font-weight: bold;
    }
    
    .header-actions {
      display: flex;
      gap: 8px;
    }
  }
  
  .content-section {
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      
      h4 {
        margin: 0;
        color: #303133;
      }
    }
    
    .content-text {
      line-height: 1.8;
      color: #606266;
      white-space: pre-wrap;
    }
  }
  
  .card-actions {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}
</style>