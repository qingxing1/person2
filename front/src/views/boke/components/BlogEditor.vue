<template>
  <div class="blog-editor">
    <div class="editor-content">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入博客标题" />
        </el-form-item>
        <div class="flex justify-between w-full">
          <el-form-item label="分类" prop="category">
            <el-select v-model="form.category" placeholder="请选择分类" style="width:450px">
              <el-option label="技术" value="tech" />
              <el-option label="生活" value="life" />
              <el-option label="工作" value="work" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>

          <el-form-item label="标签" prop="tags">
            <el-input
              v-model="form.tags"
              placeholder="请输入标签，用逗号分隔"
              style="width: 450px"
              @input="handleTagsInput"
            />
          </el-form-item>
        </div>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio value="draft">草稿</el-radio>
            <el-radio value="published">已发布</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="封面图片" prop="cover">
          <el-upload
            class="cover-upload"
            action="/api/upload/image"
            :show-file-list="false"
            :on-success="handleCoverSuccess"
            :before-upload="beforeCoverUpload"
            :headers="uploadHeaders"
            accept="image/*"
          >
            <img v-if="form.cover" :src="form.cover" class="cover-image" alt="封面" />
            <div v-else class="cover-placeholder">
              <el-icon><Picture /></el-icon>
              <span>点击上传封面</span>
            </div>
          </el-upload>
          <div class="cover-tip">建议尺寸：800x400px，大小不超过2MB</div>

        </el-form-item>

        <el-form-item label="内容" prop="content">
          <div class="editor-container">
            <div class="editor-toolbar">
              <el-button-group>
                <el-button size="small" @click="insertBold" title="粗体">
                  <el-icon><Bold /></el-icon>
                </el-button>
                <el-button size="small" @click="insertItalic" title="斜体">
                  <el-icon><Italic /></el-icon>
                </el-button>
                <el-button size="small" @click="insertLink" title="链接">
                  <el-icon><Link /></el-icon>
                </el-button>
                <el-button size="small" @click="insertCode" title="代码块">
                  <el-icon><Code /></el-icon>
                </el-button>
                <el-button size="small" @click="insertTable" title="表格">
                  <el-icon><Grid /></el-icon>
                </el-button>
                <el-upload
                  ref="uploadRef"
                  class="image-upload"
                  action="/api/upload/image"
                  :show-file-list="false"
                  :on-success="handleImageSuccess"
                  :before-upload="beforeImageUpload"
                  :headers="uploadHeaders"
                  accept="image/*"
                >
                  <el-button size="small" type="primary" title="上传图片">
                    <el-icon><Picture /></el-icon>
                  </el-button>
                </el-upload>
              </el-button-group>
            </div>
            
            <div class="markdown-editor">
              <textarea
                ref="editorRef"
                v-model="form.content"
                placeholder="请输入博客内容，支持Markdown格式
支持拖拽或粘贴上传图片..."
                @dragover.prevent
                @drop="handleDrop"
                @paste="handlePaste"
              ></textarea>
              <div class="editor-info">
                <span class="char-count">{{ form.content.length }} 字符</span>
                <span class="upload-hint">拖拽或粘贴图片可直接上传</span>
              </div>
            </div>

            <div class="preview-panel">
              <div class="preview-content" v-html="renderedContent"></div>
            </div>
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
import type { UploadProps } from 'element-plus'
import {
  Edit as Bold,
  EditPen as Italic,
  Link as Link,
  Document as Code,
  Grid as Grid,
  Picture as Picture
} from '@element-plus/icons-vue'

import type { Blog, BlogFormData } from '../types/blog'

type EditorBlog = Omit<BlogFormData, 'tags'> & { 
  id?: number
  tags: string | string[] 
}

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
const submitting = ref(false)
const editorRef = ref<HTMLTextAreaElement>()
const uploadRef = ref()

const form = ref<EditorBlog>({
  title: '',
  tags: '',
  category: '',
  status: 'draft',
  content: '',
  cover: ''
})

