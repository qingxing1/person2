<template>
  <div class="dashboard-container">
    <!-- 顶部统计卡片 -->
    <div class="stats-cards">
      <el-row :gutter="16">
        <el-col :span="6" :sm="12" :xs="24" :lg="6">
          <StatCard 
            :icon="View" 
            :number="websiteStats.todayVisits" 
            label="今日访问量" 
          />
        </el-col>
        <el-col :span="6" :sm="12" :xs="24" :lg="6">
          <StatCard 
            :icon="Document" 
            :number="websiteStats.totalBlogs" 
            label="博客总数" 
          />
        </el-col>
        <el-col :span="6" :sm="12" :xs="24" :lg="6">
          <StatCard 
            :icon="Edit" 
            :number="websiteStats.totalProblems" 
            label="算法题数" 
          />
        </el-col>
        <el-col :span="6" :sm="12" :xs="24" :lg="6">
          <StatCard 
            :icon="Clock" 
            :number="todoStats.total" 
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
                  :icon="Document"
                  :meta-fields="['date', 'views']"
                  @more-click="goToBlogs"
                />
              </el-col>
              <el-col :span="12" :xs="24" :sm="12" :lg="12">
                <ContentList 
                  title="最新算法题"
                  :items="recentProblems"
                  :icon="Edit"
                  :meta-fields="['difficulty', 'date']"
                  @more-click="goToProblems"
                />
              </el-col>
            </el-row>
          </div>
        </el-col>

        <!-- 右侧内容 -->
        <el-col :span="8" :xs="24" :sm="24" :lg="8">
          <!-- 待办统计 -->
          <TodoStats :stats="todoStats" class="mb-4" />
          
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { View, Document, Edit, Clock, EditPen, CirclePlus, TrendCharts, Setting } from '@element-plus/icons-vue'
import StatCard from './components/StatCard.vue'
import TodoList from './components/TodoList.vue'
import TodoStats from './components/TodoStats.vue'
import QuickActions from './components/QuickActions.vue'
import ContentList from './components/ContentList.vue'
import VisitChart from './components/VisitChart.vue'
import AddTodoDialog from './components/AddTodoDialog.vue'
import { ElMessage } from 'element-plus'
import { getAllRecords, addRecord, markAsCompleted, markAsUncompleted, deleteRecord, getStatistics } from '@/api/todolist'
// 获取博客和算法列表
import { getBlogList } from '@/api/boke'
import { getMethodList } from '@/api/method'
// 获取网站今日访问量
import { getTodayVisit,getVisitTrend } from '@/api/visit'

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
const visitTimeRange = ref('week')
const chartData = ref<number[]>([])
const chartLabels = ref<string[]>([])

// 待办事项
const todos = ref<Array<{
  id: number
  title: string
  completed: boolean
  priority: '高' | '中' | '低'
}>>([])

const pendingTodos = computed(() => todos.value.filter(todo => !todo.completed))

// 待办事项统计
const todoStats = ref({
  total: 0,
  completed: 0,
  pending: 0,
  completionRate: 0
})

// 加载待办事项
const loadTodos = async () => {
  try {
    const response:any = await getAllRecords()
    if (response.code === 200) {
      todos.value = response.data.map((item:any) => ({
        id: Number(item.id),
        title: item.title,
        completed: Boolean(item.completed),
        priority: item.priority as '高' | '中' | '低'
      }))
    }
  } catch (error) {
    ElMessage.error('获取待办事项失败')
  }
}

// 加载待办事项统计
const loadTodoStats = async () => {
  try {
    const response:any = await getStatistics()
    if (response.code === 200) {
      todoStats.value = {
        total: response.data.total || 0,
        completed: response.data.completedCount || 0,
        pending: response.data.pendingCount || 0,
        completionRate: response.data.completionRate || 0
      }
    }
  } catch (error) {
    ElMessage.error('获取待办统计失败')
  }
}

// 最新博客
const recentBlogs = ref<Array<{
  id: string
  title: string
  date: string
  views: string
}>>([])

// 最新算法题
const recentProblems = ref<Array<{
  id: string
  title: string
  difficulty: string
  date: string
}>>([])

