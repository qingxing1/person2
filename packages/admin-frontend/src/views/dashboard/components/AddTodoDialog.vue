<template>
  <el-dialog v-model="visible" title="添加待办事项" width="400px" @close="handleClose">
    <el-form :model="formData" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="formData.title" placeholder="请输入待办事项" />
      </el-form-item>
      <el-form-item label="优先级">
        <el-select v-model="formData.priority" placeholder="请选择优先级">
          <el-option label="高" value="高" />
          <el-option label="中" value="中" />
          <el-option label="低" value="低" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

interface TodoForm {
  title: string
  priority: string
}

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': [data: TodoForm]
}>()

const formData = ref<TodoForm>({
  title: '',
  priority: '中'
})

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const handleClose = () => {
  emit('update:modelValue', false)
  formData.value = { title: '', priority: '中' }
}

const handleConfirm = () => {
  if (!formData.value.title.trim()) {
    ElMessage.warning('请输入待办事项内容')
    return
  }
  
  emit('confirm', { ...formData.value })
  handleClose()
}
</script>