// 上传配置
const uploadHeaders = ref({
  'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
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
    { required: false, trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入博客内容', trigger: 'blur' }
  ]
}

const renderedContent = computed(() => {
  return marked(form.value.content || '')
})

// 处理标签输入
const handleTagsInput = (value: string) => {
  form.value.tags = value
}

// 转换标签字符串为数组
const getTagsArray = () => {
  return form.value.tags
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
}

// 插入Markdown语法
const insertAtCursor = (text: string) => {
  const textarea = editorRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = form.value.content.substring(start, end)
  
  let newText = ''
  let newCursorPos = start

  switch (text) {
    case 'bold':
      newText = `**${selectedText || '粗体文本'}**`
      newCursorPos = start + 2
      break
    case 'italic':
      newText = `*${selectedText || '斜体文本'}*`
      newCursorPos = start + 1
      break
    case 'link':
      newText = `[${selectedText || '链接文本'}](url)`
      newCursorPos = start + (selectedText ? selectedText.length + 3 : 1)
      break
    case 'code':
      newText = `\`\`\`\n${selectedText || '代码块'}\n\`\`\``
      newCursorPos = start + 4
      break
    case 'table':
      newText = '\n| 标题1 | 标题2 | 标题3 |\n| --- | --- | --- |\n| 内容1 | 内容2 | 内容3 |\n'
      newCursorPos = start + 2
      break
    default:
      newText = text
  }

  const newContent = form.value.content.substring(0, start) + newText + form.value.content.substring(end)
  form.value.content = newContent

  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(newCursorPos, newCursorPos + (selectedText ? selectedText.length : 0))
  })
}

const insertBold = () => insertAtCursor('bold')
const insertItalic = () => insertAtCursor('italic')
const insertLink = () => insertAtCursor('link')
const insertCode = () => insertAtCursor('code')
const insertTable = () => insertAtCursor('table')

// 图片上传处理
const beforeImageUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB！')
    return false
  }
  return true
}

const handleImageSuccess: UploadProps['onSuccess'] = (response) => {
  if (response.code === 200 && response.data?.url) {
    const imageUrl = response.data.url
    const imageMarkdown = `![图片描述](${imageUrl})`
    insertAtCursor(imageMarkdown)
    ElMessage.success('图片上传成功！')
  } else {
    ElMessage.error(response.message || '图片上传失败！')
  }
}

// 封面上传处理
const beforeCoverUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('封面只能是图片文件！')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('封面图片大小不能超过 2MB！')
    return false
  }
  return true
}

const handleCoverSuccess: UploadProps['onSuccess'] = (response) => {
  if (response.code === 200 && response.data?.url) {
    form.value.cover = response.data.url
    ElMessage.success('封面上传成功！')
  } else {
    ElMessage.error(response.message || '封面上传失败！')
  }
}

// 拖拽上传
const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.type.startsWith('image/')) {
      uploadImage(file)
    }
  }
}

// 粘贴上传
const handlePaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items
  if (items) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile()
        if (file) {
          uploadImage(file)
        }
      }
    }
  }
}

// 手动上传图片
const uploadImage = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  // 这里可以替换为你的实际上传接口
  fetch('/api/upload/image', {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
    }
  })
    .then(res => res.json())
    .then(response => {
      if (response.code === 200 && response.data?.url) {
        const imageUrl = response.data.url
        const imageMarkdown = `![图片描述](${imageUrl})`
        insertAtCursor(imageMarkdown)
        ElMessage.success('图片上传成功！')
      } else {
        ElMessage.error(response.message || '图片上传失败！')
      }
    })
    .catch(() => {
      ElMessage.error('图片上传失败！')
    })
}

