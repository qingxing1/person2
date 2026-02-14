<template>
  <div class="problem-form">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" label-position="top">
      <el-form-item label="题目名称" prop="title">
        <el-input v-model="form.title" placeholder="请输入题目名称" />
      </el-form-item>
      <div class="flex content-center justify-between">
        <el-form-item label="难度" prop="difficulty" class="w-5/11">
          <el-select v-model="form.difficulty" placeholder="请选择难度">
            <el-option label="简单" value="简单" />
            <el-option label="中等" value="中等" />
            <el-option label="困难" value="困难" />
          </el-select>
        </el-form-item>

        <el-form-item label="分类" prop="category" class="w-5/11">
          <el-select v-model="form.category" placeholder="请选择分类">
            <div v-for="item in CATEGORY" :key="item">
              <el-option :label="item" :value="item" />
            </div>
          </el-select>
        </el-form-item>
      </div>

      <el-form-item label="题目描述" prop="description">
        <MdEditor 
          v-model="form.description" 
          :theme="isDark ? 'dark' : 'light'"
          language="zh-CN"
          placeholder="请输入题目描述，支持Markdown语法"
          class="markdown-editor"
        />
      </el-form-item>

      <el-form-item label="解题思路" prop="solution">
        <MdEditor 
          v-model="form.solution" 
          :theme="isDark ? 'dark' : 'light'"
          language="zh-CN"
          placeholder="请输入解题思路，支持Markdown语法"
          class="markdown-editor"
        />
      </el-form-item>

      <el-form-item label="答案" prop="answer">
        <MdEditor 
          v-model="form.answer" 
          :theme="isDark ? 'dark' : 'light'"
          language="zh-CN"
          placeholder="请输入答案或代码，支持Markdown语法"
          class="markdown-editor"
        />
      </el-form-item>
    </el-form>

    <div class="form-actions">
      <el-button @click="$emit('cancel')">取消</el-button>
      <el-button type="primary" @click="submitForm" :loading="loading">
        {{ isEdit ? '更新' : '创建' }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import type { FormInstance, FormRules } from 'element-plus'
import type { Category } from '@/api/method'

interface Problem {
  id?: string
  title: string
  difficulty: '简单' | '中等' | '困难'
  category: string
  description?: string
  solution?: string
  answer?: string
}

interface Props {
  modelValue: Problem
  loading?: boolean
  isEdit?: boolean
  categories?: Category[]
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  isEdit: false,
  categories: () => ['数组', '字符串', '链表', '树', '哈希表', '动态规划', '贪心', '回溯', '排序', '查找']
})

// 分类
const CATEGORY = computed(() => props.categories)
const emit = defineEmits<{
  'update:modelValue': [value: Problem]
  'submit': [data: Problem]
  'cancel': []
}>()

interface FormData {
  id?: string
  title: string
  difficulty: '简单' | '中等' | '困难'
  category: string
  description?: string
  solution?: string
  answer?: string
}

const formRef = ref<FormInstance>()
const form = ref<FormData>()

// 获取主题状态
const isDark = computed(() => {
  return document.documentElement.classList.contains('dark')
})

// 初始化表单数据，只保留需要的字段
const initForm = () => {
  const rest = props.modelValue || {}
  // 只保留需要的字段
  const { id, title, difficulty, category, description, solution, answer } = rest
  form.value = {
    id,
    title: title || '',
    difficulty: difficulty || '中等',
    category: category || '',
    description: description || '',
    solution: solution || '',
    answer: answer || ''
  }
}

// 初始化表单
initForm()

const rules: FormRules = {
  title: [
    { required: true, message: '请输入题目名称', trigger: 'blur' }
  ],
  difficulty: [
    { required: true, message: '请选择难度', trigger: 'change' }
  ],
  category: [
    { required: true, message: '请输入分类', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入题目描述', trigger: 'blur' }
  ]
}

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    form.value = { ...newVal }
  }
}, { deep: true })

const submitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid && form.value) {
      emit('submit', form.value)
    }
  })
}
</script>

<style lang="scss" scoped>
.problem-form {
  padding: 18px;
  background: white;
  border-radius: 16px;
  height: 80vh;
  overflow-y: auto;

  .form-actions {
    text-align: right;
    padding-top: 24px;
    border-top: 1px solid #e2e8f0;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }

  :deep(.el-form-item__label) {
    font-weight: 600;
    color: #2c3e50;
    font-size: 16px;
  }

  :deep(.el-input__wrapper) {
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
  }

  :deep(.el-input__wrapper:hover) {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  :deep(.el-input__wrapper.is-focus) {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  }

  :deep(.el-select .el-input__wrapper) {
    border-radius: 8px;
  }

  :deep(.el-button) {
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
    padding: 12px 24px;
  }

  :deep(.el-button--primary) {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: none;
  }

  :deep(.el-button--primary:hover) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }

  :deep(.el-button--default:hover) {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  .markdown-editor {
    height: 300px;
    
    :deep(.md-editor) {
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    
    :deep(.md-editor-toolbar) {
      border-radius: 8px 8px 0 0;
    }
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    padding: 20px;

    .form-actions {
      flex-direction: column;
      gap: 8px;
    }
  }
}
</style>