<template>
  <div class="blog-editor">
    
    <div class="editor-content">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入博客标题" />
        </el-form-item>

        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类" style="width: 200px">
            <el-option label="技术" value="tech" />
            <el-option label="生活" value="life" />
            <el-option label="工作" value="work" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>

        <el-form-item label="标签" prop="tags">
          <el-select
            v-model="form.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入标签"
            style="width: 100%"
          >
            <el-option
              v-for="tag in ['Vue3', 'TypeScript', '前端', '后端', '总结', '教程']"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio value="published">发布</el-radio>
            <el-radio value="draft">草稿</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <div class="editor-container">
            <el-tabs v-model="activeTab" type="border-card">
              <el-tab-pane label="编辑" name="edit">
                <el-input
                  v-model="form.content"
                  type="textarea"
                  :rows="20"
                  placeholder="请输入博客内容，支持Markdown格式"
                  resize="vertical"
                />
              </el-tab-pane>
              <el-tab-pane label="预览" name="preview">
                <div class="preview-content" v-html="renderedContent"></div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            {{ isEdit ? '更新' : '发布' }}
          </el-button>
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { marked } from 'marked'

import type { Blog, BlogFormData } from '../types/blog'

type EditorBlog = BlogFormData & { id?: number }

const props = defineProps<{
  visible: boolean
  blog?: Blog
  isEdit?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: EditorBlog]
}>()

const formRef = ref()
const activeTab = ref('edit')
const submitting = ref(false)

const form = ref<EditorBlog>({
  title: '',
  tags: [],
  category: '',
  status: 'draft',
  content: ''
})

import type { FormRules } from 'element-plus'

const rules: FormRules = {
  title: [
    { required: true, message: '请输入博客标题', trigger: 'blur' },
    { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  tags: [
    { type: 'array', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入博客内容', trigger: 'blur' }
  ]
}

const renderedContent = computed(() => {
  return marked(form.value.content || '')
})

watch(() => props.blog, (newBlog) => {
  if (newBlog && props.isEdit) {
    form.value = { 
      id: newBlog.id,
      title: newBlog.title || '',
      tags: newBlog.tags || [],
      category: newBlog.category || '',
      status: newBlog.status || 'draft',
      content: newBlog.content || ''
    }
  } else {
    form.value = {
      title: '',
      tags: [],
      category: '',
      status: 'draft',
      content: ''
    }
  }
}, { immediate: true })

const handleClose = () => {
  formRef.value?.resetFields()
  emit('close')
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitting.value = true
    emit('submit', form.value)
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    submitting.value = false
  }
}

const setSubmitting = (value: boolean) => {
  submitting.value = value
}

defineExpose({
  setSubmitting
})
</script>

<style scoped lang="scss">
.blog-editor {
  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--el-border-color);

    h3 {
      margin: 0;
      color: var(--el-text-color-primary);
    }
  }

  .editor-content {
    .editor-container {
      width: 100%;
      .preview-content {
        padding: 10px;
        background-color: var(--el-fill-color-lighter);
        border-radius: 4px;
        min-height: 400px;
        line-height: 1.6;

        :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
          margin: 16px 0 8px 0;
        }

        :deep(p) {
          margin: 8px 0;
        }

        :deep(code) {
          background-color: var(--el-fill-color-darker);
          padding: 2px 4px;
          border-radius: 2px;
        }

        :deep(pre) {
          background-color: var(--el-fill-color-darker);
          padding: 12px;
          border-radius: 4px;
          overflow-x: auto;
        }
      }
    }
  }
}
</style>