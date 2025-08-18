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
                            @clear="handleSearch" @keyup.enter="handleSearch">
                            <template #prefix>
                                <el-icon>
                                    <Search />
                                </el-icon>
                            </template>
                        </el-input>
                        <el-button type="primary" @click="handleSearch" style="margin-left: 10px">
                            搜索
                        </el-button>
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
            <BlogList :blogs="filteredBlogs" :loading="loading" :total="total" @add="handleAddBlog"
                @view="handleViewBlog" @edit="handleEditBlog" @delete="handleDeleteBlog"
                @page-change="handlePageChange" />
        </div>

        <!-- 博客编辑器抽屉 -->
        <el-drawer v-model="showEditor" :title="isEdit ? '编辑博客' : '新增博客'" size="75%" direction="rtl" destroy-on-close>
            <BlogEditor :visible="showEditor" :blog="currentBlog" :is-edit="isEdit" @close="handleEditorClose"
                @submit="handleEditorSubmit" ref="editorRef" />
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
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Upload } from '@element-plus/icons-vue'
import BlogList from './components/BlogList.vue'
import BlogEditor from './components/BlogEditor.vue'
import BlogViewer from './components/BlogViewer.vue'
import MarkdownUploader from './components/MarkdownUploader.vue'

import type { Blog, BlogFormData } from './types/blog'

// 状态管理
const loading = ref(false)
const showEditor = ref(false)
const showViewer = ref(false)
const showUploader = ref(false)
const isEdit = ref(false)
const searchKeyword = ref('')

const currentBlog = ref<Blog | undefined>()
const editorRef = ref<InstanceType<typeof BlogEditor>>()

// 模拟数据
const blogs = ref<Blog[]>([
    {
        id: 1,
        title: 'Vue3组合式API最佳实践',
        author: '张三',
        tags: ['Vue3', '组合式API', '最佳实践'],
        category: '技术',
        createTime: '2024-01-15 14:30:00',
        status: 'published',
        content: '# Vue3组合式API最佳实践\n\n## 介绍\n\nVue 3 引入了 Composition API，这是一种全新的编写 Vue 组件的方式...\n\n## 核心概念\n\n### 1. setup() 函数\n```javascript\nimport { ref, reactive } from \'vue\'\n\nexport default {\n  setup() {\n    const count = ref(0)\n    const state = reactive({\n      name: \'Vue 3\',\n      version: \'3.x\'\n    })\n\n    return {\n      count,\n      state\n    }\n  }\n}\n```\n\n### 2. 生命周期钩子\n\nComposition API 提供了与 Options API 对应的生命周期钩子...'
    },
    {
        id: 2,
        title: 'TypeScript在前端开发中的应用',
        author: '李四',
        tags: ['TypeScript', '前端开发'],
        category: '技术',
        createTime: '2024-01-14 10:15:00',
        status: 'published',
        content: '# TypeScript在前端开发中的应用\n\n## 什么是TypeScript\n\nTypeScript是JavaScript的超集...'
    },
    {
        id: 3,
        title: '我的2024年度总结',
        author: '王五',
        tags: ['总结', '年度'],
        category: '生活',
        createTime: '2024-01-10 20:00:00',
        status: 'draft',
        content: '# 我的2024年度总结\n\n## 工作方面\n\n2024年对我来说是充实的一年...'
    },
    {
        id: 4,
        title: '2024年1月1日',
        author: '赵六',
        tags: ['总结', '年度'],
        category: '生活',
        createTime: '2024-01-01 00:00:00',
        status: 'published',
        content: '# 2024年1月1日\n\n## 生活方面\n\n2024年1月1日是一个新的开始...'
    }
])

const total = ref(4)

// 计算属性
const filteredBlogs = computed(() => {
    if (!searchKeyword.value) return blogs.value
    const keyword = searchKeyword.value.toLowerCase()
    return blogs.value.filter(blog =>
        blog.title.toLowerCase().includes(keyword)
    )
})

// 事件处理
const handleAddBlog = () => {
    isEdit.value = false
    currentBlog.value = undefined
    showEditor.value = true
}

const handleViewBlog = (blog: Blog) => {
    currentBlog.value = blog
    showViewer.value = true
}

const handleEditBlog = (blog: Blog) => {
    isEdit.value = true
    currentBlog.value = blog
    showEditor.value = true
    showViewer.value = false
}

const handleDeleteBlog = async (blog: Blog) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除博客 "${blog.title}" 吗？`,
            '删除确认',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )

        loading.value = true
        // 模拟删除操作
        setTimeout(() => {
            const index = blogs.value.findIndex(b => b.id === blog.id)
            if (index > -1) {
                blogs.value.splice(index, 1)
                total.value--
                ElMessage.success('删除成功')
            }
            loading.value = false
        }, 500)
    } catch (error) {
        console.log('取消删除')
    }
}

const handlePageChange = (page: number, size: number) => {
    console.log('分页变化:', page, size)
    // 这里可以加载对应页的数据
}

const handleSearch = () => {
    console.log('搜索:', searchKeyword.value)
    // 这里可以调用搜索API
}

const handleEditorClose = () => {
    showEditor.value = false
    currentBlog.value = undefined
}

const handleEditorSubmit = (data: BlogFormData) => {
    loading.value = true

    setTimeout(() => {
        if (isEdit.value && currentBlog.value) {
            // 编辑模式
            const index = blogs.value.findIndex(b => b.id === currentBlog.value!.id)
            if (index > -1) {
                blogs.value[index] = {
                    ...blogs.value[index],
                    ...data,
                    tags: data.tags || []
                }
                ElMessage.success('更新成功')
            }
        } else {
            // 新增模式
            const newBlog: Blog = {
                id: Math.max(...blogs.value.map(b => b.id)) + 1,
                ...data,
                tags: data.tags || [],
                author: '当前用户',
                createTime: new Date().toLocaleString('zh-CN')
            }
            blogs.value.unshift(newBlog)
            total.value++
            ElMessage.success('发布成功')
        }

        loading.value = false
        showEditor.value = false
        currentBlog.value = undefined
    }, 1000)
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
        tags: [],
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