<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <v-chart :options="options"></v-chart>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
import { getEchartsData } from '../../network/report/ReportAction'
import 'echarts/lib/chart/line'
export default {
  data () {
    return {
      options: {
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
  created () {
    this.test()
  },
  mounted () {
  },
  methods: {
    test () {
      getEchartsData().then(res => {
        this.options = _.merge(res.data.data, this.options)
        console.log(this.options)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .echarts {
    width: 800px;
    height: 500px;
  }
</style>
