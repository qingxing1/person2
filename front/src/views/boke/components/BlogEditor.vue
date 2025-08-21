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
          <div class="editor-container">
            <div class="editor-toolbar">
              <el-button-group>
                <el-button size="small" @click="insertBold" title="粗体">
                  <el-icon>
                    <Bold />
                  </el-icon>
                </el-button>
                <el-button size="small" @click="insertItalic" title="斜体">
                  <el-icon>
                    <Italic />
                  </el-icon>
                </el-button>
                <el-button size="small" @click="insertLink" title="链接">
                  <el-icon>
                    <Link />
                  </el-icon>
                </el-button>
                <el-button size="small" @click="insertCode" title="代码块">
                  <el-icon><Code /></el-icon>
                </el-button>
                <el-button size="small" @click="insertTable" title="表格">
                  <el-icon>
                    <Grid />
                  </el-icon>
                </el-button>
                <el-upload ref="uploadRef" class="image-upload" action="#" :http-request="handleContentImageUpload"
                  :show-file-list="false" :before-upload="beforeImageUpload" accept="image/*">
                  <el-button size="small" type="primary" title="上传图片">
                    <el-icon>
                      <Picture />
                    </el-icon>
                  </el-button>
                </el-upload>
              </el-button-group>
            </div>

            <div class="markdown-editor">
              <textarea ref="editorRef" v-model="form.content" placeholder="请输入博客内容，支持Markdown格式
支持拖拽或粘贴上传图片..." @dragover.prevent @drop="handleDrop" @paste="handlePaste"></textarea>
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
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
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
import type { FormRules } from 'element-plus'
import type { Blog, BlogFormData } from '../types/blog'
import { addBlog, updateBlog, uploadCoverImage, uploadContentImage, getBlogDetail } from '@/api/boke'
import emitter from '@/utils/mitt';


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
const availableTags = ref([
  'React', 'TypeScript', 'JavaScript', 'CSS', 'Node.js',
  '性能优化', 'Webpack', 'Vite', '测试', '状态管理'
])

// 分类选项
const availableCategories = ref([
  '前端', '后端', '全栈', '移动开发', '数据库',
  '运维', '安全', '项目管理', '其他'
])

const formRef = ref()
const submitting = ref(false)
const editorRef = ref<HTMLTextAreaElement>()
const uploadRef = ref()

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

const renderedContent = computed(() => {
  return marked(form.value.content || '')
})

// 转换标签字符串为数组
const getTagsArray = (temp: string) => {
  return temp
    .split(',')
    .map(tag => tag.trim()) // 去除前后空格
    .filter(tag => tag); // 过滤空字符串

}
// 将数组标签转化为字符串
const getTagsString = (temp: Array<string>) => {
  return temp
    .map(tag => tag.trim()) // 去除元素前后空格
    .filter(tag => tag) // 过滤空字符串
    .join(',');
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

// 使用新的内容图片上传方法
const handleContentImageUpload = async (options: any) => {
  const { file } = options

  try {
    const res: any = await uploadContentImage(file)

    if (res.code === 200 && res.data) {
      const imageUrl = res.data
      const imageMarkdown = `![图片描述](${imageUrl})`
      insertAtCursor(imageMarkdown)
      ElMessage.success('图片上传成功！')
    } else {
      ElMessage.error(res.message || '图片上传失败！')
    }
  } catch (error) {
    ElMessage.error('图片上传失败！')
  }
}

// 更新拖拽上传
const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.type.startsWith('image/')) {
      uploadContentImage(file).then((res: any) => {

        if (res.code === 200 && res.data) {
          const imageUrl = res.data
          const imageMarkdown = `![图片描述](${imageUrl})`
          insertAtCursor(imageMarkdown)
          ElMessage.success('图片上传成功！')
        } else {
          ElMessage.error(res.message || '图片上传失败！')
        }
      }).catch(() => {
        ElMessage.error('图片上传失败！')
      })
    }
  }
}

// 更新粘贴上传
const handlePaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items
  if (items) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile()
        if (file) {
          uploadContentImage(file).then((res: any) => {

            if (res.code === 200 && res.data) {
              const imageUrl = res.data
              const imageMarkdown = `![图片描述](${imageUrl})`
              insertAtCursor(imageMarkdown)
              ElMessage.success('图片上传成功！')
            } else {
              ElMessage.error(res.message || '图片上传失败！')
            }
          }).catch(() => {
            ElMessage.error('图片上传失败！')
          })
        }
      }
    }
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


watch(() => props.blog, (newBlog) => {
  if (newBlog && props.isEdit) {
    form.value = {
      id: newBlog.id?.toString(),
      title: newBlog.title || '',
      tags: getTagsArray(newBlog.tags),
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
    // 编辑
    const res: any = await updateBlog(form.value)
    if (res.code === 200) {
      ElMessage.success('编辑成功')
      handleClose()
    }

  } else {
    // 新增
    // 移除id
    const { id, ...data } = form.value;  // 直接排除 id 字段
    // 新增
    const res: any = await addBlog(data)
    if (res.code === 200) {
      ElMessage.success('新增成功')
      handleClose()
    }
  }
  // 传递消息，通知博客列表重新获取博客列表
  emitter.emit('refreshBlogList');

}

const setSubmitting = (value: boolean) => {
  submitting.value = value
}

defineExpose({
  setSubmitting
})

// 根据id获取博客内容详情
const getBlogDetailById = async (id: string) => {
  form.value.id = id
  const res: any = await getBlogDetail(id)
  if (res.code === 200) {
    form.value = res.data
    // 在这里处理tags，将字符串转换为数组
    form.value.tags = getTagsArray(form.value.tags)
  }
  else {
    ElMessage.error(res.message || '获取博客详情失败！')
  }
}

// 监听visible变化，当编辑器显示时加载数据
watch(() => [props.visible, props.currentBlogId, props.isEdit], ([visible, blogId, isEdit]) => {
  if (visible) {
    if (isEdit && blogId) {
      // 编辑模式：加载博客数据
      getBlogDetailById(blogId)
    } else if (!isEdit) {
      // 新增模式：强制重置表单，无论blogId是否存在
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
    if (!newIsEdit) {
      // 切换到新增模式：强制重置表单
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
  if (props.visible && props.isEdit && props.currentBlogId) {
    getBlogDetailById(props.currentBlogId)
  } else if (props.visible && !props.isEdit) {
    // 新增模式：重置表单
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

          :deep(h1) {
            font-size: 2em;
            border-bottom: 1px solid #eaecef;
            padding-bottom: 0.3em;
          }

          :deep(h2) {
            font-size: 1.5em;
            border-bottom: 1px solid #eaecef;
            padding-bottom: 0.3em;
          }

          :deep(h3) {
            font-size: 1.25em;
          }

          :deep(h4) {
            font-size: 1em;
          }

          :deep(h5) {
            font-size: 0.875em;
          }

          :deep(h6) {
            font-size: 0.85em;
            color: #6a737d;
          }

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