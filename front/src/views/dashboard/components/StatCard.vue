<template>
  <div class="stat-card">
    <div class="stat-icon">
      <el-icon>
        <component :is="icon" />
      </el-icon>
    </div>
    <div class="stat-content">
      <div class="stat-number">{{ number }}</div>
      <div class="stat-label">{{ label }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  icon: string
  number: string | number
  label: string
}

withDefaults(defineProps<Props>(), {})
</script>

<style lang="scss" scoped>
.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.12);
  }

  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    background: linear-gradient(135deg, #409EFF, #79bbff);
    color: #fff;
    font-size: 24px;
  }

  .stat-content {
    flex: 1;

    .stat-number {
      font-size: 28px;
      font-weight: bold;
      color: #303133;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 14px;
      color: #909399;
      margin-bottom: 4px;
    }
  }
}
</style>