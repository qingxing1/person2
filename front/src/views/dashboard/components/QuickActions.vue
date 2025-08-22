<template>
  <div class="quick-actions">
    <div class="card-header">
      <h3>快捷操作</h3>
    </div>
    <div class="action-grid">
      <div 
        v-for="action in actions" 
        :key="action.key"
        class="action-item" 
        @click="$emit('action-click', action.key)"
      >
        <el-icon>
          <component :is="action.icon" />
        </el-icon>
        <span>{{ action.label }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface QuickAction {
  key: string
  label: string
  icon: string
}

interface Props {
  actions: QuickAction[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'action-click': [key: string]
}>()
</script>

<style lang="scss" scoped>
.quick-actions {
  margin-top: 15px;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .card-header {
    margin-bottom: 12px;

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }
  }

  .action-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;

    .action-item {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      border: 1px solid #e4e7ed;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        border-color: #409EFF;
        color: #409EFF;
        background-color: #f5f7fa;
      }

      .el-icon {
        font-size: 24px;
        margin-right: 5px;
      }

      span {
        font-size: 14px;
      }
    }
  }
}
</style>