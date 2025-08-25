<template>
  <el-dialog v-model="visible" width="70%" top="5vh" :close-on-click-modal="false" @close="handleClose">
    <div class="blog-viewer" v-if="blog">
      <div class="blog-header">
        <h2 class="blog-title">{{ blog.title }}</h2>
        <div class="blog-meta">
          <span class="author !mr-8">作者：{{ blog.author }}</span>
          <span class="!mr-8">
            分类：{{ blog.category }}
          </span>
          <span class="time !mr-8">发布时间：{{ blog.createTime }}</span>
          <span v-if="blog.updateTime" class="!mr-8">更新时间：{{ blog.updateTime }}</span>
          <span>
            状态： <el-tag :type="blog.status === 'published' ? 'success' : 'info'">
              {{ blog.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </span>
          <div class="tags !mt-3">
            <span class="!mr-8">
              阅读量：{{ blog.viewCount }}
            </span>
            标签：
            <el-tag
              v-for="tag in (typeof blog.tags === 'string' ? blog.tags.split(',').filter((t: string) => t.trim()) : blog.tags)"
              :key="tag.trim()" type="info" effect="light"
              class="!px-2 !py-0.5 !text-xs !border-0 !bg-blue-50 !text-blue-600 hover:!bg-blue-100 transition-colors"
              size="small">
              {{ tag.trim() }}
            </el-tag>
          </div>
        </div>
      </div>

      <div class="blog-content">
        <MdPreview 
          :modelValue="blog.content" 
          :theme="isDark ? 'dark' : 'light'"
          previewTheme="github"
          class="markdown-preview"
        />
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
import { ref, watch, computed } from 'vue'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import type { Blog } from '../types/blog'
import emitter from '@/utils/mitt'

const props = defineProps<{
  visible: boolean
  blog?: Blog
}>()

const emit = defineEmits<{
  close: []
  edit: [blog: Blog]
}>()

const visible = ref(false)

// 获取主题状态
const isDark = computed(() => {
  return document.documentElement.classList.contains('dark')
})

watch(() => props.visible, (newVal) => {
  visible.value = newVal
})

const handleClose = () => {
  visible.value = false
  emit('close')
}

const handleEdit = () => {
  emit('edit', props.blog as Blog)
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
      font-size: 14px;
      color: var(--el-text-color-secondary);

      span {
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
    .markdown-preview {
      :deep(.md-editor-preview-wrapper) {
        padding: 0;
      }
    }
  }
}

:deep(.el-dialog__body) {
  padding: 20px;
}
</style>