<template>
  <el-config-provider :locale="locale" :button="button">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts" setup>
import { useTheme } from '_hooks'
// 导入正确的中文语言包
import zhCn from 'element-plus/dist/locale/zh-cn.js'
import { ref } from 'vue'
const { initTheme } = useTheme()
initTheme()
/** 将 Element Plus 的语言设置为中文 */
const locale = ref(zhCn)
const button = ref({ autoInsertSpace: true })
</script>
