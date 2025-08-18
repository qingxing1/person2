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

const emit = defineEmits<{
  uploadSuccess: [content: string, fileName: string]
  uploadError: [error: string]
}>()

const fileInputRef = ref<HTMLInputElement>()
const acceptTypes = '.md,.markdown'

// 模拟上传地址和请求头
const uploadUrl = '/api/upload/markdown'
const uploadHeaders = {
  Authorization: 'Bearer your-token-here'
}

const beforeUpload = (file: UploadRawFile) => {
  const isMarkdown = file.type === 'text/markdown' || 
                    file.name.endsWith('.md') || 
                    file.name.endsWith('.markdown')
  
  if (!isMarkdown) {
    ElMessage.error('只能上传 Markdown 文件!')
    return false
  }

  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过 10MB!')
    return false
  }

  return true
}

const handleSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  // 获取原始文件
  const file = uploadFile.raw
  if (!file) return
  
  // 模拟读取文件内容
  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    emit('uploadSuccess', content, uploadFile.name)
    ElMessage.success('文件上传成功!')
  }
  reader.readAsText(file)
}

const handleError = (error: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  const errorMsg = error?.message || '文件上传失败'
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
    if (beforeUpload(file as UploadRawFile)) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        emit('uploadSuccess', content, file.name)
        ElMessage.success('文件读取成功!')
      }
      reader.onerror = () => {
        emit('uploadError', '文件读取失败')
        ElMessage.error('文件读取失败!')
      }
      reader.readAsText(file)
    }
  }
  
  // 清空input，允许重复选择同一个文件
  target.value = ''
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