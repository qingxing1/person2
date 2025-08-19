<template>
  <div class="todo-card">
    <div class="card-header">
      <h3>待办事项</h3>
      <el-button type="primary" size="small" @click="$emit('add-todo')">
        <el-icon>
          <Plus />
        </el-icon>
        添加
      </el-button>
    </div>
    <div class="todo-list">
      <div v-if="todos.length" v-for="todo in todos" :key="todo.id" class="todo-item">
        <el-checkbox :model-value="todo.completed" @change="(val) => $emit('update-todo', todo, val)">
          <span :class="{ completed: todo.completed }">{{ todo.title }}</span>
        </el-checkbox>
        <div class="todo-actions">
          <el-tag size="small" :type="getPriorityType(todo.priority)">
            {{ todo.priority }}
          </el-tag>
          <el-icon class="delete-btn" @click="$emit('delete-todo', todo.id)">
            <Delete />
          </el-icon>
        </div>
      </div>
      <div v-else class="text-center">
         暂无待办事项，去添加一个吧
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Delete, Plus } from '@element-plus/icons-vue'

interface TodoItem {
  id: number
  title: string
  completed: boolean
  priority: string
}

interface Props {
  todos: TodoItem[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'add-todo': []
  'update-todo': [todo: TodoItem, completed: boolean]
  'delete-todo': [id: number]
}>()

const getPriorityType = (priority: string) => {
  const map: Record<string, string> = {
    '高': 'danger',
    '中': 'warning',
    '低': 'info'
  }
  return map[priority] || 'info'
}
</script>

<style lang="scss" scoped>
.todo-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  padding-right: 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  max-height: 440px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-right: 14px;

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }
  }

  .todo-list {
    padding-right: 14px;
    max-height: 360px;
    overflow-y: auto;

    .todo-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .completed {
        text-decoration: line-through;
        color: #909399;
      }

      .todo-actions {
        display: flex;
        align-items: center;
        gap: 8px;

        .delete-btn {
          cursor: pointer;
          color: #909399;
          transition: color 0.3s;

          &:hover {
            color: #f56c6c;
          }
        }
      }
    }
  }
}
</style>