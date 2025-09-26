<template>
  <div class="echart-container" :class="classes" :id="id" :style="styles"></div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { computed, onBeforeUnmount, onMounted, watch, nextTick, type HTMLAttributes, type PropType } from 'vue'
import { useDebounceFn } from '@vueuse/core'

const props = defineProps({
  width: {
    type: [Number, String],
    default: '100%'
  },
  height: {
    type: [Number, String],
    default: '400px'
  },
  options: {
    type: Object,
    required: true
  },
  classes: {
    type: [String, Object, Array] as PropType<HTMLAttributes>,
    default: ''
  }
})

const id = 'echarts_' + +Date.now() + Math.floor(Math.random() * 10000)

const styles = computed(() => {
  const width = typeof props.width === 'number' ? `${props.width}px` : props.width
  const height = typeof props.height === 'number' ? `${props.height}px` : props.height
  return { height, width }
})
// echarts 实例接收只能使用 普通变量
// 不能使用 vue 实例属性 如
// const chart = ref<echarts.ECharts>()
// chart.value = echarts.init(document.getElementById(id) as HTMLElement)
// 这样会导致 部分 echarts 方法 不可使用，属性不存在等问题
let chart: echarts.ECharts
const initChart = () => {
  if (!props.options) return
  if (!chart) {
    chart = echarts.init(document.getElementById(id) as HTMLElement, undefined, {
      renderer: 'svg',
      useDirtyRect: true
    })
  }
  chart.clear()
  chart.setOption(props.options, false, true)
}

watch(
  () => props.options,
  () => {
    initChart()
  },
  { deep: true }
)

// 响应式
const resize = useDebounceFn(() => {
  chart?.resize()
}, 100)

// 强制重新调整图表大小
const forceResize = () => {
  if (chart) {
    // 强制重新计算容器大小
    const container = document.getElementById(id)
    if (container) {
      const { width, height } = container.getBoundingClientRect()
      chart.resize({ width, height })
    }
  }
}

onMounted(() => {
  // 使用 nextTick 确保 DOM 完全渲染后再初始化
  nextTick(() => {
    const timeout = setTimeout(() => {
      initChart()
      // 初始化后立即调整一次大小
      setTimeout(() => {
        forceResize()
      }, 100)
      
      window.addEventListener('resize', resize)
      clearTimeout(timeout)
    }, 200)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  chart?.dispose()
})
</script>
