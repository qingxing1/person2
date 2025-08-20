# 博客图片上传功能使用指南

## 功能概述

本系统为博客模块添加了完整的图片上传功能，支持：
- 博客封面图片上传
- 博客内容多张图片上传
- 图片类型和大小验证
- 自动生成图片URL

## API接口

### 1. 上传封面图片

**接口地址**: `POST /api/blog/upload/cover`

**请求参数**:
- `file` (FormData): 封面图片文件

**支持格式**: JPG, PNG, GIF, WebP
**文件大小限制**: 5MB

**示例请求**:
```bash
curl -X POST http://localhost:3000/api/blog/upload/cover \
  -F "file=@/path/to/cover.jpg"
```

**返回示例**:
```json
{
  "code": 200,
  "data": "https://your-domain.com/uploads/1630000000000-abc123.jpg",
  "message": "操作成功"
}
```

### 2. 上传内容图片

**接口地址**: `POST /api/blog/upload/images`

**请求参数**:
- `files` (FormData): 图片文件列表（最多10张）

**支持格式**: JPG, PNG, GIF, WebP
**文件大小限制**: 每张5MB

**示例请求**:
```bash
curl -X POST http://localhost:3000/api/blog/upload/images \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.png"
```

**返回示例**:
```json
{
  "code": 200,
  "data": [
    "https://your-domain.com/uploads/1630000000000-abc123.jpg",
    "https://your-domain.com/uploads/1630000000000-def456.png"
  ],
  "message": "操作成功"
}
```

## 博客创建/更新时使用图片

### 创建博客

在创建博客时，可以使用上传的图片URL：

```json
{
  "title": "我的第一篇博客",
  "content": "这是一篇精彩的博客内容...",
  "author": "张三",
  "coverImage": "https://your-domain.com/uploads/1630000000000-cover.jpg",
  "images": [
    "https://your-domain.com/uploads/1630000000000-image1.jpg",
    "https://your-domain.com/uploads/1630000000000-image2.png"
  ],
  "tags": ["技术", "分享"],
  "category": "技术文章"
}
```

### 更新博客

更新博客时同样可以更新图片：

```json
{
  "coverImage": "https://your-domain.com/uploads/new-cover.jpg",
  "images": [
    "https://your-domain.com/uploads/new-image1.jpg",
    "https://your-domain.com/uploads/new-image2.jpg"
  ]
}
```

## 前端集成示例

### 使用Element Plus上传组件

```vue
<template>
  <div>
    <!-- 封面图片上传 -->
    <el-upload
      class="cover-uploader"
      :action="'/api/blog/upload/cover'"
      :show-file-list="false"
      :on-success="handleCoverSuccess"
      :before-upload="beforeUpload"
    >
      <img v-if="coverImage" :src="coverImage" class="cover-image" />
      <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
    </el-upload>

    <!-- 内容图片上传 -->
    <el-upload
      class="content-uploader"
      :action="'/api/blog/upload/images'"
      multiple
      :on-success="handleImagesSuccess"
      :before-upload="beforeUpload"
      :file-list="fileList"
    >
      <el-button type="primary">选择图片</el-button>
    </el-upload>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const coverImage = ref('')
const images = ref([])
const fileList = ref([])

const beforeUpload = (file) => {
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

const handleCoverSuccess = (response) => {
  if (response.code === 200) {
    coverImage.value = response.data
  }
}

const handleImagesSuccess = (response, file, fileList) => {
  if (response.code === 200) {
    images.value = [...images.value, ...response.data]
  }
}
</script>
```

### 使用Ant Design Vue上传组件

```vue
<template>
  <div>
    <!-- 封面图片上传 -->
    <a-upload
      name="file"
      :action="'/api/blog/upload/cover'"
      :before-upload="beforeUpload"
      @change="handleCoverChange"
    >
      <a-button>
        <upload-outlined></upload-outlined>
        上传封面
      </a-button>
    </a-upload>

    <!-- 内容图片上传 -->
    <a-upload
      name="files"
      :action="'/api/blog/upload/images'"
      multiple
      :before-upload="beforeUpload"
      @change="handleImagesChange"
    >
      <a-button>
        <upload-outlined></upload-outlined>
        上传图片
      </a-button>
    </a-upload>
  </div>
</template>

<script setup>
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5
  
  if (!isImage) {
    message.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    message.error('图片大小不能超过 5MB!')
    return false
  }
  return true
}

const handleCoverChange = (info) => {
  if (info.file.status === 'done') {
    if (info.file.response.code === 200) {
      form.coverImage = info.file.response.data
    }
  }
}

const handleImagesChange = (info) => {
  if (info.file.status === 'done') {
    if (info.file.response.code === 200) {
      form.images = [...form.images, ...info.file.response.data]
    }
  }
}
</script>
```

## 注意事项

1. **文件大小限制**: 单张图片最大5MB
2. **文件格式**: 仅支持JPG、PNG、GIF、WebP格式
3. **文件命名**: 系统会自动生成唯一的文件名
4. **图片URL**: 返回的URL可以直接用于博客内容中
5. **图片管理**: 建议定期清理未使用的图片文件

## 扩展功能建议

1. **图片压缩**: 可以添加图片压缩功能，减少文件大小
2. **图片水印**: 支持添加水印保护版权
3. **CDN加速**: 集成CDN加速图片访问
4. **图片预览**: 提供图片预览和编辑功能
5. **批量管理**: 支持批量删除和管理已上传图片

## 故障排除

### 常见问题

1. **上传失败**: 检查文件大小和格式是否符合要求
2. **路径错误**: 确保上传目录有写入权限
3. **URL无效**: 检查域名配置是否正确
4. **文件丢失**: 确认文件是否成功保存到服务器

如需进一步帮助，请参考项目文档或联系开发团队。