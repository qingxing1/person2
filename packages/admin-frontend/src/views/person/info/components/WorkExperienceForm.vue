<template>
  <el-row :gutter="16">
    <el-col :span="5">
      <el-form-item 
        :prop="`workExperience.${index}.year`" 
        :rules="[{ required: true, message: '请输入年份', trigger: 'blur' }]"
        label-width="0"
      >
        <el-input v-model="item.year" placeholder="年份，如：2020-2023" />
      </el-form-item>
    </el-col>
    <el-col :span="5">
      <el-form-item 
        :prop="`workExperience.${index}.company`" 
        :rules="[{ required: true, message: '请输入公司名称', trigger: 'blur' }]"
        label-width="0"
      >
        <el-input v-model="item.company" placeholder="公司名称" />
      </el-form-item>
    </el-col>
    <el-col :span="5">
      <el-form-item 
        :prop="`workExperience.${index}.position`" 
        :rules="[{ required: true, message: '请输入职位', trigger: 'blur' }]"
        label-width="0"
      >
        <el-input v-model="item.position" placeholder="职位" />
      </el-form-item>
    </el-col>
    <el-col :span="9">
      <el-form-item label-width="0">
        <el-input v-model="item.description" placeholder="工作描述（可选）" />
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
interface Props {
  item: {
    year: string
    company: string
    position: string
    description?: string
  }
  index: number
}

defineProps<Props>()
</script>