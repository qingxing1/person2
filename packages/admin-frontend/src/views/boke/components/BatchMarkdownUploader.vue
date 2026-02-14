<template>
  <div class="batch-markdown-uploader">
    <el-upload
      class="upload-area"
      drag
      :action="uploadUrl"
      :accept="acceptTypes"
      :multiple="true"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :file-list="fileList"
      :headers="uploadHeaders"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :auto-upload="false"
      ref="uploadRef"
    >
      <el-icon class="upload-icon"><Upload /></el-icon>
      <div class="el-upload__text">
        将 <em>文件夹</em> 或 Markdown 文件拖到此处，或 <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          支持上传整个文件夹或多个 .md 和 .markdown 文件，每个文件不超过 50MB
        </div>
      </template>
    </el-upload>

    <div class="upload-actions">
      <el-button type="primary" @click="handleUploadFromDialog">
        <el-icon><FolderOpened /></el-icon>
        选择文件夹或文件
      </el-button>
      <el-button @click="startBatchUpload" :disabled="fileList.length === 0" :loading="uploading">
        <el-icon><UploadFilled /></el-icon>
        开始批量上传
      </el-button>
    </div>

    <input
      ref="fileInputRef"
      type="file"
      :accept="acceptTypes"
      multiple
      webkitdirectory
      style="display: none"
      @change="handleFileSelect"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Upload, FolderOpened, UploadFilled } from '@element-plus/icons-vue'
import { ElMessage, type UploadFile, type UploadFiles, type UploadInstance } from 'element-plus'
import type { UploadRawFile } from 'element-plus'
import { batchUploadMarkdownFiles } from '@/api/boke'

const emit = defineEmits<{
  batchUploadComplete: [results: any[]]
  batchUploadError: [error: string]
}>()

const uploadRef = ref<UploadInstance>()
const fileInputRef = ref<HTMLInputElement>()
const fileList = ref<UploadFile[]>([])
const uploading = ref(false)
const uploadResults = ref<any[]>([])
const acceptTypes = '.md,.markdown'

// 使用带API前缀的真实API端点，以便通过代理转发到后端
const uploadUrl = '/api/blog/batch-upload/markdown'

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

const handleChange = (file: UploadFile, files: UploadFiles) => {
  fileList.value = files
}

const handleRemove = (file: UploadFile, files: UploadFiles) => {
  fileList.value = files
}

const handleSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  // 检查响应是否包含预期的结构
  if (response && typeof response === 'object' && response.code === 200) {
    // 处理批量上传的结果
    const results = response.data?.results || []
    const failedFiles = response.data?.failedFiles || []
    
    // 合并成功和失败的结果
    const allResults = [
      ...results.map((item: any) => ({ ...item, success: true })),
      ...failedFiles.map((item: any) => {
        // 解析失败信息
        const [filename, error] = item.split(' - ')
        return { filename, error, success: false }
      })
    ]
    
    uploadResults.value = allResults
    
    // 显示成功消息，只显示成功数量
    const successCount = results.length
    const totalCount = response.data?.summary?.total || results.length
    const message = `批量上传完成，成功处理 ${successCount} 个文件`
    
    ElMessage.success(message)
    
    // 自动关闭弹框并触发上传完成事件
    emit('batchUploadComplete', allResults)
  } else {
    // 如果响应不符合预期格式，视为错误
    const errorMsg = response?.msg || response?.message || '批量上传失败'
    emit('batchUploadError', errorMsg)
    ElMessage.error(errorMsg)
  }
}

const handleError = (error: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  // 这里处理网络错误或其他类型的错误
  console.error('批量上传错误:', error)
  
  let errorMsg = '批量上传失败'
  if (error?.response?.data?.msg) {
    errorMsg = error.response.data.msg
  } else if (error?.response?.data?.error) {
    errorMsg = error.response.data.error
  } else if (error?.response?.data?.message) {
    errorMsg = error.response.data.message
  } else if (error?.message) {
    errorMsg = error.message
  } else {
    errorMsg = '未知错误'
  }
  
  emit('batchUploadError', errorMsg)
  ElMessage.error(errorMsg)
}

const handleUploadFromDialog = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (files && files.length > 0) {
    // 添加选中的文件到列表
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const uploadFile: UploadFile = {
        raw: file as UploadRawFile,
        name: file.name,
        size: file.size,
        type: file.type,
        uid: Date.now() + i,
        status: 'ready',
        percentage: 0
      }
      
      // 检查文件类型
      if (beforeUpload(file as UploadRawFile)) {
        fileList.value.push(uploadFile)
      }
    }
  }

  // 清空input，允许重复选择同一个文件
  target.value = ''
}

const startBatchUpload = async () => {
  if (fileList.value.length === 0) {
    ElMessage.warning('请先选择要上传的文件')
    return
  }

  uploading.value = true
  
  try {
    const formData = new FormData()
    
    // 添加所有文件到FormData
    fileList.value.forEach((file, index) => {
      if (file.raw) {
        // 使用原始文件名，保持文件夹结构
        // 注意：对于文件夹上传，浏览器可能会保留原始路径名
        formData.append('files', file.raw, file.name)
      }
    })

    const response = await batchUploadMarkdownFiles(formData)
    // 直接使用响应对象，而不是响应数据部分
    handleSuccess(response, fileList.value[0], fileList.value)
  } catch (error) {
    handleError(error, fileList.value[0], fileList.value)
  } finally {
    uploading.value = false
  }
}

// 从上传结果中分离成功和失败的项
const successResults = computed(() => {
  return uploadResults.value.filter(item => item.success)
})

const failedFiles = computed(() => {
  return uploadResults.value
    .filter(item => !item.success)
    .map(item => ({
      filename: item.filename,
      error: item.error || '未知错误'
    }))
})

// 由于Element Plus的Upload组件不使用axios拦截器，需要手动添加认证头部
// 需要检查localStorage中的token是否已经包含Bearer前缀
const storedToken = localStorage.getItem('token') || '';
const tokenWithoutBearer = storedToken.replace('Bearer ', '');
const uploadHeaders = {
  'Authorization': `Bearer ${tokenWithoutBearer}`
}
</script>

<style scoped lang="scss">
.batch-markdown-uploader {
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
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-bottom: 20px;
  }
}
</style>