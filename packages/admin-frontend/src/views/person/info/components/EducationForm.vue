<template>
  <el-row :gutter="16">
    <el-col :span="6">
      <el-form-item 
        :prop="`educationHistory.${index}.year`" 
        :rules="[{ required: true, message: '请输入年份', trigger: 'blur' }]"
        label-width="0"
      >
        <el-input v-model="item.year" placeholder="年份，如：2017-2020" />
      </el-form-item>
    </el-col>
    <el-col :span="5">
      <el-form-item 
        :prop="`educationHistory.${index}.school`" 
        :rules="[{ required: true, message: '请输入学校', trigger: 'blur' }]"
        label-width="0"
      >
        <el-input v-model="item.school" placeholder="学校名称" />
      </el-form-item>
    </el-col>
    <el-col :span="4">
      <el-form-item 
        :prop="`educationHistory.${index}.major`" 
        :rules="[{ required: true, message: '请输入专业', trigger: 'blur' }]"
        label-width="0"
      >
        <el-input v-model="item.major" placeholder="专业" />
      </el-form-item>
    </el-col>
    <el-col :span="4">
      <el-form-item 
        :prop="`educationHistory.${index}.degree`" 
        :rules="[{ required: true, message: '请输入学历', trigger: 'blur' }]"
        label-width="0"
      >
        <el-input v-model="item.degree" placeholder="学历，如：硕士" />
      </el-form-item>
    </el-col>
    <el-col :span="5">
      <el-form-item label-width="0">
        <el-input v-model="item.description" placeholder="描述（可选）" />
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
interface Props {
  item: {
    year: string
    school: string
    major: string
    degree: string
    description?: string
  }
  index: number
}

defineProps<Props>()
</script>