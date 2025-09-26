<template>
    <div class="blog-management">
        <div class="page-content">
            <!-- 工具栏 -->
            <div class="toolbar">
                <div class="toolbar-title">
                    博客管理
                </div>
                <div class="flex justify-between w-3/7">

                    <div class="toolbar-left">
                        <el-input v-model="searchKeyword" placeholder="搜索博客标题" style="width: 300px" clearable
                            @clear="handleSearch" @input="handleSearch">
                            <template #prefix>
                                <el-icon>
                                    <Search />
                                </el-icon>
                            </template>
                        </el-input>
                    </div>

                    <div class="toolbar-right">
                        <el-button type="success" @click="showUploader = true">
                            <el-icon>
                                <Upload />
                            </el-icon>
                            上传Markdown
                        </el-button>
                    </div>
                </div>
            </div>

            <!-- 博客列表 -->
            <BlogList :loading="loading" :search-keyword="searchKeyword" @view="handleViewBlog" @add="handleAddBlog"
                @edit="handleEditBlog" @page-change="handlePageChange" />


        </div>

        <!-- 博客编辑器抽屉 -->
        <el-drawer v-model="showEditor" :title="isEdit ? '编辑博客' : '新增博客'" size="75%" direction="rtl">
            <BlogEditor :visible="showEditor" :blog="currentBlog" :is-edit="isEdit" :current-blog-id="currentBlog?.id" @close="handleEditorClose" />

        </el-drawer>

        <!-- 博客查看器 -->
        <BlogViewer :visible="showViewer" :blog="currentBlog" @close="handleViewerClose" @edit="handleEditBlog" />

        <!-- Markdown上传器 -->
        <el-dialog v-model="showUploader" title="上传Markdown文件" width="500px" @close="handleUploaderClose">
            <MarkdownUploader @upload-success="handleUploadSuccess" @upload-error="handleUploadError" />
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Upload } from '@element-plus/icons-vue'
import BlogList from './components/BlogList.vue'
import BlogEditor from './components/BlogEditor.vue'
import BlogViewer from './components/BlogViewer.vue'
import MarkdownUploader from './components/MarkdownUploader.vue'
import { getBlogList } from '@/api/boke'


import type { Blog, BlogFormData } from './types/blog'

// 状态管理 - 控制各个组件的显示/隐藏和数据状态
const loading = ref(false)          // 全局加载状态，用于显示加载动画
const showEditor = ref(false)       // 控制博客编辑器抽屉的显示/隐藏
const showViewer = ref(false)       // 控制博客查看器弹窗的显示/隐藏
const showUploader = ref(false)    // 控制Markdown上传器弹窗的显示/隐藏
const isEdit = ref(false)          // 标记当前是编辑模式还是新增模式
const searchKeyword = ref('')       // 搜索关键词，用于过滤博客列表

const currentBlog = ref<Blog | undefined>()


// 编辑博客
const handleEditBlog = (blog: Blog) => {
    isEdit.value = true
    // 确保传递的是一个新的对象引用，以触发响应式更新
    currentBlog.value = JSON.parse(JSON.stringify(blog))
    showViewer.value = false
    // 最后再显示编辑器，确保数据已经准备好
    showEditor.value = true
}

// 查看博客
const handleViewBlog = (blog: Blog) => {
    currentBlog.value = blog
    showViewer.value = true
}

// 新增博客
const handleAddBlog = () => {
    isEdit.value = false
    currentBlog.value = undefined
    showEditor.value = true
    showViewer.value = false
}

const handlePageChange = (page: number, size: number) => {
    console.log('分页变化:', page, size)
    // 这里可以加载对应页的数据
}

const handleSearch = () => {
  // 搜索逻辑由BlogList组件内部处理，这里不需要额外操作
  // searchKeyword的变化会自动触发BlogList的重新加载
}

const handleEditorClose = () => {
    showEditor.value = false
    currentBlog.value = undefined
}


const handleViewerClose = () => {
    showViewer.value = false
    currentBlog.value = undefined
}

const handleUploaderClose = () => {
    showUploader.value = false
}

const handleUploadSuccess = (content: string, fileName: string) => {
    // 从markdown内容提取标题（第一行的#标题）
    const titleMatch = content.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1] : fileName.replace(/\.md$/, '')

    // 创建新博客
    const newBlog: BlogFormData = {
        title,
        tags: '',
        category: '其他',
        status: 'draft',
        content
    }

    // 打开编辑器，预填充内容
    isEdit.value = false
    currentBlog.value = newBlog as Blog
    showUploader.value = false
    showEditor.value = true

    ElMessage.success(`文件 "${fileName}" 上传成功，请完善信息后发布`)
}

const handleUploadError = (error: string) => {
    ElMessage.error(error)
}

onMounted(() => {
    // 这里可以加载初始数据
    console.log('博客管理页面加载完成')
})
</script>

<style scoped lang="scss">
.blog-management {

    .page-content {
        background-color: var(--el-bg-color);
        border-radius: 8px;
        padding: 20px;
        box-shadow: var(--el-box-shadow-light);

        .toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid var(--el-border-color);

            .toolbar-title {
                font-size: 26px;
                font-weight: 700;
            }

            .toolbar-left {
                display: flex;
                align-items: center;
            }

            .toolbar-right {
                display: flex;
                gap: 10px;
            }
        }
    }
}
</style>