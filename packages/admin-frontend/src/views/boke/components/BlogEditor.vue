<template>
  <div class="blog-editor">
    <div class="editor-content">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入笔记标题" />
        </el-form-item>
        <div class="flex justify-between w-full">
          <el-form-item label="分类" prop="category">
            <el-select v-model="form.category" placeholder="请选择分类" style="width:450px">
              <div v-for="category in availableCategories" :key="category">
                <el-option :label="category" :value="category" />
              </div>
            </el-select>
          </el-form-item>

          <el-form-item label="标签" prop="tags">
            <el-select v-model="form.tags" placeholder="请选择标签" style="width:450px" multiple>
              <div v-for="tag in availableTags" :key="tag">
                <el-option :label=tag :value=tag />
              </div>
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio value="draft">草稿</el-radio>
            <el-radio value="published">已发布</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="封面图片" prop="cover">
          <el-upload class="cover-upload" action="#" :http-request="handleCoverUpload" :show-file-list="false"
            :before-upload="beforeCoverUpload" :headers="uploadHeaders" accept="image/*">
            <img v-if="form.coverImage" :src="form.coverImage" class="cover-image" alt="封面" />
            <div v-else class="cover-placeholder">
              <el-icon>
                <Picture />
              </el-icon>
              <span>点击上传封面</span>
            </div>
          </el-upload>
          <div class="cover-tip">建议尺寸：800x400px，大小不超过2MB</div>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <div class="md-editor-container">
            <MdEditor
              v-model="form.content"
              :theme="isDark ? 'dark' : 'light'"
              :preview="true"
              :toolbars="toolbars"
              :footers="footers"
              @onUploadImg="onUploadImg"
              placeholder="请输入博客内容，支持Markdown格式..."
            />
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
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import type { UploadProps } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import type { FormRules } from 'element-plus'
import type { Blog, BlogFormData } from '../types/blog'
import { addBlog, updateBlog, uploadCoverImage, uploadContentImage, getBlogDetail, getBlogCategoryList, getBlogTagList } from '@/api/boke'
import emitter from '@/utils/mitt'
import { useTheme } from '@/hooks/useTheme'

const { isDark } = useTheme()

type EditorBlog = Omit<BlogFormData, 'tags'> & {
  id?: string,
  tags: string,
  coverImage: string,
  author: string
}

const props = defineProps<{
  visible: boolean
  blog?: Blog
  isEdit?: boolean
  currentBlogId?: string
}>()

const emit = defineEmits<{
  close: []
  submit: [data: Omit<EditorBlog, 'tags'> & { tags: string[] }]
}>()

// 标签选项
const availableTags = ref<string[]>([])

// 分类选项
const availableCategories = ref<string[]>([])

// 加载元数据（分类和标签）
const loadMetadata = async () => {
  try {
    const [categoryRes, tagRes] = await Promise.all([
      getBlogCategoryList(),
      getBlogTagList()
    ])

    if (categoryRes?.code === 200) {
      availableCategories.value = (categoryRes.data || []).map((item: any) => item.name)
    }

    if (tagRes?.code === 200) {
      availableTags.value = (tagRes.data || []).map((item: any) => item.name)
    }
  } catch (error) {
    console.error('加载元数据失败:', error)
    ElMessage.error('加载分类标签数据失败')
  }
}

const formRef = ref()
const submitting = ref(false)

const form = ref<EditorBlog>({
  id: '',
  title: '',
  tags: '',
  category: '',
  status: 'draft',
  content: '',
  coverImage: '',
  author: 'admin'
})

// 上传配置
const uploadHeaders = ref({
  'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
})

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

// 转换标签字符串为数组
const getTagsArray = (temp: string) => {
  return temp
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag)
}

// 将数组标签转化为字符串
const getTagsString = (temp: Array<string>) => {
  return temp
    .map(tag => tag.trim())
    .filter(tag => tag)
    .join(',')
}

// MdEditor 工具栏配置
const toolbars = [
  'bold',
  'underline',
  'italic',
  'strikeThrough',
  'title',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  'revoke',
  'next',
  'save',
  '=',
  'preview',
  'htmlPreview',
  'catalog',
  'github'
]

const footers = ['markdownTotal', '=', 0, 'scrollSwitch']

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

// 使用自定义封面上传方法
const handleCoverUpload = async (options: any) => {
  const { file } = options

  try {
    const res: any = await uploadCoverImage(file)
    if (res.code === 200 && res.data) {
      form.value.coverImage = res.data
      ElMessage.success('封面上传成功！')
    } else {
      ElMessage.error(res.message || '封面上传失败！')
    }
  } catch (error) {
    ElMessage.error('封面上传失败！')
  }
}

