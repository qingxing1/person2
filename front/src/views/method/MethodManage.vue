<template>
  <div class="method-config-container">
    <div class="config-panel">
      <div class="panel-header">
        <h3 class="panel-title">算法分类管理</h3>
        <el-button type="primary" size="small" @click="handleAddCategory">新增分类</el-button>
      </div>
      <el-table :data="categoryList" border style="width: 100%">
        <el-table-column prop="name" label="分类名称" width="180" />
        <el-table-column prop="slug" label="分类标识" width="180" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEditCategory(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDeleteCategory(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="标识" prop="slug">
          <el-input v-model="formData.slug" placeholder="请输入分类标识" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

import {
  getMethodCategoryList,
  updateMethodConfig,
  type Item
} from '@/api/method'

const categoryList = ref<Item[]>([])

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const formData = ref<Partial<Item>>({
  id: '',
  name: '',
  slug: ''
})

const isEditMode = ref(false)

const formRules: FormRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  slug: [{ required: true, message: '请输入分类标识', trigger: 'blur' }]
}

const loadData = async () => {
  try {
    const res:any= await getMethodCategoryList();
    if (res.code === 200) {
      categoryList.value = res.data || []
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
}

const handleAddCategory = () => {
  isEditMode.value = false
  dialogTitle.value = '新增分类'
  formData.value = { id: '', name: '', slug: '' }
  dialogVisible.value = true
}

const handleEditCategory = (row: Item) => {
  isEditMode.value = true
  dialogTitle.value = '编辑分类'
  formData.value = { ...row }
  dialogVisible.value = true
}

const handleDeleteCategory = async (row: Item) => {
  try {
    await ElMessageBox.confirm(`确认删除分类【${row.name}】吗？`, '提示', {
      type: 'warning'
    })
    
    const newCategoryList = categoryList.value.filter(item => item.id !== row.id)
    const data = {
      categories: newCategoryList
    }
    
    const res = await updateMethodConfig(data)
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
      let newCategoryList: Item[]
      
      if (isEditMode.value) {
        newCategoryList = categoryList.value.map(item => 
          item.id === formData.value.id 
            ? { id: item.id, name: formData.value.name!, slug: formData.value.slug! }
            : item
        )
      } else {
        const newCategory: Item = {
          id: Date.now().toString(),
          name: formData.value.name!,
          slug: formData.value.slug!
        }
        newCategoryList = [...categoryList.value, newCategory]
      }
      
      const data = {
        categories: newCategoryList
      }
      
      const res = await updateMethodConfig(data)
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
.method-config-container {
  padding: 20px;
}

.config-panel {
  background: var(--bg-color);
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

:deep(.el-table) {
  .el-table__cell {
    padding: 8px 0;
  }
}
</style>