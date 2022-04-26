<template>
  <div class="reportsContainer">
    <!-- 头部面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- echats图表 -->
      <div id="report" style="width: 800px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
// 导入axios
import axios from '@/utils/requestLogin.js'
// 导入lodash
import _ from 'lodash'
// 导入echarts
import * as echarts from 'echarts'
export default {
  data() {
    return {
      reportObj: {},
      // 需要合并的数据
      mergeOptions: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  async mounted() {
    await this.getreportList()
    var myChart = echarts.init(document.getElementById('report'))

    myChart.setOption(this.reportObj)
  },
  methods: {
    async getreportList() {
      const { data: res } = await axios.get('reports/type/1')
      if (res.meta.status !== 200) return this.$message.error('数据统计信息获取失败')
      this.reportObj = _.merge(res.data, this.mergeOptions)
      console.log(this.reportObj)
    }
  }
}
</script>

<style></style>