// MdEditor 图片上传
const onUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
  const results = await Promise.all(
    files.map(async (file) => {
      try {
        const res: any = await uploadContentImage(file)
        if (res.code === 200 && res.data) {
          ElMessage.success('图片上传成功！')
          // 将后端返回的地址插入到图片的src中
          const imgUrl = res.data
          const imgTag = imgUrl[0]
          return imgTag
        } else {
          ElMessage.error(res.message || '图片上传失败！')
          return null
        }
      } catch (error) {
        ElMessage.error('图片上传失败！')
        return null
      }
    })
  )
  
  const validUrls = results.filter(url => url !== null)
  if (validUrls.length > 0) {
    callback(validUrls)
  }
}

watch(() => props.blog, (newBlog) => {
  if (newBlog && props.isEdit) {
    form.value = {
      id: newBlog.id?.toString(),
      title: newBlog.title || '',
      tags: getTagsString(getTagsArray(newBlog.tags)), // 将标签数组转换回字符串
      category: newBlog.category || '',
      status: newBlog.status || 'draft',
      content: newBlog.content || '',
      coverImage: newBlog.coverImage || '',
      author: newBlog.author || 'admin',
    }
  } else if (newBlog && !props.isEdit) {
    // 处理新建博客的情况，当不是编辑模式但有博客数据时
    form.value = {
      id: newBlog.id?.toString() || '',
      title: newBlog.title || '',
      tags: getTagsString(getTagsArray(newBlog.tags)), // 将标签数组转换回字符串
      category: newBlog.category || '',
      status: newBlog.status || 'draft',
      content: newBlog.content || '',
      coverImage: newBlog.coverImage || '',
      author: newBlog.author || 'admin',
    }
  } else {
    form.value = {
      title: '',
      tags: '',
      category: '',
      status: 'draft',
      content: '',
      coverImage: '',
      author: 'admin'
    }
  }
}, { immediate: true })

// 关闭弹窗
const handleClose = () => {
  formRef.value?.resetFields()
  emit('close')
}

// 提交博客表单
const handleSubmit = async () => {
  // 在提交之前将标签的数组转化为字符串
  form.value.tags = getTagsString(form.value.tags)

  // 判断是新增还是编辑
  if (form.value.id) {
    const res: any = await updateBlog(form.value)
    if (res.code === 200) {
      ElMessage.success('编辑成功')
      handleClose()
    }
  } else {
    const { id, ...data } = form.value
    const res: any = await addBlog(data)
    if (res.code === 200) {
      ElMessage.success('新增成功')
      handleClose()
    }
  }
  
  emitter.emit('refreshBlogList')
}

// 根据id获取博客内容详情
const getBlogDetailById = async (id: string) => {
  form.value.id = id
  const res: any = await getBlogDetail(id)
  if (res.code === 200) {
    form.value = res.data
    form.value.tags = getTagsArray(form.value.tags)
  } else {
    ElMessage.error(res.message || '获取博客详情失败！')
  }
}

// 监听visible变化，当编辑器显示时加载数据
watch(() => [props.visible, props.currentBlogId, props.isEdit], ([visible, blogId, isEdit]) => {
  if (visible) {
    if (isEdit && blogId) {
      getBlogDetailById(blogId)
    } else if (!isEdit && !props.blog) { // 只有在不是编辑模式且没有传入blog数据时才重置表单
      form.value = {
        id: '',
        title: '',
        tags: '',
        category: '',
        status: 'draft',
        content: '',
        coverImage: '',
        author: 'admin'
      }
    }
  }
})

// 监听isEdit变化，确保模式切换时正确重置表单
watch(() => props.isEdit, (newIsEdit) => {
  if (props.visible) {
    if (!newIsEdit && !props.blog) { // 只有在没有传入blog数据时才重置表单
      form.value = {
        id: '',
        title: '',
        tags: '',
        category: '',
        status: 'draft',
        content: '',
        coverImage: '',
        author: 'admin'
      }
    }
  }
})

// 确保组件挂载后立即检查当前状态
onMounted(() => {
  // 加载分类和标签数据
  loadMetadata()

  if (props.visible && props.isEdit && props.currentBlogId) {
    getBlogDetailById(props.currentBlogId)
  } else if (props.visible && !props.isEdit && !props.blog) {
    form.value = {
      id: '',
      title: '',
      tags: '',
      category: '',
      status: 'draft',
      content: '',
      coverImage: '',
      author: 'admin'
    }
  }
})
</script>

<style scoped lang="scss">
.blog-editor {
  .editor-content {
    .md-editor-container {
      width: 100%;
      border: 1px solid var(--el-border-color);
      border-radius: 4px;
      overflow: hidden;
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
      .md-editor-container {
        .md-editor {
          height: 500px !important;
        }
      }
    }
  }
}
</style>