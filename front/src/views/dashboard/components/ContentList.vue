<template>
  <div class="content-card">
    <div class="card-header">
      <h3>{{ title }}</h3>
      <el-button type="primary" link @click="$emit('more-click')">查看更多</el-button>
    </div>
    <div class="content-list">
      <div v-for="item in items" :key="item.id" class="content-item">
        <div class="item-icon">
          <el-icon>
            <component :is="icon" />
          </el-icon>
        </div>
        <div class="item-content">
          <div class="item-title">{{ item.title }}</div>
          <div class="item-meta">
            <span v-for="meta in getMetaItems(item)" :key="meta.key">
              {{ meta.value }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'

interface ContentItem {
  id: number
  title: string
  [key: string]: any
}

interface Props {
  title: string
  items: ContentItem[]
  icon: Component
  metaFields: string[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'more-click': []
}>()

const getMetaItems = (item: ContentItem) => {
  return props.metaFields.map(field => ({
    key: field,
    value: item[field]
  }))
}
</script>

<style lang="scss" scoped>
.content-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

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

  .content-list {
    .content-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .item-icon {
        width: 36px;
        height: 36px;
        border-radius: 6px;
        background: #f5f7fa;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        color: #409EFF;
      }

      .item-content {
        flex: 1;

        .item-title {
          font-size: 14px;
          color: #303133;
          margin-bottom: 4px;
        }

        .item-meta {
          font-size: 12px;
          color: #909399;
          display: flex;
          gap: 12px;
        }
      }
    }
  }
}
</style>