# 博客创建前端使用示例

## 完整Vue组件实现

### 1. 博客创建表单组件

```vue
<!-- BlogCreateForm.vue -->
<template>
  <div class="blog-create-form">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <!-- 标题 -->
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入博客标题" maxlength="200" show-word-limit />
      </el-form-item>

      <!-- 封面图片上传 -->
      <el-form-item label="封面图片">
        <el-upload
          class="cover-uploader"
          :action="'/api/blog/upload/cover'"
          :show-file-list="false"
          :on-success="handleCoverSuccess"
          :before-upload="beforeImageUpload"
          :headers="uploadHeaders"
        >
          <img v-if="form.coverImage" :src="form.coverImage" class="cover-image" />
          <div v-else class="cover-placeholder">
            <el-icon><Plus /></el-icon>
            <span>上传封面</span>
          </div>
        </el-upload>
      </el-form-item>

      <!-- 内容编辑器 -->
      <el-form-item label="内容" prop="content">
        <RichTextEditor 
          v-model="form.content" 
          @image-upload="handleContentImageUpload"
        />
      </el-form-item>

      <!-- 内容图片上传 -->
      <el-form-item label="内容图片">
        <el-upload
          :action="'/api/blog/upload/images'"
          multiple
          :limit="10"
          :file-list="contentImages"
          :on-success="handleImagesSuccess"
          :before-upload="beforeImageUpload"
          :on-remove="handleImageRemove"
          list-type="picture-card"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <!-- 作者 -->
      <el-form-item label="作者" prop="author">
        <el-input v-model="form.author" placeholder="请输入作者名称" maxlength="50" />
      </el-form-item>

      <!-- 标签 -->
      <el-form-item label="标签">
        <el-select
          v-model="form.tags"
          multiple
          filterable
          allow-create
          placeholder="请选择或输入标签"
          style="width: 100%"
        >
          <el-option label="技术" value="技术" />
          <el-option label="教程" value="教程" />
          <el-option label="分享" value="分享" />
        </el-select>
      </el-form-item>

      <!-- 分类 -->
      <el-form-item label="分类">
        <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%">
          <el-option label="技术文章" value="技术文章" />
          <el-option label="教程" value="教程" />
          <el-option label="随笔" value="随笔" />
          <el-option label="新闻" value="新闻" />
        </el-select>
      </el-form-item>

      <!-- 状态 -->
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">发布</el-radio>
          <el-radio :label="0">草稿</el-radio>
          <el-radio :label="2">下线</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm" :loading="loading">
          发布博客
        </el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import RichTextEditor from './RichTextEditor.vue'
import { createBlog } from '@/api/blog'

const formRef = ref()
const loading = ref(false)
const contentImages = ref([])

const form = reactive({
  title: '',
  content: '',
  author: '',
  tags: [],
  category: '',
  status: 1,
  coverImage: '',
  images: []
})

const rules = {
  title: [
    { required: true, message: '请输入博客标题', trigger: 'blur' },
    { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入博客内容', trigger: 'blur' }
  ],
  author: [
    { max: 50, message: '作者名称不能超过50个字符', trigger: 'blur' }
  ]
}

const uploadHeaders = {
  Authorization: `Bearer ${localStorage.getItem('token')}`
}

// 图片上传验证
const beforeImageUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }
  return true
}

// 封面图片上传成功
const handleCoverSuccess = (response, file) => {
  if (response.code === 200) {
    form.coverImage = response.data
    ElMessage.success('封面上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

// 内容图片上传成功
const handleImagesSuccess = (response, file, fileList) => {
  if (response.code === 200) {
    // 处理多张图片上传
    if (Array.isArray(response.data)) {
      form.images.push(...response.data)
    } else {
      form.images.push(response.data)
    }
    ElMessage.success('图片上传成功')
  }
}

// 移除图片
const handleImageRemove = (file, fileList) => {
  // 从images数组中移除对应的URL
  const index = form.images.indexOf(file.url)
  if (index > -1) {
    form.images.splice(index, 1)
  }
}

// 内容编辑器中的图片上传
const handleContentImageUpload = (file) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', file)

    // 这里调用上传接口
    fetch('/api/blog/upload/image', {
      method: 'POST',
      body: formData,
      headers: uploadHeaders
    })
    .then(res => res.json())
    .then(res => {
      if (res.code === 200) {
        resolve(res.data)
      } else {
        reject(new Error(res.message))
      }
    })
    .catch(() => {
      reject(new Error('上传失败'))
    })
  })
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 处理标签数组为字符串
        const submitData = {
          ...form,
          tags: form.tags.join(',')
        }

        await createBlog(submitData)
        ElMessage.success('博客创建成功')
        resetForm()
      } catch (error) {
        ElMessage.error(error.message || '创建失败')
      } finally {
        loading.value = false
      }
    }
  })
}

const resetForm = () => {
  formRef.value.resetFields()
  form.coverImage = ''
  form.images = []
  contentImages.value = []
}
</script>

<style scoped>
.cover-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}

.cover-uploader:hover {
  border-color: #409eff;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #8c939d;
}
</style>
```

### 2. API接口封装

```typescript
// api/blog.ts
import request from '@/utils/request'

// 创建博客
export const createBlog = (data: any) => {
  return request({
    url: '/api/blog',
    method: 'post',
    data
  })
}

// 上传封面图片
export const uploadCoverImage = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/api/blog/upload/cover',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 上传内容图片
export const uploadImages = (files: File[]) => {
  const formData = new FormData()
  files.forEach(file => {
    formData.append('files', file)
  })
  return request({
    url: '/api/blog/upload/images',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
```

### 3. 使用示例

```vue
<!-- 在页面中使用 -->
<template>
  <div class="page-container">
    <h1>创建新博客</h1>
    <BlogCreateForm />
  </div>
</template>

<script setup>
import BlogCreateForm from './components/BlogCreateForm.vue'
</script>
```

## 🎯 使用流程总结

1. **上传封面** → 获取coverImage URL
2. **上传内容图片** → 获取images数组
3. **填写内容** → 富文本编辑器中插入图片
4. **提交表单** → 包含所有参数创建博客

这个完整的实现可以直接复制使用，已经包含了所有必要的图片上传和博客创建功能！