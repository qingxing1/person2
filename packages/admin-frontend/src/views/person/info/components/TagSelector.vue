<template>
  <el-select
    v-model="selectedTags"
    multiple
    filterable
    allow-create
    default-first-option
    :placeholder="placeholder"
    style="width: 100%"
    @change="handleChange"
  >
    <el-option
      v-for="tag in availableTags"
      :key="tag"
      :label="tag"
      :value="tag"
    />
  </el-select>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string[]
  availableTags: string[]
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请输入或选择标签'
})

const emit = defineEmits<Emits>()

const selectedTags = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleChange = (value: string[]) => {
  emit('update:modelValue', value)
}
</script>

<style scoped>
/* 标签选择器样式 */
</style>