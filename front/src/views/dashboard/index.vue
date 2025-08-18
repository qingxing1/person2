<template>
  <div class="dashboard-container">
    <!-- 顶部统计卡片 -->
    <div class="stats-cards">
      <el-row :gutter="16">
        <el-col :span="6" :sm="12" :xs="24" :lg="6">
          <StatCard 
            icon="View" 
            :number="websiteStats.todayVisits" 
            label="今日访问量" 
          />
        </el-col>
        <el-col :span="6" :sm="12" :xs="24" :lg="6">
          <StatCard 
            icon="Document" 
            :number="websiteStats.totalBlogs" 
            label="博客总数" 
          />
        </el-col>
        <el-col :span="6" :sm="12" :xs="24" :lg="6">
          <StatCard 
            icon="Edit" 
            :number="websiteStats.totalProblems" 
            label="算法题数" 
          />
        </el-col>
        <el-col :span="6" :sm="12" :xs="24" :lg="6">
          <StatCard 
            icon="Clock" 
            :number="pendingTodos.length" 
            label="待办事项" 
          />
        </el-col>
      </el-row>
    </div>

    <!-- 主要内容区域 -->
    <div>
      <el-row :gutter="16">
        <!-- 左侧内容 -->
        <el-col :span="16" :xs="24" :sm="24" :lg="16">
          <!-- 访问量趋势图 -->
          <VisitChart 
            v-model:time-range="visitTimeRange"
            :chart-data="chartData"
            :labels="chartLabels"
            @time-change="handleTimeRangeChange"
          />

          <!-- 最新博客和算法题 -->
          <div class="content-row">
            <el-row :gutter="16">
              <el-col :span="12" :xs="24" :sm="12" :lg="12">
                <ContentList 
                  title="最新博客"
                  :items="recentBlogs"
                  icon="Document"
                  :meta-fields="['date', 'views']"
                  @more-click="goToBlogs"
                />
              </el-col>
              <el-col :span="12" :xs="24" :sm="12" :lg="12">
                <ContentList 
                  title="最新算法题"
                  :items="recentProblems"
                  icon="Edit"
                  :meta-fields="['difficulty', 'date']"
                  @more-click="goToProblems"
                />
              </el-col>
            </el-row>
          </div>
        </el-col>

        <!-- 右侧内容 -->
        <el-col :span="8" :xs="24" :sm="24" :lg="8">
          <!-- 待办事项 -->
          <TodoList 
            :todos="todos"
            @add-todo="showAddTodo = true"
            @update-todo="updateTodoStatus"
            @delete-todo="deleteTodo"
          />

          <!-- 快捷操作 -->
          <QuickActions 
            :actions="quickActions"
            @action-click="handleQuickAction"
          />
        </el-col>
      </el-row>
    </div>

    <!-- 添加待办事项对话框 -->
    <AddTodoDialog 
      v-model="showAddTodo"
      @confirm="addTodo"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import StatCard from './components/StatCard.vue'
import TodoList from './components/TodoList.vue'
import QuickActions from './components/QuickActions.vue'
import ContentList from './components/ContentList.vue'
import VisitChart from './components/VisitChart.vue'
import AddTodoDialog from './components/AddTodoDialog.vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 网站统计数据
const websiteStats = ref({
  todayVisits: 1234,
  visitTrend: 12.5,
  totalBlogs: 156,
  newBlogsToday: 3,
  totalProblems: 89,
  newProblemsToday: 2
})

// 图表数据
const visitTimeRange = ref('7d')
const chartData = ref([820, 932, 901, 934, 1290, 1330, 1320])
const chartLabels = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日'])

// 待办事项
const todos = ref([
  { id: 1, title: '完成个人网站首页优化', completed: false, priority: '高' },
  { id: 2, title: '写一篇关于Vue3的教程', completed: false, priority: '中' },
  { id: 3, title: '解决算法题 LeetCode 第200题', completed: true, priority: '低' },
  { id: 4, title: '更新网站SEO配置', completed: false, priority: '中' }
])

const pendingTodos = computed(() => todos.value.filter(todo => !todo.completed))

// 最新博客
const recentBlogs = ref([
  { id: 1, title: 'Vue3组合式API最佳实践', date: '2024-01-15', views: '234 阅读' },
  { id: 2, title: 'TypeScript在大型项目中的应用', date: '2024-01-14', views: '189 阅读' },
  { id: 3, title: '前端性能优化实战指南', date: '2024-01-13', views: '456 阅读' },
  { id: 4, title: '深入理解JavaScript异步编程', date: '2024-01-12', views: '321 阅读' }
])

// 最新算法题
const recentProblems = ref([
  { id: 1, title: '两数之和', difficulty: '简单', date: '2024-01-15' },
  { id: 2, title: '最长回文子串', difficulty: '中等', date: '2024-01-14' },
  { id: 3, title: '合并K个升序链表', difficulty: '困难', date: '2024-01-13' },
  { id: 4, title: '有效的括号', difficulty: '简单', date: '2024-01-12' }
])

// 快捷操作
const quickActions = ref([
  { key: 'write-blog', label: '写博客', icon: 'EditPen' },
  { key: 'add-problem', label: '添加算法题', icon: 'CirclePlus' },
  { key: 'analytics', label: '数据分析', icon: 'TrendCharts' },
  { key: 'settings', label: '网站设置', icon: 'Setting' }
])

// 添加待办事项
const showAddTodo = ref(false)

const addTodo = (data: { title: string; priority: string }) => {
  todos.value.unshift({
    id: Date.now(),
    title: data.title,
    completed: false,
    priority: data.priority
  })
  ElMessage.success('添加成功')
}

const updateTodoStatus = (todo: any, completed: boolean) => {
  todo.completed = completed
  ElMessage.success(completed ? '任务已完成！' : '已取消完成')
}

const deleteTodo = (id: number) => {
  const index = todos.value.findIndex(todo => todo.id === id)
  if (index > -1) {
    todos.value.splice(index, 1)
    ElMessage.success('删除成功')
  }
}

const handleTimeRangeChange = (value: string) => {
  visitTimeRange.value = value
  // 这里可以根据时间范围更新图表数据
  console.log('时间范围变更:', value)
}

const handleQuickAction = (key: string) => {
  const routes: Record<string, string> = {
    'write-blog': '/boke/write',
    'add-problem': '/method/add',
    'analytics': '/dashboard/analytics',
    'settings': '/system/website'
  }
  
  if (routes[key]) {
    router.push(routes[key])
  }
}

const goToBlogs = () => {
  router.push('/boke')
}

const goToProblems = () => {
  router.push('/method')
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  background-color: var(--el-bg-color-page);
  .stats-cards {
    margin-bottom: 12px;
  }

}

@media only screen and (max-width: 768px) {
  .dashboard-container {
    padding: 16px;
  }
}
</style>
