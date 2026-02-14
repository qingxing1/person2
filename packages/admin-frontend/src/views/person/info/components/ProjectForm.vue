<template>
  <el-row :gutter="16">
    <el-col :span="5">
      <el-form-item 
        :prop="`projects.${index}.title`" 
        :rules="[{ required: true, message: '请输入项目名称', trigger: 'blur' }]"
        label-width="0"
      >
        <el-input v-model="item.title" placeholder="项目名称" />
      </el-form-item>
    </el-col>
    <el-col :span="5">
      <el-form-item label-width="0">
        <el-input v-model="item.link" placeholder="项目链接（可选）" />
      </el-form-item>
    </el-col>
    <el-col :span="6">
      <el-form-item label-width="0">
        <TagSelector 
          v-model="item.tech" 
          :available-tags="techOptions" 
          placeholder="技术栈" 
        />
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label-width="0">
        <el-input v-model="item.description" placeholder="项目描述（可选）" />
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TagSelector from './TagSelector.vue'

interface Props {
  item: {
    title: string
    link?: string
    tech: string[]
    description?: string
  }
  index: number
}

defineProps<Props>()

const techOptions = ref([
  'TypeScript', 'React', 'NestJS', 'Node.js', 'MySQL', 'Redis',
  'Next.js', 'Vue 3', 'WebSocket', 'MongoDB', 'Vercel',
  'JavaScript', 'Python', 'Java', 'Go', 'Rust',
  'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', '阿里云',
  'Spring Boot', 'Django', 'Flask', 'Express'
])
</script>