<template>
  <div class="chart-card">
    <div class="card-header">
      <h3>网站访问量趋势</h3>
      <el-radio-group :model-value="timeRange" size="small" @change="$emit('time-change', $event)">
        <el-radio-button value="week">7天</el-radio-button>
        <el-radio-button value="month">30天</el-radio-button>
        <el-radio-button value="nine">90天</el-radio-button>
      </el-radio-group>
    </div>
    <Charts :options="chartOptions" height="300px" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  timeRange: string
  chartData: number[]
  labels: string[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'time-change': [value: string]
}>()

const chartOptions = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: props.labels
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '访问量',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 3,
        color: '#409EFF'
      },
      areaStyle: {
        opacity: 0.3,
        color: '#409EFF'
      },
      data: props.chartData
    }
  ]
}))
</script>

<style lang="scss" scoped>
.chart-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }
  }
}
</style>