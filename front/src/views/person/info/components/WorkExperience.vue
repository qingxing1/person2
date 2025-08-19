<template>
  <div class="work-experience">
    <div v-for="(exp, index) in modelValue" :key="index" class="experience-item">
      <el-row :gutter="16" align="middle">
        <el-col :span="10">
          <el-form-item
            :prop="`${propPrefix}.${index}.company`"
            :rules="{ required: true, message: '请输入公司名称', trigger: 'blur' }"
            label-width="0"
          >
            <el-input v-model="exp.company" placeholder="公司名称" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :prop="`${propPrefix}.${index}.position`"
            :rules="{ required: true, message: '请输入职位', trigger: 'blur' }"
            label-width="0"
          >
            <el-input v-model="exp.position" placeholder="职位" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button
            type="danger"
            :icon="Delete"
            circle
            @click="removeExperience(index)"
            :disabled="modelValue.length === 1"
          />
        </el-col>
      </el-row>
    </div>
    <el-button type="primary" :icon="Plus" @click="addExperience" plain>
      添加工作经历
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface Experience {
  company: string
  position: string
}

interface Props {
  modelValue: Experience[]
  propPrefix?: string
}

interface Emits {
  (e: 'update:modelValue', value: Experience[]): void
}

const props = withDefaults(defineProps<Props>(), {
  propPrefix: 'workExperiences'
})

const emit = defineEmits<Emits>()

// 添加工作经历
const addExperience = (): void => {
  const newExp = { company: '', position: '' }
  emit('update:modelValue', [...props.modelValue, newExp])
}

// 删除工作经历
const removeExperience = (index: number): void => {
  if (props.modelValue.length > 1) {
    const updated = props.modelValue.filter((_, i) => i !== index)
    emit('update:modelValue', updated)
  } else {
    ElMessage.warning('至少需要保留一条工作经历')
  }
}
</script>

<style scoped>
.experience-item {
  margin-bottom: 16px;
}

.experience-item:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .experience-item {
    margin-bottom: 12px;
  }
}
</style>