// 快捷操作
const quickActions = ref([
  { key: 'write-blog', label: '写博客', icon: EditPen },
  { key: 'add-problem', label: '添加算法题', icon: CirclePlus },
  { key: 'analytics', label: '收藏管理', icon: TrendCharts },
  { key: 'settings', label: '信息设置', icon: Setting }
])

// 添加待办事项
const showAddTodo = ref(false)

const addTodo = async (data: { title: string; priority: string }) => {
  try {
    const response:any = await addRecord({
      title: data.title,
      completed: false,
      priority: data.priority as '高' | '中' | '低'
    })
    if (response.code === 200) {
      await loadTodos()
      await loadTodoStats()
      ElMessage.success('添加成功')
    }
  } catch (error) {
    ElMessage.error('添加失败')
  }
}

const updateTodoStatus = async (todo: any, completed: boolean) => {
  try {
    let response:any
    if (completed) {
      response = await markAsCompleted(String(todo.id))
    } else {
      response = await markAsUncompleted(String(todo.id))
    }
    
    if (response.code === 200) {
      await loadTodos()
      await loadTodoStats()
      ElMessage.success(completed ? '任务已完成！' : '已取消完成')
    }
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const deleteTodo = async (id: number) => {
  try {
    const response:any = await deleteRecord(String(id))
    if (response.code === 200) {
      await loadTodos()
      await loadTodoStats()
      ElMessage.success('删除成功')
    }
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

// 加载访问趋势数据
const loadVisitTrend = async () => {
  try {
    const response: any = await getVisitTrend(visitTimeRange.value)
    if (response.code === 200 && response.data?.data) {
      // 按日期排序
      const sortedData = response.data.data.sort((a: any, b: any) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )
      
      // 映射数据到图表格式
      chartData.value = sortedData.map((item: any) => item.count)
      chartLabels.value = sortedData.map((item: any) => item.date)
    }
  } catch (error) {
    ElMessage.error('获取访问趋势数据失败')
  }
}

const handleTimeRangeChange = (value: string) => {
  visitTimeRange.value = value
  loadVisitTrend()
}

const handleQuickAction = (key: string) => {
  const routes: Record<string, string> = {
    'write-blog': '/boke/info',
    'add-problem': '/method/info',
    'analytics': '/person/collect',
    'settings': '/person/info'
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
// 获取博客和算法列表
const loadBlogsAndProblems = async () => {
  try {
    const blogResponse:any = await getBlogList({})
    const methodResponse:any = await getMethodList()
    if (blogResponse.code === 200 && methodResponse.code === 200) {
      websiteStats.value.totalBlogs = blogResponse.data.total
      websiteStats.value.totalProblems = methodResponse.data.length
      
      // 映射博客数据到前端字段
      recentBlogs.value = blogResponse.data.list.slice(0, 4).map((item: any) => ({
        id: String(item.id),
        title: item.title,
        date: item.createTime?.split(' ')[0] || '',
        views: `${item.viewCount || 0} 阅读`
      }))
      
      // 映射算法题数据到前端字段
      recentProblems.value = methodResponse.data.slice(0, 4).map((item: any) => ({
        id: String(item.id),
        title: item.title,
        difficulty: item.difficulty,
        date: item.createdAt?.split('T')[0] || ''
      }))
    }
  } catch (error) {
    ElMessage.error('获取博客和算法列表失败')
  }
}

// 获取今日的访问量
const loadTodayVisit = async () => {
  try {
    const response:any = await getTodayVisit()
    if (response.code === 200) {
      websiteStats.value.todayVisits = response.data.count
    }
  } catch (error) {
    ElMessage.error('获取今日访问量失败')
  }
}

// 生命周期钩子
onMounted(() => {
  loadTodos()
  loadTodoStats()
  loadBlogsAndProblems()
  loadTodayVisit()
  loadVisitTrend()
})
</script>

<style lang="scss" scoped>
.dashboard-container {
  background-color: var(--el-bg-color-page);
  .stats-cards {
    margin-bottom: 12px;
  }

  // 确保栅格布局正确显示
  :deep(.el-row) {
    width: 100%;
  }

  :deep(.el-col) {
    min-width: 0; // 防止flex布局中的收缩问题
  }

  // 图表区域样式
  .content-row {
    margin-top: 16px;
  }
}

@media only screen and (max-width: 768px) {
  .dashboard-container {
    padding: 16px;
  }
}
</style>