watch(() => props.blog, (newBlog) => {
  if (newBlog && props.isEdit) {
    form.value = {
      id: newBlog.id,
      title: newBlog.title || '',
      tags: Array.isArray(newBlog.tags) ? newBlog.tags.join(', ') : (newBlog.tags || ''),
      category: newBlog.category || '',
      status: newBlog.status || 'draft',
      content: newBlog.content || '',
      cover: newBlog.cover || ''
    }
  } else {
    form.value = {
      title: '',
      tags: '',
      category: '',
      status: 'draft',
      content: '',
      cover: ''
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
    
    // 创建提交数据，将标签字符串转换为数组
    const submitData = {
      ...form.value,
      tags: getTagsArray()
    }
    
    emit('submit', submitData)
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
  .editor-content {
    .editor-container {
      width: 100%;
      border: 1px solid var(--el-border-color);
      border-radius: 4px;
      overflow: hidden;

      .editor-toolbar {
        padding: 8px 12px;
        background-color: var(--el-fill-color-lighter);
        border-bottom: 1px solid var(--el-border-color);
        display: flex;
        align-items: center;
        gap: 8px;

        .image-upload {
          display: inline-block;
          margin-left: 8px;
        }
      }

      .markdown-editor {
        position: relative;

        textarea {
          width: 100%;
          min-height: 400px;
          padding: 16px;
          border: none;
          outline: none;
          resize: vertical;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 14px;
          line-height: 1.6;
          background-color: #fafafa;
          color: #333;

          &::placeholder {
            color: #999;
          }

          &:focus {
            background-color: #fff;
          }
        }

        .editor-info {
          position: absolute;
          bottom: 8px;
          right: 12px;
          display: flex;
          gap: 16px;
          font-size: 12px;
          color: #999;
          pointer-events: none;

          .char-count {
            font-weight: 500;
          }

          .upload-hint {
            opacity: 0.8;
          }
        }
      }

      .preview-panel {
        border-top: 1px solid var(--el-border-color);
        background-color: #fff;

        .preview-content {
          padding: 20px;
          min-height: 400px;
          line-height: 1.8;

          :deep(h1),
          :deep(h2),
          :deep(h3),
          :deep(h4),
          :deep(h5),
          :deep(h6) {
            margin: 24px 0 16px 0;
            font-weight: 600;
            line-height: 1.25;
          }

          :deep(h1) { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
          :deep(h2) { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
          :deep(h3) { font-size: 1.25em; }
          :deep(h4) { font-size: 1em; }
          :deep(h5) { font-size: 0.875em; }
          :deep(h6) { font-size: 0.85em; color: #6a737d; }

          :deep(p) {
            margin: 0 0 16px 0;
            font-size: 16px;
            line-height: 1.8;
          }

          :deep(code) {
            background-color: rgba(27, 31, 35, 0.05);
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-size: 85%;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          }

          :deep(pre) {
            background-color: #f6f8fa;
            padding: 16px;
            border-radius: 6px;
            overflow-x: auto;
            font-size: 14px;
            line-height: 1.45;
            
            code {
              background-color: transparent;
              padding: 0;
              font-size: 100%;
            }
          }

          :deep(blockquote) {
            padding: 0 1em;
            color: #6a737d;
            border-left: 0.25em solid #dfe2e5;
            margin: 0 0 16px 0;
          }

          :deep(ul),
          :deep(ol) {
            margin: 0 0 16px 0;
            padding-left: 2em;
          }

          :deep(li) {
            margin: 0.25em 0;
          }

          :deep(img) {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            margin: 8px 0;
          }

          :deep(table) {
            border-collapse: collapse;
            width: 100%;
            margin: 16px 0;

            th,
            td {
              border: 1px solid #dfe2e5;
              padding: 6px 13px;
              text-align: left;
            }

            th {
              background-color: #f6f8fa;
              font-weight: 600;
            }
          }
        }
      }
    }
  }
}

// 封面图片样式
.cover-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  
  &:hover {
    border-color: var(--el-color-primary);
  }
  
  .cover-image {
    width: 200px;
    height: 100px;
    object-fit: cover;
    display: block;
  }
  
  .cover-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 100px;
    color: #8c939d;
    font-size: 14px;
    
    .el-icon {
      font-size: 28px;
      margin-bottom: 8px;
    }
  }
}

.cover-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-left: 10px;
}

// 响应式设计
@media (max-width: 768px) {
  .blog-editor {
    .editor-content {
      .editor-container {
        .editor-toolbar {
          flex-wrap: wrap;
          gap: 4px;
        }

        .markdown-editor {
          textarea {
            min-height: 300px;
            font-size: 13px;
          }
        }

        .preview-panel {
          .preview-content {
            padding: 12px;
            font-size: 14px;
          }
        }
      }
    }
    
    .cover-upload {
      .cover-image,
      .cover-placeholder {
        width: 100%;
        max-width: 200px;
      }
    }
  }
}
</style>