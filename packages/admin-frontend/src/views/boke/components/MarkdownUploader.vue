<template>
  <div class="markdown-uploader">
    <el-upload
      class="upload-area"
      drag
      :action="uploadUrl"
      :accept="acceptTypes"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :show-file-list="false"
      :headers="uploadHeaders"
    >
      <el-icon class="upload-icon"><Upload /></el-icon>
      <div class="el-upload__text">
        将 Markdown 文件拖到此处，或 <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          只能上传 .md 和 .markdown 文件，且不超过 10MB
        </div>
      </template>
    </el-upload>

    <div class="upload-actions">
      <el-button type="primary" @click="handleUploadFromDialog">
        <el-icon><FolderOpened /></el-icon>
        选择文件
      </el-button>
    </div>

    <input
      ref="fileInputRef"
      type="file"
      :accept="acceptTypes"
      style="display: none"
      @change="handleFileSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Upload, FolderOpened } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadRawFile, UploadFile, UploadFiles } from 'element-plus'
import { uploadMarkdownFile } from '@/api/boke'

const emit = defineEmits<{
  uploadSuccess: [content: string, fileName: string]
  uploadError: [error: string]
}>()

const fileInputRef = ref<HTMLInputElement>()
const acceptTypes = '.md,.markdown'

// 使用带API前缀的真实API端点，以便通过代理转发到后端
// 当使用Element Plus的Upload组件时，action需要包含完整的代理路径
const uploadUrl = '/api/blog/upload/markdown'

const beforeUpload = (file: UploadRawFile) => {
  const isMarkdown = file.type === 'text/markdown' ||
                    file.type === 'text/plain' ||
                    file.name.endsWith('.md') ||
                    file.name.endsWith('.markdown')

  if (!isMarkdown) {
    ElMessage.error('只能上传 Markdown 文件!')
    return false
  }

  const isLt50M = file.size / 1024 / 1024 < 50
  if (!isLt50M) {
    ElMessage.error('文件大小不能超过 50MB!')
    return false
  }

  return true
}

const handleSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  if (response && response.code === 200) {
    // 从后端响应中获取解析后的Markdown内容和标题
    const markdownContent = response.data.content || ''
    const blogTitle = response.data.title || uploadFile.name
    
    // 返回解析后的Markdown内容和文件名，让父组件决定如何处理
    emit('uploadSuccess', markdownContent, blogTitle)
    ElMessage.success(response.data.message || 'Markdown文件上传成功!')
  } else {
    const errorMsg = response?.msg || '文件上传失败'
    emit('uploadError', errorMsg)
    ElMessage.error(errorMsg)
  }
}

const handleError = (error: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  const errorMsg = error?.response?.data?.msg || error?.message || '文件上传失败'
  emit('uploadError', errorMsg)
  ElMessage.error(errorMsg)
}

const handleUploadFromDialog = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    // 触发Element Plus上传组件的上传逻辑
    // 这样可以复用beforeUpload和handleSuccess/handleError逻辑
    const uploadFile = {
      raw: file,
      name: file.name,
      size: file.size,
      type: file.type,
      uid: Date.now()
    } as UploadFile;
    
    // 直接调用beforeUpload检查
    if (beforeUpload(file as UploadRawFile)) {
      // 手动触发上传
      const formData = new FormData();
      formData.append('file', file);
      
      // 发送请求到后端
      uploadMarkdownFile(formData)
        .then(response => {
          handleSuccess(response, uploadFile, [uploadFile]);
        })
        .catch(error => {
          handleError(error, uploadFile, [uploadFile]);
        });
    }
  }

  // 清空input，允许重复选择同一个文件
  target.value = ''
}

// 由于Element Plus的Upload组件不使用axios拦截器，需要手动添加认证头部
// 需要检查localStorage中的token是否已经包含Bearer前缀
const storedToken = localStorage.getItem('token') || '';
const tokenWithoutBearer = storedToken.replace('Bearer ', '');
const uploadHeaders = {
  'Authorization': `Bearer ${tokenWithoutBearer}`
}
</script>

<style scoped lang="scss">
.markdown-uploader {
  .upload-area {
    margin-bottom: 20px;

    :deep(.el-upload-dragger) {
      padding: 40px 20px;
    }

    .upload-icon {
      font-size: 48px;
      color: var(--el-color-primary);
    }
  }

  .upload-actions {
    text-align: center;
  }
}
</style>