<template>
  <div>
    <a href="https://baidu.com" blank>跳转链接</a>
  </div>
</template>

<script setup>
// 在页面挂载的时候触发路由回退一级
onMounted(() => {
  // 路由跳转到首页
  router.go(-1)
})
</script>

<style>

</style>