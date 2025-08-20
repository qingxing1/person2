<template>
  <el-dialog
    v-model="visible"
    width="70%"
    top="5vh"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="blog-viewer" v-if="blog">
      <div class="blog-header">
        <h2 class="blog-title">{{ blog.title }}</h2>
        <div class="blog-meta">
        <span class="author">作者：{{ blog.author }}</span>
        <span class="category">分类：{{ blog.category }}</span>
        <span class="time">发布时间：{{ blog.createTime }}</span>
        <el-tag :type="blog.status === 'published' ? 'success' : 'info'">
          {{ blog.status === 'published' ? '已发布' : '草稿' }}
        </el-tag>
        <div class="tags">
          <el-tag
            v-for="tag in (typeof blog.tags === 'string' ? blog.tags.split(',').filter(t => t.trim()) : blog.tags)"
            :key="tag.trim()"
            type="info"
            effect="light"
            class="!px-2 !py-0.5 !text-xs !border-0 !bg-blue-50 !text-blue-600 hover:!bg-blue-100 transition-colors"
            size="small"
          >
            {{ tag.trim() }}
          </el-tag>
        </div>
      </div>
      </div>

      <div class="blog-content">
        <div class="content-body" v-html="renderedContent"></div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="handleEdit">编辑</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { marked } from 'marked'

import type { Blog } from '../types/blog'

const props = defineProps<{
  visible: boolean
  blog?: Blog
}>()

const emit = defineEmits<{
  close: []
  edit: [blog: Blog]
}>()

const visible = ref(false)

watch(() => props.visible, (newVal) => {
  visible.value = newVal
})

const renderedContent = computed(() => {
  if (!props.blog?.content) return ''
  return marked(props.blog.content)
})

const handleClose = () => {
  visible.value = false
  emit('close')
}

const handleEdit = () => {
  if (props.blog) {
    emit('edit', props.blog)
    handleClose()
  }
}
</script>

<style scoped lang="scss">
.blog-viewer {
  max-height: 70vh;
  overflow-y: auto;

  .blog-header {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--el-border-color);

    .blog-title {
      margin: 0 0 10px 0;
      font-size: 24px;
      color: var(--el-text-color-primary);
    }

    .blog-meta {
      display: flex;
      gap: 15px;
      align-items: center;
      font-size: 14px;
      color: var(--el-text-color-secondary);
      flex-wrap: wrap;

      span {
        &::before {
          content: '';
          display: inline-block;
          width: 1px;
          height: 12px;
          background-color: var(--el-border-color);
          margin-right: 15px;
        }

        &:first-child::before {
          display: none;
        }
      }

      .tags {
        display: flex;
        gap: 8px;
        align-items: center;
        flex-wrap: wrap;
      }
    }
  }

  .blog-content {
    .content-body {
      line-height: 1.8;
      color: var(--el-text-color-primary);

      :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
        margin: 20px 0 10px 0;
        font-weight: bold;
      }

      :deep(h1) { font-size: 28px; }
      :deep(h2) { font-size: 24px; }
      :deep(h3) { font-size: 20px; }
      :deep(h4) { font-size: 18px; }
      :deep(h5) { font-size: 16px; }
      :deep(h6) { font-size: 14px; }

      :deep(p) {
        margin: 10px 0;
      }

      :deep(code) {
        background-color: var(--el-fill-color-lighter);
        padding: 2px 6px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
      }

      :deep(pre) {
        background-color: var(--el-fill-color-lighter);
        padding: 15px;
        border-radius: 4px;
        overflow-x: auto;
        margin: 15px 0;

        code {
          background-color: transparent;
          padding: 0;
        }
      }

      :deep(blockquote) {
        border-left: 4px solid var(--el-color-primary);
        padding-left: 15px;
        margin: 15px 0;
        color: var(--el-text-color-secondary);
      }

      :deep(ul), :deep(ol) {
        margin: 10px 0;
        padding-left: 25px;
      }

      :deep(li) {
        margin: 5px 0;
      }

      :deep(img) {
        max-width: 100%;
        height: auto;
        margin: 10px 0;
        border-radius: 4px;
      }

      :deep(table) {
        border-collapse: collapse;
        width: 100%;
        margin: 15px 0;
      }

      :deep(th), :deep(td) {
        border: 1px solid var(--el-border-color);
        padding: 8px 12px;
        text-align: left;
      }

      :deep(th) {
        background-color: var(--el-fill-color-lighter);
        font-weight: bold;
      }
    }
  }
}

:deep(.el-dialog__body) {
  padding: 20px;
}
</style>