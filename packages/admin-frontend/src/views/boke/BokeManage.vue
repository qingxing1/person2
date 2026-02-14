<template>
  <div class="blog-config-container">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-info">
          <h2>
            <el-icon style="color:rgba(64, 158, 255)"><Setting /></el-icon>
            博客配置管理
          </h2>
          <p class="subtitle">统一管理博客分类和标签，提升内容组织效率</p>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <div class="config-panels">
        <!-- 分类管理面板 -->
        <div class="config-panel">
          <div class="panel-header">
            <div class="panel-title-wrapper">
              <el-icon class="panel-icon"><Folder /></el-icon>
              <h3 class="panel-title">博客分类管理</h3>
              <el-tag size="small" type="info" class="panel-count">{{ categoryList.length }}</el-tag>
            </div>
            <el-button type="primary" @click="handleAddCategory">
              <el-icon><Plus /></el-icon>
              新增分类
            </el-button>
          </div>
          <div class="panel-content">
            <el-table
              :data="categoryList"
              style="width: 100%"
              v-loading="loading"
              :header-cell-style="{ background: '#f8f9fa', color: '#606266' }"
            >
              <el-table-column prop="name" label="分类名称" min-width="150">
                <template #default="{ row }">
                  <div class="name-cell">
                    <el-icon class="name-icon"><FolderOpened /></el-icon>
                    <span class="name-text">{{ row.name }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="slug" label="分类标识" min-width="150">
                <template #default="{ row }">
                  <el-tag size="small" type="info" class="slug-tag">{{ row.slug }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180" align="right">
                <template #default="{ row }">
                  <div class="action-buttons">
                    <el-button link type="primary" size="small" @click="handleEditCategory(row)">
                      <el-icon><Edit /></el-icon>
                      编辑
                    </el-button>
                    <el-button link type="danger" size="small" @click="handleDeleteCategory(row)">
                      <el-icon><Delete /></el-icon>
                      删除
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 标签管理面板 -->
        <div class="config-panel">
          <div class="panel-header">
            <div class="panel-title-wrapper">
              <el-icon class="panel-icon"><PriceTag /></el-icon>
              <h3 class="panel-title">博客标签管理</h3>
              <el-tag size="small" type="info" class="panel-count">{{ tagList.length }}</el-tag>
            </div>
            <el-button type="primary" @click="handleAddTag">
              <el-icon><Plus /></el-icon>
              新增标签
            </el-button>
          </div>
          <div class="panel-content">
            <el-table
              :data="tagList"
              style="width: 100%"
              v-loading="loading"
              :header-cell-style="{ background: '#f8f9fa', color: '#606266' }"
            >
              <el-table-column prop="name" label="标签名称" min-width="150">
                <template #default="{ row }">
                  <div class="name-cell">
                    <el-icon class="name-icon"><CollectionTag /></el-icon>
                    <span class="name-text">{{ row.name }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="slug" label="标签标识" min-width="150">
                <template #default="{ row }">
                  <el-tag size="small" type="success" class="slug-tag">{{ row.slug }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180" align="right">
                <template #default="{ row }">
                  <div class="action-buttons">
                    <el-button link type="primary" size="small" @click="handleEditTag(row)">
                      <el-icon><Edit /></el-icon>
                      编辑
                    </el-button>
                    <el-button link type="danger" size="small" @click="handleDeleteTag(row)">
                      <el-icon><Delete /></el-icon>
                      删除
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      :close-on-click-modal="false"
      class="edit-dialog"
    >
      <div class="dialog-content">
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="80px"
          class="edit-form"
        >
          <el-form-item label="名称" prop="name">
            <el-input
              v-model="formData.name"
              placeholder="请输入名称"
              class="form-input"
            />
          </el-form-item>
          <el-form-item label="标识" prop="slug">
            <el-input
              v-model="formData.slug"
              placeholder="请输入标识"
              class="form-input"
            />
            <div class="input-tip">标识将用于URL和查询，建议使用英文或拼音</div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false" class="footer-button">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="handleSubmit"
            class="footer-button primary"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Setting, Folder, FolderOpened, PriceTag, CollectionTag,
  Plus, Edit, Delete
} from '@element-plus/icons-vue'

import {
  getBlogCategoryList,
  getBlogTagList,
  updateBlogConfig,
  type CategoryItem,
  type TagItem,
  type BlogMetadataResponse
} from '@/api/boke'

const categoryList = ref<CategoryItem[]>([])
const tagList = ref<TagItem[]>([])
const loading = ref(false)

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const formData = ref<Partial<CategoryItem & TagItem>>({
  id: '',
  name: '',
  slug: ''
})

const currentEditType = ref<'category' | 'tag'>('category')
const isEditMode = ref(false)

const formRules: FormRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  slug: [{ required: true, message: '请输入标识', trigger: 'blur' }]
}

const loadData = async () => {
  loading.value = true
  try {
    const [categoryRes, tagRes] = await Promise.all([
      getBlogCategoryList(),
      getBlogTagList()
    ])

    if (categoryRes?.code === 200) {
      categoryList.value = categoryRes.data || []
    }

    if (tagRes?.code === 200) {
      tagList.value = tagRes.data || []
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const handleAddCategory = () => {
  currentEditType.value = 'category'
  isEditMode.value = false
  dialogTitle.value = '新增分类'
  formData.value = { id: '', name: '', slug: '' }
  dialogVisible.value = true
}

const handleEditCategory = (row: CategoryItem) => {
  currentEditType.value = 'category'
  isEditMode.value = true
  dialogTitle.value = '编辑分类'
  formData.value = { ...row }
  dialogVisible.value = true
}

const handleDeleteCategory = async (row: CategoryItem) => {
  try {
    await ElMessageBox.confirm(`确认删除分类【${row.name}】吗？`, '提示', {
      type: 'warning'
    })
    
    const newCategoryList = categoryList.value.filter(item => item.id !== row.id)
    const data: BlogMetadataResponse = {
      categories: newCategoryList,
      tags: tagList.value
    }
    
    const res = await updateBlogConfig(data)
    if (res?.code === 200) {
      ElMessage.success('删除成功')
      await loadData()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleAddTag = () => {
  currentEditType.value = 'tag'
  isEditMode.value = false
  dialogTitle.value = '新增标签'
  formData.value = { id: '', name: '', slug: '' }
  dialogVisible.value = true
}

const handleEditTag = (row: TagItem) => {
  currentEditType.value = 'tag'
  isEditMode.value = true
  dialogTitle.value = '编辑标签'
  formData.value = { ...row }
  dialogVisible.value = true
}

const handleDeleteTag = async (row: TagItem) => {
  try {
    await ElMessageBox.confirm(`确认删除标签【${row.name}】吗？`, '提示', {
      type: 'warning'
    })
    
    const newTagList = tagList.value.filter(item => item.id !== row.id)
    const data: BlogMetadataResponse = {
      categories: categoryList.value,
      tags: newTagList
    }
    
    const res = await updateBlogConfig(data)
    if (res?.code === 200) {
      ElMessage.success('删除成功')
      await loadData()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    try {
      let data: BlogMetadataResponse
      
      if (currentEditType.value === 'category') {
        let newCategoryList: CategoryItem[]
        
        if (isEditMode.value) {
          newCategoryList = categoryList.value.map(item => 
            item.id === formData.value.id 
              ? { id: item.id, name: formData.value.name!, slug: formData.value.slug! }
              : item
          )
        } else {
          const newCategory: CategoryItem = {
            id: Date.now().toString(),
            name: formData.value.name!,
            slug: formData.value.slug!
          }
          newCategoryList = [...categoryList.value, newCategory]
        }
        
        data = {
          categories: newCategoryList,
          tags: tagList.value
        }
      } else {
        let newTagList: TagItem[]
        
        if (isEditMode.value) {
          newTagList = tagList.value.map(item => 
            item.id === formData.value.id 
              ? { id: item.id, name: formData.value.name!, slug: formData.value.slug! }
              : item
          )
        } else {
          const newTag: TagItem = {
            id: Date.now().toString(),
            name: formData.value.name!,
            slug: formData.value.slug!
          }
          newTagList = [...tagList.value, newTag]
        }
        
        data = {
          categories: categoryList.value,
          tags: newTagList
        }
      }
      
      const res = await updateBlogConfig(data)
      if (res?.code === 200) {
        ElMessage.success(isEditMode.value ? '更新成功' : '添加成功')
        dialogVisible.value = false
        await loadData()
      }
    } catch (error) {
      ElMessage.error('操作失败')
    }
  })
}

const handleDialogClose = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  formData.value = { id: '', name: '', slug: '' }
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.blog-config-container {
  padding: 10px;
  min-height: 100%;
}

.page-header {
  margin-bottom: 24px;
  padding: 24px;
  // background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: black;
   box-shadow: 0 4px 20px rgba(95, 95, 95, 0.3);

  .header-content {
    .header-info {
      h2 {
        margin: 0 0 8px 0;
        font-size: 24px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 12px;

        .el-icon {
          font-size: 28px;
        }
      }

      .subtitle {
        margin: 0;
        font-size: 14px;
        opacity: 0.9;
      }
    }
  }
}

.content-area {
  .config-panels {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
}

.config-panel {
  background: var(--bg-color);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e4e7ed;

    .panel-title-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;

      .panel-icon {
        font-size: 20px;
        color: #409eff;
      }

      .panel-title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #303133;
      }

      .panel-count {
        margin-left: 8px;
      }
    }

    .el-button {
      border-radius: 6px;
      font-weight: 500;
    }
  }

  .panel-content {
    .name-cell {
      display: flex;
      align-items: center;
      gap: 8px;

      .name-icon {
        font-size: 16px;
        color: #909399;
      }

      .name-text {
        font-weight: 500;
        color: #303133;
      }
    }

    .slug-tag {
      font-family: 'Courier New', monospace;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      justify-content: flex-end;

      .el-button {
        padding: 4px 8px;
        font-size: 13px;

        .el-icon {
          margin-right: 4px;
        }
      }
    }
  }
}

.edit-dialog {
  border-radius: 12px;

  .dialog-content {
    padding: 8px 4px;

    .edit-form {
      .form-input {
        :deep(.el-input__wrapper) {
          border-radius: 6px;
          border: 1px solid #dcdfe6;
          transition: all 0.3s;

          &:hover {
            border-color: #409eff;
          }

          &.is-focus {
            border-color: #409eff;
            box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
          }
        }
      }

      .input-tip {
        margin-top: 4px;
        font-size: 12px;
        color: #909399;
        line-height: 1.4;
      }
    }
  }

  .dialog-footer {
    padding: 16px 0 0;
    border-top: 1px solid #e4e7ed;
    display: flex;
    justify-content: flex-end;
    gap: 12px;

    .footer-button {
      border-radius: 6px;
      font-weight: 500;
      padding: 8px 16px;

      &.primary {
        background: linear-gradient(135deg, #409eff, #66b1ff);
        border: none;
      }
    }
  }
}

:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;

  .el-table__header-wrapper {
    th {
      font-weight: 600;
      color: #606266;
    }
  }

  .el-table__cell {
    padding: 12px 0;
  }

  .el-table__row {
    transition: background-color 0.3s;

    &:hover {
      background-color: #f5f7fa;
    }
  }
}

:deep(.el-loading-mask) {
  border-radius: 8px;
}
</style>